#!/bin/bash
# Start the Nuxt 2 dev server.
#
# Nuxt 2 / webpack 4 requires OpenSSL legacy provider because it uses
# the now-removed MD4 hash.  Strategy:
#   • If nvm is available and Node 16/18 is installed → use it (cleanest)
#   • Otherwise pass --openssl-legacy-provider directly to the node binary
#     (works on Node 17-21; on Node 22+ this flag may be ignored but the
#      direct invocation still avoids the NODE_OPTIONS restriction)

export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"

cd /Users/sheyarali/projects/equization

# Prefer Node 18 LTS → 16 → whatever is available
if nvm use 18 --silent 2>/dev/null; then
  exec node_modules/.bin/nuxt
elif nvm use 16 --silent 2>/dev/null; then
  exec node_modules/.bin/nuxt
else
  # Node 22+/24: pass flag directly (NODE_OPTIONS is blocked for this flag)
  exec node --openssl-legacy-provider node_modules/.bin/nuxt
fi
