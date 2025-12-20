<?php
if (!defined('ABSPATH')) exit;

class IPO_DB {
    public static function install() {
        global $wpdb;
        $table = $wpdb->prefix . 'ipos';
        $charset = $wpdb->get_charset_collate();
        $sql = "CREATE TABLE $table (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            company_name VARCHAR(255),
            symbol VARCHAR(50),
            status VARCHAR(20),
            open_date DATE NULL,
            close_date DATE NULL,
            listing_date DATE NULL,
            price_band_lower DECIMAL(10,2) NULL,
            price_band_upper DECIMAL(10,2) NULL,
            issue_price DECIMAL(10,2) NULL,
            lot_size INT NULL,
            is_sme TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) $charset;";
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }
}