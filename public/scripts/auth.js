// Función para verificar si el usuario está autenticado
async function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/pages/login.html';
        return false;
    }
    
    try {
        // Hacer una petición a una ruta protegida para validar el token
        const response = await fetch('http://localhost:4000/api/usuarios', {
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
