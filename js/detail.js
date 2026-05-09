const params = new URLSearchParams(window.location.search);
const seriesId = params.get('id');
const container = document.getElementById('detail-container');

async function loadDetail() {
  if (!seriesId) {
    container.innerHTML = '<p>Serie no encontrada.</p>';
    return;
  }

  const series = await fetchSeriesById(seriesId);

  if (series.error) {
    container.innerHTML = `<p>${series.error}</p>`;
    return;
  }

  const avgRating = Number(series.avg_rating).toFixed(1);
  const imageUrl = series.image_url ? `${API_BASE}${series.image_url}` : '';

  container.innerHTML = `
    <div class="series-detail">
      <div>
        ${imageUrl ? `<img src="${imageUrl}" alt="${series.title}">` : '<div class="no-image">?</div>'}
      </div>
      <div class="series-info">
        <h2>${series.title}</h2>
        <span class="type-badge ${series.type}">${series.type}</span>
        <div class="rating-display">${avgRating} / 10 (${series.total_ratings} votos)</div>
        <p class="synopsis">${series.synopsis || 'Sin sinopsis.'}</p>
      </div>
    </div>
  `;

  document.getElementById('edit-title').value = series.title || '';
  document.getElementById('edit-synopsis').value = series.synopsis || '';
  document.getElementById('edit-toolbar').style.display = 'flex';

  renderChapters(series.chapters || []);
  renderComments(series.comments || []);
}

function renderChapters(chapters) {
  const list = document.getElementById('chapters-list');
  if (chapters.length === 0) {
    list.innerHTML += '<p>No hay capitulos.</p>';
    return;
  }

  chapters.forEach(ch => {
    const item = document.createElement('div');
    item.className = 'chapter-item';
    item.innerHTML = `
      <a href="chapter.html?id=${ch.id}">Cap. ${ch.number}${ch.title ? ' - ' + ch.title : ''}</a>
    `;
    list.appendChild(item);
  });
}

function renderComments(comments) {
  const list = document.getElementById('comments-list');
  if (comments.length === 0) {
    list.innerHTML = '<p>No hay comentarios.</p>';
    return;
  }

  comments.forEach(c => {
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
      <span class="comment-author">${c.author}</span>
      <span class="comment-date">${new Date(c.created_at).toLocaleString()}</span>
      <p class="comment-content">${c.content}</p>
    `;
    list.appendChild(div);
  });
}

// Rating
document.getElementById('rate-btn').addEventListener('click', async () => {
  const score = document.getElementById('rating-select').value;
  if (!score) return;

  await rateSeries(seriesId, Number(score));
  location.reload();
});

// Agregar capitulo
document.getElementById('chapter-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const number = document.getElementById('chapter-number').value;
  const title = document.getElementById('chapter-title').value;

  await createChapter(seriesId, { number: Number(number), title: title || undefined });
  location.reload();
});

// Agregar comentario a la serie
document.getElementById('comment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const author = document.getElementById('comment-author').value;
  const content = document.getElementById('comment-content').value;

  await createCommentForSeries(seriesId, { author, content });
  location.reload();
});

// Toggle edicion
const editSection = document.getElementById('edit-section');
document.getElementById('toggle-edit-btn').addEventListener('click', () => {
  editSection.classList.toggle('hidden');
});
document.getElementById('cancel-edit-btn').addEventListener('click', () => {
  editSection.classList.add('hidden');
});

// Guardar edicion
document.getElementById('edit-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('edit-title').value);
  formData.append('synopsis', document.getElementById('edit-synopsis').value);

  const imageInput = document.getElementById('edit-image');
  if (imageInput.files[0]) {
    formData.append('image', imageInput.files[0]);
  }

  const result = await updateSeries(seriesId, formData);

  if (result.id) {
    location.reload();
  } else {
    alert(result.error || 'Error al actualizar la serie');
  }
});

loadDetail();
