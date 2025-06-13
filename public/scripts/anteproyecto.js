document.addEventListener("DOMContentLoaded", async () => {

  ////////////////////////////////////////// Modal /////////
  const createBtn = document.getElementById("crearAP");
  const modal = document.getElementById("submitUI");
  const modalTitulo = document.getElementById("modalTitulo");
  const modalDescripcion = document.getElementById("modalDescripcion");
  const submitModalBtn = document.getElementById("submitBtn");
  const cancelModalBtn = document.getElementById("cancelBtn");
  const convocatoriaInput = document.getElementById("convocatoriaInput");

  createBtn.addEventListener("click", () => {
    if (!convocatoriaInput.value.trim()) {
      alert("Selecciona una convocatoria válida antes de crear un anteproyecto.");
      return;
    }

    modalTitulo.value = "";
    modalDescripcion.value = "";
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });

  cancelModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  submitModalBtn.addEventListener("click", async () => {
    const titulo = modalTitulo.value.trim();
    const descripcion = modalDescripcion.value.trim();
    const convocatoria = convocatoriaInput.value.trim();

    if (!titulo || !descripcion) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      const res = await fetch("/api/anteproyectos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          convocatoria_nombre: convocatoria,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Anteproyecto creado exitosamente.");
        modal.classList.add("hidden");
        modal.classList.remove("flex")
      } else {
        alert("Error al crear anteproyecto: " + data.msg);
      }
    } catch (err) {
      console.error("Error al crear anteproyecto:", err);
      alert("Ocurrió un error inesperado.");
    } 
  });
  //////////////////////////////////////////////////////////
const datalist = document.getElementById("convocatorias");
const input = document.getElementById("convocatoriaInput");
const searchBtn = document.getElementById("arrow");
const resultsContainerAbiertos = document.getElementById("anteproyectoList");
const resultsContainerCerrados = document.getElementById("anteproyectoListCerrados");
const tabAbiertos = document.getElementById("tabAbiertos");
const tabCerrados = document.getElementById("tabCerrados");

let convocatoriasMap = new Map();

// Load convocatorias
try {
  const res = await fetch("/api/convocatorias");
  const data = await res.json();

  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.nombre;
    datalist.appendChild(option);
    convocatoriasMap.set(item.nombre, {
      id: item.id_convocatoria,
      fecha_limite: item.fecha_limite // this should be in a format parsable by new Date()
    });
  });
} catch (err) {
  console.error("Error loading convocatorias:", err);
}

// Search button
searchBtn.addEventListener("click", async () => {
  const selectedName = input.value.trim();
  const convocatoriaData = convocatoriasMap.get(selectedName);

  if (!convocatoriaData) {
    alert("Convocatoria no válida.");
    return;
  }

  try {
    const res = await fetch("/api/anteproyectosuser");
    const anteproyectos = await res.json();

    const now = new Date();
    const limitDate = new Date(convocatoriaData.fecha_limite); // important: ensure this is valid

    const filtered = anteproyectos.data.filter(
      ap => ap.id_convocatoria === convocatoriaData.id
    );

    // Clear both containers first
    resultsContainerAbiertos.innerHTML = "";
    resultsContainerCerrados.innerHTML = "";

      const abiertos = [];
      const cerrados = [];

      filtered.forEach(ap => {
        const apDate = new Date(ap.fecha);
        if (apDate < now) {
          cerrados.push(ap);
        } else {
          abiertos.push(ap);
        }
      });

      // Mostrar resultados
      resultsContainerAbiertos.innerHTML = "";
      resultsContainerCerrados.innerHTML = "";

      displayAnteproyectos(abiertos, resultsContainerAbiertos);
      displayAnteproyectos(cerrados, resultsContainerCerrados);

      // Mostrar pestaña abiertos por defecto si hay abiertos
      if (abiertos.length > 0) {
        showTab("abiertos");
      } else {
        showTab("cerrados");
}

  } catch (err) {
    console.error("Error loading anteproyectos:", err);
  }
});

function displayAnteproyectos(items, container) {
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = '<p class="text-white">No se encontraron anteproyectos.</p>';
    return;
  }

  items.forEach((ap) => {
    const card = document.createElement("div");
    card.className = "p-4 rounded flex justify-between items-center";
    card.style.backgroundColor = "#2c7434";

    card.innerHTML = `
      <div>
        <h2 class="font-semibold text-white text-lg">${ap.titulo}</h2>
        <p class="text-sm text-gray-300">${ap.descripcion}</p>
      </div>
      <div class="text-green-500 text-2xl">
        <span class="material-icons">chevron_right</span>
      </div>
    `;

    container.appendChild(card);
  });
}

// Tab UI toggle
function showTab(tab) {
  const active = ["border-b-2", "border-green-500", "text-green-400"];
  const inactive = ["text-gray-400"];

  if (tab === "abiertos") {
    resultsContainerAbiertos.classList.remove("hidden");
    resultsContainerCerrados.classList.add("hidden");

    tabAbiertos.classList.add(...active);
    tabAbiertos.classList.remove(...inactive);
    tabCerrados.classList.remove(...active);
    tabCerrados.classList.add(...inactive);
  } else {
    resultsContainerAbiertos.classList.add("hidden");
    resultsContainerCerrados.classList.remove("hidden");

    tabCerrados.classList.add(...active);
    tabCerrados.classList.remove(...inactive);
    tabAbiertos.classList.remove(...active);
    tabAbiertos.classList.add(...inactive);
  }
}

// Manual tab switching (UI only)
tabAbiertos.addEventListener("click", () => showTab("abiertos"));
tabCerrados.addEventListener("click", () => showTab("cerrados"));
});
