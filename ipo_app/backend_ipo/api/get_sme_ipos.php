<?php
include_once '../config.php';

function getIPOStatus($open_date, $close_date, $listing_date = null) {
    $today = date("Y-m-d");

    if ($today < $open_date) {
        return "UPCOMING";
    } elseif ($today >= $open_date && $today <= $close_date) {
        return "OPEN";
    } else {
        return "CLOSED";
    }
}

$page  = isset($_GET['page'])  ? max(1, intval($_GET['page']))  : 1;
$limit = isset($_GET['limit']) ? max(1, intval($_GET['limit'])) : 20;
$offset = ($page - 1) * $limit;

$response = [
    "pagination" => [
        "page"  => $page,
        "limit" => $limit
    ],
    "UPCOMING" => [],
    "OPEN"     => [],
    "CLOSED"   => []
];

$data = [];

if ($conn) {
    $query = "SELECT * FROM wp_ipomaster WHERE is_sme = 1 ORDER BY open_date DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

if (!$data || empty($data)) {
    header("Content-Type: application/json");
    echo json_encode($response);
    exit;
}

$groups = [
    "UPCOMING" => [],
    "OPEN"     => [],
    "CLOSED"   => []
];

foreach ($data as $row) {

    $status = !empty($row["status"])
        ? strtoupper($row["status"])
        : getIPOStatus(
            $row["open_date"] ?? "",
            $row["close_date"] ?? "",
            $row["listing_date"] ?? ""
        );

    if ($status === "LISTED") $status = "CLOSED";
    elseif ($status !== "OPEN" && $status !== "UPCOMING") $status = "CLOSED";

    $row["status"] = $status;
    $row["is_sme"] = 1;

    $groups[$status][] = $row;
}

/************  SORT DESCENDING BEFORE PAGINATION  ************/
foreach ($groups as $key => &$items) {
    usort($items, function($a, $b){
        return strtotime($b['open_date']) <=> strtotime($a['open_date']);
    });
}
unset($items);

/************  PAGINATION AFTER SORT  ************/
foreach ($groups as $key => $items) {
    $response["pagination"]["total_$key"] = count($items);
    $response[$key] = array_slice($items, $offset, $limit);
}

header("Content-Type: application/json");
echo json_encode($response);
?>
