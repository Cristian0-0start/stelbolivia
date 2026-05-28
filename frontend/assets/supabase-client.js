/**
 * STEL Bolivia — Supabase Client Wrapper
 * Maneja la inicialización y consultas comunes a Supabase.
 */

const DEFAULT_SUPABASE_URL = 'https://yvskyrkzeuwwvjwkhjbo.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_mli30K8sVDLv92GZ2a9F9Q_4VBFvjoz';

/**
 * Normaliza la URL del proyecto (sin /rest/v1 ni barra final).
 * @param {string} url
 */
function normalizeSupabaseUrl(url) {
    if (!url || typeof url !== 'string') return '';
    let normalized = url.trim().replace(/\/+$/, '');
    normalized = normalized.replace(/\/rest\/v1\/?$/i, '');
    return normalized;
}

(function migrarUrlSupabaseGuardada() {
    const guardada = localStorage.getItem('stel_supabase_url');
    if (!guardada) return;
    const normalizada = normalizeSupabaseUrl(guardada);
    if (normalizada && normalizada !== guardada) {
        localStorage.setItem('stel_supabase_url', normalizada);
    }
})();

const SUPABASE_URL = normalizeSupabaseUrl(
    localStorage.getItem('stel_supabase_url') || DEFAULT_SUPABASE_URL
);
const SUPABASE_ANON_KEY = (
    localStorage.getItem('stel_supabase_anon_key') || DEFAULT_SUPABASE_ANON_KEY
).trim();

let supabaseInstance = null;

function resetSupabaseClient() {
    supabaseInstance = null;
}

/**
 * Inicializa y retorna la instancia del cliente Supabase
 */
function getSupabaseClient() {
    if (supabaseInstance) return supabaseInstance;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn('Supabase no está configurado. Configure la URL y Anon Key en el panel del Dashboard.');
        return null;
    }

    try {
        if (typeof supabase !== 'undefined') {
            supabaseInstance = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            return supabaseInstance;
        }
        console.error(
            "SDK de Supabase no cargado. Incluya el script de @supabase/supabase-js antes de supabase-client.js."
        );
        return null;
    } catch (error) {
        console.error('Error al inicializar el cliente de Supabase:', error);
        return null;
    }
}

/**
 * Guarda credenciales en localStorage y reinicia el cliente.
 * @param {string} url
 * @param {string} anonKey
 */
function guardarConfigSupabase(url, anonKey) {
    const normalizedUrl = normalizeSupabaseUrl(url);
    const key = (anonKey || '').trim();
    if (!normalizedUrl || !key) return false;
    localStorage.setItem('stel_supabase_url', normalizedUrl);
    localStorage.setItem('stel_supabase_anon_key', key);
    resetSupabaseClient();
    return true;
}

async function obtenerClientePorCodigo(codigo) {
    const client = getSupabaseClient();
    if (!client) return { error: 'Supabase no configurado' };

    try {
        const { data, error } = await client
            .from('clientes')
            .select('*')
            .eq('codigo_protegido', codigo.trim().toUpperCase())
            .single();

        if (error) throw error;
        return { data };
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        return { error };
    }
}

async function obtenerServiciosPorCliente(clienteId) {
    const client = getSupabaseClient();
    if (!client) return { error: 'Supabase no configurado' };

    try {
        const { data, error } = await client
            .from('servicios_contratados')
            .select('*')
            .eq('cliente_id', clienteId);

        if (error) throw error;
        return { data };
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        return { error };
    }
}

async function crearSolicitudPlan(datos) {
    const client = getSupabaseClient();
    if (!client) return { error: 'Supabase no configurado' };

    try {
        const { data, error } = await client
            .from('solicitudes_planes')
            .insert([datos])
            .select()
            .single();

        if (error) throw error;
        return { data };
    } catch (error) {
        console.error('Error al registrar solicitud:', error);
        return { error };
    }
}

async function registrarClienteNuevo(datos) {
    const client = getSupabaseClient();
    if (!client) return { error: 'Supabase no configurado' };

    try {
        const { data, error } = await client
            .from('clientes')
            .insert([datos])
            .select()
            .single();

        if (error) throw error;
        return { data };
    } catch (error) {
        console.error('Error al registrar cliente:', error);
        return { error };
    }
}

/**
 * Obtiene los comunicados oficiales desde Supabase (ordenados por fecha).
 */
async function obtenerComunicados() {
    const client = getSupabaseClient();
    if (!client) return { error: 'Supabase no configurado', data: null };

    try {
        const { data, error } = await client
            .from('comunicados')
            .select('id, titulo, resumen, contenido, fecha, autor, categoria')
            .order('fecha', { ascending: false });

        if (error) throw error;
        return { data: data || [] };
    } catch (error) {
        console.error('Error al obtener comunicados:', error);
        return { error, data: null };
    }
}

/**
 * Suscripción en tiempo real: al insertar/actualizar/borrar en Supabase, refresca la web.
 * @param {function(Array): void} onUpdate
 * @returns {object|null} canal de Supabase
 */
function suscribirComunicados(onUpdate) {
    const client = getSupabaseClient();
    if (!client || typeof onUpdate !== 'function') return null;

    const channel = client
        .channel('stel-comunicados-public')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'comunicados' },
            async () => {
                const { data, error } = await obtenerComunicados();
                if (!error && Array.isArray(data)) onUpdate(data);
            }
        )
        .subscribe();

    return channel;
}

function generarCodigoUsuario() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `STL-${code}`;
}
