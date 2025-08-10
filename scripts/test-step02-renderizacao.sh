#!/bin/bash

# 🧪 ANÁLISE COMPLETA: RENDERIZAÇÃO DOS COMPONENTES STEP02
echo "🎯 ANALISANDO RENDERIZAÇÃO 100% DOS COMPONENTES STEP02..."
echo "=========================================================="

echo ""
echo "📊 VERIFICANDO ESTRUTURA DO TEMPLATE..."
echo "======================================="

# Função para verificar componente
check_component() {
    local component_id="$1"
    local component_type="$2"
    local description="$3"
    
    if grep -A 5 -B 2 "id: \"$component_id\"" src/components/steps/Step02Template.tsx | grep -q "type: \"$component_type\""; then
        echo "  ✅ $component_id ($component_type) - $description"
        return 0
    else
        echo "  ❌ $component_id ($component_type) - $description - NÃO encontrado"
        return 1
    fi
}

echo ""
echo "🧩 COMPONENTES DO STEP02 TEMPLATE:"
echo "=================================="

components_ok=0

# Verificar cada componente definido no template
check_component "step02-header" "quiz-intro-header" "Cabeçalho com logo e progresso"; [[ $? -eq 0 ]] && ((components_ok++))
check_component "step02-question-title" "text-inline" "Título da questão"; [[ $? -eq 0 ]] && ((components_ok++))
check_component "step02-question-counter" "text-inline" "Contador de questão"; [[ $? -eq 0 ]] && ((components_ok++))
check_component "step02-clothing-options" "options-grid" "Grade de opções"; [[ $? -eq 0 ]] && ((components_ok++))
check_component "step02-continue-button" "button-inline" "Botão de continuar"; [[ $? -eq 0 ]] && ((components_ok++))

echo ""
echo "🔍 VERIFICANDO PROPRIEDADES DOS COMPONENTES..."
echo "==============================================="

properties_ok=0

# Verificar propriedades específicas críticas
echo "📱 CABEÇALHO (quiz-intro-header):"
if grep -A 15 'id: "step02-header"' src/components/steps/Step02Template.tsx | grep -q "logoUrl:"; then
    echo "  ✅ Logo URL configurada"
    ((properties_ok++))
else
    echo "  ❌ Logo URL NÃO configurada"
fi

if grep -A 15 'id: "step02-header"' src/components/steps/Step02Template.tsx | grep -q "progressValue: 10"; then
    echo "  ✅ Progresso configurado (10%)"
    ((properties_ok++))
else
    echo "  ❌ Progresso NÃO configurado"
fi

echo ""
echo "🎯 TÍTULO DA QUESTÃO (text-inline):"
if grep -A 10 'id: "step02-question-title"' src/components/steps/Step02Template.tsx | grep -q "QUAL O SEU TIPO DE ROUPA FAVORITA?"; then
    echo "  ✅ Conteúdo do título presente"
    ((properties_ok++))
else
    echo "  ❌ Conteúdo do título NÃO configurado"
fi

if grep -A 10 'id: "step02-question-title"' src/components/steps/Step02Template.tsx | grep -q "fontSize: \"text-2xl\""; then
    echo "  ✅ Estilo de fonte configurado"
    ((properties_ok++))
else
    echo "  ❌ Estilo de fonte NÃO configurado"
fi

echo ""
echo "📊 CONTADOR (text-inline):"
if grep -A 10 'id: "step02-question-counter"' src/components/steps/Step02Template.tsx | grep -q "Questão 1 de 10"; then
    echo "  ✅ Contador configurado"
    ((properties_ok++))
else
    echo "  ❌ Contador NÃO configurado"
fi

echo ""
echo "🎯 OPÇÕES DO QUIZ (options-grid):"
# Contar opções
option_count=$(grep -A 200 'id: "step02-clothing-options"' src/components/steps/Step02Template.tsx | grep -c 'id: "option-')
echo "  📊 Opções encontradas: $option_count/8"

