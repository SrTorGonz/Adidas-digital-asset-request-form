<?php
session_start();
require_once 'connection.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $asset_id = $_POST['asset_id'] ?? null;

    if (!$asset_id) {
        echo json_encode(["success" => false, "message" => "Asset ID is required"]);
        exit;
    }

    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("DELETE FROM carts WHERE user_id = ? AND asset_id = ?");
    $stmt->bind_param("ii", $user_id, $asset_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to delete from cart"]);
    }

    $stmt->close();
    $conn->close();
}