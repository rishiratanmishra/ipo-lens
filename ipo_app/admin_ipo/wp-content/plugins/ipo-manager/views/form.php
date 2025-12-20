<div class="wrap">
<h1><?php echo $item ? 'Edit IPO' : 'Add IPO'; ?></h1>
<form method="post" action="<?php echo admin_url('admin-post.php'); ?>">
<?php wp_nonce_field('ipo_form'); ?>
<input type="hidden" name="action" value="ipo_save">
<?php if($item): ?>
<input type="hidden" name="id" value="<?php echo $item->id; ?>">
<?php endif; ?>

<table class="form-table">
    <tr><th>Company Name</th><td><input type="text" name="company_name" value="<?php echo esc_attr($item->company_name ?? ''); ?>" class="regular-text" required></td></tr>
    <tr><th>Symbol</th><td><input type="text" name="symbol" value="<?php echo esc_attr($item->symbol ?? ''); ?>" class="regular-text" required></td></tr>
    <tr><th>Status</th><td>
        <select name="status">
            <?php $s=$item->status ?? ''; ?>
            <option value="UPCOMING" <?php selected($s,'UPCOMING'); ?>>UPCOMING</option>
            <option value="OPEN" <?php selected($s,'OPEN'); ?>>OPEN</option>
            <option value="CLOSED" <?php selected($s,'CLOSED'); ?>>CLOSED</option>
            <option value="LISTED" <?php selected($s,'LISTED'); ?>>LISTED</option>
        </select>
    </td></tr>
    
    <!-- Type -->
    <tr><th>IPO Type</th><td>
        <label><input type="checkbox" name="is_sme" value="1" <?php checked(isset($item->is_sme) ? $item->is_sme : 0, 1); ?>> Is SME IPO?</label>
    </td></tr>

    <!-- Dates -->
    <tr><th>Open Date</th><td><input type="date" name="open_date" value="<?php echo esc_attr($item->open_date ?? ''); ?>"></td></tr>
    <tr><th>Close Date</th><td><input type="date" name="close_date" value="<?php echo esc_attr($item->close_date ?? ''); ?>"></td></tr>
    <tr><th>Listing Date</th><td><input type="date" name="listing_date" value="<?php echo esc_attr($item->listing_date ?? ''); ?>"></td></tr>

    <!-- Pricing -->
    <tr><th>Price Band Lower</th><td><input type="number" step="0.01" name="price_band_lower" value="<?php echo esc_attr($item->price_band_lower ?? ''); ?>"></td></tr>
    <tr><th>Price Band Upper</th><td><input type="number" step="0.01" name="price_band_upper" value="<?php echo esc_attr($item->price_band_upper ?? ''); ?>"></td></tr>
    <tr><th>Issue Price</th><td><input type="number" step="0.01" name="issue_price" value="<?php echo esc_attr($item->issue_price ?? ''); ?>"></td></tr>
    <tr><th>Listing Price</th><td><input type="number" step="0.01" name="listing_price" value="<?php echo esc_attr($item->listing_price ?? ''); ?>"></td></tr>
    
    <!-- Details -->
    <tr><th>Lot Size</th><td><input type="number" step="1" name="lot_size" value="<?php echo esc_attr($item->lot_size ?? ''); ?>"></td></tr>
    <tr><th>GMP</th><td><input type="text" name="gmp" value="<?php echo esc_attr($item->gmp ?? ''); ?>" class="regular-text"></td></tr>
    <tr><th>Subscription</th><td><input type="text" name="subscription" value="<?php echo esc_attr($item->subscription ?? ''); ?>" class="regular-text"></td></tr>
    <tr><th>Listing Gains</th><td><input type="text" name="listing_gains" value="<?php echo esc_attr($item->listing_gains ?? ''); ?>" class="regular-text"></td></tr>

    <!-- URLs & Text -->
    <tr><th>Document URL (RHP)</th><td><input type="url" name="document_url" value="<?php echo esc_attr($item->document_url ?? ''); ?>" class="large-text"></td></tr>
    <tr><th>Logo URL</th><td><input type="url" name="logo_url" value="<?php echo esc_attr($item->logo_url ?? ''); ?>" class="large-text"></td></tr>
    <tr><th>Additional Text</th><td><textarea name="additional_text" rows="5" class="large-text"><?php echo esc_textarea($item->additional_text ?? ''); ?></textarea></td></tr>
    <tr><th>Custom Data (JSON)</th><td><textarea name="custom_data" rows="5" class="large-text"><?php echo esc_textarea($item->custom_data ?? ''); ?></textarea></td></tr>
</table>

<button class="button button-primary">Save</button>
</form>
</div>