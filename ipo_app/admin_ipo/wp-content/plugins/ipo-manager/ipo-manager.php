<?php
/**
 * Plugin Name: IPO Manager
 * Description: Manage YourIPO Data (Logos, GMP, Subscription, etc.)
 * Version: 1.0
 * Author: YourIPO Team
 */

defined('ABSPATH') or die('Direct access denied');

class IPO_Manager {

    private $table_name = 'ipos'; // Your custom table name

    public function __construct() {
        add_action('admin_menu', array($this, 'add_menu'));
        add_action('admin_post_save_ipo', array($this, 'handle_save'));
    }

    public function add_menu() {
        add_menu_page(
            'IPO Manager', 
            'IPO Manager', 
            'manage_options', 
            'ipo-manager', 
            array($this, 'render_list_page'), 
            'dashicons-chart-line', 
            6
        );
        add_submenu_page(
            'ipo-manager',
            'Edit IPO',
            'Edit IPO',
            'manage_options',
            'ipo-edit',
            array($this, 'render_edit_page')
        );
    }

    // LIST PAGE
    public function render_list_page() {
        global $wpdb;
        
        // Pagination logic could go here, fetching all for now (assuming < 1000 active)
        $ipos = $wpdb->get_results("SELECT * FROM {$this->table_name} ORDER BY open_date DESC LIMIT 100");

        ?>
        <div class="wrap">
            <h1 class="wp-heading-inline">IPO Manager</h1>
            <!-- <a href="?page=ipo-edit" class="page-title-action">Add New</a> --> <!-- Add New is handled by Cron, but we could enable it -->
            
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th width="50">ID</th>
                        <th>Company Name</th>
                        <th>Status</th>
                        <th>Open Date</th>
                        <th>GMP</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($ipos): ?>
                        <?php foreach ($ipos as $ipo): ?>
                            <tr>
                                <td><?php echo esc_html($ipo->id); ?></td>
                                <td>
                                    <strong><?php echo esc_html($ipo->company_name); ?></strong><br>
                                    <small><?php echo esc_html($ipo->symbol); ?></small>
                                </td>
                                <td><span class="badge badge-<?php echo strtolower($ipo->status); ?>"><?php echo esc_html($ipo->status); ?></span></td>
                                <td><?php echo esc_html($ipo->open_date); ?></td>
                                <td><?php echo esc_html($ipo->gmp); ?></td>
                                <td>
                                    <a href="?page=ipo-edit&id=<?php echo $ipo->id; ?>" class="button button-small">Edit</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr><td colspan="6">No IPOs found. Ensure 'ipos' table exists and cron is running.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    // EDIT PAGE
    public function render_edit_page() {
        global $wpdb;
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $ipo = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$this->table_name} WHERE id = %d", $id));

        if (!$ipo) {
            echo '<div class="wrap"><h1>IPO Not Found</h1></div>';
            return;
        }

        ?>
        <div class="wrap">
            <h1>Edit IPO: <?php echo esc_html($ipo->company_name); ?></h1>
            <form method="post" action="<?php echo admin_url('admin-post.php'); ?>">
                <input type="hidden" name="action" value="save_ipo">
                <input type="hidden" name="id" value="<?php echo esc_attr($ipo->id); ?>">
                <?php wp_nonce_field('save_ipo_nonce', 'ipo_nonce'); ?>

                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row"><label for="company_logo">Company Logo URL</label></th>
                        <td>
                            <input name="company_logo" type="text" id="company_logo" value="<?php echo esc_attr($ipo->company_logo); ?>" class="regular-text">
                            <p class="description">Paste the full URL of the uploaded image.</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="gmp">GMP (₹)</label></th>
                        <td>
                            <input name="gmp" type="number" step="0.01" id="gmp" value="<?php echo esc_attr($ipo->gmp); ?>" class="regular-text">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="subscription_times">Subscription (x times)</label></th>
                        <td>
                            <input name="subscription_times" type="text" id="subscription_times" value="<?php echo esc_attr($ipo->subscription_times); ?>" class="regular-text">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="document_url">DRHP/RHP Document URL</label></th>
                        <td>
                            <input name="document_url" type="text" id="document_url" value="<?php echo esc_attr($ipo->document_url); ?>" class="regular-text">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="additional_text">Additional Text</label></th>
                        <td>
                            <textarea name="additional_text" id="additional_text" rows="3" class="large-text"><?php echo esc_textarea($ipo->additional_text); ?></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Is SME IPO?</th>
                        <td>
                            <fieldset>
                                <label for="is_sme">
                                    <input name="is_sme" type="checkbox" id="is_sme" value="1" <?php checked($ipo->is_sme, 1); ?>>
                                    Yes, this is an SME IPO
                                </label>
                            </fieldset>
                        </td>
                    </tr>
                </table>
                <p class="submit"><input type="submit" name="submit" id="submit" class="button button-primary" value="Save Changes"></p>
            </form>
        </div>
        <?php
    }

    // HANDLE SAVE
    public function handle_save() {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        check_admin_referer('save_ipo_nonce', 'ipo_nonce');

        global $wpdb;
        $id = intval($_POST['id']);
        
        // Prepare Data
        $data = array(
            'company_logo' => sanitize_text_field($_POST['company_logo']),
            'gmp' => !empty($_POST['gmp']) ? floatval($_POST['gmp']) : null,
            'subscription_times' => sanitize_text_field($_POST['subscription_times']),
            'document_url' => esc_url_raw($_POST['document_url']),
            'additional_text' => sanitize_textarea_field($_POST['additional_text']),
            'is_sme' => isset($_POST['is_sme']) ? 1 : 0
        );

        $wpdb->update($this->table_name, $data, array('id' => $id));

        // Redirect back
        wp_redirect(admin_url('admin.php?page=ipo-edit&id=' . $id . '&updated=true'));
        exit;
    }
}

new IPO_Manager();
