<?php
if (!defined('ABSPATH')) exit;

class IPO_Admin {

    public function __construct() {
        add_action('admin_menu', [$this,'menu']);
        add_action('admin_post_ipo_save_settings', [$this,'save_settings']);
        add_action('admin_action_ipo_manual_sync', [$this,'manual_sync']);
        add_action('admin_post_ipo_save', [$this,'save_ipo']);
        add_action('admin_action_ipo_delete', [$this,'delete_ipo']);
    }

    public function menu() {
        add_menu_page('IPO Manager','IPO Manager','manage_options','ipo-dashboard',[$this,'list_page']);
        add_submenu_page('ipo-dashboard','Add New','Add New','manage_options','ipo-add',[$this,'add_page']);
        add_submenu_page('ipo-dashboard','Settings','Settings','manage_options','ipo-settings',[$this,'settings']);
    }

    public function list_page() {
        require_once IPO_MANAGER_PATH . 'includes/class-ipo-list-table.php';
        $table = new IPO_List_Table();
        $table->prepare_items();
        include IPO_MANAGER_PATH . 'views/list.php';
    }

    public function add_page() {
        global $wpdb;
        $table = $wpdb->prefix.'ipos';
        $item = null;

        if (!empty($_GET['id'])) {
            $item = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE id=%d", $_GET['id']));
        }

        include IPO_MANAGER_PATH.'views/form.php';
    }

    public function save_ipo() {
        if (!current_user_can('manage_options')) return;
        check_admin_referer('ipo_form');

        global $wpdb;
        $table = $wpdb->prefix.'ipos';

        $data = [
            'company_name'      => sanitize_text_field($_POST['company_name']),
            'symbol'            => sanitize_text_field($_POST['symbol']),
            'status'            => sanitize_text_field($_POST['status']),
            'is_sme'            => isset($_POST['is_sme']) ? 1 : 0,
            
            // Dates
            'open_date'         => sanitize_text_field($_POST['open_date']),
            'close_date'        => sanitize_text_field($_POST['close_date']),
            'listing_date'      => sanitize_text_field($_POST['listing_date']),
            
            // Pricing
            'price_band_lower'  => sanitize_text_field($_POST['price_band_lower']),
            'price_band_upper'  => sanitize_text_field($_POST['price_band_upper']),
            'issue_price'       => sanitize_text_field($_POST['issue_price']),
            'listing_price'     => sanitize_text_field($_POST['listing_price']),
            'listing_gains'     => sanitize_text_field($_POST['listing_gains']), // Text as per request/schema
            
            // Details
            'lot_size'          => intval($_POST['lot_size']),
            'gmp'               => sanitize_text_field($_POST['gmp']),
            'subscription'      => sanitize_text_field($_POST['subscription']),
            
            // URLs & Text
            'document_url'      => esc_url_raw($_POST['document_url']),
            'logo_url'          => esc_url_raw($_POST['logo_url']),
            'additional_text'   => sanitize_textarea_field($_POST['additional_text']),
            'custom_data'       => sanitize_textarea_field($_POST['custom_data']),
        ];

        if (!empty($_POST['id'])) {
            $wpdb->update($table,$data,['id'=>intval($_POST['id'])]);
        } else {
            $wpdb->insert($table,$data);
        }

        wp_redirect(admin_url('admin.php?page=ipo-dashboard&success=1'));
        exit;
    }

    public function delete_ipo() {
        if (!current_user_can('manage_options')) return;
        global $wpdb;
        $table = $wpdb->prefix.'ipos';
        $wpdb->delete($table,['id'=>intval($_GET['id'])]);
        wp_redirect(admin_url('admin.php?page=ipo-dashboard&deleted=1'));
        exit;
    }

    public function manual_sync() {
        IPO_API::sync();
        wp_redirect(admin_url('admin.php?page=ipo-dashboard&synced=1'));
        exit;
    }

    public function settings() {
        include IPO_MANAGER_PATH.'views/settings.php';
    }

    public function save_settings() {
        if (!current_user_can('manage_options')) return;
        check_admin_referer('ipo_settings');

        update_option('ipo_api_url', sanitize_text_field($_POST['ipo_api_url']));
        update_option('ipo_api_key', sanitize_text_field($_POST['ipo_api_key']));
        update_option('ipo_sync_frequency', sanitize_text_field($_POST['ipo_sync_frequency']));

        IPO_Cron::schedule();

        wp_redirect(admin_url('admin.php?page=ipo-settings&saved=1'));
        exit;
    }
}