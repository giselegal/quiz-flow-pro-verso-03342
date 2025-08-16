#!/bin/bash

# 🚀 CARREGAR ETAPA 1 NO EDITOR
echo "🚀 CARREGANDO ETAPA 1 NO EDITOR"
echo "==============================="

echo ""
echo "✅ ÓTIMO! Os componentes estão funcionando!"
echo "   • TextInlineBlock ✅"
echo "   • HeadingInlineBlock ✅" 
echo "   • ImageDisplayInlineBlock ✅"
echo "   • ButtonInlineBlock ✅"

echo ""
echo "❌ PROBLEMA: Conteúdo padrão em vez da Etapa 1"
echo "   • 'Digite seu texto aqui...' em vez de conteúdo real"
echo "   • 'Título' em vez de 'Chega de um guarda-roupa...'"
echo "   • 'Clique aqui' em vez de '✨ Quero Descobrir...'"

echo ""
echo "🎯 SOLUÇÃO: Carregar dados da Etapa 1"

# Criar arquivo de dados da Etapa 1 para carregar no editor
echo ""
echo "📋 CRIANDO DADOS DA ETAPA 1..."

cat > etapa1-para-editor.json << 'EOF'
{
  "stepNumber": 1,
  "stepName": "Introdução",
  "blocks": [
    {
      "id": "step01-logo-image",
      "type": "image",
      "properties": {
        "src": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "alt": "Logo Gisele Galvão",
        "width": 120,
        "height": 120,
        "className": "mx-auto mb-4"
      }
    },
    {
      "id": "step01-progress-text",
      "type": "text",
      "properties": {
        "content": "Progresso: 0% • Etapa 1 de 21",
        "fontSize": "text-sm",
        "textAlign": "text-center",
        "color": "#8F7A6A"
      }
    },
    {
      "id": "step01-decorative-divider", 
      "type": "divider",
      "properties": {
        "color": "#B89B7A",
        "thickness": 4,
        "style": "solid"
      }
    },
    {
      "id": "step01-main-heading",
      "type": "heading", 
      "properties": {
        "content": "Chega de um guarda-roupa lotado e da sensação de que nada combina com você.",
        "level": 1,
        "fontSize": "text-3xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818"
      }
    },
    {
      "id": "step01-hero-image",
      "type": "image",
      "properties": {
        "src": "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp",
        "alt": "Transforme seu guarda-roupa", 
        "width": 600,
        "height": 400,
        "className": "object-cover w-full max-w-2xl h-80 rounded-xl mx-auto shadow-lg"
      }
    },
    {
      "id": "step01-motivation-text",
      "type": "text",
      "properties": {
        "content": "Em poucos minutos, descubra seu <strong style=\"color: #B89B7A;\">Estilo Predominante</strong> — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.",
        "fontSize": "text-xl",
        "textAlign": "text-center",
        "color": "#432818"
      }
    },
    {
      "id": "step01-name-label",
      "type": "text", 
      "properties": {
        "content": "COMO VOCÊ GOSTARIA DE SER CHAMADA?",
        "fontSize": "text-lg",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818"
      }
    },
    {
      "id": "step01-name-placeholder",
      "type": "text",
      "properties": {
        "content": "[CAMPO DE NOME - Digite seu nome aqui...]",
        "fontSize": "text-base",
        "textAlign": "text-center",
        "color": "#8F7A6A",
        "backgroundColor": "#F9F7F5",
        "borderRadius": "rounded-lg",
        "border": "2px dashed #B89B7A"
      }
    },
    {
      "id": "step01-cta-button",
      "type": "button",
      "properties": {
        "text": "✨ Quero Descobrir meu Estilo Agora! ✨",
        "variant": "primary",
        "size": "large",
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "textAlign": "text-center",
        "borderRadius": "rounded-full"
      }
    },
    {
      "id": "step01-legal-text",
      "type": "text",
      "properties": {
        "content": "🛡️ Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade.<br><br>© 2025 Gisele Galvão - Todos os direitos reservados",
        "fontSize": "text-xs",
        "textAlign": "text-center",
        "color": "#6B7280"
      }
    }
  ]
}
EOF

echo "   ✅ Arquivo etapa1-para-editor.json criado"

echo ""
echo "🔧 PRÓXIMOS PASSOS:"
echo "   1. ✅ Componentes funcionam (FEITO)"
echo "   2. ⏳ Carregar dados da Etapa 1 no editor"
echo "   3. 🎯 Implementar botão 'Carregar Etapa 1'"
echo "   4. ✏️ Testar edição de propriedades"

echo ""
echo "🎯 SOLUÇÃO RÁPIDA:"
echo "   • Adicionar um botão no editor para carregar a Etapa 1"
echo "   • Ou implementar carregamento automático da Etapa 1"
echo "   • Usar os dados do arquivo etapa1-para-editor.json"

echo ""
echo "✅ AGORA PRECISO IMPLEMENTAR O CARREGAMENTO!"
echo "   Vou adicionar funcionalidade para carregar a Etapa 1 automaticamente."
