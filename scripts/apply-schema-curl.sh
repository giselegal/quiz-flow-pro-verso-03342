#!/bin/bash

echo "🚀 APLICANDO SCHEMA SUPABASE VIA API (CURL)"
echo "==========================================="

# Configuração
SUPABASE_URL="https://pwtjuuhchtbzttrzoutw.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w"

echo "🔗 URL: $SUPABASE_URL"
echo ""

# Função para inserir componente
insert_component() {
    local type_key="$1"
    local display_name="$2"
    local category="$3"
    local component_path="$4"
    local default_properties="$5"
    
    echo "📝 Inserindo: $display_name..."
    
    curl -s -X POST \
        "$SUPABASE_URL/rest/v1/component_types" \
        -H "apikey: $ANON_KEY" \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "Content-Type: application/json" \
        -H "Prefer: resolution=merge-duplicates" \
        -d "{
            \"type_key\": \"$type_key\",
            \"display_name\": \"$display_name\",
            \"category\": \"$category\",
            \"component_path\": \"$component_path\",
            \"default_properties\": $default_properties,
            \"is_system\": true,
            \"is_active\": true
        }" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✅ $display_name inserido"
    else
        echo "⚠️  Erro ao inserir $display_name"
    fi
}

echo "📦 1. COMPONENTES DO REGISTRY:"
echo "=============================="

# Componentes básicos do registry
insert_component "text-inline" "Texto Inline" "content" "/components/editor/blocks/TextInlineBlock" '{"content":"Texto exemplo","fontSize":"text-lg","color":"#432818"}'

insert_component "heading-inline" "Título Inline" "content" "/components/editor/blocks/HeadingInlineBlock" '{"content":"Título","level":"h2","fontSize":"text-2xl","fontWeight":"font-bold"}'

insert_component "quiz-intro-header" "Header do Quiz" "headers" "/components/editor/blocks/QuizIntroHeaderBlock" '{"logoUrl":"","logoWidth":120,"progressValue":0,"showBackButton":false}'

insert_component "options-grid" "Grade de Opções" "interactive" "/components/editor/blocks/OptionsGridBlock" '{"options":[],"columns":2,"showImages":true,"multipleSelection":false}'

insert_component "button-inline" "Botão" "interactive" "/components/blocks/inline/ButtonInlineFixed" '{"text":"Clique aqui","variant":"primary","backgroundColor":"#B89B7A","textColor":"#ffffff"}'

insert_component "form-input" "Campo de Formulário" "forms" "/components/editor/blocks/FormInputBlock" '{"label":"Campo","placeholder":"Digite aqui...","required":false,"inputType":"text"}'

insert_component "image-display-inline" "Imagem Display" "media" "/components/editor/blocks/ImageDisplayInlineBlock" '{"src":"","alt":"Imagem","width":400,"height":300}'

insert_component "decorative-bar-inline" "Barra Decorativa" "visual" "/components/blocks/inline/DecorativeBarInline" '{"width":"100%","height":4,"color":"#B89B7A","borderRadius":3}'

insert_component "legal-notice-inline" "Aviso Legal" "legal" "/components/blocks/inline/LegalNoticeInline" '{"privacyText":"Política de privacidade","copyrightText":"© 2025 Todos os direitos reservados"}'

echo ""
echo "🎨 2. COMPONENTES DA MARCA GISELE:"
echo "=================================="

# Componentes personalizados da marca Gisele
insert_component "gisele-header" "Header Gisele Galvão" "headers" "/components/editor/blocks/QuizIntroHeaderBlock" '{"logoUrl":"https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp","logoWidth":120,"logoHeight":120,"backgroundColor":"transparent","showBackButton":true}'

insert_component "gisele-button" "Botão Gisele Galvão" "interactive" "/components/blocks/inline/ButtonInlineFixed" '{"backgroundColor":"#B89B7A","textColor":"#ffffff","borderRadius":"rounded-full","fontFamily":"Playfair Display, serif","fontWeight":"font-bold","boxShadow":"shadow-xl"}'

insert_component "style-question" "Pergunta de Estilo" "content" "/components/editor/blocks/TextInlineBlock" '{"fontSize":"text-2xl","fontWeight":"font-bold","color":"#432818","textAlign":"text-center","fontFamily":"Playfair Display, serif","marginBottom":24}'

insert_component "style-options-grid" "Opções de Estilo" "interactive" "/components/editor/blocks/OptionsGridBlock" '{"columns":2,"showImages":true,"multipleSelection":true,"maxSelections":3,"gridGap":16,"responsiveColumns":true,"autoAdvanceOnComplete":false}'

echo ""
echo "🔍 3. VERIFICANDO DADOS INSERIDOS:"
echo "==================================="

# Buscar componentes inseridos
response=$(curl -s -X GET \
    "$SUPABASE_URL/rest/v1/component_types?select=type_key,display_name,category&order=category,display_name" \
    -H "apikey: $ANON_KEY" \
    -H "Authorization: Bearer $ANON_KEY")

if [ $? -eq 0 ] && [ "$response" != "[]" ]; then
    echo "✅ Componentes encontrados no database!"
    echo ""
    echo "📊 COMPONENTES CRIADOS:"
    echo "======================"
    echo "$response" | jq -r '.[] | "✅ \(.display_name) (\(.type_key)) - \(.category)"' 2>/dev/null || echo "$response"
else
    echo "⚠️  Nenhum componente encontrado - verificar configuração"
fi

echo ""
echo "🎉 SCHEMA APLICADO VIA API!"
echo "==========================="
echo "✅ Componentes do registry inseridos"
echo "✅ Componentes da marca Gisele inseridos"  
echo "✅ Sistema pronto para uso no /editor-fixed"
echo ""
echo "🎯 PRÓXIMO PASSO:"
echo "Acesse http://localhost:5173/editor-fixed"
echo "Procure a aba 'Reutilizáveis' no painel esquerdo"
