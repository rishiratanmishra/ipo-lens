<?php
if (!defined('ABSPATH')) exit;

class IPO_Cron {

    public function __construct() {
        add_action('ipo_manager_sync_event', ['IPO_API', 'sync']);
    }

    public static function schedule() {
        $freq = get_option('ipo_sync_frequency','disabled');
        self::clear();

        if ($freq === 'daily') wp_schedule_event(time(),'daily','ipo_manager_sync_event');
        if ($freq === 'weekly') wp_schedule_event(time(),'weekly','ipo_manager_sync_event');
    }

    public static function clear() {
        wp_clear_scheduled_hook('ipo_manager_sync_event');
    }
}