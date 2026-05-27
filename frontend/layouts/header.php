<?php
if (!defined('CURRENT_PAGE')) {
  $current_page = basename($_SERVER['PHP_SELF'], '.php');
  define('CURRENT_PAGE', $current_page);
}
?>
<header class="site-header" id="site-header">
  <nav class="nav-container">
    <a href="<?php echo (strpos($_SERVER['PHP_SELF'], '/resources/') !== false) ? '../index.php' : 'index.php'; ?>" class="logo" aria-label="STEL Bolivia - Inicio">
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
      href="logo1.png" 
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
        <a href="<?php echo (strpos($_SERVER['PHP_SELF'], '/resources/') !== false) ? '../index.html' : 'index.html'; ?>"
          class="nav-link <?php echo CURRENT_PAGE === 'index' ? 'active' : ''; ?>">Inicio</a>
      </li>
      <li>
        <a href="<?php echo (strpos($_SERVER['PHP_SELF'], '/resources/') !== false) ? 'empresa.html' : 'resources/empresa.html'; ?>"
          class="nav-link <?php echo CURRENT_PAGE === 'empresa' ? 'active' : ''; ?>">Empresa</a>
      </li>
      <li>
        <a href="<?php echo (strpos($_SERVER['PHP_SELF'], '/resources/') !== false) ? 'planes.html' : 'resources/planes.html'; ?>"
          class="nav-link <?php echo CURRENT_PAGE === 'planes' ? 'active' : ''; ?>">Planes</a>
      </li>
      <li>
        <a href="<?php echo (strpos($_SERVER['PHP_SELF'], '/resources/') !== false) ? 'ofertas.html' : 'resources/ofertas.html'; ?>"
          class="nav-link <?php echo CURRENT_PAGE === 'ofertas' ? 'active' : ''; ?>">Ofertas</a>
      </li>
      <li>
        <a href="<?php echo (strpos($_SERVER['PHP_SELF'], '/resources/') !== false) ? 'comunicados.html' : 'resources/comunicados.html'; ?>"
          class="nav-link <?php echo CURRENT_PAGE === 'comunicados' ? 'active' : ''; ?>">Comunicados</a>
      </li>
      <li>
        <a href="<?php echo (strpos($_SERVER['PHP_SELF'], '/resources/') !== false) ? 'contacto.html' : 'resources/contacto.html'; ?>"
          class="nav-link nav-link--cta <?php echo CURRENT_PAGE === 'contacto' ? 'active' : ''; ?>">Contacto</a>
      </li>
    </ul>
  </nav>
</header>