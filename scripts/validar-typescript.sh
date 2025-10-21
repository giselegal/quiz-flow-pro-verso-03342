#!/usr/bin/env bash

# Validação de quantidade de @ts-nocheck em src/
# Falha se ultrapassar o limite configurado

set -euo pipefail

MAX_TS_NOCHECK=${MAX_TS_NOCHECK:-50}

# Conta ocorrências somente em src/ (exclui archived/ e client/ se existirem)
CURRENT=$(grep -R "@ts-nocheck" src/ | wc -l || true)

if [ "$CURRENT" -gt "$MAX_TS_NOCHECK" ]; then
  echo "❌ Falha: $CURRENT arquivos/linhas com @ts-nocheck (limite: $MAX_TS_NOCHECK)"
  exit 1
fi

echo "✅ Validação OK: $CURRENT arquivos/linhas com @ts-nocheck (limite: $MAX_TS_NOCHECK)"
exit 0
