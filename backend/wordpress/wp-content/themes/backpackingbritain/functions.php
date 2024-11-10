<?php

// Add custom post type 'destination'
function create_destination_post_type()
{
    register_post_type(
        'destination',
        array(
            'labels' => array(
                'name' => __('Destinations'),
                'singular_name' => __('Destination')
            ),
            'public' => true,
            'has_archive' => false,
            'show_in_rest' => true,

        )
    );
}
add_action('init', 'create_destination_post_type');
