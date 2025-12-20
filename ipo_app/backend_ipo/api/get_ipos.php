<?php
include_once '../config.php';

// Mock Data
function getMockIPOs() {
    return [
        [
            "id" => 1,
            "company_name" => "TechNova Solutions (Mock)",
            "open_date" => "2025-12-20",
            "close_date" => "2025-12-22",
            "listing_date" => "2025-12-26",
            "price_band" => "450-480",
            "gmp" => 120
        ],
        [
            "id" => 2,
            "company_name" => "GreenEnergy Power (Mock)",
            "open_date" => "2025-12-15",
            "close_date" => "2025-12-17",
            "listing_date" => "2025-12-21",
            "price_band" => "120-135",
            "gmp" => 15
        ]
    ];
}

// Status Logic
function getIPOStatus($open_date, $close_date, $listing_date = null) {
    $today = date("Y-m-d");

    if ($today < $open_date) {
        return "UPCOMING";
    } elseif ($today >= $open_date && $today <= $close_date) {
        return "OPEN";
    } elseif ($listing_date && $today >= $listing_date) {
        return "LISTED";
    } else {
        return "CLOSED";
    }
}

// Final grouped output
$output = [
    "UPCOMING" => [],
    "OPEN" => [],
    "CLOSED" => [],
    "LISTED" => []
];

$data = [];

if ($conn) {
    $query = "SELECT *, gmp AS gmp_price FROM wp_ipos ORDER BY open_date DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
} else {
    $data = getMockIPOs();
}

foreach ($data as $row) {

    $status = getIPOStatus(
        $row["open_date"],
        $row["close_date"],
        isset($row["listing_date"]) ? $row["listing_date"] : null
    );

    $row["status"] = $status;
    $row["is_sme"] = 0;

    $output[$status][] = $row;
}

echo json_encode($output);
?>
