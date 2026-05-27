# STEL Bolivia — Guía de Pruebas Locales

## Requisitos Previos

1. **Tener Supabase configurado** (Paso 2 completado)
2. **PHP local corriendo** (XAMPP)
3. **Navegador moderno** (Chrome, Firefox, Safari, Edge)

## Prueba 1: Comunicados Página (HTML + JS)

### Configurar Supabase
1. Ir a: https://supabase.com → Crear proyecto o usar existente
2. En **SQL Editor**, ejecutar `backend/config/supabase-rls-policies.sql`
3. En **Project Settings**, copiar:
   - **Project URL** (ej: `https://yvskyrkzeuwwvjwkhjbo.supabase.co`)
   - **Anon Key** (ej: `sb_publishable_mli30K8sVDLv92GZ2a9F9Q_4VBFvjoz`)

### Insertar datos de prueba
```sql
INSERT INTO comunicados (titulo, resumen, contenido, categoria, autor, estado) VALUES
  (
    'Mantenimiento Programado',
    'Se realizará mantenimiento de red este sábado.',
    'Estimados clientes, informamos que el próximo sábado de 02:00 a 06:00 realizaremos mantenimiento preventivo. El servicio estará temporalmente interrumpido.',
    'Mantenimiento',
    'Equipo Técnico STEL',
    'publicado'
  ),
  (
    'Nueva Velocidad de Internet',
    'Aumentamos velocidades sin costo adicional',
    'A partir de esta semana, todos nuestros planes tendrán un incremento automático de velocidad. Los clientes de Internet 50 Mbps pasarán a 75 Mbps...',
    'Promoción',
    'Dirección Comercial',
    'publicado'
  );
```

### Probar en navegador
1. Abrir: `http://localhost/stelbolivia/frontend/resources/comunicados.html`
2. **Debería ver:**
   - ✓ Texto "INFORMACIÓN OFICIAL" (sin caracteres corrompidos)
   - ✓ Estadísticas: Total, Este mes, Última semana
   - ✓ Búsqueda funcional
   - ✓ Filtro de fechas (7, 30, 90, 365 días)
   - ✓ Tarjetas de comunicados cargadas desde Supabase
   - ✓ Paginación (si hay más de 6 items)

### Probar Modal
1. Hacer clic en cualquier tarjeta de comunicado
2. **Debería:**
   - ✓ Abrirse modal con contenido completo
   - ✓ Mostrar título, fecha, autor, contenido
   - ✓ Botón "×" funcional
   - ✓ Cerrar con ESC
   - ✓ Cerrar al hacer clic fuera (en el fondo oscuro)
   - ✓ Focus en el botón cerrar después de abrir

### Probar búsqueda
1. Escribir en el campo de búsqueda: "Mantenimiento"
2. **Debería:** Filtrar y mostrar solo "Mantenimiento Programado"

### Probar filtro de fechas
1. Seleccionar "Últimos 7 días"
2. **Debería:** Mostrar solo comunicados de los últimos 7 días

## Prueba 2: Dashboard (Login + Datos de Cliente)

### Datos de prueba para clientes
```sql
INSERT INTO clientes (codigo_protegido, nombre, ci, telefono, email, estado) VALUES
  ('STL-00001', 'Juan Pérez', '12345678', '+591 71234567', 'juan@example.com', 'activo'),
  ('STL-00002', 'María González', '87654321', '+591 72345678', 'maria@example.com', 'activo');

INSERT INTO servicios_contratados (cliente_id, tipo_servicio, velocidad_mbps, plan_nombre, estado) VALUES
  (
    (SELECT id FROM clientes WHERE codigo_protegido = 'STL-00001'),
    'Internet',
    75,
    'Plan Plus 75 Mbps',
    'activo'
  ),
  (
    (SELECT id FROM clientes WHERE codigo_protegido = 'STL-00001'),
    'TV Streaming',
    NULL,
    'Pack TV+Internet',
    'activo'
  );
```

### Probar login
1. Abrir: `http://localhost/stelbolivia/frontend/resources/dashboard.html`
2. Ingresar código: `STL-00001`
3. **Debería:**
   - ✓ Validar código
   - ✓ Cargar datos del cliente (Juan Pérez)
   - ✓ Mostrar servicios contratados (Internet 75 Mbps, TV)
   - ✓ Mostrar tabla con estado de servicios

## Consola del Navegador - Debugging

Para ver errores y logs:
1. Abrir DevTools: `F12` o `Ctrl+Shift+I`
2. Tab **Console**
3. **Buscar:**
   - `"Supabase no configurado"` → URL/Key incorrectas
   - `"42501"` o `"permission denied"` → RLS policies falta
   - `"Error al obtener comunicados"` → Revisar conexión

## Checklist de Validación

### ✓ Encoding (UTF-8)
- [ ] Texto "INFORMACIÓN" visible correctamente
- [ ] Búsqueda por "última semana" sin caracteres rotos

### ✓ CSS
- [ ] Estilos se aplican (colores, bordes, animaciones)
- [ ] Responsive: funciona en móvil (F12 → Ctrl+Shift+M)
- [ ] Sin errores CSS en consola

### ✓ Comunicados
- [ ] Carga desde Supabase
- [ ] Búsqueda filtra correctamente
- [ ] Modal abre/cierra (click, ESC, botón X)
- [ ] Focus trap en modal

### ✓ Dashboard
- [ ] Login con código
- [ ] Muestra datos del cliente
- [ ] Tabla de servicios cargada
- [ ] Logout funciona

### ✓ Performance
- [ ] Página carga en <3s
- [ ] Modal sin lag
- [ ] Sin múltiples peticiones Supabase

## Resolución de Problemas

### "Supabase no está configurado"
```
Solución: En Dashboard → Haz clic ⚙️ → Ingresa URL y Anon Key → Guardar
```

### Modal no cierra con ESC
```
Verificar: comunicados-app.js línea ~250+ (event listener para 'Escape')
```

### Caracteres rotos (ñ, ú, é)
```
Verificar: comunicados.html meta charset UTF-8 en <head>
Solución: Guardar archivo en encoding UTF-8
```

### Estilos no aplican
```
Verificar: styles.css está en frontend/assets/
Verificar: <link rel="stylesheet" href="../assets/styles.css"> en HTML
```

## Contacto & Soporte

Para reportar problemas:
1. Incluir: URL, navegador, pasos para reproducir
2. Adjuntar screenshot o log de consola
3. Enviar a: soporte@stelbolivia.com
