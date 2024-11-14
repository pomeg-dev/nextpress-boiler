# nextpress works by regstering fields and blocks from the folder structure in the frontend directory
# This script can be used when you want to change the name of a frontend/ui/blocks/theme/ folder but want to preserve the blocks and options that were registered with the previous name.

prev_theme_name="nextpress"
new_theme_name="pome"

# wp db edits

# in the wp_posts table guttenberg blocks are stored in post_content, so we need to update the post_content fields to reflect the new theme name
docker exec -i wordpress_mysql mysql -uroot -ppassword wordpress <<< "UPDATE wp_posts SET post_content = REPLACE(post_content, '$prev_theme_name', '$new_theme_name');"

# in the wp_options table the theme name is stored in the option_name field, so we need to update the option_name fields to reflect the new theme name
docker exec -i wordpress_mysql mysql -uroot -ppassword wordpress <<< "UPDATE wp_options SET option_name = REPLACE(option_name, '$prev_theme_name', '$new_theme_name');"
docker exec -i wordpress_mysql mysql -uroot -ppassword wordpress <<< "UPDATE wp_options SET option_value = REPLACE(option_value, '$prev_theme_name', '$new_theme_name') WHERE option_name LIKE '%options_%' OR option_name LIKE '%_options';"
