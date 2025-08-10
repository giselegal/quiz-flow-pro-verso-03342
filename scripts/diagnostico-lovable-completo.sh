#!/bin/bash

echo "🔍 DIAGNÓSTICO COMPLETO DO LOVABLE"
echo "=================================="

echo ""
echo "1. 📦 Verificando dependências..."
echo "--------------------------------"

# Verificar se lovable-tagger está instalado
if npm list lovable-tagger > /dev/null 2>&1; then
    echo "✅ lovable-tagger instalado"
    npm list lovable-tagger | grep lovable-tagger
else
    echo "❌ lovable-tagger NÃO encontrado"
    echo "💡 Execute: npm install lovable-tagger"
fi

echo ""
echo "2. ⚙️ Verificando configurações..."
echo "--------------------------------"

# Verificar vite.config.ts
if grep -q "componentTagger" vite.config.ts; then
    echo "✅ componentTagger configurado no vite.config.ts"
    grep -n "componentTagger" vite.config.ts
else
    echo "❌ componentTagger NÃO encontrado no vite.config.ts"
fi

# Verificar LovableClientProvider
if [ -f "src/components/LovableClientProvider.tsx" ]; then
    echo "✅ LovableClientProvider existe"
    if grep -q "LOVABLE_CONFIG" src/components/LovableClientProvider.tsx; then
        echo "✅ LOVABLE_CONFIG configurado"
    fi
else
    echo "❌ LovableClientProvider NÃO encontrado"
fi

echo ""
echo "3. 🌐 Verificando URLs e ambiente..."
echo "-----------------------------------"

# Verificar se estamos no ambiente correto
echo "🌍 Ambiente atual: ${NODE_ENV:-development}"
echo "🔗 Servidor ativo: http://localhost:8084/"

echo ""
echo "4. 🚀 URLs para ativar Lovable:"
echo "------------------------------"
echo "• http://localhost:8084/?lovable=true"
echo "• http://localhost:8084/editor-fixed?lovable=true"
echo "• http://localhost:8084/admin"
echo "• http://localhost:8084/?activate=lovable"

echo ""
echo "5. 🔧 Comandos úteis:"
echo "--------------------"
echo "• Reinstalar lovable-tagger: npm install lovable-tagger@latest"
echo "• Verificar logs do Vite: Abrir DevTools (F12) e verificar console"
echo "• Forçar reload: Ctrl+Shift+R ou Cmd+Shift+R"

echo ""
echo "6. 📊 Verificando processo Vite..."
echo "----------------------------------"
if pgrep -f "vite.*--host.*8080" > /dev/null; then
    echo "✅ Processo Vite ativo"
    echo "🔄 Porta sendo usada: 8084 (fallback automático)"
else
    echo "❌ Processo Vite não encontrado"
    echo "💡 Execute: npm run dev"
fi

echo ""
echo "7. 🎯 Soluções específicas para problemas comuns:"
echo "================================================"

echo ""
echo "❌ Se as atualizações não aparecem:"
echo "  1. Abra DevTools (F12)"
echo "  2. Vá para a aba Console"
echo "  3. Procure por erros relacionados ao lovable-tagger"
echo "  4. Verifique se a URL contém ?lovable=true"

echo ""
echo "❌ Se o componentTagger não funciona:"
echo "  1. Verifique se está em modo development"
echo "  2. Reinstale: npm install lovable-tagger@latest"
echo "  3. Reinicie o servidor: npm run dev"

echo ""
echo "❌ Se LOVABLE_CONFIG não carrega:"
echo "  1. Verifique se está na URL correta"
echo "  2. Use o botão 'Ativar Lovable' no painel de debug"
echo "  3. Verifique se LovableClientProvider está no App.tsx"

echo ""
echo "✅ DIAGNÓSTICO COMPLETO!"
echo "========================"
echo "🔍 Próximos passos:"
echo "1. Abrir http://localhost:8084/editor-fixed?lovable=true"
echo "2. Verificar o painel azul do 'Lovable Status' no canto superior direito"
echo "3. Clicar em 'Ativar Lovable' se necessário"
echo "4. Verificar console do DevTools para erros"
