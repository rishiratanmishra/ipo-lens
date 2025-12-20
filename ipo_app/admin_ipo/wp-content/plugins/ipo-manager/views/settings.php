<div class="wrap">
<h1>IPO Manager Settings</h1>
<form method="post" action="<?php echo admin_url('admin-post.php'); ?>">
<?php wp_nonce_field('ipo_settings'); ?>
<input type="hidden" name="action" value="ipo_save_settings">

<table class="form-table">
<tr><th>API URL</th><td><input type="text" name="ipo_api_url" value="<?php echo esc_attr(get_option('ipo_api_url')); ?>" class="regular-text"></td></tr>
<tr><th>API Key</th><td><input type="text" name="ipo_api_key" value="<?php echo esc_attr(get_option('ipo_api_key')); ?>" class="regular-text"></td></tr>
<tr><th>Sync Frequency</th><td>
<?php $v=get_option('ipo_sync_frequency','disabled'); ?>
<select name="ipo_sync_frequency">
<option value="disabled" <?php selected($v,'disabled'); ?>>Disabled</option>
<option value="daily" <?php selected($v,'daily'); ?>>Daily</option>
<option value="weekly" <?php selected($v,'weekly'); ?>>Weekly</option>
</select>
</td></tr>
</table>

<button class="button button-primary">Save</button>
</form>
</div>