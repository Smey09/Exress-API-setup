#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status

# Ensure NVM is installed
if ! type nvm > /dev/null 2>&1; then
    echo "NVM not found. Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
else
    echo "NVM is already installed."
fi

# Load NVM
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js v20
echo "Installing Node.js v20..."
nvm install 20
nvm use 20
nvm alias default 20

# Install Yarn and PM2
echo "Installing Yarn and PM2..."
npm install -g yarn pm2

# Verify installations
echo "Node.js version:"
node -v
echo "PM2 version:"
pm2 -v
echo "Yarn version:"
yarn -v
