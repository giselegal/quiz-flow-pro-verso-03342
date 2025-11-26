#!/bin/bash

# 🚀 DEPLOY NETLIFY - ONE-CLICK SCRIPT
# Instala Netlify CLI, faz login e deploy

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 NETLIFY DEPLOY - QUIZ FLOW PRO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ═══════════════════════════════════════════════════════════════
# [1/4] Verificar build
# ═══════════════════════════════════════════════════════════════
echo "[1/4] Verificando build..."

if [ ! -d "dist" ]; then
    echo "❌ Diretório dist/ não encontrado"
    echo "Execute primeiro: npm run build"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ index.html não encontrado em dist/"
    exit 1
fi

BUNDLE_SIZE=$(du -sh dist | cut -f1)
echo "✅ Build encontrado: $BUNDLE_SIZE"
echo ""

# ═══════════════════════════════════════════════════════════════
# [2/4] Instalar Netlify CLI (se necessário)
# ═══════════════════════════════════════════════════════════════
echo "[2/4] Verificando Netlify CLI..."

if ! command -v netlify &> /dev/null; then
    echo "📦 Instalando Netlify CLI..."
    npm install -g netlify-cli
    echo "✅ Netlify CLI instalado"
else
    echo "✅ Netlify CLI já instalado ($(netlify --version))"
fi
echo ""

# ═══════════════════════════════════════════════════════════════
# [3/4] Login (se necessário)
# ═══════════════════════════════════════════════════════════════
echo "[3/4] Verificando autenticação..."

if netlify status 2>&1 | grep -q "Not logged in"; then
    echo "🔐 Fazendo login no Netlify..."
    echo "Isso abrirá o navegador para autenticação."
    echo ""
    netlify login
    echo "✅ Login concluído"
else
    echo "✅ Já autenticado"
fi
echo ""

# ═══════════════════════════════════════════════════════════════
# [4/4] Deploy
# ═══════════════════════════════════════════════════════════════
echo "[4/4] Executando deploy..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Perguntar tipo de deploy
echo "Escolha o tipo de deploy:"
echo "1) Production (--prod)"
echo "2) Preview/Draft (sem --prod)"
echo ""
read -p "Opção [1-2]: " DEPLOY_TYPE

if [ "$DEPLOY_TYPE" = "1" ]; then
    echo ""
    echo "🚀 Fazendo deploy de PRODUÇÃO..."
    echo ""
    netlify deploy --dir=dist --prod
else
    echo ""
    echo "🧪 Fazendo deploy de PREVIEW..."
    echo ""
    netlify deploy --dir=dist
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOY CONCLUÍDO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Configure variáveis de ambiente no Netlify:"
echo "   https://app.netlify.com/sites/YOUR-SITE/settings/deploys#environment"
echo ""
echo "   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co"
echo "   VITE_SUPABASE_ANON_KEY=seu_anon_key"
echo ""
echo "2. Configure URLs no Supabase Auth:"
echo "   https://supabase.com/dashboard/project/your-supabase-project-ref/auth/url-configuration"
echo ""
echo "3. Execute smoke tests:"
echo "   STAGING_URL=https://seu-site.netlify.app ./scripts/smoke-tests.sh"
echo ""
