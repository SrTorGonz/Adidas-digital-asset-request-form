<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start(); // <- Iniciar la sesión al principio

header('Content-Type: application/json');

require_once "connection.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    if (empty($email) || empty($password)) {
        echo json_encode(["success" => false, "message" => "All fields are required"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, password_hash, role FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Database error"]);
        exit;
    }

    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password_hash'])) {
            // Iniciar sesión guardando el ID y rol
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_role'] = $user['role'];

            echo json_encode([
                "success" => true,
                "role" => $user['role'],
                "message" => "Login successful"
            ]);
            exit;
        } else {
            echo json_encode(["success" => false, "message" => "Invalid password"]);
            exit;
        }
    } else {
        echo json_encode(["success" => false, "message" => "Email not found"]);
        exit;
    }
}
?>