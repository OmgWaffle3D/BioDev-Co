// Este archivo contiene el código JavaScript para la página de inicio de sesión
const boton = document.getElementById("btn-login");
const username = document.getElementById("username");
const password = document.getElementById("password");

const  login =  async () => {
    // validar credenciales
    const credentials = {username:username.value, password: password.value}
    const data = await fetch("http://localhost:5001/login", {
        method:"POST",
        headers:{"content-type":"application/json"}, 
        body: JSON.stringify(credentials)});

    const res = await data.json();
    //console.log(username.value + " " + password.value);
    // Si el login es correcto
    if (res.isLogin) {
        sessionStorage.setItem("name", res.user.name);
        sessionStorage.setItem("id", res.user.id);
        window.location = "./pages/profile.html";
    }else {
        // Si el login es incorrecto
    alert("Credenciales incorrectas");

    }
   
    
    

    
};


boton.addEventListener("click", login);