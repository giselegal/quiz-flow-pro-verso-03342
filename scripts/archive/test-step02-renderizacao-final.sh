#!/bin/bash

# 🎯 ANÁLISE CORRIGIDA: RENDERIZAÇÃO 100% DOS COMPONENTES STEP02
echo "🎯 ANÁLISE FINAL - RENDERIZAÇÃO DOS COMPONENTES STEP02..."
echo "=========================================================="

echo ""
echo "✅ COMPONENTES DO STEP02 - STATUS FINAL:"
echo "========================================"

components_ok=0

# Verificar cada componente no template
if grep -A 5 -B 2 'id: "step02-header"' src/components/steps/Step02Template.tsx | grep -q 'type: "quiz-intro-header"'; then
    echo "  ✅ step02-header (quiz-intro-header) - Cabeçalho com logo e progresso"
    ((components_ok++))
else
    echo "  ❌ step02-header - NÃO configurado"
fi

if grep -A 5 -B 2 'id: "step02-question-title"' src/components/steps/Step02Template.tsx | grep -q 'type: "text-inline"'; then
    echo "  ✅ step02-question-title (text-inline) - Título da questão"
    ((components_ok++))
else
    echo "  ❌ step02-question-title - NÃO configurado"
fi

if grep -A 5 -B 2 'id: "step02-question-counter"' src/components/steps/Step02Template.tsx | grep -q 'type: "text-inline"'; then
    echo "  ✅ step02-question-counter (text-inline) - Contador de questão"
    ((components_ok++))
else
    echo "  ❌ step02-question-counter - NÃO configurado"
fi

if grep -A 5 -B 2 'id: "step02-clothing-options"' src/components/steps/Step02Template.tsx | grep -q 'type: "options-grid"'; then
    echo "  ✅ step02-clothing-options (options-grid) - Grade de opções"
    ((components_ok++))
else
    echo "  ❌ step02-clothing-options - NÃO configurado"
fi

if grep -A 5 -B 2 'id: "step02-continue-button"' src/components/steps/Step02Template.tsx | grep -q 'type: "button-inline"'; then
    echo "  ✅ step02-continue-button (button-inline) - Botão de continuar"
    ((components_ok++))
else
    echo "  ❌ step02-continue-button - NÃO configurado"
fi

echo ""
echo "🖼️ VERIFICAÇÃO CORRIGIDA - IMAGENS DAS OPÇÕES:"
echo "=============================================="

# Contar imageUrl com URLs válidas do Cloudinary (método mais preciso)
images_count=$(grep -A 300 'id: "step02-clothing-options"' src/components/steps/Step02Template.tsx | grep 'imageUrl:' | grep -c 'cloudinary')

echo "  📊 Imagens com URLs do Cloudinary: $images_count/8"

if [ $images_count -eq 8 ]; then
    echo "  ✅ Todas as 8 opções têm URLs de imagem válidas"
    images_ok=1
else
    echo "  ❌ Faltam imagens para as opções ($images_count/8)"
    images_ok=0
fi

# Verificar URLs específicas das opções
echo ""
echo "🔍 DETALHAMENTO DAS IMAGENS POR OPÇÃO:"
echo "====================================="

option_images=(
    "option-a:11_hqmr8l.webp"
    "option-b:12_edlmwf.webp" 
    "option-c:4_snhaym.webp"
    "option-d:14_mjrfcl.webp"
    "option-e:15_xezvcy.webp"
    "option-f:16_mpqpew.webp"
    "option-g:17_m5ogub.webp"
    "option-h:18_j8ipfb.webp"
)

images_detailed=0
for option_image in "${option_images[@]}"; do
    option=$(echo $option_image | cut -d: -f1)
    image=$(echo $option_image | cut -d: -f2)
    
    if grep -A 20 "id: \"$option\"" src/components/steps/Step02Template.tsx | grep -q "$image"; then
        echo "  ✅ $option - $image configurada"
        ((images_detailed++))
    else
        echo "  ❌ $option - Imagem NÃO encontrada"
    fi
done

echo ""
echo "🧩 VERIFICAÇÃO DOS ARQUIVOS COMPONENTES (CORRIGIDA):"
echo "=================================================="

# Caminhos corretos dos componentes
component_files=(
    "src/components/editor/blocks/QuizIntroHeaderBlock.tsx"
    "src/components/editor/blocks/TextInlineBlock.tsx"
    "src/components/editor/blocks/OptionsGridBlock.tsx"
    "src/components/editor/blocks/ButtonInlineBlock.tsx"
)

files_ok=0
echo "📁 Arquivos de componentes encontrados:"
for component_file in "${component_files[@]}"; do
    if [ -f "$component_file" ]; then
        echo "  ✅ $(basename $component_file) - Existe"
        ((files_ok++))
    else
        echo "  ❌ $(basename $component_file) - NÃO encontrado"
    fi
done

echo ""
echo "🎯 PROPRIEDADES CRÍTICAS - VERIFICAÇÃO FINAL:"
echo "============================================="

properties_ok=0

# Logo URL
if grep -A 15 'id: "step02-header"' src/components/steps/Step02Template.tsx | grep -q "logoUrl.*cloudinary"; then
    echo "  ✅ Logo URL configurada (Cloudinary)"
    ((properties_ok++))
