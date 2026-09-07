/* ==========================================================================
   PORTFOLIO WEBSITE - INTERNATIONALIZATION (i18n) ENGINE
   Languages Supported: Indonesian (id), English (en)
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'portfolio_lang';
  const DEFAULT_LANG = 'id';

  // 1. Translation Dictionary
  const translations = {
    id: {
      // Navbar & General
      'nav.about': 'Tentang',
      'nav.skills': 'Profil & Keahlian',
      'nav.education': 'Pendidikan',
      'nav.journey': 'Perjalanan',
      'nav.projects': 'Proyek',
      'nav.contact': 'Kontak',

      // Loading Screen
      'loader.welcome': 'Welcome To My',
      'loader.title': 'PORTFOLIO WEBSITE',

      // Hero Section
      'hero.greeting': 'Halo, Saya',
      'hero.desc': 'Saya seorang pelajar yang tertarik dengan dunia teknologi, khususnya web development, UI/UX design, dan artificial intelligence. Senang mengeksplorasi teknologi baru dan mengubah ide menjadi karya digital.',
      'hero.btn_contact': 'Hubungi Saya',
      'hero.btn_projects': 'Lihat Karya',

      // Quote Section
      'quote.text': 'Coding memberi saya kemampuan untuk menciptakan, mengontrol, dan mengembangkan sesuatu dari nol.',

      // Profile & Skills Section
      'profile.subtitle': 'Tentang Diri & Skill',
      'profile.title': 'Profil & Keahlian',
      'profile.badge': 'Pelajar & Calon Developer',
      'profile.status_label': 'Status',
      'profile.status_val': 'Pelajar',
      'profile.school_label': 'Sekolah',
      'profile.school_val': 'SMK Telkom Purwokerto',
      'profile.major_label': 'Jurusan',
      'profile.major_val': 'PPLG',
      'profile.class_label': 'Kelas',
      'profile.class_val': 'XI PPLG 1',
      'profile.domicile_label': 'Domisili',
      'profile.domicile_val': 'Purwokerto, Jawa Tengah',

      // Skills Card Descriptions
      'skill.1_desc': 'Dasar pengembangan web murni untuk membangun antarmuka web yang responsif dan interaktif.',
      'skill.2_desc': 'Membangun website dari front-end dengan fokus pada struktur kode yang rapi dan estetika visual.',
      'skill.3_desc': 'Merancang antarmuka yang modern, intuitif, dan memberikan pengalaman pengguna yang optimal.',
      'skill.4_desc': 'Tools utama dalam melakukan perancangan wireframe, UI mockup, dan interactive prototyping.',
      'skill.5_desc': 'Coding secara efisien dengan bantuan Artificial Intelligence untuk mempercepat alur pengembangan.',
      'skill.6_desc': 'Eksplorasi integrasi teknologi AI modern ke dalam solusi dan aplikasi berbasis web.',
      'skill.7_desc': 'Pembuatan dan pengolahan elemen visual dekoratif pendukung untuk kebutuhan branding dan aset digital.',

      // Education Section
      'edu.subtitle': 'Latar Belakang Akademis',
      'edu.title': 'Riwayat Pendidikan',
      'edu.smk_major': 'Pengembangan Perangkat Lunak dan Gim (PPLG)',
      'edu.smp_major': 'Sekolah Menengah Pertama',
      'edu.sd_major': 'Sekolah Dasar',

      // About Section
      'about.subtitle': 'Mengenal Lebih Dekat',
      'about.title': 'Tentang Saya',
      'about.heading': 'Halo, Saya Ghani',
      'about.paragraph': 'Hi, saya Ghani, seorang pelajar yang tertarik dengan dunia teknologi, khususnya web development, UI/UX, dan artificial intelligence. Saya senang mengeksplorasi berbagai teknologi baru dan mengembangkan ide menjadi sebuah karya digital.',
      'about.stat_tech': 'Teknologi Dipelajari',
      'about.stat_projects': 'Proyek Dikerjakan',
      'about.stat_tools': 'Tools Dikuasai',
      'about.quote': 'Setiap baris kode adalah langkah kecil untuk mewujudkan ide besar yang bermanfaat bagi masa depan.',

      // Journey Section
      'journey.subtitle': 'Jejak Langkah & Milestone',
      'journey.title': 'Perjalananku',
      'journey.1_title': 'Awal Mula',
      'journey.1_desc': 'Mulai tertarik dengan dunia coding dan teknologi digital.',
      'journey.2_title': 'Eksplorasi Desain',
      'journey.2_desc': 'Mulai belajar Figma dan prinsip dasar UI/UX design untuk membangun antarmuka.',
      'journey.3_title': 'Belajar Dasar',
      'journey.3_desc': 'Mempelajari HTML, CSS, dan JavaScript secara mandiri.',
      'journey.4_title': 'Masuk PPLG',
      'journey.4_desc': 'Bergabung di jurusan Pengembangan Perangkat Lunak dan Gim, SMK Telkom Purwokerto.',
      'journey.5_title': 'Sekarang',
      'journey.5_desc': 'Mengeksplorasi AI-assisted coding (vibe coding) untuk mempercepat pembuatan proyek web modern.',

      // Projects Section
      'projects.subtitle': 'Showcase Portofolio',
      'projects.title': 'Proyek & Karya',
      'projects.1_desc': 'Aplikasi pemantau cuaca personal dengan tampilan modern yang menyajikan suhu real-time, kondisi cuaca, kelembaban, dan prakiraan cuaca jam-jaman.',
      'projects.2_desc': 'Website landing page pusat kebugaran modern dengan tampilan dark-gold eksklusif, fitur pendaftaran membership, dan katalog program latihan interaktif.',
      'projects.3_desc': 'Eksplorasi eksperimental aplikasi web berbasis kecerdasan buatan (AI) menggunakan teknik vibe coding dan integrasi API AI modern.',
      'projects.btn_demo': 'Lihat Demo',
      'projects.btn_code': 'Kode Sumber',

      // Contact Section
      'contact.subtitle': 'Get In Touch',
      'contact.title': 'Mari Terhubung',
      'contact.desc': 'Tertarik untuk berkolaborasi, berdiskusi mengenai proyek web, UI/UX, atau sekadar menyapa? Jangan ragu untuk menghubungi saya!'
    },

    en: {
      // Navbar & General
      'nav.about': 'About',
      'nav.skills': 'Profile & Skills',
      'nav.education': 'Education',
      'nav.journey': 'Journey',
      'nav.projects': 'Projects',
      'nav.contact': 'Contact',

      // Loading Screen
      'loader.welcome': 'Welcome To My',
      'loader.title': 'PORTFOLIO WEBSITE',

      // Hero Section
      'hero.greeting': 'Hello, I am',
      'hero.desc': 'I am a student passionate about technology, especially web development, UI/UX design, and artificial intelligence. I enjoy exploring new tech and turning ideas into digital creations.',
      'hero.btn_contact': 'Contact Me',
      'hero.btn_projects': 'View Projects',

      // Quote Section
      'quote.text': 'Coding gives me the ability to create, control, and build something meaningful from scratch.',

      // Profile & Skills Section
      'profile.subtitle': 'About Me & Skills',
      'profile.title': 'Profile & Skills',
      'profile.badge': 'Student & Aspiring Developer',
      'profile.status_label': 'Status',
      'profile.status_val': 'Student',
      'profile.school_label': 'School',
      'profile.school_val': 'SMK Telkom Purwokerto',
      'profile.major_label': 'Major',
      'profile.major_val': 'Software Engineering (PPLG)',
      'profile.class_label': 'Class',
      'profile.class_val': 'XI PPLG 1',
      'profile.domicile_label': 'Location',
      'profile.domicile_val': 'Purwokerto, Central Java',

      // Skills Card Descriptions
      'skill.1_desc': 'Foundations of web development for crafting responsive and interactive web interfaces.',
      'skill.2_desc': 'Building websites from the front-end with a focus on clean code structure and aesthetics.',
      'skill.3_desc': 'Designing modern, intuitive user interfaces that deliver optimal user experience.',
      'skill.4_desc': 'Primary design tool for wireframing, UI mockups, and interactive prototyping.',
      'skill.5_desc': 'Efficient coding with Artificial Intelligence assistance to speed up development workflows.',
      'skill.6_desc': 'Exploring integration of modern AI tech into web solutions and web applications.',
      'skill.7_desc': 'Creation and editing of decorative visual elements for branding and digital asset needs.',

      // Education Section
      'edu.subtitle': 'Academic Background',
      'edu.title': 'Education History',
      'edu.smk_major': 'Software and Game Development (PPLG)',
      'edu.smp_major': 'Junior High School',
      'edu.sd_major': 'Elementary School',

      // About Section
      'about.subtitle': 'Get To Know Me',
      'about.title': 'About Me',
      'about.heading': 'Hi, I am Ghani',
      'about.paragraph': 'Hi, I am Ghani, a student interested in technology, particularly web development, UI/UX, and artificial intelligence. I love discovering new tools and building digital projects from scratch.',
      'about.stat_tech': 'Technologies Learned',
      'about.stat_projects': 'Projects Built',
      'about.stat_tools': 'Tools Mastered',
      'about.quote': 'Every line of code is a small step toward realizing big ideas for the future.',

      // Journey Section
      'journey.subtitle': 'Milestones & History',
      'journey.title': 'My Journey',
      'journey.1_title': 'The Beginning',
      'journey.1_desc': 'Became fascinated by coding and the digital technology world.',
      'journey.2_title': 'Design Exploration',
      'journey.2_desc': 'Started learning Figma and UI/UX design principles for web interfaces.',
      'journey.3_title': 'Core Foundations',
      'journey.3_desc': 'Self-taught fundamentals of HTML, CSS, and JavaScript.',
      'journey.4_title': 'Enrolled in PPLG',
      'journey.4_desc': 'Joined Software & Game Development major at SMK Telkom Purwokerto.',
      'journey.5_title': 'Present Day',
      'journey.5_desc': 'Exploring AI-assisted coding (vibe coding) to accelerate modern web project creation.',

      // Projects Section
      'projects.subtitle': 'Portfolio Showcase',
      'projects.title': 'Featured Projects',
      'projects.1_desc': 'Personal weather monitoring app featuring real-time temperature, weather conditions, humidity, and hourly forecasts.',
      'projects.2_desc': 'Modern fitness center landing page with exclusive dark-gold aesthetic, membership registration, and interactive workout catalog.',
      'projects.3_desc': 'Experimental AI-powered web app leveraging vibe coding techniques and modern AI API integrations.',
      'projects.btn_demo': 'Live Demo',
      'projects.btn_code': 'Source Code',

      // Contact Section
      'contact.subtitle': 'Get In Touch',
      'contact.title': 'Let\'s Connect',
      'contact.desc': 'Interested in collaborating, discussing web projects, UI/UX design, or just saying hi? Feel free to reach out!'
    }
  };

  // 2. Typewriter Phrases per language
  const typewriterPhrases = {
    id: [
      "Muhammad Ghani Aqila.",
      "Seorang Pelajar SMK.",
      "Web Developer.",
      "UI/UX Enthusiast.",
      "AI Explorer."
    ],
    en: [
      "Muhammad Ghani Aqila.",
      "A High School Student.",
      "Web Developer.",
      "UI/UX Enthusiast.",
      "AI Explorer."
    ]
  };

  /**
   * Ambil bahasa yang tersimpan di localStorage atau default 'id'
   */
  function getSavedLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === 'id' || saved === 'en')) {
      return saved;
    }
    return DEFAULT_LANG;
  }

  /**
   * Terapkan bahasa yang dipilih ke seluruh dokumen DOM
   */
  function setLanguage(lang) {
    const currentLang = (lang === 'en') ? 'en' : 'id';
    document.documentElement.setAttribute('lang', currentLang);
    localStorage.setItem(STORAGE_KEY, currentLang);

    // Update semua elemen bertag data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[currentLang] && translations[currentLang][key]) {
        el.textContent = translations[currentLang][key];
      }
    });

    // Update tombol bahasa yang aktif di UI
    updateLangUI(currentLang);

    // Notify script.js untuk perbarui typewriter phrases
    if (window.updateTypewriterPhrases) {
      window.updateTypewriterPhrases(typewriterPhrases[currentLang]);
    }
  }

  /**
   * Update highlight tombol pilihan bahasa di navbar
   */
  function updateLangUI(currentLang) {
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      if (btn.getAttribute('data-lang') === currentLang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // Expose API Global
  window.I18nController = {
    getLang: getSavedLanguage,
    setLang: setLanguage,
    getTypewriterPhrases: () => typewriterPhrases[getSavedLanguage()]
  };

  // Inisialisasi awal
  document.addEventListener('DOMContentLoaded', () => {
    const initialLang = getSavedLanguage();
    setLanguage(initialLang);

    // Listener klik tombol bahasa
    document.addEventListener('click', (e) => {
      const langBtn = e.target.closest('.lang-btn');
      if (langBtn) {
        e.preventDefault();
        const selectedLang = langBtn.getAttribute('data-lang');
        if (selectedLang) {
          setLanguage(selectedLang);
        }
      }
    });
  });

})();
