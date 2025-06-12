

document.addEventListener('DOMContentLoaded', () => {
  const botonUpload = document.getElementById('botonUpload');

  if (botonUpload) {
    botonUpload.addEventListener('click', () => {
      console.log("clicked");
      postDB();
    });
  }
});

async function postDB() {
  let nombre = document.getElementById("nombre").value;
  let sitio_web = document.getElementById("sitio").value;
  let organizacion = document.getElementById("org").value;
  let region = document.getElementById("region").value;
  let pais = document.getElementById("pais").value;
  let descripcion = document.getElementById("desc").value;
  let fecha = document.getElementById("fecha").value;

  // Validación básica
  if (!nombre || !fecha || !sitio_web || !organizacion || !region || !pais || !descripcion) {
    alert("Por favor completa todos los campos");
    return;
  }

  const datos = {
    nombre, region, organizacion, pais, descripcion, sitio_web, fecha
  };

  // Mostrar loading en el botón
  const botonUpload = document.getElementById('botonUpload');
  const originalText = botonUpload.innerHTML;
  botonUpload.innerHTML = '<span class="material-icons mr-2">cached</span>Subiendo...';
  botonUpload.disabled = true;
  botonUpload.style.backgroundColor = "#4A90E2"; // Cambiar a color azul durante la carga
  
  try {
    const response = await fetch("/api/convocatorias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    const data = await response.json();
    console.log("Respuesta:", data);
    
    if (response.ok) {
      // Mostrar éxito en el botón
      botonUpload.innerHTML = '<span class="material-icons mr-2">check_circle</span>¡Guardado!';
      botonUpload.style.backgroundColor = "#7DAE5B"; // Color verde para éxito
      
      // Limpiar el formulario
      resetForm();
      
      // Restaurar el botón después de un tiempo
      setTimeout(() => {
        botonUpload.innerHTML = originalText;
        botonUpload.disabled = false;
        botonUpload.style.backgroundColor = ""; // Restaurar color original
      }, 2000);
    } else {
      // Mostrar error en el botón
      botonUpload.innerHTML = '<span class="material-icons mr-2">error</span>Error';
      botonUpload.style.backgroundColor = "#FF6B6B"; // Color rojo para error
      
      // Restaurar el botón después de un tiempo
      setTimeout(() => {
        botonUpload.innerHTML = originalText;
        botonUpload.disabled = false;
        botonUpload.style.backgroundColor = ""; // Restaurar color original
      }, 2000);
    }

  } catch (error) {
    console.error("Error:", error);
    
    // Mostrar error en el botón
    botonUpload.innerHTML = '<span class="material-icons mr-2">error</span>Error de conexión';
    botonUpload.style.backgroundColor = "#FF6B6B"; // Color rojo para error
    
    // Restaurar el botón después de un tiempo
    setTimeout(() => {
      botonUpload.innerHTML = originalText;
      botonUpload.disabled = false;
      botonUpload.style.backgroundColor = ""; // Restaurar color original
    }, 2000);
  }
}

// Función para resetear el formulario
function resetForm() {
  document.getElementById("nombre").value = '';
  document.getElementById("sitio").value = '';
  document.getElementById("org").value = '';
  document.getElementById("region").value = '';
  document.getElementById("pais").value = '';
  document.getElementById("desc").value = '';
  document.getElementById("fecha").value = '';
}
