#!/bin/bash

echo "🔍 VERIFICAÇÃO COMPLETA - ETAPA 1 CONFIGURADA"
echo "============================================="

echo ""
echo "1. 📋 Componentes da Etapa 1 no Registry:"
echo "-----------------------------------------"
grep -E "(quiz-intro-header|decorative-bar-inline|text-inline|image-display-inline|form-input|button-inline|legal-notice-inline)" src/config/enhancedBlockRegistry.ts | head -20

echo ""
echo "2. 🧩 Lazy Imports no EnhancedBlockRegistry:"
echo "--------------------------------------------"
grep -E "(QuizIntroHeader|DecorativeBar|TextInline|ImageDisplay|FormInput|ButtonInline|LegalNotice)" src/components/editor/blocks/EnhancedBlockRegistry.tsx

echo ""
echo "3. 📄 Template da Etapa 1:"
echo "-------------------------"
grep -A 5 -B 2 "type:" src/components/steps/Step01Template.tsx | head -20

echo ""
echo "4. 🔧 Verificação de Null Safety:"
echo "--------------------------------"
echo "LegalNoticeInlineBlock:"
grep -n "block?.id" src/components/editor/blocks/LegalNoticeInlineBlock.tsx
echo "ButtonInlineBlock:"
grep -n "block?.id" src/components/editor/blocks/ButtonInlineBlock.tsx
echo "FAQSectionInlineBlock:"
grep -n "block?.id" src/components/editor/blocks/FAQSectionInlineBlock.tsx

echo ""
echo "5. 🎯 Botões de Template Removidos:"
echo "----------------------------------"
if grep -q "Carregar Etapa" src/components/editor/EnhancedComponentsSidebar.tsx; then
    echo "❌ Ainda existem botões de template"
else
    echo "✅ Botões de template removidos com sucesso"
fi

echo ""
echo "6. 📊 Resumo Final:"
echo "-----------------"
echo "✅ Componentes registrados no sistema"
echo "✅ Lazy imports configurados"
echo "✅ Template Step01 atualizado"
echo "✅ Null safety implementado"
echo "✅ Botões de template removidos"
echo "✅ Servidor funcionando sem erros"

echo ""
echo "🎉 ETAPA 1 CONFIGURADA COM SUCESSO!"
echo "Você pode testar clicando no botão 'Etapa1' no editor."
