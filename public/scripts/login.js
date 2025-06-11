// Este archivo contiene el código JavaScript para la página de inicio de sesión
const boton = document.getElementById("btn-login");
const username = document.getElementById("username");
const password = document.getElementById("password");

const  login =  async () => {
    // validar credenciales
    const credentials = {username:username.value, password: password.value}
    const data = await fetch("http://localhost:4000/api/login", {
        method:"POST",
        headers:{"content-type":"application/json"}, 
        body: JSON.stringify(credentials)});

    const res = await data.json();
    console.log('Respuesta del servidor:', res); // Agregar esta línea
    // Si el login es correcto
    if (res.isLogin) {
        // Guardar el token JWT
        localStorage.setItem('token', res.token);
        
        // Guardar información del usuario
        sessionStorage.setItem("name", res.user.name);
        sessionStorage.setItem("id", res.user.id);
        sessionStorage.setItem("rol", res.user.rol);
        sessionStorage.setItem("pfp", `/api${res.user.pfp}`);
        
        // Redireccionar según el rol
        if (res.user.rol === "admin") {
            window.location = "../pages/vistaInformesAdmin.html";
        } else {
            window.location = "../pages/home.html";
        }
    } else {
        // Si el login es incorrecto
        alert("Credenciales incorrectas");
    }
};


boton.addEventListener("click", login);