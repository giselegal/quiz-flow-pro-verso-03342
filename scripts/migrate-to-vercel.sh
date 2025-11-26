#!/bin/bash

# 🔄 MIGRAÇÃO NETLIFY → VERCEL
# Script automatizado para migração completa

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 MIGRAÇÃO: NETLIFY → VERCEL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ═══════════════════════════════════════════════════════════════
# [1/6] Verificar arquivos existentes
# ═══════════════════════════════════════════════════════════════
echo "[1/6] Verificando arquivos existentes..."

if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml encontrado"
    HAS_NETLIFY=true
else
    echo "⚠️  netlify.toml não encontrado"
    HAS_NETLIFY=false
fi

if [ -f "vercel.json" ]; then
    echo -e "${YELLOW}⚠️  vercel.json já existe${NC}"
    read -p "Deseja sobrescrever? [y/N]: " OVERWRITE
    if [ "$OVERWRITE" != "y" ] && [ "$OVERWRITE" != "Y" ]; then
        echo "❌ Migração cancelada"
        exit 1
    fi
fi
echo ""

# ═══════════════════════════════════════════════════════════════
# [2/6] Backup do netlify.toml
# ═══════════════════════════════════════════════════════════════
echo "[2/6] Criando backup..."

if [ "$HAS_NETLIFY" = true ]; then
    BACKUP_FILE="netlify.toml.backup.$(date +%Y%m%d_%H%M%S)"
    cp netlify.toml "$BACKUP_FILE"
    echo "✅ Backup criado: $BACKUP_FILE"
else
    echo "⏭️  Nenhum backup necessário"
fi
echo ""

# ═══════════════════════════════════════════════════════════════
# [3/6] Criar vercel.json
# ═══════════════════════════════════════════════════════════════
echo "[3/6] Criando vercel.json..."

cat > vercel.json << 'EOF'
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  
  "redirects": [
    {
      "source": "/admin/dashboard",
      "destination": "/admin",
      "permanent": true
    },
    {
      "source": "/editor-pro/:path*",
      "destination": "/editor",
      "permanent": true
    },
    {
      "source": "/editor-modular/:path*",
      "destination": "/editor",
      "permanent": true
    },
    {
      "source": "/editor-v1/:path*",
      "destination": "/editor",
      "permanent": true
    },
    {
      "source": "/editor-fixed/:path*",
      "destination": "/editor",
      "permanent": true
    }
  ],
  
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*\\.js)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*\\.css)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  
  "regions": ["iad1"],
  
  "github": {
    "enabled": true,
    "autoAlias": true,
    "silent": false
  }
}
EOF

echo "✅ vercel.json criado"
echo ""

# ═══════════════════════════════════════════════════════════════
# [4/6] Validar build
# ═══════════════════════════════════════════════════════════════
echo "[4/6] Validando build..."

if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
    echo "⚠️  Build não encontrado, executando npm run build..."
    npm run build
    echo "✅ Build concluído"
else
    echo "✅ Build já existe"
fi
echo ""

# ═══════════════════════════════════════════════════════════════
# [5/6] Instalar Vercel CLI
# ═══════════════════════════════════════════════════════════════
echo "[5/6] Verificando Vercel CLI..."

if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI instalado"
else
    echo "✅ Vercel CLI já instalado"
fi
echo ""

# ═══════════════════════════════════════════════════════════════
# [6/6] Resumo e próximos passos
# ═══════════════════════════════════════════════════════════════
echo "[6/6] Resumo da migração..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ MIGRAÇÃO CONCLUÍDA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✓${NC} vercel.json criado"
echo -e "${GREEN}✓${NC} Build validado"
echo -e "${GREEN}✓${NC} Vercel CLI instalado"
if [ "$HAS_NETLIFY" = true ]; then
    echo -e "${GREEN}✓${NC} Backup criado: $BACKUP_FILE"
fi
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📋 PRÓXIMOS PASSOS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  Deploy Preview (teste):"
echo "   vercel"
echo ""
echo "2️⃣  Deploy Production:"
echo "   vercel --prod"
echo ""
echo "3️⃣  Configurar variáveis de ambiente:"
echo "   vercel env add VITE_SUPABASE_URL"
echo "   vercel env add VITE_SUPABASE_ANON_KEY"
echo ""
echo "4️⃣  Atualizar Supabase Auth URLs:"
echo "   https://supabase.com/dashboard/project/your-supabase-project-ref/auth/url-configuration"
echo ""
echo "   Adicionar:"
echo "   • https://seu-projeto.vercel.app"
echo "   • https://seu-projeto.vercel.app/auth"
echo "   • https://seu-projeto.vercel.app/auth/callback"
echo ""
echo "5️⃣  Smoke tests:"
echo "   STAGING_URL=https://seu-projeto.vercel.app ./scripts/smoke-tests.sh"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}💡 DICA:${NC} Mantenha o backup do netlify.toml caso precise reverter"
echo ""
echo "Quer fazer o deploy agora? [y/N]: "
read -p "" DO_DEPLOY

if [ "$DO_DEPLOY" = "y" ] || [ "$DO_DEPLOY" = "Y" ]; then
    echo ""
    echo "🚀 Iniciando deploy..."
    ./scripts/deploy-vercel.sh
else
    echo ""
    echo "✅ Migração completa! Execute './scripts/deploy-vercel.sh' quando estiver pronto."
fi
