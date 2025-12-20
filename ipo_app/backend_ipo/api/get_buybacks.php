<?php
include_once '../config.php';

function getMockBuybacks() {
    return [
        [
            "id" => 1,
            "company_name" => "Infosys (Mock)",
            "buyback_price" => 1500,
            "current_market_price" => 1350,
            "record_date" => "2025-11-30",
            "type" => "TENDER"
        ]
    ];
}

if ($conn) {
    $query = "SELECT * FROM buybacks ORDER BY record_date DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $buybacks_arr = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($buybacks_arr, $row);
    }
    echo json_encode($buybacks_arr);
} else {
    echo json_encode(getMockBuybacks());
}
?>
