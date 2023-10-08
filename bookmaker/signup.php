<?php
    session_start();
    require('database.php');
?>
<!DOCTYPE html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
    width: 100%; /* Set the width of the container */
    max-width: 600px; /* Maximum width of the container */
    margin: 0 auto; /* Center the container horizontally */
    padding: 50px 20px;
    text-align: center;
    background-color: #333; /* Dark container background color */
    border-radius: 10px;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75); /* Shadow effect */
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
    <form action="process-signup.php" method="post" id="signup" novalidate>
        <div class="container">
            <h4>Sign Up</h4>
            <div class="form-group">
                <input type="text" name="name" class="form-style" placeholder="Your Full Name" id="name" autocomplete="off" required>
            </div>
            <div class="form-group">
                <input type="email" name="email" class="form-style" placeholder="Your Email" id="email" autocomplete="off" required>
            </div>
            <div class="form-group">
                <input type="password" name="password" class="form-style" placeholder="Your Password" id="password" autocomplete="off" required>
            </div>
            <div class="form-group">
                <input type="password" name="password_confirmation" class="form-style" placeholder="Confirm Password" id="password_confirmation" autocomplete="off" required>
            </div>
            <p>Have an account? <a href="login.php"><u>Login here</u></a></p>
            <button type="submit">Signup</button>
        </div>
    </form>
</body>
</html>