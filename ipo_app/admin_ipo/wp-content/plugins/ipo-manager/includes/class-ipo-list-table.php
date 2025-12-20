<?php
if (!defined('ABSPATH')) exit;

if (!class_exists('WP_List_Table')) {
    require_once(ABSPATH . 'wp-admin/includes/class-wp-list-table.php');
}

class IPO_List_Table extends WP_List_Table {

    public function __construct() {
        parent::__construct([
            'singular' => 'ipo',
            'plural'   => 'ipos',
            'ajax'     => false
        ]);
    }

    public function get_columns() {
        return [
            'cb'           => '<input type="checkbox" />',
            'company_name' => 'Company Name',
            'symbol'       => 'Symbol',
            'status'       => 'Status',
            'gmp'          => 'GMP',
            'open_date'    => 'Open Date',
            'close_date'   => 'Close Date',
            'actions'      => 'Actions'
        ];
    }

    public function get_views() {
        $views = [];
        $current = (!empty($_REQUEST['ipo_type']) ? $_REQUEST['ipo_type'] : 'main');

        // Main Board (Default)
        $class = ($current === 'main' ? 'class="current"' : '');
        $views['main'] = "<a href='?page=ipo-dashboard&ipo_type=main' $class>Main Board</a>";

        // SME
        $class = ($current === 'sme' ? 'class="current"' : '');
        $views['sme'] = "<a href='?page=ipo-dashboard&ipo_type=sme' $class>SME</a>";

        // All
        $class = ($current === 'all' ? 'class="current"' : '');
        $views['all'] = "<a href='?page=ipo-dashboard&ipo_type=all' $class>All</a>";

        return $views;
    }

    public function get_sortable_columns() {
        return [
            'company_name' => ['company_name', true],
            'symbol'       => ['symbol', false],
            'status'       => ['status', false],
            'open_date'    => ['open_date', false],
            'close_date'   => ['close_date', false],
            'id'           => ['id', false],
            'gmp'          => ['gmp', false]
        ];
    }

    protected function column_default($item, $column_name) {
        switch ($column_name) {
            case 'company_name':
            case 'symbol':
            case 'status':
            case 'open_date':
            case 'close_date':
                return esc_html($item->$column_name);
            case 'id':
                return $item->id;
            case 'gmp':
                return esc_html($item->gmp);
            default:
                return print_r($item, true);
        }
    }

    protected function column_cb($item) {
        return sprintf(
            '<input type="checkbox" name="ipo[]" value="%s" />',
            $item->id
        );
    }

    protected function column_company_name($item) {
        $edit_url = admin_url('admin.php?page=ipo-add&id=' . $item->id);
        $delete_url = wp_nonce_url(admin_url('admin.php?action=ipo_delete&id=' . $item->id), 'delete');
        
        $actions = [
            'edit'   => sprintf('<a href="%s">Edit</a>', $edit_url),
            'delete' => sprintf('<a href="%s" onclick="return confirm(\'Delete?\')">Delete</a>', $delete_url),
        ];

        return sprintf('%1$s %2$s', esc_html($item->company_name), $this->row_actions($actions));
    }
    
    protected function column_actions($item) {
        // Keeping this for backward compatibility if needed, but row actions on name is better standard
        $edit_url = admin_url('admin.php?page=ipo-add&id=' . $item->id);
        $delete_url = wp_nonce_url(admin_url('admin.php?action=ipo_delete&id=' . $item->id), 'delete');
        return sprintf(
            '<a href="%s" class="button button-small">Edit</a> <a href="%s" class="button button-small" onclick="return confirm(\'Delete?\')">Delete</a>',
            $edit_url,
            $delete_url
        );
    }

    public function prepare_items() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'ipos';

        $per_page = 10;
        $columns = $this->get_columns();
        $hidden = [];
        $sortable = $this->get_sortable_columns();

        $this->_column_headers = [$columns, $hidden, $sortable];

        // Base query
        $query_base = "SELECT * FROM $table_name";
        
        // Filtering
        $where = [];
        
        // Status Filter
        $filter_status = isset($_REQUEST['filter_status']) ? $_REQUEST['filter_status'] : 'OPEN';

        if (!empty($filter_status)) {
            $status = sanitize_text_field($filter_status);
            $where[] = $wpdb->prepare("status = %s", $status);
        }

        // View/Type Filter (Main vs SME)
        $type = (!empty($_REQUEST['ipo_type']) ? $_REQUEST['ipo_type'] : 'main');
        if ($type === 'main') {
            $where[] = "is_sme = 0";
        } elseif ($type === 'sme') {
            $where[] = "is_sme = 1";
        }
        // If 'all', no 'is_sme' filter is added

        $where_sql = "";
        if (!empty($where)) {
            $where_sql = " WHERE " . implode(" AND ", $where);
        }

        // Count total items first (without modifying query for order/limit)
        $count_query = "SELECT COUNT(id) FROM $table_name $where_sql";
        $total_items = intval($wpdb->get_var($count_query));

        // Add Order By
        $orderby = (!empty($_REQUEST['orderby'])) ? sanitize_sql_orderby($_REQUEST['orderby']) : 'id';
        $order = (!empty($_REQUEST['order'])) ? sanitize_sql_orderby($_REQUEST['order']) : 'DESC';
        
        $final_query = "$query_base $where_sql ORDER BY $orderby $order";

        // Pagination
        $current_page = $this->get_pagenum();
        $offset = ($current_page - 1) * $per_page;
        
        $final_query .= " LIMIT $offset, $per_page";

        $this->items = $wpdb->get_results($final_query);

        $this->set_pagination_args([
            'total_items' => $total_items,
            'per_page'    => $per_page,
            'total_pages' => ceil($total_items / $per_page)
        ]);
    }

    public function extra_tablenav($which) {
        if ($which == 'top') {
            $statuses = ['UPCOMING', 'OPEN', 'CLOSED', 'LISTED']; // Example statuses, adjust as needed or fetch dynamically
            $current = isset($_REQUEST['filter_status']) ? $_REQUEST['filter_status'] : 'OPEN';
            ?>
            <div class="alignleft actions">
                <select name="filter_status" onchange="this.form.submit()">
                    <option value="">All Status</option>
                    <?php foreach ($statuses as $status): ?>
                        <option value="<?php echo esc_attr($status); ?>" <?php selected($current, $status); ?>><?php echo esc_html($status); ?></option>
                    <?php endforeach; ?>
                </select>
                <input type="hidden" name="ipo_type" value="<?php echo esc_attr(isset($_REQUEST['ipo_type']) ? $_REQUEST['ipo_type'] : 'main'); ?>" />
                <?php submit_button('Filter', 'button', 'filter_action', false); ?>
            </div>
            <?php
        }
    }
}
