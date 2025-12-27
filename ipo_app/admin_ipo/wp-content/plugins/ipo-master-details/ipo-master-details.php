<?php
/**
 * Plugin Name: IPO Details Pro
 * Description: Fetches IPO detail pages via external scraper API and stores JSON into wp_ipodetails (cron-based, production ready)
 * Version: 1.0
 * Author: Internal
 */

if (!defined('ABSPATH')) exit;

global $wpdb;

/* ================= CONFIG ================= */

define("IPOD_MASTER", $wpdb->prefix . "ipomaster");
define("IPOD_TABLE",  $wpdb->prefix . "ipodetails");

/* External scraper API (your PHP scraper) */
define("IPOD_SCRAPER_API", "https://zolaha.com/ipo_app/backend_ipo/api/ipo_details.php");

/* ================= ACTIVATE ================= */

register_activation_hook(__FILE__, function () {
    global $wpdb;

    $charset = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS " . IPOD_TABLE . " (
        ipo_id BIGINT PRIMARY KEY,
        slug VARCHAR(255),
        details_json LONGTEXT,
        fetched_at DATETIME,
        updated_at DATETIME
    ) $charset;";

    require_once ABSPATH . "wp-admin/includes/upgrade.php";
    dbDelta($sql);

    if (!wp_next_scheduled("ipodetails_cron_event")) {
        wp_schedule_event(time(), "hourly", "ipodetails_cron_event");
    }
});

/* ================= DEACTIVATE ================= */

register_deactivation_hook(__FILE__, function () {
    wp_clear_scheduled_hook("ipodetails_cron_event");
});

/* ================= CRON HANDLER ================= */

add_action("ipodetails_cron_event", "ipodetails_fetch_all");

function ipodetails_fetch_all() {
    global $wpdb;

    $ipos = $wpdb->get_results("
        SELECT id, slug, open_date, close_date, status
        FROM " . IPOD_MASTER . "
        WHERE id > 0 AND slug <> ''
    ");

    if (!$ipos) return;

    foreach ($ipos as $ipo) {

        if (!ipodetails_should_fetch(
            $ipo->id,
            $ipo->open_date,
            $ipo->close_date
        )) {
            continue;
        }

        $url = IPOD_SCRAPER_API . "?id={$ipo->id}&slug={$ipo->slug}";

        $response = wp_remote_get($url, [
            "timeout" => 40,
            "headers" => [
                "User-Agent" => "IPO Details Bot"
            ]
        ]);

        if (is_wp_error($response)) continue;

        $body = wp_remote_retrieve_body($response);
        $json = json_decode($body, true);

        if (!$json || !isset($json["ipo_name"])) continue;

        $wpdb->replace(IPOD_TABLE, [
            "ipo_id"       => $ipo->id,
            "slug"         => $ipo->slug,
            "details_json" => wp_json_encode($json, JSON_UNESCAPED_UNICODE),
            "fetched_at"   => current_time("mysql"),
            "updated_at"   => current_time("mysql")
        ]);
    }
}

/* ================= FETCH LOGIC ================= */

function ipodetails_should_fetch($ipo_id, $open_date, $close_date) {
    global $wpdb;

    $row = $wpdb->get_row(
        $wpdb->prepare("SELECT fetched_at FROM " . IPOD_TABLE . " WHERE ipo_id = %d", $ipo_id)
    );

    $now  = time();
    $last = $row ? strtotime($row->fetched_at) : 0;

    $open_ts  = strtotime($open_date);
    $close_ts = strtotime($close_date);

    /* UPCOMING → once per day */
    if ($now < $open_ts) {
        return ($now - $last) > 86400;
    }

    /* OPEN → every 1 hour */
    if ($now >= $open_ts && $now <= $close_ts) {
        return ($now - $last) > 3600;
    }

    /* CLOSED → only once */
    return !$row;
}

/* ================= ADMIN PAGE ================= */

add_action("admin_menu", function () {
    add_menu_page(
        "IPO Details",
        "IPO Details",
        "manage_options",
        "ipo-details",
        "ipodetails_admin_page",
        "dashicons-media-spreadsheet",
        27
    );
});

function ipodetails_admin_page() {
    global $wpdb;

    $count = $wpdb->get_var("SELECT COUNT(*) FROM " . IPOD_TABLE);
    $last  = $wpdb->get_var("SELECT MAX(fetched_at) FROM " . IPOD_TABLE);

    echo "<div class='wrap'>";
    echo "<h1>IPO Details Pro</h1>";
    echo "<p><strong>Total IPO Details Stored:</strong> {$count}</p>";
    echo "<p><strong>Last Fetch:</strong> " . ($last ?: "Never") . "</p>";
    echo "<p>This plugin runs fully via cron. No user scraping.</p>";
    echo "</div>";
}
