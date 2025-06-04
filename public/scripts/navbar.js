// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del DOM
    const userProfile = document.querySelector('.user-profile');
    const dropdown = document.getElementById('userDropdown');
    const logoutButton = document.querySelector('.user-dropdown-item');

    // Event listener para mostrar/ocultar el menú desplegable
    userProfile.addEventListener('click', function(event) {
        dropdown.classList.toggle('hidden');
        event.stopPropagation();
    });

    // Event listener para el botón de cerrar sesión
    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('token');
        sessionStorage.clear();
        window.location.href = '/pages/login.html';
    });

    // Cerrar el dropdown si se hace clic fuera de él
    document.addEventListener('click', function(event) {
        const isClickInsideProfile = userProfile.contains(event.target);
        if (!isClickInsideProfile && !dropdown.classList.contains('hidden')) {
            dropdown.classList.add('hidden');
        }
    });
});
