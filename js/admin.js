/* ==========================================================================
   FIREBASE ADMIN CONTROLLER (ES MODULES)
   Handles Authentication, Dashboard Nav, Firestore CRUD operations
   ========================================================================== */

import { getFirebaseConfig, saveFirebaseConfig, clearFirebaseConfig, initFirebase } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, setDoc, query, orderBy, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

let auth = null;
let db = null;
let currentUser = null;
let activeTab = 'overview';

// Cached Data
let cacheProjects = [];
let cacheSkills = [];
let cacheTimeline = [];
let cacheMessages = [];
let cacheProfile = {};

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  setupFirebaseAndAuth();
  setupNavigation();
  setupFormListeners();
  loadSavedFirebaseSettingsUI();
});

function setupFirebaseAndAuth() {
  const firebaseState = initFirebase();
  const authView = document.getElementById('auth-view');
  const adminView = document.getElementById('admin-view');
  const authAlert = document.getElementById('auth-alert');
  const authAlertText = document.getElementById('auth-alert-text');

  if (!firebaseState.initialized) {
    console.warn('Firebase setup warning:', firebaseState.error);
    document.getElementById('stat-firebase-status').innerHTML = `<span class="badge badge-warning">Konfigurasi Belum Diisi</span>`;
    
    // Automatically switch to Firebase Settings if not initialized
    if (authView) authView.style.display = 'flex';
    if (adminView) adminView.style.display = 'none';
    return;
  }

  auth = firebaseState.auth;
  db = firebaseState.db;

  document.getElementById('stat-firebase-status').innerHTML = `<span class="badge badge-success">Terhubung</span>`;

  // Auth State Listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      document.getElementById('user-email-display').textContent = user.email || 'Admin';
      document.getElementById('user-avatar').textContent = (user.email || 'A').charAt(0).toUpperCase();

      authView.style.display = 'none';
      adminView.style.display = 'flex';

      // Load all dynamic data
      refreshAllData();
    } else {
      currentUser = null;
      authView.style.display = 'flex';
      adminView.style.display = 'none';
    }
  });
}

/* ==========================================================================
   NAVIGATION & TABS
   ========================================================================== */
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const pageTitle = document.getElementById('page-title');
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const sidebar = document.getElementById('sidebar');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      if (!targetTab) return;

      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      const activePane = document.getElementById(`tab-${targetTab}`);
      if (activePane) activePane.classList.add('active');

      activeTab = targetTab;
      pageTitle.textContent = item.textContent.trim();

      if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.remove('open');
      }
    });
  });

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Logout button
  document.getElementById('btn-logout').addEventListener('click', async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      showToast('Berhasil keluar dari sesi admin', 'success');
    } catch (err) {
      showToast('Gagal logout: ' + err.message, 'error');
    }
  });

  // Open Firebase Config from Login Page
  document.getElementById('btn-open-firebase-config').addEventListener('click', () => {
    document.getElementById('auth-view').style.display = 'none';
    document.getElementById('admin-view').style.display = 'flex';
    document.querySelector('[data-tab=settings]').click();
  });
}

/* ==========================================================================
   FORM LISTENERS & AUTH LOGIN
   ========================================================================== */
