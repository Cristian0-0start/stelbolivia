document.addEventListener("DOMContentLoaded", function() {
    console.log('Header.js cargado'); // Debug
    
    const path = window.location.pathname;
    const isResourcePage = path.includes('/resources/');
    const basePath = isResourcePage ? '../' : '';
    
    const filename = path.split('/').pop();
    let activePage = 'index';
    if (filename) {
        activePage = filename.replace('.html', '').replace('.php', '') || 'index';
    }

    const headerHTML = `
    <header class="site-header" id="site-header">
      <nav class="nav-container">
        <a href="${homeHref}" class="logo" aria-label="STEL Bolivia - Inicio">
          <span class="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="28" height="28" rx="8" fill="#0a56e8"/>
              <path d="M7 14 L14 7 L21 14 L14 21 Z" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round"/>
              <circle cx="14" cy="14" r="3" fill="white"/>
            </svg>
          </span>
          <span class="logo-text">STEL</span>
        </a>

        <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-menu">
          <span></span><span></span><span></span>
        </button>

        <ul class="nav-links" id="nav-menu" role="list">
          <li><a href="${homeHref}" class="nav-link ${activePage === 'index' ? 'active' : ''}">Inicio</a></li>
          <li><a href="${basePath}resources/empresa.html" class="nav-link ${activePage === 'empresa' ? 'active' : ''}">Empresa</a></li>
          <li><a href="${planesHref}" class="nav-link ${activePage === 'planes' ? 'active' : ''}">Planes</a></li>
          <li><a href="${basePath}resources/ofertas.html" class="nav-link ${activePage === 'ofertas' ? 'active' : ''}">Ofertas</a></li>
          <li><a href="${comunicadosHref}" class="nav-link ${activePage === 'comunicados' ? 'active' : ''}">Comunicados</a></li>
          <li><a href="${contactoHref}" class="nav-link nav-link--cta ${activePage === 'contacto' ? 'active' : ''}">Contacto</a></li>
        </ul>
      </nav>
    </header>
    <div class="nav-overlay" id="nav-overlay" aria-hidden="true"></div>`;

    const headerPlaceholder = document.getElementById('header-placeholder');
    
    if (!headerPlaceholder) {
        console.error('No se encontró #header-placeholder');
        return;
    }
    
    // Insertar el HTML
    headerPlaceholder.innerHTML = headerHTML;
    console.log('Header insertado'); // Debug
    
    // Inicializar menú después de un pequeño delay
    setTimeout(function() {
        initMobileMenu();
    }, 100);
});

function initMobileMenu() {
    console.log('Inicializando menú móvil...'); // Debug
    
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    
    console.log('Toggle:', navToggle); // Debug
    console.log('Menu:', navMenu); // Debug
    console.log('Overlay:', navOverlay); // Debug
    
    if (!navToggle || !navMenu) {
        console.error('Elementos del menú no encontrados');
        return;
    }
    
    function openMenu() {
        console.log('Abriendo menú'); // Debug
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Cerrar menú');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        console.log('Cerrando menú'); // Debug
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
    }
    
    // Click en hamburguesa
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Click en toggle'); // Debug
        const isOpen = navMenu.classList.contains('active');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Click en overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', function() {
            console.log('Click en overlay'); // Debug
            closeMenu();
        });
    }
    
    // Tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
            navToggle.focus();
        }
    });
    
    // Clic en links del menú
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                setTimeout(closeMenu, 300);
            }
        });
    });
    
    console.log('Menú inicializado correctamente'); // Debug
}