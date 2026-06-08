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
//c
    const headerHTML = `
  <nav class="nav-container">
    <a href="${basePath}index.html" class="logo" aria-label="STEL Bolivia - Inicio">
<span class="logo-icon">
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <!-- Rectángulo blanco de fondo -->
    
    
    <!-- Imagen recortada con el borde redondeado -->
    <defs>
      <clipPath id="roundedClip">
        <rect width="28" height="28" rx="8"/>
      </clipPath>
    </defs>
    
    <!-- Imagen dentro del SVG con clip-path -->
    <image 
      href="/logo1.png" 
      width="28" 
      height="28" 
      preserveAspectRatio="xMidYMid slice"
      clip-path="url(#roundedClip)"
    />
  </svg>
</span>
      <span class="logo-text">TEL</span>
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
                navMenu.classList.toggle('active');
            });
        }
    }
});
