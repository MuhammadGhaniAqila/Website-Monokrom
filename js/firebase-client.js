/* ==========================================================================
   FIREBASE PUBLIC CLIENT INTEGRATION
   Loads dynamic portfolio content from Firestore & handles Contact Form submissions
   ========================================================================== */

import { initFirebase } from './firebase-config.js';
import { collection, getDocs, getDoc, doc, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async () => {
  const firebaseState = initFirebase();

  // If Firebase is configured and connected, bind dynamic content and contact form
  if (firebaseState.initialized) {
    const db = firebaseState.db;

    // 1. Dynamic Contact Form Handler
    setupContactForm(db);

    // 2. Load dynamic content from Firestore
    try {
      await Promise.all([
        loadDynamicProjects(db),
        loadDynamicSkills(db),
        loadDynamicTimeline(db),
        loadDynamicProfile(db)
      ]);
    } catch (err) {
      console.log('Firebase client dynamic load note:', err);
    }
  } else {
    // If Firebase isn't configured, fallback gracefully to existing static HTML
    console.log('Firebase not configured. Running with static HTML fallback content.');
    setupContactFormFallback();
  }
});

/**
 * Handles Contact Form Submissions directly to Firestore
 */
function setupContactForm(db) {
  const contactForm = document.getElementById('contact-form');
  const alertContainer = document.getElementById('contact-alert');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnSubmit = contactForm.querySelector('button[type="submit"]');
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !message) return;

    try {
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `Mengirim Pesan...`;
      }

      await addDoc(collection(db, 'messages'), {
        name,
        email,
        message,
        read: false,
        timestamp: serverTimestamp()
      });

      if (alertContainer) {
        alertContainer.style.display = 'block';
        alertContainer.className = 'contact-alert-box alert-success';
        alertContainer.innerHTML = `✓ Terima kasih ${escapeHtml(name)}! Pesan Anda telah terkirim ke Admin.`;
      }

      contactForm.reset();
    } catch (err) {
      console.error('Error submitting message:', err);
      if (alertContainer) {
        alertContainer.style.display = 'block';
        alertContainer.className = 'contact-alert-box alert-error';
        alertContainer.innerHTML = `⚠️ Gagal mengirim pesan: ${err.message}`;
      }
    } finally {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `
          Kirim Pesan
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        `;
      }
    }
  });
}

function setupContactFormFallback() {
  const contactForm = document.getElementById('contact-form');
  const alertContainer = document.getElementById('contact-alert');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (alertContainer) {
      alertContainer.style.display = 'block';
      alertContainer.className = 'contact-alert-box alert-info';
      alertContainer.innerHTML = `ℹ️ Pesan disimulasikan. Konfigurasikan Firebase di <a href="admin.html" style="text-decoration: underline;">Admin Panel</a> untuk mengaktifkan inbox live!`;
    }
    contactForm.reset();
  });
}

/**
 * Loads Projects from Firestore & updates HTML DOM
 */
async function loadDynamicProjects(db) {
  const querySnapshot = await getDocs(collection(db, 'projects'));
  if (querySnapshot.empty) return;

  const projectsGrid = document.querySelector('#proyek .projects-grid');
  if (!projectsGrid) return;

  projectsGrid.innerHTML = '';
  querySnapshot.forEach((docSnap, index) => {
    const p = docSnap.data();
    const card = document.createElement('div');
    card.className = `project-card reveal visible delay-${(index % 2) + 1}`;
    card.innerHTML = `
      <div class="project-thumb">
        <img src="${escapeHtml(p.image || 'assets/images/project-1.png')}" alt="${escapeHtml(p.title)}" class="project-thumb-img" onerror="this.src='assets/images/project-1.png'">
      </div>
      <div class="project-body">
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-desc">${escapeHtml(p.description)}</p>
        <div class="project-tags">
          ${(p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="project-actions">
          <a href="${escapeHtml(p.demoUrl || '#')}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">Lihat Demo</a>
          <a href="${escapeHtml(p.codeUrl || '#')}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">Kode Sumber</a>
        </div>
      </div>
    `;
    projectsGrid.appendChild(card);
  });
}

/**
 * Loads Skills from Firestore
 */
async function loadDynamicSkills(db) {
  const querySnapshot = await getDocs(collection(db, 'skills'));
  if (querySnapshot.empty) return;

  const skillsGrid = document.querySelector('#profil .skills-grid');
  if (!skillsGrid) return;

  skillsGrid.innerHTML = '';
  querySnapshot.forEach((docSnap, index) => {
    const s = docSnap.data();
    const card = document.createElement('div');
    card.className = `skill-card reveal visible delay-${(index % 2) + 1}`;
    card.innerHTML = `
      <div class="skill-icon-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>
      <h4 class="skill-title">${escapeHtml(s.title)}</h4>
      <p class="skill-desc">${escapeHtml(s.description)}</p>
    `;
    skillsGrid.appendChild(card);
  });
}

/**
 * Loads Timeline from Firestore
 */
async function loadDynamicTimeline(db) {
  const querySnapshot = await getDocs(collection(db, 'timeline'));
  if (querySnapshot.empty) return;

  const timelineContainer = document.querySelector('#perjalanan .journey-timeline-wrapper');
  if (!timelineContainer) return;

  // Clear existing items but keep center line
  timelineContainer.innerHTML = `<div class="journey-center-line"></div>`;

  querySnapshot.forEach((docSnap, index) => {
    const t = docSnap.data();
    const item = document.createElement('div');
    item.className = `journey-item reveal visible delay-${(index % 2) + 1}`;
    item.innerHTML = `
      <div class="journey-dot"></div>
      <div class="journey-card">
        <span class="journey-year">${escapeHtml(t.year)}</span>
        <h3 class="journey-title">${escapeHtml(t.title)}</h3>
        <p class="journey-desc">${escapeHtml(t.description)}</p>
      </div>
    `;
    timelineContainer.appendChild(item);
  });
}

/**
 * Loads Profile Data from Firestore
 */
async function loadDynamicProfile(db) {
  const docSnap = await getDoc(doc(db, 'settings', 'profile'));
  if (!docSnap.exists()) return;

  const data = docSnap.data();

  if (data.bio) {
    const bioElement = document.querySelector('.hero-description');
    if (bioElement) bioElement.textContent = data.bio;
  }

  if (data.whatsapp) {
    document.querySelectorAll('a[href*="wa.me"]').forEach(a => a.href = data.whatsapp);
  }

  if (data.instagram) {
    document.querySelectorAll('a[href*="instagram.com"]').forEach(a => a.href = data.instagram);
  }

  if (data.tiktok) {
    document.querySelectorAll('a[href*="tiktok.com"]').forEach(a => a.href = data.tiktok);
  }

  if (data.github) {
    document.querySelectorAll('a[href*="github.com"]').forEach(a => a.href = data.github);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
