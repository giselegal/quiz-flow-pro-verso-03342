#!/bin/bash

# 🚀 DEPLOY VERCEL - APÓS RAILWAY
# Execute este script APÓS obter URL do Railway

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DEPLOY VERCEL - PASSOS 2-7"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Solicitar URL do Railway
echo "📋 PASSO 2: Configurar URL do Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Cole a URL do Railway (ex: https://seu-projeto.up.railway.app): " RAILWAY_URL

if [ -z "$RAILWAY_URL" ]; then
    echo "❌ URL não fornecida"
    exit 1
fi

# Remover trailing slash
RAILWAY_URL=${RAILWAY_URL%/}

echo "✅ URL do Railway: $RAILWAY_URL"
echo ""

# Atualizar vercel.json
echo "Atualizando vercel.json..."
sed -i "s|https://seu-backend.railway.app|$RAILWAY_URL|g" vercel.json
echo "✅ vercel.json atualizado"
echo ""

# Testar backend
echo "Testando backend..."
if curl -f -s "${RAILWAY_URL}/api/health" > /dev/null 2>&1; then
    echo "✅ Backend respondendo"
else
    echo "⚠️  Backend não respondeu em /api/health"
    echo "   Verifique se o deploy está completo no Railway"
    read -p "Continuar mesmo assim? [y/N]: " CONTINUE
    if [ "$CONTINUE" != "y" ] && [ "$CONTINUE" != "Y" ]; then
        exit 1
    fi
fi
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 3: Deploy Frontend Vercel
# ═══════════════════════════════════════════════════════════════
echo "📋 PASSO 3: Deploy Frontend na Vercel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

echo "🚀 Iniciando deploy na Vercel..."
echo ""
echo "Escolha o tipo de deploy:"
echo "1) Production (--prod)"
echo "2) Preview (teste)"
echo ""
read -p "Opção [1-2]: " DEPLOY_TYPE

if [ "$DEPLOY_TYPE" = "1" ]; then
    vercel --prod
    DEPLOY_MODE="production"
else
    vercel
    DEPLOY_MODE="preview"
fi

echo ""
echo "✅ Deploy Vercel concluído"
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 4: Configurar Environment Variables
# ═══════════════════════════════════════════════════════════════
echo "📋 PASSO 4: Configurar Variáveis de Ambiente"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Configurar variáveis de ambiente agora? [y/N]: "
read -p "" CONFIG_ENV

if [ "$CONFIG_ENV" = "y" ] || [ "$CONFIG_ENV" = "Y" ]; then
    echo ""
    echo "Adicionando VITE_SUPABASE_URL..."
    vercel env add VITE_SUPABASE_URL production
    
    echo ""
    echo "Adicionando VITE_SUPABASE_ANON_KEY..."
    vercel env add VITE_SUPABASE_ANON_KEY production
    
    echo ""
    echo "✅ Variáveis configuradas"
    echo ""
    echo "Fazendo redeploy para aplicar variáveis..."
    vercel --prod
else
    echo "⏭️  Pule para configurar depois via dashboard:"
    echo "   https://vercel.com/[seu-projeto]/settings/environment-variables"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 5: Instruções Supabase Auth
# ═══════════════════════════════════════════════════════════════
echo "📋 PASSO 5: Configurar Supabase Auth URLs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Acesse:"
echo "   https://supabase.com/dashboard/project/pwtjuuhchtbzttrzoutw/auth/url-configuration"
echo ""
echo "2. Configure:"
echo "   Site URL: [SUA URL VERCEL]"
echo "   Redirect URLs:"
echo "   - [SUA URL VERCEL]/auth"
echo "   - [SUA URL VERCEL]/auth/callback"
echo ""
read -p "Pressione Enter quando terminar..."
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 6: Smoke Tests
# ═══════════════════════════════════════════════════════════════
echo "📋 PASSO 6: Executar Smoke Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Cole a URL da Vercel (ex: https://quiz-flow-pro.vercel.app): " VERCEL_URL

if [ -n "$VERCEL_URL" ]; then
    echo ""
    echo "Testando API via Vercel..."
    if curl -f -s "${VERCEL_URL}/api/health" | grep -q "ok"; then
        echo "✅ API funcionando através da Vercel"
    else
        echo "⚠️  API não respondeu corretamente"
    fi
    
    echo ""
    echo "Executando smoke tests completos..."
    STAGING_URL="$VERCEL_URL" ./scripts/smoke-tests.sh || true
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 7: RLS Policies
# ═══════════════════════════════════════════════════════════════
echo "📋 PASSO 7: Aplicar RLS Policies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Aplicar políticas RLS agora? [y/N]: "
read -p "" APPLY_RLS

if [ "$APPLY_RLS" = "y" ] || [ "$APPLY_RLS" = "Y" ]; then
    ./scripts/apply-rls-manual.sh
else
    echo "⏭️  Aplique depois com:"
    echo "   ./scripts/apply-rls-manual.sh"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOY COMPLETO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 URLs:"
echo "   Backend:  $RAILWAY_URL"
echo "   Frontend: $VERCEL_URL"
echo ""
echo "📋 Próximos passos:"
echo "   1. Testar aplicação completa"
echo "   2. Configurar custom domain (opcional)"
echo "   3. Monitorar logs"
echo ""
