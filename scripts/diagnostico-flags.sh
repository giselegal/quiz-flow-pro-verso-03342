#!/bin/bash

# 🧪 Script de Diagnóstico - Feature Flags

echo "🔍 DIAGNÓSTICO DE FEATURE FLAGS"
echo "================================"
echo ""

echo "📁 Verificando arquivos..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local existe"
    echo ""
    echo "📄 Conteúdo do .env.local:"
    cat .env.local | grep -E "VITE_.*UNIFIED"
else
    echo "❌ .env.local NÃO EXISTE!"
    echo ""
    echo "Criando .env.local..."
    cat > .env.local << 'EOF'
# 🚀 FEATURE FLAGS - EDITOR UNIFICADO
VITE_ENABLE_UNIFIED_EDITOR_FACADE=true
VITE_FORCE_UNIFIED_EDITOR=true
EOF
    echo "✅ .env.local criado"
fi

echo ""
echo "🌐 Servidor Vite:"
if pgrep -f "vite" > /dev/null; then
    echo "✅ Servidor rodando"
    echo "   PID: $(pgrep -f vite)"
else
    echo "❌ Servidor NÃO está rodando"
    echo ""
    echo "💡 Para reiniciar o servidor:"
    echo "   pkill -f vite && npm run dev"
fi

echo ""
echo "📋 INSTRUÇÕES:"
echo "1. Abra: http://localhost:8080/editor"
echo "2. Pressione F12 (abrir console)"
echo "3. Procure por: '🎛️ [ModernUnifiedEditor] Feature Flags:'"
echo "4. Verifique se env_FORCE e env_FACADE são 'true'"
echo ""
echo "Se aparecer 'undefined', o servidor precisa ser reiniciado:"
echo "   pkill -f vite && npm run dev"
echo ""
echo "✅ Diagnóstico completo!"
