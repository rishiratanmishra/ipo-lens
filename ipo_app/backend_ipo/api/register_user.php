<?php
// register_user.php
// Place this file in: https://zolaha.com/ipo_app/backend_ipo/api/
// Enable Error Reporting for Debugging (Disable in production once working)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
// PATH FIX: 
// Assuming URL: https://zolaha.com/ipo_app/backend_ipo/api/register_user.php
// Current Dir: .../ipo_app/backend_ipo/api/
// WP Dir:      .../ipo_app/admin_ipo/
// We need to go UP 2 levels to get to 'ipo_app', then into 'admin_ipo'
// ../ goes to 'backend_ipo'
// ../../ goes to 'ipo_app'
$wp_load_path = __DIR__ . '/../../admin_ipo/wp-load.php';
if (!file_exists($wp_load_path)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server Configuration Error: wp-load.php not found at ' . $wp_load_path]);
    exit;
}
require_once($wp_load_path);
$data = json_decode(file_get_contents("php://input"));
if (!$data || !isset($data->username) || !isset($data->password) || !isset($data->email)) {
    echo json_encode(['success' => false, 'message' => 'Missing fields']);
    exit;
}
$username = sanitize_user($data->username);
$email = sanitize_email($data->email);
$password = $data->password;
if (username_exists($username)) {
    echo json_encode(['success' => false, 'message' => 'Username already exists']);
    exit;
}
if (email_exists($email)) {
    echo json_encode(['success' => false, 'message' => 'Email already exists']);
    exit;
}
$user_id = wp_create_user($username, $password, $email);
if (is_wp_error($user_id)) {
    echo json_encode(['success' => false, 'message' => $user_id->get_error_message()]);
} else {
    echo json_encode(['success' => true, 'message' => 'User created successfully', 'user_id' => $user_id]);
}
?>
