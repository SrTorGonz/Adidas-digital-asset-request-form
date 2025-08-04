<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'connection.php';

header('Content-Type: application/json');

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'], $data['role'])) {
    echo json_encode(["success" => false, "message" => "Faltan datos requeridos."]);
    exit;
}

$email = trim($data['email']);
$role = ($data['role'] === 'admin') ? 'admin' : 'user';  // validate role input

// Generate username from email (before the @)
$username = explode("@", $email)[0];

// Check if username or email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
$stmt->bind_param("ss", $username, $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Ya existe un usuario con ese correo o nombre."]);
    exit;
}
$stmt->close();

// Generate random password
$passwordPlain = bin2hex(random_bytes(4));
$passwordHash = password_hash($passwordPlain, PASSWORD_DEFAULT);

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Error en prepare(): " . $conn->error]);
    exit;
}
$stmt->bind_param("ssss", $username, $passwordHash, $email, $role);

if ($stmt->execute()) {
    // Send email to new user
    $subject = "your Adidas Assets account has been created";
    $message = "Hello,\n\nYour account has been created by the administrator.\n\n".
               "Username: $username\nEmail: $email\nPassword: $passwordPlain\n\n".
               "Log in to the system and change your password.\n\nRegards,\nAdidas Assets";
    $headers = "From: no-reply@adidasassets.rf.gd";

    if (mail($email, $subject, $message, $headers)) {
        echo json_encode(["success" => true, "message" => "User registered and email sent."]);
    } else {
        echo json_encode(["success" => true, "message" => "User registered, but email could not be sent."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error registering: " . $stmt->error]);
}
$stmt->close();
