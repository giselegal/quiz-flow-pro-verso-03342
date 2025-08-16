#!/bin/bash

# 🎯 SCRIPT: Análise de Componentes das Etapas 3-21
# OBJETIVO: Identificar componentes únicos que ainda precisam de configuração

echo "🎯 INICIANDO ANÁLISE DAS ETAPAS 3-21..."

# 📊 Componentes já configurados (Etapas 1-2)
CONFIGURED_COMPONENTS=(
  "quiz-intro-header"
  "text-inline" 
  "heading-inline"
  "button-inline"
  "decorative-bar-inline"
  "image-display-inline"
  "form-input"
  "legal-notice-inline"
  "options-grid"
)

echo "✅ Componentes já configurados: ${#CONFIGURED_COMPONENTS[@]}"

# 📋 Diretório das etapas
STEPS_DIR="/workspaces/quiz-quest-challenge-verse/src/components/steps"

echo "🔍 Analisando templates das etapas 3-21..."

# Verificar se diretório existe
if [[ -d "$STEPS_DIR" ]]; then
    echo "✅ Diretório de steps encontrado: $STEPS_DIR"
    
    # Listar arquivos de template
    STEP_FILES=($STEPS_DIR/Step*Template.tsx)
    echo "📁 Total de templates encontrados: ${#STEP_FILES[@]}"
    
    # Array para componentes únicos encontrados
    declare -A UNIQUE_COMPONENTS
    declare -A COMPONENT_USAGE
    
    # Analisar cada arquivo
    for file in "${STEP_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            step_name=$(basename "$file" .tsx)
            echo "📋 Analisando: $step_name"
            
            # Extrair tipos de componentes (type: "component-name")
            while IFS= read -r line; do
                if [[ $line =~ type:[[:space:]]*[\"\'](.*?)[\"\'] ]]; then
                    component_type="${BASH_REMATCH[1]}"
                    UNIQUE_COMPONENTS["$component_type"]=1
                    
                    # Contar uso por etapa
                    if [[ -z "${COMPONENT_USAGE[$component_type]}" ]]; then
                        COMPONENT_USAGE["$component_type"]="$step_name"
                    else
                        COMPONENT_USAGE["$component_type"]="${COMPONENT_USAGE[$component_type]}, $step_name"
                    fi
                fi
            done < "$file"
        fi
    done
    
    echo ""
    echo "📊 COMPONENTES ENCONTRADOS NAS ETAPAS 3-21:"
    echo "=============================================="
    
    # Separar configurados vs não configurados
    NEEDS_CONFIG=()
    ALREADY_CONFIG=()
    
    for component in "${!UNIQUE_COMPONENTS[@]}"; do
        is_configured=0
        for configured in "${CONFIGURED_COMPONENTS[@]}"; do
            if [[ "$component" == "$configured" ]]; then
                is_configured=1
                break
            fi
        done
        
        if [[ $is_configured -eq 1 ]]; then
            ALREADY_CONFIG+=("$component")
            echo "✅ $component (JÁ CONFIGURADO)"
        else
            NEEDS_CONFIG+=("$component")
            echo "❌ $component (PRECISA CONFIGURAR)"
        fi
    done
    
    echo ""
    echo "📈 RESUMO:"
    echo "=========="
    echo "✅ Já configurados: ${#ALREADY_CONFIG[@]}"
    echo "❌ Precisam configuração: ${#NEEDS_CONFIG[@]}"
    echo "📊 Total únicos: ${#UNIQUE_COMPONENTS[@]}"
    
    if [[ ${#NEEDS_CONFIG[@]} -gt 0 ]]; then
        echo ""
        echo "🔧 COMPONENTES QUE PRECISAM DE CONFIGURAÇÃO:"
        echo "============================================="
        for component in "${NEEDS_CONFIG[@]}"; do
            echo "🎯 $component"
            echo "   Usado em: ${COMPONENT_USAGE[$component]}"
            echo ""
        done
    fi
    
else
    echo "❌ Diretório de steps não encontrado: $STEPS_DIR"
    exit 1
fi

echo "🎯 ANÁLISE CONCLUÍDA!"
echo "📋 Próximo passo: Configurar componentes pendentes"
