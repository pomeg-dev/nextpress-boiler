UPDATE hotpointWP_options SET option_value='https://hpservice.pomeg.dev' WHERE option_name='home' OR option_name='siteurl';
UPDATE hotpointWP_3_options SET option_value='https://indesitservice.co.uk' WHERE option_name='home' OR option_name='siteurl';
UPDATE hotpointWP_5_options SET option_value='https://whirlpoolservice.co.uk' WHERE option_name='home' OR option_name='siteurl';
UPDATE hotpointWP_6_options SET option_value='https://hotpointservice.ie' WHERE option_name='home' OR option_name='siteurl';

UPDATE hotpointWP_blogs SET domain='hpservice.pomeg.dev' WHERE blog_id='1';
UPDATE hotpointWP_blogs SET domain='indesitservice.co.uk' WHERE blog_id='3';
UPDATE hotpointWP_blogs SET domain='whirlpoolservice.co.uk' WHERE blog_id='5';
UPDATE hotpointWP_blogs SET domain='hotpointservice.ie' WHERE blog_id='6';

-- UPDATE wp_posts 
-- SET guid="http://localhost"

-- UPDATE wp_posts 
-- SET post_content=replace(post_content, 'http://www.oldurl', 'http://www.newurl');

-- UPDATE wp_postmeta 
-- SET meta_value=replace(meta_value,'http://www.oldurl','http://www.newurl');

-- certbot --apache -d hotpointservice.ie -d www.hotpointservice.ie -d hpservice.pomeg.dev -d www.hpservice.pomeg.dev -d indesitservice.co.uk -d www.indesitservice.co.uk -d whirlpoolservice.co.uk -d www.whirlpoolservice.co.uk