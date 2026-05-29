#!/bin/bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 16
cd /Users/sheyarali/projects/equization
# Node 16 uses OpenSSL 1.1.1 — --openssl-legacy-provider not needed/supported
exec node_modules/.bin/nuxt
