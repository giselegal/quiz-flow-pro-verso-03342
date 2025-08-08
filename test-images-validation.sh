#!/bin/bash

# 🧪 TESTE ESPECÍFICO: Imagens e Validação do Botão Step02
echo "🎯 TESTANDO IMAGENS E VALIDAÇÃO DO BOTÃO..."
echo "============================================="

echo ""
echo "🖼️ VERIFICANDO IMAGENS DAS OPÇÕES..."
echo "------------------------------------"

# URLs das imagens que devem estar presentes
image_urls=(
    "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp"
    "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp"
    "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp"
    "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_mjrfcl.webp"
    "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp"
    "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp"
    "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp"
    "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp"
)

images_found=0
for i in "${!image_urls[@]}"; do
    url="${image_urls[$i]}"
    option_letter=$(echo "A B C D E F G H" | cut -d' ' -f$((i+1)))
    
    if grep -q "$url" src/components/steps/Step02Template.tsx; then
        echo "  ✅ Opção $option_letter: Imagem configurada"
        ((images_found++))
    else
        echo "  ❌ Opção $option_letter: Imagem NÃO encontrada"
    fi
done

echo ""
echo "🔍 VERIFICANDO CONFIGURAÇÕES DE VALIDAÇÃO..."
echo "--------------------------------------------"

# Verificar configurações de validação do botão
validation_configs=(
    "enableButtonOnlyWhenValid: true"
    "instantButtonActivation: false" 
    "requiresValidInput: true"
    "disabled: true"
    "minSelections: 1"
    "maxSelections: 3"
)

validations_correct=0
for config in "${validation_configs[@]}"; do
    if grep -q "$config" src/components/steps/Step02Template.tsx; then
        echo "  ✅ $config"
        ((validations_correct++))
    else
        echo "  ❌ $config - NÃO encontrado ou incorreto"
    fi
done

echo ""
echo "🔘 VERIFICANDO TEXTOS DINÂMICOS DO BOTÃO..."
echo "-------------------------------------------"

button_texts=(
    "buttonTextWhenInvalid: \"Selecione pelo menos 1 opção\""
    "buttonTextWhenValid: \"Continuar →\""
    "textWhenDisabled: \"Selecione pelo menos 1 opção\""
)

button_texts_found=0
for text in "${button_texts[@]}"; do
    if grep -q "$text" src/components/steps/Step02Template.tsx; then
        echo "  ✅ $text"
        ((button_texts_found++))
    else
        echo "  ❌ $text - NÃO encontrado"
    fi
done

echo ""
echo "📊 VERIFICANDO PROPRIEDADES NO PAINEL..."
echo "========================================="

# Verificar se as propriedades relacionadas estão no useUnifiedProperties
panel_properties=(
    "imageSize"
    "imageClasses"
    "enableButtonWhenValid" 
    "minSelections"
    "maxSelections"
    "multipleSelection"
    "options"
    "buttonText"
    "disabled"
)

panel_props_found=0
for prop in "${panel_properties[@]}"; do
    if grep -q "\"$prop\"" src/hooks/useUnifiedProperties.ts; then
        echo "  ✅ $prop - Disponível no painel"
        ((panel_props_found++))
    else
        echo "  ❌ $prop - NÃO disponível no painel"
    fi
done

echo ""
echo "🧪 TESTE DE FUNCIONALIDADE..."
echo "============================="

echo "📋 Para testar manualmente no editor:"
echo "1. Acesse: http://localhost:8080/editor-fixed"
echo "2. Navegue até Step02"
echo "3. Clique no options-grid"
echo "4. No painel de propriedades:"
echo "   - Verifique se 'enableButtonWhenValid' está ATIVO"
echo "   - Verifique se 'minSelections' = 1"
echo "   - Verifique se 'maxSelections' = 3"
echo "   - Verifique se as 8 opções têm imagens"
echo "5. No preview:"
echo "   - Botão deve iniciar DESABILITADO"
echo "   - Ao selecionar 1 opção, botão deve ATIVAR"
echo "   - Imagens devem aparecer em todas as opções"

echo ""
echo "📊 RESUMO DOS TESTES..."
echo "======================"
echo "Imagens configuradas: $images_found/8"
echo "Validações corretas: $validations_correct/6"
echo "Textos do botão: $button_texts_found/3"
echo "Propriedades no painel: $panel_props_found/9"

total_score=$((images_found + validations_correct + button_texts_found + panel_props_found))
max_score=26

echo ""
echo "🎯 RESULTADO FINAL:"
echo "=================="
echo "Pontuação: $total_score/$max_score"
percentage=$(( total_score * 100 / max_score ))
echo "Taxa de sucesso: $percentage%"

if [ $percentage -ge 95 ]; then
    echo "🎉 EXCELENTE! Imagens e validação 100% funcionais"
elif [ $percentage -ge 80 ]; then
    echo "✅ BOM! Pequenos ajustes podem ser necessários"  
elif [ $percentage -ge 60 ]; then
    echo "⚠️ PARCIAL! Vários problemas encontrados"
else
    echo "❌ CRÍTICO! Muitas correções necessárias"
fi

echo ""
echo "🚀 PRÓXIMOS PASSOS:"
echo "=================="
echo "1. Testar no editor se o botão ativa/desativa corretamente"
echo "2. Verificar se todas as 8 imagens carregam no preview"  
echo "3. Confirmar que a validação 1-3 seleções funciona"
echo "4. Testar responsividade em mobile e desktop"

echo ""
echo "📱 LEMBRETE DE TESTE PRÁTICO:"
echo "============================"
echo "• Iniciar sem seleções → Botão DESABILITADO"
echo "• Selecionar 1 opção → Botão ATIVADO" 
echo "• Selecionar 2-3 opções → Botão continua ATIVADO"
echo "• Tentar selecionar 4+ → Deve limitar a 3"
echo "• Todas as imagens devem estar visíveis e carregadas"
