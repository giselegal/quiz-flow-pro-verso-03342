#!/bin/bash

# Script para aplicar configurações de container otimizadas em lote
# Maximiza aproveitamento de espaço e minimiza padding

echo "🚀 Aplicando configurações de container otimizadas em lote..."

# Array com todos os componentes funnel-blocks
components=(
  "IntroPage"
  "SalesOffer" 
  "FAQSection"
  "GuaranteeSection"
  "LoadingTransition"
  "SocialProof"
  "QuizQuestion"
  "TestimonialsGrid"
  "VideoSection"
  "FeatureHighlight"
  "BeforeAfterSection"
  "BonusSection"
  "MentorSection"
  "MotivationSection"
  "PriceComparison"
  "StyleResultDisplay"
  "PrimaryStyleDisplay"
  "StrategicQuestion"
  "QuizTransition"
)

# Função para aplicar otimizações em um componente
optimize_component() {
  local component=$1
  local file="src/components/funnel-blocks/${component}.tsx"
  
  if [ -f "$file" ]; then
    echo "⚡ Otimizando: $component"
    
    # Backup do arquivo original
    cp "$file" "${file}.backup"
    
    # 1. Adicionar import da configuração otimizada no topo
    if ! grep -q "getOptimizedContainerClasses" "$file"; then
      sed -i '1i import { getOptimizedContainerClasses } from "@/config/containerConfig";' "$file"
    fi
    
    # 2. Substituir containerClasses por versão otimizada
    sed -i 's/const containerClasses = `/const containerClasses = getOptimizedContainerClasses(deviceView, "tight", "full", `/g' "$file"
    
    # 3. Remover paddings excessivos
    sed -i 's/px-12 py-12/px-4 py-2/g' "$file"
    sed -i 's/px-8 py-8/px-3 py-2/g' "$file"
    sed -i 's/px-4 py-6/px-2 py-1/g' "$file"
    
    # 4. Maximizar largura
    sed -i 's/max-w-4xl/max-w-full/g' "$file"
    sed -i 's/max-w-6xl/max-w-full/g' "$file"
    
    # 5. Reduzir espaçamentos
    sed -i 's/space-y-8/space-y-2/g' "$file"
    sed -i 's/space-y-6/space-y-2/g' "$file"
    sed -i 's/space-y-4/space-y-2/g' "$file"
    
    echo "✅ $component otimizado"
  else
    echo "⚠️  Arquivo não encontrado: $file"
  fi
}

# Aplicar otimizações em todos os componentes
for component in "${components[@]}"; do
  optimize_component "$component"
done

echo ""
echo "🎯 Aplicando otimizações específicas no EditorCanvas..."

# Otimizar EditorCanvas (já foi feito, mas garantir)
canvas_file="src/components/editor/canvas/EditorCanvas.tsx"
if [ -f "$canvas_file" ]; then
  # Garantir que viewport usa max-w-full
  sed -i 's/max-w-4xl/max-w-full/g' "$canvas_file"
  sed -i 's/max-w-md/max-w-full/g' "$canvas_file"
  sed -i 's/max-w-sm/max-w-full/g' "$canvas_file"
  echo "✅ EditorCanvas otimizado"
fi

echo ""
echo "🎯 Aplicando otimizações em blocos inline..."

# Otimizar blocos inline
inline_blocks=(
  "TextInlineBlock"
  "ImageDisplayInlineBlock"
  "ButtonInlineBlock"
)

for block in "${inline_blocks[@]}"; do
  block_file="src/components/editor/blocks/inline/${block}.tsx"
  if [ -f "$block_file" ]; then
    echo "⚡ Otimizando bloco inline: $block"
    
    # Reduzir margins e paddings
    sed -i 's/margin: 16px/margin: 4px/g' "$block_file"
    sed -i 's/padding: 16px/padding: 4px/g' "$block_file"
    sed -i 's/space-y-4/space-y-1/g' "$block_file"
    
    echo "✅ $block otimizado"
  fi
done

echo ""
echo "🔧 Criando backup dos arquivos modificados..."

# Criar diretório de backup se não existir
mkdir -p backups/container-optimization

# Mover todos os backups para o diretório
find src -name "*.backup" -exec mv {} backups/container-optimization/ \;

echo ""
echo "✅ CONCLUÍDO!"
echo "📋 Resumo das otimizações aplicadas:"
echo "   • Padding mínimo: px-2 py-1 (mobile) até px-4 py-2 (desktop)"
echo "   • Largura máxima: max-w-full para todos os componentes"
echo "   • Espaçamento reduzido: space-y-2 entre elementos"
echo "   • Containers centralizados com mx-auto"
echo "   • Configuração global importada automaticamente"
echo ""
echo "🔒 Backups salvos em: backups/container-optimization/"
echo "💡 Para reverter: cp backups/container-optimization/ARQUIVO.backup src/caminho/ARQUIVO"
