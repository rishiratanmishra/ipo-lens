<?php
include_once '../config.php';

$data = json_decode(file_get_contents("php://input"));
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action == 'register' && !empty($data->username) && !empty($data->password)) {
    // Check if user exists
    $query = "SELECT id FROM users WHERE username = :username";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":username", $data->username);
    $stmt->execute();
    
    if($stmt->rowCount() > 0){
        http_response_code(400);
        echo json_encode(array("message" => "Username already exists."));
        exit();
    }

    // Create User
    $query = "INSERT INTO users (username, password) VALUES (:username, :password)";
    $stmt = $conn->prepare($query);
    
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
    
    $stmt->bindParam(":username", $data->username);
    $stmt->bindParam(":password", $password_hash);

    if($stmt->execute()){
        http_response_code(201);
        echo json_encode(array("message" => "User registered successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to register user."));
    }
} 

elseif ($action == 'login' && !empty($data->username) && !empty($data->password)) {
    $query = "SELECT id, username, password FROM users WHERE username = :username";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":username", $data->username);
    $stmt->execute();
    
    if($stmt->rowCount() > 0){
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if(password_verify($data->password, $row['password'])){
            http_response_code(200);
            echo json_encode(array(
                "message" => "Login successful.",
                "user_id" => $row['id'],
                "username" => $row['username']
            ));
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Invalid password."));
        }
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "User not found."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid request."));
}
?>
