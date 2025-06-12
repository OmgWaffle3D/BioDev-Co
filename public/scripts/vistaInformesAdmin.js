/**
 * Script para la vista de informes del administrador
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
document.addEventListener("DOMContentLoaded", async () => {
  const sidebarToggleMobile = document.getElementById("sidebarToggleMobile");
  const sidebar = document.getElementById("sidebar");

  // Controla el sidebar en dispositivos móviles
  sidebarToggleMobile?.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // --- Obtener números dinámicos ---
  await cargarDatos();
});
// Controla el botón de soporte
document.addEventListener('DOMContentLoaded', function () {
    const btnSoporte = document.getElementById('btn-soporte');

    btnSoporte?.addEventListener('click', () => {
        window.location.href = '../pages/soporte.html';
    });
});

// Carga los datos dinámicos desde la API
async function cargarDatos() {
  const token = localStorage.getItem('token');

  // Cargar información de Biomas
  try {
    const resBiomas = await fetch('/api/biomas', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const dataBiomas = await resBiomas.json();
    const biomasCount = dataBiomas.data ? dataBiomas.data.length : 0;
    document.getElementById('biomas-count').textContent = biomasCount;
  } catch {
    document.getElementById('biomas-count').textContent = 0;
  }

  // Cargar información de EcoRangers (usuarios)
  try {
    const resUsuarios = await fetch('/api/usuarios/all', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const dataUsuarios = await resUsuarios.json();
    const ecorangersCount = dataUsuarios.data ? dataUsuarios.data.length : 0;
    document.getElementById('ecorangers-count').textContent = ecorangersCount;
  } catch {
    document.getElementById('ecorangers-count').textContent = 0;
  }
}
