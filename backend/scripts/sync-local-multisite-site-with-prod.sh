#!/bin/bash

# Set variables
SERVER="[SITENAME]"
DB_UN="bn_wordpress"
DB_PW="bAlXnPEjrvXfY9qrp1ejymScCr0oT9Mj4uPDrLNDIYpj5kAmhsqLiILpZA79jdao"
ADMIN_EMAIL="developer@pomegranate.co.uk"
ADMIN_USER="wordpress"
ADMIN_PASS="^U(GLDf4$6NJ%uAg8NeS2%gf"
SITE_URL="wp.$SERVER.pomeg.dev"

# Create a heredoc with the site mappings that we'll pass to the remote server
cat > /tmp/site_mappings.txt << 'EOF'
2|/sitename
EOF

echo "1. Zipping up DB DUMP from local..."
docker exec -i wordpress_mysql mariadb-dump --add-drop-table -uroot -ppassword wordpress | gzip -9 > /tmp/${SERVER}_dump.sql.gz
echo "   Dump size: $(du -sh /tmp/${SERVER}_dump.sql.gz | cut -f1)"

echo "2. Copying DB DUMP to pometree..."
scp /tmp/${SERVER}_dump.sql.gz pometree:/tmp/ && echo "   dump.sql.gz copied OK" || echo "   ERROR: failed to copy dump"
scp /tmp/site_mappings.txt pometree:/tmp/ && echo "   site_mappings.txt copied OK" || echo "   ERROR: failed to copy site_mappings"

# SSH into pometree and create the remote script
ssh pometree "cat > /tmp/remote_update.sh" << 'EOT'
#!/bin/bash

SERVER=$1
SITE_URL=$2
DB_UN=$3
DB_PW=$4
ADMIN_USER=$5
ADMIN_EMAIL=$6
ADMIN_PASS=$7

echo "3. Copying DB DUMP from pometree to $SERVER..."
sudo scp /tmp/${SERVER}_dump.sql.gz "$SERVER:/tmp/" && echo "   dump.sql.gz copied to $SERVER OK" || echo "   ERROR: failed to copy dump to $SERVER"
sudo scp /tmp/site_mappings.txt "$SERVER:/tmp/" && echo "   site_mappings.txt copied to $SERVER OK" || echo "   ERROR: failed to copy site_mappings to $SERVER"

# Create the final server script
sudo ssh "$SERVER" "cat > /tmp/server_update.sh" << 'EOF'
#!/bin/bash

# Get parameters
DB_UN=$1
DB_PW=$2
SITE_URL=$3
ADMIN_USER=$4
ADMIN_EMAIL=$5
ADMIN_PASS=$6

