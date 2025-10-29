#!/bin/bash
echo "=== TIPOS DE BLOCOS USADOS NOS JSONs ==="
echo

# Coletar todos os tipos únicos de todos os steps
ALL_TYPES=$(for i in {01..21}; do
  if [ "$i" = "12" ]; then
    i="12"
  fi
  cat "public/templates/blocks/step-$i.json" 2>/dev/null | jq -r '.blocks[]?.type' 2>/dev/null
done | sort -u)

echo "Tipos únicos encontrados nos JSONs:"
echo "$ALL_TYPES"
echo
echo "=== VERIFICANDO SUPORTE NO renderBlockPreview ==="
echo

MISSING=()
while IFS= read -r type; do
  if [ -n "$type" ]; then
    # Buscar se o tipo está implementado no renderBlockPreview
    if ! grep -q "type === '$type'" src/components/editor/quiz/QuizModularProductionEditor.tsx 2>/dev/null; then
      MISSING+=("$type")
    fi
  fi
done <<< "$ALL_TYPES"

if [ ${#MISSING[@]} -eq 0 ]; then
  echo "✅ TODOS OS TIPOS ESTÃO IMPLEMENTADOS!"
else
  echo "❌ TIPOS NÃO IMPLEMENTADOS (${#MISSING[@]}):"
  echo
  for type in "${MISSING[@]}"; do
    echo "  - $type"
  done
fi
