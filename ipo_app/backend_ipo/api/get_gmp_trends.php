<?php
include_once '../config.php';

header("Content-Type: application/json; charset=utf-8");

// ---------- Pagination ----------
$page  = isset($_GET['page'])  ? max(1, intval($_GET['page']))  : 1;
$limit = isset($_GET['limit']) ? min(100, max(1, intval($_GET['limit']))) : 20;
$offset = ($page - 1) * $limit;

// ---------- Filters ----------
$status = isset($_GET['status']) ? strtoupper($_GET['status']) : '';
$is_sme = isset($_GET['is_sme']) ? intval($_GET['is_sme']) : null;
$type   = $_GET['type'] ?? 'gmp_high'; // gmp_high | gmp_low

// ---------- Current Month ----------
$currentMonthStart = date('Y-m-01');
$currentMonthEnd   = date('Y-m-t');

// ---------- GMP Numeric Extraction ----------
$clean_premium_sql = "
    CAST(
        NULLIF(
            TRIM(SUBSTRING_INDEX(premium, ' ', 1)),
        '') AS SIGNED
    )
";

// ---------- WHERE ----------
$where = "WHERE 1=1";

// Only current month
$where .= "
 AND STR_TO_DATE(open_date, '%b %d, %Y')
     BETWEEN '$currentMonthStart' AND '$currentMonthEnd'
";

// SME
if ($is_sme !== null) {
    $where .= " AND is_sme = $is_sme";
}

// Status
if (in_array($status, ['OPEN', 'UPCOMING', 'CLOSED'], true)) {
    $where .= " AND UPPER(status) = '$status'";
}

// GMP mode filters
if ($type === 'gmp_low') {
    // Losers only
    $where .= " AND $clean_premium_sql < 0";
} else {
    // Winners only
    $where .= " AND $clean_premium_sql > 0";
}

// ---------- ORDER ----------
// Calculate percentage: (GMP / MaxPrice)
$gmp_percentage_sql = "($clean_premium_sql / NULLIF(max_price, 0))";

// Gainers/Losers based on Percentage
if ($type === 'gmp_low') {
    // Losers: most negative percentage first.
    // ASC puts NULLs first by default in MySQL, so push them to the end.
    $orderBy = "CASE WHEN $gmp_percentage_sql IS NULL THEN 1 ELSE 0 END ASC, $gmp_percentage_sql ASC";
} else {
    // Gainers: highest percentage first.
    // DESC puts NULLs last by default.
    $orderBy = "$gmp_percentage_sql DESC";
}

// ---------- Fetch ----------
$data = [];
$total = 0;

if ($conn) {

    // COUNT
    $countQuery = "SELECT COUNT(*) FROM wp_ipomaster $where";
    $countStmt = $conn->prepare($countQuery);
    $countStmt->execute();
    $total = (int)$countStmt->fetchColumn();

    // DATA
    $query = "
        SELECT id, name, is_sme,
               open_date, close_date, listing_date,
               price_band, min_price, max_price,
               premium, badge, status, icon_url, slug
        FROM wp_ipomaster
        $where
        ORDER BY
            $orderBy,
            STR_TO_DATE(open_date, '%b %d, %Y') DESC
        LIMIT $limit OFFSET $offset
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// ---------- Response ----------
echo json_encode([
    "pagination" => [
        "page"  => $page,
        "limit" => $limit,
        "total" => $total
    ],
    "gmp_trends" => $data
]);
