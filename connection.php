<?php
// Configuración de la base de datos
$servername = "sql302.infinityfree.com";
$username = "if0_39600956";
$password = "danielito2025";
$database = "if0_39600956_AdidasAssets";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
// Establece el conjunto de caracteres a UTF-8
$conn->set_charset("utf8mb4");

?>