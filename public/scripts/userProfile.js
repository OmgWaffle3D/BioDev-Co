// Archivo para manejar la carga del perfil de usuario
document.addEventListener("DOMContentLoaded", function () {
  const userName = sessionStorage.getItem("name");
  const userAvatar = sessionStorage.getItem("pfp");

  const userNameElement = document.getElementById("userName");
  const userAvatarElement = document.getElementById("userAvatar");

  if (userName && userNameElement) {
    userNameElement.textContent = `¡Hola! ${userName}`;
  }

  if (userAvatar && userAvatarElement) {
   userAvatarElement.src = userAvatar;
  }
});