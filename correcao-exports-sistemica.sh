#!/bin/bash

echo "🧹 CORREÇÃO SISTÊMICA - REMOVENDO EXPORTS INVÁLIDOS DOS TEMPLATES"
echo "================================================================"

# Lista de arquivos de templates
templates=(
  "src/components/steps/Step01Template.tsx"
  "src/components/steps/Step02Template.tsx" 
  "src/components/steps/Step03Template.tsx"
  "src/components/steps/Step04Template.tsx"
  "src/components/steps/Step05Template.tsx"
  "src/components/steps/Step06Template.tsx"
  "src/components/steps/Step07Template.tsx"
  "src/components/steps/Step08Template.tsx"
  "src/components/steps/Step09Template.tsx"
  "src/components/steps/Step10Template.tsx"
  "src/components/steps/Step11Template.tsx"
  "src/components/steps/Step12Template.tsx"
  "src/components/steps/Step13Template.tsx"
  "src/components/steps/Step14Template.tsx"
  "src/components/steps/Step15Template.tsx"
  "src/components/steps/Step16Template.tsx"
  "src/components/steps/Step17Template.tsx"
  "src/components/steps/Step18Template.tsx"
  "src/components/steps/Step19Template.tsx"
  "src/components/steps/Step20Template.tsx"
  "src/components/steps/Step21Template.tsx"
)

echo "🔍 Verificando e corrigindo ${#templates[@]} templates..."

for template in "${templates[@]}"; do
  if [ -f "$template" ]; then
    echo "📄 Processando: $template"
    
    # Verificar se tem export default Step inválido
    if grep -q "export default Step[0-9]" "$template"; then
      echo "  ❌ Export default Step inválido encontrado - removendo..."
      sed -i '/export default Step[0-9]/d' "$template"
      echo "  ✅ Export inválido removido"
    else
      echo "  ✅ Sem export inválido"
    fi
    
    # Verificar se tem imports React desnecessários APENAS se não for usado
    if grep -q "^import React" "$template"; then
      # Verificar se o React é usado no arquivo
      if ! grep -q "React\." "$template" && ! grep -q "<.*>" "$template"; then
        echo "  🔧 Removendo import React desnecessário..."
        sed -i '/^import React/d' "$template"
        echo "  ✅ Import React removido"
      else
        echo "  ✅ Import React mantido (em uso)"
      fi
    fi
    
    # Verificar se tem imports de hooks desnecessários que foram adicionados manualmente
    if grep -q "useContainerProperties\|useDebounce\|usePerformanceOptimization" "$template"; then
      echo "  🔧 Removendo imports de hooks desnecessários..."
      sed -i '/useContainerProperties\|useDebounce\|usePerformanceOptimization/d' "$template"
      echo "  ✅ Imports de hooks removidos"
    fi
    
    # Garantir que termina apenas com }; sem linhas extras
    if ! tail -1 "$template" | grep -q "^};$"; then
      echo "  🔧 Corrigindo final do arquivo..."
      # Remover linhas vazias do final e garantir que termina com };
      sed -i -e :a -e '/^\s*$/N; ba; s/\n\s*$/\n/' "$template"
      if ! tail -1 "$template" | grep -q "};"; then
        echo "};" >> "$template"
      fi
      echo "  ✅ Final do arquivo corrigido"
    fi
    
    echo "  ✅ $template processado"
    echo ""
  else
    echo "  ❌ $template não encontrado"
  fi
done

echo ""
echo "🔍 VERIFICAÇÃO FINAL:"
echo "==================="

# Verificar se ainda há problemas
problems=0
for template in "${templates[@]}"; do
  if [ -f "$template" ]; then
    if grep -q "export default Step[0-9]" "$template"; then
      echo "❌ $template ainda tem export default Step inválido"
      problems=$((problems + 1))
    fi
    
    if ! grep -q "export const getStep.*Template" "$template"; then
      echo "❌ $template não tem função getStepTemplate"
      problems=$((problems + 1))
    fi
    
    # Verificar se termina corretamente
    if ! tail -1 "$template" | grep -q "^};$"; then
      echo "❌ $template não termina corretamente com };"
      problems=$((problems + 1))
    fi
  fi
done

if [ "$problems" -eq 0 ]; then
  echo "🎉 TODOS OS TEMPLATES CORRIGIDOS!"
  echo ""
  echo "📋 PRÓXIMO PASSO: Verificar se o build funciona"
  echo "npm run build"
else
  echo "⚠️ $problems problemas ainda encontrados"
fi

echo ""
echo "🏁 CORREÇÃO CONCLUÍDA"
