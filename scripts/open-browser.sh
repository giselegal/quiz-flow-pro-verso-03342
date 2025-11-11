#!/bin/bash

# 🌐 SCRIPT PARA ABRIR APLICAÇÃO NO NAVEGADOR PADRÃO
# Muito melhor que o Simple Browser limitado do VS Code!

PORT=${1:-8080}
URL="http://localhost:$PORT"

echo "🚀 Abrindo Quiz Flow Pro no navegador padrão..."
echo "📍 URL: $URL"

# Detectar o sistema operacional e usar o comando apropriado
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux (incluindo Ubuntu/Debian no VS Code dev container)
    if command -v xdg-open &> /dev/null; then
        xdg-open "$URL"
        echo "✅ Aberto com xdg-open"
    elif command -v sensible-browser &> /dev/null; then
        sensible-browser "$URL"
        echo "✅ Aberto com sensible-browser"
    elif command -v firefox &> /dev/null; then
        firefox "$URL" &
        echo "✅ Aberto no Firefox"
    elif command -v google-chrome &> /dev/null; then
        google-chrome "$URL" &
        echo "✅ Aberto no Chrome"
    elif command -v chromium-browser &> /dev/null; then
        chromium-browser "$URL" &
        echo "✅ Aberto no Chromium"
    else
        echo "❌ Nenhum navegador encontrado no Linux"
        echo "🔧 Tente manualmente: $URL"
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$URL"
    echo "✅ Aberto no macOS"
elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    start "$URL"
    echo "✅ Aberto no Windows"
else
    echo "❓ Sistema operacional não reconhecido: $OSTYPE"
    echo "🔧 Abra manualmente: $URL"
fi

echo ""
echo "💡 DICAS:"
echo "   • Use Ctrl+Click no terminal para abrir links"
echo "   • O Simple Browser do VS Code é muito limitado"
echo "   • Navegadores externos funcionam muito melhor!"
echo "   • Para port forwarding: F1 > 'Ports: Focus on Ports View'"