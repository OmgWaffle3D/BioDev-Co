// Función para mostrar/ocultar el menú desplegable
function toggleDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('hidden');
}

// Cerrar el dropdown si se hace clic fuera de él
document.addEventListener('click', function(event) {
    const userProfile = event.target.closest('.user-profile');
    const dropdown = document.getElementById('userDropdown');
    
    if (!userProfile && !dropdown.classList.contains('hidden')) {
        dropdown.classList.add('hidden');
    }
});

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('token');
    sessionStorage.clear();
    window.location.href = '/pages/login.html';
}
