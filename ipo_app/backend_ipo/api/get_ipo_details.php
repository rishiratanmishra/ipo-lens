<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // Allow cross-origin for App/Dev
header("Access-Control-Allow-Methods: GET");

// Bootstrap WordPress to access DB
$wp_load = __DIR__ . '/../../admin_ipo/wp-load.php';
if (file_exists($wp_load)) {
    require_once $wp_load;
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "WordPress Core not found"]);
    exit;
}

global $wpdb;

// Define Tables
$table_details = $wpdb->prefix . 'ipodetails';
$table_master  = $wpdb->prefix . 'ipomaster';

// Input Validation
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing or Invalid IPO ID"]);
    exit;
}

// 1. Try fetching from Local DB (Cache)
// We fetch only if data exists and is not empty
$cached = $wpdb->get_row($wpdb->prepare("SELECT details_json, fetched_at FROM $table_details WHERE ipo_id = %d", $id));

// If we have cached data, return it immediately (High Performance)
if ($cached && !empty($cached->details_json)) {
    // Decode and Re-encode to ensure consistent JSON structure if needed, or just echo raw
    // Echoing raw is faster
    echo $cached->details_json;
    exit;
}

// 2. Data not found in Cache. We must Fetch Live.
// First, find the Slug from Master table to construct the URL
$slug = $wpdb->get_var($wpdb->prepare("SELECT slug FROM $table_master WHERE id = %d", $id));

if (!$slug) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "IPO ID not found in Master Database"]);
    exit;
}

// 3. Load Scraper Library
$scraper_lib = __DIR__ . '/../../admin_ipo/wp-content/plugins/ipo-master-details/includes/scraper.php';
if (!file_exists($scraper_lib)) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Scraper module missing on server"]);
    exit;
}
require_once $scraper_lib;

// 4. Perform Live Scrape
$data = fetch_ipo_details_data($id, $slug);

if (!$data || isset($data['error'])) {
    http_response_code(502); // Bad Gateway / Upstream Error
    echo json_encode([
        "status" => "error", 
        "message" => $data['error'] ?? "Failed to fetch data from source",
        "debug_url" => "https://www.ipopremium.in/view/ipo/$id/$slug"
    ]);
    exit;
}

// 5. Save/Cache Result to DB for next time
$json_str = wp_json_encode($data, JSON_UNESCAPED_UNICODE);

$wpdb->replace($table_details, [
    "ipo_id"       => $id,
    "slug"         => $slug,
    "details_json" => $json_str,
    "fetched_at"   => current_time("mysql"),
    "updated_at"   => current_time("mysql"),
]);

// 6. Return Data
echo $json_str;
