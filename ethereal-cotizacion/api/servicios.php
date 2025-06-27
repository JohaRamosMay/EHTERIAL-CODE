<?php
require 'db.php';


$cotizacion_dolar_blue = 1200.00; 

try {
 
    $context = stream_context_create(['http' => ['timeout' => 3]]);
    $response = file_get_contents('https://api.bluelytics.com.ar/v2/latest', false, $context);
    
    if ($response) {
        $data = json_decode($response, true);
      
        if (isset($data['blue']['value_avg'])) {
            $cotizacion_dolar_blue = $data['blue']['value_avg'];
        }
    }
} catch (Exception $e) {
}

$servicios_db = $pdo->query("SELECT id, nombre, precio as precio_ars FROM servicios")->fetchAll(PDO::FETCH_ASSOC);
$extras_db = $pdo->query("SELECT id, nombre, precio as precio_ars FROM extras")->fetchAll(PDO::FETCH_ASSOC);

$respuesta = [
    "cotizacion_dolar" => $cotizacion_dolar_blue,
    "servicios" => $servicios_db,
    "extras" => $extras_db
];

header('Content-Type: application/json');
echo json_encode($respuesta);