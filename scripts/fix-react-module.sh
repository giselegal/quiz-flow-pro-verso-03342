#!/bin/bash

# 🔧 Script para corrigir erro de módulo React
# Resolve: "Cannot read properties of undefined (reading 'exports')"

set -e

echo "🔧 Iniciando correção do módulo React..."

# 1. Matar processos na porta 8080
echo "📡 Verificando processos na porta 8080..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || echo "✅ Porta 8080 livre"

# 2. Limpar caches do Vite
echo "🧹 Limpando caches do Vite..."
rm -rf node_modules/.vite
rm -rf dist
rm -rf .vite

# 3. Limpar cache do navegador (instruções)
echo "
⚠️  IMPORTANTE: Limpar cache do navegador
   - Chrome/Edge: Ctrl+Shift+Delete → Limpar cache
   - Firefox: Ctrl+Shift+Delete → Cache
   - Ou use modo anônimo para testar
"

# 4. Verificar versões do React
echo "📦 Verificando versões do React..."
npm list react react-dom --depth=0 || true

# 5. Reinstalar dependências (se necessário)
read -p "Deseja reinstalar as dependências? (s/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]
then
    echo "📦 Reinstalando dependências..."
    rm -rf node_modules package-lock.json
    npm install --prefer-offline
fi

# 6. Build com limpeza
echo "🏗️  Fazendo build limpo..."
npm run build

echo "
✅ Correção concluída!

📋 Próximos passos:
   1. Limpe o cache do navegador (Ctrl+Shift+Delete)
   2. Inicie o servidor: npm run dev
   3. Acesse em modo anônimo para testar
   4. Verifique se não há erros no console

🔍 Se o erro persistir, verifique:
   - Configurações do Lovable estão desabilitadas
   - Não há requisições para api.lovable.dev
   - Console não mostra erro 405
"
