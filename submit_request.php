<?php
session_start();
require_once 'connection.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$purpose = trim($data['purpose'] ?? '');
$deadline = trim($data['deadline'] ?? '');

if (empty($purpose) || empty($deadline)) {
    echo json_encode(['success' => false, 'message' => 'Missing purpose or deadline']);
    exit;
}

// date format validation
$deadlineFormatted = DateTime::createFromFormat('d/m/Y', $deadline);
if (!$deadlineFormatted) {
    echo json_encode(['success' => false, 'message' => 'Invalid date format. Use DD/MM/YYYY']);
    exit;
}
$deadlineSQL = $deadlineFormatted->format('Y-m-d');

$conn->begin_transaction();

try {
    // Insert into requests
    $stmt = $conn->prepare("INSERT INTO requests (user_id, purpose, deadline) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $user_id, $purpose, $deadlineSQL);
    $stmt->execute();
    $request_id = $stmt->insert_id;
    $stmt->close();

    // Get assets from carts
    $stmt = $conn->prepare("SELECT asset_id FROM carts WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $assets = [];
    while ($row = $result->fetch_assoc()) {
        $assets[] = $row['asset_id'];
    }
    $stmt->close();

    if (count($assets) === 0) {
        throw new Exception('Carts is empty.');
    }

    // Insert into request_assets
    $stmt = $conn->prepare("INSERT INTO request_assets (request_id, asset_id) VALUES (?, ?)");
    foreach ($assets as $asset_id) {
        $stmt->bind_param("ii", $request_id, $asset_id);
        $stmt->execute();
    }
    $stmt->close();

    // Clear carts
    $stmt = $conn->prepare("DELETE FROM carts WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->close();

    $conn->commit();

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>