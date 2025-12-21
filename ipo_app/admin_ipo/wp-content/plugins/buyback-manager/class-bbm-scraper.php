<?php
class BBM_Scraper {

    public static function fetch_and_store() {
        $url = "https://groww.in/buy-back";
        
        $response = wp_remote_get($url, array(
            'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        ));

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
        // handling HTML5 parsing issues gracefully
        @$dom->loadHTML($html);
        $xpath = new DOMXPath($dom);

        // find all H2 headings (Open / Upcoming / Recently closed)
        $headings = $xpath->query("//h2");

        foreach ($headings as $h2) {
            $title_text = strtolower(trim($h2->textContent));
            $type = null;

            if (strpos($title_text, "open") === 0) $type = "Open";
            elseif (strpos($title_text, "upcoming") === 0) $type = "Upcoming";
            elseif (strpos($title_text, "recently closed") === 0) $type = "Closed";

            if (!$type) continue;

            // next table after heading
            $table = $h2->nextSibling;
            while ($table && $table->nodeName !== "div") {
                $table = $table->nextSibling;
            }

            if (!$table) continue;

            $rows = $xpath->query(".//tbody/tr", $table);

            foreach ($rows as $row) {
                $cols = $xpath->query(".//td", $row);

                if ($cols->length >= 4) {
                    $company_name = trim($cols->item(1)->textContent);
                    $offer_price = trim($cols->item(2)->textContent);
                    $status = trim($cols->item(3)->textContent); 

                    $logoNode = $xpath->query(".//noscript//img", $cols->item(0));
                    $logo = $logoNode->length ? $logoNode->item(0)->getAttribute("src") : "";

                    // DB Insert/Update
                    global $wpdb;
                    $table_name = BBM_TABLE; // Uses constant defined in main file
                    
                    // We use replace to handle updates on duplicate unique keys (company + type)
                    $wpdb->replace(
                        $table_name,
                        array(
                            'company' => $company_name,
                            'price' => $offer_price,
                            'status' => $status,
                            'type' => $type,
                            'logo' => $logo,
                            'updated_at' => current_time('mysql')
                        ),
                        array('%s', '%s', '%s', '%s', '%s', '%s')
                    );
                }
            }
        }
    }
}

add_action("rest_api_init", function () {
    register_rest_route("buyback/v1", "/list", [
        "methods" => "GET",
        "callback" => function () {
            $p = get_posts(["post_type" => "buybacks", "numberposts" => -1]);
            $d = [];
            foreach ($p as $x) {
                $d[] = [
                    "company" => $x->post_title,
                    "price" => get_post_meta($x->ID, "bbm_price", true),
                    "status" => get_post_meta($x->ID, "bbm_status", true),
                    "logo" => get_post_meta($x->ID, "bbm_logo", true),
                    "type" => get_post_meta($x->ID, "bbm_type", true)
                ];
            }
            return $d;
        }
    ]);
});
