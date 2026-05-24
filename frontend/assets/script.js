/* assets/script.js — STEL Bolivia */

(function () {
  'use strict';

  /* ── Header scroll shadow ── */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile nav toggle ── */
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    /* Close on link click */
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
      });
    });

    /* Close on outside click */
    document.addEventListener('click', e => {
      if (!header.contains(e.target) && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Fade-in on scroll (IntersectionObserver) ── */
  const animTargets = document.querySelectorAll(
    '.service-card, .plan-card, .why-card, .comm-tag, .hero-stat, .home-comunicado-card'
  );

  if ('IntersectionObserver' in window && animTargets.length) {
    const style = document.createElement('style');
    style.textContent = `
      .will-animate { opacity: 0; transform: translateY(20px); transition: opacity .5s ease, transform .5s ease; }
      .will-animate.visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);

    animTargets.forEach((el, i) => {
      el.classList.add('will-animate');
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    animTargets.forEach(el => obs.observe(el));
  }

})();

// ===== HEADER AUTO-HIDE/SHOW EN SCROLL =====
document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('site-header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Crear overlay para móvil
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    
    // ===== LÓGICA DE AUTO-HIDE/SHOW =====
    let lastScrollY = window.pageYOffset;
    let scrollTimeout;
    const scrollThreshold = 40; // Distancia mínima de scroll para activar hide/show
    const topThreshold = 40; // Distancia desde el top donde siempre se muestra
    
    function handleHeaderVisibility() {
        const currentScrollY = window.pageYOffset;
        
        // Siempre mostrar el header si está cerca del top
        if (currentScrollY < topThreshold) {
            header.classList.remove('hidden');
            header.classList.add('at-top');
            if (currentScrollY > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScrollY = currentScrollY;
            return;
        }
        
        // Remover clase at-top cuando no está en el top
        header.classList.remove('at-top');
        
        // Determinar dirección del scroll
        const scrollingDown = currentScrollY > lastScrollY;
        const scrollDifference = Math.abs(currentScrollY - lastScrollY);
        
        // Solo activar hide/show si hay suficiente diferencia de scroll
        if (scrollDifference > scrollThreshold) {
            if (scrollingDown && currentScrollY > 200) {
                // Scrolling hacia abajo - ocultar header
                header.classList.add('hidden');
            } else if (!scrollingDown) {
                // Scrolling hacia arriba - mostrar header
                header.classList.remove('hidden');
            }
        }
        
        // Efecto scrolled cuando no está en el top
        if (currentScrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Guardar posición actual para la próxima comparación
        lastScrollY = currentScrollY;
    }
    
    // Throttle para mejor rendimiento
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleHeaderVisibility();
                ticking = false;
            });
            ticking = true;
        }
        
        // Mostrar header temporalmente cuando el usuario hace scroll rápido hacia arriba
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            const currentScrollY = window.pageYOffset;
            if (currentScrollY < topThreshold) {
                header.classList.remove('hidden');
            }
        }, 150);
    });
    
    // Mostrar header cuando el mouse está cerca del top
    
    
    // Ejecutar verificación inicial
    handleHeaderVisibility();
    
    // ===== MENÚ MÓVIL =====
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            this.setAttribute('aria-expanded', !isExpanded);
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Prevenir scroll cuando el menú está abierto
            document.body.style.overflow = isExpanded ? '' : 'hidden';
            
            // Asegurar que el header esté visible cuando el menú está abierto
            if (!isExpanded) {
                header.classList.remove('hidden');
            }
        });
        
        // Cerrar menú al hacer clic en overlay
        overlay.addEventListener('click', closeMenu);
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Cerrar menú con tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }
    
    function closeMenu() {
        if (navToggle && navMenu) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Tema claro / oscuro
    const themeToggle = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('stel-theme');
    const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const initialTheme = storedTheme || preferredTheme;

    function setTheme(theme) {
        document.body.classList.toggle('theme-light', theme === 'light');
        document.body.classList.toggle('theme-dark', theme === 'dark');
        localStorage.setItem('stel-theme', theme);
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? 'Oscuro' : 'Claro';
            themeToggle.setAttribute('aria-label', theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro');
        }
    }

    if (themeToggle) {
        setTheme(initialTheme);
        themeToggle.addEventListener('click', function () {
            const current = document.body.classList.contains('theme-light') ? 'light' : 'dark';
            setTheme(current === 'light' ? 'dark' : 'light');
        });
    }
    
    // Ajustar para cambios de tamaño de ventana
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
                closeMenu();
            }
        }, 250);
    });
    
    // Prevenir que el header se oculte durante interacciones con el teclado
    let isTabPressed = false;
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            isTabPressed = true;
            header.classList.remove('hidden');
        }
    });
    
    document.addEventListener('mousedown', function() {
        isTabPressed = false;
    });
});
// ===== ANIMACIONES PARA PÁGINA EMPRESA =====
document.addEventListener('DOMContentLoaded', function() {
    
    // Animación de contadores
    function animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const hasPlus = text.includes('+');
            const hasPercent = text.includes('%');
            const number = parseFloat(text.replace(/[+%]/g, ''));
            
            if (isNaN(number)) return;
            
            let start = 0;
            const duration = 2000;
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing suave
                const easeOut = 1 - Math.pow(1 - progress, 3);
                
                if (hasPercent) {
                    const current = (number * easeOut).toFixed(1);
                    stat.textContent = current + '%';
                } else {
                    const current = Math.floor(number * easeOut);
                    stat.textContent = current + (hasPlus ? '+' : '');
                }
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        });
    }
    
    // Observer para activar animaciones cuando son visibles
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // Animación de timeline items al hacer scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateX(-20px)';
                entry.target.style.transition = 'all 0.5s ease-out';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
                
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
});
// ===== HERO CAROUSEL =====
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    if (slides.length > 0 && dots.length > 0) {
        let currentSlide = 0;
        const slideCount = slides.length;
        const slideInterval = 6000; // 6 seconds per slide
        let autoSlide;

        function goToSlide(index) {
            // Remove active from current
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            // Set new current
            currentSlide = index;
            
            // Add active to new
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % slideCount);
        }

        autoSlide = setInterval(nextSlide, slideInterval);

        // Allow manual dot clicking
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(autoSlide); // Reset timer
                goToSlide(index);
                autoSlide = setInterval(nextSlide, slideInterval);
            });
        });
    }
});

/* ===== FLOATING HAMBURGER MENU ===== */
document.addEventListener('DOMContentLoaded', function() {
    // Create floating hamburger button
    const floatingHamburger = document.createElement('button');
    floatingHamburger.className = 'floating-hamburger';
    floatingHamburger.setAttribute('aria-label', 'Menú de contacto flotante');
    floatingHamburger.innerHTML = '<span></span><span></span><span></span>';
    
    // Create floating menu
    const floatingMenu = document.createElement('nav');
    floatingMenu.className = 'floating-menu';
    floatingMenu.innerHTML = `
        <div class="floating-menu-title">Contacto Rápido</div>
        <a href="resources/contacto.html" class="floating-menu-link">Formulario de Contacto</a>
        <a href="tel:+591" class="floating-menu-link">Llamar Ahora</a>
        <a href="resources/planes.html" class="floating-menu-link">Ver Planes</a>
        <a href="resources/empresa.html" class="floating-menu-link">Para Empresas</a>
    `;
    
    // Add to DOM
    document.body.appendChild(floatingHamburger);
    document.body.appendChild(floatingMenu);
    
    // Toggle menu
    floatingHamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        const isActive = floatingHamburger.classList.toggle('active');
        floatingMenu.classList.toggle('active', isActive);
    });
    
    // Close menu when clicking on a link
    floatingMenu.querySelectorAll('.floating-menu-link').forEach(link => {
        link.addEventListener('click', function() {
            floatingHamburger.classList.remove('active');
            floatingMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!floatingHamburger.contains(e.target) && !floatingMenu.contains(e.target)) {
            floatingHamburger.classList.remove('active');
            floatingMenu.classList.remove('active');
        }
    });
    
    // Close menu with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && floatingMenu.classList.contains('active')) {
            floatingHamburger.classList.remove('active');
            floatingMenu.classList.remove('active');
        }
    });
});