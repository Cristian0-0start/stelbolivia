# Configuración de Supabase para STEL Bolivia

## Esquema de Base de Datos

### 1. Tabla: `clientes`
```sql
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_protegido VARCHAR(10) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  ci VARCHAR(20) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(255),
  fecha_registro TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(50) DEFAULT 'activo'
);
```

### 2. Tabla: `servicios_contratados`
```sql
CREATE TABLE servicios_contratados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  tipo_servicio VARCHAR(100),
  velocidad_mbps NUMERIC,
  plan_nombre VARCHAR(255),
  fecha_contratacion TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(50) DEFAULT 'activo'
);
```

### 3. Tabla: `comunicados`
```sql
CREATE TABLE comunicados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  resumen TEXT,
  contenido TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT NOW(),
  autor VARCHAR(255) DEFAULT 'STEL Bolivia',
  categoria VARCHAR(100),
  estado VARCHAR(50) DEFAULT 'publicado'
);
```

### 4. Tabla: `solicitudes_planes` (Opcional)
```sql
CREATE TABLE solicitudes_planes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  tipo_plan VARCHAR(100) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente',
  fecha_solicitud TIMESTAMP DEFAULT NOW()
);
```

## Row Level Security (RLS)

### Políticas para `comunicados` (Público - Lectura)
```sql
ALTER TABLE comunicados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comunicados lectura pública"
  ON comunicados FOR SELECT
  USING (estado = 'publicado');

CREATE POLICY "Comunicados edición admin"
  ON comunicados FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
```

### Políticas para `clientes` (Restringido)
```sql
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cliente acceso propio"
  ON clientes FOR SELECT
  USING (id::text = auth.uid()::text OR auth.jwt() ->> 'role' = 'admin');
```

### Políticas para `servicios_contratados` (Restringido)
```sql
ALTER TABLE servicios_contratados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Servicios acceso por cliente"
  ON servicios_contratados FOR SELECT
  USING (cliente_id::text = auth.uid()::text OR auth.jwt() ->> 'role' = 'admin');
```

## Pasos en Dashboard de Supabase

1. Ir a: **Project Settings** → **Database** → **SQL Editor**
2. Ejecutar los scripts `CREATE TABLE` anteriores
3. Ir a: **Authentication** → **Policies** → Configurar RLS como se indica
4. Copiar las credenciales en:
   - Project URL → `SUPABASE_URL` en `frontend/assets/supabase-client.js`
   - Anon Key → `SUPABASE_ANON_KEY` en `frontend/assets/supabase-client.js`

## Datos de Prueba

```sql
INSERT INTO clientes (codigo_protegido, nombre, ci, telefono) VALUES
  ('STL-00001', 'Juan Pérez', '12345678', '+591 71234567'),
  ('STL-00002', 'María González', '87654321', '+591 72345678');

INSERT INTO comunicados (titulo, resumen, contenido, categoria, autor) VALUES
  ('Mantenimiento de Red', 'Se realizará mantenimiento programado', 'El próximo sábado realizaremos mantenimiento...', 'Mantenimiento', 'STEL Bolivia'),
  ('Nueva Promoción', 'Velocidades aumentadas', 'A partir de esta semana ofrecemos...', 'Promoción', 'Dirección Comercial');
```
# Configuración de Supabase para STEL Bolivia

## Esquema de Base de Datos

### 1. Tabla: `clientes`
```sql
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_protegido VARCHAR(10) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  ci VARCHAR(20) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(255),
  fecha_registro TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(50) DEFAULT 'activo'
);
```

### 2. Tabla: `servicios_contratados`
```sql
CREATE TABLE servicios_contratados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  tipo_servicio VARCHAR(100),
  velocidad_mbps NUMERIC,
  plan_nombre VARCHAR(255),
  fecha_contratacion TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(50) DEFAULT 'activo'
);
```

### 3. Tabla: `comunicados`
```sql
CREATE TABLE comunicados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  resumen TEXT,
  contenido TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT NOW(),
  autor VARCHAR(255) DEFAULT 'STEL Bolivia',
  categoria VARCHAR(100),
  estado VARCHAR(50) DEFAULT 'publicado'
);
```

### 4. Tabla: `solicitudes_planes` (Opcional)
```sql
CREATE TABLE solicitudes_planes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  tipo_plan VARCHAR(100) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente',
  fecha_solicitud TIMESTAMP DEFAULT NOW()
);
```

## Row Level Security (RLS)

### Políticas para `comunicados` (Público - Lectura)
```sql
ALTER TABLE comunicados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comunicados lectura pública"
  ON comunicados FOR SELECT
  USING (estado = 'publicado');

CREATE POLICY "Comunicados edición admin"
  ON comunicados FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
```

### Políticas para `clientes` (Restringido)
```sql
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cliente acceso propio"
  ON clientes FOR SELECT
  USING (id::text = auth.uid()::text OR auth.jwt() ->> 'role' = 'admin');
```

### Políticas para `servicios_contratados` (Restringido)
```sql
ALTER TABLE servicios_contratados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Servicios acceso por cliente"
  ON servicios_contratados FOR SELECT
  USING (cliente_id::text = auth.uid()::text OR auth.jwt() ->> 'role' = 'admin');
```

## Pasos en Dashboard de Supabase

1. Ir a: **Project Settings** → **Database** → **SQL Editor**
2. Ejecutar los scripts `CREATE TABLE` anteriores
3. Ir a: **Authentication** → **Policies** → Configurar RLS como se indica
4. Copiar las credenciales en:
   - Project URL → `SUPABASE_URL` en `frontend/assets/supabase-client.js`
   - Anon Key → `SUPABASE_ANON_KEY` en `frontend/assets/supabase-client.js`

## Datos de Prueba

```sql
INSERT INTO clientes (codigo_protegido, nombre, ci, telefono) VALUES
  ('STL-00001', 'Juan Pérez', '12345678', '+591 71234567'),
  ('STL-00002', 'María González', '87654321', '+591 72345678');

INSERT INTO comunicados (titulo, resumen, contenido, categoria, autor) VALUES
  ('Mantenimiento de Red', 'Se realizará mantenimiento programado', 'El próximo sábado realizaremos mantenimiento...', 'Mantenimiento', 'STEL Bolivia'),
  ('Nueva Promoción', 'Velocidades aumentadas', 'A partir de esta semana ofrecemos...', 'Promoción', 'Dirección Comercial');
```