<?php
// Define that we don't need the theme header/footer
define('WP_USE_THEMES', false);

// Correct path to wp-load.php based on your directory structure:
// backend_ipo/api/ -> ../../admin_ipo/wp-load.php
$wp_load_path = __DIR__ . '/../../admin_ipo/wp-load.php';

if (file_exists($wp_load_path)) {
    require_once($wp_load_path);
} else {
    // Fallback or Error if WP not found
    header('Content-Type: application/json');
    echo json_encode(["error" => "WordPress core not found at path: " . $wp_load_path]);
    exit;
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow usage from other apps

$category_slug = isset($_GET['category']) ? sanitize_text_field($_GET['category']) : '';

$args = [
    'post_type'      => 'broker',
    'posts_per_page' => -1,
    'post_status'    => 'publish',
    'orderby'        => 'menu_order title', 
    'order'          => 'ASC',
];

if (!empty($category_slug)) {
    $args['tax_query'] = [
        [
            'taxonomy' => 'broker_category',
            'field'    => 'slug',
            'terms'    => $category_slug,
        ]
    ];
}

$query = new WP_Query($args);
$brokers_data = [];

if ($query->have_posts()) {
    while ($query->have_posts()) {
        $query->the_post();
        $id = get_the_ID();

        // Fetch all meta fields
        $affiliate  = get_post_meta($id, 'bm_affiliate', true);
        $referral   = get_post_meta($id, 'bm_referral', true);
        $rating     = get_post_meta($id, 'bm_rating', true);
        $min_dep    = get_post_meta($id, 'bm_min_deposit', true);
        $fees       = get_post_meta($id, 'bm_fees', true);
        $pros       = get_post_meta($id, 'bm_pros', true); // String with newlines
        $cons       = get_post_meta($id, 'bm_cons', true); // String with newlines
        $logo_url   = get_post_meta($id, 'bm_logo_url', true);
        $featured   = get_post_meta($id, 'bm_featured', true);
        $status     = get_post_meta($id, 'bm_status', true);

        // Process Lists (Pros/Cons)
        $pros_list = !empty($pros) ? array_filter(array_map('trim', explode("\n", $pros))) : [];
        $cons_list = !empty($cons) ? array_filter(array_map('trim', explode("\n", $cons))) : [];

        // Handle Image
        $final_logo = '';
        if (has_post_thumbnail($id)) {
            $thumb = get_the_post_thumbnail_url($id, 'medium');
            if ($thumb) $final_logo = $thumb;
        } 
        
        // Fallback to custom URL if no featured image
        if (empty($final_logo) && !empty($logo_url)) {
            $final_logo = $logo_url;
        }

        // Ensure absolute URL (basic check)
        if (!empty($final_logo) && strpos($final_logo, 'http') !== 0) {
            // If it's a relative path, prepend site url
            $final_logo = site_url($final_logo);
        }

        // Fetch Categories
        $cats = get_the_terms($id, 'broker_category');
        $cat_names = [];
        if (!empty($cats) && !is_wp_error($cats)) {
            foreach ($cats as $c) {
                $cat_names[] = $c->name;
            }
        }

        $brokers_data[] = [
            'id'             => $id,
            'title'          => get_the_title(),
            'logo'           => $final_logo,
            'affiliate_link' => $affiliate,
            'referral_code'  => $referral,
            'rating'         => (float)$rating,
            'min_deposit'    => $min_dep,
            'fees'           => $fees,
            'pros'           => array_values($pros_list),
            'cons'           => array_values($cons_list),
            'is_featured'    => ($featured === 'yes'),
            'status'         => $status,
            'categories'     => $cat_names,
            'publish_date'   => get_the_date('Y-m-d H:i:s')
        ];
    }
    wp_reset_postdata();
}

echo json_encode($brokers_data, JSON_PRETTY_PRINT);
?>
