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
        '') AS DECIMAL(10,2)
    )
";

if ($min_premium !== null) {
    $where .= " AND $clean_premium_sql >= $min_premium";
}

if ($max_premium !== null) {
    $where .= " AND $clean_premium_sql <= $max_premium";
}


// ---------- Sorting ----------
$sort = isset($_GET['sort']) ? $_GET['sort'] : 'date'; // 'date', 'gmp_high', 'gmp_low'

// ---------- Fetch ----------
$data = [];
$total = 0;

if ($conn) {

    // COUNT
    $countQuery = "SELECT COUNT(*) as total FROM wp_ipomaster $where";
    $countStmt = $conn->prepare($countQuery);
    $countStmt->execute();
    $total = $countStmt->fetchColumn();

    // Determine ORDER BY clause
    $parsedDate = "STR_TO_DATE(open_date, '%b %d, %Y')";
    $yearMonthSort = "DATE_FORMAT($parsedDate, '%Y-%m') DESC";
    $dateSort = "$parsedDate DESC";
    
    // Default sorting
    $orderBy = "ORDER BY $dateSort";
    
    if ($sort === 'gmp_high') {
        // Top Gainers: Only Positive GMP, Group by Month (Recent), then Highest GMP
        $where .= " AND $clean_premium_sql > 0";
        $orderBy = "ORDER BY $yearMonthSort, $clean_premium_sql DESC";
    } elseif ($sort === 'gmp_low') {
        // Top Losers: Only Negative GMP, Group by Month (Recent), then Lowest GMP
        $where .= " AND $clean_premium_sql < 0";
        $orderBy = "ORDER BY $yearMonthSort, $clean_premium_sql ASC";
    }

    // Recalculate Total for pagination with new filters
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
        $orderBy
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
