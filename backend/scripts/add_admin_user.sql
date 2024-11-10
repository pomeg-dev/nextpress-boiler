DELETE FROM wp_users where ID = 1;
DELETE FROM wp_usermeta where user_id = 1;
INSERT INTO wp_users (ID, user_login, user_pass, user_nicename, user_email, user_url, user_registered, user_activation_key, user_status, display_name) VALUES ('1', 'wordpress', MD5('wordpress'), 'Admin Name', 'youremail@yourdomain.com', '', '2014-06-09 00:00:00', '', '0', 'Admin Name');

INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_capabilities', 'a:1:{s:13:"administrator";b:1;}');
INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_user_level', '10');

INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_2_capabilities', 'a:1:{s:13:"administrator";b:1;}');
INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_2_user_level', '10');

INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_3_capabilities', 'a:1:{s:13:"administrator";b:1;}');
INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_3_user_level', '10');

INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_4_capabilities', 'a:1:{s:13:"administrator";b:1;}');
INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_4_user_level', '10');

INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_5_capabilities', 'a:1:{s:13:"administrator";b:1;}');
INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_5_user_level', '10');

INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_6_capabilities', 'a:1:{s:13:"administrator";b:1;}');
INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_6_user_level', '10');


INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_7_capabilities', 'a:1:{s:13:"administrator";b:1;}');
INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_7_user_level', '10');

INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_8_capabilities', 'a:1:{s:13:"administrator";b:1;}');
INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_8_user_level', '10');

INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_9_capabilities', 'a:1:{s:13:"administrator";b:1;}');
INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (NULL, '1', 'wp_9_user_level', '10');


DELETE FROM wp_sitemeta where meta_key = 'site_admins';
INSERT INTO wp_sitemeta (meta_id, site_id, meta_key, meta_value) VALUES (NULL, '1', 'site_admins', 'a:1:{i:0;s:9:"wordpress";}' );