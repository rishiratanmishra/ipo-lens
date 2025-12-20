<?php
if (!defined('WP_UNINSTALL_PLUGIN')) exit;
delete_option('ipo_api_url');
delete_option('ipo_api_key');
delete_option('ipo_sync_frequency');