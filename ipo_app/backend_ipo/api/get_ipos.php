<?php
include_once '../config.php';

// Mock Data function if DB is not connected
function getMockIPOs() {
    return [
        [
            "id" => 1,
            "company_name" => "TechNova Solutions (Mock)",
            "open_date" => "2025-12-20",
            "close_date" => "2025-12-22",
            "price_band" => "450-480",
            "gmp" => 120,
            "status" => "UPCOMING"
        ],
        [
            "id" => 2,
            "company_name" => "GreenEnergy Power (Mock)",
            "open_date" => "2025-12-15",
            "close_date" => "2025-12-17",
            "price_band" => "120-135",
            "gmp" => 15,
            "status" => "OPEN"
        ]
    ];
}

if ($conn) {
    $query = "SELECT *, gmp as gmp_price FROM ipos ORDER BY open_date DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $num = $stmt->rowCount();

    if ($num > 0) {
        $ipos_arr = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($ipos_arr, $row);
        }
        echo json_encode($ipos_arr);
    } else {
        echo json_encode([]);
    }
} else {
    // Return mock data if DB connection fails (Useful for local verification without DB)
    echo json_encode(getMockIPOs());
}
?>
