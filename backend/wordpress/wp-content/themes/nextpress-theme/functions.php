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
     // Gutenberg editor stylesheet
    add_editor_style('assets/css/editor-style.css');
}
add_action('after_setup_theme', 'add_theme_supports');

/**
 * Grant unfiltered_html to site admins on multisite.
 *
 * By default, multisite restricts unfiltered_html to super admins only.
 * This causes wp_kses to sanitize block delimiters in post_content,
 * collapsing the double-hyphen in block names like "acf/theme--resource-content"
 * to a single hyphen, which breaks block resolution on the frontend.
 */
// Only for multisite and only for the unfiltered_html capability
function allow_unfiltered_html_for_admins( $caps, $cap, $user_id ) {
    if ( is_multisite() && 'unfiltered_html' === $cap ) {
        if ( user_can( $user_id, 'administrator' ) ) {
            $caps = ['administrator'];
        }
        if ( user_can( $user_id, 'edit_posts' ) ) {
            $caps = ['edit_posts'];
        }
    }
    return $caps;
}
add_filter( 'map_meta_cap', 'allow_unfiltered_html_for_admins', 10, 3 );

function purge_all_wp_caches() {
    if ( ! isset( $_GET['purge'] ) ) return;
    error_log('asd');
    wp_cache_flush();

    global $wpdb;
    $wpdb->query(
        "DELETE FROM {$wpdb->options}
        WHERE option_name LIKE '_transient_next_blocks%'
            OR option_name LIKE '_transient_timeout_next_blocks%'
            OR option_name LIKE '_transient_blocks_api_%'
            OR option_name LIKE '_transient_timeout_blocks_api_%'"
    );

    return true;
}
add_action( 'init', 'purge_all_wp_caches' );

//------------------------------------------------
// ** TAXONOMIES **
//------------------------------------------------

// Add custom taxonomy 'resource_type'
function create_resource_type_taxonomy() {
    register_taxonomy(
        'resource_type',
        [ 'resource' ],
        [
            'labels' => [
                'name' => __('Resource Types', 'nextpress'),
                'singular_name' => __('Resource Type', 'nextpress')
            ],
            'hierarchical' => true,
            'show_in_rest' => true,
            'public' => true,
            'show_admin_column' => true
        ]
    );
}
add_action('init', 'create_resource_type_taxonomy');

// Add custom taxonomy 'theme'
function create_theme_taxonomy() {
    register_taxonomy(
        'theme',
        [ 'resource', 'post' ],
        [
            'labels' => [
                'name' => __('Themes', 'nextpress'),
                'singular_name' => __('Theme', 'nextpress')
            ],
            'hierarchical' => true,
            'show_in_rest' => true,
            'public' => true,
            'show_admin_column' => true
        ]
    );
}
add_action('init', 'create_theme_taxonomy');

// Remove tags.
function unregister_tags_for_posts() {
    unregister_taxonomy_for_object_type( 'post_tag', 'post' );
}
add_action( 'init', 'unregister_tags_for_posts' );

//------------------------------------------------
// ** POST TYPES **
//------------------------------------------------

// Add custom post type 'resource'
function create_resource_post_type()
{
    register_post_type(
        'resource',
        array(
            'labels' => array(
                'name' => __('Resources', 'nextpress'),
                'singular_name' => __('Resource', 'nextpress')
            ),
            'public' => true,
            'has_archive' => false,
            'show_in_rest' => true,
            'rest_base' => 'resource',
            'taxonomies'  => [],
            'rewrite' => [
                'slug' => 'resource', 
                'with_front' => false
            ],
            'supports' => [
                'title', 'editor', 'author', 'excerpt', 'page-attributes', 'thumbnail', 'custom-fields', 'revisions'
            ],
        )
    );
}
add_action('init', 'create_resource_post_type');

// Add default content for resource post type.
function resource_default_content( $content, $post ) {
    if ( $post->post_type !== 'resource' || ! empty( $content ) ) {
        return $content;
    }

    $content = 'This is a Resource Post';
    return $content;
}
add_filter( 'default_content', 'resource_default_content', 10, 2 );

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
// ** ADMIN STYLES **
//------------------------------------------------

function enqueue_admin_styles()
{
    wp_enqueue_style(
        'nextpress-editor-style',
        get_template_directory_uri() . '/assets/css/editor-style.css',
        [],
        filemtime(get_template_directory() . '/assets/css/editor-style.css')
    );
}
add_action('admin_enqueue_scripts', 'enqueue_admin_styles');

//------------------------------------------------
// ** EDITOR **
//------------------------------------------------

function create_custom_editor_styles($buttons) {
	array_unshift($buttons, 'styleselect');
	return $buttons;
}
add_filter('mce_buttons_2', 'create_custom_editor_styles');

