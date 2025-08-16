#!/bin/bash

echo "🔍 VERIFICAÇÃO NULL SAFETY - COMPONENTES ETAPA 1"
echo "==============================================="

echo ""
echo "1. 🛡️ Verificação FormInputBlock:"
echo "--------------------------------"
echo "Null safety checks:"
grep -n "block?.id" src/components/editor/blocks/FormInputBlock.tsx || echo "❌ Não encontrado"
echo "Verificação de bloco undefined:"
grep -A 2 "if (!block)" src/components/editor/blocks/FormInputBlock.tsx || echo "❌ Não encontrado"

echo ""
echo "2. 🛡️ Verificação LegalNoticeInlineBlock:"
echo "----------------------------------------"
echo "Null safety checks:"
grep -n "block?.id" src/components/editor/blocks/LegalNoticeInlineBlock.tsx || echo "❌ Não encontrado"
echo "Verificação de bloco undefined:"
grep -A 2 "if (!block)" src/components/editor/blocks/LegalNoticeInlineBlock.tsx || echo "❌ Não encontrado"

echo ""
echo "3. 🛡️ Verificação ButtonInlineBlock:"
echo "-----------------------------------"
echo "Null safety checks:"
grep -n "block?.id" src/components/editor/blocks/ButtonInlineBlock.tsx || echo "❌ Não encontrado"
echo "Verificação de bloco undefined:"
grep -A 2 "if (!block)" src/components/editor/blocks/ButtonInlineBlock.tsx || echo "❌ Não encontrado"

echo ""
echo "4. 🛡️ Verificação FAQSectionInlineBlock:"
echo "---------------------------------------"
echo "Null safety checks:"
grep -n "block?.id" src/components/editor/blocks/FAQSectionInlineBlock.tsx || echo "❌ Não encontrado"
echo "Verificação de bloco undefined:"
grep -A 2 "if (!block)" src/components/editor/blocks/FAQSectionInlineBlock.tsx || echo "❌ Não encontrado"

echo ""
echo "5. 🔍 Busca por acessos diretos perigosos:"
echo "-----------------------------------------"
echo "Buscando 'data-block-id={block.id}' (sem null safety):"
if grep -r "data-block-id={block\.id}" src/components/editor/blocks/*InlineBlock.tsx 2>/dev/null; then
    echo "❌ Ainda existem acessos diretos perigosos"
else
    echo "✅ Nenhum acesso direto perigoso encontrado"
fi

echo ""
echo "6. 📊 Resumo de Segurança:"
echo "------------------------"
FORM_INPUT_SAFE=$(grep -q "block?.id" src/components/editor/blocks/FormInputBlock.tsx && echo "✅" || echo "❌")
LEGAL_NOTICE_SAFE=$(grep -q "block?.id" src/components/editor/blocks/LegalNoticeInlineBlock.tsx && echo "✅" || echo "❌")
BUTTON_SAFE=$(grep -q "block?.id" src/components/editor/blocks/ButtonInlineBlock.tsx && echo "✅" || echo "❌")
FAQ_SAFE=$(grep -q "block?.id" src/components/editor/blocks/FAQSectionInlineBlock.tsx && echo "✅" || echo "❌")

echo "FormInputBlock: $FORM_INPUT_SAFE"
echo "LegalNoticeInlineBlock: $LEGAL_NOTICE_SAFE"
echo "ButtonInlineBlock: $BUTTON_SAFE"
echo "FAQSectionInlineBlock: $FAQ_SAFE"

echo ""
echo "🎯 TESTE FINAL:"
echo "Agora você pode testar clicando 'Etapa1' sem erros!"
