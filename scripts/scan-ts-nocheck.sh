#!/usr/bin/env bash
set -euo pipefail

# Escaneia o uso de @ts-nocheck/@ts-ignore no código "ativo"
# Ignora pastas de arquivados/backup e testes
# Gera relatório em tmp/ts_nocheck_live.txt

ROOT_DIR="$(cd "$(dirname "$0")"/.. && pwd)"
OUT_DIR="$ROOT_DIR/tmp"
OUT_FILE="$OUT_DIR/ts_nocheck_live.txt"
mkdir -p "$OUT_DIR"

INCLUDE_DIRS=("src")
EXCLUDE_PATTERNS=(
  "/archived/"
  "/archived-legacy-editors/"
  "/archived-examples/"
  "/archived/dead-code"
  "/archived/dead-code-obvious"
  "/__tests__/"
  "/tests/"
  "/test/"
  "/dist/"
)

matches=0
> "$OUT_FILE"
for dir in "${INCLUDE_DIRS[@]}"; do
  while IFS= read -r file; do
    # Aplicar exclusões
    skip=false
    for ex in "${EXCLUDE_PATTERNS[@]}"; do
      if [[ "$file" == *"$ex"* ]]; then
        skip=true
        break
      fi
    done
    $skip && continue

    if grep -Eq "@ts-nocheck|@ts-ignore" "$file"; then
      rel=".${file#"$ROOT_DIR"}"
      echo "$rel" >> "$OUT_FILE"
      matches=$((matches+1))
    fi
  done < <(find "$ROOT_DIR/$dir" -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null)
done

echo "🔎 Arquivos com supressão TS (ativos): $matches"
echo "📝 Relatório: $OUT_FILE"
