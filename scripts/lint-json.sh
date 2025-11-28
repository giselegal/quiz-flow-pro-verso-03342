#!/usr/bin/env bash
set -euo pipefail

# Linta todos os arquivos .json verificando sintaxe com jq
# Falha se qualquer arquivo tiver JSON inválido

shopt -s globstar nullglob

FAILED=0
for f in **/*.json; do
  # Ignorar node_modules e dist
  if [[ "$f" == node_modules/* || "$f" == dist/* ]]; then
    continue
  fi
  if ! jq -e . "$f" >/dev/null 2>&1; then
    echo "❌ JSON inválido: $f"
    FAILED=1
  fi
done

if [[ $FAILED -eq 1 ]]; then
  echo "\n⚠️  Erros de sintaxe JSON encontrados."
  exit 1
fi

echo "✅ Todos os JSONs válidos."