function setupFormListeners() {
  // Login Form
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const alertBox = document.getElementById('auth-alert');
    const alertText = document.getElementById('auth-alert-text');

    if (!auth) {
      alertBox.style.display = 'block';
      alertText.textContent = 'Harap atur konfigurasi Firebase terlebih dahulu!';
      return;
    }

    try {
      const btn = document.getElementById('btn-login-submit');
      btn.disabled = true;
      btn.textContent = 'Memverifikasi...';

      await signInWithEmailAndPassword(auth, email, password);
      alertBox.style.display = 'none';
      showToast('Selamat datang, Admin!', 'success');
    } catch (err) {
      alertBox.style.display = 'block';
      alertText.textContent = 'Gagal Login: ' + (err.message.includes('auth/') ? 'Email atau Password salah!' : err.message);
    } finally {
      const btn = document.getElementById('btn-login-submit');
      btn.disabled = false;
      btn.textContent = 'Masuk ke Dashboard';
    }
  });

  // Firebase Config Form
  const cfgForm = document.getElementById('firebase-config-form');
  cfgForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newConfig = {
      apiKey: document.getElementById('cfg-apiKey').value.trim(),
      authDomain: document.getElementById('cfg-authDomain').value.trim(),
      projectId: document.getElementById('cfg-projectId').value.trim(),
      storageBucket: document.getElementById('cfg-storageBucket').value.trim(),
      messagingSenderId: document.getElementById('cfg-messagingSenderId').value.trim(),
      appId: document.getElementById('cfg-appId').value.trim(),
    };

    saveFirebaseConfig(newConfig);
    showToast('Konfigurasi Firebase berhasil disimpan! Memuat ulang...', 'success');
    setTimeout(() => window.location.reload(), 1200);
  });

  // Reset Firebase Config
  document.getElementById('btn-reset-firebase-config').addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin menghapus konfigurasi Firebase tersimpan?')) {
      clearFirebaseConfig();
      showToast('Konfigurasi berhasil dihapus', 'success');
      setTimeout(() => window.location.reload(), 1000);
    }
  });

  // Add Item Action Buttons
  document.getElementById('btn-add-project').addEventListener('click', () => openModal('project'));
  document.getElementById('btn-add-skill').addEventListener('click', () => openModal('skill'));
  document.getElementById('btn-add-timeline').addEventListener('click', () => openModal('timeline'));

  // Profile Form
  const profileForm = document.getElementById('profile-form');
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!db) return showToast('Firebase belum terhubung!', 'error');

    const typewriterVal = document.getElementById('profile-typewriter').value;
    const typewriterArray = typewriterVal.split(',').map(s => s.trim()).filter(Boolean);

    const profileData = {
      name: document.getElementById('profile-name').value,
      status: document.getElementById('profile-status').value,
      typewriterTitles: typewriterArray,
      bio: document.getElementById('profile-bio').value,
      whatsapp: document.getElementById('profile-wa').value,
      instagram: document.getElementById('profile-instagram').value,
      tiktok: document.getElementById('profile-tiktok').value,
      github: document.getElementById('profile-github').value,
      updatedAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'settings', 'profile'), profileData, { merge: true });
      showToast('Profil berhasil diperbarui!', 'success');
    } catch (err) {
      showToast('Gagal menyimpan profil: ' + err.message, 'error');
    }
  });

  // Modal Dialog Actions
  document.getElementById('btn-modal-close').addEventListener('click', closeModal);
  document.getElementById('btn-modal-cancel').addEventListener('click', closeModal);

  document.getElementById('modal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleModalSubmit();
  });
}

function loadSavedFirebaseSettingsUI() {
  const cfg = getFirebaseConfig();
  if (cfg) {
    document.getElementById('cfg-apiKey').value = cfg.apiKey || '';
    document.getElementById('cfg-authDomain').value = cfg.authDomain || '';
    document.getElementById('cfg-projectId').value = cfg.projectId || '';
    document.getElementById('cfg-storageBucket').value = cfg.storageBucket || '';
    document.getElementById('cfg-messagingSenderId').value = cfg.messagingSenderId || '';
    document.getElementById('cfg-appId').value = cfg.appId || '';
  }
}

/* ==========================================================================
   DATA REFRESH & FETCHING
   ========================================================================== */
async function refreshAllData() {
  if (!db) return;
  await Promise.all([
    fetchProjects(),
    fetchSkills(),
    fetchTimeline(),
    fetchMessages(),
    fetchProfile()
  ]);
}

// 1. PROJECTS
async function fetchProjects() {
  try {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    cacheProjects = [];
    querySnapshot.forEach(doc => cacheProjects.push({ id: doc.id, ...doc.data() }));
    renderProjects();
    document.getElementById('stat-projects-count').textContent = cacheProjects.length;
  } catch (err) {
    console.error('Error fetching projects:', err);
  }
}

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = '';

  if (cacheProjects.length === 0) {
    grid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1;">Belum ada proyek. Klik tombol "Tambah Proyek Baru" untuk menambah.</p>`;
    return;
  }

  cacheProjects.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      ${item.image ? `<img src="${item.image}" alt="${item.title}" class="item-card-img" onerror="this.src='assets/images/project-1.png'">` : ''}
      <h4 class="item-card-title">${escapeHtml(item.title || 'Tanpa Judul')}</h4>
      <p class="item-card-desc">${escapeHtml(item.description || '')}</p>
      <div style="display: flex; gap: 0.35rem; flex-wrap: wrap; margin-bottom: 0.85rem;">
        ${(item.tags || []).map(t => `<span class="badge badge-info">${escapeHtml(t)}</span>`).join('')}
      </div>
      <div class="item-card-actions">
        <button class="btn btn-outline btn-sm btn-edit-proj" data-id="${item.id}">Edit</button>
        <button class="btn btn-danger btn-sm btn-del-proj" data-id="${item.id}">Hapus</button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Attach action listeners
  grid.querySelectorAll('.btn-edit-proj').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.getAttribute('data-id');
      const item = cacheProjects.find(p => p.id === id);
      if (item) openModal('project', item);
    });
  });

  grid.querySelectorAll('.btn-del-proj').forEach(b => {
    b.addEventListener('click', async () => {
      const id = b.getAttribute('data-id');
      if (confirm('Hapus proyek ini?')) {
        await deleteDoc(doc(db, 'projects', id));
        showToast('Proyek berhasil dihapus', 'success');
        fetchProjects();
      }
    });
  });
}

