<?php
/*
Plugin Name: IPO Manager Pro
Description: IPO Manager with API Sync + CRUD + Admin Table
Version: 3.1.0
Author: Rishi Ratan Mishra
*/
if (!defined('ABSPATH')) exit;

define('IPO_MANAGER_VERSION', '3.1.0');
define('IPO_MANAGER_PATH', plugin_dir_path(__FILE__));
define('IPO_MANAGER_URL', plugin_dir_url(__FILE__));

require_once IPO_MANAGER_PATH . 'includes/class-ipo-db.php';
require_once IPO_MANAGER_PATH . 'includes/class-ipo-api.php';
require_once IPO_MANAGER_PATH . 'includes/class-ipo-cron.php';
require_once IPO_MANAGER_PATH . 'includes/class-ipo-admin.php';

register_activation_hook(__FILE__, ['IPO_DB', 'install']);
register_deactivation_hook(__FILE__, ['IPO_Cron', 'clear']);

add_action('plugins_loaded', function () {
    new IPO_Admin();
    new IPO_Cron();
});