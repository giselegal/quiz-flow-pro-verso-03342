#!/bin/bash

# 🚂 DEPLOY BACKEND NO RAILWAY
# Deploy do servidor Express separadamente

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚂 RAILWAY BACKEND DEPLOY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ═══════════════════════════════════════════════════════════════
# [1/5] Verificar Railway CLI
# ═══════════════════════════════════════════════════════════════
echo "[1/5] Verificando Railway CLI..."

if ! command -v railway &> /dev/null; then
    echo "📦 Instalando Railway CLI..."
    npm install -g @railway/cli
    echo "✅ Railway CLI instalado"
else
    echo "✅ Railway CLI já instalado"
fi
echo ""

# ═══════════════════════════════════════════════════════════════
# [2/5] Login
# ═══════════════════════════════════════════════════════════════
echo "[2/5] Verificando autenticação..."

if ! railway whoami &> /dev/null; then
    echo "🔐 Fazendo login no Railway..."
    railway login
    echo "✅ Login concluído"
else
    echo "✅ Já autenticado: $(railway whoami)"
fi
echo ""

# ═══════════════════════════════════════════════════════════════
# [3/5] Criar/Selecionar projeto
# ═══════════════════════════════════════════════════════════════
echo "[3/5] Configurando projeto..."

if [ ! -f ".railway" ]; then
    echo "📝 Criando novo projeto Railway..."
    railway init
else
    echo "✅ Projeto Railway já configurado"
fi
echo ""

# ═══════════════════════════════════════════════════════════════
# [4/5] Configurar variáveis de ambiente
# ═══════════════════════════════════════════════════════════════
echo "[4/5] Configurando variáveis de ambiente..."

echo "Configurar variáveis? [y/N]: "
read -p "" CONFIGURE_ENV

if [ "$CONFIGURE_ENV" = "y" ] || [ "$CONFIGURE_ENV" = "Y" ]; then
    echo ""
    echo "Adicione as seguintes variáveis no Railway Dashboard:"
    echo "https://railway.app/dashboard"
    echo ""
    echo "VITE_SUPABASE_URL=https://pwtjuuhchtbzttrzoutw.supabase.co"
    echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    echo "NODE_ENV=production"
    echo "PORT=5000"
    echo ""
    echo "Pressione Enter quando terminar..."
    read
fi
echo ""

# ═══════════════════════════════════════════════════════════════
# [5/5] Deploy
# ═══════════════════════════════════════════════════════════════
echo "[5/5] Fazendo deploy..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

railway up

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOY CONCLUÍDO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Obter URL do deploy
BACKEND_URL=$(railway domain 2>/dev/null || echo "")

if [ -n "$BACKEND_URL" ]; then
    echo -e "${GREEN}🌍 Backend URL:${NC} https://$BACKEND_URL"
    echo ""
    echo "📋 Próximos passos:"
    echo ""
    echo "1. Testar backend:"
    echo "   curl https://$BACKEND_URL/api/health"
    echo ""
    echo "2. Atualizar vercel.json:"
    echo "   Alterar 'destination' de /api/* para:"
    echo "   https://$BACKEND_URL/api/:path*"
    echo ""
    echo "3. Deploy frontend na Vercel:"
    echo "   vercel --prod"
    echo ""
else
    echo "⚠️  URL do backend não obtida automaticamente"
    echo ""
    echo "📋 Próximos passos:"
    echo ""
    echo "1. Obter URL no Railway Dashboard:"
    echo "   https://railway.app/dashboard"
    echo ""
    echo "2. Testar backend:"
    echo "   curl https://seu-projeto.railway.app/api/health"
    echo ""
    echo "3. Atualizar vercel.json:"
    echo "   Alterar 'destination' de /api/* para sua URL"
    echo ""
    echo "4. Deploy frontend:"
    echo "   vercel --prod"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
