const login = () => {
    // Obtener los elementos por ID
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    if (email.value === "admin" && password.value === "1234") {
        alert("Bienvenido");
        sessionStorage.name = email.value;
        // Corregir la ruta de redirección
        window.location = "home.html";
    }
    else {
        alert("Usuario o contraseña incorrecta");
    }
};