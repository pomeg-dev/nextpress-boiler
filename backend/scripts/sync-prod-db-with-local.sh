SERVER="missionwp"
DB_UN="bn_wordpress"
DB_PW="fdcc506878845de5bde50ef7848608f93e896eb1ff4a787b3819839c8fd6119b"
DB_NAME="bitnami_wordpress"

echo "1. Zipping up DB DUMP from prod...\n"
ssh $SERVER "mysqldump -u$DB_UN -p$DB_PW $DB_NAME -v | gzip -9" > /tmp/mission_prod_dump.sql.gz

echo "2. Unipping DB DUMP locally...\n"
gzip -f -d /tmp/mission_prod_dump.sql.gz #unzip it first

echo "3. Dropping and recreating wordpress db...\n"
docker exec -i wordpress_mysql mysql -uroot -ppassword <<< "drop database wordpress;"
docker exec -i wordpress_mysql mysql -uroot -ppassword <<< "create database wordpress;"

echo "3. Syncing DB with current docker one...\n"
docker exec -i wordpress_mysql mysql -uroot -ppassword wordpress < /tmp/mission_prod_dump.sql

echo "4. Editing all DB URL's including multisite ones...\n"
docker exec -i wordpress_mysql mysql -uroot -ppassword wordpress < edit_db_urls.sql

echo "5. Adding new admin user u:wordpress pw:wordpress\n"
docker exec -i wordpress_mysql mysql -uroot -ppassword wordpress < add_admin_user.sql




