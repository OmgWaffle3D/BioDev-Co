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
  const dashboard = document.getElementById('usuarios-dashboard');
  dashboard.innerHTML = "";

  if (usuariosData.length > 0) {
    usuariosData.forEach(user => {
      dashboard.innerHTML += `
        <div class="bg-green-700 text-white rounded-lg p-4 flex flex-col md:flex-row items-center justify-between shadow-lg mb-4">
          <div class="flex items-center gap-4">
            <img
              src="${user.foto_perfil ? user.foto_perfil : 'https://randomuser.me/api/portraits/men/32.jpg'}"
              alt="EcoRanger"
              class="w-24 h-24 rounded-md object-cover"
            />
            <div class="text-sm space-y-1">
              <p><strong>Nombre:</strong> ${user.nombre}</p>
              <p><strong>Apellido:</strong> ${user.apellido}</p>
              <p><strong>Correo:</strong> ${user.correo}</p>
              <p><strong>Teléfono:</strong> ${user.telefono || ''}</p>
              <p><strong>País:</strong> ${user.pais || ''}</p>
              <p><strong>Provincia:</strong> ${user.provincia || ''}</p>
              <p><strong>Ciudad:</strong> ${user.ciudad || ''}</p>
              <p><strong>Organización:</strong> ${user.organizacion || ''}</p>
              <p><strong>Descripción:</strong> ${user.descripcion || ''}</p>
              <p><strong>Rol:</strong> ${user.rol}</p>
              <p><strong>Estado:</strong> ${user.estado}</p>
              <button class="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-1 px-4 rounded edit-btn" data-id="${user.id}">Editar</button>
              <button class="mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded delete-btn" data-id="${user.id}">Eliminar</button>
            </div>
          </div>
        </div>
      `;
    });

    // Asignar eventos a los botones de editar
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        openEditModal(id);
      });
    });

    // Asignar eventos a los botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        if (confirm('¿Seguro que deseas eliminar este usuario?')) {
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
    dashboard.innerHTML = `<p class="text-gray-400">No hay usuarios registrados.</p>`;
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
  document.getElementById('edit-descripcion').value = user.descripcion || '';
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
    organizacion: document.getElementById('edit-organizacion').value,
    descripcion: document.getElementById('edit-descripcion').value
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