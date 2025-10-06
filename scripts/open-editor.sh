#!/bin/bash
# 🌐 Abrir Editor no Browser

set -e

PORT=8080
URL="http://localhost:${PORT}/editor"

echo "🚀 Abrindo Editor Unificado no browser..."
echo "URL: $URL"
echo

# Detectar sistema operacional e abrir browser
if command -v xdg-open > /dev/null; then
    # Linux
    xdg-open "$URL"
elif command -v open > /dev/null; then
    # macOS
    open "$URL"
elif command -v start > /dev/null; then
    # Windows
    start "$URL"
else
    echo "⚠️  Não foi possível abrir o browser automaticamente."
    echo "Por favor, abra manualmente: $URL"
fi

echo "✅ Se o browser não abriu, acesse:"
echo "   $URL"
echo
echo "💡 Dica: Abra o console do browser (F12) para ver os logs"
