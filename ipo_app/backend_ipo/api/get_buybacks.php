<?php
// Define path to wp-load.php
// Current dir: .../backend_ipo/api/
// WP dir: .../admin_ipo/
$wp_load_path = dirname(__DIR__, 2) . '/admin_ipo/wp-load.php';

if (file_exists($wp_load_path)) {
    require_once($wp_load_path);
} else {
    // If we can't load WP, we can't serve real data.
    header('Content-Type: application/json');
    echo json_encode(["error" => "WordPress environment not found"]);
    exit;
}

header('Content-Type: application/json');

global $wpdb;
$table_name = $wpdb->prefix . 'buybacks';

// Check if table exists to avoid errors if plugin deactivated or not installed
if($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
    echo json_encode(["error" => "Table not found. Please activate the Buyback Manager plugin."]);
    exit;
}

// Parameters
$page = isset($_GET['page']) ? (int)$_GET['page'] : null;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
$status_filter = isset($_GET['status']) ? $_GET['status'] : null; // e.g., 'Open', 'Closed'

$where_clause = "";
if ($status_filter) {
    // Sanitize
    $status_esc = $wpdb->_real_escape($status_filter);
    $where_clause = "WHERE type = '$status_esc'";
}

// Pagination Logic
$limit_clause = "";
$offset = 0;
if ($page && $limit) {
    $offset = ($page - 1) * $limit;
    $limit_clause = "LIMIT $limit OFFSET $offset";
}

// Get Total Count for Pagination
$total_query = "SELECT COUNT(*) FROM $table_name $where_clause";
$total_records = $wpdb->get_var($total_query);
$total_pages = ($limit) ? ceil($total_records / $limit) : 1;

// Fetch Data
$query = "SELECT * FROM $table_name $where_clause ORDER BY id ASC $limit_clause";
$results = $wpdb->get_results($query);

$response = [
    "OPEN" => [],
    "UPCOMING" => [],
    "CLOSED" => []
];

if ($results) {
    foreach ($results as $row) {
        $type = $row->type; // "Open", "Upcoming", "Closed"
        $key = strtoupper($type); // "OPEN", "UPCOMING", "CLOSED"

        // Map Table Columns to App API Interface
       $item = [
            "id" => (string)$row->id,

            "company_name" => $row->company,
            "company" => $row->company,

            "type" => $type,                 // Open / Upcoming / Closed
            "status" => $row->status,        // Closes 29 Dec '25 etc

            "offer_price" => $row->price,
            "buyback_price" => $row->price,

            "current_market_price" => $row->market_price ?: null,
            "record_date" => $row->record_date ?: null,
            "period" => $row->period ?: null,

            "issue_size" => $row->issue_size ?: null,
            "shares" => $row->shares ?: null,

            "logo" => $row->logo
        ];


        // Group by status key
        if (array_key_exists($key, $response)) {
             $response[$key][] = $item;
        } else {
             if (!empty($key)) {
                // If the key is not one of the standard ones, just add it (or ignore)
                // If we are filtering by a specific status, ensuring it lands in the right bucket
                if (!isset($response[$key])) $response[$key] = [];
                $response[$key][] = $item;
             }
        }
    }
}

// Attach Pagination Meta if requested
if ($page || $limit) {
    $response['pagination'] = [
        'total_records' => $total_records,
        'total_pages' => $total_pages,
        'current_page' => $page ?: 1,
        'limit' => $limit ?: $total_records
    ];
}

echo json_encode($response);
?>
