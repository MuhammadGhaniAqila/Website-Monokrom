/* ==========================================================================
   PORTFOLIO WEBSITE - MUHAMMAD GHANI AQILA
   JavaScript Engine: Vanilla JS (Typewriter, Scroll Reveal, Loading, Nav)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. LOADING SCREEN HANDLER --- */
  const loadingScreen = document.getElementById('loading-screen');
  
  if (loadingScreen) {
    // Sembunyikan loading screen setelah 2.9 detik (seusai animasi turntable & vinyl)
    setTimeout(() => {
      loadingScreen.classList.add('hide');
      
      // Hapus elemen dari DOM setelah animasi selesai
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 600);
    }, 2900);
  }

  /* --- 2. TYPEWRITER EFFECT IN HERO --- */
  const typewriterElement = document.getElementById('typewriter');
  
  if (typewriterElement) {
    let phrases = (window.I18nController && window.I18nController.getTypewriterPhrases)
      ? window.I18nController.getTypewriterPhrases()
      : [
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

    window.updateTypewriterPhrases = (newPhrases) => {
      if (Array.isArray(newPhrases) && newPhrases.length > 0) {
        phrases = newPhrases;
        phraseIndex = 0;
        charIndex = 0;
        isDeleting = false;
      }
    };
    
    function typeEffect() {
      const currentPhrase = phrases[phraseIndex] || phrases[0];
      
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

  /* --- 6. BACKGROUND MUSIC & FLOATING PLAYER CONTROLLER --- */
  const bgAudio = document.getElementById('bg-audio');
  const musicWidget = document.getElementById('music-player-widget');
  const widgetPlayBtn = document.getElementById('widget-play-btn');
  const widgetStatusText = document.getElementById('widget-song-status');

  if (bgAudio && musicWidget) {
    let isPlaying = false;

    function playAudio() {
      bgAudio.muted = false;
      const playPromise = bgAudio.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying = true;
          musicWidget.classList.remove('paused');
          musicWidget.classList.add('playing');
          if (widgetStatusText) widgetStatusText.textContent = 'rumahsakit';
          removeGestureListeners();
        }).catch(err => {
          console.log('Autoplay unmuted blocked by browser policy, fallback muted until initial interaction:', err.message);
          bgAudio.muted = true;
          bgAudio.play().then(() => {
            isPlaying = true;
            musicWidget.classList.remove('paused');
            musicWidget.classList.add('playing');
            if (widgetStatusText) widgetStatusText.textContent = 'rumahsakit';
          }).catch(e => {
            console.log('Autoplay fallback error:', e);
          });
        });
      }
    }

    function pauseAudio() {
      bgAudio.pause();
      isPlaying = false;
      musicWidget.classList.remove('playing');
      musicWidget.classList.add('paused');
      if (widgetStatusText) widgetStatusText.textContent = 'rumahsakit (Jeda)';
    }

    function toggleAudio() {
      if (isPlaying && !bgAudio.paused && !bgAudio.muted) {
        pauseAudio();
      } else {
        bgAudio.muted = false;
        playAudio();
      }
    }

    const forceUnmute = () => {
      if (!bgAudio) return;
      bgAudio.muted = false;
      const promise = bgAudio.play();
      if (promise !== undefined) {
        promise.then(() => {
          isPlaying = true;
          musicWidget.classList.remove('paused');
          musicWidget.classList.add('playing');
          if (widgetStatusText) widgetStatusText.textContent = 'rumahsakit';
          removeGestureListeners();
        }).catch(err => {
          // Tetap tunggu gestur berikutnya tanpa mematikan listener
        });
      }
    };

    const triggerEvents = ['mousemove', 'mouseenter', 'pointermove', 'mouseover', 'focus', 'click', 'pointerdown', 'touchstart', 'keydown', 'scroll'];

    function removeGestureListeners() {
      triggerEvents.forEach(evt => {
        window.removeEventListener(evt, forceUnmute);
        document.removeEventListener(evt, forceUnmute);
      });
    }

    triggerEvents.forEach(evt => {
      window.addEventListener(evt, forceUnmute, { passive: true });
      document.addEventListener(evt, forceUnmute, { passive: true });
    });

    // Jalankan langsung
    playAudio();
    window.addEventListener('load', forceUnmute, { once: true });
    window.addEventListener('pageshow', forceUnmute, { once: true });

    // Pasang listener pada tombol Play/Pause di widget kanan bawah
    if (widgetPlayBtn) {
      widgetPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAudio();
      });
    }
  }

  /* --- 7. MOUSE-TRACKING 3D TILT & SPOTLIGHT ANIMATION FOR CARDS --- */
  const interactiveCards = document.querySelectorAll(
    '.skill-card, .profile-card, .quote-card, .edu-card, .journey-card, .project-card, .stat-box'
  );

  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update posisi efek spotlight glow mengikuti kursor
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Hitung derajat rotasi 3D tilt berdasarkan posisi kursor dari tengah kotak
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7; // Max tilt X 7deg
      const rotateY = ((x - centerX) / centerX) * 7;  // Max tilt Y 7deg

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });

});
