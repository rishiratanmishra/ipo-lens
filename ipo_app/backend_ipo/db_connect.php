<?php
$host = "localhost"; 
$db_name = "u809484217_ipo_app";
$username = "u809484217_ipo_Admin";
$password = "#Admin!!BalliaJila!!123";

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->exec("set names utf8");
} catch(PDOException $exception) {
    // In production, log this error instead of returning it
    // echo "Connection error: " . $exception->getMessage();
    
    // Fallback for local testing if DB fails (Optional: Remove in Prod)
    $conn = null; 
}
?>
