<?php
$servername = "localhost";
$database = "bet_db";
$username = "root";
$password = "";

$conn = mysqli_connect($servername, $username, $password, $database);

return $conn;