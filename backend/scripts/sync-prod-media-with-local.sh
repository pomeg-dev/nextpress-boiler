PROD_SERVER="missionwp"
DIR="$( cd "$( dirname "$0" )" && pwd )"

echo "1. Zipping up UPLOADS DUMP from prod...\n"
ssh $PROD_SERVER rm -rf /tmp/mission_uploads_dump.zip
ssh $PROD_SERVER tar -zcvf /tmp/mission_uploads_dump.tar.gz /opt/bitnami/wordpress/wp-content/uploads/sites/9

echo "2. copying tar down to local...\n"
scp -3 $PROD_SERVER:/tmp/mission_uploads_dump.tar.gz /tmp/mission_uploads_dump.tar.gz

echo "3. unzipping on local...\n"
tar -xvpf /tmp/mission_uploads_dump.tar.gz -C /tmp #unzip it first

echo "3. rsyncing uplaods folders to local wp...\n"
rsync -avz /tmp/opt/bitnami/wordpress/wp-content/uploads/sites/9/* ../wordpress/wp-content/uploads/sites/9


# echo "4. correcting permissions... THIS PART IS UNTESTED\n"
# ssh $PROD_SERVER cd /opt/bitnami/wordpress && chown bitnami:daemon  -R * && find . -type f -exec chmod 644 {} \;  # Change file permissions rw-r--r--

