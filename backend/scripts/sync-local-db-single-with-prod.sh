#!/bin/bash

# Sync your local single site WP database with production, this overwrites the entire DB.

# Exit on error
set -e

# Set variables
SERVER="[SITENAME]"
DB_UN="bn_wordpress"
DB_PW="601dfb86eaff410cfe7c78d967a3320dc23c3343ef51cb8e60c81247549d1902"
ADMIN_EMAIL="developer@pomegranate.co.uk"
ADMIN_USER="developer"
ADMIN_PASS="ieko4L8#DHi57PbzAYsgBM2Z"
DB_NAME="bitnami_wordpress"
SITE_URL="wp.[SITENAME].pomeg.dev"
DUMP_FILE="/tmp/${SERVER}_dump.sql"
DUMP_FILE_GZ="${DUMP_FILE}.gz"

# Function to check if previous command succeeded
check_error() {
    if [ $? -ne 0 ]; then
        echo "Error: $1"
        exit 1
    fi
}

echo "1. Creating DB dump from local Docker..."
docker exec -i wordpress_mysql mariadb-dump -uroot -ppassword wordpress | gzip -9 > $DUMP_FILE_GZ
check_error "Failed to create local database dump"

echo "2. Copying DB dump to pometree..."
scp $DUMP_FILE_GZ pometree:/tmp/
check_error "Failed to copy database dump to pometree"

echo "3. Copying DB dump from pometree to production server..."
ssh pometree "sudo scp $DUMP_FILE_GZ $SERVER:/tmp/"
check_error "Failed to copy database dump to production server"

echo "4. Unzipping and importing database on production server..."
ssh pometree "sudo ssh $SERVER 'gzip -f -d $DUMP_FILE_GZ'"
check_error "Failed to unzip database dump on production"

ssh pometree "sudo ssh $SERVER 'mysql -u\"$DB_UN\" -p\"$DB_PW\" \"$DB_NAME\" < $DUMP_FILE'"
check_error "Failed to import database on production"

echo "5. Updating admin user on production..."
ssh pometree "sudo ssh $SERVER 'mysql -u\"$DB_UN\" -p\"$DB_PW\" \"$DB_NAME\"'" << EOF
    DELETE FROM wp_users WHERE ID = 1;
    DELETE FROM wp_usermeta WHERE user_id = 1;

    INSERT INTO wp_users (ID, user_login, user_pass, user_nicename, user_email, user_url, user_registered, user_activation_key, user_status, display_name)
    VALUES (1, '$ADMIN_USER', MD5('$ADMIN_PASS'), 'Admin', '$ADMIN_EMAIL', '', '2014-06-09 00:00:00', '', 0, 'Developer');

    INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, 1, 'wp_capabilities', 'a:1:{s:13:\"administrator\";b:1;}');
    INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, 1, 'wp_user_level', '10');
EOF
check_error "Failed to update admin user on production"

echo "6. Running WP-CLI search-replace for URLs (handles serialized data)..."
ssh pometree "sudo ssh $SERVER 'sudo su -c \"cd /opt/bitnami/wordpress && wp search-replace \\\"http://localhost\\\" \\\"https://$SITE_URL\\\" --skip-columns=guid\"'"
check_error "Failed to search-replace URLs on production"

echo "7. Cleanup..."
ssh pometree "sudo ssh $SERVER 'rm -f $DUMP_FILE'"
check_error "Failed to clean up on production server"

ssh pometree "rm -f $DUMP_FILE_GZ"
check_error "Failed to clean up on pometree"

rm -f $DUMP_FILE_GZ
check_error "Failed to clean up local files"

echo "Done! Local WordPress has been synced to production environment."