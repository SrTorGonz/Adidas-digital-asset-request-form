<?php
session_start();
require_once "connection.php";

$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit;
}

$sql = "
    SELECT r.id, r.created_at, r.deadline, r.status, COUNT(ra.asset_id) AS quantity
    FROM requests r
    LEFT JOIN request_assets ra ON r.id = ra.request_id
    WHERE r.user_id = ?
    GROUP BY r.id
    ORDER BY r.created_at DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$requests = [];
while ($row = $result->fetch_assoc()) {
    $requests[] = $row;
}

echo json_encode($requests);
?>