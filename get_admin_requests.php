<?php
session_start();
include 'connection.php';

$sql = "SELECT r.id, r.created_at, r.deadline, r.status, u.email 
        FROM requests r
        JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC";

$result = $conn->query($sql);

$requests = [];

while ($row = $result->fetch_assoc()) {
    $requests[] = $row;
}

header('Content-Type: application/json');
echo json_encode($requests);
?>
