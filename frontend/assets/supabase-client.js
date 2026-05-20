/**
 * STEL Bolivia — Supabase Client Wrapper
 * Maneja la inicialización y consultas comunes a Supabase.
 */

// Credenciales por defecto (puedes reemplazarlas aquí)
const DEFAULT_SUPABASE_URL = "https://yvskyrkzeuwwvjwkhjbo.supabase.co/rest/v1/";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_mli30K8sVDLv92GZ2a9F9Q_4VBFvjoz";

// Obtener credenciales de localStorage (permite configuración dinámica desde el Dashboard)
const SUPABASE_URL = localStorage.getItem('stel_supabase_url') || DEFAULT_SUPABASE_URL;
const SUPABASE_ANON_KEY = localStorage.getItem('stel_supabase_anon_key') || DEFAULT_SUPABASE_ANON_KEY;

let supabaseInstance = null;

/**
 * Inicializa y retorna la instancia del cliente Supabase
 */
function getSupabaseClient() {
    if (supabaseInstance) return supabaseInstance;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn("Supabase no está configurado. Configure la URL y Anon Key en el panel del Dashboard.");
        return null;
    }

    try {
        if (typeof supabase !== 'undefined') {
            supabaseInstance = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            return supabaseInstance;
        } else {
            console.error("SDK de Supabase no cargado. Asegúrese de incluir <script src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'></script> antes de este script.");
            return null;
        }
    } catch (error) {
        console.error("Error al inicializar el cliente de Supabase:", error);
        return null;
    }
}

/**
 * Busca un cliente por su código protegido
 * @param {string} codigo 
 */
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
        console.error("Error al obtener cliente:", error);
        return { error };
    }
}

/**
 * Obtiene los servicios contratados de un cliente por su ID de cliente (UUID)
 * @param {string} clienteId 
 */
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
        console.error("Error al obtener servicios:", error);
        return { error };
    }
}

/**
 * Inserta una solicitud de plan
 * @param {object} datos 
 */
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
        console.error("Error al registrar solicitud:", error);
        return { error };
    }
}

/**
 * Registra o actualiza un cliente en la base de datos
 * @param {object} datos 
 */
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
        console.error("Error al registrar cliente:", error);
        return { error };
    }
}

/**
 * Obtiene los comunicados oficiales
 */
async function obtenerComunicados() {
    const client = getSupabaseClient();
    if (!client) return { error: 'Supabase no configurado' };

    try {
        const { data, error } = await client
            .from('comunicados')
            .select('*')
            .order('fecha', { ascending: false });

        if (error) throw error;
        return { data };
    } catch (error) {
        console.error("Error al obtener comunicados:", error);
        return { error };
    }
}

/**
 * Genera un código de usuario protegido aleatorio único (ej: STL-59A2B)
 */
function generarCodigoUsuario() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `STL-${code}`;
}
