document.addEventListener("DOMContentLoaded", async () => {
  const datalist = document.getElementById("convocatorias");
  const input = document.getElementById("convocatoriaInput");
  const searchBtn = document.getElementById("arrow");
  const resultsContainer = document.getElementById("anteproyectoList");

  let convocatoriasMap = new Map(); // nombre → id_convocatoria

  // Load convocatorias into datalist
  try {
    const res = await fetch("/api/convocatorias");
    const data = await res.json();

    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.nombre;
      datalist.appendChild(option);
      convocatoriasMap.set(item.nombre, item.id_convocatoria);
    });
  } catch (err) {
    console.error("Error loading convocatorias:", err);
  }

  // Click on arrow button
  searchBtn.addEventListener("click", async () => { 
    
  
    const selectedName = input.value.trim();
    const convocatoriaId = convocatoriasMap.get(selectedName);
    console.log(selectedName,convocatoriaId);

    
    if (!convocatoriaId) {
      alert("Convocatoria no válida.");
      return;
    }

    try {
      const res = await fetch("/api/anteproyectosuser");
      const anteproyectos = await res.json();

      

      const filtered = anteproyectos.data.filter(
        ap => ap.id_convocatoria === convocatoriaId
      );

      card = filtered;
      displayAnteproyectos(card);
    } catch (err) {
      console.error("Error loading anteproyectos:", err);
    }
  });

  function displayAnteproyectos(items) {
    resultsContainer.innerHTML = ""; // Clear previous results

    if (items.length === 0) {
      resultsContainer.innerHTML =
        '<p class="text-white">No se encontraron anteproyectos.</p>';
      return;
    }

    items.forEach((ap) => {
      const card = document.createElement("div");
      card.className =
        "p-4 rounded flex justify-between items-center bg-gray-700";

      card.innerHTML = `
        <div>
          <h2 class="font-semibold text-white text-lg">${ap.titulo}</h2>
          <p class="text-sm text-gray-300">${ap.descripcion}</p>
        </div>
        <div class="text-green-500 text-2xl">
          <span class="material-icons">chevron_right</span>
        </div>
      `;

      resultsContainer.appendChild(card);
    });
  }
});