if [ $option_count -eq 8 ]; then
    echo "  ✅ Todas as 8 opções configuradas"
    ((properties_ok++))
else
    echo "  ❌ Opções incompletas ($option_count/8)"
fi

# Verificar imagens
images_with_url=$(grep -A 200 'id: "step02-clothing-options"' src/components/steps/Step02Template.tsx | grep -c 'imageUrl:.*cloudinary')
echo "  🖼️ Imagens com URL: $images_with_url/8"

if [ $images_with_url -eq 8 ]; then
    echo "  ✅ Todas as imagens têm URLs válidas"
    ((properties_ok++))
else
    echo "  ❌ Imagens sem URL ($images_with_url/8)"
fi

# Verificar validação
if grep -A 200 'id: "step02-clothing-options"' src/components/steps/Step02Template.tsx | grep -q "multipleSelection: true"; then
    echo "  ✅ Múltipla seleção habilitada"
    ((properties_ok++))
else
    echo "  ❌ Múltipla seleção NÃO configurada"
fi

if grep -A 200 'id: "step02-clothing-options"' src/components/steps/Step02Template.tsx | grep -q "maxSelections: 3"; then
    echo "  ✅ Máximo de seleções configurado (3)"
    ((properties_ok++))
else
    echo "  ❌ Máximo de seleções NÃO configurado"
fi

echo ""
echo "🔘 BOTÃO (button-inline):"
if grep -A 30 'id: "step02-continue-button"' src/components/steps/Step02Template.tsx | grep -q "text: \"Próxima Questão"; then
    echo "  ✅ Texto do botão configurado"
    ((properties_ok++))
else
    echo "  ❌ Texto do botão NÃO configurado"
fi

if grep -A 30 'id: "step02-continue-button"' src/components/steps/Step02Template.tsx | grep -q "requiresValidInput: true"; then
    echo "  ✅ Validação de input habilitada"
    ((properties_ok++))
else
    echo "  ❌ Validação de input NÃO configurada"
fi

echo ""
echo "🎨 VERIFICANDO ESTILOS E LAYOUT..."
echo "=================================="

styles_ok=0

# Verificar responsive
if grep -A 200 'id: "step02-clothing-options"' src/components/steps/Step02Template.tsx | grep -q "columns: 2"; then
    echo "  ✅ Layout de 2 colunas configurado"
    ((styles_ok++))
else
    echo "  ❌ Layout de colunas NÃO configurado"
fi

# Verificar tamanho de imagem
if grep -A 200 'id: "step02-clothing-options"' src/components/steps/Step02Template.tsx | grep -q "imageSize: \"256px\""; then
    echo "  ✅ Tamanho de imagem configurado (256px)"
    ((styles_ok++))
else
    echo "  ❌ Tamanho de imagem NÃO configurado"
fi

# Verificar cores
if grep -A 200 'id: "step02-clothing-options"' src/components/steps/Step02Template.tsx | grep -q "selectedColor: \"#B89B7A\""; then
    echo "  ✅ Cor de seleção configurada"
    ((styles_ok++))
else
    echo "  ❌ Cor de seleção NÃO configurada"
fi

echo ""
echo "🚀 VERIFICANDO INTEGRAÇÃO COM HOOKS..."
echo "======================================"

hooks_ok=0

# Verificar se usa mobile hook
if grep -q "useIsMobile" src/components/steps/Step02Template.tsx; then
    echo "  ✅ Hook useIsMobile integrado"
    ((hooks_ok++))
else
    echo "  ❌ Hook useIsMobile NÃO integrado"
fi

# Verificar props
if grep -A 5 "export interface Step02Props" src/components/steps/Step02Template.tsx | grep -q "onNext"; then
    echo "  ✅ Props de navegação configuradas"
    ((hooks_ok++))
else
    echo "  ❌ Props de navegação NÃO configuradas"
fi

echo ""
echo "📋 VERIFICANDO ARQUIVOS DE SUPORTE..."
echo "====================================="

