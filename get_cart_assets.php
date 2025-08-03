<?php
session_start();
require_once 'connection.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT a.id, a.name, a.file_path, a.type 
        FROM carts c
        JOIN assets a ON c.asset_id = a.id
        WHERE c.user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$assets = [];

while ($row = $result->fetch_assoc()) {
    $file_path = $row['file_path'];
    $type = strtolower($row['type']);
    $extension = pathinfo($file_path, PATHINFO_EXTENSION);
    
    $assets[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'file_path' => $file_path,
        'type' => $type,
        'format' => strtoupper($extension),
        'resolution' => 'Loading...'
    ];
}

echo json_encode(["success" => true, "assets" => $assets]);
