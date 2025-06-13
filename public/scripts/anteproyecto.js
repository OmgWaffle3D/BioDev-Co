document.addEventListener("DOMContentLoaded", async () => {

  ////////////////////////////////////////// Modal /////////
  const createBtn = document.getElementById("crearAP");
  const modal = document.getElementById("submitUI");
  const modalTitulo = document.getElementById("modalTitulo");
  const modalDescripcion = document.getElementById("modalDescripcion");
  const submitModalBtn = document.getElementById("submitBtn");
  const cancelModalBtn = document.getElementById("cancelBtn");
  const convocatoriaInput = document.getElementById("convocatoriaInput");

  // Función para mostrar notificaciones más simples
  function showSearchNotification(message, type) {
    const notification = document.getElementById("searchNotification");
    notification.textContent = message;
    notification.className = `text-sm mt-1 ${type === 'error' ? 'text-red-500' : type === 'success' ? 'text-green-500' : 'text-blue-500'}`;
    notification.classList.remove("hidden");
    
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 3000);
  }
  
  // Función para mostrar notificaciones simples en el modal
  function showModalNotification(message, type) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `text-sm mb-2 ${type === 'error' ? 'text-red-500' : type === 'success' ? 'text-green-500' : 'text-blue-500'}`;
    notification.classList.remove("hidden");
    
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 3000);
  }
  
  createBtn.addEventListener("click", () => {
    if (!convocatoriaInput.value.trim()) {
      showSearchNotification("Selecciona una convocatoria válida antes de crear un anteproyecto.", "error");
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
      showModalNotification("Por favor completa todos los campos.", "error");
      return;
    }

    // Modificar el botón para mostrar estado de carga
    const originalText = submitModalBtn.innerHTML;
    submitModalBtn.innerHTML = '<span class="material-icons">cached</span> Procesando...';
    submitModalBtn.disabled = true;

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
        // Mostrar estado de éxito en el botón
        submitModalBtn.innerHTML = '<span class="material-icons">check</span>';
        submitModalBtn.style.backgroundColor = "#4CAF50";
        
        // Agregar el nuevo anteproyecto a la lista en tiempo real
        // Como la API solo devuelve el ID, debemos crear el objeto con los datos del formulario
        const newAnteproyecto = {
          id: data.id, // ID devuelto por la API
          titulo: titulo,
          descripcion: descripcion,
          id_convocatoria: convocatoriasMap.get(convocatoria).id
        };
        
        const convocatoriaData = convocatoriasMap.get(convocatoria);
        const now = new Date();
        const limitDate = new Date(convocatoriaData.fecha_limite);
        
        // Crear el elemento card para el nuevo anteproyecto
        const newCard = document.createElement("div");
        newCard.className = "p-4 rounded flex justify-between items-center";
        newCard.style.backgroundColor = "#2c7434";
        newCard.innerHTML = `
          <div>
            <h2 class="font-semibold text-white text-lg">${newAnteproyecto.titulo}</h2>
            <p class="text-sm text-gray-300">${newAnteproyecto.descripcion}</p>
          </div>
          <div class="text-green-500 text-2xl">
            <span class="material-icons">chevron_right</span>
          </div>
        `;
        
        // Agregar a la lista correspondiente según fecha límite
        if (limitDate < now) {
          // Convocatoria cerrada
          resultsContainerCerrados.innerHTML = resultsContainerCerrados.innerHTML === '' || 
            resultsContainerCerrados.innerHTML === '<p class="text-gray-400 text-sm">No se encontraron anteproyectos</p>' ? 
            '' : resultsContainerCerrados.innerHTML;
          resultsContainerCerrados.prepend(newCard);
          showTab("cerrados");
        } else {
          // Convocatoria abierta
          resultsContainerAbiertos.innerHTML = resultsContainerAbiertos.innerHTML === '' || 
            resultsContainerAbiertos.innerHTML === '<p class="text-gray-400 text-sm">No se encontraron anteproyectos</p>' ? 
            '' : resultsContainerAbiertos.innerHTML;
          resultsContainerAbiertos.prepend(newCard);
          showTab("abiertos");
        }
        
        // Mostrar notificación de éxito
        showSearchNotification("Anteproyecto creado exitosamente", "success");
        
        // Ocultar modal después de un tiempo
        setTimeout(() => {
          modal.classList.add("hidden");
          modal.classList.remove("flex");
          
          // Restaurar el botón
          submitModalBtn.innerHTML = originalText;
          submitModalBtn.disabled = false;
          submitModalBtn.style.backgroundColor = "";
        }, 2000);
      } else {
        showModalNotification(data.msg || "Error al crear anteproyecto", "error");
        submitModalBtn.innerHTML = originalText;
        submitModalBtn.disabled = false;
      }
    } catch (err) {
      console.error("Error al crear anteproyecto:", err);
      
      // Mensaje de error más informativo
      let errorMessage = "Error de conexión con el servidor. ";
      
      // Si el servidor está caído o hay un problema de red
      if (!navigator.onLine) {
        errorMessage += "Verifica tu conexión a internet.";
      } else {
        errorMessage += "Intenta de nuevo más tarde.";
      }
      
      showModalNotification(errorMessage, "error");
      submitModalBtn.innerHTML = originalText;
      submitModalBtn.disabled = false;
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
    showSearchNotification("Convocatoria no válida.", "error");
    return;
  }

  // Mostrar estado de carga en el botón
  const originalSearchBtnContent = searchBtn.innerHTML;
  searchBtn.innerHTML = '<span class="material-icons">sync</span>';
  searchBtn.disabled = true;

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

    if (limitDate < now) {
      // Expired convocatoria: show in cerrados
      displayAnteproyectos(filtered, resultsContainerCerrados);
      showTab("cerrados");
      showSearchNotification(`${filtered.length} anteproyecto(s) encontrado(s)`, "success");
    } else {
      // Still open: show in abiertos
      displayAnteproyectos(filtered, resultsContainerAbiertos);
      showTab("abiertos");
      showSearchNotification(`${filtered.length} anteproyecto(s) encontrado(s)`, "success");
    }

  } catch (err) {
    console.error("Error loading anteproyectos:", err);
    showSearchNotification("Error al cargar anteproyectos", "error");
  } finally {
    // Restaurar el botón
    searchBtn.innerHTML = originalSearchBtnContent;
    searchBtn.disabled = false;
  }
});

function displayAnteproyectos(items, container) {
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-sm">No se encontraron anteproyectos</p>';
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
