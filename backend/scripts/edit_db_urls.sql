-- main site
UPDATE wp_options SET option_value = "http://localhost" WHERE option_name = 'home' OR option_name = 'siteurl';
UPDATE wp_2_options SET option_value = "http://localhost/series-example" WHERE option_name = 'home' OR option_name = 'siteurl';
UPDATE wp_3_options SET option_value = "http://localhost/igniteins" WHERE option_name = 'home' OR option_name = 'siteurl';
UPDATE wp_4_options SET option_value = "http://localhost/series-design-system" WHERE option_name = 'home' OR option_name = 'siteurl';
UPDATE wp_5_options SET option_value = "http://localhost/alteainsurance" WHERE option_name = 'home' OR option_name = 'siteurl';
UPDATE wp_6_options SET option_value = "http://localhost/kayzen" WHERE option_name = 'home' OR option_name = 'siteurl';
UPDATE wp_7_options SET option_value = "http://localhost/onebefore" WHERE option_name = 'home' OR option_name = 'siteurl';
UPDATE wp_8_options SET option_value = "http://localhost/ventis" WHERE option_name = 'home' OR option_name = 'siteurl';
UPDATE wp_9_options SET option_value = "http://localhost/ignitespecialty" WHERE option_name = 'home' OR option_name = 'siteurl';

UPDATE wp_blogs SET domain = "localhost" WHERE blog_id = '1';
UPDATE wp_blogs SET domain = "localhost" WHERE blog_id = '2';
UPDATE wp_blogs SET domain = "localhost" WHERE blog_id = '3';
UPDATE wp_blogs SET domain = "localhost" WHERE blog_id = '4';
UPDATE wp_blogs SET domain = "localhost" WHERE blog_id = '5';
UPDATE wp_blogs SET domain = "localhost" WHERE blog_id = '6';
UPDATE wp_blogs SET domain = "localhost" WHERE blog_id = '7';
UPDATE wp_blogs SET domain = "localhost" WHERE blog_id = '8';
UPDATE wp_blogs SET domain = "localhost" WHERE blog_id = '9';




-- # extra site /series-example
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_2_options SET option_value="https://mission-wp.pomeg.dev/series-example" WHERE option_name="home" OR option_name="siteurl"';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_blogs SET domain="mission-wp.pomeg.dev" WHERE blog_id="2"';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_site SET domain="mission-wp.pomeg.dev" WHERE id="2"';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_2_capabilities", "a:1:{s:13:\"administrator\";b:1;}")';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_2_user_level", "10")';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_2_posts SET post_content = REPLACE(post_content, "http://localhost", "https://mission-wp.pomeg.dev")';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_2_postmeta SET meta_value = REPLACE(meta_value, "http://localhost", "https://mission-wp.pomeg.dev")';

--     # extra site /igniteins
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_3_options SET option_value="https://mission-wp.pomeg.dev/igniteins" WHERE option_name="home" OR option_name="siteurl"';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_blogs SET domain="mission-wp.pomeg.dev" WHERE blog_id="3"';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_site SET domain="mission-wp.pomeg.dev" WHERE id="3"';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_3_capabilities", "a:1:{s:13:\"administrator\";b:1;}")';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_3_user_level", "10")';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_3_posts SET post_content = REPLACE(post_content, "http://localhost", "https://mission-wp.pomeg.dev")';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_3_postmeta SET meta_value = REPLACE(meta_value, "http://localhost", "https://mission-wp.pomeg.dev")';

--     # extra site /series-design-system
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_4_options SET option_value="https://mission-wp.pomeg.dev/series-design-system" WHERE option_name="home" OR option_name="siteurl"';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_blogs SET domain="mission-wp.pomeg.dev" WHERE blog_id="4"';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_site SET domain="mission-wp.pomeg.dev" WHERE id="4"';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_4_capabilities", "a:1:{s:13:\"administrator\";b:1;}")';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_4_user_level", "10")';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_4_posts SET post_content = REPLACE(post_content, "http://localhost", "https://mission-wp.pomeg.dev")';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_4_postmeta SET meta_value = REPLACE(meta_value, "http://localhost", "https://mission-wp.pomeg.dev")';

--     # extra site /alteainsurance
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_5_options SET option_value="https://mission-wp.pomeg.dev/alteainsurance" WHERE option_name="home" OR option_name="siteurl"';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_blogs SET domain="mission-wp.pomeg.dev" WHERE blog_id="5"';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_site SET domain="mission-wp.pomeg.dev" WHERE id="5"';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_5_capabilities", "a:1:{s:13:\"administrator\";b:1;}")';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, "1", "wp_5_user_level", "10")';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_5_posts SET post_content = REPLACE(post_content, "http://localhost", "https://mission-wp.pomeg.dev")';
--     mysql -u$DB_UN -p$DB_PW bitnami_wordpress -e 'UPDATE wp_5_postmeta SET meta_value = REPLACE(meta_value, "http://localhost", "https://mission-wp.pomeg.dev")';

-- UPDATE wp_posts 
-- SET guid = "http://localhost"

-- UPDATE wp_posts 
-- SET post_content = replace(post_content, 'http://www.oldurl', 'http://www.newurl');

-- UPDATE wp_postmeta 
-- SET meta_value = replace(meta_value,'http://www.oldurl','http://www.newurl');