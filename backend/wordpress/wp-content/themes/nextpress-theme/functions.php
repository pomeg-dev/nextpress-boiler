<?php

//------------------------------------------------
// ** THEME SCRIPTS, STYLES AND SUPPORTS **
//------------------------------------------------

function add_theme_supports()
{
    // This theme uses post thumbnails
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    // Add default posts and comments RSS feed links to head
    add_theme_support('automatic-feed-links');
}
add_action('after_setup_theme', 'add_theme_supports');

//------------------------------------------------
// ** POST TYPES **
//------------------------------------------------

// Add custom post type 'work'
function create_work_post_type()
{
    register_post_type(
        'work',
        array(
            'labels' => array(
                'name' => __('Work', 'nextpress'),
                'singular_name' => __('Work', 'nextpress')
            ),
            'public' => true,
            'has_archive' => false,
            'show_in_rest' => true,
            'rest_base' => 'work',
            'taxonomies'  => array('category', 'post_tag'),
            'supports' => [
                'title', 'editor', 'author', 'excerpt', 'page-attributes', 'thumbnail', 'custom-fields'
            ],
        )
    );
}
add_action('init', 'create_work_post_type');

// Add custom post type 'testimonials'
function create_testimonials_post_type()
{
    register_post_type(
        'testimonials',
        array(
            'labels' => array(
                'name' => __('Testimonials', 'nextpress'),
                'singular_name' => __('Testimonial', 'nextpress')
            ),
            'public' => true,
            'has_archive' => false,
            'show_in_rest' => true,
            'rest_base' => 'testimonial',
            'supports' => [
                'title', 'custom-fields'
            ],
        )
    );
}
add_action('init', 'create_testimonials_post_type');

//------------------------------------------------
// ** NAVS **
//------------------------------------------------

// Register standard nav menus.
function create_theme_nav_menus()
{
    register_nav_menus(
        array(
            'header_nav' => __('Header Nav', 'nextpress'),
            'footer_nav' => __('Footer Nav', 'nextpress'),
        )
    );
}
add_action('after_setup_theme', 'create_theme_nav_menus');

//------------------------------------------------
// ** EDITOR **
//------------------------------------------------

function create_custom_editor_styles($buttons)
{
	array_unshift($buttons, 'styleselect');
	return $buttons;
}
add_filter('mce_buttons_2', 'create_custom_editor_styles');

// Adds 'Serif' as a Format style for tinymce.
function add_custom_format_styles( $init_array )
{
    $style_formats = array(
        array(  
            'title' => 'Serif',  
            'inline' => 'span',  
            'classes' => 'serif',
            'wrapper' => true,
        ),
    );  
    $init_array['style_formats'] = json_encode( $style_formats );
    return $init_array;  
} 
add_filter( 'tiny_mce_before_init', 'add_custom_format_styles' );