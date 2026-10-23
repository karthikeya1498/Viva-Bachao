const API_BASE = 'http://localhost:5000/api';
const WEB_BASE = 'http://localhost:5173';

document.addEventListener('DOMContentLoaded', async () => {
  const repoInput = document.getElementById('repo-url');
  const detectedBadge = document.getElementById('detected-badge');
  const connectionStatus = document.getElementById('connection-status');
  const statusBox = document.getElementById('status-box');
  const progressBar = document.getElementById('progress-bar');
  const statusMessage = document.getElementById('status-message');
  const analyzeBtn = document.getElementById('analyze-btn');
  const openWebBtn = document.getElementById('open-web-btn');

  let backendAvailable = false;

  // 1. Check Backend Connectivity
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) {
      backendAvailable = true;
      connectionStatus.className = 'status-indicator online';
      connectionStatus.querySelector('.status-text').textContent = 'Engine Ready';
    } else {
      throw new Error();
    }
  } catch {
    connectionStatus.className = 'status-indicator offline';
    connectionStatus.querySelector('.status-text').textContent = 'Server Offline';
  }

  // 2. Detect Current Tab URL
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        const url = tabs[0].url;
        if (url.includes('github.com/')) {
          const match = url.match(/https:\/\/github\.com\/([^/]+)\/([^/?#]+)/);
          if (match) {
            const cleanRepoUrl = `https://github.com/${match[1]}/${match[2]}`;
            repoInput.value = cleanRepoUrl;
            detectedBadge.classList.remove('hidden');
          }
        }
      }
    });
  }

  // Fallback if empty
  if (!repoInput.value) {
    repoInput.value = 'https://github.com/karthikeya1498/Viva-Bachao';
  }

  // 3. Handle Analyze Button Click
  analyzeBtn.addEventListener('click', async () => {
    const targetUrl = repoInput.value.trim();
    if (!targetUrl) return;

    if (!backendAvailable) {
      alert('Viva-Bachao backend is not running on port 5000.\nRun `npm run server` in the project root to start the analyzer.');
      return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyzing Codebase...';
    statusBox.classList.remove('hidden');
    progressBar.style.width = '20%';
    statusMessage.textContent = '1/4 Ingesting repository files & manifests...';

    try {
      setTimeout(() => {
        progressBar.style.width = '45%';
        statusMessage.textContent = '2/4 Parsing AST, routes, models, and dependencies...';
      }, 600);

      setTimeout(() => {
        progressBar.style.width = '75%';
        statusMessage.textContent = '3/4 Generating 6 whiteboard workflows and 15-chapter docs...';
      }, 1200);

      const response = await fetch(`${API_BASE}/projects/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: targetUrl })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Analysis failed');
      }

      const data = await response.json();
      progressBar.style.width = '100%';
      statusMessage.textContent = `✓ Done! ${data.project.name} ready for viva defense.`;
      analyzeBtn.textContent = '✓ Analysis Completed';

      // Auto open web app after 800ms
      setTimeout(() => {
        openWebApp(data.project.id);
      }, 800);
    } catch (err) {
      progressBar.style.width = '100%';
      progressBar.style.backgroundColor = 'var(--pencil-red)';
      statusMessage.textContent = `Error: ${err.message}`;
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = '⚡ Retry Analysis';
    }
  });

  // 4. Open Web App
  openWebBtn.addEventListener('click', () => {
    openWebApp();
  });

  function openWebApp(projectId) {
    const url = projectId ? `${WEB_BASE}/?project=${projectId}` : WEB_BASE;
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank');
    }
  }
});
