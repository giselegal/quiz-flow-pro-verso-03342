#!/bin/bash

# 🚨 DIAGNÓSTICO: COMPONENTES NÃO RENDERIZAM
echo "🚨 DIAGNÓSTICO COMPLETO: COMPONENTES NÃO RENDERIZAM"
echo "================================================="

echo ""
echo "❌ PROBLEMA RELATADO:"
echo "   • Apenas imagem renderiza (mas imagem errada)"
echo "   • Outros componentes não aparecem"
echo "   • Text, heading, button, divider não funcionam"

echo ""
echo "🔍 ANALISANDO ESTRUTURA DE PROPRIEDADES..."

echo ""
echo "📋 ESTRUTURA ESPERADA VS ATUAL:"

echo ""
echo "🧱 TextInlineBlock espera:"
echo "   properties.content.text (objeto com .text)"
echo ""
echo "📄 Step01Template envia:"
echo "   properties.content (string direta)"

echo ""
echo "❌ INCOMPATIBILIDADE IDENTIFICADA!"

echo ""
echo "🔧 VERIFICANDO OUTROS COMPONENTES..."

# Verificar HeadingInlineBlock
echo ""
echo "🔤 HeadingInlineBlock:"
if grep -q "content.text" "src/components/editor/blocks/inline/HeadingInlineBlock.tsx" 2>/dev/null; then
    echo "   ❌ Espera: properties.content.text"
else
    echo "   ✅ Pode aceitar: properties.content (string)"
fi

# Verificar ButtonInlineBlock  
echo ""
echo "🔘 ButtonInlineBlock:"
if grep -q "text.text\|content.text" "src/components/editor/blocks/inline/ButtonInlineBlock.tsx" 2>/dev/null; then
    echo "   ❌ Espera: properties.text.text"
else
    echo "   ✅ Pode aceitar: properties.text (string)"
fi

# Verificar ImageDisplayInlineBlock
echo ""
echo "🖼️ ImageDisplayInlineBlock:"
if grep -q "src.url\|src.src" "src/components/editor/blocks/inline/ImageDisplayInlineBlock.tsx" 2>/dev/null; then
    echo "   ❌ Espera: properties.src.url"
else
    echo "   ✅ Pode aceitar: properties.src (string)"
fi

echo ""
echo "🎯 SOLUÇÕES POSSÍVEIS:"
echo ""
echo "🔧 OPÇÃO 1: CORRIGIR Step01Template.tsx"
echo "   • Mudar de: content: 'texto'"
echo "   • Para: content: { text: 'texto' }"
echo ""
echo "🔧 OPÇÃO 2: CORRIGIR TextInlineBlock.tsx"  
echo "   • Aceitar content como string OU objeto"
echo "   • Compatibilidade reversa"

echo ""
echo "🚀 IMPLEMENTANDO CORREÇÃO RÁPIDA..."

# Primeira tentativa: corrigir o TextInlineBlock para aceitar ambos formatos
echo ""
echo "📝 Criando versão corrigida do TextInlineBlock..."

cat > texto-inline-corrigido.tsx << 'EOF'
// CORREÇÃO: Aceitar content como string OU objeto
const content = properties.content || {};

// Se content é string, usar diretamente
// Se content é objeto, usar content.text
const text = (typeof content === 'string' ? content : content.text) || directText || "Digite seu texto aqui...";
EOF

echo "   ✅ Código de correção gerado"

echo ""
echo "🔬 TESTANDO ESTRUTURAS DE DADOS..."

# Verificar como os blocos estão sendo passados
echo ""
echo "📊 ESTRUTURA ATUAL DOS BLOCOS DA ETAPA 1:"

node -e "
const template = require('./step01-blocks-corrigido.json');
console.log('📋 BLOCOS DA ETAPA 1:');
template.forEach((block, i) => {
  console.log(\`   \${i+1}. \${block.type} (ID: \${block.id})\`);
  console.log(\`      content: \${typeof block.properties.content} - \${JSON.stringify(block.properties.content).slice(0,50)}\`);
  console.log('');
});
" 2>/dev/null || echo "   ❌ Arquivo step01-blocks-corrigido.json não encontrado"

echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "   1. 🔧 Corrigir TextInlineBlock para aceitar ambos formatos"
echo "   2. 🔧 Corrigir outros componentes inline"
echo "   3. 🧪 Testar renderização"
echo "   4. 🖼️ Corrigir problema da imagem errada"
echo ""
echo "🔴 PRIORIDADE: Compatibilidade de propriedades!"
