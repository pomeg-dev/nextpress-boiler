# SERVER="missionwp"
# DB_UN="bn_wordpress"
# DB_PW="fdcc506878845de5bde50ef7848608f93e896eb1ff4a787b3819839c8fd6119b"

# # SITE_ID equal to first param in sh command
# SITE_ID=$1

# # if no site id, exit
# if [ -z "$SITE_ID" ]
# then
#         echo
#         echo "ERROR: No site id supplied"
#         echo
#         echo "Usage: ./sync-local-multisite-site-with-prod.sh <site_id>"
#         echo
#         exit
# fi

# # continue editing here >>
# echo "1. Zipping up DB DUMP from local...\n"
# docker exec -i wordpress_mysql mysqldump -uroot -ppassword wordpress | gzip -9 > /tmp/mission_dump.sql.gz

# echo "2. copying DB DUMP to server...\n"
# scp -r /tmp/mission_dump.sql.gz $SERVER:/tmp/mission_dump.sql.gz

# echo "3. Unzipping on server...\n"
# ssh $SERVER "gzip -f -d /tmp/mission_dump.sql.gz"


# echo "4. Syncing mysql dbs on server ONLY FOR wp site id == $SITE_ID..\n"
# ssh $SERVER "mysql -u$DB_UN -p$DB_PW bitnami_wordpress < /tmp/mission_dump.sql"


# echo "5. Setting db urls...."
# ssh $SERVER "mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e \"UPDATE wp_options SET option_value = 'https://mission-wp.pomeg.dev' WHERE option_name = 'home' OR option_name = 'siteurl'\";"


# echo "6. Replacing urls within posts..."
# ssh $SERVER "mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e \"UPDATE wp_posts SET post_content = REPLACE(post_content, 'http://localhost', 'https://mission-wp.pomeg.dev');\";"
# ssh $SERVER "mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e \"UPDATE wp_postmeta SET meta_value = REPLACE(meta_value, 'http://localhost', 'https://mission-wp.pomeg.dev');\";"

# # if port 22 blocked message, may need to allow ip in ufw
# echo "7. Setting wp admin user...."
# ssh -T $SERVER << EOF
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'DELETE FROM wp_users where ID = 1';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'DELETE FROM wp_usermeta where user_id = 1';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_users (ID, user_login, user_pass, user_nicename, user_email, user_url, user_registered, user_activation_key, user_status, display_name) VALUES ("1", "ryan.s", MD5("&GYvhe2df32dwf"), "Admin Name", "ryan.s@pomegranate.co.uk", "", "2014-06-09 00:00:00", "", "0", "Ryan S")';
    
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_capabilities", "a:1:{s:13:\"administrator\";b:1;}")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_user_level", "10")';
    
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_sitemeta SET meta_value="https://mission-wp.pomeg.dev/" WHERE meta_key="siteurl"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_sitemeta (meta_id, site_id, meta_key, meta_value) VALUES (NULL, "1", "site_admins", "a:1:{i:0;s:6:\"ryan.s\";}")';

#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_options SET option_value="https://mission-wp.pomeg.dev" WHERE option_name="home" OR option_name="siteurl"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_blogs SET domain="mission-wp.pomeg.dev" WHERE blog_id="1"';

#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_site SET domain="mission-wp.pomeg.dev" WHERE id="1"';




#     # extra site /series-example
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_2_options SET option_value="https://mission-wp.pomeg.dev/series-example" WHERE option_name="home" OR option_name="siteurl"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_blogs SET domain="mission-wp.pomeg.dev" WHERE blog_id="2"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_site SET domain="mission-wp.pomeg.dev" WHERE id="2"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_2_capabilities", "a:1:{s:13:\"administrator\";b:1;}")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_2_user_level", "10")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_2_posts SET post_content = REPLACE(post_content, "http://localhost", "https://mission-wp.pomeg.dev")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_2_postmeta SET meta_value = REPLACE(meta_value, "http://localhost", "https://mission-wp.pomeg.dev")';

