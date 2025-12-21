<?php
include_once '../config.php';

function getMockBrokers() {
    return [
        [
            "id" => 1,
            "name" => "Zerodha (Mock)",
            "description" => "India's #1 Broker",
            "highlights" => "Free Equity Delivery",
            "affiliate_link" => "https://zerodha.com",
            "logo_url" => "https://zerodha.com/static/images/logo.svg"
        ]
    ];
}

if ($conn) {
    $query = "SELECT * FROM wp_brokers ORDER BY rating DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $brokers_arr = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($brokers_arr, $row);
    }
    echo json_encode($brokers_arr);
} else {
    echo json_encode(getMockBrokers());
}
?>
