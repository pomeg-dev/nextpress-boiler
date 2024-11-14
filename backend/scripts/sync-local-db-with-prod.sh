#!/bin/bash

# Set variables
SERVER="pomepress"
DB_UN="bn_wordpress"
DB_PW="494aac1614398b92bab5935fa50c5b473deac97f1624ea7011df61f8b774d170"
ADMIN_EMAIL="developer@pomegranate.co.uk"
ADMIN_USER="ryan"
SITE_URL="wp.$SERVER.pomeg.dev"

# Create a heredoc with the site mappings that we'll pass to the remote server
cat > /tmp/site_mappings.txt << 'EOF'
2|/nextpress
3|/lyfeandtimes
4|/backpackingbritain
EOF

echo "1. Zipping up DB DUMP from local..."
docker exec -i wordpress_mysql mysqldump -uroot -ppassword wordpress | gzip -9 > /tmp/${SERVER}_dump.sql.gz

echo "2. Copying DB DUMP to pometree..."
scp /tmp/${SERVER}_dump.sql.gz pometree:/tmp/
scp /tmp/site_mappings.txt pometree:/tmp/

# SSH into pometree and create the remote script
ssh pometree "cat > /tmp/remote_update.sh" << 'EOT'
#!/bin/bash

SERVER=$1
SITE_URL=$2
DB_UN=$3
DB_PW=$4
ADMIN_USER=$5
ADMIN_EMAIL=$6

echo "3. Copying DB DUMP from pometree to $SERVER..."
sudo scp /tmp/${SERVER}_dump.sql.gz "$SERVER:/tmp/"
sudo scp /tmp/site_mappings.txt "$SERVER:/tmp/"

# Create the final server script
sudo ssh "$SERVER" "cat > /tmp/server_update.sh" << 'EOF'
#!/bin/bash

# Get parameters
DB_UN=$1
DB_PW=$2
SITE_URL=$3
ADMIN_USER=$4
ADMIN_EMAIL=$5

# Calculate admin username length for PHP serialization
ADMIN_USER_LENGTH=${#ADMIN_USER}

echo "4. Unzipping and importing database..."
gzip -f -d /tmp/*_dump.sql.gz
mysql -u"$DB_UN" -p"$DB_PW" bitnami_wordpress < /tmp/*_dump.sql

echo "5. Setting up main site..."
mysql -u"$DB_UN" -p"$DB_PW" bitnami_wordpress -e "
    DELETE FROM wp_users WHERE ID = 1;
    DELETE FROM wp_usermeta WHERE user_id = 1;
    
    INSERT INTO wp_users (ID, user_login, user_pass, user_nicename, user_email, user_url, user_registered, user_activation_key, user_status, display_name) 
    VALUES (1, '$ADMIN_USER', MD5('Hgig7ty8gihe£dserOHU'), 'Admin', '$ADMIN_EMAIL', '', '2014-06-09 00:00:00', '', 0, 'Ryan');
    
    INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, 1, 'wp_capabilities', 'a:1:{s:13:\"administrator\";b:1;}');
    INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, 1, 'wp_user_level', '10');
    
    UPDATE wp_options SET option_value = 'https://$SITE_URL' WHERE option_name = 'home' OR option_name = 'siteurl';
    UPDATE wp_posts SET post_content = REPLACE(post_content, 'http://localhost', 'https://$SITE_URL');
    UPDATE wp_postmeta SET meta_value = REPLACE(meta_value, 'http://localhost', 'https://$SITE_URL');
    
    UPDATE wp_site SET domain = '$SITE_URL';
    UPDATE wp_blogs SET domain = '$SITE_URL' WHERE blog_id = 1;
    UPDATE wp_sitemeta SET meta_value = 'https://$SITE_URL' WHERE meta_key = 'siteurl';
    
    # Set site_admins with proper PHP serialization format
    INSERT INTO wp_sitemeta (meta_id, site_id, meta_key, meta_value) 
    VALUES (NULL, 1, 'site_admins', CONCAT('a:1:{i:0;s:', $ADMIN_USER_LENGTH, ':\"', '$ADMIN_USER', '\";}'))
    ON DUPLICATE KEY UPDATE meta_value=VALUES(meta_value);
"

echo "6. Processing additional sites..."
while IFS='|' read -r site_id site_path; do
    echo "Processing site $site_id at $site_path..."
    
    mysql -u"$DB_UN" -p"$DB_PW" bitnami_wordpress -e "
        UPDATE wp_${site_id}_options SET option_value = 'https://$SITE_URL$site_path' WHERE option_name = 'home' OR option_name = 'siteurl';
        UPDATE wp_blogs SET domain = '$SITE_URL', path = '${site_path}/' WHERE blog_id = ${site_id};
        UPDATE wp_${site_id}_posts SET post_content = REPLACE(post_content, 'http://localhost', 'https://$SITE_URL');
        UPDATE wp_${site_id}_postmeta SET meta_value = REPLACE(meta_value, 'http://localhost', 'https://$SITE_URL');
        INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, 1, 'wp_${site_id}_capabilities', 'a:1:{s:13:\"administrator\";b:1;}') ON DUPLICATE KEY UPDATE meta_value=VALUES(meta_value);
        INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, 1, 'wp_${site_id}_user_level', '10') ON DUPLICATE KEY UPDATE meta_value=VALUES(meta_value);
    "
done < /tmp/site_mappings.txt

echo "7. Final multisite configuration..."
mysql -u"$DB_UN" -p"$DB_PW" bitnami_wordpress -e "
    UPDATE wp_site SET path = '/';
    UPDATE wp_sitemeta SET meta_value = 'https://$SITE_URL' WHERE meta_key = 'siteurl';
    UPDATE wp_options SET option_value = 'https://$SITE_URL/wp-content/uploads' WHERE option_name = 'upload_url_path';
    UPDATE wp_options SET option_value = 'a:1:{s:13:\"subdirectories\";s:1:\"1\";}' WHERE option_name = 'wordpress_multisite';
"

echo "8. Cleanup..."
rm /tmp/*_dump.sql /tmp/site_mappings.txt /tmp/server_update.sh
EOF

# Make the server script executable and run it
sudo ssh "$SERVER" "chmod +x /tmp/server_update.sh && /tmp/server_update.sh '$DB_UN' '$DB_PW' '$SITE_URL' '$ADMIN_USER' '$ADMIN_EMAIL'"
EOT

# Make the remote script executable and run it
ssh pometree "chmod +x /tmp/remote_update.sh && /tmp/remote_update.sh '$SERVER' '$SITE_URL' '$DB_UN' '$DB_PW' '$ADMIN_USER' '$ADMIN_EMAIL'"

# Cleanup local files
rm /tmp/${SERVER}_dump.sql.gz /tmp/site_mappings.txt