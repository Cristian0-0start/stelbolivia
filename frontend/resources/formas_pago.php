<?php
/**
 * Formas de Pago API
 * Este archivo servirá como API para manejar formas de pago
 * Posteriormente se conectará a Supabase para persistencia de datos
 * 
 * @author STEL Bolivia
 * @version 1.0
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Método HTTP
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Base de datos temporal en memoria (será reemplazada con Supabase)
$paymentMethods = [
    [
        'id' => 1,
        'type' => 'tarjeta',
        'name' => 'Tarjeta de Crédito/Débito',
        'reference' => 'CARD-001',
        'description' => 'Realiza pagos seguros con tu tarjeta',
        'instructions' => 'Ingresa los datos de tu tarjeta',
        'status' => 'activo',
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ],
    [
        'id' => 2,
        'type' => 'transferencia',
        'name' => 'Transferencia Directa',
        'reference' => 'TRANS-001',
        'description' => 'Transferencia desde tu cuenta bancaria',
        'instructions' => 'Realiza una transferencia a nuestra cuenta',
        'status' => 'activo',
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ],
    [
        'id' => 3,
        'type' => 'qr',
        'name' => 'Pago por QR',
        'reference' => 'QR-001',
        'description' => 'Escanea el código QR',
        'instructions' => 'Usa tu app bancaria para escanear',
        'status' => 'activo',
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ],
    [
        'id' => 4,
        'type' => 'billetera',
        'name' => 'Billetera Electrónica',
        'reference' => 'WALLET-001',
        'description' => 'Usa tu billetera digital',
        'instructions' => 'Compatible con PayPal, Google Pay, Apple Pay',
        'status' => 'activo',
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ]
];

/**
 * Obtener todas las formas de pago o una específica
 */
if ($method === 'GET') {
    if ($action === 'get_all') {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $paymentMethods,
            'count' => count($paymentMethods)
        ]);
    } elseif ($action === 'get_active') {
        $active = array_filter($paymentMethods, fn($m) => $m['status'] === 'activo');
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => array_values($active),
            'count' => count($active)
        ]);
    } elseif (!empty($action)) {
        $id = intval($action);
        $method_found = null;
        foreach ($paymentMethods as $pm) {
            if ($pm['id'] === $id) {
                $method_found = $pm;
                break;
            }
        }
        
        if ($method_found) {
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $method_found
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Forma de pago no encontrada'
            ]);
        }
    }
}

/**
 * Crear nueva forma de pago
 */
elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['type']) || !isset($input['name']) || !isset($input['reference'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Faltan campos requeridos: type, name, reference'
        ]);
        exit;
    }
    
    $newMethod = [
        'id' => max(array_column($paymentMethods, 'id')) + 1,
        'type' => sanitizeInput($input['type']),
        'name' => sanitizeInput($input['name']),
        'reference' => sanitizeInput($input['reference']),
        'description' => sanitizeInput($input['description'] ?? ''),
        'instructions' => sanitizeInput($input['instructions'] ?? ''),
        'status' => sanitizeInput($input['status'] ?? 'activo'),
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ];
    
    $paymentMethods[] = $newMethod;
    
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Forma de pago creada exitosamente',
        'data' => $newMethod
    ]);
}

/**
 * Actualizar forma de pago
 */
elseif ($method === 'PUT') {
    $id = intval($action);
    $input = json_decode(file_get_contents('php://input'), true);
    
    $found = false;
    foreach ($paymentMethods as &$pm) {
        if ($pm['id'] === $id) {
            if (isset($input['type'])) $pm['type'] = sanitizeInput($input['type']);
            if (isset($input['name'])) $pm['name'] = sanitizeInput($input['name']);
            if (isset($input['reference'])) $pm['reference'] = sanitizeInput($input['reference']);
            if (isset($input['description'])) $pm['description'] = sanitizeInput($input['description']);
            if (isset($input['instructions'])) $pm['instructions'] = sanitizeInput($input['instructions']);
            if (isset($input['status'])) $pm['status'] = sanitizeInput($input['status']);
            $pm['updated_at'] = date('Y-m-d H:i:s');
            
            $found = true;
            $updated = $pm;
            break;
        }
    }
    
    if ($found) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Forma de pago actualizada exitosamente',
            'data' => $updated
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Forma de pago no encontrada'
        ]);
    }
}

/**
 * Eliminar forma de pago
 */
elseif ($method === 'DELETE') {
    $id = intval($action);
    
    $initialCount = count($paymentMethods);
    $paymentMethods = array_filter($paymentMethods, fn($m) => $m['id'] !== $id);
    
    if (count($paymentMethods) < $initialCount) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Forma de pago eliminada exitosamente'
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Forma de pago no encontrada'
        ]);
    }
}

/**
 * Manejar OPTIONS para CORS
 */
elseif ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método HTTP no permitido'
    ]);
}

/**
 * Sanitizar entrada
 */
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}
?>
