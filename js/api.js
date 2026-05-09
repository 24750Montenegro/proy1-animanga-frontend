const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:3000'
  : 'https://proy1-animanga-backend.onrender.com';
const API_URL = `${API_BASE}/api`;

async function safeJson(res) {
  try {
    const data = await res.json();
    if (!res.ok && !data.error) data.error = `Error ${res.status}`;
    return data;
  } catch {
    return { error: `Error ${res.status}` };
  }
}

async function fetchSeries(type) {
  const url = type ? `${API_URL}/series?type=${type}` : `${API_URL}/series`;
  const res = await fetch(url);
  return res.json();
}

async function fetchSeriesById(id) {
  const res = await fetch(`${API_URL}/series/${id}`);
  return res.json();
}

async function createSeries(formData) {
  const res = await fetch(`${API_URL}/series`, {
    method: 'POST',
    body: formData,
  });
  return safeJson(res);
}

async function updateSeries(id, formData) {
  const res = await fetch(`${API_URL}/series/${id}`, {
    method: 'PUT',
    body: formData,
  });
  return safeJson(res);
}

async function deleteSeries(id) {
  const res = await fetch(`${API_URL}/series/${id}`, { method: 'DELETE' });
  return res.json();
}

async function createChapter(seriesId, data) {
  const res = await fetch(`${API_URL}/chapters/series/${seriesId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function fetchChapter(id) {
  const res = await fetch(`${API_URL}/chapters/${id}`);
  return res.json();
}

async function createCommentForSeries(seriesId, data) {
  const res = await fetch(`${API_URL}/comments/series/${seriesId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function createCommentForChapter(chapterId, data) {
  const res = await fetch(`${API_URL}/comments/chapter/${chapterId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function rateSeries(seriesId, score) {
  const res = await fetch(`${API_URL}/ratings/series/${seriesId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score }),
  });
  return res.json();
}

function getCsvExportUrl(type) {
  return type ? `${API_URL}/series/exportcsv?type=${type}` : `${API_URL}/series/exportcsv`;
}
