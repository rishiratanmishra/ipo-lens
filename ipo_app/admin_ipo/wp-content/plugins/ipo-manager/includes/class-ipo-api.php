<?php
if (!defined('ABSPATH')) exit;

class IPO_API {

    public static function sync() {
        $api_url = get_option('ipo_api_url');
        $api_key = get_option('ipo_api_key');
        if (!$api_url || !$api_key) return;

        $response = wp_remote_get($api_url, [
            'headers' => ['X-API-KEY' => $api_key],
            'timeout' => 20
        ]);

        if (is_wp_error($response)) return;
        if (wp_remote_retrieve_response_code($response) !== 200) return;

        $json = json_decode(wp_remote_retrieve_body($response), true);
        if (!$json) return;

        foreach (['upcoming'=>'UPCOMING','listed'=>'LISTED','active'=>'OPEN','closed'=>'CLOSED'] as $key=>$status) {
            if (isset($json[$key])) self::process($json[$key], $status);
        }
    }

    private static function process($list, $defaultStatus) {
        global $wpdb;
        $table = $wpdb->prefix . 'ipos';

        foreach ($list as $item) {
            $name = $item['name'] ?? '';
            if (!$name) continue;

            $existing = $wpdb->get_var($wpdb->prepare("SELECT id FROM $table WHERE company_name=%s", $name));

            $data = [
                'symbol' => $item['symbol'] ?? '',
                'status' => strtoupper($item['status'] ?? $defaultStatus),
                'open_date' => $item['bidding_start_date'] ?? null,
                'close_date' => $item['bidding_end_date'] ?? null,
                'listing_date' => $item['listing_date'] ?? null,
                'price_band_lower' => $item['min_price'] ?? null,
                'price_band_upper' => $item['max_price'] ?? null,
                'issue_price' => $item['issue_price'] ?? null,
                'lot_size' => $item['lot_size'] ?? null,
                'is_sme' => !empty($item['is_sme']) ? 1 : 0,
            ];

            if ($existing) {
                $wpdb->update($table, $data, ['id'=>$existing]);
            } else {
                $data['company_name'] = $name;
                $wpdb->insert($table, $data);
            }
        }
    }
}