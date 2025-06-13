// Este archivo contiene el código JavaScript para la página de inicio de sesión
const boton = document.getElementById("btn-login");
const username = document.getElementById("username");
const password = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

// Limpiar mensaje de error cuando el usuario comience a escribir
username.addEventListener("input", clearErrorMessage);
password.addEventListener("input", clearErrorMessage);

function clearErrorMessage() {
    errorMessage.classList.add("hidden");
    errorMessage.textContent = "";
}

const login = async () => {
    // validar credenciales
    const credentials = {username:username.value, password: password.value}
    const data = await fetch("/api/login", {
        method:"POST",
        headers:{"content-type":"application/json"}, 
        body: JSON.stringify(credentials)});

    const res = await data.json();
    console.log('Respuesta del servidor:', res); // Agregar esta línea
    
    // Referencia al elemento de mensaje de error
    const errorMessage = document.getElementById("error-message");
    
    // Si el login es correcto
    if (res.isLogin) {
        // Ocultar mensaje de error si estaba visible
        errorMessage.classList.add("hidden");
        
        // Guardar el token JWT
        localStorage.setItem('token', res.token);
        
        // Guardar información del usuario
        sessionStorage.setItem("name", res.user.name);
        sessionStorage.setItem("id", res.user.id);
        sessionStorage.setItem("rol", res.user.rol);
        // Construimos la ruta completa para la imagen de perfil
        const pfpPath = res.user.pfp 
            ? `/api/uploads/${res.user.pfp.split('/').pop()}` 
            : '';
        sessionStorage.setItem("pfp", pfpPath);
        
        // Redireccionar según el rol
        if (res.user.rol === "admin") {
            window.location = "../pages/vistaInformesAdmin.html";
        } else {
            window.location = "../pages/home.html";
        }
    } else {
        // Si el login es incorrecto, mostrar mensaje en la página
        errorMessage.textContent = "Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.";
        errorMessage.classList.remove("hidden");
    }
};


boton.addEventListener("click", login);