<?php
include_once "header.php";
require('database.php');
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
.hero {
    background-image: url('book.jpeg');
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
    <section class="hero">
        <h2>Welcome to Your Bookmaker</h2>
        <p>Place your bets on your favorite sports and casino games.</p>
        <a href="#" class="cta-button">Join Now</a>
    </section>
</body>
</html>