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

// Fetch from Custom SQL Table
$results = $wpdb->get_results("SELECT * FROM $table_name ORDER BY id DESC");

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
                $response[$key][] = $item;
             }
        }
    }
}

echo json_encode($response);
?>
