#!/bin/bash

# 🚀 SCRIPT DE COMMIT E BUILD EM LOTE - Quiz Quest
# Uso: ./commit-build.sh "mensagem do commit"

set -e  # Para no primeiro erro

echo "🎯 INICIANDO PROCESSO DE COMMIT E BUILD..."
echo "=============================================="

# 1️⃣ VERIFICAR STATUS
echo "📋 1. Verificando status do repositório..."
git status --porcelain

# 2️⃣ ADICIONAR TODOS OS ARQUIVOS
echo ""
echo "📦 2. Adicionando todos os arquivos modificados..."
git add .

# 3️⃣ VERIFICAR ARQUIVOS ADICIONADOS
echo ""
echo "✅ 3. Arquivos que serão commitados:"
git diff --cached --name-only

# 4️⃣ FAZER COMMIT
COMMIT_MSG="${1:-Atualização: reorganização e melhorias dos editores}"
echo ""
echo "💾 4. Fazendo commit com mensagem: '$COMMIT_MSG'"
git commit -m "$COMMIT_MSG"

# 5️⃣ PULL PARA SINCRONIZAR
echo ""
echo "🔄 5. Sincronizando com origin/main..."
git pull origin main --no-edit

# 6️⃣ PUSH PARA ORIGIN
echo ""
echo "⬆️ 6. Enviando para origin/main..."
git push origin main

# 7️⃣ INSTALAR DEPENDÊNCIAS
echo ""
echo "📚 7. Instalando/atualizando dependências..."
npm install

# 8️⃣ FAZER BUILD
echo ""
echo "🏗️ 8. Fazendo build do projeto..."
npm run build

# 9️⃣ VERIFICAR SE DEV SERVER ESTÁ RODANDO
echo ""
echo "🔍 9. Verificando se servidor de desenvolvimento está ativo..."
if pgrep -f "vite" > /dev/null; then
    echo "✅ Servidor de desenvolvimento já está rodando"
else
    echo "🚀 Iniciando servidor de desenvolvimento..."
    npm run dev &
    echo "⏰ Aguardando servidor inicializar..."
    sleep 5
fi

# 🎉 SUCESSO
echo ""
echo "🎉 PROCESSO CONCLUÍDO COM SUCESSO!"
echo "=============================================="
echo "✅ Commit realizado: $COMMIT_MSG"
echo "✅ Push enviado para origin/main"
echo "✅ Build concluído"
echo "✅ Servidor rodando em: http://localhost:8086"
echo ""
echo "🎯 URLs de acesso:"
echo "   - Editor Principal: http://localhost:8086/editor"
echo "   - Editor Schema: http://localhost:8086/editor-schema"
echo "   - Dashboard: http://localhost:8086/admin"
echo ""
