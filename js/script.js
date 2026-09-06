/* ==========================================================================
   PORTFOLIO WEBSITE - MUHAMMAD GHANI AQILA
   JavaScript Engine: Vanilla JS (Typewriter, Scroll Reveal, Loading, Nav)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. LOADING SCREEN HANDLER --- */
  const loadingScreen = document.getElementById('loading-screen');
  
  if (loadingScreen) {
    // Sembunyikan loading screen setelah 2.3 detik
    setTimeout(() => {
      loadingScreen.classList.add('hide');
      
      // Hapus elemen dari DOM setelah animasi selesai
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 600);
    }, 2300);
  }

  /* --- 2. TYPEWRITER EFFECT IN HERO --- */
  const typewriterElement = document.getElementById('typewriter');
  
  if (typewriterElement) {
    const phrases = [
      "Muhammad Ghani Aqila.",
      "Seorang Pelajar SMK.",
      "Web Developer.",
      "UI/UX Enthusiast.",
      "AI Explorer."
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100; // Kecepatan mengetik (ms)
    
    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        // Hapus karakter
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Lebih cepat saat menghapus
      } else {
        // Tambah karakter
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // Kecepatan mengetik biasa
      }
      
      // Jika pengetikan kalimat selesai
      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // Tahan selama 2 detik sebelum mulai menghapus
      } 
      // Jika penghapusan kalimat selesai
      else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length; // Lanjut ke kalimat berikutnya
        typingSpeed = 500; // Jeda 0.5s sebelum mengetik kalimat baru
      }
      
      setTimeout(typeEffect, typingSpeed);
    }
    
    // Mulai efek typewriter
    setTimeout(typeEffect, 2500); // Mulai setelah intro loading
  }

  /* --- 3. INTERSECTION OBSERVER FOR SCROLL REVEAL --- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Opsional: unobserve jika animasi hanya ingin muncul sekali
          // observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12, // Tampil saat 12% elemen terlihat di viewport
      rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback jika browser sangat lama
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* --- 4. MOBILE MENU TOGGLE --- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isExpanded = navLinks.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Tutup menu saat link diklik
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  /* --- 5. SMOOTH SCROLL BACKUP HANDLER --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

});
