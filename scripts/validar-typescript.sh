#!/usr/bin/env bash

# Validação de quantidade de @ts-nocheck em src/
# Falha se ultrapassar o limite configurado

set -euo pipefail

# Permite baseline via arquivo opcional
BASELINE_FILE="scripts/.ts-nocheck-baseline"
if [ -f "$BASELINE_FILE" ]; then
  MAX_TS_NOCHECK=$(cat "$BASELINE_FILE")
else
  MAX_TS_NOCHECK=${MAX_TS_NOCHECK:-50}
fi

# Conta ocorrências somente em src/ (exclui archived/ e client/ se existirem)
CURRENT=$(grep -R -s "@ts-nocheck" src/ 2>/dev/null | wc -l || true)

if [ "$CURRENT" -gt "$MAX_TS_NOCHECK" ]; then
  echo "❌ Falha: $CURRENT arquivos/linhas com @ts-nocheck (limite: $MAX_TS_NOCHECK)"
  exit 1
fi

echo "✅ Validação OK: $CURRENT arquivos/linhas com @ts-nocheck (limite: $MAX_TS_NOCHECK)"
exit 0
