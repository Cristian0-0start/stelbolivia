document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname;
    const isResourcePage = path.includes('/resources/');
    const basePath = isResourcePage ? '../' : '';
    
    // Get filename to determine active page
    const filename = path.split('/').pop();
    let activePage = 'index';
    if (filename) {
        activePage = filename.replace('.html', '').replace('.php', '') || 'index';
    }

    const headerHTML = `
  <nav class="nav-container">
    <a href="${basePath}index.html" class="logo" aria-label="STEL Bolivia - Inicio">
      <span class="logo-icon">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="28" height="28" rx="8" fill="#0a56e8"/>
          <path d="M7 14 L14 7 L21 14 L14 21 Z" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round"/>
          <circle cx="14" cy="14" r="3" fill="white"/>
        </svg>
      </span>
      <span class="logo-text">STEL</span>
    </a>

    <button class="nav-toggle" id="nav-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-menu">
      <span></span><span></span><span></span>
    </button>

    <ul class="nav-links" id="nav-menu" role="list">
      <li>
        <a href="${basePath}index.html" class="nav-link ${activePage === 'index' ? 'active' : ''}">Inicio</a>
      </li>
      <li>
        <a href="${basePath}resources/empresa.html" class="nav-link ${activePage === 'empresa' ? 'active' : ''}">Empresa</a>
      </li>
      <li>
        <a href="${basePath}resources/planes.html" class="nav-link ${activePage === 'planes' ? 'active' : ''}">Planes</a>
      </li>
      <li>
        <a href="${basePath}resources/ofertas.html" class="nav-link ${activePage === 'ofertas' ? 'active' : ''}">Ofertas</a>
      </li>
      <li>
        <a href="${basePath}resources/formas_pago.html" class="nav-link ${activePage === 'formas_pago' ? 'active' : ''}" title="Métodos de pago disponibles">💳 Formas de Pago</a>
      </li>
      <li>
        <a href="${basePath}resources/comunicados.html" class="nav-link ${activePage === 'comunicados' ? 'active' : ''}">Comunicados</a>
      </li>
      <li>
        <a href="${basePath}resources/contacto.html" class="nav-link nav-link--cta ${activePage === 'contacto' ? 'active' : ''}">Contacto</a>
      </li>
    </ul>
  </nav>`;

    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
        headerPlaceholder.className = 'site-header';
        headerPlaceholder.id = 'site-header';
        
        // Navigation toggle logic
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const expanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !expanded);
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }
});
