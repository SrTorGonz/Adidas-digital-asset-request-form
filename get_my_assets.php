<?php
session_start();
require 'connection.php';

$user_id = $_SESSION['user_id'];
$today = date('Y-m-d');

$sql = "
SELECT a.name, a.file_path, a.type, latest_ra.max_deadline AS deadline
FROM assets a
JOIN (
    SELECT ra.asset_id, MAX(r.deadline) AS max_deadline
    FROM request_assets ra
    JOIN requests r ON ra.request_id = r.id
    WHERE r.user_id = ? AND r.status = 'approved' AND r.deadline >= ?
    GROUP BY ra.asset_id
) latest_ra ON a.id = latest_ra.asset_id
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $user_id, $today);
$stmt->execute();
$result = $stmt->get_result();

$assets = [];
while ($row = $result->fetch_assoc()) {
    $assets[] = $row;
}

echo json_encode($assets);
?>

