#!/usr/bin/env sh
# Wrapper — préférer : node scripts/fetch-stitch.mjs
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$ROOT/scripts/fetch-stitch.mjs" "$@"
