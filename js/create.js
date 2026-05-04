const form = document.getElementById('create-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('type', document.getElementById('type').value);
  formData.append('synopsis', document.getElementById('synopsis').value);

  const imageInput = document.getElementById('image');
  if (imageInput.files[0]) {
    formData.append('image', imageInput.files[0]);
  }

  const result = await createSeries(formData);

  if (result.id) {
    window.location.href = `detail.html?id=${result.id}`;
  } else {
    alert(result.error || 'Error al crear la serie');
  }
});
