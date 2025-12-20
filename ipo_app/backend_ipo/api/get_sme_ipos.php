<?php
include_once '../config.php';

// Mock Data fallback (only SME)
function getMockSMEIPOs() {
    return [
        [
            "id" => 10,
            "company_name" => "SME Tech (Mock)",
            "open_date" => "2025-12-20",
            "close_date" => "2025-12-22",
            "listing_date" => "2025-12-26",
            "price_band" => "120-150",
            "gmp" => 50,
            "is_sme" => 1
        ],
        [
            "id" => 11,
            "company_name" => "SME Foods (Mock)",
            "open_date" => "2025-12-10",
            "close_date" => "2025-12-12",
            "listing_date" => "2025-12-18",
            "price_band" => "80-95",
            "gmp" => 10,
            "is_sme" => 1
        ]
    ];
}

// Status logic
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

// Output structure
$output = [
    "UPCOMING" => [],
    "OPEN" => [],
    "CLOSED" => [],
    "LISTED" => []
];

$data = [];

if ($conn) {
    // Fetch only SME IPOs
    $query = "SELECT *, gmp AS gmp_price FROM wp_ipos WHERE is_sme = 1 ORDER BY open_date DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
} else {
    $data = getMockSMEIPOs();
}

foreach ($data as $row) {
    // Use DB status if available, otherwise calculate it
    if (!empty($row["status"])) {
        $status = $row["status"];
    } else {
        $status = getIPOStatus(
            $row["open_date"],
            $row["close_date"],
            isset($row["listing_date"]) ? $row["listing_date"] : null
        );
        $row["status"] = $status;
    }
    
    $output[$status][] = $row;
}

echo json_encode($output);
?>
