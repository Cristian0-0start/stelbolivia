/**
 * STEL Bolivia — Comunicados (solo datos desde Supabase)
 */
(function () {
    'use strict';

    function escapeHtml(text) {
        if (text == null) return '';
        const el = document.createElement('div');
        el.textContent = String(text);
        return el.innerHTML;
    }

    function formatFecha(fecha, options) {
        const d = new Date(fecha);
        if (Number.isNaN(d.getTime())) return '';
        return d.toLocaleDateString('es-BO', options);
    }

    function mensajeErrorConexion(error) {
        const code = error && (error.code || error.status);
        const msg = (error && error.message) || '';
        if (code === '42501' || msg.includes('permission denied')) {
            return 'No se puede leer la tabla comunicados. En Supabase ejecute el script backend/config/supabase-permisos.sql (GRANT SELECT + políticas RLS).';
        }
        if (msg.includes('Supabase no configurado')) {
            return 'Supabase no está configurado. Ingrese URL y Anon Key en el Panel de Control.';
        }
        return 'No se pudo conectar con la base de datos. Verifique su conexión y las credenciales en el Panel de Control.';
    }

    /**
     * @param {HTMLElement} container
     * @param {string} message
     */
    function mostrarEstadoError(container, message) {
        if (!container) return;
        container.innerHTML = `
            <div class="empty-state" style="display:block; grid-column: 1 / -1;">
                <div class="empty-icon">⚠️</div>
                <h3>No se pudieron cargar los comunicados</h3>
                <p>${escapeHtml(message)}</p>
            </div>
        `;
    }

    /**
     * Vista previa en la página de inicio (últimos N comunicados).
     */
    async function initHomePreview(options) {
        const limit = (options && options.limit) || 3;
        const previewEl = document.getElementById('homeComunicadosPreview');
        const tagsEl = document.getElementById('homeComunicadosTags');
        if (!previewEl) return;

        async function renderLista(lista) {
            const items = (lista || []).slice(0, limit);
            if (!items.length) {
                previewEl.innerHTML = '<p class="home-comunicados-empty">Aún no hay comunicados publicados.</p>';
                if (tagsEl) tagsEl.innerHTML = '';
                return;
            }

            previewEl.innerHTML = items.map((com) => `
                <article class="home-comunicado-card">
                    <div class="home-comunicado-meta">
                        <time datetime="${escapeHtml(com.fecha)}">${formatFecha(com.fecha)}</time>
                        <span class="home-comunicado-cat">${escapeHtml(com.categoria)}</span>
                    </div>
                    <h3>${escapeHtml(com.titulo)}</h3>
                    <p>${escapeHtml(com.resumen)}</p>
                    <a href="resources/comunicados.html" class="home-comunicado-link">Leer más →</a>
                </article>
            `).join('');

            if (tagsEl) {
                const categorias = [...new Set(items.map((c) => c.categoria).filter(Boolean))];
                tagsEl.innerHTML = categorias
                    .map((cat) => `<div class="comm-tag">${escapeHtml(cat)}</div>`)
                    .join('');
            }
        }

        async function cargar() {
            previewEl.innerHTML = '<p class="home-comunicados-loading">Cargando novedades...</p>';
            const { data, error } = await obtenerComunicados();
            if (error) {
                previewEl.innerHTML = `<p class="home-comunicados-error">${escapeHtml(mensajeErrorConexion(error))}</p>`;
                return;
            }
            await renderLista(data);
        }

        await cargar();
        suscribirComunicados((data) => renderLista(data));
    }

    /**
     * Página completa de comunicados (listado, filtros, modal, paginación).
     */
    function initComunicadosPage() {
        const container = document.getElementById('comunicadosContainer');
        const emptyState = document.getElementById('emptyState');
        const paginationDiv = document.getElementById('pagination');
        const modal = document.getElementById('comunicadoModal');
        const modalBody = document.getElementById('modalBody');
        const searchInput = document.getElementById('searchInput');
        const filterDate = document.getElementById('filterDate');

        if (!container) return;

        let activeComunicados = [];
        let filteredComunicados = [];
        let currentPage = 1;
        const itemsPerPage = 6;

        function updateStats() {
            const totalEl = document.getElementById('totalCount');
            const monthEl = document.getElementById('monthCount');
            const weekEl = document.getElementById('weekCount');
            if (!totalEl) return;

            const now = new Date();
            const monthAgo = new Date(now);
            monthAgo.setMonth(now.getMonth() - 1);
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);

            totalEl.textContent = activeComunicados.length;
            monthEl.textContent = activeComunicados.filter((c) => new Date(c.fecha) > monthAgo).length;
            weekEl.textContent = activeComunicados.filter((c) => new Date(c.fecha) > weekAgo).length;
        }

        function filterComunicados() {
            const searchTerm = (searchInput && searchInput.value || '').toLowerCase();
            const dateFilter = filterDate && filterDate.value;

            filteredComunicados = activeComunicados.filter((com) => {
                const titulo = (com.titulo || '').toLowerCase();
                const resumen = (com.resumen || '').toLowerCase();
                const contenido = (com.contenido || '').toLowerCase();
                const matchesSearch =
                    !searchTerm ||
                    titulo.includes(searchTerm) ||
                    resumen.includes(searchTerm) ||
                    contenido.includes(searchTerm);

                let matchesDate = true;
                if (dateFilter) {
                    const days = parseInt(dateFilter, 10);
                    const cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - days);
                    matchesDate = new Date(com.fecha) >= cutoffDate;
                }

                return matchesSearch && matchesDate;
            });

            currentPage = 1;
            renderComunicados();
            renderPagination();
        }

        function renderComunicados() {
            const start = (currentPage - 1) * itemsPerPage;
            const paginatedItems = filteredComunicados.slice(start, start + itemsPerPage);

            if (!paginatedItems.length) {
                container.innerHTML = '';
                if (emptyState) emptyState.style.display = 'block';
                if (paginationDiv) paginationDiv.style.display = 'none';
                return;
            }

            if (emptyState) emptyState.style.display = 'none';
            if (paginationDiv) paginationDiv.style.display = 'flex';

            container.innerHTML = paginatedItems
                .map(
                    (com) => `
                <div class="comunicado-card" data-id="${escapeHtml(com.id)}" role="button" tabindex="0">
                    <div>
                        <span class="comunicado-date">${formatFecha(com.fecha)}</span>
                        <span class="comunicado-category">${escapeHtml(com.categoria)}</span>
                    </div>
                    <h3 class="comunicado-title">${escapeHtml(com.titulo)}</h3>
                    <p class="comunicado-resumen">${escapeHtml(com.resumen)}</p>
                    <div class="read-more">
                        Leer comunicado completo
                        <span>→</span>
                    </div>
                </div>
            `
                )
                .join('');

            container.querySelectorAll('.comunicado-card').forEach((card) => {
                const id = card.getAttribute('data-id');
                const open = () => abrirModal(id);
                card.addEventListener('click', open);
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        open();
                    }
                });
            });
        }

        function renderPagination() {
            if (!paginationDiv) return;
            const totalPages = Math.ceil(filteredComunicados.length / itemsPerPage);

            if (totalPages <= 1) {
                paginationDiv.style.display = 'none';
                return;
            }

            paginationDiv.style.display = 'flex';
            paginationDiv.innerHTML = '';

            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `page-btn${i === currentPage ? ' active' : ''}`;
                btn.textContent = String(i);
                btn.addEventListener('click', () => {
                    currentPage = i;
                    renderComunicados();
                    renderPagination();
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                });
                paginationDiv.appendChild(btn);
            }
        }

        function abrirModal(id) {
            const comunicado = filteredComunicados.find((c) => String(c.id) === String(id));
            if (!comunicado || !modalBody || !modal) return;

            modalBody.innerHTML = `
                <div>
                    <span class="modal-date">${formatFecha(comunicado.fecha, { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    <span class="comunicado-category" style="margin-left: 12px;">${escapeHtml(comunicado.categoria)}</span>
                </div>
                <h2 class="modal-title" id="modalTitle">${escapeHtml(comunicado.titulo)}</h2>
                <div class="modal-author">Por: ${escapeHtml(comunicado.autor)}</div>
                <div class="modal-divider"></div>
                <div class="modal-content-text">${escapeHtml(comunicado.contenido).replace(/\n/g, '<br>')}</div>
            `;
            modal.classList.add('active');
            
            // Focus en el botón cerrar para accesibilidad
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) closeBtn.focus();
        }

        window.cerrarModal = function cerrarModal() {
            if (modal) {
                modal.classList.remove('active');
                // Retornar focus al botón que abrió el modal (si existe)
                const activeCard = document.querySelector('.comunicado-card:focus');
                if (activeCard) activeCard.focus();
            }
        };

        async function aplicarDatos(lista) {
            activeComunicados = Array.isArray(lista) ? lista : [];
            updateStats();
            filterComunicados();
        }

        async function cargarComunicados() {
            container.innerHTML = `
                <div class="loading-state" style="grid-column: 1 / -1;">
                    <div class="spinner"></div>
                    <p>Cargando comunicados oficiales...</p>
                </div>
            `;
            if (emptyState) emptyState.style.display = 'none';

            const { data, error } = await obtenerComunicados();
            if (error) {
                mostrarEstadoError(container, mensajeErrorConexion(error));
                if (paginationDiv) paginationDiv.style.display = 'none';
                return;
            }

            await aplicarDatos(data);
        }

        if (searchInput) searchInput.addEventListener('input', filterComunicados);
        if (filterDate) filterDate.addEventListener('change', filterComunicados);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) window.cerrarModal();
            });
            
            // Cerrar modal con tecla ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    window.cerrarModal();
                }
            });
        }

        cargarComunicados();
        suscribirComunicados((data) => aplicarDatos(data));
    }

    window.StelComunicadosApp = {
        initHomePreview,
        initComunicadosPage,
    };
})();
