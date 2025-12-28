<?php
class BBM_Admin{
    function __construct(){
        add_action("admin_menu",[$this,"menu"]);
        add_action("admin_post_bbm_fetch",[$this,"manual_fetch"]);
    }

    function menu(){
        add_menu_page("Buyback Manager","Buybacks","manage_options","bbm",[$this,"page"], "dashicons-chart-line");
    }

    function page(){
        global $wpdb;
        $table_name = BBM_TABLE;

        // --- Handle Filters ---
        $search = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
        $filter_status = isset($_GET['status']) ? sanitize_text_field($_GET['status']) : '';
        
        $where = "WHERE 1=1";
        if($search){
            $where .= $wpdb->prepare(" AND company LIKE %s", "%$search%");
        }
        if($filter_status){
            if($filter_status === 'OPEN') $where .= " AND type = 'Open'";
            elseif($filter_status === 'UPCOMING') $where .= " AND type = 'Upcoming'";
            elseif($filter_status === 'CLOSED') $where .= " AND type = 'Closed'";
        }

        // --- Stats Queries ---
        $stats_total = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
        $stats_open = $wpdb->get_var("SELECT COUNT(*) FROM $table_name WHERE type='Open'");
        $stats_upcoming = $wpdb->get_var("SELECT COUNT(*) FROM $table_name WHERE type='Upcoming'");
        $stats_closed = $wpdb->get_var("SELECT COUNT(*) FROM $table_name WHERE type='Closed'");

        // --- Main Data Query (Source Order) ---
        // Scraper inserts Newest -> Oldest. So ID ASC preserves that order.
        $results = $wpdb->get_results("SELECT * FROM $table_name $where ORDER BY id ASC");
        
        // --- Last Fetch Time ---
        // Ideally checking the latest updated_at from DB
        $last_fetch = $wpdb->get_var("SELECT updated_at FROM $table_name ORDER BY updated_at DESC LIMIT 1");
        if(!$last_fetch) $last_fetch = "Never";

        ?>
        <style>
            /* Reset & Core Framework */
            .bbm-wrap { max-width: 1200px; margin: 20px auto; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; }
            .bbm-header { background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #ccd0d4; box-shadow: 0 1px 2px rgba(0,0,0,0.04); display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            
            /* Typography */
            .bbm-title h1 { margin: 0; font-size: 24px; color: #1d2327; font-weight: 700; }
            .bbm-title p { margin: 5px 0 0; color: #646970; font-size: 13px; }
            
            /* Stats Grid */
            .bbm-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 25px; }
            .bbm-card { background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #2271b1; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
            .bbm-card h3 { margin: 0 0 5px; font-size: 12px; text-transform: uppercase; color: #646970; letter-spacing: 0.5px; }
            .bbm-card .number { font-size: 28px; font-weight: 700; color: #1d2327; }
            
            /* Card Colors based on type */
            .bbm-card.total { border-left-color: #2271b1; }
            .bbm-card.open { border-left-color: #00a32a; }
            .bbm-card.upcoming { border-left-color: #dba617; }
            .bbm-card.closed { border-left-color: #d63638; }

            /* Actions Area */
            .bbm-actions { display: flex; align-items: center; gap: 10px; }
            .bbm-fetch-btn { background: #2271b1; color: #fff; border: none; padding: 0 15px; height: 40px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; transition: background 0.2s; }
            .bbm-fetch-btn:hover { background: #135e96; color: #fff; }

            /* Table Section */
            .bbm-table-wrapper { background: #fff; border: 1px solid #ccd0d4; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.02); overflow: hidden; }
            
            /* Filters */
            .bbm-filters { padding: 15px; background: #f8f9fa; border-bottom: 1px solid #e2e4e7; display: flex; gap: 10px; }
            .bbm-input, .bbm-select { height: 36px; border: 1px solid #8c8f94; border-radius: 4px; padding: 0 10px; font-size: 14px; }
            .bbm-search-input { width: 250px; }
            
            /* Custom Table */
            .bbm-table { width: 100%; border-collapse: collapse; text-align: left; }
            .bbm-table th { background: #fff; padding: 15px; font-weight: 600; color: #1d2327; border-bottom: 2px solid #f0f0f1; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
            .bbm-table td { padding: 12px 15px; border-bottom: 1px solid #f0f0f1; vertical-align: middle; color: #3c434a; font-size: 14px; }
            .bbm-table tr:last-child td { border-bottom: none; }
            .bbm-table tr:hover { background: #fcfcfc; }
            
            /* Table Elements */
            .bbm-company-row { display: flex; align-items: center; gap: 12px; }
            .bbm-logo { width: 32px; height: 32px; border-radius: 50%; object-fit: contain; background: #f0f0f1; border: 1px solid #eee; }
            .bbm-company-name { font-weight: 600; color: #1d2327; display: block; }
            .bbm-company-meta { font-size: 12px; color: #646970; }
            
            .bbm-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; letter-spacing: 0.02em; }
            .bbm-badge.open { background: #ecf7ed; color: #00a32a; border: 1px solid rgba(0, 163, 42, 0.2); }
            .bbm-badge.upcoming { background: #fff8e5; color: #b89500; border: 1px solid rgba(184, 149, 0, 0.2); }
            .bbm-badge.closed { background: #fbeaea; color: #d63638; border: 1px solid rgba(214, 54, 56, 0.2); }
            
            .bbm-price { font-family: monospace; font-size: 13px; font-weight: 600; }
        </style>

        <div class="bbm-wrap">
            
            <!-- Header -->
            <div class="bbm-header">
                <div class="bbm-title">
                    <h1>Buyback Manager</h1>
                    <p>Live Buyback Data & Scraper Control</p>
                    <div style="font-size: 12px; color: #646970; margin-top: 5px;">
                        <span class="dashicons dashicons-clock" style="font-size:14px; vertical-align:middle"></span>
                        Last Updated: <strong><?php echo esc_html($last_fetch); ?></strong>
                    </div>
                </div>
                <form method="post" action="<?php echo admin_url('admin-post.php'); ?>">
                    <input type="hidden" name="action" value="bbm_fetch">
                    <?php wp_nonce_field('bbm_fetch_action', 'bbm_fetch_nonce'); ?>
                    <button class="bbm-fetch-btn" onclick="return confirm('Starting fetch process. This may take 1-2 minutes due to safety delays. Continue?');">
                        <span class="dashicons dashicons-update"></span> Fetch Fresh Data
                    </button>
                </form>
            </div>

            <!-- Stats Grid -->
            <div class="bbm-stats-grid">
                <div class="bbm-card total">
                    <h3>Total Buybacks</h3>
                    <div class="number"><?php echo number_format($stats_total); ?></div>
                </div>
                <div class="bbm-card open">
                    <h3>Open Now</h3>
                    <div class="number"><?php echo number_format($stats_open); ?></div>
                </div>
                <div class="bbm-card upcoming">
                    <h3>Upcoming</h3>
                    <div class="number"><?php echo number_format($stats_upcoming); ?></div>
                </div>
                <div class="bbm-card closed">
                    <h3>Closed</h3>
                    <div class="number"><?php echo number_format($stats_closed); ?></div>
                </div>
            </div>

            <!-- Main Table Wrapper -->
            <div class="bbm-table-wrapper">
                
                <!-- Filters -->
                <form method="GET" class="bbm-filters">
                    <input type="hidden" name="page" value="bbm">
                    <input type="text" name="s" class="bbm-input bbm-search-input" value="<?php echo esc_attr($search); ?>" placeholder="Search Company...">
                    <select name="status" class="bbm-select">
                        <option value="">All Statuses</option>
                        <option value="OPEN" <?php selected($filter_status, 'OPEN'); ?>>Open</option>
                        <option value="UPCOMING" <?php selected($filter_status, 'UPCOMING'); ?>>Upcoming</option>
                        <option value="CLOSED" <?php selected($filter_status, 'CLOSED'); ?>>Closed</option>
                    </select>
                    <button type="submit" class="button action">Apply Filters</button>
                    <?php if($search || $filter_status): ?>
                        <a href="<?php echo admin_url('admin.php?page=bbm'); ?>" class="button">Reset</a>
                    <?php endif; ?>
                </form>

                <!-- Custom Table -->
                <table class="bbm-table">
                    <thead>
                        <tr>
                            <th style="width: 50px;">ID</th>
                            <th>Company</th>
                            <th>Type</th>
                            <th>Buyback Price</th>
                            <th>Status</th>
                            <th>Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if($results): ?>
                            <?php foreach($results as $row): 
                                $status_lower = strtolower($row->status);
                                $type_lower = strtolower($row->type); // Open, Upcoming, Closed
                                
                                // Determine Badge Class
                                $badge_class = 'closed';
                                if($type_lower === 'open') $badge_class = 'open';
                                if($type_lower === 'upcoming') $badge_class = 'upcoming';
                            ?>
                                <tr>
                                    <td>#<?php echo esc_html($row->id); ?></td>
                                    <td>
                                        <div class="bbm-company-row">
                                            <?php if($row->logo): ?>
                                                <img src="<?php echo esc_url($row->logo); ?>" class="bbm-logo" alt="logo">
                                            <?php endif; ?>
                                            <div>
                                                <span class="bbm-company-name"><?php echo esc_html($row->company); ?></span>
                                                <span class="bbm-company-meta">
                                                    <?php echo ($row->issue_size? esc_html($row->issue_size) : 'N/A'); ?>
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="bbm-badge <?php echo $badge_class; ?>">
                                            <?php echo esc_html($row->type); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <span class="bbm-price"><?php echo esc_html($row->price); ?></span>
                                    </td>
                                    <td>
                                        <?php echo esc_html($row->status); ?>
                                    </td>
                                    <td style="color:#888; font-size:12px;">
                                        <?php echo esc_html($row->updated_at); ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="6" style="padding: 30px; text-align: center; color: #888;">
                                    No buybacks found matching your criteria.
                                </td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

        </div>
        <?php
    }

    function manual_fetch(){
        check_admin_referer('bbm_fetch_action', 'bbm_fetch_nonce');
        set_time_limit(300);
        BBM_Scraper::fetch_and_store();
        wp_redirect(admin_url("admin.php?page=bbm&updated=1"));
        exit;
    }
}
new BBM_Admin();
