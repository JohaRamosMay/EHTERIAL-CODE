<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Sanitizar y validar campos
    $name = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $subject = htmlspecialchars(trim($_POST['subject'] ?? 'Mensaje desde formulario web'));
    $message = htmlspecialchars(trim($_POST['message'] ?? ''));

    // Validación mínima
    if (!$name || !$email || !$message) {
        echo "Todos los campos son obligatorios.";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Email inválido.";
        exit;
    }

    // Configurar el envío
    $to = "joha.g.ramos@gmail.com";
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-type: text/plain; charset=utf-8\r\n";
    $mailBody = "Nombre: $name\nEmail: $email\n\nMensaje:\n$message";

    // Enviar correo
    if (mail($to, $subject, $mailBody, $headers)) {
        echo "OK"; 
    } else {
        echo "Error al enviar el correo. Intenta más tarde.";
    }
} else {
    echo "Acceso no permitido.";
}
?>
