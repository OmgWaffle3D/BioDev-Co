document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');
  fetch('/api/biomas', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('biomas-table-body');
      tbody.innerHTML = '';
      (data.data || []).forEach(bioma => {
        tbody.innerHTML += `
          <tr class="border-t border-gray-700">
            <td class="px-4 py-2">${bioma.codigo_bioma}</td>
            <td class="px-4 py-2">${bioma.region}</td>
            <td class="px-4 py-2">${new Date(bioma.fecha_inicio).toLocaleDateString()}</td>
            <td class="px-4 py-2">${bioma.fase_actual}</td>
            <td class="px-4 py-2">${bioma.comunidad_vinculada}</td>
            <td class="px-4 py-2">${bioma.indicador_avance}%</td>
            <td class="px-4 py-2">${new Date(bioma.ultima_actividad).toLocaleDateString()}</td>
          </tr>
        `;
      });
    })
    .catch(err => {
      document.getElementById('biomas-table-body').innerHTML =
        `<tr><td colspan="7" class="text-center text-red-400 py-4">Error cargando datos</td></tr>`;
    });
});