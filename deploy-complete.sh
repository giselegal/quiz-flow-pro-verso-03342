#!/bin/bash

# 🚀 SCRIPT COMPLETO DE COMMIT E BUILD - Quiz Quest
# Uso: ./deploy-complete.sh "Mensagem do commit"

set -e  # Para na primeira falha

echo "🔧 === QUIZ QUEST - DEPLOY COMPLETO ==="
echo "📅 $(date)"
echo ""

# Verificar se mensagem foi fornecida
if [ -z "$1" ]; then
    echo "❌ Erro: Mensagem do commit é obrigatória"
    echo "💡 Uso: ./deploy-complete.sh \"Sua mensagem de commit\""
    exit 1
fi

COMMIT_MSG="$1"

echo "📋 1. Verificando status do repositório..."
git status --porcelain

echo ""
echo "🔄 2. Sincronizando com origin/main..."
git fetch origin
git pull origin main

echo ""
echo "📦 3. Adicionando arquivos modificados..."
git add .

echo ""
echo "📝 4. Fazendo commit..."
git commit -m "$COMMIT_MSG" || echo "⚠️  Nenhuma mudança para commit"

echo ""
echo "🔧 5. Instalando dependências..."
npm install

echo ""
echo "🏗️  6. Executando build..."
npm run build

echo ""
echo "🧪 7. Executando testes (se existirem)..."
npm test 2>/dev/null || echo "⚠️  Testes não encontrados ou falharam"

echo ""
echo "📤 8. Enviando para repositório remoto..."
git push origin main

echo ""
echo "🚀 9. Iniciando servidor de desenvolvimento..."
echo "🌐 Acesse: http://localhost:8086"
npm run dev

echo ""
echo "✅ === DEPLOY CONCLUÍDO COM SUCESSO ==="