// Adds 'Serif' as a Format style for tinymce.
function add_custom_format_styles( $init_array ) {
    $style_formats = [
        [
            'title' => 'Serif',  
            'inline' => 'span',  
            'classes' => 'font-secondary',
            'wrapper' => true,
        ],
        [
            'title' => 'Text Primary',  
            'inline' => 'span',  
            'classes' => 'text-primary',
            'wrapper' => false,
        ],
        [
            'title' => 'Text Secondary',  
            'inline' => 'span',  
            'classes' => 'text-secondary',
            'wrapper' => false,
        ],
        [
            'title' => 'Text Tertiary',  
            'inline' => 'span',  
            'classes' => 'text-teriary',
            'wrapper' => false,
        ],
        [
            'title' => 'Text Accent',  
            'inline' => 'span',  
            'classes' => 'text-accent',
            'wrapper' => false,
        ],
    ];

    $heading_styles = ['3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    foreach ( $heading_styles as $heading ) {
        $style_formats[] = [
            'title' => 'Heading ' . $heading,
            'inline' => 'span',
            'classes' => 'text-heading-'  . $heading,
            'wrapper' => false,
        ];
    }

    $init_array['style_formats'] = json_encode( $style_formats );
    return $init_array;  
} 
add_filter( 'tiny_mce_before_init', 'add_custom_format_styles' );

//------------------------------------------------
// ** ACF **
//------------------------------------------------

/**
 * 'acf/settings/save_json' filter hook callback.
 * ACF Local JSON.
 * Set a custom save location for all Local JSON fields.
 *
 * @see https://www.advancedcustomfields.com/resources/local-json/
 *
 * @param string $path The default Local JSON save path.
 * @return string The custom Local JSON path for the theme.
 */
function acf_json_save_location( $path ) {
    error_log( print_r( $path, true ) );
    if ( ! is_dir( get_template_directory() . '/assets/acf-json' ) ) {
        mkdir( get_template_directory() . '/assets/acf-json', 0755 );
    }
    return get_template_directory() . '/assets/acf-json';
}

/**
 * 'acf/settings/load_json' filter hook callback.
 * ACF Local JSON.
 * Add a custom load location for Local JSON fields.
 *
 * @see https://www.advancedcustomfields.com/resources/local-json/
 *
 * @param array $paths The default Local JSON load paths.
 * @return string Updated list of load paths including custom theme path.
 */
function acf_json_load_location( $paths ) {
    if ( ! is_dir( get_template_directory() . '/assets/acf-json' ) ) {
        mkdir( get_template_directory() . '/assets/acf-json', 0755 );
    }
    $paths[] = get_template_directory() . '/assets/acf-json';
    return $paths;
}

add_filter( 'acf/settings/save_json', 'acf_json_save_location' );
add_filter( 'acf/settings/load_json', 'acf_json_load_location' );

/**
 * Add acf filter for taxonomies
 */
function return_all_tax_for_acf( $field ) {
    $field['choices'] = array();

    $taxonomies = get_taxonomies( array( 'public' => true ), 'objects' );

    foreach ( $taxonomies as $taxonomy ) {
        $terms = get_terms( array(
            'taxonomy'   => $taxonomy->name,
            'hide_empty' => false,
        ) );

        if ( empty( $terms ) || is_wp_error( $terms ) ) {
            continue;
        }

        $group_label = $taxonomy->labels->name;
        foreach ( $terms as $term ) {
            $key = $taxonomy->name . ':' . $term->slug;
            $field['choices'][ $key ] = $group_label . ': ' . $term->name;
        }
    }

    return $field;
}
add_filter('acf/load_field/name=tax_query', 'return_all_tax_for_acf');

/**
 * Add acf filter for forms
 */
function return_gravity_form_for_acf( $field ) {
    if ( ! class_exists( 'GFAPI' ) ) {
      // No Gravity Form API class available. The plugin probably isn't active.
      return $field;
    }

    $forms = \GFAPI::get_forms( true );
    $choices[null] = __( 'Please select form', 'nextpress' );
    foreach ( $forms as $form ) {
      $choices['form_id_' . $form['id']] = $form['title'];
    }

    $field['choices'] = $choices;
    return $field;
}
add_filter('acf/load_field/name=gravity_form', 'return_gravity_form_for_acf');

/**
 * Format post field props
 */
function format_nextpress_post_field( $value, $post_id, $field ) {
    if ( $value && is_array( $value ) && class_exists( 'nextpress\Post_Formatter' ) ) {
        $npf = new nextpress\Post_Formatter();
        $posts_array = [];
        foreach ( $value as $post ) {
            $posts_array[] = $npf->format_post( $post, true, false );
        }
        return $posts_array;
    }
    return $value;
}
add_filter('acf/format_value/name=featured_post', 'format_nextpress_post_field', 10, 3);

function add_to_block_layouts( $layout ) {
    $layout->addAccordion('Block Options')
        ->addSelect('padding_top', [
            'label' => 'Padding Top',
            'choices' => [
                '' => 'Default',
				0 => 'None',
                "xs",
                "sm",
                "md",
                "lg",
                "xl",
                "margin",
                "section",
                "header",
            ],
            'default_value' => ''
        ])
        ->addSelect('padding_bottom', [
            'label' => 'Padding Bottom',
            'choices' => [
                '' => 'Default',
				0 => 'None',
                "xs",
                "sm",
                "md",
                "lg",
                "xl",
                "margin",
                "section",
                "header",
            ],
            'default_value' => ''
        ])
        ->addSelect('theme_override', [
            'label' => 'Block Theme',
            'choices' => [
                "light", "light-secondary", "dark", "dark-secondary", "overlay"
            ],
            'default_value' => 'light'
        ]);
    return $layout;
}
add_filter( 'nextpress_block_layouts', 'add_to_block_layouts' );
