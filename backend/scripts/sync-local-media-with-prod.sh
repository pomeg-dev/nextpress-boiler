#!/bin/bash

set -e  # Exit on error

PROD_SERVER="[SITENAME]"
POMETREE="pometree"
DIR="$( cd "$( dirname "$0" )" && pwd )"
LOCAL_UPLOADS="${DIR}/../wordpress/wp-content/uploads/"
POMETREE_TEMP="/tmp/[SITENAME]_uploads_sync/"

# Function to check if previous command succeeded
check_error() {
    if [ $? -ne 0 ]; then
        echo "Error: $1"
        exit 1
    fi
}

echo "1. Setting up temporary directory on pometree..."
ssh ${POMETREE} "mkdir -p ${POMETREE_TEMP} && sudo chown -R \$(whoami): ${POMETREE_TEMP}"
check_error "Failed to create temp directory on pometree"

echo "2. Rsyncing uploads from local to pometree (with compression and fast cipher)..."
rsync -avz --progress --delete \
    -e "ssh -c aes128-ctr -o Compression=no" \
    ${LOCAL_UPLOADS} \
    ${POMETREE}:${POMETREE_TEMP}
check_error "Failed to rsync to pometree"

echo "3. Setting permissions on destination server..."
ssh ${POMETREE} "sudo ssh ${PROD_SERVER} 'sudo chmod -R 777 /opt/bitnami/wordpress/wp-content/uploads/* 2>/dev/null'" || true

echo "4. Rsyncing from pometree to production server..."
ssh ${POMETREE} "sudo rsync -avz --progress --delete \
    -e 'ssh -o StrictHostKeyChecking=no' \
    ${POMETREE_TEMP} \
    ${PROD_SERVER}:/opt/bitnami/wordpress/wp-content/uploads/"
check_error "Failed to rsync to production server"

echo "5. Correcting ownership and permissions on production server..."
ssh ${POMETREE} "sudo ssh ${PROD_SERVER} 'cd /opt/bitnami/wordpress/wp-content && sudo chown -R bitnami:daemon uploads && sudo find uploads -type d -exec chmod 775 {} \; && sudo find uploads -type f -exec chmod 664 {} \;'"
check_error "Failed to set permissions on production"

echo "6. Cleanup on pometree..."
ssh ${POMETREE} "sudo rm -rf ${POMETREE_TEMP}"
check_error "Failed to cleanup on pometree"

echo "Done! Local uploads have been synced to production using rsync."