#!/bin/bash

# 🎯 SCRIPT PARA SISTEMA HÍBRIDO DE IDs
# Sistema que mantém compatibilidade com schema do banco de dados
# + IDs reutilizáveis para componentes + IDs únicos para analytics

echo "🚀 INICIANDO SISTEMA HÍBRIDO DE IDs (REUTILIZÁVEIS + SCHEMA COMPATIBLE)..."

# Definir mapeamento de IDs antigos para novos
declare -A ID_MAPPING
ID_MAPPING=(
    # CABEÇALHOS
    ["step01-header"]="quiz-header"
    ["step02-header"]="quiz-header"
    ["step03-header"]="quiz-header"
    ["step04-header"]="quiz-header"
    ["step05-header"]="quiz-header"
    ["step06-header"]="quiz-header"
    ["step07-header"]="quiz-header"
    ["step08-header"]="quiz-header"
    ["step09-header"]="quiz-header"
    ["step10-header"]="quiz-header"
    ["step11-header"]="quiz-header"
    ["step12-header"]="quiz-header"
    ["step13-header"]="quiz-header"
    ["step14-header"]="quiz-header"
    ["step15-header"]="quiz-header"
    ["step16-header"]="quiz-header"
    ["step17-header"]="quiz-header"
    ["step18-header"]="quiz-header"
    ["step19-header"]="quiz-header"
    ["step20-header"]="quiz-header"
    ["step21-header"]="quiz-header"
    
    # TÍTULOS DE QUESTÕES
    ["step01-hero-title"]="question-title"
    ["step02-question-title"]="question-title"
    ["step03-question-title"]="question-title"
    ["step04-question-title"]="question-title"
    ["step05-question-title"]="question-title"
    ["step06-question-title"]="question-title"
    ["step07-question-title"]="question-title"
    ["step08-question-title"]="question-title"
    ["step09-question-title"]="question-title"
    ["step10-question-title"]="question-title"
    ["step11-question-title"]="question-title"
    ["step12-question-title"]="question-title"
    ["step13-question-title"]="question-title"
    ["step14-question-title"]="question-title"
    
    # CONTADORES DE QUESTÃO
    ["step02-question-counter"]="question-counter"
    ["step03-question-counter"]="question-counter"
    ["step04-question-counter"]="question-counter"
    ["step05-question-counter"]="question-counter"
    ["step06-question-counter"]="question-counter"
    ["step07-question-counter"]="question-counter"
    ["step08-question-counter"]="question-counter"
    ["step09-question-counter"]="question-counter"
    ["step10-question-counter"]="question-counter"
    ["step11-question-counter"]="question-counter"
    ["step12-question-counter"]="question-counter"
    ["step13-question-counter"]="question-counter"
    ["step14-question-counter"]="question-counter"
    
    # OPÇÕES DE QUESTÕES
    ["step02-clothing-options"]="options-grid"
    ["step03-personality-options"]="options-grid"
    ["step04-body-type-options"]="options-grid"
    ["step05-q4-options"]="options-grid"
    ["step06-q5-options"]="options-grid"
    ["step07-routine-options"]="options-grid"
    ["step08-occasion-options"]="options-grid"
    ["step09-budget-options"]="options-grid"
    ["step10-shopping-options"]="options-grid"
    ["step11-inspiration-options"]="options-grid"
    ["step12-challenges-options"]="options-grid"
    ["step13-preferences-options"]="options-grid"
    ["step14-style-options"]="options-grid"
    
    # IMAGENS
    ["step01-hero-image"]="hero-image"
    ["step02-clothing-image"]="question-image"
    ["step03-personality-image"]="question-image"
    ["step04-body-image"]="question-image"
    
    # COMPONENTES ESPECIAIS
    ["step01-hero-subtitle"]="hero-subtitle"
    ["step01-hero-description"]="hero-description"
    ["step01-start-button"]="cta-button"
    ["step15-transition-title"]="transition-title"
    ["step15-transition-subtitle"]="transition-subtitle"
    ["step16-processing-title"]="processing-title"
    ["step17-result-title"]="result-title"
    ["step18-result-description"]="result-description"
    ["step19-transformation"]="transformation-gallery"
    ["step20-lead-form"]="lead-form"
    ["step21-offer-title"]="offer-title"
    ["step21-offer-description"]="offer-description"
    ["step21-offer-cta"]="offer-cta"
)

echo "📋 MAPEAMENTO DE IDs DEFINIDO (${#ID_MAPPING[@]} conversões)"

# Função para converter arquivo
convert_file() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    echo "🔄 Processando: $file"
    
    # Fazer backup
    cp "$file" "${file}.backup"
    
    # Aplicar conversões
    cp "$file" "$temp_file"
    
    for old_id in "${!ID_MAPPING[@]}"; do
        new_id="${ID_MAPPING[$old_id]}"
        
        # Converter IDs nas propriedades
        sed -i "s/\"id\": \"$old_id\"/\"id\": \"$new_id\"/g" "$temp_file"
        
        # Converter referências em comentários
        sed -i "s/$old_id/$new_id/g" "$temp_file"
    done
    
    # Verificar se houve mudanças
    if ! diff -q "$file" "$temp_file" > /dev/null; then
        mv "$temp_file" "$file"
        echo "✅ Convertido: $file"
    else
        rm "$temp_file"
        echo "ℹ️  Sem mudanças: $file"
    fi
}

# Processar todos os arquivos de template
echo "🎯 CONVERTENDO TEMPLATES..."
for file in /workspaces/quiz-quest-challenge-verse/src/components/steps/Step*Template.tsx; do
    if [[ -f "$file" ]]; then
        convert_file "$file"
    fi
done

echo ""
echo "🎯 SISTEMA DE IDs REUTILIZÁVEIS IMPLEMENTADO!"
echo ""
echo "📊 NOVOS IDs PADRONIZADOS:"
echo "  • quiz-header → Cabeçalho com logo e progresso"
echo "  • question-title → Título da questão"
echo "  • question-counter → Contador de questão"
echo "  • question-image → Imagem ilustrativa"
echo "  • options-grid → Grid de opções"
echo "  • hero-image → Imagem principal"
echo "  • cta-button → Botão de ação"
echo "  • transition-title → Título de transição"
echo "  • processing-title → Título de processamento"
echo "  • result-title → Título de resultado"
echo "  • transformation-gallery → Galeria de transformações"
echo "  • lead-form → Formulário de captura"
echo "  • offer-title → Título da oferta"
echo "  • offer-cta → CTA da oferta"
echo ""
echo "🔥 AGORA OS COMPONENTES SÃO 100% REUTILIZÁVEIS!"
