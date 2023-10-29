<?php
require('database.php');
session_start();
?>
<!DOCTYPE html>
<html>
<head>
  
  <meta charset="UTF-8">
</head>
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
}

header {
    background-color: #333;
    color: #fff;
    padding: 10px 0;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.logo {
    font-size: 24px;
}

.nav-links {
    list-style: none;
    display: flex;
}

.nav-links li {
    margin-right: 20px;
}

.nav-links a {
    text-decoration: none;
    color: #fff;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: #ff9900;
}
</style>
<body>
<header>
        <nav>
            <div class="logo">
                <h1>Bookmaker</h1>
            </div>
            <ul class="nav-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">Sports Betting</a></li>
                <li><a href="#">Live Betting</a></li>
                <li><a href="#">Promotions</a></li>
                <li><a href="#">Contact</a></li>
            <?php
            if (isset($_SESSION['user_name'])) {
                echo '<li><a href="logout.php">Logout</a></li>';
                echo '<li><a href="profile.php"<span> '. $_SESSION['user_name'] . '</span></a></li>';
            } else {       
                echo '<li><a href="signup.php">Register</a></li>';
                echo '<li><a href="login.php">Login</a></li>';
            }
            ?>
            </ul>
        </nav>
    </header>
</body>
</html>