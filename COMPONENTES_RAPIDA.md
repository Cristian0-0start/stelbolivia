# 🔧 GUÍA RÁPIDA - COMPONENTES CSS DISPONIBLES

## 🎯 Quick Reference

### Botones
```html
<button class="btn btn-primary">Primario (Degradé)</button>
<button class="btn btn-secondary">Secundario (Borde)</button>
<button class="btn btn-ghost">Ghost (Transparente)</button>
```

### Contenedores
```html
<!-- Ancho máximo 1400px, centrado -->
<div class="container">
    Contenido centrado
</div>

<!-- Sección con padding -->
<section class="section">
    Contenido en sección
</section>
```

### Tarjetas
```html
<div class="card">
    <h3>Título</h3>
    <p>Descripción</p>
</div>
```

### Tipografía
```html
<h1>Encabezado H1</h1>
<h2>Encabezado H2</h2>
<h3>Encabezado H3</h3>
<p>Párrafo normal</p>
<a href="#">Link</a>
```

### Modales
```html
<div class="modal" id="miModal">
    <div class="modal-content">
        <button class="modal-close" onclick="cerrarModal()">&times;</button>
        <h2>Contenido del Modal</h2>
        <p>Contenido aquí</p>
    </div>
</div>

<script>
    function cerrarModal() {
        document.getElementById('miModal').classList.remove('active');
    }
    document.getElementById('miModal').classList.add('active'); // Abrir
</script>
```

### Grid Responsivo
```html
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
</div>
```

### Redes Sociales (Footer Style)
```html
<div class="social-links">
    <a href="#" class="social-link" title="Facebook">
        <svg><!-- icono --></svg>
    </a>
</div>
```

### Hero Section
```html
<section style="background: var(--gradient-primary); color: white; padding: 80px 0;">
    <div class="container">
        <h1>Hero Title</h1>
        <p>Descripción</p>
    </div>
</section>
```

---

## 🎨 Variables CSS por Categoría

### Colores
- `--color-blanco` → `#f8f9fa`
- `--color-blanco-oscuro` → `#f0f1f3`
- `--color-negro` → `#1a1a1a`
- `--color-negro-claro` → `#2d2d2d`
- `--color-gris-medio` → `#6b7280`
- `--color-success` → `#10b981`
- `--color-warning` → `#f59e0b`
- `--color-error` → `#ef4444`
- `--color-info` → `#3b82f6`

### Degradés
- `--gradient-primary` → Púrpura a Violeta
- `--gradient-secondary` → Rosa a Rojo
- `--gradient-tertiary` → Azul a Cian
- `--gradient-dark` → Gris oscuro a Negro

### Espaciado
- `--spacing-xs` → 0.25rem
- `--spacing-sm` → 0.5rem
- `--spacing-md` → 1rem
- `--spacing-lg` → 1.5rem
- `--spacing-xl` → 2rem
- `--spacing-2xl` → 3rem
- `--spacing-3xl` → 4rem

### Tipografía
- `--font-family-primary` → Segoe UI, sans-serif
- `--font-family-heading` → Poppins, sans-serif
- `--font-size-base` → 1rem
- `--font-size-lg` → 1.125rem
- `--font-size-xl` → 1.25rem
- `--font-size-2xl` → 1.5rem
- `--font-size-3xl` → 1.875rem
- `--font-size-4xl` → 2.25rem

### Sombras
- `--shadow-sm` → Sutil
- `--shadow-md` → Medio
- `--shadow-lg` → Grande
- `--shadow-xl` → Muy grande

### Bordes Redondeados
- `--radius-sm` → 0.375rem
- `--radius-md` → 0.5rem
- `--radius-lg` → 0.75rem
- `--radius-xl` → 1rem
- `--radius-full` → 9999px (circular)

### Transiciones
- `--transition-fast` → 150ms
- `--transition-base` → 250ms
- `--transition-slow` → 350ms

---

## 📱 Breakpoints Responsivos

```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Desktop pequeño */
@media (max-width: 1024px) { }

/* Desktop grande */
@media (max-width: 1280px) { }
```

---

## 🔗 Incluir en todas las páginas

### Al inicio (head)
```html
<link rel="stylesheet" href="assets/styles.css">
```

### Después del body
```php
<?php include 'layouts/header.php'; ?>
```

### Antes del cierre del body
```php
<?php include 'layouts/footer.php'; ?>
<script src="assets/script.js"></script>
```

---

## ✨ Ejemplos Combinados

### Página Completa Mínima
```php
<!DOCTYPE html>
<html lang="es">
<head>
    <title>Mi Página | Stel</title>
    <link rel="stylesheet" href="../assets/styles.css">
</head>
<body>
    <?php include '../layouts/header.php'; ?>
    <main>
        <section class="section">
            <div class="container">
                <h1>Mi Página</h1>
                <div class="card">
                    <p>Contenido</p>
                </div>
            </div>
        </section>
    </main>
    <?php include '../layouts/footer.php'; ?>
    <script src="../assets/script.js"></script>
</body>
</html>
```

### Tarjetas en Grid
```html
<section class="section">
    <div class="container">
        <h2>Nuestros Servicios</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
            <div class="card">
                <h3>Servicio 1</h3>
                <p>Descripción</p>
            </div>
            <div class="card">
                <h3>Servicio 2</h3>
                <p>Descripción</p>
            </div>
            <div class="card">
                <h3>Servicio 3</h3>
                <p>Descripción</p>
            </div>
        </div>
    </div>
</section>
```

### Botones Diversos
```html
<div style="display: flex; gap: 10px; flex-wrap: wrap;">
    <button class="btn btn-primary">Acción Principal</button>
    <button class="btn btn-secondary">Acción Secundaria</button>
    <button class="btn btn-ghost">Cancelar</button>
</div>
```

---

## 🎯 Tips & Tricks

1. **Usar variables CSS** en lugar de valores hardcodeados
   ```css
   background: var(--gradient-primary);
   padding: var(--spacing-lg);
   ```

2. **Combinar clases** para diferentes estados
   ```html
   <a class="nav-link active">Link activo</a>
   ```

3. **Responsive grid**
   ```html
   <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
   ```

4. **Smooth scroll activado** - Haz scroll por defecto suave

5. **Modales automáticos** - Usa la clase `.active` para mostrar/ocultar

---

**¿Necesitas ayuda con un componente específico?** Pregunta directamente.
