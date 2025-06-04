// Add sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector(".toggle-btn")?.addEventListener("click", function() {
        document.getElementById("sidebar").classList.toggle("collapsed");
    });
});
