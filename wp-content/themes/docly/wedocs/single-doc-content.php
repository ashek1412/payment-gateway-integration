<?php
if ( Docly_helper()->doc_width() == 'full-width' ) {
    $content_column = Docly_helper()->doc_layout() == 'both_sidebar' ? '8' : '10';
} else {
    $content_column = Docly_helper()->doc_layout() == 'both_sidebar' ? '7' : '9';
}
?>

<div class="col-lg-<?php echo esc_attr($content_column) ?> doc-main-content">
    <article <?php post_class('shortcode_info'); ?> id="post">
        <div class="shortcode_title">
            <?php the_title( '<h1>', '</h1>' ); ?>
        </div>
        <?php
        the_content();

        wedocs_get_template_part( 'single-doc', 'home');

        $children = wp_list_pages_custome("title_li=&order=menu_order&child_of=". $post->ID ."&echo=0&post_type=" . $post->post_type);

        if ( $children && $post->post_parent != 0 ) {
            echo '<div class="details_cont ent recently_added" id="content_elements">';
            echo '<h4 class="c_head">' . esc_html__( 'Articles', 'docly' ) . '</h4>';
            echo '<ul class="list-unstyled article_list tag_list">';
            echo wp_list_pages_custome("title_li=&order=menu_order&child_of=". $post->ID ."&echo=0&post_type=" . $post->post_type);
            echo '</ul>';
            echo '</div>';
        }

        wp_link_pages( array (
            'before' => '<div class="page-links">' . esc_html__( 'Docs:', 'docly' ),
            'after'  => '</div>',
        ));

        /**
         * Footnotes
         */
        $is_footnotes = function_exists('get_field') ? get_field('is_footnotes') : '';
        if ( $is_footnotes == '1' ) {
            get_template_part( 'template-parts/footnotes' );
        }

        wedocs_get_template_part('content-feedback');
        wedocs_get_template_part('content-modal');
        ?>
    </article>

    <?php
    if ( wedocs_get_option( 'comments', 'wedocs_settings', 'off' ) == 'on' ) { ?>
	    <?php if ( comments_open() || get_comments_number() ) { ?>
            <div class="wedocs-comments-wrap">
			    <?php comments_template(); ?>
            </div>
	    <?php } ?>
	    <?php
    }
    ?>

</div>
