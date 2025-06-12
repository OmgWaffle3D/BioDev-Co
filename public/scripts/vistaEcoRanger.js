let usuariosData = [];

document.addEventListener("DOMContentLoaded", async () => {
  // Sidebar scripts
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

  const sidebarToggleMobile = document.getElementById("sidebarToggleMobile");
  sidebarToggleMobile?.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // --- Usuarios dinámicos ---
  const token = localStorage.getItem('token');
  const res = await fetch('/api/usuarios/all', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  const data = await res.json();
  usuariosData = data.data || [];
  renderUsuarios();
});

function renderUsuarios() {
  const tableBody = document.getElementById('usuarios-table-body');
  const emptyState = document.getElementById('empty-state');
  const userCount = document.getElementById('user-count');
  
  // Actualizar contador
  userCount.textContent = usuariosData.length;
  
  if (usuariosData.length > 0) {
    emptyState.classList.add('hidden');
    tableBody.innerHTML = "";

    usuariosData.forEach(user => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-700 transition-colors duration-200';
      
      row.innerHTML = `
        <td class="px-6 py-4">
          <div class="flex flex-col">
            <div class="text-sm font-medium text-white">${user.nombre} ${user.apellido}</div>
            <div class="text-sm text-gray-400">ID: ${user.id}</div>
          </div>
        </td>
        <td class="px-6 py-4">
          <div class="flex flex-col">
            <div class="text-sm text-white">${user.correo}</div>
            <div class="text-sm text-gray-400">${user.telefono || 'Sin teléfono'}</div>
          </div>
        </td>
        <td class="px-6 py-4">
          <div class="flex flex-col">
            <div class="text-sm text-white">${user.ciudad || 'Sin ciudad'}</div>
            <div class="text-sm text-gray-400">${user.provincia || 'Sin provincia'}, ${user.pais || 'Sin país'}</div>
          </div>
        </td>
        <td class="px-6 py-4">
          <div class="text-sm text-white">${user.organizacion || 'Sin organización'}</div>
        </td>
        <td class="px-6 py-4">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(user.rol)}">
            ${user.rol}
          </span>
        </td>
        <td class="px-6 py-4">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(user.estado)}">
            ${user.estado}
          </span>
        </td>
        <td class="px-6 py-4">
          <div class="flex justify-center space-x-2">
            <button class="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-md transition-colors duration-200 edit-btn" 
                    data-id="${user.id}" title="Editar usuario">
              <span class="material-icons text-sm">edit</span>
            </button>
            <button class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors duration-200 delete-btn" 
                    data-id="${user.id}" title="Eliminar usuario">
              <span class="material-icons text-sm">delete</span>
            </button>
          </div>
        </td>
      `;
      
      tableBody.appendChild(row);
    });

    // Asignar eventos a los botones de editar
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('button').getAttribute('data-id');
        openEditModal(id);
      });
    });

    // Asignar eventos a los botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.closest('button').getAttribute('data-id');
        const user = usuariosData.find(u => u.id == id);
        if (confirm(`¿Seguro que deseas eliminar al usuario ${user.nombre} ${user.apellido}?`)) {
          const token = localStorage.getItem('token');
          const res = await fetch(`/api/usuarios/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          if (res.ok) {
            usuariosData = usuariosData.filter(u => u.id != id);
            renderUsuarios();
            alert('Usuario eliminado correctamente');
          } else {
            alert('Error al eliminar usuario');
          }
        }
      });
    });

  } else {
    tableBody.innerHTML = '';
    emptyState.classList.remove('hidden');
  }
}

function getRoleBadgeClass(rol) {
  switch(rol) {
    case 'admin':
      return 'bg-purple-100 text-purple-800';
    case 'usuario':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusBadgeClass(estado) {
  switch(estado) {
    case 'aprobado':
      return 'bg-green-100 text-green-800';
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800';
    case 'rechazado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function openEditModal(id) {
  const user = usuariosData.find(u => u.id == id);
  if (!user) return;
  document.getElementById('edit-id').value = user.id;
  document.getElementById('edit-correo').value = user.correo;
  document.getElementById('edit-telefono').value = user.telefono || '';
  document.getElementById('edit-rol').value = user.rol || 'usuario';
  document.getElementById('edit-pais').value = user.pais || '';
  document.getElementById('edit-provincia').value = user.provincia || '';
  document.getElementById('edit-ciudad').value = user.ciudad || '';
  document.getElementById('edit-organizacion').value = user.organizacion || '';
  document.getElementById('editModal').classList.remove('hidden');
}

document.getElementById('closeModal').onclick = () => {
  document.getElementById('editModal').classList.add('hidden');
};

document.getElementById('editUserForm').onsubmit = async function(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const id = document.getElementById('edit-id').value;
  const body = {
    correo: document.getElementById('edit-correo').value,
    telefono: document.getElementById('edit-telefono').value,
    rol: document.getElementById('edit-rol').value,
    pais: document.getElementById('edit-pais').value,
    provincia: document.getElementById('edit-provincia').value,
    ciudad: document.getElementById('edit-ciudad').value,
    organizacion: document.getElementById('edit-organizacion').value
  };

  const res = await fetch(`/api/usuarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    // Actualiza el usuario en el array local y vuelve a renderizar
    const idx = usuariosData.findIndex(u => u.id == id);
    if (idx !== -1) {
      usuariosData[idx] = { ...usuariosData[idx], ...body };
    }
    renderUsuarios();
    document.getElementById('editModal').classList.add('hidden');
    alert('Usuario actualizado correctamente');
  } else {
    alert('Error al actualizar usuario');
  }
}

// Funciones de utilidad para el dropdown y sesión
function toggleDropdown() {
  document.getElementById("userDropdown").classList.toggle("hidden");
}

function cerrarSesion() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}