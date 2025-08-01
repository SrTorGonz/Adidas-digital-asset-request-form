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
    $full_path = __DIR__ . '/' . $file_path;
    $format = 'Unknown';
    $resolution = 'Unknown';

    if (file_exists($full_path)) {
        $img_info = getimagesize($full_path);
        if ($img_info) {
            $format = image_type_to_extension($img_info[2], false); // png, jpg...
            $resolution = "{$img_info[0]}x{$img_info[1]}";
        }
    }

    $assets[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'file_path' => $file_path,
        'type' => strtoupper($row['type']),
        'format' => strtoupper($format),
        'resolution' => $resolution
    ];
}

echo json_encode(["success" => true, "assets" => $assets]);