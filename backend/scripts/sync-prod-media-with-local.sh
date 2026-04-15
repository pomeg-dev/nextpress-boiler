#!/bin/bash

set -e  # Exit on error
set -x  # Print commands as they're executed

PROD_SERVER="[SITENAME]"
POMETREE="pometree"
DIR="$( cd "$( dirname "$0" )" && pwd )"
DUMP_FILE="/tmp/${PROD_SERVER}_remote_uploads_dump.tar.gz"

# Function to check if previous command succeeded
check_error() {
    if [ $? -ne 0 ]; then
        echo "Error: $1"
        exit 1
    fi
}

echo "1. Creating uploads archive on production server..."
ssh ${POMETREE} "sudo ssh ${PROD_SERVER} 'sudo rm -rf ${DUMP_FILE} && cd /opt/bitnami/wordpress/wp-content && sudo tar -zcvf ${DUMP_FILE} uploads'"
check_error "Failed to create archive on production server"

echo "2. Copying archive from production to pometree..."
ssh ${POMETREE} "sudo scp ${PROD_SERVER}:${DUMP_FILE} ${DUMP_FILE}"
check_error "Failed to copy archive to pometree"

echo "3. Copying archive from pometree to local..."
scp ${POMETREE}:${DUMP_FILE} /tmp/
check_error "Failed to copy archive to local"

echo "4. Extracting uploads to local Docker wp-content..."
cd ${DIR}/../wordpress/wp-content
rm -rf /tmp/${PROD_SERVER}_uploads_temp
mkdir -p /tmp/${PROD_SERVER}_uploads_temp
tar -xzf /tmp/${DUMP_FILE} -C /tmp/${PROD_SERVER}_uploads_temp
check_error "Failed to extract archive"

echo "5. Syncing uploads to local WordPress..."
rsync -avz --delete /tmp/${PROD_SERVER}_uploads_temp/uploads/ ${DIR}/../wordpress/wp-content/uploads/
check_error "Failed to sync uploads"

echo "6. Cleanup..."
rm -rf /tmp/${DUMP_FILE}
rm -rf /tmp/${PROD_SERVER}_uploads_temp
ssh ${POMETREE} "rm -f ${DUMP_FILE}"
ssh ${POMETREE} "sudo ssh ${PROD_SERVER} 'sudo rm -f ${DUMP_FILE}'"

echo "Done! Production uploads have been synced to local."