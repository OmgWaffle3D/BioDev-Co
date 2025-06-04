// Función para verificar si el usuario está autenticado
async function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/pages/login.html';
        return false;
    }
    
    // Verificar si estamos en una página de admin
    const isAdminPage = window.location.pathname.includes('vistaInformesAdmin') || 
                       window.location.pathname.includes('vistaEcoRanger');
    
    // Obtener el rol del usuario
    const userRole = sessionStorage.getItem('rol');
    
    // Si es página de admin y el usuario no es admin, redirigir a home
    if (isAdminPage && userRole !== 'admin') {
        window.location.href = '/pages/home.html';
        return false;
    }
    
    try {
        // Hacer una petición a una ruta protegida para validar el token
        const response = await fetch('http://localhost:4000/api/biomas', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Si el token no es válido, limpiar localStorage y redirigir
            localStorage.removeItem('token');
            window.location.href = '/pages/login.html';
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        localStorage.removeItem('token');
        window.location.href = '/pages/login.html';
        return false;
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('token');
    window.location.href = '/pages/login.html';
}

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', verificarAutenticacion);
