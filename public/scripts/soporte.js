document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM cargado correctamente."); // para verificar que el JS sí carga

    const submitButton = document.getElementById('submit-btn');

    submitButton.addEventListener('click', function (e) {
        e.preventDefault(); // para que no haga submit por defecto
        console.log("Botón clickeado."); // para verificar que el click funciona

        const nombreField = document.getElementById('nombre');
        const correoField = document.getElementById('correo');
        const asuntoField = document.getElementById('asunto');
        const descripcionField = document.getElementById('descripcion');

        // Validación — mostrar solo un error a la vez
        if (!nombreField.value.trim()) {
            nombreField.setCustomValidity('Por favor completa este campo.');
            nombreField.reportValidity();
            return;
        } else {
            nombreField.setCustomValidity('');
        }

        if (!correoField.value.trim()) {
            correoField.setCustomValidity('Por favor completa este campo.');
            correoField.reportValidity();
            return;
        } else {
            correoField.setCustomValidity('');
        }

        if (!asuntoField.value.trim()) {
            asuntoField.setCustomValidity('Por favor completa este campo.');
            asuntoField.reportValidity();
            return;
        } else {
            asuntoField.setCustomValidity('');
        }

        if (!descripcionField.value.trim()) {
            descripcionField.setCustomValidity('Por favor completa este campo.');
            descripcionField.reportValidity();
            return;
        } else {
            descripcionField.setCustomValidity('');
        }

        // Si todo válido → enviar
        console.log('Datos enviados:', {
            nombre: nombreField.value.trim(),
            correo: correoField.value.trim(),
            asunto: asuntoField.value.trim(),
            descripcion: descripcionField.value.trim()
        });

        // Redirigir a vistaInformesAdmin.html
        window.location.href = 'vistaInformesAdmin.html';
    });
});
