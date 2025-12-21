<?php
/**
 * Plugin Name: Broker Manager
 * Description: Create and manage brokers with affiliate links, logos, referral codes, ratings, and detailed pros/cons.
 * Version: 2.1
 * Author: Rishi
 */

if (!defined('ABSPATH')) exit;

define('BM_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('BM_PLUGIN_URL', plugin_dir_url(__FILE__));

// Includes
require_once BM_PLUGIN_DIR . 'includes/class-bm-cpt.php';
require_once BM_PLUGIN_DIR . 'includes/class-bm-meta.php';
require_once BM_PLUGIN_DIR . 'includes/class-bm-admin.php';
require_once BM_PLUGIN_DIR . 'includes/class-bm-shortcode.php';

// Enqueue Assets (Frontend)
function bm_enqueue_assets() {
    wp_enqueue_style('bm-style', BM_PLUGIN_URL . 'assets/css/style.css', [], '2.1');
    wp_enqueue_script('bm-script', BM_PLUGIN_URL . 'assets/js/script.js', ['jquery'], '2.1', true);
    
    // Pass AJAX URL to script
    wp_localize_script('bm-script', 'bm_ajax', [
        'url' => admin_url('admin-ajax.php')
    ]);
}
add_action('wp_enqueue_scripts', 'bm_enqueue_assets');