// 2. SKILLS
async function fetchSkills() {
  try {
    const querySnapshot = await getDocs(collection(db, 'skills'));
    cacheSkills = [];
    querySnapshot.forEach(doc => cacheSkills.push({ id: doc.id, ...doc.data() }));
    renderSkills();
    document.getElementById('stat-skills-count').textContent = cacheSkills.length;
  } catch (err) {
    console.error('Error fetching skills:', err);
  }
}

function renderSkills() {
  const grid = document.getElementById('skills-grid');
  grid.innerHTML = '';

  if (cacheSkills.length === 0) {
    grid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1;">Belum ada data skill.</p>`;
    return;
  }

  cacheSkills.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <h4 class="item-card-title">⚡ ${escapeHtml(item.title || '')}</h4>
      <p class="item-card-desc">${escapeHtml(item.description || '')}</p>
      <div class="item-card-actions">
        <button class="btn btn-outline btn-sm btn-edit-skill" data-id="${item.id}">Edit</button>
        <button class="btn btn-danger btn-sm btn-del-skill" data-id="${item.id}">Hapus</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.btn-edit-skill').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.getAttribute('data-id');
      const item = cacheSkills.find(s => s.id === id);
      if (item) openModal('skill', item);
    });
  });

  grid.querySelectorAll('.btn-del-skill').forEach(b => {
    b.addEventListener('click', async () => {
      const id = b.getAttribute('data-id');
      if (confirm('Hapus skill ini?')) {
        await deleteDoc(doc(db, 'skills', id));
        showToast('Skill berhasil dihapus', 'success');
        fetchSkills();
      }
    });
  });
}

// 3. TIMELINE
async function fetchTimeline() {
  try {
    const querySnapshot = await getDocs(collection(db, 'timeline'));
    cacheTimeline = [];
    querySnapshot.forEach(doc => cacheTimeline.push({ id: doc.id, ...doc.data() }));
    renderTimeline();
  } catch (err) {
    console.error('Error fetching timeline:', err);
  }
}

function renderTimeline() {
  const grid = document.getElementById('timeline-grid');
  grid.innerHTML = '';

  if (cacheTimeline.length === 0) {
    grid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1;">Belum ada data timeline.</p>`;
    return;
  }

  cacheTimeline.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <span class="badge badge-warning" style="width: fit-content; margin-bottom: 0.5rem;">${escapeHtml(item.year || '')}</span>
      <h4 class="item-card-title">${escapeHtml(item.title || '')}</h4>
      <p class="item-card-desc">${escapeHtml(item.description || '')}</p>
      <div class="item-card-actions">
        <button class="btn btn-outline btn-sm btn-edit-tm" data-id="${item.id}">Edit</button>
        <button class="btn btn-danger btn-sm btn-del-tm" data-id="${item.id}">Hapus</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.btn-edit-tm').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.getAttribute('data-id');
      const item = cacheTimeline.find(t => t.id === id);
      if (item) openModal('timeline', item);
    });
  });

  grid.querySelectorAll('.btn-del-tm').forEach(b => {
    b.addEventListener('click', async () => {
      const id = b.getAttribute('data-id');
      if (confirm('Hapus item timeline ini?')) {
        await deleteDoc(doc(db, 'timeline', id));
        showToast('Timeline berhasil dihapus', 'success');
        fetchTimeline();
      }
    });
  });
}

// 4. MESSAGES INBOX
async function fetchMessages() {
  try {
    const querySnapshot = await getDocs(collection(db, 'messages'));
    cacheMessages = [];
    querySnapshot.forEach(doc => cacheMessages.push({ id: doc.id, ...doc.data() }));
    
    // Sort descending by timestamp
    cacheMessages.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

    renderMessages();
    renderOverviewMessages();

    const unread = cacheMessages.filter(m => !m.read).length;
    document.getElementById('stat-messages-count').textContent = cacheMessages.length;
    const badge = document.getElementById('unread-count-badge');
    if (unread > 0) {
      badge.style.display = 'inline-flex';
      badge.textContent = unread;
    } else {
      badge.style.display = 'none';
    }
  } catch (err) {
    console.error('Error fetching messages:', err);
  }
}

