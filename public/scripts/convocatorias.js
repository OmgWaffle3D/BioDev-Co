

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

  const datos = {
    nombre, region, organizacion, pais, descripcion, sitio_web, fecha
  };

  try {
    const response = await fetch("/api/convocatorias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json" // sin espacio
      },
      body: JSON.stringify(datos)
    });

    const data = await response.json(); // solo si el backend devuelve JSON
    console.log("Respuesta:", data);

  } catch (error) {
    console.error("Error:", error);
  }
}
