/* ==========================================================================
   PORTFOLIO WEBSITE - THEME CONTROLLER (DARK / LIGHT MODE)
   Handles theme detection, local storage persistence, anti-FOUC, and toggling
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'portfolio_theme';

  /**
   * Mengambil tema awal dari localStorage atau preferensi sistem pengguna.
   * @returns {'dark' | 'light'}
   */
  function getInitialTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Mengubah tema dokumen dan memperbarui state UI.
   * @param {'dark' | 'light'} theme
   * @param {boolean} [save=true]
   */
  function setTheme(theme, save = true) {
    const validTheme = (theme === 'light') ? 'light' : 'dark';
    
    // Set attribute data-theme pada elemen html (<html>)
    document.documentElement.setAttribute('data-theme', validTheme);
    
    // Perbarui meta tag color-scheme jika ada
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaColorScheme) {
      metaColorScheme.setAttribute('content', validTheme);
    }
    
    // Simpan ke localStorage jika diminta
    if (save) {
      localStorage.setItem(STORAGE_KEY, validTheme);
    }
    
    // Update status tombol toggle di seluruh DOM
    updateToggleButtons(validTheme);
  }

  /**
   * Memperbarui atribut aria dan status visual pada semua tombol toggle tema.
   * @param {'dark' | 'light'} theme
   */
  function updateToggleButtons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn, #theme-toggle-btn');
    toggleBtns.forEach(btn => {
      const isDark = (theme === 'dark');
      btn.setAttribute('aria-label', isDark ? 'Beralih ke Mode Terang (White Mode)' : 'Beralih ke Mode Gelap (Dark Mode)');
      btn.setAttribute('title', isDark ? 'Mode Terang' : 'Mode Gelap');
      btn.setAttribute('data-active-theme', theme);
    });
  }

  /**
   * Mengganti antara Dark Mode dan Light Mode.
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    setTheme(nextTheme, true);
  }

  // Terapkan tema awal secepat mungkin (eksekusi langsung)
  const initialTheme = getInitialTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);

  // Expose API ke window object jika dibutuhkan secara global
  window.ThemeController = {
    getTheme: () => document.documentElement.getAttribute('data-theme') || 'dark',
    setTheme: setTheme,
    toggleTheme: toggleTheme
  };

  // Inisialisasi event listener setelah DOM siap
  document.addEventListener('DOMContentLoaded', () => {
    // Sinkronkan tema saat DOM siap
    const currentTheme = document.documentElement.getAttribute('data-theme') || initialTheme;
    setTheme(currentTheme, false);

    // Pasang listener pada tombol toggle
    document.addEventListener('click', (event) => {
      const toggleBtn = event.target.closest('.theme-toggle-btn, #theme-toggle-btn');
      if (toggleBtn) {
        event.preventDefault();
        toggleTheme();
      }
    });

    // Dengarkan perubahan preferensi OS jika pengguna belum menyimpan preferensi manual
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  });
})();
