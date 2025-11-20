#!/bin/bash

echo "🔒 CORREÇÃO DE DESTRUCTURING DE block.properties"
echo "================================================"
echo ""

fixed_count=0

# Arquivos que desestruturaram block.properties diretamente
files_to_fix=(
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
)

for file in "${files_to_fix[@]}"; do
  if [ -f "$file" ]; then
    # Verificar se o arquivo tem destructuring direto de block.properties
    if grep -q "} = block\.properties" "$file" 2>/dev/null; then
      echo "📝 Corrigindo: $file"
      
      # Adicionar linha const props = block.properties || {} ANTES de destructuring
      # Padrão a procurar: } = block.properties;
      # Substituir por:
      #   const props = block.properties || {};
      #   } = props;
      
      sed -i 's/} = block\.properties;/} = block.properties || {};/g' "$file"
      
      echo "  ✅ Null safety adicionado"
      ((fixed_count++))
    fi
  fi
done

echo ""
echo "================================================"
echo "✅ Total de arquivos corrigidos: $fixed_count"
echo ""
echo "🔍 Verificando erros..."
error_count=$(npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")
echo "Erros TypeScript remanescentes: $error_count"
