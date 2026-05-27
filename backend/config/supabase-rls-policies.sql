-- ============================================================
-- STEL Bolivia — Supabase RLS & Security Policies
-- Ejecutar en SQL Editor de Supabase después de crear tablas
-- ============================================================

-- ============================================================
-- TABLA: comunicados (Lectura pública)
-- ============================================================
ALTER TABLE IF EXISTS comunicados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comunicados lectura publica" ON comunicados;
DROP POLICY IF EXISTS "Comunicados escritura admin" ON comunicados;

CREATE POLICY "Comunicados lectura publica"
  ON comunicados FOR SELECT
  USING (true);

CREATE POLICY "Comunicados escritura admin"
  ON comunicados FOR INSERT, UPDATE, DELETE
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.uid()::text = 'admin-user-id');

-- ============================================================
-- TABLA: clientes (Acceso restringido)
-- ============================================================
ALTER TABLE IF EXISTS clientes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clientes lectura propia" ON clientes;
DROP POLICY IF EXISTS "Clientes lectura admin" ON clientes;

CREATE POLICY "Clientes lectura propia"
  ON clientes FOR SELECT
  USING (id::text = auth.uid()::text);

CREATE POLICY "Clientes lectura admin"
  ON clientes FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================
-- TABLA: servicios_contratados (Acceso por cliente)
-- ============================================================
ALTER TABLE IF EXISTS servicios_contratados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Servicios lectura cliente" ON servicios_contratados;
DROP POLICY IF EXISTS "Servicios lectura admin" ON servicios_contratados;

CREATE POLICY "Servicios lectura cliente"
  ON servicios_contratados FOR SELECT
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Servicios lectura admin"
  ON servicios_contratados FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================
-- TABLA: solicitudes_planes (Acceso por cliente)
-- ============================================================
ALTER TABLE IF EXISTS solicitudes_planes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Solicitudes lectura cliente" ON solicitudes_planes;
DROP POLICY IF EXISTS "Solicitudes escritura cliente" ON solicitudes_planes;
DROP POLICY IF EXISTS "Solicitudes admin" ON solicitudes_planes;

CREATE POLICY "Solicitudes lectura cliente"
  ON solicitudes_planes FOR SELECT
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Solicitudes escritura cliente"
  ON solicitudes_planes FOR INSERT
  WITH CHECK (cliente_id::text = auth.uid()::text);

CREATE POLICY "Solicitudes admin"
  ON solicitudes_planes FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================
-- Indices para Performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_clientes_codigo ON clientes(codigo_protegido);
CREATE INDEX IF NOT EXISTS idx_servicios_cliente ON servicios_contratados(cliente_id);
CREATE INDEX IF NOT EXISTS idx_comunicados_fecha ON comunicados(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_comunicados_estado ON comunicados(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_planes(estado);
-- ============================================================
-- STEL Bolivia — Supabase RLS & Security Policies
-- Ejecutar en SQL Editor de Supabase después de crear tablas
-- ============================================================

-- ============================================================
-- TABLA: comunicados (Lectura pública)
-- ============================================================
ALTER TABLE IF EXISTS comunicados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comunicados lectura publica" ON comunicados;
DROP POLICY IF EXISTS "Comunicados escritura admin" ON comunicados;

CREATE POLICY "Comunicados lectura publica"
  ON comunicados FOR SELECT
  USING (true);

CREATE POLICY "Comunicados escritura admin"
  ON comunicados FOR INSERT, UPDATE, DELETE
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.uid()::text = 'admin-user-id');

-- ============================================================
-- TABLA: clientes (Acceso restringido)
-- ============================================================
ALTER TABLE IF EXISTS clientes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clientes lectura propia" ON clientes;
DROP POLICY IF EXISTS "Clientes lectura admin" ON clientes;

CREATE POLICY "Clientes lectura propia"
  ON clientes FOR SELECT
  USING (id::text = auth.uid()::text);

CREATE POLICY "Clientes lectura admin"
  ON clientes FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================
-- TABLA: servicios_contratados (Acceso por cliente)
-- ============================================================
ALTER TABLE IF EXISTS servicios_contratados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Servicios lectura cliente" ON servicios_contratados;
DROP POLICY IF EXISTS "Servicios lectura admin" ON servicios_contratados;

CREATE POLICY "Servicios lectura cliente"
  ON servicios_contratados FOR SELECT
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Servicios lectura admin"
  ON servicios_contratados FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================
-- TABLA: solicitudes_planes (Acceso por cliente)
-- ============================================================
ALTER TABLE IF EXISTS solicitudes_planes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Solicitudes lectura cliente" ON solicitudes_planes;
DROP POLICY IF EXISTS "Solicitudes escritura cliente" ON solicitudes_planes;
DROP POLICY IF EXISTS "Solicitudes admin" ON solicitudes_planes;

CREATE POLICY "Solicitudes lectura cliente"
  ON solicitudes_planes FOR SELECT
  USING (cliente_id::text = auth.uid()::text);

CREATE POLICY "Solicitudes escritura cliente"
  ON solicitudes_planes FOR INSERT
  WITH CHECK (cliente_id::text = auth.uid()::text);

CREATE POLICY "Solicitudes admin"
  ON solicitudes_planes FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================
-- Indices para Performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_clientes_codigo ON clientes(codigo_protegido);
CREATE INDEX IF NOT EXISTS idx_servicios_cliente ON servicios_contratados(cliente_id);
CREATE INDEX IF NOT EXISTS idx_comunicados_fecha ON comunicados(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_comunicados_estado ON comunicados(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_planes(estado);