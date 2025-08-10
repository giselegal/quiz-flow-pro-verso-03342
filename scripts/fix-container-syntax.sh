#!/bin/bash

# Script para corrigir sintaxe dos containerClasses após otimização em lote

echo "🔧 Corrigindo sintaxe dos containerClasses..."

# Função para corrigir sintaxe de um componente
fix_component_syntax() {
  local component=$1
  local file="src/components/funnel-blocks/${component}.tsx"
  
  if [ -f "$file" ]; then
    echo "🔧 Corrigindo sintaxe: $component"
    
    # Criar arquivo temporário para as correções
    temp_file=$(mktemp)
    
    # Aplicar correções usando node script
    node -e "
      const fs = require('fs');
      let content = fs.readFileSync('$file', 'utf8');
      
      // Corrigir containerClasses com getOptimizedContainerClasses
      content = content.replace(
        /const containerClasses = getOptimizedContainerClasses\(deviceView, \"tight\", \"full\", \`[^}]+?\`\.trim\(\);/gs,
        'const containerClasses = getOptimizedContainerClasses(deviceView, \"tight\", \"full\", className);'
      );
      
      // Corrigir outros padrões problemáticos
      content = content.replace(
        /const containerClasses = getOptimizedContainerClasses\([^;]+;/gs,
        'const containerClasses = getOptimizedContainerClasses(deviceView || \"desktop\", \"tight\", \"full\", className);'
      );
      
      fs.writeFileSync('$temp_file', content);
    "
    
    # Substituir arquivo original
    mv "$temp_file" "$file"
    
    echo "✅ $component corrigido"
  fi
}

# Lista de componentes para corrigir
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

# Corrigir sintaxe de todos os componentes
for component in "${components[@]}"; do
  fix_component_syntax "$component"
done

echo ""
echo "✅ Sintaxe corrigida para todos os componentes!"
echo "🎯 Todos os componentes agora usam:"
echo "   getOptimizedContainerClasses(deviceView, \"tight\", \"full\", className)"
