<?php
/**
 * IPO Professional Theme Functions
 */

// Enqueue Admin Styles
function ipo_professional_admin_styles() {
    wp_enqueue_style('ipo-professional-admin', get_template_directory_uri() . '/admin.css', array(), '1.0');
}
add_action('admin_enqueue_scripts', 'ipo_professional_admin_styles');

// Optional: Customize Login Page Logo
function ipo_professional_login_logo() {
    ?>
    <style type="text/css">
        #login h1 a, .login h1 a {
            background-image: none, url(''); /* Add logo URL here if needed */
            color: #333;
            text-indent: 0;
            width: auto;
            height: auto;
            font-size: 24px;
            font-weight: bold;
            padding-bottom: 20px;
        }
    </style>
    <?php
}
add_action('login_enqueue_scripts', 'ipo_professional_login_logo');
?>
