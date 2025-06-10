// Archivo para manejar la carga del perfil de usuario
document.addEventListener("DOMContentLoaded", function () {
  const userName = sessionStorage.getItem("name");
  const userNameElement = document.getElementById("userName");

  if (userName && userNameElement) {
    userNameElement.textContent = `¡Hola! ${userName}`;
  }
});
