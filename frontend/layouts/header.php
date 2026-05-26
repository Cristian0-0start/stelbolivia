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
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="28" height="28" rx="8" fill="#0a56e8" />
          <path d="M7 14 L14 7 L21 14 L14 21 Z" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round" />
          <circle cx="14" cy="14" r="3" fill="white" />
        </svg>
      </span>
      <span class="logo-text">STEL</span>
    </a>

    <button class="nav-toggle" id="nav-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-menu">
      <span></span><span></span><span></span>
    </button>

    <ul class="nav-links" id="nav-menu" role="list">
      <li>
        <a href="<?php echo (strpos($_SERVER['PHP_SELF'], '/resources/') !== false) ? '../index.php' : 'index.php'; ?>"
          class="nav-link <?php echo CURRENT_PAGE === 'index' ? 'active' : ''; ?>">Inicio</a>
      </li>
      <li>
        <a href="<?php echo (strpos($_SERVER['PHP_SELF'], '/resources/') !== false) ? 'empresa.php' : 'resources/empresa.php'; ?>"
          class="nav-link <?php echo CURRENT_PAGE === 'empresa' ? 'active' : ''; ?>">Empresa</a>
      </li>
      <li>
        <a href="<?php echo (strpos($_SERVER['PHP_SELF'], '/resources/') !== false) ? 'planes.php' : 'resources/planes.php'; ?>"
          class="nav-link <?php echo CURRENT_PAGE === 'planes' ? 'active' : ''; ?>">Planes</a>
      </li>
      <li>
        <a href="<?php echo (strpos($_SERVER['PHP_SELF'], '/resources/') !== false) ? 'ofertas.php' : 'resources/ofertas.php'; ?>"
          class="nav-link <?php echo CURRENT_PAGE === 'ofertas' ? 'active' : ''; ?>">Ofertas</a>
      </li>
      <li>
        <a href="<?php echo (strpos($_SERVER['PHP_SELF'], '/resources/') !== false) ? 'comunicados.php' : 'resources/comunicados.php'; ?>"
          class="nav-link <?php echo CURRENT_PAGE === 'comunicados' ? 'active' : ''; ?>">Comunicados</a>
      </li>
      <li>
        <a href="<?php echo (strpos($_SERVER['PHP_SELF'], '/resources/') !== false) ? 'contacto.php' : 'resources/contacto.php'; ?>"
          class="nav-link nav-link--cta <?php echo CURRENT_PAGE === 'contacto' ? 'active' : ''; ?>">Contacto</a>
      </li>
    </ul>
  </nav>
</header>
<div class="nav-overlay" id="nav-overlay"></div>