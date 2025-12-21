<?php
class BBM_Admin{
    function __construct(){
        add_action("admin_menu",[$this,"menu"]);
        add_action("admin_post_bbm_fetch",[$this,"manual_fetch"]);
    }

    function menu(){
        add_menu_page("Buyback Manager","Buybacks","manage_options","bbm",[$this,"page"]);
    }

    function page(){
        global $wpdb;
        $table_name = BBM_TABLE;
        $results = $wpdb->get_results("SELECT * FROM $table_name ORDER BY id DESC");
        ?>
        <div class="wrap">
            <h1>Buyback Manager</h1>
            <form method="post" action="<?php echo admin_url('admin-post.php'); ?>" style="margin-bottom: 20px;">
                <input type="hidden" name="action" value="bbm_fetch">
                <button class="button button-primary">Refetch Data Now</button>
            </form>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Company</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Logo</th>
                        <th>Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if($results): ?>
                        <?php foreach($results as $row): ?>
                            <tr>
                                <td><?php echo $row->id; ?></td>
                                <td><?php echo $row->company; ?></td>
                                <td><?php echo $row->type; ?></td>
                                <td><?php echo $row->price; ?></td>
                                <td style="color: <?php echo strpos(strtolower($row->status), 'open') !== false ? 'green' : 'red'; ?>"><?php echo $row->status; ?></td>
                                <td>
                                    <?php if($row->logo): ?>
                                        <img src="<?php echo $row->logo; ?>" style="width: 30px; height: 30px; object-fit: contain;">
                                    <?php endif; ?>
                                </td>
                                <td><?php echo $row->updated_at; ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr><td colspan="7">No data found. Click "Refetch Data Now".</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    function manual_fetch(){
        BBM_Scraper::fetch_and_store();
        wp_redirect(admin_url("admin.php?page=bbm&updated=1"));
        exit;
    }
}
new BBM_Admin();
