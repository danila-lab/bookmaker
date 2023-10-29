<?php
    session_start();
    require('database.php');
$name = $_POST['name'];
$email = $_POST['email'];
$id = $_SESSION['user_id'];

$sql = "UPDATE user SET name='$name', email='$email' WHERE id='$id'"; 

if ($conn->query($sql) === TRUE) {
    header('Location: profile.php');
} else {
    echo "Error updating record: " . $conn->error;
}


$conn->close();
?>