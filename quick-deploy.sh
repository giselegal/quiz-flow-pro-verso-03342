#!/bin/bash

# ⚡ SCRIPT RÁPIDO DE COMMIT - Quiz Quest
# Uso: ./quick-deploy.sh ou ./quick-deploy.sh "mensagem personalizada"

echo "⚡ === COMMIT RÁPIDO - QUIZ QUEST ==="

# Mensagem padrão se não fornecida
MSG="${1:-"📝 Atualização: melhorias e correções - $(date +'%H:%M %d/%m')"}"

echo "📝 Mensagem: $MSG"
echo ""

echo "📦 Adicionando arquivos..."
git add .

echo "💾 Fazendo commit..."
git commit -m "$MSG"

echo "📤 Enviando para repositório..."
git push origin main

echo "✅ Commit concluído!"
echo "🌐 Editor disponível em: http://localhost:8086/editor"
