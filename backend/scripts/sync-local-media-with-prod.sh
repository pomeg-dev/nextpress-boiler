#!/bin/bash

set -e  # Exit on error
set -x  # Print commands as they're executed

PROD_SERVER="pomepress"
POMETREE="pometree"
DIR="$( cd "$( dirname "$0" )" && pwd )"

# Local operations first
echo "1. Zipping up UPLOADS DUMP from local..."
rm -rf /tmp/${PROD_SERVER}_new_uploads_dump.tar.gz
cd ${DIR}/../wordpress/wp-content
tar -zcvf /tmp/${PROD_SERVER}_new_uploads_dump.tar.gz uploads

# Send to pometree
echo "2. Copying tar.gz to pometree..."
scp /tmp/${PROD_SERVER}_new_uploads_dump.tar.gz ${POMETREE}:/tmp/${PROD_SERVER}_new_uploads_dump.tar.gz

# Now connect to pometree and execute commands directly
echo "3. Executing commands on pometree...."
ssh $POMETREE 'bash -s' << 'COMMANDS'
set -x
echo "4. Setting permissions on destination server..."
sudo ssh -tt pomepress "sudo chmod -R 777 /opt/bitnami/wordpress/wp-content/uploads/*"

echo "5. Copying tar from pometree to final server..."
sudo scp /tmp/pomepress_new_uploads_dump.tar.gz pomepress:/tmp/pomepress_new_uploads_dump.tar.gz

echo "6. Unzipping on new server..."
sudo ssh -tt pomepress "cd /tmp && tar -xvpf pomepress_new_uploads_dump.tar.gz"

echo "7. Rsyncing uploads folders on new server..."
sudo ssh -tt pomepress "rsync -avz /tmp/uploads/* /opt/bitnami/wordpress/wp-content/uploads/"

echo "8. Correcting permissions..."
sudo ssh -tt pomepress "cd /opt/bitnami/wordpress && sudo chown bitnami:daemon -R * && sudo find . -type f -exec chmod 644 {} \;"

echo "Operations completed!"
COMMANDS