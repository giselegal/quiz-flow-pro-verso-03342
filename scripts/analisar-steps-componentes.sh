#!/bin/bash

echo "🔍 ANÁLISE DOS COMPONENTES NOS STEP TEMPLATES"
echo "============================================="

# Lista de componentes corretos no diretório consolidado
COMPONENTES_CORRETOS=(
    "quiz-intro-header"
    "decorative-bar-inline" 
    "text-inline"
    "image-display-inline"
    "form-input"
    "button-inline"
    "legal-notice-inline"
    "heading"
    "text"
    "image"
    "options-grid"
    "button"
    "result-card"
    "result-header"
)

echo "✅ Componentes corretos esperados:"
for comp in "${COMPONENTES_CORRETOS[@]}"; do
    echo "   - $comp"
done

echo -e "\n📋 ANALISANDO STEPS..."

# Contar total de steps
total_steps=$(ls src/components/steps/Step*Template.tsx 2>/dev/null | wc -l)
echo "📊 Total de steps encontrados: $total_steps"

# Verificar steps de 01 a 21 especificamente
echo -e "\n🔍 VERIFICANDO EXISTÊNCIA DOS STEPS 01-21:"
for i in {1..21}; do
    step_num=$(printf "%02d" $i)
    step_file="src/components/steps/Step${step_num}Template.tsx"
    if [[ -f "$step_file" ]]; then
        echo "   ✅ Step$step_num - Existe"
    else
        echo "   ❌ Step$step_num - AUSENTE"
    fi
done

problemas_encontrados=0
steps_corretos=0
components_problematicos=()

# Analisar cada step (todos os encontrados)
for step_file in src/components/steps/Step*Template.tsx; do
    if [[ -f "$step_file" ]]; then
        step_name=$(basename "$step_file" .tsx)
        echo -e "\n🔍 Analisando: $step_name"
        
        # Extrair tipos de componentes usados no step
        tipos_encontrados=$(grep -o '"type": "[^"]*"' "$step_file" | cut -d'"' -f4 | sort | uniq)
        
        echo "   📦 Componentes usados:"
        
        tem_problema=false
        while IFS= read -r tipo; do
            if [[ -n "$tipo" ]]; then
                echo "      - $tipo"
                
                # Verificar se é um componente correto
                if [[ ! " ${COMPONENTES_CORRETOS[@]} " =~ " ${tipo} " ]]; then
                    echo "         ❌ PROBLEMA: Componente '$tipo' pode não estar correto"
                    tem_problema=true
                    ((problemas_encontrados++))
                    
                    # Adicionar à lista de componentes problemáticos
                    if [[ ! " ${components_problematicos[@]} " =~ " ${tipo} " ]]; then
                        components_problematicos+=("$tipo")
                    fi
                fi
            fi
        done <<< "$tipos_encontrados"
        
        if [[ "$tem_problema" == false ]]; then
            echo "   ✅ Step está usando componentes corretos"
            ((steps_corretos++))
        else
            echo "   ⚠️  Step tem problemas de componentes"
        fi
        
        # Verificar se usa componentes inline antigos (que podem ter sido movidos)
        componentes_inline_antigos=$(grep -c "InlineBlock\|Block\|Editor" "$step_file" 2>/dev/null || echo 0)
        if [[ $componentes_inline_antigos -gt 0 ]]; then
            echo "   🔄 Possíveis referencias a componentes antigos: $componentes_inline_antigos"
        fi
    fi
done

echo -e "\n📊 RESUMO DA ANÁLISE:"
echo "====================="
echo "✅ Steps corretos: $steps_corretos"
echo "⚠️  Steps com problemas: $((total_steps - steps_corretos))"
echo "❌ Total de problemas encontrados: $problemas_encontrados"

# Mostrar componentes problemáticos únicos
if [[ ${#components_problematicos[@]} -gt 0 ]]; then
    echo -e "\n🚨 COMPONENTES PROBLEMÁTICOS ENCONTRADOS:"
    for comp in "${components_problematicos[@]}"; do
        echo "   ❌ $comp"
    done
fi

# Verificar se o enhancedBlockRegistry está sendo usado
echo -e "\n🔧 VERIFICANDO REGISTRY..."
registry_file="src/config/enhancedBlockRegistry.ts"
if [[ -f "$registry_file" ]]; then
    echo "✅ Registry encontrado: $registry_file"
    
    # Contar quantos componentes estão registrados
    componentes_registrados=$(grep -c 'type.*:' "$registry_file" 2>/dev/null || echo 0)
    echo "📊 Componentes registrados no registry: $componentes_registrados"
    
    # Verificar se os tipos dos steps existem no registry
    echo "🔍 Verificando mapeamento step -> registry..."
    for step_file in src/components/steps/Step*Template.tsx; do
        if [[ -f "$step_file" ]]; then
            step_name=$(basename "$step_file" .tsx)
            tipos_step=$(grep -o '"type": "[^"]*"' "$step_file" | cut -d'"' -f4 | sort | uniq)
            
            echo "   📋 $step_name:"
            while IFS= read -r tipo; do
                if [[ -n "$tipo" ]]; then
                    if grep -q "type.*['\"]$tipo['\"]" "$registry_file"; then
                        echo "      ✅ $tipo (encontrado no registry)"
                    else
                        echo "      ❌ $tipo (NÃO encontrado no registry)"
                    fi
                fi
            done <<< "$tipos_step"
        fi
    done
else
    echo "❌ Registry não encontrado!"
fi

echo -e "\n🎯 RECOMENDAÇÕES:"
echo "=================="
if [[ $problemas_encontrados -gt 0 ]]; then
    echo "1. ❌ Verificar componentes não reconhecidos nos steps"
    echo "2. 🔧 Atualizar registry para incluir todos os tipos usados"
    echo "3. 🔄 Padronizar nomenclatura de componentes"
    echo "4. ✅ Testar renderização de todos os steps"
else
    echo "✅ Todos os steps parecem estar usando componentes corretos!"
    echo "🎯 Próximo passo: Testar a renderização no editor"
fi
