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
  /* Reset some default styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Basic styling */
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

.hero {
    background-image: url('book.jpg');
    background-size: cover;
    color: #fff;
    text-align: center;
    padding: 500px 0;
}

.hero h2 {
    font-size: 36px;
    margin-bottom: 20px;
}

.cta-button {
    display: inline-block;
    background-color: #ff9900;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
    transition: background-color 0.3s;
}

.cta-button:hover {
    background-color: #e68300;
}

/* Add styling for other sections as needed */

footer {
    background-color: #333;
    color: #fff;
    text-align: center;
    padding: 20px 0;
}
.featured-events {
            background-color: #f2f2f2;
            padding: 20px;
            text-align: center;
        }

        .featured-events h2 {
            font-size: 24px;
            color: #333;
        }

        .promotions {
            background-color: #ff9900;
            color: #fff;
            padding: 20px;
            text-align: center;
        }

        .promotions h2 {
            font-size: 24px;
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
                <li><a href="#">Casino</a></li>
                <li><a href="#">Live Betting</a></li>
                <li><a href="#">Promotions</a></li>
                <li><a href="#">Contact</a></li>
            <?php
            if (isset($_SESSION['user_name'])) {
                echo '<li><a href="logout.php">Logout</a></li>';
                echo '<li><span>Welcome, ' . $_SESSION['user_name'] . '</span></li>';
            } else {       
                echo '<li><a href="signup.php">Register</a></li>';
                echo '<li><a href="login.php">Login</a></li>';
            }
            ?>
            </ul>
        </nav>
    </header>

    <section class="hero">
        <h2>Welcome to Your Bookmaker</h2>
        <p>Place your bets on your favorite sports and casino games.</p>
        <a href="#" class="cta-button">Join Now</a>
    </section>

    <section class="featured-events">
        <h2>Featured Events</h2>
        world cup
    </section>

    <section class="promotions">
        <h2>Promotions</h2>
        free bets 1m
    </section>

    <footer>
        <p>&copy; 2023 Your Bookmaker. All rights reserved.</p>
    </footer>
</body>
</html>