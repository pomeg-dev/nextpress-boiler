#!/bin/bash

# Configuration
POMEG_HOST="pometree"  # Replace with your actual pometree hostname
SERVER_NAME="pomepress" # Replace with your actual server name

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print status messages
print_status() {
    echo -e "${GREEN}[*]${NC} $1"
}

# Function to print error messages
print_error() {
    echo -e "${RED}[!]${NC} $1"
    exit 1
}

# Check if we can connect to pometree
print_status "Attempting to connect to pometree..."
ssh -q -T $POMEG_HOST exit || print_error "Failed to connect to pometree. Check your SSH connection."

# Define the functions that will be used in remote sessions
REMOTE_FUNCTIONS='
print_status() {
    echo -e "\033[0;32m[*]\033[0m $1"
}
print_error() {
    echo -e "\033[0;31m[!]\033[0m $1"
    exit 1
}'

# Main deployment through nested SSH
print_status "Starting WordPress deployment process..."
ssh -T $POMEG_HOST << OUTER_EOF
    # Define functions for first SSH session
    $REMOTE_FUNCTIONS
    
    print_status "Connecting to $SERVER_NAME server..."
    sudo ssh -T $SERVER_NAME << EOF
        # Define functions for second SSH session
        $REMOTE_FUNCTIONS
        
        # Switch to root
        if ! sudo -n true 2>/dev/null; then
            print_error "Sudo requires password, please run with sudo privileges"
        fi
        
        sudo su - << 'INNER_EOF'
            # Define functions for root session
            $REMOTE_FUNCTIONS
            
            cd /root/$SERVER_NAME || exit 1
            
            # Git operations
            print_status "Updating code from repository..."
            git fetch
            git checkout main
            git pull
            
            # Rsync files
            print_status "Syncing files to WordPress directory..."
            rsync -av --progress backend/wordpress/* /opt/bitnami/wordpress/
            
            # Set permissions
            print_status "Setting correct permissions..."
            cd /opt/bitnami/wordpress || exit 1
            chown -R bitnami:daemon .
            find . -type f -exec chmod 644 {} \;
            find . -type d -exec chmod 775 {} \;
            chmod 775 -R wp-content/uploads
            
            print_status "Deployment completed successfully!"
INNER_EOF
EOF
OUTER_EOF

print_status "Script execution completed!"