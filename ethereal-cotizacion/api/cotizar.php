<?php
require 'db.php';


$data = json_decode(file_get_contents("php://input"), true);


$nombre = trim($data['nombre'] ?? '');
$email = trim($data['email'] ?? '');
$servicio_id = $data['servicio_id'] ?? null;
$extras_json = json_encode($data['extras'] ?? []); 
$total_ars = $data['total_ars'] ?? 0; 

if (!$nombre || !$email || !$servicio_id) {
    echo json_encode(['status' => 'error', 'msg' => 'Faltan datos requeridos.']);
    exit;
}


$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->execute([$email]);
$usuario = $stmt->fetch();

if (!$usuario) {
   
    $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, email) VALUES (?, ?)");
    $stmt->execute([$nombre, $email]);
    $usuario_id = $pdo->lastInsertId();
} else {
    
    $usuario_id = $usuario['id'];
}


$stmt = $pdo->prepare("INSERT INTO cotizaciones (usuario_id, servicio_id, extras, total) VALUES (?, ?, ?, ?)");
$stmt->execute([$usuario_id, $servicio_id, $extras_json, $total_ars]);

echo json_encode(['status' => 'ok', 'msg' => 'Cotización guardada.']);