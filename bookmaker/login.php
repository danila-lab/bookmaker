<?php
session_start();
require('database.php');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    $conn = require __DIR__ . "/database.php";

    $sql = sprintf("SELECT * FROM user
                    WHERE email = '%s'",
                   $conn->real_escape_string($_POST["email"]));
    
    $result = $conn->query($sql);
    
    $user = $result->fetch_assoc();
    if($user){
        if($_POST["password"] == $user["password"]){

            session_start();
            $_SESSION["user_id"] = $user["id"];
            $_SESSION["user_email"] = $user["email"];
            $_SESSION["user_name"] = $user["name"];
            $_SESSION["user_pass"] = $user["password"];


            header("Location: index.php");
            exit;
        }
    }
}

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<form method="post" >
<h4>Log In</h4>
<div>												
	<input type="email" name="email" class="form-style" placeholder="Your Email" id="email">
</div>	
<div>
	<input type="password" name="password" class="form-style" placeholder="Your Password" id="password">
</div>
<p>Don't have an account? <a href="signup.php"><u>Signup here</u></a></p>
</div>
	<button>Login</button>
</body>
</html>