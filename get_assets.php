<?php
include 'connection.php';

$sql = "SELECT * FROM assets";
$result = $conn->query($sql);

$assets = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $assets[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($assets);

$conn->close();
?>