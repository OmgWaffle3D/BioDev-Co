/**
 * Script para la validación de usuarios
 */

// Controla el desplegable del usuario
function toggleDropdown() {
  document.getElementById("userDropdown").classList.toggle("hidden");
}

// Cierra la sesión del usuario
function cerrarSesion() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

// Inicializa la página cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggleIcon = document.getElementById("sidebarToggleIcon");

  sidebarToggle?.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");

    if (sidebar.classList.contains("collapsed")) {
      sidebarToggleIcon.textContent = "chevron_right";
    } else {
      sidebarToggleIcon.textContent = "chevron_left";
    }
  });

  // Botón mobile
  const sidebarToggleMobile = document.getElementById("sidebarToggleMobile");
  sidebarToggleMobile?.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // Cargar usuarios
  cargarUsuariosPendientes();
});

/**
 * Carga los usuarios pendientes de aprobación
 */
async function cargarUsuariosPendientes() {
  try {
    const response = await fetch("/api/usuarios/pendientes", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();

    const container = document.getElementById("usuariosContainer");
    container.innerHTML = "";

    data.data.forEach((usuario) => {
      const userDiv = document.createElement("div");
      userDiv.className =
        "p-6 rounded-xl text-left flex flex-col justify-between space-y-4";
      userDiv.style.backgroundColor = "var(--color-medium)";

      userDiv.innerHTML = `
        <div>
          <h2 class="text-xl font-bold text-green-400 mb-2">${usuario.nombre || 'Sin Nombre'} ${usuario.apellido || ''}</h2>
          <p class="text-gray-300 mb-1">Correo: <span class="text-white">${usuario.correo || ''}</span></p>
          <p class="text-gray-300 mb-1">Organización: <span class="text-white">${usuario.organizacion || '-'}</span></p>
          <p class="text-gray-300 mb-3">Estado actual: <span class="font-bold text-white">${usuario.estado}</span></p>
        </div>
        <div class="flex space-x-4">
          <button
            class="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-bold flex-1"
            onclick="cambiarEstado(${usuario.id}, 'aprobado')"
          >
            Aprobar
          </button>
          <button
            class="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold flex-1"
            onclick="cambiarEstado(${usuario.id}, 'rechazado')"
          >
            Rechazar
          </button>
        </div>
      `;
      container.appendChild(userDiv);
    });
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
  }
}

/**
 * Cambia el estado de un usuario (aprobar o rechazar)
 */
async function cambiarEstado(id, nuevoEstado) {
  try {
    const response = await fetch("/api/usuarios/estado", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ id, nuevoEstado }),
    });
    const result = await response.json();
    alert(result.msg);
    cargarUsuariosPendientes();
  } catch (error) {
    console.error("Error al cambiar estado:", error);
  }
}
