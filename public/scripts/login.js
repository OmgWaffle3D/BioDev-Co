const login = () => {
    if (username.value === "admin" && password.value === "1234") {
        alert("Bienvenido");
        sessionStorage.name = username.value;
        window.location = "./pages/profile.html";
    }
    else {
        alert("Usuario o contraseña incorrecta");
    }
    
    
};