<?php
include_once "header.php";
require('database.php');

if(isset($_SESSION['user_name']) && $_SESSION['user_role'] == 1) {
    $isAdmin = true;
} else {
    $isAdmin = false;
}
?>
<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bookmaker Profile</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #1a1a1a; 
            color: #fff; 
            font-family: Arial, sans-serif;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            text-align: center; 
            position: relative;
        }

        .profile {
            background-color: #333; 
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
            position: relative;
            display: flex;
            align-items: center;
        }

        .avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin-right: 20px;
        }

        .profile-info p {
            margin: 10px 0;
        }

        .edit-button {
            background-color: #e6a200;
            color: #333;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
            position: absolute;
            top: 10px;
            right: 10px;
            transition: background-color 0.3s ease;
        }

        .edit-button:hover {
            background-color: #ffcc00; 
        }

.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.8); 
    padding-top: 60px;
}

.modal-content {
    background-color: #222; 
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #444;
    width: 80%;
    position: relative;
    color: #fff; 
    border-radius: 10px; 
}

.close {
    color: #ffcc00; 
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 30px;
    cursor: pointer;
}

.close:hover {
    color: #fff; 
}
.admin-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #ff9900;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s;
}

.admin-button:hover {
    background-color: #e68300;
}
    </style>
</head>

<body>
    <div class="container">
        <h1>Profile</h1>
        <div class="profile">
            <img src="avatar.jpg" alt="Men Avatar" class="avatar">
            <div class="profile-info">
            <?php
            $sql = "SELECT name, email FROM user";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    while($row = $result->fetch_assoc()) {
                        echo "<p><strong>Name:</strong> " . $row["name"]. "</p>";
                        echo "<p><strong>Email:</strong> " . $row["email"]. "</p>";
                    }
                } else {
                    echo "0 results";
                }
                ?>
                <p><strong>Account Balance:</strong> $0</p>
            </div>
            <button class="edit-button" onclick="openModal()">Edit User Data</button>
            <?php if($isAdmin): ?>
            <a href="admin.php" class="admin-button">Admin Dashboard</a>
            <?php endif; ?>
        </div>
    </div>

        <!-- Modal -->
        <div id="myModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Edit User Data</h2>
            <!-- Form for editing user data -->
            <form id="editForm" action="updateuserdata.php" method="post">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required><br><br>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required><br><br>
                <input type="submit" value="Save Changes">
            </form>
        </div>
    </div>
    <script>
        var modal = document.getElementById("myModal");

        var btn = document.querySelector(".edit-button");
        var span = document.getElementsByClassName("close")[0];

        function openModal() {
            modal.style.display = "block";
        }

        function closeModal() {
            modal.style.display = "none";
        }

    </script>
</body>

</html>