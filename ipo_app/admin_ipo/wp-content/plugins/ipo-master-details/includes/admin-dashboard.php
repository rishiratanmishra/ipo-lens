<?php
if (!defined('ABSPATH')) exit;

// ================= ADMIN DASHBOARD PAGE =================
function ipodetails_admin_page() {
    global $wpdb;

    // Stats Logic
    $count = $wpdb->get_var("SELECT COUNT(*) FROM " . IPOD_TABLE);
    $last  = $wpdb->get_var("SELECT MAX(fetched_at) FROM " . IPOD_TABLE);
    
    // Calculate Coverage (Master vs Details)
    $total_master = $wpdb->get_var("SELECT COUNT(*) FROM " . IPOD_MASTER . " WHERE status != 'Closed' OR id IN (SELECT ipo_id FROM ".IPOD_TABLE.")");
    $coverage_percent = $total_master > 0 ? round(($count / $total_master) * 100) : 0;

    // Recent Activity
    $recent = $wpdb->get_results("SELECT d.*, m.name FROM ".IPOD_TABLE." d LEFT JOIN ".IPOD_MASTER." m ON d.ipo_id = m.id ORDER BY d.updated_at DESC LIMIT 5");

    ?>
    <style>
        .ipod-wrapper { max-width: 1000px; margin-top: 20px; }
        .ipod-header { background: #fff; padding: 25px; border-radius: 8px; border: 1px solid #c3c4c7; display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .ipod-title h1 { margin: 0; font-size: 24px; color: #1d2327; font-weight: 700; }
        .ipod-status { display: flex; align-items: center; gap: 8px; background: #f0f6fc; padding: 5px 12px; border-radius: 20px; color: #1d2327; font-weight: 500; font-size: 12px; border: 1px solid rgba(0,0,0,0.05); }
        .dot { width: 8px; height: 8px; background: #00a32a; border-radius: 50%; display: inline-block; }
        
        .ipod-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
        .ipod-card { background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #c3c4c7; text-align: center; }
        .ipod-card h4 { margin: 0 0 10px; color: #646970; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
        .ipod-card .num { font-size: 32px; font-weight: 700; color: #2271b1; }
        .ipod-card .sub { font-size: 12px; color: #a7aaad; margin-top: 5px; }

        .ipod-table-box { background: #fff; border-radius: 8px; border: 1px solid #c3c4c7; overflow: hidden; }
        .ipod-box-header { padding: 15px 20px; background: #f9f9f9; border-bottom: 1px solid #eaecf0; font-weight: 600; color: #1d2327; display: flex; justify-content: space-between; }
        .ipod-table { width: 100%; border-collapse: collapse; }
        .ipod-table th { text-align: left; padding: 12px 20px; color: #646970; font-weight: 600; font-size: 13px; border-bottom: 2px solid #eaecf0; }
        .ipod-table td { padding: 12px 20px; border-bottom: 1px solid #eaecf0; color: #3c434a; font-size: 13px; }
        .ipod-table tr:last-child td { border-bottom: none; }
        .ipod-time { color: #8c8f94; font-family: monospace; }
        
        .progress-bar { height: 6px; background: #f0f0f1; border-radius: 3px; overflow: hidden; margin-top: 8px; }
        .progress-fill { height: 100%; background: #2271b1; }
    </style>

    <div class="wrap ipod-wrapper">
        
        <div class="ipod-header">
            <div class="ipod-title">
                <h1>IPO Details Pro</h1>
                <p style="margin: 5px 0 0; color: #646970;">Automated Deep-Data Scraping Engine</p>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <a href="<?php echo admin_url('admin-post.php?action=ipod_manual_batch'); ?>" class="button button-primary" style="display: flex; align-items: center; gap: 5px;">
                    <span class="dashicons dashicons-update" style="padding-top:2px"></span> Run Batch Now (15)
                </a>
                <div class="ipod-status">
                    <span class="dot"></span> System Active
                </div>
            </div>
        </div>

        <div class="ipod-stats">
            <div class="ipod-card">
                <h4>Total Details Stored</h4>
                <div class="num"><?php echo number_format($count); ?></div>
                <div class="sub">Records in DB</div>
            </div>
            <div class="ipod-card">
                <h4>Success Rate</h4>
                <div class="num"><?php echo $coverage_percent; ?>%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: <?php echo $coverage_percent; ?>%"></div>
                </div>
            </div>
            <div class="ipod-card">
                <h4>Last Activity</h4>
                <div class="num" style="font-size: 18px; line-height: 32px; color: #1d2327;">
                    <?php echo $last ? time_ago($last) : 'Never'; ?>
                </div>
                <div class="sub"><?php echo $last; ?></div>
            </div>
        </div>

        <div class="ipod-table-box">
            <div class="ipod-box-header">
                <span>Recent Updates (Last 5)</span>
                <span class="dashicons dashicons-database" style="color: #a7aaad;"></span>
            </div>
            <table class="ipod-table">
                <thead>
                    <tr>
                        <th>IPO Name</th>
                        <th>JSON Size</th>
                        <th>Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if($recent): ?>
                        <?php foreach($recent as $r): 
                            $size = strlen($r->details_json);
                            $size_kb = round($size / 1024, 1) . ' KB';
                        ?>
                            <tr>
                                <td><strong><?php echo esc_html($r->name ?: 'Unknown IPO #' . $r->ipo_id); ?></strong></td>
                                <td><span style="background: #f0f6fc; padding: 2px 6px; border-radius: 4px; color: #2271b1; font-size: 11px;"><?php echo $size_kb; ?></span></td>
                                <td class="ipod-time"><?php echo esc_html($r->updated_at); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr><td colspan="3" style="text-align:center; color:#a7aaad;">No data fetched yet.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

    </div>

    <?php
}

// Helper for "Time Ago"
function time_ago($datetime, $full = false) {
    if(!$datetime) return "Never";
    $now = new DateTime;
    $ago = new DateTime($datetime);
    $diff = $now->diff($ago);

    $diff->w = floor($diff->d / 7);
    $diff->d -= $diff->w * 7;

    $string = array(
        'y' => 'year', 'm' => 'month', 'w' => 'week',
        'd' => 'day', 'h' => 'hour', 'i' => 'min', 's' => 'sec',
    );
    foreach ($string as $k => &$v) {
        if ($diff->$k) {
            $v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
        } else {
            unset($string[$k]);
        }
    }

    if (!$full) $string = array_slice($string, 0, 1);
    return $string ? implode(', ', $string) . ' ago' : 'just now';
}
