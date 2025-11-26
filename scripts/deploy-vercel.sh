#!/bin/bash

# 🚀 DEPLOY VERCEL - ONE-CLICK SCRIPT
# Instala Vercel CLI, faz login e deploy

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 VERCEL DEPLOY - QUIZ FLOW PRO"
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
# [2/4] Verificar vercel.json
# ═══════════════════════════════════════════════════════════════
echo "[2/4] Verificando configuração..."

if [ ! -f "vercel.json" ]; then
    echo "⚠️  vercel.json não encontrado"
    echo "Criando vercel.json com configuração padrão..."
    
    cat > vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
EOF
    echo "✅ vercel.json criado"
else
    echo "✅ vercel.json encontrado"
fi
echo ""

# ═══════════════════════════════════════════════════════════════
# [3/4] Instalar Vercel CLI (se necessário)
# ═══════════════════════════════════════════════════════════════
echo "[3/4] Verificando Vercel CLI..."

if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI instalado"
else
    echo "✅ Vercel CLI já instalado ($(vercel --version))"
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
echo "2) Preview (padrão)"
echo ""
read -p "Opção [1-2]: " DEPLOY_TYPE

if [ "$DEPLOY_TYPE" = "1" ]; then
    echo ""
    echo "🚀 Fazendo deploy de PRODUÇÃO..."
    echo ""
    vercel --prod
else
    echo ""
    echo "🧪 Fazendo deploy de PREVIEW..."
    echo ""
    vercel
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOY CONCLUÍDO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Configure variáveis de ambiente no Vercel:"
echo "   vercel env add VITE_SUPABASE_URL"
echo "   vercel env add VITE_SUPABASE_ANON_KEY"
echo ""
echo "   Ou via dashboard:"
echo "   https://vercel.com/[seu-projeto]/settings/environment-variables"
echo ""
echo "2. Configure URLs no Supabase Auth:"
echo "   https://supabase.com/dashboard/project/your-supabase-project-ref/auth/url-configuration"
echo ""
echo "3. Execute smoke tests:"
echo "   STAGING_URL=https://seu-projeto.vercel.app ./scripts/smoke-tests.sh"
echo ""
