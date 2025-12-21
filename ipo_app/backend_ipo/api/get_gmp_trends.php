<?php
include_once '../config.php';

header("Content-Type: application/json");

// ---------- Pagination ----------
$page  = isset($_GET['page'])  ? max(1, intval($_GET['page']))  : 1;
$limit = isset($_GET['limit']) ? max(1, intval($_GET['limit'])) : 20;
$offset = ($page - 1) * $limit;

// ---------- Filters ----------
$status  = isset($_GET['status']) ? strtoupper($_GET['status']) : '';
$is_sme  = isset($_GET['is_sme']) ? intval($_GET['is_sme']) : null;
$min_premium = isset($_GET['min_premium']) ? intval($_GET['min_premium']) : null;
$max_premium = isset($_GET['max_premium']) ? intval($_GET['max_premium']) : null;

// ---------- Base Query ----------
$where = "WHERE 1=1";

// SME Filter
if ($is_sme !== null) {
    $where .= " AND is_sme = {$is_sme}";
}

// Status Filter
if ($status === "OPEN" || $status === "UPCOMING" || $status === "CLOSED") {
    $where .= " AND UPPER(status) = '$status'";
}

// ---------- Premium Filter (Correct Logic) ----------
$clean_premium_sql = "
    CAST(
        NULLIF(
            TRIM(
                SUBSTRING_INDEX(premium, ' ', 1)
            ),
        '') AS SIGNED
    )
";

if ($min_premium !== null) {
    $where .= " AND $clean_premium_sql >= $min_premium";
}

if ($max_premium !== null) {
    $where .= " AND $clean_premium_sql <= $max_premium";
}

// ---------- Fetch ----------
$data = [];
$total = 0;

if ($conn) {

    // COUNT
    $countQuery = "SELECT COUNT(*) as total FROM wp_ipomaster $where";
    $countStmt = $conn->prepare($countQuery);
    $countStmt->execute();
    $total = $countStmt->fetchColumn();

    // DATA
    $query = "
        SELECT id, name, is_sme,
               open_date, close_date, listing_date,
               price_band, min_price, max_price,
               premium, badge, status, icon_url, slug
        FROM wp_ipomaster
        $where
        ORDER BY STR_TO_DATE(open_date, '%b %d, %Y') DESC
        LIMIT $limit OFFSET $offset
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

$response = [
    "pagination" => [
        "page"  => $page,
        "limit" => $limit,
        "total" => $total
    ],
    "gmp_trends" => $data
];

echo json_encode($response);
?>
