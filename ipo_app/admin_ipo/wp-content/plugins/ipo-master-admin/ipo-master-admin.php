<?php
/**
 * Plugin Name: IPO Master Pro (Admin Control)
 * Description: IPO Premium Scraper + DB + Frontend Table + Full Admin Control
 * Version: 2.0
 * Author: Rishi Ratan Mishra
 */

if (!defined('ABSPATH')) exit;

global $wpdb;
define("IPOM_TABLE", $wpdb->prefix . "ipomaster");
define("IPOM_URL", plugin_dir_url(__FILE__));

// --- Constants ---
register_activation_hook(__FILE__, function() {
    global $wpdb;
    $charset = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS ".IPOM_TABLE." (
        id BIGINT PRIMARY KEY,
        name VARCHAR(255),
        is_sme TINYINT(1) DEFAULT 0,
        open_date VARCHAR(100),
        close_date VARCHAR(100),
        price_band VARCHAR(100),
        min_price VARCHAR(50),
        max_price VARCHAR(50),
        lot_size VARCHAR(50),
        issue_size_cr VARCHAR(50),
        premium VARCHAR(100),
        badge VARCHAR(20),
        allotment_date VARCHAR(100),
        listing_date VARCHAR(100),
        status VARCHAR(50),
        icon_url TEXT,
        slug VARCHAR(255),
        updated_at DATETIME
    ) $charset;";

    require_once(ABSPATH."wp-admin/includes/upgrade.php");
    dbDelta($sql);

    if(!wp_next_scheduled("ipom_hourly_event")){
        $interval = get_option('ipom_cron_interval', 'hourly');
        wp_schedule_event(time(), $interval, "ipom_hourly_event");
    }
});

register_deactivation_hook(__FILE__, function(){
    wp_clear_scheduled_hook("ipom_hourly_event");
});

// --- Cron & Fetch Logic ---
add_action("ipom_hourly_event", "ipom_fetch_data");
add_action("admin_post_ipom_manual_fetch", "ipom_fetch_data");

/**
 * Fetches the latest IPO data from the master source and updates local DB.
 * Can be triggered via Cron or Manual Action.
 */
function ipom_fetch_data(){
    global $wpdb;
    $url = "https://www.ipopremium.in/ipo";

    $response = wp_remote_get($url, ["headers"=>["user-agent"=>"Mozilla/5.0"]]);
    if(is_wp_error($response)) return;

    $body = wp_remote_retrieve_body($response);
    $json = json_decode($body, true);
    if(!$json || !isset($json["data"])) return;

    foreach($json["data"] as $item){

        $name = strip_tags($item["name"] ?? "");
        $is_sme = 0;

        if(preg_match('/\((.*?)\)/',$name,$m)){
            if(stripos($m[1],"SME") !== false) $is_sme = 1;
            $name = trim(str_replace($m[0],"",$name));
        }

        $premium_raw = $item["premium"] ?? "";
        $badge="";
        if(stripos($premium_raw,"SELLER")!==false) $badge="SELLER";
        elseif(stripos($premium_raw,"BUYER")!==false) $badge="BUYER";

        $premium = trim(strip_tags($premium_raw));

        $wpdb->replace(IPOM_TABLE,[
            "id"=>$item["id"] ?? 0,
            "name"=>$name,
            "is_sme"=>$is_sme,
            "open_date"=>$item["open"] ?? "",
            "close_date"=>$item["close"] ?? "",
            "price_band"=>$item["price"] ?? "",
            "min_price"=>$item["min_price"] ?? "",
            "max_price"=>$item["max_price"] ?? "",
            "lot_size"=>$item["lot_size"] ?? "",
            "issue_size_cr"=>$item["issue_size"] ?? "",
            "premium"=>$premium,
            "badge"=>$badge,
            "allotment_date"=>$item["allotment_date"] ?? "",
            "listing_date"=>$item["listing_date"] ?? "",
            "status"=>$item["current_status"] ?? "",
            "icon_url"=>$item["icon_url"] ?? "",
            "slug"=>$item["slug"] ?? "",
            "updated_at"=>current_time("mysql")
        ]);
    }

    update_option("ipom_last_fetch", current_time("mysql"));
    wp_redirect(admin_url("admin.php?page=ipo-master"));
    exit;
}

// --- Admin Menu & Dashboard ---
require_once plugin_dir_path(__FILE__) . 'includes/admin-dashboard.php';

add_action("admin_menu", function(){
    add_menu_page(
        "IPO Master",
        "IPO Master",
        "manage_options",
        "ipo-master",
        "ipom_dashboard_page",
        "dashicons-chart-line",
        26
    );

    add_submenu_page(
        "ipo-master",
        "IPO Data Table",
        "IPO Table",
        "manage_options",
        "ipo-master-table",
        "ipom_admin_table_page" // This function is in includes/admin-dashboard.php
    );
});

// --- Frontend Shortcode ---
add_shortcode("ipo_master_table", function(){
    global $wpdb;
    $table = IPOM_TABLE;

    $search = $_GET['ipo_search'] ?? "";
    $filter = $_GET['ipo_filter'] ?? "";
    $paged = isset($_GET['ipo_page']) ? intval($_GET['ipo_page']) : 1;
    $limit = 10;
    $offset = ($paged-1)*$limit;

    $where="WHERE 1=1";
    if($search) $where .= " AND name LIKE '%$search%'";
    if($filter=="sme") $where .= " AND is_sme=1";
    if($filter=="mainboard") $where .= " AND is_sme=0";

    $total = $wpdb->get_var("SELECT COUNT(*) FROM $table $where");
    $rows = $wpdb->get_results("SELECT * FROM $table $where ORDER BY id DESC LIMIT $limit OFFSET $offset");

    $last = get_option("ipom_last_fetch","Never");

    ob_start(); ?>
    <div>
        <p><strong>Last Refetch:</strong> <?php echo esc_html($last); ?></p>

        <form method="GET">
            <input type="text" name="ipo_search" value="<?php echo esc_attr($search); ?>" placeholder="Search IPO">
            <select name="ipo_filter">
                <option value="">All</option>
                <option value="sme" <?php selected($filter,"sme"); ?>>SME</option>
                <option value="mainboard" <?php selected($filter,"mainboard"); ?>>Mainboard</option>
            </select>
            <button type="submit">Apply</button>
        </form>

        <table border="1" cellpadding="6">
            <tr>
                <th>ID</th><th>Name</th><th>SME?</th>
                <th>Open</th><th>Close</th><th>Price</th><th>Premium</th><th>Status</th>
            </tr>
            <?php foreach($rows as $r): ?>
                <tr>
                    <td><?php echo $r->id; ?></td>
                    <td><?php echo $r->name; ?></td>
                    <td><?php echo $r->is_sme ? "SME" : "Mainboard"; ?></td>
                    <td><?php echo $r->open_date; ?></td>
                    <td><?php echo $r->close_date; ?></td>
                    <td><?php echo $r->price_band; ?></td>
                    <td><?php echo $r->premium; ?></td>
                    <td><?php echo $r->status; ?></td>
                </tr>
            <?php endforeach; ?>
        </table>

        <?php
        $pages = ceil($total/$limit);
        if($pages>1){
            echo "<div>";
            for($i=1;$i<=$pages;$i++){
                $link = add_query_arg(["ipo_page"=>$i]);
                echo "<a style='margin-right:6px' href='$link'>$i</a>";
            }
            echo "</div>";
        }
        ?>
    </div>
    <?php
    return ob_get_clean();
});