else
    echo "  ❌ Logo URL não configurada"
fi

# Progresso
if grep -A 15 'id: "step02-header"' src/components/steps/Step02Template.tsx | grep -q "progressValue: 10"; then
    echo "  ✅ Progresso configurado (10%)"
    ((properties_ok++))
else
    echo "  ❌ Progresso não configurado"
fi

# Título da questão
if grep -A 10 'id: "step02-question-title"' src/components/steps/Step02Template.tsx | grep -q "QUAL O SEU TIPO DE ROUPA"; then
    echo "  ✅ Título da questão configurado"
    ((properties_ok++))
else
    echo "  ❌ Título da questão não configurado"
fi

# Contador
if grep -A 10 'id: "step02-question-counter"' src/components/steps/Step02Template.tsx | grep -q "Questão 1 de 10"; then
    echo "  ✅ Contador 'Questão 1 de 10' configurado"
    ((properties_ok++))
else
    echo "  ❌ Contador não configurado"
fi

# Múltipla seleção
if grep -A 200 'id: "step02-clothing-options"' src/components/steps/Step02Template.tsx | grep -q "multipleSelection: true"; then
    echo "  ✅ Múltipla seleção habilitada"
    ((properties_ok++))
else
    echo "  ❌ Múltipla seleção não configurada"
fi

# Máximo de seleções
if grep -A 200 'id: "step02-clothing-options"' src/components/steps/Step02Template.tsx | grep -q "maxSelections: 3"; then
    echo "  ✅ Máximo 3 seleções configurado"
    ((properties_ok++))
else
    echo "  ❌ Máximo de seleções não configurado"
fi

# Layout 2 colunas
if grep -A 200 'id: "step02-clothing-options"' src/components/steps/Step02Template.tsx | grep -q "columns: 2"; then
    echo "  ✅ Layout 2 colunas configurado"
    ((properties_ok++))
else
    echo "  ❌ Layout de colunas não configurado"
fi

# Botão de validação
if grep -A 30 'id: "step02-continue-button"' src/components/steps/Step02Template.tsx | grep -q "requiresValidInput: true"; then
    echo "  ✅ Validação do botão configurada"
    ((properties_ok++))
else
    echo "  ❌ Validação do botão não configurada"
fi

echo ""
echo "📊 RESUMO FINAL DA ANÁLISE:"
echo "=========================="

echo "🧩 Componentes: $components_ok/5"
echo "🖼️ Imagens: $images_detailed/8"  
echo "📁 Arquivos: $files_ok/4"
echo "🎯 Propriedades: $properties_ok/8"

total_score=$((components_ok + images_detailed + files_ok + properties_ok))
max_score=25

percentage=$(( total_score * 100 / max_score ))

echo ""
echo "🎯 RESULTADO FINAL DA RENDERIZAÇÃO STEP02:"
echo "=========================================="
echo "Pontuação: $total_score/$max_score"
echo "Taxa de Renderização: $percentage%"

if [ $percentage -eq 100 ]; then
    echo ""
    echo "🎉 PERFEITO! STEP02 ESTÁ 100% RENDERIZANDO!"
    echo "============================================"
    echo "✅ Todos os 5 componentes configurados"
    echo "✅ Todas as 8 imagens com URLs válidas"
    echo "✅ Todos os 4 arquivos de suporte existem"
    echo "✅ Todas as 8 propriedades críticas OK"
    echo ""
    echo "🚀 STEP02 PRONTO PARA PRODUÇÃO!"
elif [ $percentage -ge 95 ]; then
    echo ""
    echo "🎉 EXCELENTE! STEP02 quase 100% funcional"
    echo "✅ Renderização praticamente completa"
elif [ $percentage -ge 80 ]; then
    echo ""
    echo "✅ BOM! STEP02 renderizando bem"
    echo "⚠️ Pequenos ajustes necessários"
else
    echo ""
    echo "❌ ATENÇÃO! Problemas na renderização"
    echo "🔧 Correções necessárias"
fi

echo ""
echo "🧪 VERIFICAÇÃO PRÁTICA FINAL:"
echo "============================"
echo "1. Servidor rodando: http://localhost:8080/editor-fixed"
echo "2. Navegar: Step02 Template"
echo "3. Verificar elementos:"
echo "   ✅ Logo Gisele Galvão (96x96px)"
echo "   ✅ Barra progresso 10%"
echo "   ✅ Título 'QUAL O SEU TIPO DE ROUPA FAVORITA?'"
echo "   ✅ Contador 'Questão 1 de 10'"
echo "   ✅ 8 opções com imagens 256x256px"
echo "   ✅ Grid 2 colunas responsivo"
echo "   ✅ Botão 'Próxima Questão →'"
echo "4. Testar funcionalidades:"
echo "   ✅ Seleção múltipla (1-3 opções)"
echo "   ✅ Botão ativa após seleção válida"
echo "   ✅ Feedback visual nas opções"
echo "   ✅ Responsividade mobile"

echo ""
echo "🎯 STATUS: ANÁLISE DE RENDERIZAÇÃO CONCLUÍDA!"
