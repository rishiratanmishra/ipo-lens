<?php
class BBM_Scraper {

    public static function fetch_and_store() {

        $url = "https://groww.in/buy-back";
        
        $response = wp_remote_get($url, [
            'user-agent' => 'Mozilla/5.0'
        ]);

        if (is_wp_error($response)) {
            error_log("BBM Scraper Error: " . $response->get_error_message());
            return;
        }

        $html = wp_remote_retrieve_body($response);
        if (empty($html)) {
            error_log("BBM Scraper Error: Empty HTML");
            return;
        }

        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        @$dom->loadHTML($html);
        $xpath = new DOMXPath($dom);

        // find sections (Open / Upcoming / Closed)
        $headings = $xpath->query("//h2");

        foreach ($headings as $h2) {

            $title_text = strtolower(trim($h2->textContent));
            $type = null;

            if (strpos($title_text, "open") === 0) $type = "Open";
            elseif (strpos($title_text, "upcoming") === 0) $type = "Upcoming";
            elseif (strpos($title_text, "recently closed") === 0) $type = "Closed";

            if (!$type) continue;

            // next div containing table
            $table = $h2->nextSibling;
            while ($table && $table->nodeName !== "div") {
                $table = $table->nextSibling;
            }

            if (!$table) continue;

            $rows = $xpath->query(".//tbody/tr", $table);

            foreach ($rows as $row) {

                $cols = $xpath->query(".//td", $row);
                if ($cols->length < 4) continue;

                // Basic Values
                $company_name = trim($cols->item(1)->textContent);
                $offer_price = trim($cols->item(2)->textContent);
                $status = trim($cols->item(3)->textContent);

                // Logo
                $logoNode = $xpath->query(".//noscript//img", $cols->item(0));
                $logo = $logoNode->length ? $logoNode->item(0)->getAttribute("src") : "";

                // Get Company Page Link → searchId extract
                $linkNode = $xpath->query(".//a", $cols->item(1));
                $detail_url = $linkNode->length ? $linkNode->item(0)->getAttribute("href") : "";

                $searchId = "";
                if ($detail_url) {
                    $parts = explode('/', trim($detail_url, '/'));
                    $searchId = end($parts);
                }

                // Defaults
                $market_price = "";
                $record_date = "";
                $period = "";
                $issue_size = "";
                $shares = "";

                // ----------------------
                // CALL BUYBACK API
                // ----------------------
                if ($searchId) {

                    $api_url = "https://groww.in/v1/api/stocks_portfolio/v2/buyback/fetch?searchId=".$searchId;

                    $api_response = wp_remote_get($api_url, [
                        'headers' => [
                            'User-Agent' => 'Mozilla/5.0',
                            'accept' => 'application/json'
                        ]
                    ]);

                    if (!is_wp_error($api_response)) {

                        $body = wp_remote_retrieve_body($api_response);
                        $json = json_decode($body, true);

                        if (!empty($json['data'])) {

                            $data = $json['data'];

                            // Enriched data
                            $offer_price = $data['offerPrice'] ?? $offer_price;
                            $record_date = $data['recordDate'] ?? "";

                            $start_date = $data['startDate'] ?? "";
                            $end_date   = $data['endDate'] ?? "";
                            $period = $start_date . " - " . $end_date;

                            $issue_size = $data['issuedAmount'] ?? "";
                            $shares     = $data['issuedShares'] ?? "";
                            $logo       = $data['companyLogo'] ?? $logo;

                            // ----------------------
                            // MARKET PRICE (NSE / BSE AUTO)
                            // ----------------------
                            if (!empty($data['exchange'])) {

                                $exchange = strtoupper($data['exchange']);
                                $price_api = "";

                                // BSE
                                if ($exchange === "BSE" && !empty($data['scripCode'])) {
                                    $price_api =
                                        "https://groww.in/v1/api/stocks_data/v1/accord_points/exchange/BSE/segment/CASH/latest_prices_ohlc/" .
                                        $data['scripCode'];
                                }

                                // NSE
                                elseif ($exchange === "NSE" && !empty($data['companySymbol'])) {
                                    $price_api =
                                        "https://groww.in/v1/api/stocks_data/v1/accord_points/exchange/NSE/segment/CASH/latest_prices_ohlc/" .
                                        $data['companySymbol'];
                                }

                                if ($price_api) {

                                    $price_res = wp_remote_get($price_api, [
                                        'headers' => [
                                            'User-Agent' => 'Mozilla/5.0',
                                            'accept' => 'application/json'
                                        ]
                                    ]);

                                    if (!is_wp_error($price_res)) {

                                        $price_body = wp_remote_retrieve_body($price_res);
                                        $price_json = json_decode($price_body, true);

                                        if (!empty($price_json['ltp'])) {
                                            $market_price = $price_json['ltp'];
                                        }
                                        elseif (!empty($price_json['close'])) {
                                            $market_price = $price_json['close'];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // ----------------------
                // SAVE DB
                // ----------------------
                global $wpdb;
                $table_name = BBM_TABLE;

                $wpdb->replace(
                    $table_name,
                    [
                        'company' => $company_name,
                        'price' => $offer_price,
                        'status' => $status,
                        'type' => $type,
                        'logo' => $logo,

                        'market_price' => $market_price,
                        'record_date' => $record_date,
                        'period' => $period,
                        'issue_size' => $issue_size,
                        'shares' => $shares,

                        'updated_at' => current_time('mysql')
                    ]
                );
            }
        }
    }
}
