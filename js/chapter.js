const params = new URLSearchParams(window.location.search);
const chapterId = params.get('id');
const container = document.getElementById('chapter-container');

async function loadChapter() {
  if (!chapterId) {
    container.innerHTML = '<p>Capitulo no encontrado.</p>';
    return;
  }

  const chapter = await fetchChapter(chapterId);

  if (chapter.error) {
    container.innerHTML = `<p>${chapter.error}</p>`;
    return;
  }

  container.innerHTML = `
    <h2 class="page-title">Capitulo ${chapter.number}${chapter.title ? ' - ' + chapter.title : ''}</h2>
    <p><a href="detail.html?id=${chapter.series_id}">Volver a la serie</a></p>
  `;

  renderComments(chapter.comments || []);
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

document.getElementById('comment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const author = document.getElementById('comment-author').value;
  const content = document.getElementById('comment-content').value;

  await createCommentForChapter(chapterId, { author, content });
  location.reload();
});

loadChapter();
