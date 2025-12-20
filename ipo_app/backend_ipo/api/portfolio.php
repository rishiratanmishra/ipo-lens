<?php
include_once '../config.php';

$data = json_decode(file_get_contents("php://input"));
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Simple Auth Check (In prod, use Tokens)
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : (isset($data->user_id) ? $data->user_id : null);

if (!$user_id) {
    http_response_code(401);
    echo json_encode(array("message" => "Unauthorized."));
    exit();
}

if ($action == 'add' && !empty($data->ipo_name)) {
    $query = "INSERT INTO user_portfolios (user_id, ipo_name, listing_price, allotted, invested_amount, quantity, sell_price, status) 
              VALUES (:user_id, :ipo_name, :listing_price, :allotted, :invested_amount, :quantity, :sell_price, :status)";
    
    $stmt = $conn->prepare($query);

    // Sanitize
    $ipo_name = htmlspecialchars(strip_tags($data->ipo_name));
    $listing_price = isset($data->listing_price) ? $data->listing_price : 0;
    $allotted = isset($data->allotted) ? $data->allotted : 0;
    $invested_amount = isset($data->invested_amount) ? $data->invested_amount : 0;
    $quantity = isset($data->quantity) ? $data->quantity : 0;
    $sell_price = isset($data->sell_price) ? $data->sell_price : 0;
    $status = isset($data->status) ? $data->status : 'APPLIED';

    $stmt->bindParam(":user_id", $user_id);
    $stmt->bindParam(":ipo_name", $ipo_name);
    $stmt->bindParam(":listing_price", $listing_price);
    $stmt->bindParam(":allotted", $allotted);
    $stmt->bindParam(":invested_amount", $invested_amount);
    $stmt->bindParam(":quantity", $quantity);
    $stmt->bindParam(":sell_price", $sell_price);
    $stmt->bindParam(":status", $status);

    if($stmt->execute()){
        http_response_code(201);
        echo json_encode(array("message" => "Portfolio item added."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to add item."));
    }
} 

elseif ($action == 'get') {
    $query = "SELECT * FROM user_portfolios WHERE user_id = :user_id ORDER BY created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();
    
    $items = array();
    $total_invested = 0;
    $total_profit = 0;

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        array_push($items, $row);
        $total_invested += $row['invested_amount'];
        // Approximating profit for display
        if ($row['status'] == 'SOLD' && $row['sell_price'] > 0) {
           $total_profit += ($row['sell_price'] * $row['quantity']) - $row['invested_amount'];
        }
    }

    echo json_encode(array(
        "items" => $items,
        "summary" => array(
            "total_invested" => $total_invested,
            "total_profit" => $total_profit
        )
    ));
}

elseif ($action == 'delete' && !empty($data->id)) {
    $query = "DELETE FROM user_portfolios WHERE id = :id AND user_id = :user_id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":id", $data->id);
    $stmt->bindParam(":user_id", $user_id);
    
    if($stmt->execute()){
        echo json_encode(array("message" => "Item deleted."));
    } else {
        echo json_encode(array("message" => "Unable to delete item."));
    }
}
?>
