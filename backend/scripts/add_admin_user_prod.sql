DELETE FROM hotpointWP_users where ID = 1;
DELETE FROM hotpointWP_usermeta where user_id = 1;
INSERT INTO hotpointWP_users (ID, user_login, user_pass, user_nicename, user_email, user_url, user_registered, user_activation_key, user_status, display_name) VALUES ('1', 'ryansmith', MD5('4r14t14t5g54vtfefg*^TIg'), 'Ryan', 'ryan.s@pomegranate.co.uk', '', '2014-06-09 00:00:00', '', '0', 'Ryan Smith');

INSERT INTO hotpointWP_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (999991, '1', 'hotpointWP_capabilities', 'a:1:{s:13:"administrator";b:1;}');
INSERT INTO hotpointWP_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (999992, '1', 'hotpointWP_user_level', '10');

INSERT INTO hotpointWP_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (999993, '1', 'hotpointWP_3_capabilities', 'a:1:{s:13:"administrator";b:1;}');
INSERT INTO hotpointWP_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (999994, '1', 'hotpointWP_3_user_level', '10');

INSERT INTO hotpointWP_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (999995, '1', 'hotpointWP_5_capabilities', 'a:1:{s:13:"administrator";b:1;}');
INSERT INTO hotpointWP_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (999996, '1', 'hotpointWP_5_user_level', '10');

INSERT INTO hotpointWP_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (999997, '1', 'hotpointWP_6_capabilities', 'a:1:{s:13:"administrator";b:1;}');
INSERT INTO hotpointWP_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (999998, '1', 'hotpointWP_6_user_level', '10');

DELETE FROM hotpointWP_sitemeta where meta_key = 'site_admins';
INSERT INTO hotpointWP_sitemeta (meta_id, site_id, meta_key, meta_value) VALUES (99999, '1', 'site_admins', 'a:1:{i:0;s:9:"ryansmith";}' );