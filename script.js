// ============================================================
// script.js — Página educativa sobre bacterias Cocos
// Vanilla JavaScript · ES6+
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────────────────────────────
  // 1. Referencias globales al DOM
  // ──────────────────────────────────────────────────────────
  const body          = document.body;
  const navbar        = document.querySelector('.navbar');
  const navToggle     = document.querySelector('.nav-toggle');
  const navLinks      = document.querySelector('.nav-links');
  const themeToggle   = document.querySelector('.theme-toggle');
  const backToTopBtn  = document.querySelector('.back-to-top');
  const lightbox      = document.querySelector('.lightbox');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxImg   = lightbox?.querySelector('img');
  const heroSection   = document.querySelector('.hero');

  // ──────────────────────────────────────────────────────────
  // 2. Navegación móvil (hamburguesa)
  // ──────────────────────────────────────────────────────────
  if (navToggle && navLinks) {
    // Abrir / cerrar menú
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
      body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Cerrar al hacer clic en un enlace del menú
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        body.style.overflow = '';
      });
    });

    // Cerrar al hacer clic fuera del menú
    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        body.style.overflow = '';
      }
    });
  }

  // ──────────────────────────────────────────────────────────
  // 3. Tema claro / oscuro (Dark / Light Mode)
  // ──────────────────────────────────────────────────────────
  const applyTheme = (theme) => {
    if (theme === 'light') {
      body.classList.add('light-mode');
    } else {
      body.classList.remove('light-mode');
    }
    // Actualizar emoji del botón
    if (themeToggle) {
      themeToggle.textContent = theme === 'light' ? '☀️' : '🌙';
    }
  };

  // Cargar preferencia guardada
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = body.classList.contains('light-mode') ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  }

  // ──────────────────────────────────────────────────────────
  // 4. Animaciones al hacer scroll (Intersection Observer)
  // ──────────────────────────────────────────────────────────
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0) {
    const scrollObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Solo animar una vez
          }
        });
      },
      { threshold: 0.15, rootMargin: '-50px' }
    );

    animatedElements.forEach((el) => scrollObserver.observe(el));
  }

  // ──────────────────────────────────────────────────────────
  // 5. Efecto de navbar al hacer scroll
  // ──────────────────────────────────────────────────────────
  const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // ──────────────────────────────────────────────────────────
  // 6. Resaltado del enlace de navegación activo
  // ──────────────────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

  const highlightActiveLink = () => {
    const scrollPos = window.scrollY + 120; // Offset para mejor detección

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinksAll.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  // ──────────────────────────────────────────────────────────
  // 7. Smooth scroll para enlaces internos
  // ──────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const offsetTop = targetEl.offsetTop - 80; // Altura del navbar

      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });

  // ──────────────────────────────────────────────────────────
  // 8. Botón "Volver arriba"
  // ──────────────────────────────────────────────────────────
  const handleBackToTop = () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ──────────────────────────────────────────────────────────
  // Listener unificado de scroll (rendimiento)
  // ──────────────────────────────────────────────────────────
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleNavbarScroll();
        highlightActiveLink();
        handleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Ejecutar una vez al cargar para estado inicial
  handleNavbarScroll();
  highlightActiveLink();
  handleBackToTop();

  // ──────────────────────────────────────────────────────────
  // 9. Acordeón de preguntas frecuentes (FAQ)
  // ──────────────────────────────────────────────────────────
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
      const parentItem = question.closest('.faq-item');
      const isActive = parentItem.classList.contains('active');

      // Cerrar todos los demás ítems (comportamiento acordeón)
      document.querySelectorAll('.faq-item.active').forEach((item) => {
        if (item !== parentItem) {
          item.classList.remove('active');
        }
      });

      // Alternar el ítem actual
      parentItem.classList.toggle('active', !isActive);
    });
  });

  // ──────────────────────────────────────────────────────────
  // 10. Lightbox de galería
  // ──────────────────────────────────────────────────────────
  const galleryItems = document.querySelectorAll('.gallery-item');

  const openLightbox = (src, alt) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Imagen ampliada';
    lightbox.classList.add('active');
    body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    body.style.overflow = '';
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  // Cerrar al hacer clic en el fondo
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ──────────────────────────────────────────────────────────
  // 11. Tarjetas de enfermedades — expandir / colapsar
  // ──────────────────────────────────────────────────────────
  const diseaseToggles = document.querySelectorAll('.disease-toggle');

  diseaseToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.disease-card');
      if (!card) return;

      const isExpanded = card.classList.toggle('expanded');
      btn.textContent = isExpanded ? 'Ver menos ▲' : 'Ver más ▼';
    });
  });

  // ──────────────────────────────────────────────────────────
  // 12. Contadores animados
  // ──────────────────────────────────────────────────────────
  const counters = document.querySelectorAll('.counter');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 2000; // milisegundos
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: desaceleración suave
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(step);
  };

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => counterObserver.observe(c));
  }

  // ──────────────────────────────────────────────────────────
  // 13. Efecto de cursor parpadeante en el héroe
  // ──────────────────────────────────────────────────────────
  const heroSubtitle = document.querySelector('.hero-subtitle');

  if (heroSubtitle) {
    const cursor = document.createElement('span');
    cursor.classList.add('blinking-cursor');
    cursor.textContent = '|';
    cursor.style.cssText = `
      display: inline-block;
      margin-left: 4px;
      font-weight: 300;
      animation: blink 1s step-end infinite;
    `;

    heroSubtitle.appendChild(cursor);

    // Inyectar keyframes si no existen
    if (!document.querySelector('#blink-keyframes')) {
      const style = document.createElement('style');
      style.id = 'blink-keyframes';
      style.textContent = `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ──────────────────────────────────────────────────────────
  // 14. Micro-efecto parallax en el héroe (solo escritorio)
  // ──────────────────────────────────────────────────────────
  if (heroSection && window.innerWidth > 768) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Desplazamiento sutil (máx ±15px)
      const moveX = ((clientX - centerX) / centerX) * 15;
      const moveY = ((clientY - centerY) / centerY) * 15;

      heroSection.style.backgroundPosition =
        `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
    });

    // Restaurar posición al salir del héroe
    heroSection.addEventListener('mouseleave', () => {
      heroSection.style.backgroundPosition = 'center center';
    });
  }

  // ──────────────────────────────────────────────────────────
  // 15. Partículas flotantes de bacterias en el héroe
  // ──────────────────────────────────────────────────────────
  const createFloatingBacteria = () => {
    if (!heroSection) return;

    // Contenedor de partículas
    const container = document.createElement('div');
    container.classList.add('floating-bacteria-container');
    container.style.cssText = `
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 1;
    `;
    heroSection.style.position = heroSection.style.position || 'relative';
    heroSection.appendChild(container);

    // Inyectar animación de flotación
    if (!document.querySelector('#float-keyframes')) {
      const style = document.createElement('style');
      style.id = 'float-keyframes';
      style.textContent = `
        @keyframes floatParticle {
          0%   { transform: translateY(0)   rotate(0deg);   }
          25%  { transform: translateY(-30px) rotate(90deg);  }
          50%  { transform: translateY(-10px) rotate(180deg); }
          75%  { transform: translateY(-40px) rotate(270deg); }
          100% { transform: translateY(0)   rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    // Generar entre 20 y 30 partículas
    const count = Math.floor(Math.random() * 11) + 20;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      const size = Math.random() * 5 + 3;             // 3–8 px
      const left = Math.random() * 100;                // posición horizontal %
      const top = Math.random() * 100;                 // posición vertical %
      const opacity = Math.random() * 0.4 + 0.1;      // 0.1–0.5
      const duration = Math.random() * 6 + 4;          // 4–10 s
      const delay = Math.random() * 5;                 // 0–5 s

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        top: ${top}%;
        background: rgba(255, 255, 255, ${opacity});
        border-radius: 50%;
        animation: floatParticle ${duration}s ${delay}s ease-in-out infinite;
        pointer-events: none;
      `;

      container.appendChild(particle);
    }
  };

  createFloatingBacteria();

  // ──────────────────────────────────────────────────────────
  // Mensaje de confirmación en consola (útil en desarrollo)
  // ──────────────────────────────────────────────────────────
  console.log(
    '%c🦠 Cocos — página cargada correctamente',
    'color: #00e5ff; font-size: 14px; font-weight: bold;'
  );
});
