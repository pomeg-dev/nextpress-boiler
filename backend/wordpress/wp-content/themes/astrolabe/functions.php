<?php

// Add custom post type 'work'
function create_work_post_type()
{
    register_post_type(
        'work',
        array(
            'labels' => array(
                'name' => __('Work'),
                'singular_name' => __('Work')
            ),
            'public' => true,
            'has_archive' => false,
            'show_in_rest' => true,

        )
    );
}
add_action('init', 'create_work_post_type');


//add services post type
function create_services_post_type()
{
    register_post_type(
        'services',
        array(
            'labels' => array(
                'name' => __('Services'),
                'singular_name' => __('Service')
            ),
            'public' => true,
            'has_archive' => false,
            'show_in_rest' => true,

        )
    );
}
add_action('init', 'create_services_post_type');


// Add to functions.php or create a plugin

// Enable CORS for all image requests
function add_cors_headers()
{
    // Check if this is an image request
    if (strpos($_SERVER['REQUEST_URI'], '/wp-content/uploads/') !== false) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
    }
}

// Hook early in the WordPress lifecycle
add_action('init', 'add_cors_headers', 1);

// Also handle preflight requests
function handle_preflight()
{
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
        exit(0);
    }
}
add_action('init', 'handle_preflight', 1);

// Add headers specifically for uploaded media
function add_cors_to_media($headers)
{
    $headers['Access-Control-Allow-Origin'] = '*';
    return $headers;
}
add_filter('wp_headers', 'add_cors_to_media');


add_action('init', function () {
    if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/wp-content/uploads/') !== false) {
        header('Access-Control-Allow-Origin: *');
    }
}, 1);
