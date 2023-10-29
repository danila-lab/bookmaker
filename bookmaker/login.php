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
            $_SESSION["user_role"] = $user["role"];


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
<style>

body {
    margin: 0;
    padding: 0;
    background-color: #1a1a1a; /* Dark background color */
    color: white;
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.container {
    width: 100%;
    max-width: 400px;
    padding: 50px 20px;
    text-align: center;
    background-color: #333; /* Dark container background color */
    border-radius: 10px;
    box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.75); /* Shadow effect */
}

.header {
    background-color: #e6a200; /* Yellow header background color */
    padding: 20px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.login-form {
    margin-top: 20px;
}

.login-form h4 {
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input[type="text"], input[type="password"], input[type="email"] {
    width: calc(100% - 16px);
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    background-color: #e6a200; /* Yellow button background color */
    color: black;
    border: none;
    padding: 10px 20px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #ffcc00;
}
</style>

<body>
    <div class="container">
        <div class="login-form">
            <form method="post">
                <h4>Log In</h4>
                <div class="form-group">
                    <input type="email" name="email" class="form-style" placeholder="Your Email" id="email" required>
                </div>
                <div class="form-group">
                    <input type="password" name="password" class="form-style" placeholder="Your Password" id="password" required>
                </div>
                <p>Don't have an account? <a href="signup.php"><u>Signup here</u></a></p>
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
</body>
</html>