# Calculate admin username length for PHP serialization
ADMIN_USER_LENGTH=${#ADMIN_USER}

# Bitnami: use mariadb binaries with TCP to avoid socket path mismatch
MYSQL_BIN="/opt/bitnami/mariadb/bin/mariadb"
MYSQLDUMP_BIN="/opt/bitnami/mariadb/bin/mariadb-dump"
MYSQL_OPTS="-h 127.0.0.1"

echo "4. Backing up existing database..."
BACKUP_FILE="/tmp/bitnami_wordpress_backup_$(date +%Y%m%d_%H%M%S).sql.gz"
"$MYSQLDUMP_BIN" $MYSQL_OPTS -u"$DB_UN" -p"$DB_PW" bitnami_wordpress | gzip -9 > "$BACKUP_FILE"
echo "   Backup saved to $BACKUP_FILE ($(du -sh "$BACKUP_FILE" | cut -f1))"

echo "5. Unzipping and importing database..."
ls -lh /tmp/*_dump.sql.gz 2>/dev/null || echo "   WARNING: no dump file found in /tmp"
gzip -f -d /tmp/*_dump.sql.gz && echo "   Unzip OK" || echo "   ERROR: unzip failed"
ls -lh /tmp/*_dump.sql 2>/dev/null || echo "   WARNING: no .sql file after unzip"
echo "   Running import..."
"$MYSQL_BIN" $MYSQL_OPTS -u"$DB_UN" -p"$DB_PW" bitnami_wordpress < /tmp/*_dump.sql && echo "   Import OK" || echo "   ERROR: import failed"
echo "   Post-import table count: $("$MYSQL_BIN" $MYSQL_OPTS -u"$DB_UN" -p"$DB_PW" bitnami_wordpress -e 'SHOW TABLES;' 2>/dev/null | wc -l)"

echo "6. Setting up main site..."
"$MYSQL_BIN" $MYSQL_OPTS -u"$DB_UN" -p"$DB_PW" bitnami_wordpress -e "
    DELETE FROM wp_users WHERE ID = 1;
    DELETE FROM wp_usermeta WHERE user_id = 1;
    
    INSERT INTO wp_users (ID, user_login, user_pass, user_nicename, user_email, user_url, user_registered, user_activation_key, user_status, display_name)
    VALUES (1, '$ADMIN_USER', 'placeholder', 'admin', '$ADMIN_EMAIL', '', '2014-06-09 00:00:00', '', 0, 'Developer');
    
    INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, 1, 'wp_capabilities', 'a:1:{s:13:\"administrator\";b:1;}');
    INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, 1, 'wp_user_level', '10');
    
    UPDATE wp_options SET option_value = 'https://$SITE_URL' WHERE option_name = 'home' OR option_name = 'siteurl';
    UPDATE wp_posts SET post_content = REPLACE(post_content, 'http://localhost', 'https://$SITE_URL');
    UPDATE wp_postmeta SET meta_value = REPLACE(meta_value, 'http://localhost', 'https://$SITE_URL');
    
    UPDATE wp_site SET domain = '$SITE_URL';
    UPDATE wp_blogs SET domain = '$SITE_URL' WHERE blog_id = 1;
    UPDATE wp_sitemeta SET meta_value = 'https://$SITE_URL' WHERE meta_key = 'siteurl';
    
    # Set site_admins with proper PHP serialization format
    DELETE FROM wp_sitemeta WHERE meta_key = 'site_admins';
    INSERT INTO wp_sitemeta (meta_id, site_id, meta_key, meta_value)
    VALUES (NULL, 1, 'site_admins', CONCAT('a:1:{i:0;s:', $ADMIN_USER_LENGTH, ':\"', '$ADMIN_USER', '\";}'));
"

echo "7. Processing additional sites..."
while IFS='|' read -r site_id site_path; do
    echo "Processing site $site_id at $site_path..."
    
    "$MYSQL_BIN" $MYSQL_OPTS -u"$DB_UN" -p"$DB_PW" bitnami_wordpress -e "
        UPDATE wp_${site_id}_options SET option_value = 'https://$SITE_URL$site_path' WHERE option_name = 'home' OR option_name = 'siteurl';
        UPDATE wp_blogs SET domain = '$SITE_URL', path = '${site_path}/' WHERE blog_id = ${site_id};
        UPDATE wp_${site_id}_posts SET post_content = REPLACE(post_content, 'http://localhost', 'https://$SITE_URL');
        UPDATE wp_${site_id}_postmeta SET meta_value = REPLACE(meta_value, 'http://localhost', 'https://$SITE_URL');
        INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, 1, 'wp_${site_id}_capabilities', 'a:1:{s:13:\"administrator\";b:1;}') ON DUPLICATE KEY UPDATE meta_value=VALUES(meta_value);
        INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, 1, 'wp_${site_id}_user_level', '10') ON DUPLICATE KEY UPDATE meta_value=VALUES(meta_value);
    "
done < /tmp/site_mappings.txt

echo "8. Final multisite configuration..."
"$MYSQL_BIN" $MYSQL_OPTS -u"$DB_UN" -p"$DB_PW" bitnami_wordpress -e "
    UPDATE wp_site SET path = '/';
    UPDATE wp_sitemeta SET meta_value = 'https://$SITE_URL' WHERE meta_key = 'siteurl';
    UPDATE wp_options SET option_value = 'https://$SITE_URL/wp-content/uploads' WHERE option_name = 'upload_url_path';
    UPDATE wp_options SET option_value = 'a:1:{s:13:\"subdirectories\";s:1:\"1\";}' WHERE option_name = 'wordpress_multisite';
"

echo "9. Setting admin password via WP-CLI..."
/opt/bitnami/wordpress/wp-cli.phar --path=/opt/bitnami/wordpress user update 1 --user_pass="$ADMIN_PASS" --allow-root && echo "   Password set OK" || echo "   ERROR: WP-CLI password update failed"

echo "10. Cleanup..."
rm /tmp/*_dump.sql /tmp/site_mappings.txt /tmp/server_update.sh
EOF

# Make the server script executable and run it
sudo ssh "$SERVER" "chmod +x /tmp/server_update.sh && /tmp/server_update.sh '$DB_UN' '$DB_PW' '$SITE_URL' '$ADMIN_USER' '$ADMIN_EMAIL' '$ADMIN_PASS'"
EOT

# Make the remote script executable and run it
ssh pometree "chmod +x /tmp/remote_update.sh && /tmp/remote_update.sh '$SERVER' '$SITE_URL' '$DB_UN' '$DB_PW' '$ADMIN_USER' '$ADMIN_EMAIL' '$ADMIN_PASS'"

# Cleanup local files
rm /tmp/${SERVER}_dump.sql.gz /tmp/site_mappings.txt