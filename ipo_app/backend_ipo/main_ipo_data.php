<?php
// backend/main_ipo_data.php
// This script reads the local ipo.json and syncs it with the MySQL database.
// Merges new API data with existing database records.

require_once __DIR__ . '/db_connect.php';

echo "[MAIN] Starting Database Sync...\n";

$jsonFile = __DIR__ . '/ipo.json';

if (!file_exists($jsonFile)) {
    die("[MAIN] Error: ipo.json not found.\n");
}

$jsonData = file_get_contents($jsonFile);
$data = json_decode($jsonData, true);

if (!$data) {
    die("[MAIN] Error: Failed to decode ipo.json.\n");
}

if (!$conn) {
    die("[MAIN] Error: Database connection failed.\n");
}

// Function to process a list of IPOs
function processIPOList($list, $defaultStatus, $conn) {
    $count = 0;
    foreach ($list as $item) {
        // Basic Fields
        $name = $item['name'] ?? 'Unknown';
        
        // Dates (Handle nulls)
        $openDate = !empty($item['bidding_start_date']) ? $item['bidding_start_date'] : null;
        $closeDate = !empty($item['bidding_end_date']) ? $item['bidding_end_date'] : null;
        $listingDate = !empty($item['listing_date']) ? $item['listing_date'] : null;
        
        // Prices & Details
        $minPrice = $item['min_price'] ?? null;
        $maxPrice = $item['max_price'] ?? null;
        $issuePrice = $item['issue_price'] ?? null;
        $listingGains = $item['listing_gains'] ?? null;
        $listingPrice = $item['listing_price'] ?? null;
        $lotSize = $item['lot_size'] ?? null;
        
        // New Fields
        $symbol = $item['symbol'] ?? null;
        $isSme = !empty($item['is_sme']) ? 1 : 0;
        $additionalText = $item['additional_text'] ?? null;
        $documentUrl = $item['document_url'] ?? null;

        // Status mapping
        $statusRaw = strtoupper($item['status'] ?? $defaultStatus);
        $status = 'UPCOMING';
        if ($statusRaw === 'LISTED') $status = 'LISTED';
        else if ($statusRaw === 'UPCOMING') $status = 'UPCOMING';
        else if ($statusRaw === 'OPEN') $status = 'OPEN';
        else if ($statusRaw === 'CLOSED') $status = 'CLOSED';
        
        // Execute Upsert
        try {
            // Check existence by Company Name
            $check = $conn->prepare("SELECT id FROM ipos WHERE company_name = ? LIMIT 1");
            $check->execute([$name]);
            $existing = $check->fetch(PDO::FETCH_ASSOC);
            
            if ($existing) {
                // Update
                $sql = "UPDATE ipos SET 
                        symbol=?, 
                        open_date=?, close_date=?, listing_date=?,
                        price_band_lower=?, price_band_upper=?, issue_price=?,
                        listing_gains=?, listing_price=?,
                        lot_size=?, 
                        status=?, 
                        is_sme=?, additional_text=?, document_url=?,
                        updated_at=NOW() 
                        WHERE id=?";
                $update = $conn->prepare($sql);
                $update->execute([
                    $symbol, 
                    $openDate, $closeDate, $listingDate, 
                    $minPrice, $maxPrice, $issuePrice,
                    $listingGains, $listingPrice,
                    $lotSize,
                    $status,
                    $isSme, $additionalText, $documentUrl,
                    $existing['id']
                ]);
            } else {
                // Insert
                $sql = "INSERT INTO ipos (
                            company_name, symbol, 
                            open_date, close_date, listing_date,
                            price_band_lower, price_band_upper, issue_price,
                            listing_gains, listing_price,
                            lot_size, 
                            status, 
                            is_sme, additional_text, document_url,
                            created_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
                $insert = $conn->prepare($sql);
                $insert->execute([
                    $name, $symbol,
                    $openDate, $closeDate, $listingDate,
                    $minPrice, $maxPrice, $issuePrice,
                    $listingGains, $listingPrice,
                    $lotSize,
                    $status,
                    $isSme, $additionalText, $documentUrl
                ]);
            }
            $count++;
        } catch (Exception $e) {
            echo "[MAIN] Error processing $name: " . $e->getMessage() . "\n";
        }
    }
    return $count;
}

$countUpcoming = 0;
$countListed = 0;

if (isset($data['upcoming'])) {
    $countUpcoming = processIPOList($data['upcoming'], 'UPCOMING', $conn);
}

if (isset($data['listed'])) {
    $countListed = processIPOList($data['listed'], 'LISTED', $conn);
}

echo "[MAIN] Sync Complete. Processed $countUpcoming upcoming and $countListed listed IPOs.\n";

?>
