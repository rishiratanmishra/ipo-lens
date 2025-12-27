<?php
header("Content-Type: application/json; charset=UTF-8");

// Define Path to the Shared Library
// From: ipo_app/backend_ipo/api/
// To:   ipo_app/admin_ipo/wp-content/plugins/ipo-master-details/includes/
$scraper_lib = __DIR__ . '/../../admin_ipo/wp-content/plugins/ipo-master-details/includes/scraper.php';

if (!file_exists($scraper_lib)) {
    echo json_encode(["error" => "Internal Error: Scraper library not found at $scraper_lib"]);
    exit;
}

require_once $scraper_lib;

$id   = $_GET['id']   ?? '';
$slug = $_GET['slug'] ?? '';
$manual_url = $_GET['url'] ?? '';

$data = fetch_ipo_details_data($id, $slug, $manual_url);

echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
