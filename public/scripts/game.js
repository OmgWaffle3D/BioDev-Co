/**
 * game.js - Maneja la funcionalidad relacionada con el juego
 * Añade el botón de acceso al juego en el menú lateral si el usuario ha iniciado sesión
 */
document.addEventListener("DOMContentLoaded", function () {
  const userId = sessionStorage.getItem("id");

  if (userId) {
    const sidebarMenu = document.querySelector(".menu-items");

    const gameItem = document.createElement("li");
    const gameLink = document.createElement("a");

    gameLink.href = `/game/?user=${userId}`;
    gameLink.textContent = "Juego";
    gameLink.style.display = "block"; // que toda la area de boton se pueda clickear
    gameLink.style.padding = "10px 15px";
    gameLink.style.textDecoration = "none";
    // gameLink.style.color = "white";

    gameItem.appendChild(gameLink);
    sidebarMenu.appendChild(gameItem);
  }
});
