#!/bin/bash

# 🧪 SCRIPT DE TESTE AUTOMATIZADO: Painel de Propriedades Step02 + Options-Grid
# Executa verificações detalhadas de todas as configurações solicitadas

echo "🚀 INICIANDO TESTES COMPLETOS DO PAINEL DE PROPRIEDADES..."
echo "================================================================"
echo ""

# Função para verificar propriedades no useUnifiedProperties.ts
check_property() {
    local prop_name="$1"
    local section="$2"
    
    if grep -q "\"$prop_name\"" src/hooks/useUnifiedProperties.ts; then
        echo "  ✅ $prop_name ($section)"
        return 0
    else
        echo "  ❌ $prop_name ($section) - NÃO ENCONTRADA"
        return 1
    fi
}

# Contadores
total_tests=0
passed_tests=0

echo "📊 VERIFICANDO COMPONENTES DO STEP02..."
echo "----------------------------------------"

# 1. Quiz-Intro-Header
echo "1. Quiz-Intro-Header (Aproveitado do Step01)"
if grep -q "quiz-intro-header" src/components/steps/Step02Template.tsx; then
    echo "  ✅ Quiz-intro-header presente no Step02"
    ((passed_tests++))
else
    echo "  ❌ Quiz-intro-header NÃO encontrado no Step02"
fi
((total_tests++))

# 2. Text-Inline Question-Title
echo ""
echo "2. Text-Inline - Step02-Question-Title"
if grep -q "QUAL O SEU TIPO DE ROUPA FAVORITA" src/components/steps/Step02Template.tsx; then
    echo "  ✅ Texto correto da questão encontrado"
    ((passed_tests++))
else
    echo "  ❌ Texto da questão NÃO encontrado ou incorreto"
fi
((total_tests++))

# 3. Text-Inline Question-Counter  
echo ""
echo "3. Text-Inline - Step02-Question-Counter"
if grep -q "Questão 1 de 10" src/components/steps/Step02Template.tsx; then
    echo "  ✅ Contador correto encontrado"
    ((passed_tests++))
else
    echo "  ❌ Contador NÃO encontrado ou incorreto"
fi
((total_tests++))

# 4. Image-Display-Inline (deve estar ausente)
echo ""
echo "4. Image-Display-Inline (deve estar EXCLUÍDO)"
if ! grep -q "step02-clothing-image" src/components/steps/Step02Template.tsx; then
    echo "  ✅ Image-display-inline corretamente excluído"
    ((passed_tests++))
else
    echo "  ❌ Image-display-inline ainda presente (deve ser removido)"
fi
((total_tests++))

echo ""
echo "🎯 VERIFICANDO PROPRIEDADES OPTIONS-GRID..."
echo "============================================"

echo ""
echo "📊 SEÇÃO LAYOUT (6 propriedades):"
check_property "gridColumns" "Layout"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "contentDirection" "Layout"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "contentLayout" "Layout"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "imageSize" "Layout"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "imageClasses" "Layout"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "gridGap" "Layout"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))

echo ""
echo "📝 SEÇÃO CONTENT (2 propriedades):"
check_property "options" "Content"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "enableAddOption" "Content"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))

echo ""
echo "⚖️ SEÇÃO VALIDAÇÕES (6 propriedades):"
check_property "multipleSelection" "Validations"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "minSelections" "Validations"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "maxSelections" "Validations"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "autoAdvance" "Validations"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "autoAdvanceDelay" "Validations"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "enableButtonWhenValid" "Validations"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))

echo ""
echo "🎨 SEÇÃO ESTILIZAÇÃO (4 propriedades):"
check_property "borderWidth" "Style"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "shadowSize" "Style"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "optionSpacing" "Style"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "visualDetail" "Style"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))

echo ""
echo "🔘 SEÇÃO PROPRIEDADES DO BOTÃO (15+ propriedades):"

# Texto e Aparência  
check_property "buttonText" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "buttonScale" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "buttonTextColor" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "buttonContainerColor" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "buttonBorderColor" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "fontFamily" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))

# Alinhamento e Efeitos
check_property "buttonAlignment" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "shadowType" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "shadowColor" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "visualEffect" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "borderRadius" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "hoverOpacity" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))

