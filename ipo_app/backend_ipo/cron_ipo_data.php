<?php
// backend/cron_ipo_data.php
// This script is responsible for fetching data from the external API and saving it to a local JSON file.
// Run this via Cron Job: 0 9 * * * php /path/to/backend/cron_ipo_data.php

// Configuration
$apiKey = "sk-live-6pNYRVB7kcrhkeh4UCxWytuJ4JsesYu6fmhExo5E";
$url = "https://stock.indianapi.in/ipo";
$jsonFile = __DIR__ . '/ipo.json';

// Timezone
date_default_timezone_set('Asia/Kolkata');

echo "[CRON] Starting IPO data fetch at " . date('Y-m-d H:i:s') . "\n";

// 1. Fetch Data
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-Api-Key: $apiKey"
]);

echo "[CRON] Requesting data from API...\n";
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// 2. data validation and save
if ($httpCode === 200 && $response) {
    $decoded = json_decode($response, true);
    if ($decoded && (isset($decoded['upcoming']) || isset($decoded['listed']))) {
        // Save to file
        if (file_put_contents($jsonFile, $response)) {
            echo "[CRON] Success: Data saved to $jsonFile.\n";
            echo "[CRON] Data size: " . strlen($response) . " bytes.\n";
            
            // 3. Trigger Main Processing Script
            echo "[CRON] Triggering main_ipo_data.php to sync with Database...\n";
            include __DIR__ . '/main_ipo_data.php';
            
        } else {
            echo "[CRON] Error: Failed to write to file $jsonFile.\n";
        }
    } else {
        echo "[CRON] Error: Invalid JSON structure received.\n";
    }
} else {
    echo "[CRON] Error: Failed to fetch data. HTTP Code: $httpCode.\n";
    if ($curlError) {
        echo "[CRON] cURL Error: $curlError\n";
    }
}
?>
