/**
 * KURTECH - Solusi Server & Jaringan Terpercaya
 * Interactive App Logic, Mobile Navigation, Dark Mode & Event Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Dark Mode / Light Mode Theme Switcher
  // =========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('kurtech_theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fa-solid fa-sun" style="color: #FBBF24;"></i>';
        themeToggle.setAttribute('title', 'Ganti ke Mode Terang');
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        themeToggle.setAttribute('title', 'Ganti ke Mode Gelap');
      }
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('kurtech_theme', newTheme);
      applyTheme(newTheme);
    });
  }

  // =========================================================================
  // 2. Mobile Navigation Toggle & Drawer
  // =========================================================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // =========================================================================
  // 3. High-Performance Header Scroll & Active Section Tracker
  // =========================================================================
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links .nav-link');
  const mobileBarBtns = document.querySelectorAll('.mobile-bar-btn');

  let isTicking = false;

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header background blur
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Active link highlighting
    let currentId = '';
    const scrollOffset = scrollY + 140;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollOffset >= top && scrollOffset < top + height) {
        currentId = section.getAttribute('id');
        break;
      }
    }

    if (currentId) {
      desktopNavLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      mobileBarBtns.forEach(btn => {
        if (btn.getAttribute('href') === `#${currentId}`) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    isTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(handleScroll);
      isTicking = true;
    }
  }, { passive: true });

  // Keyboard Escape key support for all modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModals = document.querySelectorAll('.modal-backdrop.active');
      activeModals.forEach(m => m.classList.remove('active'));
      document.body.style.overflow = 'auto';
    }
  });

  // =========================================================================
  // 4. Service Category Tabs Filter
  // =========================================================================
  const serviceFilterBtns = document.querySelectorAll('.service-filter-tabs .filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  serviceFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 5. Portfolio Category Tabs Filter
  // =========================================================================
  const portfolioFilterBtns = document.querySelectorAll('.portfolio-filter-tabs .filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  portfolioFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      portfolioFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-pfilter');

      portfolioCards.forEach(card => {
        const cardCategory = card.getAttribute('data-pcat');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 6. Interactive Cost Estimator Calculator
  // =========================================================================
  const estimatorCheckboxes = document.querySelectorAll('.estimator-item input[type="checkbox"]');
  const selectedItemsList = document.getElementById('selectedItemsList');
  const totalAmountDisplay = document.getElementById('totalAmount');
  const btnKirimEstimasiWA = document.getElementById('btnKirimEstimasiWA');

  function updateEstimator() {
    let total = 0;
    let selectedItems = [];

    estimatorCheckboxes.forEach(cb => {
      if (cb.checked) {
        const name = cb.getAttribute('data-name');
        const price = parseInt(cb.getAttribute('data-price'), 10) || 0;
        total += price;
        selectedItems.push({ name, price });
      }
    });

    // Update List UI
    if (selectedItemsList) {
      if (selectedItems.length === 0) {
        selectedItemsList.innerHTML = '<li style="color: #94A3B8; font-style: italic;">Belum ada layanan yang dipilih. Silakan centang kebutuhan Anda.</li>';
      } else {
        selectedItemsList.innerHTML = selectedItems.map(item => `
          <li>
            <span>• ${item.name}</span>
            <span style="font-weight: 700; color: #34D399;">Rp ${item.price.toLocaleString('id-ID')}</span>
          </li>
        `).join('');
      }
    }

    // Update Total Display
    if (totalAmountDisplay) {
      totalAmountDisplay.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }

    // Update WhatsApp link
    if (btnKirimEstimasiWA) {
      if (selectedItems.length === 0) {
        btnKirimEstimasiWA.href = 'https://wa.me/6283826164767?text=Halo%20KURTECH,%20saya%20ingin%20konsultasi%20mengenai%20layanan%20jaringan%20dan%20komputer.';
      } else {
        const itemLines = selectedItems.map(i => `- ${i.name} (Rp ${i.price.toLocaleString('id-ID')})`).join('%0A');
        const waText = `Halo%20KURTECH,%20saya%20ingin%20memesan/konsultasi%20layanan%20berikut:%0A%0A${itemLines}%0A%0ATotal%20Estimasi:%20Rp%20${total.toLocaleString('id-ID')}%0A%0AMohon%20info%20jadwal%20dan%20detailnya.%20Terima%20kasih!`;
        btnKirimEstimasiWA.href = `https://wa.me/6283826164767?text=${waText}`;
      }
    }
  }

  estimatorCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateEstimator);
  });

  // Initial estimator calculation
  updateEstimator();

  // =========================================================================
  // 7. Contact Form to WhatsApp
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nama = document.getElementById('nama')?.value || '';
      const layanan = document.getElementById('layanan')?.value || '';
      const pesan = document.getElementById('pesan')?.value || '';

      const waText = `Halo%20KURTECH,%20saya%20*${encodeURIComponent(nama)}*%0A%0A` +
                     `*Kategori%20Layanan:*%20${encodeURIComponent(layanan)}%0A` +
                     `*Pesan/Kebutuhan:*%20${encodeURIComponent(pesan)}%0A%0A` +
                     `Mohon%20informasi%20dan%20konsultasinya.%20Terima%20kasih!`;

      window.open(`https://wa.me/6283826164767?text=${waText}`, '_blank');
    });
  }

  // =========================================================================
  // 8. FAQ Accordion Handler
  // =========================================================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all other FAQ items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        answer.style.maxHeight = `${answer.scrollHeight + 30}px`;
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // =========================================================================
  // 9. Portfolio Projects Database & Modal Viewer
  // =========================================================================
  const portfolioModal = document.getElementById('portfolioModal');
  const pModalTitle = document.getElementById('pModalTitle');
  const pModalBadge = document.getElementById('pModalBadge');
  const pModalBody = document.getElementById('pModalBody');
  const pModalClose = document.getElementById('pModalClose');

  const portfolioData = {
    'p1': {
      title: 'Integrasi Topologi RT/RW Net, OLT GPON/EPON & Server ACS',
      category: 'RT/RW Net, OLT & ACS',
      location: 'Bekasi & Garut (MUDUD, TRI NETWORK & ARKAMEDIA)',
      duration: 'Kemitraan Sejak 2017 s/d Sekarang (Aktif)',
      problem: 'Kebutuhan integrasi jalur distribusi multi-node (Converter HTB, Estafet Switch antar-tiang, dan OLT EPON/GPON), migrasi skala ratusan pelanggan, serta otomatisasi manajemen modem ONT klien rumahan.',
      solution: `
        <ul>
          <li>• Desain topologi hybrid <strong>HTB, Estafet Switch, dan OLT EPON/GPON</strong> dengan jalur distribusi rapi bebas bottleneck & anti-loss.</li>
          <li>• Konfigurasi <strong>MikroTik 1 Port 2 Service</strong>: mengalirkan service PPPoE internet rumahan sekaligus Hotspot Voucher bersamaan.</li>
          <li>• Implementasi <strong>Server ACS (GenieACS TR-069)</strong>: modem ONT klien otomatis terkonfigurasi (Zero-Touch Provisioning) dan monitoring redaman RX dBm.</li>
          <li>• Manajemen bandwidth anti-lag, pemisahan jalur game/streaming, dan sistem auto-isolir terintegrasi.</li>
        </ul>
      `,
      hardware: ['OLT EPON & GPON', 'Router MikroTik RouterBOARD / x86', 'Server ACS GenieACS', 'Converter HTB & Splicing FO', 'Modem ONT GPON']
    },
    'p4': {
      title: 'Infrastruktur Server CBT Ujian, Lab Komputer & Hotspot Sekolah',
      category: 'Server Sekolah & Institusi',
      location: 'Garut & Bekasi (SMK/SMP IT Al-Hawari, SMK BSM & MTs Tarbiyatul Falah)',
      duration: 'Terintegrasi Penuh & Pendampingan ANBK',
      problem: 'Sekolah membutuhkan sistem jaringan terpadu untuk pelaksanaan Ujian Berbasis Komputer (CBT / ANBK), Hotspot siswa & guru, sistem keamanan CCTV online, dan aplikasi manajemen sekolah.',
      solution: `
        <ul>
          <li>• Instalasi topologi jaringan LAN Lab Komputer (Kabel Cat6) dan <strong>Server Ujian CBT</strong> lokal berkecepatan tinggi tanpa lag.</li>
          <li>• Manajemen <strong>Server Hotspot Siswa & WiFi Guru</strong> dengan pemisahan bandwidth terisolasi dan pembatasan hak akses.</li>
          <li>• Pemasangan <strong>Kamera CCTV Online</strong> di sudut strategis sekolah yang dapat dipantau langsung dari smartphone.</li>
          <li>• Integrasi <strong>Aplikasi Manajemen Sekolah</strong> (didukung pengembangan <em>rhantech.com</em>) untuk administrasi, absensi digital, dan e-Rapor.</li>
        </ul>
      `,
      hardware: ['Server Ujian CBT Lokal', 'Router MikroTik', 'Switch Gigabit Manageable', 'Sistem CCTV Online', 'App rhantech.com']
    },
    'p5': {
      title: 'Topologi Lab Komputer & Server CBT Ujian',
      category: 'Server Sekolah',
      location: 'SMK BSM Garut & MTs Tarbiyatul Falah Bekasi',
      duration: 'Pengerjaan & Pendampingan Ujian',
      problem: 'Kebutuhan instalasi topologi jaringan lab komputer sekolah dan setup server CBT/ANBK mandiri yang stabil untuk puluhan komputer siswa secara serentak.',
      solution: `
        <ul>
          <li>• Penataan dan instalasi kabel LAN Cat6 berstandar tinggi di ruang laboratorium komputer sekolah.</li>
          <li>• Setup dan optimalisasi <strong>Server CBT Ujian</strong> lokal dengan response time cepat.</li>
          <li>• Konfigurasi <strong>Server Hotspot Siswa & WiFi Guru</strong> dengan pemisahan bandwidth terisolasi.</li>
        </ul>
      `,
      hardware: ['Server CBT Lokal', 'Switch Gigabit Manageable', 'Router MikroTik', 'Kabel LAN Cat6']
    },
    'p6': {
      title: 'Maintenance Komputer Sekolah & Layanan On-Site / Toko',
      category: 'Maintenance PC & Laptop',
      location: 'Bekasi, Cibitung & Garut',
      duration: 'Layanan Rutin & Panggilan',
      problem: 'Kebutuhan pemeliharaan komputer sekolah (RA Tarbiyatul Falah Cibitung, SDIT Bina Insani Muslim), panggilan service on-site ke rumah pelanggan, dan reparasi langsung di workshop toko.',
      solution: `
        <ul>
          <li>• Maintenance berkala hardware dan software PC Lab Sekolah untuk menjaga performa belajar mengajar.</li>
          <li>• Layanan <strong>kunjungan on-site ke rumah pelanggan</strong> untuk perbaikan PC/laptop, upgrade SSD NVMe/RAM, dan rakit PC baru/second.</li>
          <li>• Pelayanan servis langsung di toko/workshop KURTECH dengan pengerjaan transparan dan bergaransi.</li>
        </ul>
      `,
      hardware: ['SSD NVMe & SATA', 'Thermal Paste Arctic MX-4', 'RAM DDR3/DDR4/DDR5', 'Sparepart PC & Laptop Original']
    }
  };

  window.openPortfolioModal = function(id) {
    const item = portfolioData[id];
    if (item && portfolioModal) {
      pModalTitle.textContent = item.title;
      pModalBadge.textContent = item.category;
      pModalBody.innerHTML = `
        <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.25rem; display: flex; flex-wrap: wrap; gap: 15px;">
          <span><i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> Lokasi: ${item.location}</span>
          <span><i class="fa-solid fa-clock" style="color: var(--cyan-accent);"></i> Durasi: ${item.duration}</span>
        </div>

        <h5 style="color: var(--text-main); font-size: 1rem; margin-bottom: 6px;"><i class="fa-solid fa-triangle-exclamation" style="color: #F59E0B;"></i> Kendala / Kebutuhan Klien:</h5>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem; line-height: 1.6;">${item.problem}</p>

        <h5 style="color: var(--text-main); font-size: 1rem; margin-bottom: 6px;"><i class="fa-solid fa-screwdriver-wrench" style="color: var(--primary);"></i> Solusi & Implementasi KURTECH:</h5>
        <div style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem; line-height: 1.6;">${item.solution}</div>

        <h5 style="color: var(--text-main); font-size: 1rem; margin-bottom: 6px;"><i class="fa-solid fa-microchip" style="color: var(--cyan-accent);"></i> Perangkat & Teknologi yang Digunakan:</h5>
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 1.5rem;">
          ${item.hardware.map(h => `<span class="tech-tag">${h}</span>`).join('')}
        </div>

        <div style="margin-top: 1.5rem; padding: 1.25rem; background: var(--bg-accent-soft); border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.25);">
          <h5 style="color: var(--primary); font-size: 0.95rem; margin-bottom: 4px;">Punya kebutuhan atau kendala proyek serupa?</h5>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 10px;">Konsultasikan topologi atau spek perangkat yang Anda perlukan ke tim kami secara gratis.</p>
          <a href="https://wa.me/6283826164767?text=Halo%20KURTECH,%20saya%20ingin%20konsultasi%20terkait%20proyek%20serupa:%20${encodeURIComponent(item.title)}" target="_blank" class="btn btn-primary btn-sm">
            <i class="fa-brands fa-whatsapp"></i> Hubungi Teknisi untuk Proyek Ini
          </a>
        </div>
      `;
      portfolioModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  if (pModalClose) {
    pModalClose.addEventListener('click', () => {
      portfolioModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  if (portfolioModal) {
    portfolioModal.addEventListener('click', (e) => {
      if (e.target === portfolioModal) {
        portfolioModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // =========================================================================
  // 10. Blog Article Modal Reader
  // =========================================================================
  const blogModal = document.getElementById('blogModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  const articles = {
    '1': {
      title: 'Membangun Bisnis RT/RW Net Mandiri: Dari Modal Minim Jadi Sumber Cuan Stabil',
      category: 'Inspirasi Bisnis RT/RW Net',
      date: '20 Agustus 2026',
      content: `
        <p>Membangun jaringan RT/RW Net di lingkungan desa, perumahan, atau perkampungan bukan hanya sekadar hobi mengotak-atik kabel, melainkan sebuah <strong>peluang bisnis riil dengan aliran kas harian & bulanan yang sangat stabil</strong>.</p>
        <br>
        <h5 style="color: var(--text-main); font-size: 1rem; margin-bottom: 6px;"><i class="fa-solid fa-chart-line" style="color: var(--primary);"></i> 1. Mengapa Bisnis RT/RW Net Sangat Menjanjikan?</h5>
        <p>Kebutuhan internet saat ini setara dengan kebutuhan listrik dan air. Setiap keluarga membutuhkan koneksi untuk anak sekolah, bekerja online, hiburan YouTube/TikTok, hingga usaha warung. Dengan modal awal yang terukur, Anda bisa menciptakan aset jaringan yang menghasilkan pemasukan pasif berkelanjutan.</p>
        <br>
        <h5 style="color: var(--text-main); font-size: 1rem; margin-bottom: 6px;"><i class="fa-solid fa-stairs" style="color: var(--cyan-accent);"></i> 2. Strategi Bertahap dari Modal Minim hingga Ratusan User</h5>
        <ul>
          <li>• <strong>Fase Awal (Hotspot Voucher Warung):</strong> Manfaatkan router MikroTik standar untuk menyebarkan voucher 2rb - 5rb di warung kopi/kelontong sekitar. Modal cepat kembali dan risiko sangat minim.</li>
          <li>• <strong>Fase Ekspansi (PPPoE Rumahan & Estafet):</strong> Mulai tawarkan paket langganan bulanan ke rumah tetangga dengan sistem 1 Port MikroTik 2 Service (Hotspot + PPPoE) yang efisien tanpa bentrok.</li>
          <li>• <strong>Fase Profesional (Migrasi ke OLT Fiber Optik):</strong> Ketika pelanggan mencapai puluhan hingga ratusan, tingkatkan ke OLT EPON/GPON dan Server ACS GenieACS agar kontrol modem dan aktivasi serba otomatis dari HP Anda.</li>
        </ul>
        <br>
        <h5 style="color: var(--text-main); font-size: 1rem; margin-bottom: 6px;"><i class="fa-solid fa-shield-halved" style="color: #10B981;"></i> 3. Kunci Sukses: Stabilitas Jaringan & Layanan Ramah</h5>
        <p>Kunci pelanggan betah bertahun-tahun adalah koneksi yang tidak sering RTO saat main game online (Mobile Legends/Free Fire) dan pemisahan bandwidth yang adil. <strong>KURTECH siap mendampingi Anda dari nol</strong> mulai dari topologi, setting router, hingga konsultasi pengembangan jaringan.</p>
      `
    },
    '2': {
      title: 'Inspirasi Digitalisasi Sekolah: Peluang Kolaborasi Server CBT & Lab Komputer',
      category: 'Digitalisasi Sekolah & Kampus',
      date: '18 Agustus 2026',
      content: `
        <p>Dunia pendidikan saat ini sedang mengalami akselerasi digitalisasi besar-besaran. Pelaksanaan Asesmen Nasional (ANBK), ujian mandiri berbasis komputer (CBT), serta e-Rapor membutuhkan infrastruktur IT lokal yang kokoh dan handal.</p>
        <br>
        <h5 style="color: var(--text-main); font-size: 1rem; margin-bottom: 6px;"><i class="fa-solid fa-school" style="color: var(--primary);"></i> 1. Kebutuhan Nyata Sekolah yang Membuka Peluang</h5>
        <p>Banyak sekolah yang masih terkendala koneksi internet lambat saat ujian massal, server ujian sering down, atau distribusi WiFi guru dan siswa yang bercampur aduk sehingga boros kuota. Di sinilah peran penting teknisi jaringan dan server hadir memberikan solusi nyata.</p>
        <br>
        <h5 style="color: var(--text-main); font-size: 1rem; margin-bottom: 6px;"><i class="fa-solid fa-cubes" style="color: var(--cyan-accent);"></i> 2. Solusi Terintegrasi yang Dibutuhkan Sekolah:</h5>
        <ul>
          <li>• <strong>Server CBT Lokal Mandiri:</strong> Ujian dapat berjalan super cepat melalui jaringan LAN lokal tanpa bergantung pada kecepatan internet luar, sehingga bebas lag dan anti-gagal ujian.</li>
          <li>• <strong>Manajemen WiFi Terisolasi:</strong> Membatasi akses siswa pada jam pelajaran tertentu, serta memprioritaskan bandwidth penuh untuk ruang administrasi, guru, dan kepala sekolah.</li>
          <li>• <strong>Integrasi CCTV & Aplikasi Sekolah:</strong> Menjamin keamanan lingkungan sekolah dengan CCTV online yang bisa dipantau kepala yayasan kapan saja dari smartphone.</li>
        </ul>
        <br>
        <h5 style="color: var(--text-main); font-size: 1rem; margin-bottom: 6px;"><i class="fa-solid fa-handshake" style="color: #10B981;"></i> 3. Menjadi Mitra Terpercaya Institusi Pendidikan</h5>
        <p>Kerjasama dengan yayasan dan sekolah merupakan bentuk kemitraan jangka panjang dan membawa berkah karena turut memajukan kualitas generasi penerus bangsa. Tim KURTECH berpengalaman menangani instalasi server puluhan sekolah di Jawa Barat dan sekitarnya.</p>
      `
    },
    '3': {
      title: 'Potensi Cuan Workshop Komputer: Modal Keahlian, Service Laptop & Rakit PC',
      category: 'Workshop & Service Komputer',
      date: '15 Agustus 2026',
      content: `
        <p>Di era digital, perangkat laptop dan komputer adalah alat kerja utama bagi pekerja, pelajar, gamer, hingga kantor swasta. Kerusakan perangkat, performa lambat, atau kebutuhan upgrade spesifikasi menjadikan <strong>bisnis service dan toko komputer sebagai industri yang tidak pernah mati</strong>.</p>
        <br>
        <h5 style="color: var(--text-main); font-size: 1rem; margin-bottom: 6px;"><i class="fa-solid fa-money-bill-wave" style="color: var(--primary);"></i> 1. Pilar Pendapatan Utama Workshop Komputer:</h5>
        <ul>
          <li>• <strong>Service & Upgrade Cepat (Perputaran Harian):</strong> Layanan ganti SSD NVMe, tambah RAM, install ulang, dan pembersihan pasta thermal pendingin memiliki margin keuntungan tinggi dengan kepuasan instan dari pelanggan.</li>
          <li>• <strong>Rakit Custom PC (Gaming, Desain & Server):</strong> Permintaan PC rakitan custom sesuai budget kian melonjak. Pemilihan komponen yang tepat, cable management rapi, dan benchmark yang teruji membuat nilai jual PC rakitan sangat kompetitif.</li>
          <li>• <strong>Jual Beli Laptop / PC Second Bergaransi:</strong> Banyak orang mencari laptop berkualitas dengan harga hemat. Kuncinya adalah quality control ketat, kejujuran kondisi unit, dan jaminan garansi toko yang jelas.</li>
          <li>• <strong>Rakit PC Router MikroTik x86:</strong> Peluang khusus bagi pengusaha WiFi RT/RW Net yang membutuhkan router berkinerja tinggi menangani ribuan user dengan biaya terjangkau.</li>
        </ul>
        <br>
        <h5 style="color: var(--text-main); font-size: 1rem; margin-bottom: 6px;"><i class="fa-solid fa-star" style="color: #F59E0B;"></i> 2. Kunci Sukses: Reputasi, Kecepatan & Kejujuran</h5>
        <p>Pelanggan komputer sangat menghargai transparansi kerusakan dan estimasi biaya di awal. Inilah prinsip yang selalu dipegang oleh Workshop KURTECH di Tambun Selatan, Bekasi dalam melayani service on-site maupun langsung di toko.</p>
      `
    }
  };

  window.openArticleModal = function(id) {
    const article = articles[id];
    if (article && blogModal) {
      modalTitle.textContent = article.title;
      modalCategory.textContent = article.category;
      modalBody.innerHTML = `
        <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          <i class="fa-regular fa-calendar-days"></i> Diterbitkan: ${article.date} • Oleh Tim Teknisi KURTECH
        </div>
        ${article.content}
        <div style="margin-top: 2rem; padding: 1.25rem; background: var(--bg-accent-soft); border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.25);">
          <h5 style="color: var(--primary); font-size: 0.95rem; margin-bottom: 4px;">Butuh bantuan instalasi atau konsultasi langsung?</h5>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 10px;">Tim teknisi KURTECH siap datang ke lokasi atau membantu via remote.</p>
          <a href="https://wa.me/6283826164767?text=Halo%20KURTECH,%20saya%20ingin%20konsultasi%20terkait%20artikel:%20${encodeURIComponent(article.title)}" target="_blank" class="btn btn-primary btn-sm">
            <i class="fa-brands fa-whatsapp"></i> Chat Teknisi Sekarang
          </a>
        </div>
      `;
      blogModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      blogModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  if (blogModal) {
    blogModal.addEventListener('click', (e) => {
      if (e.target === blogModal) {
        blogModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Quick App Subdomain Notification
  window.openAppInfo = function(appName, subdomain) {
    alert(`Aplikasi ${appName} akan diarahkan ke subdomain: https://${subdomain}\n\nFitur ini terhubung ke ekosistem server KURTECH.`);
  };
});
