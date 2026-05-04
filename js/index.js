const grid = document.getElementById('series-grid');
const filterButtons = document.querySelectorAll('.filters button');

let currentFilter = '';

function renderCard(series) {
  const card = document.createElement('div');
  card.className = 'series-card';
  card.onclick = () => window.location.href = `detail.html?id=${series.id}`;

  const avgRating = Number(series.avg_rating).toFixed(1);
  const imageUrl = series.image_url ? `http://localhost:3000${series.image_url}` : '';

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

async function loadSeries(type) {
  grid.innerHTML = 'Cargando...';
  const data = await fetchSeries(type || undefined);
  grid.innerHTML = '';

  if (data.length === 0) {
    grid.innerHTML = '<p>No se encontraron series.</p>';
    return;
  }

  data.forEach(s => grid.appendChild(renderCard(s)));
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    loadSeries(currentFilter);
  });
});

loadSeries();