function renderMessages() {
  const container = document.getElementById('messages-list');
  container.innerHTML = '';

  if (cacheMessages.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">Belum ada pesan dari pengunjung website.</p>`;
    return;
  }

  cacheMessages.forEach(msg => {
    const dateStr = msg.timestamp ? new Date(msg.timestamp.seconds * 1000).toLocaleString('id-ID') : 'Baru saja';
    const item = document.createElement('div');
    item.className = `message-item ${!msg.read ? 'unread' : ''}`;
    item.innerHTML = `
      <div class="message-header">
        <div>
          <span class="message-sender">${escapeHtml(msg.name || 'Pengunjung Anonym')}</span>
          <span class="message-email">&lt;${escapeHtml(msg.email || 'tanpa email')}&gt;</span>
        </div>
        <span class="message-time">${dateStr}</span>
      </div>
      <div class="message-content">${escapeHtml(msg.message || '')}</div>
      <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.75rem;">
        ${!msg.read ? `<button class="btn btn-outline btn-sm btn-read-msg" data-id="${msg.id}">Tandai Dibaca</button>` : ''}
        <button class="btn btn-danger btn-sm btn-del-msg" data-id="${msg.id}">Hapus</button>
      </div>
    `;
    container.appendChild(item);
  });

  container.querySelectorAll('.btn-read-msg').forEach(b => {
    b.addEventListener('click', async () => {
      const id = b.getAttribute('data-id');
      await updateDoc(doc(db, 'messages', id), { read: true });
      showToast('Pesan ditandai sudah dibaca', 'success');
      fetchMessages();
    });
  });

  container.querySelectorAll('.btn-del-msg').forEach(b => {
    b.addEventListener('click', async () => {
      const id = b.getAttribute('data-id');
      if (confirm('Hapus pesan ini?')) {
        await deleteDoc(doc(db, 'messages', id));
        showToast('Pesan berhasil dihapus', 'success');
        fetchMessages();
      }
    });
  });
}

