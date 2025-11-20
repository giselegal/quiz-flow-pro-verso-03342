#!/bin/bash

echo "🧹 LIMPEZA DE IMPORTS DUPLICADOS"
echo "================================="
echo ""

fixed_count=0

# Arquivos com imports duplicados
files_with_dupes=(
  "src/components/editor/fallback/Step20EditorFallback.tsx"
  "src/components/editor/modules/Step20SystemSelector.tsx"
  "src/components/editor/blocks/UnifiedBlockWrappers.tsx"
)

for file in "${files_with_dupes[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Limpando: $file"
    
    # Criar arquivo temporário
    temp_file="${file}.tmp"
    
    # Remover imports duplicados mantendo apenas o primeiro
    awk '!seen[$0]++' "$file" > "$temp_file"
    
    # Substituir arquivo original
    mv "$temp_file" "$file"
    
    echo "  ✅ Duplicados removidos"
    ((fixed_count++))
  fi
done

echo ""
echo "================================="
echo "✅ Total de arquivos limpos: $fixed_count"
echo ""
echo "🔍 Verificando erros..."
error_count=$(npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")
echo "Erros TypeScript remanescentes: $error_count"
