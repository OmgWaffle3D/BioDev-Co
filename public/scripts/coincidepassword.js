function validarFormulario() {
  // Detecta los campos de contraseña según el contexto
  const pass1 = document.getElementById("pass1") || document.getElementById("new-password");
  const pass2 = document.getElementById("pass2") || document.getElementById("confirm-password");

  if (!pass1 || !pass2) {
    console.error("No se encontraron campos de contraseña");
    return false;
  }

  const val1 = pass1.value;
  const val2 = pass2.value;

  if (val1 !== val2) {
    alert("Las contraseñas no coinciden");
    return false;
  }

  // Decodifica el pathname por si hay caracteres como "ñ"
  const currentPage = decodeURIComponent(window.location.pathname);

  if (currentPage.includes("register.html")) {
    window.location.href = "agregarimagen.html";
  } else if (currentPage.includes("recuperarcontraseña2.html")) {
    window.location.href = "olvidecontraseña.html";
  }

  return false; // evita el envío clásico del formulario
}
