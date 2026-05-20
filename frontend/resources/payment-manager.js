/**
 * Payment Methods Manager
 * Maneja la lógica de las formas de pago
 * @author STEL Bolivia
 * @version 1.0
 */

class PaymentMethodsManager {
    constructor() {
        this.apiEndpoint = './formas_pago.php';
        this.paymentMethods = [];
        this.currentEditingId = null;
    }

    /**
     * Obtener todas las formas de pago del servidor
     */
    async fetchAllPaymentMethods() {
        try {
            const response = await fetch(`${this.apiEndpoint}?action=get_all`);
            const result = await response.json();
            
            if (result.success) {
                this.paymentMethods = result.data;
                return result.data;
            } else {
                console.error('Error al obtener métodos de pago:', result.message);
                return [];
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            return [];
        }
    }

    /**
     * Obtener solo las formas de pago activas
     */
    async fetchActivePaymentMethods() {
        try {
            const response = await fetch(`${this.apiEndpoint}?action=get_active`);
            const result = await response.json();
            
            if (result.success) {
                return result.data;
            } else {
                console.error('Error al obtener métodos activos:', result.message);
                return [];
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            return [];
        }
    }

    /**
     * Obtener una forma de pago específica
     */
    async fetchPaymentMethod(id) {
        try {
            const response = await fetch(`${this.apiEndpoint}?action=${id}`);
            const result = await response.json();
            
            if (result.success) {
                return result.data;
            } else {
                console.error('Método de pago no encontrado:', result.message);
                return null;
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            return null;
        }
    }

    /**
     * Crear una nueva forma de pago
     */
    async createPaymentMethod(data) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.paymentMethods.push(result.data);
                return { success: true, data: result.data };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error('Error al crear método de pago:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    /**
     * Actualizar una forma de pago existente
     */
    async updatePaymentMethod(id, data) {
        try {
            const response = await fetch(`${this.apiEndpoint}?action=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                const index = this.paymentMethods.findIndex(m => m.id === id);
                if (index !== -1) {
                    this.paymentMethods[index] = result.data;
                }
                return { success: true, data: result.data };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error('Error al actualizar método de pago:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    /**
     * Eliminar una forma de pago
     */
    async deletePaymentMethod(id) {
        try {
            const response = await fetch(`${this.apiEndpoint}?action=${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.paymentMethods = this.paymentMethods.filter(m => m.id !== id);
                return { success: true };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error('Error al eliminar método de pago:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    /**
     * Validar datos de forma de pago
     */
    validatePaymentData(data) {
        const errors = [];

        if (!data.type || data.type.trim() === '') {
            errors.push('El tipo de pago es requerido');
        }

        if (!data.name || data.name.trim() === '') {
            errors.push('El nombre es requerido');
        }

        if (!data.reference || data.reference.trim() === '') {
            errors.push('La referencia/código es requerido');
        }

        if (data.status && !['activo', 'inactivo'].includes(data.status)) {
            errors.push('El estado debe ser activo o inactivo');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Obtener icono según tipo de pago
     */
    getPaymentIcon(type) {
        const icons = {
            'tarjeta': '💳',
            'transferencia': '🏦',
            'qr': '📱',
            'billetera': '💰'
        };
        return icons[type] || '💸';
    }

    /**
     * Obtener nombre descriptivo del tipo de pago
     */
    getPaymentTypeName(type) {
        const names = {
            'tarjeta': 'Tarjeta Bancaria',
            'transferencia': 'Transferencia Bancaria',
            'qr': 'Código QR',
            'billetera': 'Billetera Digital'
        };
        return names[type] || 'Otro';
    }
}

// Crear instancia global
const paymentManager = new PaymentMethodsManager();

// Exportar para usar en otros módulos (si se necesita)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentMethodsManager;
}
