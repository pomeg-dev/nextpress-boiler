<?php
/**
 * Templates → Post: puts the post-hero block in Before Content and
 * related-posts in After Content, so every post gets both.
 *
 * Run by seed-showcase.sh with WP-CLI: `wp eval-file /seed/post-template.php`
 * writes the template, and the `reset` argument removes it again. Writes only
 * when Templates → Post is empty or was written by the seed (option
 * `np_seed_post_template`), so a project's own post templates are never
 * overwritten. Results go to lines prefixed `@@`.
 *
 * @package nextpress
 */

$seeded = (bool) get_option( 'np_seed_post_template' );

if ( ( $args[0] ?? '' ) === 'reset' ) {
	if ( ! $seeded ) {
		return;
	}
	global $wpdb;
	// Rows, their `_`-prefixed field keys, and ACF's `options__…_layout_meta`.
	$like = $wpdb->esc_like( 'post_content_templates_' ) . '%';
	// A one-off CLI cleanup of option rows: no API covers a LIKE delete.
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$wpdb->query(
		$wpdb->prepare(
			"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s OR option_name LIKE %s",
			'options\_' . $like,
			'\_options\_' . $like,
			'options\_\_' . $like
		)
	);
	update_option( 'options_post_content_templates', '' );
	delete_option( 'np_seed_post_template' );
	return;
}

if ( get_option( 'options_post_content_templates' ) && ! $seeded ) {
	echo "@@ warn: Templates → Post already has templates; the post hero was not added\n";
	return;
}

update_field(
	'field_templates_post_content_templates',
	[
		[
			'category'        => '',
			'before_content'  => [
				[
					'acf_fc_layout'  => 'default--post-hero',
					'show_image'     => 1,
					'show_excerpt'   => 1,
					'theme_override' => 'light',
					'padding_top'    => '',
					'padding_bottom' => '',
				],
			],
			'after_content'   => [
				[
					'acf_fc_layout'  => 'default--related-posts',
					'heading'        => '<h2>Keep reading</h2>',
					'number_posts'   => 3,
					'button'         => [
						'title'  => 'All posts',
						'url'    => home_url( '/blog/' ),
						'target' => '',
					],
					'theme_override' => 'light-secondary',
					'padding_top'    => '',
					'padding_bottom' => '',
				],
			],
			'sidebar_content' => [],
		],
	],
	'option'
);
update_option( 'np_seed_post_template', 1, false );
