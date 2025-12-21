<?php
if (!defined('ABSPATH')) exit;

class BM_Meta {
    public function __construct() {
        add_action('add_meta_boxes', [$this, 'add_meta_boxes']);
        add_action('save_post', [$this, 'save_meta']);
    }

    public function add_meta_boxes() {
        add_meta_box('bm_broker_details', 'Broker Information', [$this, 'render_meta_box'], 'broker', 'normal', 'high');
        add_meta_box('bm_broker_pros_cons', 'Pros & Cons', [$this, 'render_pros_cons_box'], 'broker', 'normal', 'default');
    }

    public function render_meta_box($post) {
        $affiliate = get_post_meta($post->ID, 'bm_affiliate', true);
        $status = get_post_meta($post->ID, 'bm_status', true);
        $referral = get_post_meta($post->ID, 'bm_referral', true);
        $rating = get_post_meta($post->ID, 'bm_rating', true);
        $min_deposit = get_post_meta($post->ID, 'bm_min_deposit', true);
        $fees = get_post_meta($post->ID, 'bm_fees', true);
        $logo_url = get_post_meta($post->ID, 'bm_logo_url', true);
        $featured = get_post_meta($post->ID, 'bm_featured', true);
        $clicks = get_post_meta($post->ID, 'bm_click_count', true);
        if(!$clicks) $clicks = 0;
        ?>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <!-- Left Column -->
            <div>
                <p>
                    <label><strong>Affiliate Link:</strong></label><br>
                    <input type="url" name="bm_affiliate" value="<?php echo esc_attr($affiliate); ?>" style="width:100%;" placeholder="https://...">
                </p>
                
                <p>
                    <label><strong>Valuable Link (Logo URL):</strong></label><br>
                    <input type="url" name="bm_logo_url" value="<?php echo esc_attr($logo_url); ?>" style="width:100%;" placeholder="https://... (Optional if using Featured Image)">
                </p>

                
                <p>
                    <label><strong>Referral Code:</strong></label><br>
                    <input type="text" name="bm_referral" value="<?php echo esc_attr($referral); ?>" style="width:100%;" placeholder="e.g. WELCOME50">
                </p>

                <p>
                    <label><strong>Status:</strong></label><br>
                    <select name="bm_status" style="width:100%;">
                        <option value="active" <?php selected($status,'active'); ?>>Active</option>
                        <option value="inactive" <?php selected($status,'inactive'); ?>>Inactive</option>
                    </select>
                </p>
            </div>

            <!-- Right Column -->
            <div>
                <p>
                    <label><strong>Rating (0-5):</strong></label><br>
                    <input type="number" step="0.1" min="0" max="5" name="bm_rating" value="<?php echo esc_attr($rating); ?>" style="width:100%;">
                </p>

                <p>
                    <label><strong>Minimum Deposit:</strong></label><br>
                    <input type="text" name="bm_min_deposit" value="<?php echo esc_attr($min_deposit); ?>" style="width:100%;" placeholder="e.g. $10">
                </p>

                <p>
                    <label><strong>Fees / Commission:</strong></label><br>
                    <input type="text" name="bm_fees" value="<?php echo esc_attr($fees); ?>" style="width:100%;" placeholder="e.g. $0 Equity Delivery">
                </p>

                <p style="margin-top:25px; padding:10px; background:#f0f0f1; border-radius:4px;">
                    <label style="display:inline-block; margin-right:15px;">
                        <input type="checkbox" name="bm_featured" value="yes" <?php checked($featured, 'yes'); ?>>
                        <strong>Mark as Featured / Recommended</strong>
                    </label>
                </p>
                
                <p style="color:#666; font-size:12px;">
                    <strong>Total Clicks:</strong> <?php echo intval($clicks); ?>
                </p>
            </div>
        </div>

    <?php }

    public function render_pros_cons_box($post) {
        $pros = get_post_meta($post->ID, 'bm_pros', true);
        $cons = get_post_meta($post->ID, 'bm_cons', true);
        ?>
        <p><em>Enter one item per line.</em></p>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <div>
                <label><strong>Pros (Why we like it):</strong></label>
                <textarea name="bm_pros" rows="6" style="width:100%;"><?php echo esc_textarea($pros); ?></textarea>
            </div>
            <div>
                <label><strong>Cons (Things to consider):</strong></label>
                <textarea name="bm_cons" rows="6" style="width:100%;"><?php echo esc_textarea($cons); ?></textarea>
            </div>
        </div>
        <?php
    }

    public function save_meta($post_id){
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;

        $fields = ['bm_affiliate', 'bm_referral', 'bm_status', 'bm_rating', 'bm_min_deposit', 'bm_fees', 'bm_pros', 'bm_cons', 'bm_logo_url'];
        
        foreach($fields as $f) {
            if(isset($_POST[$f])) {
                $val = $_POST[$f];
                if($f == 'bm_affiliate' || $f == 'bm_logo_url') $val = esc_url_raw($val);
                elseif($f == 'bm_pros' || $f == 'bm_cons') $val = sanitize_textarea_field($val);
                else $val = sanitize_text_field($val);
                update_post_meta($post_id, $f, $val);
            }
        }

        $featured = isset($_POST['bm_featured']) ? 'yes' : 'no';
        update_post_meta($post_id, 'bm_featured', $featured);
    }
}

new BM_Meta();
