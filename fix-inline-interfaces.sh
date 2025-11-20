#!/bin/bash

echo "🔧 CORREÇÃO DE INTERFACES INLINE"
echo "=================================="
echo ""

fixed_count=0

# Lista de arquivos com definições inline de BlockComponentProps
files_with_inline=(
  "src/components/blocks/simple/SimpleBeforeAfterInlineBlock.tsx"
  "src/components/blocks/simple/SimpleBonusBlock.tsx"
  "src/components/blocks/simple/SimpleConnectedTemplateWrapperBlock.tsx"
  "src/components/blocks/simple/SimpleGuaranteeBlock.tsx"
  "src/components/blocks/simple/SimpleMentorSectionInlineBlock.tsx"
  "src/components/blocks/simple/SimpleResultHeaderInlineBlock.tsx"
  "src/components/blocks/simple/SimpleSecondaryStylesBlock.tsx"
  "src/components/blocks/simple/SimpleSecurePurchaseBlock.tsx"
  "src/components/blocks/simple/SimpleStyleCardInlineBlock.tsx"
  "src/components/blocks/simple/SimpleTestimonialsBlock.tsx"
  "src/components/blocks/simple/SimpleUrgencyTimerInlineBlock.tsx"
  "src/components/blocks/simple/SimpleValueAnchoringBlock.tsx"
  "src/components/editor/blocks/UnifiedBlockWrappers.tsx"
  "src/components/editor/blocks/atomic/QuestionTitleBlock.tsx"
)

for file in "${files_with_inline[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Processando: $file"
    
    # 1. Adicionar import no topo (logo após import React)
    if ! grep -q "import.*InlineBlockProps" "$file"; then
      sed -i "/^import React/a\\import type { InlineBlockProps } from '@/types/InlineBlockProps';" "$file"
      echo "  ✅ Import adicionado"
    fi
    
    # 2. Remover definição inline de BlockComponentProps
    # Remover bloco interface BlockComponentProps { ... }
    sed -i '/^interface BlockComponentProps {/,/^}/d' "$file"
    echo "  ✅ Interface inline removida"
    
    # 3. Substituir React.FC<BlockComponentProps> por React.FC<InlineBlockProps>
    sed -i 's/React\.FC<BlockComponentProps>/React.FC<InlineBlockProps>/g' "$file"
    echo "  ✅ React.FC atualizado"
    
    ((fixed_count++))
    echo ""
  fi
done

echo "=================================="
echo "✅ Total de arquivos corrigidos: $fixed_count"
echo ""
echo "🔍 Verificando erros..."
error_count=$(npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")
echo "Erros TypeScript remanescentes: $error_count"
