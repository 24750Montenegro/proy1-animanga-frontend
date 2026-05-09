const grid = document.getElementById('series-grid');

// Determina el tipo segun la pagina actual
const page = window.location.pathname.split('/').pop();
const type = page.includes('animes') ? 'anime' : 'manga';

function renderCard(series) {
  const card = document.createElement('div');
  card.className = 'series-card';
  card.onclick = () => window.location.href = `detail.html?id=${series.id}`;

  const avgRating = Number(series.avg_rating).toFixed(1);
  const imageUrl = series.image_url ? `${API_BASE}${series.image_url}` : '';

  card.innerHTML = `
    ${imageUrl ? `<img src="${imageUrl}" alt="${series.title}">` : '<div class="no-image">?</div>'}
    <div class="card-body">
      <h3>${series.title}</h3>
      <span class="type-badge ${series.type}">${series.type}</span>
      <div class="rating-display">${avgRating} / 10 (${series.total_ratings} votos)</div>
    </div>
  `;

  return card;
}

async function load() {
  grid.innerHTML = 'Cargando...';
  const data = await fetchSeries(type);
  grid.innerHTML = '';

  if (data.length === 0) {
    grid.innerHTML = '<p>No se encontraron series.</p>';
    return;
  }

  data.forEach(s => grid.appendChild(renderCard(s)));
}

document.getElementById('export-csv-btn').addEventListener('click', () => {
  window.location.href = getCsvExportUrl(type);
});

load();
