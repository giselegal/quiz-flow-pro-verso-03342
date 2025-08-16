#!/bin/bash

echo "🧹 CORREÇÃO EM LOTE COMPLETA - FORMATAÇÃO PRETTIER DOS TEMPLATES"
echo "================================================================"

# Lista de templates
templates=(
  "Step01Template.tsx"
  "Step02Template.tsx" 
  "Step03Template.tsx"
  "Step04Template.tsx"
  "Step05Template.tsx"
  "Step06Template.tsx"
  "Step07Template.tsx"
  "Step08Template.tsx"
  "Step09Template.tsx"
  "Step10Template.tsx"
  "Step11Template.tsx"
  "Step12Template.tsx"
  "Step13Template.tsx"
  "Step14Template.tsx"
  "Step15Template.tsx"
  "Step16Template.tsx"
  "Step17Template.tsx"
  "Step18Template.tsx"
  "Step19Template.tsx"
  "Step20Template.tsx"
  "Step21Template.tsx"
)

cd src/components/steps/

echo "🔧 1. Removendo todos os 'export default Step' dos templates..."
find . -name "Step*Template.tsx" -exec sed -i '/export default Step/d' {} \;

echo "🔧 2. Removendo linhas vazias no final dos arquivos..."
find . -name "Step*Template.tsx" -exec sed -i -e :a -e '/^\s*$/N; ba; s/\n\s*$/\n/' {} \;

echo "🔧 3. Garantindo que todos terminam apenas com }; ..."
for template in "${templates[@]}"; do
    if [ -f "$template" ]; then
        echo "  📄 Processando: $template"
        
        # Garantir que termina com }; apenas
        if ! tail -1 "$template" | grep -q "^};$"; then
            echo "    🔧 Corrigindo final..."
            # Remover linha vazia do final se houver
            sed -i '$ { /^[[:space:]]*$/ d; }' "$template"
            # Garantir que a última linha seja };
            if ! tail -1 "$template" | grep -q "};"; then
                echo "};" >> "$template"
            fi
        fi
        
        # Remover imports desnecessários adicionados por erro
        sed -i '/^import.*useContainerProperties\|useDebounce\|usePerformanceOptimization/d' "$template"
        sed -i '/^import.*useIsMobile/d' "$template"
        
        # Remover React import se não for usado
        if grep -q "^import React" "$template"; then
            if ! grep -q "React\." "$template" && ! grep -q "<.*>" "$template"; then
                sed -i '/^import React/d' "$template"
            fi
        fi
        
        echo "    ✅ $template processado"
    fi
done

echo ""
echo "🔍 4. Verificação final..."
problems=0

for template in "${templates[@]}"; do
    if [ -f "$template" ]; then
        # Verificar se tem export default Step inválido
        if grep -q "export default Step" "$template"; then
            echo "❌ $template ainda tem export default Step inválido"
            problems=$((problems + 1))
        fi
        
        # Verificar se tem getStepTemplate
        if ! grep -q "export const getStep.*Template" "$template"; then
            echo "❌ $template não tem função getStepTemplate"
            problems=$((problems + 1))
        fi
        
        # Verificar final do arquivo
        if ! tail -1 "$template" | grep -q "^};$"; then
            echo "❌ $template não termina corretamente"
            problems=$((problems + 1))
        fi
        
        # Verificar se tem linhas vazias excessivas
        empty_lines=$(tail -5 "$template" | grep -c "^[[:space:]]*$" || true)
        if [ "$empty_lines" -gt 0 ]; then
            echo "⚠️ $template tem linhas vazias desnecessárias no final"
        fi
    fi
done

if [ "$problems" -eq 0 ]; then
    echo "🎉 TODOS OS TEMPLATES CORRIGIDOS E FORMATADOS!"
else
    echo "⚠️ $problems problemas encontrados"
fi

echo ""
echo "🏁 CORREÇÃO EM LOTE CONCLUÍDA"
