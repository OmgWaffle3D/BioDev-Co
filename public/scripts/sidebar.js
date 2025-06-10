document.addEventListener('DOMContentLoaded', function() {
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

    // Botón de mobile (menú hamburguesa)
    const sidebarToggleMobile = document.getElementById("sidebarToggleMobile");
    sidebarToggleMobile?.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });
});
