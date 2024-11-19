#!/bin/bash

# Exit on error
set -e

# Set variables
SERVER="pometreeservername" 
DB_UN="bn_wordpress"
DB_PW="9e8164bb8cfb57b5c31271fc60df505a0cae20cc9de983bde57b95512127c285"
ADMIN_EMAIL="developer@pomegranate.co.uk"
ADMIN_USER="wordpress"
ADMIN_PASS="wordpress"
SITE_URL="wp.pometreeservername.pomeg.dev"
DB_NAME="bitnami_wordpress"
DUMP_FILE="/tmp/${SERVER}_dump.sql"
DUMP_FILE_GZ="${DUMP_FILE}.gz"

# Create a heredoc with the site mappings that we'll pass to the remote server
cat > /tmp/site_mappings.txt << 'EOF'
2|/subsite-slug-here
EOF

# Function to check if previous command succeeded
check_error() {
    if [ $? -ne 0 ]; then
        echo "Error: $1"
        exit 1
    fi
}

echo "1. Creating DB dump from production server via pometree..."
ssh pometree "sudo ssh $SERVER 'mariadb-dump -u\"$DB_UN\" -p\"$DB_PW\" \"$DB_NAME\" -v' | tail +2 | gzip -9 > $DUMP_FILE_GZ"
check_error "Failed to create database dump on pometree"

echo "2. Copying DB dump from pometree to local..."
scp pometree:$DUMP_FILE_GZ /tmp/
check_error "Failed to copy database dump from pometree"

echo "3. Unzipping DB dump locally..."
gzip -f -d $DUMP_FILE_GZ
check_error "Failed to unzip database dump"

# Verify the dump file exists
if [ ! -f $DUMP_FILE ]; then
    echo "Error: Database dump file not found at $DUMP_FILE"
    exit 1
fi

echo "4. Dropping and recreating local WordPress database..."
docker exec -i wordpress_mysql mariadb -uroot -ppassword <<< "DROP DATABASE IF EXISTS wordpress;"
docker exec -i wordpress_mysql mariadb -uroot -ppassword <<< "CREATE DATABASE wordpress;"
check_error "Failed to recreate WordPress database"

echo "5. Importing database to local Docker..."
sed -i.backup '/@@GLOBAL.GTID_PURGED=/d' $DUMP_FILE
sed -i.backup '/NOTE_VERBOSITY=/d' $DUMP_FILE
docker exec -i wordpress_mysql mariadb -uroot -ppassword wordpress < $DUMP_FILE
check_error "Failed to import database"

echo "6. Setting up main site..."
echo "VALUES (1, '$ADMIN_USER', MD5('wordpress'), 'Admin', '$ADMIN_EMAIL', '', '2014-06-09 00:00:00', '', 0, 'Developer');"
docker exec -i wordpress_mysql mariadb -uroot -ppassword wordpress << EOF
    DELETE FROM wp_users WHERE ID = 1;
    DELETE FROM wp_usermeta WHERE user_id = 1;
    
    INSERT INTO wp_users (ID, user_login, user_pass, user_nicename, user_email, user_url, user_registered, user_activation_key, user_status, display_name) 
    VALUES (1, '$ADMIN_USER', MD5('wordpress'), 'Admin', '$ADMIN_EMAIL', '', '2014-06-09 00:00:00', '', 0, 'Developer');
    
    INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, 1, 'wp_capabilities', 'a:1:{s:13:\"administrator\";b:1;}');
    INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, 1, 'wp_user_level', '10');
    
    UPDATE wp_options SET option_value = 'http://localhost' WHERE option_name = 'home' OR option_name = 'siteurl';
    UPDATE wp_posts SET post_content = REPLACE(post_content, 'https://$SITE_URL', 'http://localhost');
    UPDATE wp_postmeta SET meta_value = REPLACE(meta_value, 'https://$SITE_URL', 'http://localhost');
    
    UPDATE wp_site SET domain = 'localhost';
    UPDATE wp_blogs SET domain = 'localhost' WHERE blog_id = 1;
    UPDATE wp_sitemeta SET meta_value = 'http://localhost' WHERE meta_key = 'siteurl';
    
    SET @admin_length = LENGTH('$ADMIN_USER');
    INSERT INTO wp_sitemeta (meta_id, site_id, meta_key, meta_value) 
    VALUES (NULL, 1, 'site_admins', CONCAT('a:1:{i:0;s:', @admin_length, ':\"', '$ADMIN_USER', '\";}'))
    ON DUPLICATE KEY UPDATE meta_value=VALUES(meta_value);
EOF
check_error "Failed to set up main site"

echo "7. Processing additional sites..."
while IFS='|' read -r site_id site_path; do
    echo "Processing site $site_id at $site_path..."
    
    docker exec -i wordpress_mysql mariadb -uroot -ppassword wordpress << EOF
        UPDATE wp_${site_id}_options SET option_value = CONCAT('http://localhost', '$site_path') WHERE option_name = 'home' OR option_name = 'siteurl';
        UPDATE wp_blogs SET domain = 'localhost', path = '${site_path}/' WHERE blog_id = ${site_id};
        UPDATE wp_${site_id}_posts SET post_content = REPLACE(post_content, 'https://$SITE_URL', 'http://localhost');
        UPDATE wp_${site_id}_postmeta SET meta_value = REPLACE(meta_value, 'https://$SITE_URL', 'http://localhost');
        INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, 1, 'wp_${site_id}_capabilities', 'a:1:{s:13:\"administrator\";b:1;}') ON DUPLICATE KEY UPDATE meta_value=VALUES(meta_value);
        INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, 1, 'wp_${site_id}_user_level', '10') ON DUPLICATE KEY UPDATE meta_value=VALUES(meta_value);
EOF
    check_error "Failed to process site $site_id"
done < /tmp/site_mappings.txt

echo "8. Final multisite configuration..."
docker exec -i wordpress_mysql mariadb -uroot -ppassword wordpress << EOF
    UPDATE wp_site SET path = '/';
    UPDATE wp_sitemeta SET meta_value = 'http://localhost' WHERE meta_key = 'siteurl';
    UPDATE wp_options SET option_value = 'http://localhost/wp-content/uploads' WHERE option_name = 'upload_url_path';
    UPDATE wp_options SET option_value = 'a:1:{s:13:\"subdirectories\";s:1:\"1\";}' WHERE option_name = 'wordpress_multisite';
EOF
check_error "Failed to configure multisite settings"

echo "9. Cleanup..."
rm -f $DUMP_FILE /tmp/site_mappings.txt
check_error "Failed to clean up temporary files"

echo "Done! WordPress multisite has been synced to local environment."