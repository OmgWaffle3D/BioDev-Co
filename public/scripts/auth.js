// Función para verificar si el usuario está autenticado
function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/pages/login.html';
        return false;
    }
    return true;
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('token');
    window.location.href = '/pages/login.html';
}

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', verificarAutenticacion);
