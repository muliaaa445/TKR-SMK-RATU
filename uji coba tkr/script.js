// script.js - Enhanced dengan dark mode, sidebar, dan animasi

// Helper functions
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Theme management
const ThemeManager = {
  init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
    
    const toggleBtn = $('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  },
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icon
    const toggleIcon = $('.theme-icon');
    const toggleText = $('.theme-text');
    if (toggleIcon && toggleText) {
      toggleIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
      toggleText.textContent = theme === 'dark' ? 'Mode Terang' : 'Mode Gelap';
    }
  },
  
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
};

// Sidebar management
const SidebarManager = {
  init() {
    this.sidebar = $('.sidebar');
    this.toggleBtn = $('.toggle-btn');
    this.mobileMenuBtn = $('.mobile-menu-btn');
    
    // Load saved state
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
      this.collapse();
    }
    
    // Event listeners
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }
    
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.addEventListener('click', () => this.toggleMobile());
    }
    
    // Close sidebar when clicking on a link (mobile)
    $$('.sidebar-nav a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          this.closeMobile();
        }
      });
    });
  },
  
  toggle() {
    if (this.sidebar.classList.contains('collapsed')) {
      this.expand();
    } else {
      this.collapse();
    }
  },
  
  collapse() {
    this.sidebar.classList.add('collapsed');
    localStorage.setItem('sidebarCollapsed', 'true');
  },
  
  expand() {
    this.sidebar.classList.remove('collapsed');
    localStorage.setItem('sidebarCollapsed', 'false');
  },
  
  toggleMobile() {
    this.sidebar.classList.toggle('open');
  },
  
  closeMobile() {
    this.sidebar.classList.remove('open');
  }
};

// Loading screen handler
window.addEventListener('load', () => {
  const loader = $('#loader');
  const mainContent = $('#mainContent');

  // Animate loader progress bar
  const progress = $('.loader-progress');
  if (progress) {
    progress.style.width = '60%';
    setTimeout(() => { 
      progress.style.width = '100%'; 
    }, 300);
  }

  // Minimum visible loading for smooth UX
  setTimeout(() => {
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 400);
    }
    if (mainContent) {
      mainContent.setAttribute('aria-hidden', 'false');
      mainContent.classList.add('visible');
      
      // Initialize page animations
      PageAnimations.init();
    }
  }, 900);
});

// Page animations
const PageAnimations = {
  init() {
    this.animateElements();
    this.setupScrollAnimations();
    this.setupBackToTop();
  },
  
  animateElements() {
    // Animate elements with data-animate attribute
    const animatedElements = $$('[data-animate]');
    animatedElements.forEach((el, index) => {
      const animationType = el.getAttribute('data-animate') || 'fade-in';
      const delay = index * 100;
      
      setTimeout(() => {
        el.classList.add(animationType);
        setTimeout(() => {
          el.classList.add('revealed');
        }, 50);
      }, delay);
    });
  },
  
  setupScrollAnimations() {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animate-ready elements
    $$('.fade-in, .slide-up, .slide-left, .slide-right, .zoom-in').forEach(el => {
      if (el) observer.observe(el);
    });
  },
  
  setupBackToTop() {
    const backToTopBtn = $('.back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
};

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = $(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    });
  });
});

// Contact form handler (Indonesian messages)
(function () {
  const form = $('#contactForm');
  const msg = $('#formMsg');

  if (!form || !msg) return;

  function showMessage(text, type = 'success') {
    msg.textContent = text;
    msg.style.color = type === 'error' ? '#b91c1c' : '#065f46';
    msg.style.background = type === 'error' ? '#fee2e2' : '#dcfce7';
    msg.setAttribute('aria-hidden', 'false');
    msg.style.opacity = '1';
    msg.style.display = 'block';

    // Clear after 5s
    setTimeout(() => {
      msg.style.opacity = '0';
      setTimeout(() => {
        msg.textContent = '';
        msg.setAttribute('aria-hidden', 'true');
        msg.style.background = 'transparent';
        msg.style.display = 'none';
      }, 300);
    }, 5000);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nama = ($('#nama').value || '').trim();
    const hp = ($('#hp').value || '').trim();
    const pesan = ($('#pesan').value || '').trim();

    if (!nama || !hp || !pesan) {
      showMessage('Lengkapi semua kolom.', 'error');
      return;
    }

    if (!/^[0-9+\-\s()]+$/.test(hp)) {
      showMessage('Format nomor telepon tidak valid.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;

    // Simulate server submit
    setTimeout(() => {
      showMessage('Permintaan berhasil dikirim. Tim administrasi akan menghubungi Anda.', 'success');
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      console.log('Form submitted:', { nama, hp, pesan });
    }, 900);
  });
})();

// Lazy loading for images
(function () {
  const lazyImgs = $$('.lazy');
  if ('IntersectionObserver' in window && lazyImgs.length) {
    const imgObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.addEventListener('load', () => {
              img.classList.add('loaded');
            });
          }
          obs.unobserve(img);
        }
      });
    }, { root: null, threshold: 0.05 });

    lazyImgs.forEach(i => imgObserver.observe(i));
  } else {
    // Fallback: load all immediately
    lazyImgs.forEach(img => {
      if (img.dataset.src) img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }
})();

// Gallery modal viewer
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const gallery = $('.gallery');
    if (!gallery) return;

    gallery.addEventListener('click', (e) => {
      const img = e.target.closest('img');
      if (!img) return;

      const overlay = document.createElement('div');
      overlay.className = 'image-overlay';
      overlay.style.cssText = `
        position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,0.9); z-index:10000; cursor:pointer; opacity:0;
        transition:opacity .25s ease;
      `;

      const modalImg = document.createElement('img');
      modalImg.src = img.src || img.dataset.src;
      modalImg.alt = img.alt || '';
      modalImg.style.maxWidth = '92%';
      modalImg.style.maxHeight = '92%';
      modalImg.style.borderRadius = '12px';
      modalImg.style.boxShadow = '0 30px 80px rgba(0,0,0,0.6)';
      modalImg.style.transform = 'scale(.95)';
      modalImg.style.transition = 'transform .25s ease';

      overlay.appendChild(modalImg);
      document.body.appendChild(overlay);

      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        modalImg.style.transform = 'scale(1)';
      });

      const closeModal = () => {
        overlay.style.opacity = '0';
        modalImg.style.transform = 'scale(.95)';
        setTimeout(() => {
          if (overlay.parentNode) {
            document.body.removeChild(overlay);
          }
        }, 250);
      };

      overlay.addEventListener('click', closeModal);
      
      // Also close on ESC key
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
    });
  });
})();

// Floating animation for service elements
document.addEventListener('DOMContentLoaded', () => {
  $$('.service').forEach((service, i) => {
    if (service) {
      service.style.animation = `float 3s ease-in-out ${i * 0.18}s infinite`;
    }
  });
});

// Initialize all managers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  SidebarManager.init();
  
  // Add back to top button if not exists
  if (!$('.back-to-top')) {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', 'Kembali ke atas');
    document.body.appendChild(backToTopBtn);
  }
  
  // Add mobile menu button if not exists
  if (!$('.mobile-menu-btn')) {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');
    document.body.appendChild(mobileMenuBtn);
  }
});

// Console message for developers
console.log('%c🔧 Bengkel Praktik SMK Veteran 1 Sukoharjo', 'color: #1f6feb; font-size: 16px; font-weight: bold;');
console.log('%cDibuat untuk pendidikan - Dengan ❤️ untuk siswa', 'color: #0ea5a4; font-size: 12px;');