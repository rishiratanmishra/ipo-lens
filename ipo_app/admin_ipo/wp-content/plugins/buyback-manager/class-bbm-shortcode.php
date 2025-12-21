<?php
class BBM_Shortcode{

function __construct(){
 add_shortcode("buyback_list",[$this,"render"]);
 add_action("wp_enqueue_scripts",[$this,"assets"]);
}

function assets(){
 wp_enqueue_style("bbm-css",BBM_URL."style.css");
 wp_enqueue_script("bbm-js",BBM_URL."tabs.js",['jquery'],false,true);
}

function render(){
 $tabs=["OPEN"=>"Open","UPCOMING"=>"Upcoming","CLOSED"=>"Closed"];

 ob_start();
 echo "<div class='bbm-tabs'>";

 echo "<ul class='bbm-tab-nav'>";
 foreach($tabs as $k=>$v){
    echo "<li data-tab='$k'>$v</li>";
 }
 echo "</ul>";

 foreach($tabs as $k=>$v){

    $posts=get_posts([
        "post_type"=>"buybacks",
        "meta_key"=>"bbm_type",
        "meta_value"=>$k,
        "posts_per_page"=>10
    ]);

    echo "<div class='bbm-tab' id='tab_$k'>";

    foreach($posts as $p){

        $price=get_post_meta($p->ID,'bbm_price',true);
        $status=get_post_meta($p->ID,'bbm_status',true);
        $logo=get_post_meta($p->ID,'bbm_logo',true);

        echo "<div class='bm-broker-card'>
        <div class='bm-card-inner'>
            <div class='bm-col-logo'>
                <div class='bm-logo-wrapper'>".
                ($logo?"<img src='$logo' class='bm-logo'>":"No Logo")
                ."</div>
            </div>
            <div class='bm-col-details'>
                <h3>{$p->post_title}</h3>
                <div class='bm-meta-row'>
                    <span>$price</span>
                    <span>$status</span>
                </div>
            </div>
        </div>
        </div>";
    }
    echo "</div>";
 }

 echo "</div>";
 return ob_get_clean();
}
}
new BBM_Shortcode();