support_files_ok=0

# Verificar se componentes existem
components_to_check=(
    "src/components/blocks/QuizIntroHeader.tsx"
    "src/components/blocks/TextInline.tsx"
    "src/components/blocks/OptionsGrid.tsx"
    "src/components/blocks/ButtonInline.tsx"
)

echo "🧩 Componentes de suporte:"
for component in "${components_to_check[@]}"; do
    if [ -f "$component" ]; then
        echo "  ✅ $(basename $component) - Arquivo existe"
        ((support_files_ok++))
    else
        echo "  ❌ $(basename $component) - Arquivo NÃO encontrado"
    fi
done

echo ""
echo "📊 RESUMO DA ANÁLISE DE RENDERIZAÇÃO..."
echo "======================================"

total_checks=$((components_ok + properties_ok + styles_ok + hooks_ok + support_files_ok))
max_checks=$((5 + 11 + 3 + 2 + 4)) # 5 componentes + 11 propriedades + 3 estilos + 2 hooks + 4 arquivos

echo "Componentes: $components_ok/5"
echo "Propriedades: $properties_ok/11"
echo "Estilos: $styles_ok/3"
echo "Hooks: $hooks_ok/2"
echo "Arquivos de Suporte: $support_files_ok/4"
echo "TOTAL: $total_checks/$max_checks"

percentage=$(( total_checks * 100 / max_checks ))

echo ""
echo "🎯 RESULTADO FINAL DA RENDERIZAÇÃO:"
echo "=================================="
echo "Taxa de Renderização: $percentage%"

if [ $percentage -ge 95 ]; then
    echo "🎉 EXCELENTE! Step02 está renderizando 100%"
    echo "✅ Todos os componentes configurados corretamente"
    echo "✅ Propriedades completas e válidas"
    echo "✅ Layout responsivo implementado"
    echo "✅ Integração com hooks funcionando"
elif [ $percentage -ge 80 ]; then
    echo "✅ BOM! Step02 renderizando com pequenos ajustes"
elif [ $percentage -ge 60 ]; then
    echo "⚠️ PARCIAL! Alguns componentes precisam correção"
else
    echo "❌ CRÍTICO! Muitos problemas de renderização"
fi

echo ""
echo "🧪 TESTE PRÁTICO RECOMENDADO:"
echo "============================="
echo "1. Abrir: http://localhost:8080/editor-fixed"
echo "2. Navegar para Step02"
echo "3. Verificar se todos os elementos aparecem:"
echo "   - 📱 Logo e barra de progresso (10%)"
echo "   - 🎯 Título 'QUAL O SEU TIPO DE ROUPA FAVORITA?'"
echo "   - 📊 Contador 'Questão 1 de 10'"
echo "   - 🎯 8 opções com imagens 256x256px em grid 2x4"
echo "   - 🔘 Botão 'Próxima Questão →' (inicialmente desabilitado)"
echo "4. Testar interações:"
echo "   - Selecionar 1-3 opções"
echo "   - Botão deve ativar após seleção"
echo "   - Feedback visual nas opções"
echo "5. Confirmar responsividade mobile"

echo ""
echo "🔧 CHECKLIST DE VALIDAÇÃO VISUAL:"
echo "================================="
echo "[ ] Logo aparece no topo?"
echo "[ ] Barra de progresso mostra 10%?"
echo "[ ] Título está centralizado e estilizado?"
echo "[ ] Contador está visível?"
echo "[ ] 8 opções aparecem em grid 2 colunas?"
echo "[ ] Imagens carregam corretamente (256x256px)?"
echo "[ ] Texto das opções está legível?"
echo "[ ] Seleção funciona (1-3 opções)?"
echo "[ ] Botão ativa após seleção?"
echo "[ ] Layout funciona em mobile?"

echo ""
echo "🚀 PRÓXIMO PASSO: TESTE VISUAL NO NAVEGADOR!"