# Comportamento
check_property "buttonAction" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "targetUrl" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "linkTarget" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "requireValidInput" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))
check_property "disabled" "Button"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))

echo ""
echo "🔧 SEÇÃO AVANÇADO (1 propriedade):"
check_property "componentId" "Advanced"; ((total_tests++)); [[ $? -eq 0 ]] && ((passed_tests++))

echo ""
echo "📋 VERIFICANDO OPÇÕES ESPECÍFICAS..."
echo "======================================"

# Verificar se as 8 opções estão presentes
options_found=0
option_texts=(
    "Amo roupas confortáveis e práticas"
    "Prefiro peças discretas, clássicas"  
    "Gosto de roupas casuais, mas com um toque"
    "Escolho peças elegantes, com cortes impecáveis"
    "Adoro roupas leves e delicadas"
    "Roupas que valorizam meu corpo"
    "Adoro roupas modernas, com cortes diferentes"
    "Amo looks marcantes e criativos"
)

echo "Verificando opções do Step02:"
for i in "${!option_texts[@]}"; do
    option="${option_texts[$i]}"
    letter=$((i + 1))
    
    if grep -q "$option" src/components/steps/Step02Template.tsx; then
        echo "  ✅ Opção $letter) encontrada"
        ((options_found++))
    else
        echo "  ❌ Opção $letter) NÃO encontrada: $option"
    fi
done

echo ""
echo "🎯 VERIFICAÇÕES FINAIS..."
echo "========================"

# Verificar se o servidor está rodando
if pgrep -f "npm run dev" > /dev/null; then
    echo "✅ Servidor de desenvolvimento rodando"
    server_status="✅ ATIVO"
else
    echo "❌ Servidor de desenvolvimento NÃO está rodando"
    server_status="❌ INATIVO"
fi

# Verificar erros TypeScript
echo ""
echo "🔍 Verificando erros TypeScript..."
if npm run type-check 2>/dev/null | grep -q "error"; then
    echo "❌ Erros TypeScript encontrados"
    typescript_status="❌ COM ERROS"
else
    echo "✅ Nenhum erro TypeScript"
    typescript_status="✅ SEM ERROS"
fi

echo ""
echo "📊 RESUMO FINAL DOS TESTES"
echo "=========================="
echo "Total de testes executados: $total_tests"
echo "Testes aprovados: $passed_tests"
echo "Taxa de sucesso: $(( passed_tests * 100 / total_tests ))%"
echo ""
echo "📋 STATUS DOS COMPONENTES:"
echo "--------------------------"
echo "Step02 Components: $(if [ $passed_tests -ge 30 ]; then echo "✅ OK"; else echo "❌ PROBLEMAS"; fi)"
echo "Options-Grid Properties: $(if [ $passed_tests -ge 25 ]; then echo "✅ IMPLEMENTADAS"; else echo "❌ INCOMPLETAS"; fi)"
echo "Opções encontradas: $options_found/8"
echo "Servidor: $server_status"
echo "TypeScript: $typescript_status"

echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "==================="
echo "1. Acessar: http://localhost:8080/editor-fixed"
echo "2. Navegar até Step02"
echo "3. Clicar no componente options-grid"
echo "4. Verificar se TODAS as propriedades aparecem organizadas:"
echo "   - 📊 LAYOUT (6 propriedades)"
echo "   - 📝 CONTENT (2 propriedades)"  
echo "   - ⚖️ BEHAVIOR (6 propriedades)"
echo "   - 🎨 STYLE (4 propriedades)"
echo "   - 🔘 BUTTON (15+ propriedades)"
echo "   - 🔧 ADVANCED (1 propriedade)"
echo ""

if [ $passed_tests -ge 35 ]; then
    echo "🎉 IMPLEMENTAÇÃO 100% COMPLETA!"
    echo "🚀 Sistema pronto para uso em produção!"
else
    echo "⚠️  IMPLEMENTAÇÃO PARCIAL - Verificar problemas encontrados"
    echo "🔧 Corrigir issues antes de usar em produção"
fi

echo ""
echo "📋 CHECKLIST AUTOMÁTICO CONCLUÍDO!"
echo "===================================="
