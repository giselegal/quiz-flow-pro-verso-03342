#!/bin/bash

# Script para tornar as principais props dos componentes quiz opcionais
# para compatibilidade com o editor

COMPONENTS_DIR="/workspaces/quiz-quest-challenge-verse/client/src/components/quiz/components"

# Lista de componentes e suas props principais
declare -A COMPONENTS_PROPS=(
    ["QuizParagraph.tsx"]="text: string"
    ["QuizImage.tsx"]="src: string"
    ["QuizButton.tsx"]="text: string"
    ["QuizInput.tsx"]="placeholder: string"
    ["QuizOptions.tsx"]="options: QuizOption[]"
    ["QuizVideo.tsx"]="src: string"
    ["QuizTestimonial.tsx"]="text: string"
    ["QuizPrice.tsx"]="price: string"
    ["QuizCountdown.tsx"]="endDate: string"
    ["QuizGuarantee.tsx"]="days: number"
    ["QuizBonus.tsx"]="items: BonusItem[]"
    ["QuizFAQ.tsx"]="items: FaqItem[]"
    ["QuizSocialProof.tsx"]="count: string"
    ["QuizEmail.tsx"]="placeholder: string"
    ["QuizPhone.tsx"]="placeholder: string"
)

for component in "${!COMPONENTS_PROPS[@]}"; do
    file_path="$COMPONENTS_DIR/$component"
    prop_pattern="${COMPONENTS_PROPS[$component]}"
    
    if [ -f "$file_path" ]; then
        echo "Corrigindo $component..."
        
        # Tornar a prop opcional
        optional_prop=$(echo "$prop_pattern" | sed 's/: /?:/')
        
        # Substituir no arquivo
        sed -i "s/$prop_pattern/$optional_prop/g" "$file_path"
        
        # Adicionar valor padrão no destructuring
        prop_name=$(echo "$prop_pattern" | cut -d':' -f1 | xargs)
        
        # Determinar valor padrão baseado no tipo
        if [[ "$prop_pattern" == *"string"* ]]; then
            default_value="''"
        elif [[ "$prop_pattern" == *"number"* ]]; then
            default_value="0"
        elif [[ "$prop_pattern" == *"[]"* ]]; then
            default_value="[]"
        else
            default_value="undefined"
        fi
        
        # Adicionar valor padrão
        sed -i "s/$prop_name,/$prop_name = $default_value,/g" "$file_path"
        
        echo "✓ $component corrigido"
    else
        echo "✗ $component não encontrado"
    fi
done

echo "Correção concluída!"
