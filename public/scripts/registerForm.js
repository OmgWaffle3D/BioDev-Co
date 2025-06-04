document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registerForm');
  if (!form) return;
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const res = await fetch('/api/register', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if(data.msg) {
      window.location.href = "register-complete.html";
    } else {
      alert(data.error || "Error al registrar");
    }
  });
});