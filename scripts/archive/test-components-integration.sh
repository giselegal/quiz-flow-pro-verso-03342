#!/bin/bash
# test-components-integration.sh - Script de verificação da integração dos componentes

echo "🔍 VERIFICANDO INTEGRAÇÃO DOS COMPONENTES INLINE..."
echo

# Navegar para o diretório correto
cd /workspaces/quiz-quest-challenge-verse/src/components/editor/blocks/inline

echo "📋 1. Verificando exports dos componentes:"
for file in *.tsx; do
  if [[ "$file" != "index.ts" ]]; then
    if grep -q "export default" "$file"; then
      echo "   ✅ $file"
    else
      echo "   ❌ $file - SEM EXPORT DEFAULT"
    fi
  fi
done

echo
echo "📋 2. Verificando importações no index.ts:"
export_count=$(grep -c "export.*from" index.ts)
echo "   Total de exports encontrados: $export_count"

echo
echo "📋 3. Verificando mapeamento no UniversalBlockRenderer:"
cd ..
if grep -q "COMPONENT_MAP" UniversalBlockRenderer.tsx; then
  echo "   ✅ COMPONENT_MAP encontrado"
  component_map_count=$(grep -c "'.*':" UniversalBlockRenderer.tsx)
  echo "   Total de componentes mapeados: $component_map_count"
else
  echo "   ❌ COMPONENT_MAP não encontrado - IMPLEMENTAR"
fi

echo
echo "📋 4. Verificando stepTemplateService:"
cd ../../../services
if grep -q "getStepTemplate" stepTemplateService.ts; then
  echo "   ✅ stepTemplateService funcional"
  step_count=$(grep -c "getStep.*Template" stepTemplateService.ts)
  echo "   Total de templates de etapa: $step_count"
else
  echo "   ❌ stepTemplateService com problemas"
fi

echo
echo "📋 5. Verificando componentes críticos (Etapas 1-5):"
cd ../components/editor/blocks/inline
critical_components=(
  "QuizStartPageInlineBlock.tsx"
  "QuizPersonalInfoInlineBlock.tsx" 
  "QuizExperienceInlineBlock.tsx"
  "QuizQuestionInlineBlock.tsx"
  "TextInlineBlock.tsx"
)

for component in "${critical_components[@]}"; do
  if [[ -f "$component" ]] && grep -q "export default" "$component"; then
    echo "   ✅ $component"
  else
    echo "   ❌ $component - CRÍTICO"
  fi
done

echo
echo "📋 6. Verificando novos componentes implementados:"
new_components=(
  "CharacteristicsListInlineBlock.tsx"
  "SecondaryStylesInlineBlock.tsx"
  "StyleCharacteristicsInlineBlock.tsx"
)

for component in "${new_components[@]}"; do
  if [[ -f "$component" ]] && grep -q "export default" "$component"; then
    echo "   ✅ $component - NOVO"
  else
    echo "   ❌ $component - FALHOU"
  fi
done

echo
echo "🎯 RESUMO DA VERIFICAÇÃO:"
echo "   - Total de componentes inline: $(ls *.tsx | wc -l)"
echo "   - Componentes com export: $(find . -name "*.tsx" -exec grep -l "export default" {} \; | wc -l)"
echo "   - Componentes mapeados no renderer: $component_map_count"

echo
echo "✨ PRÓXIMOS PASSOS:"
echo "   1. Executar servidor: npm run dev"
echo "   2. Abrir editor: http://localhost:3000/editor"
echo "   3. Testar navegação entre etapas 1-5"
echo "   4. Verificar renderização dos componentes"

echo
echo "🚀 VERIFICAÇÃO CONCLUÍDA!"
