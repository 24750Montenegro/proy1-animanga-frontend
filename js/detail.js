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
  const imageUrl = series.image_url ? `http://localhost:3000${series.image_url}` : '';

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

loadDetail();
