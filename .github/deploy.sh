#!/usr/bin/env bash
# Nahraje na hosting přes SFTP jen soubory změněné od posledního nasazení.
# Poslední nasazený commit je uložený na serveru v souboru .deploy-sha.
# Bez něj (první běh) se nahraje celý web.
set -euo pipefail

: "${SFTP_HOST:?}" "${SFTP_USER:?}" "${LFTP_PASSWORD:?}" "${REMOTE_DIR:?}"

# Co na server nepatří.
EXCLUDE_RE='^(\.git|\.github/|\.claude/|\.vscode/|node_modules/)|\.md$'

run_lftp() {
  {
    echo "set sftp:auto-confirm yes"
    echo "set net:max-retries 3"
    echo "set net:timeout 30"
    echo "open --env-password -u \"$SFTP_USER\" sftp://$SFTP_HOST"
    cat
    echo "bye"
  } > /tmp/cmds.lftp
  lftp -f /tmp/cmds.lftp
}

quote() { printf '"%s"' "${1//\"/\\\"}"; }

prev=$(echo "cat $REMOTE_DIR/.deploy-sha" | run_lftp 2>/dev/null | tr -d '[:space:]' || true)

if [[ -n "$prev" ]] && git cat-file -e "$prev^{commit}" 2>/dev/null; then
  echo "Poslední nasazení: $prev → nahrávám změny do $GITHUB_SHA"
  mapfile -t changed < <(git diff --no-renames --name-only --diff-filter=ACMT "$prev" HEAD | grep -Ev "$EXCLUDE_RE" || true)
  mapfile -t deleted < <(git diff --no-renames --name-only --diff-filter=D "$prev" HEAD | grep -Ev "$EXCLUDE_RE" || true)
  echo "Nahrát: ${#changed[@]}, smazat: ${#deleted[@]}"
  printf '  + %s\n' "${changed[@]}"
  printf '  - %s\n' "${deleted[@]}"
  {
    for f in "${changed[@]}"; do
      [[ -z "$f" ]] && continue
      dir=$(dirname "$f")
      [[ "$dir" != "." ]] && echo "mkdir -p -f $(quote "$REMOTE_DIR/$dir")"
      echo "put $(quote "$f") -o $(quote "$REMOTE_DIR/$f")"
    done
    for f in "${deleted[@]}"; do
      [[ -z "$f" ]] && continue
      echo "rm -f $(quote "$REMOTE_DIR/$f")"
    done
  } | run_lftp
else
  echo "Žádné předchozí nasazení nenalezeno → nahrávám celý web do $REMOTE_DIR"
  echo "mirror -R --verbose --no-perms -x '^\.git' -x '^\.claude/' -x '^\.vscode/' -x '^node_modules/' -x '\.md$' ./ $(quote "$REMOTE_DIR")" | run_lftp
fi

echo "$GITHUB_SHA" > /tmp/.deploy-sha
echo "put /tmp/.deploy-sha -o $(quote "$REMOTE_DIR/.deploy-sha")" | run_lftp
echo "Hotovo."
