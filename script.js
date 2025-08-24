// Theme toggle
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  root.classList.toggle('light', savedTheme === 'light');
}
themeToggle?.addEventListener('click', () => {
  const isLight = root.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Load About content from markdown
async function loadAbout() {
  try {
    const res = await fetch('content/about.md');
    const md = await res.text();
    document.getElementById('aboutContent').innerHTML = renderMarkdown(md);
  } catch (e) {
    document.getElementById('aboutContent').innerHTML = '<p>Welcome! Add your LinkedIn summary to <code>content/about.md</code>.</p>';
  }
}
// Minimal Markdown to HTML (headings + paragraphs + links + lists)
function renderMarkdown(md) {
  const lines = md.split('\n');
  let html = '';
  let inList = false;
  for (const line of lines) {
    if (/^\s*#\s+/.test(line)) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h2>${line.replace(/^\s*#\s+/, '')}</h2>`;
    } else if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${line.replace(/^\s*[-*]\s+/, '')}</li>`;
    } else if (line.trim() === '') {
      if (inList) { html += '</ul>'; inList = false; }
    } else {
      const linked = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>');
      html += `<p>${linked}</p>`;
    }
  }
  if (inList) html += '</ul>';
  return html;
}
loadAbout();

// Projects
let allProjects = [];
async function loadProjects() {
  try {
    const res = await fetch('content/projects.json');
    allProjects = await res.json();
  } catch {
    allProjects = [];
  }
  renderProjects(allProjects);
}
function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '';
  projects.forEach(p => {
    const el = document.createElement('article');
    el.className = 'project';
    el.innerHTML = `
      <img class="thumb" src="${p.image || 'assets/cover-placeholder.jpg'}" alt="${p.title} thumbnail">
      <div class="body">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="tags">${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
      <div class="actions">
        ${p.demo ? `<a class="btn btn-ghost" href="${p.demo}" target="_blank" rel="noreferrer noopener">Live</a>` : ''}
        ${p.source ? `<a class="btn btn-ghost" href="${p.source}" target="_blank" rel="noreferrer noopener">Code</a>` : ''}
      </div>
    `;
    grid.appendChild(el);
  });
}
// Filters
document.getElementById('filterAll')?.addEventListener('click', () => {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip-active'));
  document.getElementById('filterAll').classList.add('chip-active');
  renderProjects(allProjects);
});
document.querySelectorAll('[data-tag]')?.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip-active'));
    btn.classList.add('chip-active');
    const tag = btn.getAttribute('data-tag');
    renderProjects(allProjects.filter(p => p.tags?.includes(tag)));
  });
});
loadProjects();

// Contact form via EmailJS (no email exposed)
/*
  Setup:
  1) Create an EmailJS account: https://www.emailjs.com/
  2) Add an Email Service connected to your inbox.
  3) Create a Template with variables: from_name, reply_to, message.
  4) Get your Public Key, Service ID, and Template ID.
  5) Replace the placeholders below.
*/
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

document.addEventListener('DOMContentLoaded', () => {
  if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
});

const contactForm = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

function setStatus(msg) { statusEl.textContent = msg || ''; }

function validateForm(data) {
  const errors = {};
  if (!data.name || data.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Enter a valid email.';
  if (!data.message || data.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.';
  return errors;
}

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  setStatus('');
  // clear errors
  document.querySelectorAll('.error').forEach(el => el.textContent = '');

  const formData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    message: document.getElementById('message').value.trim(),
  };
  const errors = validateForm(formData);
  Object.entries(errors).forEach(([key, val]) => {
    const el = document.querySelector(`.error[data-for="${key}"]`);
    if (el) el.textContent = val;
  });
  if (Object.keys(errors).length) return;

  if (!window.emailjs || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
    setStatus('Email service not configured yet.');
    alert('To enable sending, edit script.js and set EMAILJS_PUBLIC_KEY/SERVICE_ID/TEMPLATE_ID. See README.');
    return;
  }

  try {
    setStatus('Sending…');
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name: formData.name,
      reply_to: formData.email,
      message: formData.message,
    });
    setStatus('Sent! Thank you.');
    contactForm.reset();
  } catch (err) {
    console.error(err);
    setStatus('Failed to send. Please try again later.');
  }
});
