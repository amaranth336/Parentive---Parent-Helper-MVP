#!/usr/bin/env bash
# Start the Parentive Next.js dev server if it is not already listening,
# wait until it accepts HTTP, then return. Optional --follow tails logs.
#
# Cursor Cloud Agent browser preview (Chrome error -102 / ERR_CONNECTION_REFUSED)
# happens when nothing is bound on port 3000, or when the process is bound only
# to loopback and the preview proxy connects via the pod IP. This script binds
# 0.0.0.0 and is safe to run from both `start` and `terminals`.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

HOST="${PARENTIVE_DEV_HOST:-0.0.0.0}"
PORT="${PORT:-3000}"
LOG="${PARENTIVE_DEV_LOG:-/tmp/parentive-dev.log}"
URL="http://127.0.0.1:${PORT}/"
FOLLOW=0

if [[ "${1:-}" == "--follow" ]]; then
  FOLLOW=1
fi

ready() {
  curl -sf -o /dev/null --max-time 2 "$URL"
}

if ready; then
  echo "Parentive already listening on :${PORT}"
else
  if [[ ! -x node_modules/.bin/next ]]; then
    echo "Parentive: next is not installed. Run npm ci first." >&2
    exit 1
  fi
  echo "Starting Next.js on ${HOST}:${PORT}..."
  : >"$LOG"
  nohup npm run dev >>"$LOG" 2>&1 &
  echo $! > /tmp/parentive-dev.pid
  for i in $(seq 1 90); do
    if ready; then
      echo "Parentive ready on :${PORT}"
      break
    fi
    if ! kill -0 "$(cat /tmp/parentive-dev.pid)" 2>/dev/null; then
      echo "Parentive: npm run dev exited before becoming ready" >&2
      tail -n 80 "$LOG" >&2 || true
      exit 1
    fi
    if [[ "$i" -eq 90 ]]; then
      echo "Parentive failed to become ready on :${PORT}" >&2
      tail -n 80 "$LOG" >&2 || true
      exit 1
    fi
    sleep 1
  done
fi

if [[ "$FOLLOW" -eq 1 ]]; then
  touch "$LOG"
  exec tail -n +1 -F "$LOG"
fi
