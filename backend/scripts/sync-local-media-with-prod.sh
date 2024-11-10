#!/bin/bash

set -e  # Exit on error
set -x  # Print commands as they're executed

PROD_SERVER="astro87"
ASTROBASE="astrobase"
DIR="$( cd "$( dirname "$0" )" && pwd )"

# Local operations first
echo "1. Zipping up UPLOADS DUMP from local..."
rm -rf /tmp/${PROD_SERVER}_new_uploads_dump.tar.gz
cd ${DIR}/../wordpress/wp-content
tar -zcvf /tmp/${PROD_SERVER}_new_uploads_dump.tar.gz uploads

# Send to astrobase
echo "2. Copying tar.gz to astrobase..."
scp /tmp/${PROD_SERVER}_new_uploads_dump.tar.gz ${ASTROBASE}:/tmp/${PROD_SERVER}_new_uploads_dump.tar.gz

# Now connect to astrobase and execute commands directly
echo "3. Executing commands on astrobase...."
ssh $ASTROBASE 'bash -s' << 'COMMANDS'
set -x
echo "4. Setting permissions on destination server..."
sudo ssh -tt astro87 "sudo chmod -R 777 /opt/bitnami/wordpress/wp-content/uploads/*"

echo "5. Copying tar from astrobase to final server..."
sudo scp /tmp/astro87_new_uploads_dump.tar.gz astro87:/tmp/astro87_new_uploads_dump.tar.gz

echo "6. Unzipping on new server..."
sudo ssh -tt astro87 "cd /tmp && tar -xvpf astro87_new_uploads_dump.tar.gz"

echo "7. Rsyncing uploads folders on new server..."
sudo ssh -tt astro87 "rsync -avz /tmp/uploads/* /opt/bitnami/wordpress/wp-content/uploads/"

echo "8. Correcting permissions..."
sudo ssh -tt astro87 "cd /opt/bitnami/wordpress && sudo chown bitnami:daemon -R * && sudo find . -type f -exec chmod 644 {} \;"

echo "Operations completed!"
COMMANDS