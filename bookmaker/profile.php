<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bookmaker Profile</title>
    <link rel="stylesheet" href="styles.css">
</head>

<style>
body {
    margin: 0;
    padding: 0;
    background-color: #1a1a1a; /* Dark background color */
    color: #fff; /* White text color */
    font-family: Arial, sans-serif;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
}

h1 {
    color: #e6a200; /* Yellow heading color */
}

.profile {
    background-color: #333; /* Dark container background color */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
}

.profile h2 {
    margin-bottom: 20px;
    color: #e6a200; /* Yellow heading color */
}

.profile-info {
    text-align: left;
    margin-bottom: 20px;
}

.profile-info p {
    margin: 10px 0;
}

.edit-button {
    background-color: #e6a200; /* Yellow button background color */
    color: #333; /* Dark text color */
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.edit-button:hover {
    background-color: #ffcc00; /* Lighter yellow on hover */
}
</style>

<body>
    <div class="container">
        <h1>Profile</h1>
        <div class="profile">
            <div class="profile-info">
                <p><strong>Name:</strong> John Doe</p>
                <p><strong>Email:</strong> johndoe@example.com</p>
                <p><strong>Account Balance:</strong> $500</p>
            </div>
            <button class="edit-button">Edit Profile</button>
        </div>
    </div>
</body>

</html>