function renderOverviewMessages() {
  const container = document.getElementById('overview-recent-messages');
  container.innerHTML = '';

  const recent = cacheMessages.slice(0, 3);
  if (recent.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">Belum ada pesan masuk.</p>`;
    return;
  }

  recent.forEach(msg => {
    const item = document.createElement('div');
    item.style.padding = '0.75rem 0';
    item.style.borderBottom = '1px solid var(--border-color)';
    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 0.875rem;">
        <span>${escapeHtml(msg.name)} (${escapeHtml(msg.email)})</span>
        <span class="badge ${msg.read ? 'badge-info' : 'badge-warning'}">${msg.read ? 'Dibaca' : 'Baru'}</span>
      </div>
      <p style="font-size: 0.825rem; color: var(--text-muted); margin-top: 0.25rem;">${escapeHtml(msg.message.substring(0, 80))}...</p>
    `;
    container.appendChild(item);
  });
}

// 5. PROFILE
async function fetchProfile() {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'profile'));
    if (docSnap.exists()) {
      cacheProfile = docSnap.data();
      document.getElementById('profile-name').value = cacheProfile.name || '';
      document.getElementById('profile-status').value = cacheProfile.status || '';
      document.getElementById('profile-typewriter').value = (cacheProfile.typewriterTitles || []).join(', ');
      document.getElementById('profile-bio').value = cacheProfile.bio || '';
      document.getElementById('profile-wa').value = cacheProfile.whatsapp || '';
      document.getElementById('profile-instagram').value = cacheProfile.instagram || '';
      document.getElementById('profile-tiktok').value = cacheProfile.tiktok || '';
      document.getElementById('profile-github').value = cacheProfile.github || '';
    }
  } catch (err) {
    console.error('Error fetching profile:', err);
  }
}

/* ==========================================================================
   MODAL CONTROLLER FOR CREATE / EDIT
   ========================================================================== */
let modalType = null;
let currentEditingId = null;

function openModal(type, data = null) {
  modalType = type;
  currentEditingId = data ? data.id : null;
  const modal = document.getElementById('generic-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  body.innerHTML = '';

  if (type === 'project') {
    title.textContent = data ? 'Edit Proyek Portofolio' : 'Tambah Proyek Baru';
    body.innerHTML = `
      <div class="form-group">
        <label class="form-label">Judul Proyek</label>
        <input type="text" id="m-title" class="form-control" value="${escapeHtml(data?.title || '')}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Deskripsi Singkat</label>
        <textarea id="m-desc" class="form-control" required>${escapeHtml(data?.description || '')}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Tags / Kategori (Pisahkan dengan koma)</label>
        <input type="text" id="m-tags" class="form-control" placeholder="Web App, UI/UX, JavaScript" value="${escapeHtml((data?.tags || []).join(', '))}">
      </div>
      <div class="form-group">
        <label class="form-label">URL Gambar Sampul Proyek</label>
        <input type="text" id="m-image" class="form-control" placeholder="assets/images/project-1.png atau https://..." value="${escapeHtml(data?.image || '')}">
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Link Demo (Opsional)</label>
          <input type="url" id="m-demo" class="form-control" placeholder="https://..." value="${escapeHtml(data?.demoUrl || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Link Kode Sumber (Opsional)</label>
          <input type="url" id="m-code" class="form-control" placeholder="https://github.com/..." value="${escapeHtml(data?.codeUrl || '')}">
        </div>
      </div>
    `;
  } else if (type === 'skill') {
    title.textContent = data ? 'Edit Keahlian' : 'Tambah Keahlian Baru';
    body.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nama Skill / Keahlian</label>
        <input type="text" id="m-title" class="form-control" value="${escapeHtml(data?.title || '')}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Deskripsi Skill</label>
        <textarea id="m-desc" class="form-control" required>${escapeHtml(data?.description || '')}</textarea>
      </div>
    `;
  } else if (type === 'timeline') {
    title.textContent = data ? 'Edit Perjalanan Timeline' : 'Tambah Perjalanan Baru';
    body.innerHTML = `
      <div class="form-group">
        <label class="form-label">Tahun / Periode</label>
        <input type="text" id="m-year" class="form-control" placeholder="2026" value="${escapeHtml(data?.year || '')}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Judul Milestone</label>
        <input type="text" id="m-title" class="form-control" value="${escapeHtml(data?.title || '')}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Deskripsi</label>
        <textarea id="m-desc" class="form-control" required>${escapeHtml(data?.description || '')}</textarea>
      </div>
    `;
  }

  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('generic-modal');
  modal.classList.remove('active');
}

async function handleModalSubmit() {
  if (!db) return showToast('Database Firebase belum terhubung!', 'error');

  const btnSubmit = document.getElementById('btn-modal-submit');
  btnSubmit.disabled = true;

  try {
    if (modalType === 'project') {
      const tagsVal = document.getElementById('m-tags').value;
      const tagsArray = tagsVal.split(',').map(t => t.trim()).filter(Boolean);
      const projData = {
        title: document.getElementById('m-title').value,
        description: document.getElementById('m-desc').value,
        tags: tagsArray,
        image: document.getElementById('m-image').value || 'assets/images/project-1.png',
        demoUrl: document.getElementById('m-demo').value || '#',
        codeUrl: document.getElementById('m-code').value || '#',
        updatedAt: serverTimestamp()
      };

      if (currentEditingId) {
        await updateDoc(doc(db, 'projects', currentEditingId), projData);
        showToast('Proyek berhasil diperbarui!', 'success');
      } else {
        projData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'projects'), projData);
        showToast('Proyek baru berhasil ditambahkan!', 'success');
      }
      fetchProjects();
    } else if (modalType === 'skill') {
      const skillData = {
        title: document.getElementById('m-title').value,
        description: document.getElementById('m-desc').value,
        updatedAt: serverTimestamp()
      };

      if (currentEditingId) {
        await updateDoc(doc(db, 'skills', currentEditingId), skillData);
        showToast('Skill berhasil diperbarui!', 'success');
      } else {
        await addDoc(collection(db, 'skills'), skillData);
        showToast('Skill berhasil ditambahkan!', 'success');
      }
      fetchSkills();
    } else if (modalType === 'timeline') {
      const tmData = {
        year: document.getElementById('m-year').value,
        title: document.getElementById('m-title').value,
        description: document.getElementById('m-desc').value,
        updatedAt: serverTimestamp()
      };

      if (currentEditingId) {
        await updateDoc(doc(db, 'timeline', currentEditingId), tmData);
        showToast('Timeline berhasil diperbarui!', 'success');
      } else {
        await addDoc(collection(db, 'timeline'), tmData);
        showToast('Timeline berhasil ditambahkan!', 'success');
      }
      fetchTimeline();
    }

    closeModal();
  } catch (err) {
    showToast('Gagal menyimpan: ' + err.message, 'error');
  } finally {
    btnSubmit.disabled = false;
  }
}

/* ==========================================================================
   UTILITY & TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : '⚠️'}</span>
    <div>${escapeHtml(message)}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
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
