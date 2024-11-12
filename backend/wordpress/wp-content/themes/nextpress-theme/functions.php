<?php

// Add custom post type 'testimonials'
function create_testimonials_post_type()
{
    register_post_type(
        'testimonials',
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
add_action('init', 'create_testimonials_post_type');
