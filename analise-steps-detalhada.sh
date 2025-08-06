#!/bin/bash

echo "🎯 ANÁLISE DETALHADA: COMPONENTES USADOS EM CADA STEP"
echo "====================================================="

echo "📊 ANALISANDO COMPONENTES POR STEP..."

# Analisar componentes específicos em cada step
for i in {1..21}; do
    step_num=$(printf "%02d" $i)
    step_file="src/components/steps/Step${step_num}Template.tsx"
    
    if [[ -f "$step_file" ]]; then
        echo -e "\n🔍 STEP $step_num:"
        echo "   📁 Arquivo: $step_file"
        
        # Extrair tipos de componentes
        tipos=$(grep -o '"type": "[^"]*"' "$step_file" 2>/dev/null | cut -d'"' -f4 | sort | uniq)
        
        if [[ -n "$tipos" ]]; then
            echo "   📦 Componentes encontrados:"
            while IFS= read -r tipo; do
                if [[ -n "$tipo" ]]; then
                    echo "      - $tipo"
                fi
            done <<< "$tipos"
        else
            echo "   ❌ Nenhum componente encontrado (pode estar vazio)"
        fi
        
        # Verificar se tem function export
        has_function=$(grep -c "export const getStep${step_num}Template" "$step_file" 2>/dev/null || echo 0)
        if [[ $has_function -gt 0 ]]; then
            echo "   ✅ Tem função de template"
        else
            echo "   ❌ SEM função de template"
        fi
        
        # Verificar tamanho do arquivo
        linhas=$(wc -l < "$step_file" 2>/dev/null || echo 0)
        echo "   📏 Linhas: $linhas"
        
    else
        echo -e "\n❌ STEP $step_num: ARQUIVO NÃO ENCONTRADO"
    fi
done

echo -e "\n🔧 VERIFICANDO REGISTRY DETALHADAMENTE..."
registry_file="src/config/enhancedBlockRegistry.ts"

if [[ -f "$registry_file" ]]; then
    echo "✅ Registry: $registry_file"
    
    echo -e "\n📋 COMPONENTES REGISTRADOS:"
    grep -E 'type.*:.*["\']' "$registry_file" | sed 's/.*type.*:.*["\'\'']\([^"\'\']*\)["\'\'']/   - \1/' | sort | uniq
    
    echo -e "\n📦 IMPORTS NO REGISTRY:"
    grep "^import.*from" "$registry_file" | head -10
    
else
    echo "❌ Registry não encontrado!"
fi

echo -e "\n🎯 ANÁLISE DE COMPATIBILIDADE..."

# Verificar se há problemas específicos
echo "🔍 Procurando por padrões problemáticos..."

for step_file in src/components/steps/Step*Template.tsx; do
    if [[ -f "$step_file" ]]; then
        step_name=$(basename "$step_file" .tsx)
        
        # Procurar por imports problemáticos
        imports_problematicos=$(grep -c "import.*editor.*blocks\|import.*InlineBlock" "$step_file" 2>/dev/null || echo 0)
        if [[ $imports_problematicos -gt 0 ]]; then
            echo "   ⚠️  $step_name: Tem imports problemáticos ($imports_problematicos)"
        fi
        
        # Procurar por componentes não padronizados
        componentes_nao_padrao=$(grep -o '"type": "[^"]*"' "$step_file" 2>/dev/null | grep -v -E "(quiz-intro-header|heading|text|image|options-grid|button|result-card|result-header)" | wc -l)
        if [[ $componentes_nao_padrao -gt 0 ]]; then
            echo "   🔍 $step_name: Componentes não padrão encontrados ($componentes_nao_padrao)"
            grep -o '"type": "[^"]*"' "$step_file" 2>/dev/null | cut -d'"' -f4 | grep -v -E "(quiz-intro-header|heading|text|image|options-grid|button|result-card|result-header)" | sed 's/^/      - /'
        fi
    fi
done

echo -e "\n✅ ANÁLISE COMPLETA!"
