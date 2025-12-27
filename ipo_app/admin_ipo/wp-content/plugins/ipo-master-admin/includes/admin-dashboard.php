<?php
if (!defined('ABSPATH')) exit;

/**
 * Renders the Main IPO Master Dashboard Page.
 * Handles stats display, setting updates, and the main data table.
 */
function ipom_dashboard_page(){
    global $wpdb;
    
    // --- Statistics Query ---
    $total      = $wpdb->get_var("SELECT COUNT(*) FROM ".IPOM_TABLE);
    $total_sme  = $wpdb->get_var("SELECT COUNT(*) FROM ".IPOM_TABLE." WHERE is_sme=1");
    $total_main = $wpdb->get_var("SELECT COUNT(*) FROM ".IPOM_TABLE." WHERE is_sme=0");
    
    // --- Settings Handling (Cron) ---
    if(isset($_POST['ipom_save_settings'])){
        check_admin_referer('ipom_settings_nonce');
        $interval = sanitize_text_field($_POST['ipom_cron_interval']);
        update_option('ipom_cron_interval', $interval);
        
        // Reschedule Cron
        wp_clear_scheduled_hook("ipom_hourly_event");
        wp_schedule_event(time(), $interval, "ipom_hourly_event");
        
        echo '<div class="notice notice-success is-dismissible"><p>Settings Saved. Cron rescheduled to <strong>'.ucfirst($interval).'</strong>.</p></div>';
    }
    
    $current_interval = get_option('ipom_cron_interval', 'hourly');
    $last_fetch = get_option("ipom_last_fetch", "Never");

    // --- Table Filtering & Pagination ---
    $search = $_GET['s'] ?? '';
    $filter = $_GET['type'] ?? '';
    $paged  = max(1, intval($_GET['paged'] ?? 1));
    $limit  = 20;
    $offset = ($paged - 1) * $limit;

    $where = "WHERE 1=1";
    if($search) $where .= $wpdb->prepare(" AND name LIKE %s", "%$search%");
    if($filter == 'sme') $where .= " AND is_sme=1";
    if($filter == 'main') $where .= " AND is_sme=0";

    $table_data = $wpdb->get_results("SELECT * FROM ".IPOM_TABLE." $where ORDER BY id DESC LIMIT $limit OFFSET $offset");
    $total_rows = $wpdb->get_var("SELECT COUNT(*) FROM ".IPOM_TABLE." $where");
    $total_pages = ceil($total_rows / $limit);

    // --- Render View ---
    ?>
    <style>
        .ipom-header { background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #ccd0d4; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 1px rgba(0,0,0,.04); }
        .ipom-title h1 { margin: 0; font-weight: 700; color: #1d2327; font-size: 24px; }
        .ipom-title p { margin: 5px 0 0; color: #646970; }
        .ipom-actions { display: flex; align-items: center; gap: 10px; }
        .ipom-btn-fresh { background: #2271b1 !important; color: #fff !important; text-decoration: none; padding: 8px 15px; border-radius: 4px; font-weight: 600; transition: all 0.2s; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; height: 36px; line-height: 1; }
        .ipom-btn-fresh:hover { background: #135e96 !important; }
        
        /* Settings Form */
        .ipom-settings-form { display: flex; align-items: center; gap: 5px; background: #f0f0f1; padding: 5px 10px; border-radius: 4px; border: 1px solid #dcdcde; }
        .ipom-settings-form select { background: transparent; border: none; margin: 0; font-size: 13px; color: #3c434a; cursor: pointer; padding-right: 25px; }
        .ipom-settings-form button { background: none; border: none; color: #2271b1; cursor: pointer; font-size: 18px; margin-left: 5px; padding: 0; }
        
        .ipom-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .ipom-stat-card { background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #2271b1; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .ipom-stat-card.sme { border-left-color: #7f54b3; }
        .ipom-stat-card.main { border-left-color: #d63638; }
        .ipom-stat-card h3 { margin: 0 0 5px; color: #646970; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
        .ipom-stat-card .number { font-size: 28px; font-weight: 700; color: #1d2327; }

        .ipom-table-container { background: #fff; border-radius: 8px; border: 1px solid #ccd0d4; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
        .ipom-controls { padding: 15px; border-bottom: 1px solid #f0f0f1; display: flex; gap: 10px; background: #f9f9f9; align-items: center; }
        .ipom-controls select, .ipom-controls input { height: 36px; line-height: 1; }
        
        .wp-list-table { border: none; box-shadow: none; }
        .wp-list-table thead th { font-weight: 700; color: #1d2327; border-bottom: 2px solid #f0f0f1; padding: 15px 10px; }
        .wp-list-table td { vertical-align: middle; padding: 12px 10px; color: #3c434a; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
        .badge.sme { background: #f0f6fc; color: #7f54b3; border: 1px solid rgba(127, 84, 179, 0.2); }
        .badge.main { background: #fff8e5; color: #996800; border: 1px solid rgba(153, 104, 0, 0.2); }
        .badge-status { background: #f6f7f7; color: #50575e; border: 1px solid #dcdcde; }
        
        .ipom-pagination { padding: 15px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f0f0f1; background: #fff; }
        .page-numbers { display: flex; gap: 5px; }
        .page-row { display: inline-block; padding: 5px 10px; background: #f0f0f1; border-radius: 4px; text-decoration: none; color: #1d2327; font-size: 12px; }
        .page-row.active { background: #2271b1; color: #fff; }
    </style>

    <div class="wrap" style="max-width: 1200px; margin-top: 20px;">
        
        <!-- Header Section -->
        <div class="ipom-header">
            <div class="ipom-title">
                <h1>IPO Master Dashboard</h1>
                <p>Real-time IPO Data Scraper & Management</p>
                <div style="font-size: 12px; margin-top: 8px; color: #646970;">
                    <span class="dashicons dashicons-clock" style="font-size: 14px; vertical-align: text-top;"></span> 
                    Last Updated: <strong><?php echo esc_html($last_fetch); ?></strong>
                </div>
            </div>
            
            <div class="ipom-actions">
                <!-- Cron Settings -->
                <form method="POST" class="ipom-settings-form">
                    <?php wp_nonce_field('ipom_settings_nonce'); ?>
                    <input type="hidden" name="ipom_save_settings" value="1">
                    <span class="dashicons dashicons-admin-settings" style="color:#646970;"></span>
                    <select name="ipom_cron_interval" onchange="this.form.submit()">
                        <option value="hourly" <?php selected($current_interval, 'hourly'); ?>>Every Hour</option>
                        <option value="twicedaily" <?php selected($current_interval, 'twicedaily'); ?>>Twice Daily</option>
                        <option value="daily" <?php selected($current_interval, 'daily'); ?>>Daily</option>
                    </select>
                </form>

                <a class="ipom-btn-fresh" href="<?php echo admin_url("admin-post.php?action=ipom_manual_fetch"); ?>">
                    <span class="dashicons dashicons-update"></span> Fetch Now
                </a>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="ipom-stats-grid">
            <div class="ipom-stat-card">
                <h3>Total IPOs</h3>
                <div class="number"><?php echo number_format($total); ?></div>
            </div>
            <div class="ipom-stat-card sme">
                <h3>SME IPOs</h3>
                <div class="number"><?php echo number_format($total_sme); ?></div>
            </div>
            <div class="ipom-stat-card main">
                <h3>Mainboard</h3>
                <div class="number"><?php echo number_format($total_main); ?></div>
            </div>
        </div>

        <!-- Main Data Table -->
        <div class="ipom-table-container">
            <!-- Search & Filter Controls -->
            <form method="GET" class="ipom-controls">
                <input type="hidden" name="page" value="ipo-master">
                
                <input type="text" name="s" placeholder="Search IPO name..." value="<?php echo esc_attr($search); ?>">
                
                <select name="type">
                    <option value="">All Types</option>
                    <option value="main" <?php selected($filter, 'main'); ?>>Mainboard</option>
                    <option value="sme" <?php selected($filter, 'sme'); ?>>SME</option>
                </select>

                <button type="submit" class="button">Apply Filters</button>
                
                <?php if($search || $filter): ?>
                    <a href="<?php echo admin_url('admin.php?page=ipo-master'); ?>" class="button">Reset</a>
                <?php endif; ?>
            </form>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th style="width: 60px;">ID</th>
                        <th>IPO Name</th>
                        <th style="width: 100px;">Type</th>
                        <th>Dates (Open - Close)</th>
                        <th>Price Band</th>
                        <th style="width: 120px;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if($table_data): ?>
                        <?php foreach($table_data as $r): ?>
                            <tr>
                                <td>#<?php echo $r->id; ?></td>
                                <td>
                                    <strong><?php echo esc_html($r->name); ?></strong><br>
                                    <small style="color: #646970;"><?php echo esc_html($r->slug); ?></small>
                                </td>
                                <td>
                                    <?php if($r->is_sme): ?>
                                        <span class="badge sme">SME</span>
                                    <?php else: ?>
                                        <span class="badge main">MAIN</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php echo esc_html($r->open_date); ?> <span style="color:#ccc">→</span> <?php echo esc_html($r->close_date); ?>
                                </td>
                                <td><?php echo esc_html($r->price_band); ?></td>
                                <td><span class="badge badge-status"><?php echo esc_html($r->status); ?></span></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr><td colspan="6" style="text-align:center; padding: 20px;">No IPOs found.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="ipom-pagination">
                <div class="tablenav-pages">
                    <span class="displaying-num"><?php echo $total_rows; ?> items</span>
                    <?php if($total_pages > 1): ?>
                        <span class="pagination-links">
                            <?php for($i=1; $i<=$total_pages; $i++): 
                                if (abs($i - $paged) > 3 && $i != 1 && $i != $total_pages) continue;
                                $class = ($paged == $i) ? 'page-row active' : 'page-row';
                                $url = add_query_arg(['paged'=>$i]);
                            ?>
                                <a class="<?php echo $class; ?>" href="<?php echo $url; ?>"><?php echo $i; ?></a>
                            <?php endfor; ?>
                        </span>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    <?php
}

function ipom_admin_table_page(){
    ipom_dashboard_page(); // Reuse the same modern view
}
