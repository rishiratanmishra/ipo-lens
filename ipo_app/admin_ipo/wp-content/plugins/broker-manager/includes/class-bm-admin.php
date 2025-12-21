<?php
if (!defined('ABSPATH')) exit;

class BM_Admin {
    public function __construct() {
        add_filter('manage_broker_posts_columns', [$this, 'admin_columns']);
        add_action('manage_broker_posts_custom_column', [$this, 'column_content'], 10, 2);
    }

    public function admin_columns($columns) {
        $new = [];
        $new['cb'] = $columns['cb'];
        $new['thumbnail'] = 'Logo';
        $new['title'] = 'Broker Name';
        $new['taxonomy-broker_category'] = 'Category';
        $new['bm_rating'] = 'Rating';
        $new['bm_fees'] = 'Fees';
        $new['bm_clicks'] = 'Clicks';
        $new['bm_status'] = 'Status';
        return $new;
    }

    public function column_content($column, $post_id){
        switch($column){
            case 'thumbnail':
                if(has_post_thumbnail($post_id)){
                    echo get_the_post_thumbnail($post_id,'thumbnail',["style"=>"width:50px;height:50px;object-fit:contain;border-radius:4px"]);
                } else {
                    $logo_url = get_post_meta($post_id, 'bm_logo_url', true);
                    if($logo_url) {
                        echo '<img src="'.esc_url($logo_url).'" style="width:50px;height:50px;object-fit:contain;border-radius:4px">';
                    } else {
                        echo '<span style="color:#ccc">&mdash;</span>';
                    }
                }
            break;

            case 'bm_rating':
                $rating = get_post_meta($post_id, 'bm_rating', true);
                echo $rating ? '<strong>'.esc_html($rating).'</strong> / 5' : '-';
            break;

            case 'bm_fees':
                $fees = get_post_meta($post_id, 'bm_fees', true);
                echo $fees ? esc_html($fees) : '-';
            break;

            case 'bm_clicks':
                $clicks = get_post_meta($post_id, 'bm_click_count', true);
                echo intval($clicks);
            break;

            case 'bm_status':
                $status = get_post_meta($post_id,'bm_status',true);
                $featured = get_post_meta($post_id, 'bm_featured', true);
                
                if($status == 'active'){
                    echo '<span style="display:inline-block;padding:2px 6px;background:#c8f7c5;color:#2d8a34;border-radius:3px;font-size:11px;font-weight:bold;">ACTIVE</span>';
                } else {
                    echo '<span style="display:inline-block;padding:2px 6px;background:#ffd3d3;color:#b30000;border-radius:3px;font-size:11px;font-weight:bold;">INACTIVE</span>';
                }

                if($featured === 'yes') {
                    echo '<div style="margin-top:4px;"><span style="color:#d63384;font-size:10px;">★ Featured</span></div>';
                }
            break;
        }
    }
}

new BM_Admin();
