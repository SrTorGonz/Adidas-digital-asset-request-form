<?php
include_once 'connection.php';

$requestId = $_POST['request_id'];
$adminMessage = $_POST['recommendations'];
$status = $_POST['status'];

$sql = "UPDATE requests SET status=?, admin_message=? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $status, $adminMessage, $requestId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>