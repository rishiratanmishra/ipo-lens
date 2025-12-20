<div class="wrap">
    <h1 class="wp-heading-inline">IPO List</h1>
    <a href="<?php echo admin_url('admin.php?page=ipo-add'); ?>" class="page-title-action">Add New</a>
    <a href="<?php echo admin_url('admin.php?action=ipo_manual_sync'); ?>" class="page-title-action">Sync</a>
    <hr class="wp-header-end">
    
    <form method="post">
        <input type="hidden" name="page" value="ipo-dashboard" />
        <?php
        // $table is passed from the controller
        $table->views();
        $table->display(); 
        ?>
    </form>
</div>