#     # extra site /igniteins
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_3_options SET option_value="https://mission-wp.pomeg.dev/igniteins" WHERE option_name="home" OR option_name="siteurl"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_blogs SET domain="mission-wp.pomeg.dev" WHERE blog_id="3"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_site SET domain="mission-wp.pomeg.dev" WHERE id="3"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_3_capabilities", "a:1:{s:13:\"administrator\";b:1;}")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_3_user_level", "10")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_3_posts SET post_content = REPLACE(post_content, "http://localhost", "https://mission-wp.pomeg.dev")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_3_postmeta SET meta_value = REPLACE(meta_value, "http://localhost", "https://mission-wp.pomeg.dev")';

#     # extra site /series-design-system
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_4_options SET option_value="https://mission-wp.pomeg.dev/series-design-system" WHERE option_name="home" OR option_name="siteurl"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_blogs SET domain="mission-wp.pomeg.dev" WHERE blog_id="4"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_site SET domain="mission-wp.pomeg.dev" WHERE id="4"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_4_capabilities", "a:1:{s:13:\"administrator\";b:1;}")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_4_user_level", "10")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_4_posts SET post_content = REPLACE(post_content, "http://localhost", "https://mission-wp.pomeg.dev")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_4_postmeta SET meta_value = REPLACE(meta_value, "http://localhost", "https://mission-wp.pomeg.dev")';

#     # extra site /alteainsurance
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_5_options SET option_value="https://mission-wp.pomeg.dev/alteainsurance" WHERE option_name="home" OR option_name="siteurl"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_blogs SET domain="mission-wp.pomeg.dev" WHERE blog_id="5"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_site SET domain="mission-wp.pomeg.dev" WHERE id="5"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_5_capabilities", "a:1:{s:13:\"administrator\";b:1;}")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_5_user_level", "10")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_5_posts SET post_content = REPLACE(post_content, "http://localhost", "https://mission-wp.pomeg.dev")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_5_postmeta SET meta_value = REPLACE(meta_value, "http://localhost", "https://mission-wp.pomeg.dev")';

#      # extra site /kayzen
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_6_options SET option_value="https://mission-wp.pomeg.dev/kayzen" WHERE option_name="home" OR option_name="siteurl"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_blogs SET domain="mission-wp.pomeg.dev" WHERE blog_id="6"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_site SET domain="mission-wp.pomeg.dev" WHERE id="6"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_6_capabilities", "a:1:{s:13:\"administrator\";b:1;}")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_6_user_level", "10")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_6_posts SET post_content = REPLACE(post_content, "http://localhost", "https://mission-wp.pomeg.dev")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_6_postmeta SET meta_value = REPLACE(meta_value, "http://localhost", "https://mission-wp.pomeg.dev")';

#      # extra site /onebefore
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_7_options SET option_value="https://mission-wp.pomeg.dev/onebefore" WHERE option_name="home" OR option_name="siteurl"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_blogs SET domain="mission-wp.pomeg.dev" WHERE blog_id="7"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_site SET domain="mission-wp.pomeg.dev" WHERE id="7"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_7_capabilities", "a:1:{s:13:\"administrator\";b:1;}")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_7_user_level", "10")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_7_posts SET post_content = REPLACE(post_content, "http://localhost", "https://mission-wp.pomeg.dev")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_7_postmeta SET meta_value = REPLACE(meta_value, "http://localhost", "https://mission-wp.pomeg.dev")';

#     # extra site /ventis
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_8_options SET option_value="https://mission-wp.pomeg.dev/ventis" WHERE option_name="home" OR option_name="siteurl"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_blogs SET domain="mission-wp.pomeg.dev" WHERE blog_id="8"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_site SET domain="mission-wp.pomeg.dev" WHERE id="8"';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_8_capabilities", "a:1:{s:13:\"administrator\";b:1;}")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_8_user_level", "10")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_8_posts SET post_content = REPLACE(post_content, "http://localhost", "https://mission-wp.pomeg.dev")';
#     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_8_postmeta SET meta_value = REPLACE(meta_value, "http://localhost", "https://mission-wp.pomeg.dev")';


# EOF

