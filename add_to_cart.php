<?php
session_start();

header('Content-Type: application/json');
require_once "connection.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false, "message" => "User not logged in"]);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    $asset_id = intval($data['asset_id'] ?? 0);

    if (!$asset_id) {
        echo json_encode(["success" => false, "message" => "Asset ID is required"]);
        exit;
    }

    // Verify if the asset is already in the cart
    $check = $conn->prepare("SELECT id FROM carts WHERE user_id = ? AND asset_id = ?");
    $check->bind_param("ii", $user_id, $asset_id);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Asset already in cart"]);
        exit;
    }

    // Insert into the carts table
    $stmt = $conn->prepare("INSERT INTO carts (user_id, asset_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $user_id, $asset_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Asset added to cart"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to add asset"]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}