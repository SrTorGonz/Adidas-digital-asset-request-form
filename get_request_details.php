<?php
require 'connection.php';

if (!isset($_GET['request_id'])) {
    echo json_encode(['success' => false, 'message' => 'No ID provided']);
    exit;
}

$request_id = intval($_GET['request_id']);

// get request and user details
$sql = "SELECT r.created_at, r.purpose, r.deadline, u.email 
        FROM requests r 
        JOIN users u ON r.user_id = u.id 
        WHERE r.id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $request_id);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Request not found']);
    exit;
}
$requestData = $result->fetch_assoc();

// get associated assets
$sqlAssets = "SELECT a.name, a.file_path, a.type 
              FROM assets a 
              JOIN request_assets ra ON a.id = ra.asset_id 
              WHERE ra.request_id = ?";
$stmtAssets = $conn->prepare($sqlAssets);
$stmtAssets->bind_param("i", $request_id);
$stmtAssets->execute();
$resultAssets = $stmtAssets->get_result();

$assets = [];
while ($row = $resultAssets->fetch_assoc()) {
    $assets[] = $row;
}

// send response
echo json_encode([
    'success' => true,
    'created_at' => $requestData['created_at'],
    'purpose' => $requestData['purpose'],
    'deadline' => $requestData['deadline'],
    'email' => $requestData['email'],
    'assets' => $assets
]);
?>
