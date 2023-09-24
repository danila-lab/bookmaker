<?php
    session_start();
    require('database.php');
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<form action="process-signup.php" method="post" id="signup" novalidate>
<h4>Sign Up</h4>
	<div>
		<input type="text" name="name" class="form-style" placeholder="Your Full Name" id="name" autocomplete="off">
	</div>	
	<div >
		<input type="email" name="email" class="form-style" placeholder="Your Email" id="email" autocomplete="off">
	</div>	
	<div>
		<input type="password" name="password" class="form-style" placeholder="Your Password" id="password" autocomplete="off">
	</div>
    <div>
		<input type="password" name="password_confirmation" class="form-style" placeholder="Your Password" id="password_confirmation" autocomplete="off">
	</div>
                      
<p>Have an account?<a href="login.php"><u>Login here</u></a></p>
<button>Signup</button>
</body>
</html>