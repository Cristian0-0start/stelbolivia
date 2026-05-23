-- Ejecutar en Supabase → SQL Editor si la web no puede leer comunicados (error 42501)
-- Aplica permisos de lectura pública y habilita actualización en tiempo real.

-- Permisos de tabla para roles anon/authenticated
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.comunicados TO anon, authenticated;
GRANT SELECT ON public.clientes TO anon, authenticated;
GRANT INSERT, UPDATE ON public.clientes TO anon, authenticated;
GRANT SELECT, INSERT ON public.servicios_contratados TO anon, authenticated;
GRANT SELECT, INSERT ON public.solicitudes_planes TO anon, authenticated;

-- RLS (por si la tabla ya existe sin políticas)
ALTER TABLE public.comunicados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura pública de comunicados" ON public.comunicados;
CREATE POLICY "Permitir lectura pública de comunicados" ON public.comunicados
    FOR SELECT USING (true);

-- Tiempo real: cambios en Supabase se reflejan en la web
ALTER PUBLICATION supabase_realtime ADD TABLE public.comunicados;
