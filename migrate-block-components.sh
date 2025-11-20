#!/bin/bash
# migrate-block-components.sh
# Script para migrar componentes de BlockComponentProps para InlineBlockProps

set -e

echo "🚀 Iniciando migração em massa de componentes..."
echo ""

# Diretórios a migrar
DIRS=(
  "src/components/editor/blocks"
  "src/components/blocks/quiz"
  "src/components/core/modules"
  "src/components/blocks"
)

TOTAL_FILES=0
MIGRATED_FILES=0

for dir in "${DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "⚠️  Diretório não encontrado: $dir"
    continue
  fi
  
  echo "📁 Processando: $dir"
  
  # Encontrar todos os arquivos .tsx
  while IFS= read -r -d '' file; do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    CHANGED=false
    
    # 1. Substituir import
    if grep -q "import type { BlockComponentProps } from '@/types/blocks'" "$file"; then
      sed -i "s/import type { BlockComponentProps } from '@\/types\/blocks'/import type { InlineBlockProps } from '@\/types\/InlineBlockProps'/g" "$file"
      CHANGED=true
    fi
    
    if grep -q "import { BlockComponentProps } from '@/types/blocks'" "$file"; then
      sed -i "s/import { BlockComponentProps } from '@\/types\/blocks'/import { InlineBlockProps } from '@\/types\/InlineBlockProps'/g" "$file"
      CHANGED=true
    fi
    
    # 2. Substituir extends
    if grep -q "extends BlockComponentProps" "$file"; then
      sed -i "s/extends BlockComponentProps/extends InlineBlockProps/g" "$file"
      CHANGED=true
    fi
    
    # 3. Substituir React.FC<BlockComponentProps>
    if grep -q "React.FC<BlockComponentProps>" "$file"; then
      sed -i "s/React\.FC<BlockComponentProps>/React.FC<InlineBlockProps>/g" "$file"
      CHANGED=true
    fi
    
    # 4. Substituir FC<BlockComponentProps>
    if grep -q "FC<BlockComponentProps>" "$file"; then
      sed -i "s/FC<BlockComponentProps>/FC<InlineBlockProps>/g" "$file"
      CHANGED=true
    fi
    
    if [ "$CHANGED" = true ]; then
      MIGRATED_FILES=$((MIGRATED_FILES + 1))
      echo "  ✅ $(basename "$file")"
    fi
    
  done < <(find "$dir" -maxdepth 3 -name "*.tsx" -print0)
done

echo ""
echo "📊 Resumo da Migração:"
echo "  Total de arquivos processados: $TOTAL_FILES"
echo "  Arquivos migrados: $MIGRATED_FILES"
echo ""

if [ $MIGRATED_FILES -gt 0 ]; then
  echo "✅ Migração concluída com sucesso!"
  echo ""
  echo "🔍 Próximos passos:"
  echo "  1. Executar: npm run typecheck"
  echo "  2. Corrigir manualmente verificações null em block.properties"
  echo "  3. Testar no navegador"
else
  echo "ℹ️  Nenhum arquivo precisou ser migrado."
fi

exit 0
