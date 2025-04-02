#!/bin/bash

set -e  # Exit on error
set -x  # Print commands as they're executed

SERVER="pomepress" # Change to pometree server name
DUMP_FILE="/tmp/${SERVER}_remote_uploads_dump.tar.gz"

echo "1. Zipping up UPLOADS DUMP from prod via pometree..."
ssh pometree "
  sudo rm -rf ${DUMP_FILE} &&
  sudo ssh ${SERVER} '
    sudo rm -rf ${DUMP_FILE} && 
    tar -zcvf ${DUMP_FILE} /opt/bitnami/wordpress/wp-content/uploads
  ' &&
  sudo scp ${SERVER}:${DUMP_FILE} /tmp/
"

echo "2. Copying tar down to local..."
scp pometree:${DUMP_FILE} /tmp

echo "3. Unzipping on local..."
mkdir -p /tmp/${SERVER}_uploads_dump && tar -xvpf ${DUMP_FILE} -C /tmp/${SERVER}_uploads_dump
rm -rf ${DUMP_FILE}

echo "4. rsyncing uplaods folders to local wp..."
rsync -avz /tmp/${SERVER}_uploads_dump/opt/bitnami/wordpress/wp-content/uploads/* ../wordpress/wp-content/uploads
rm -rf /tmp/${SERVER}_uploads_dump