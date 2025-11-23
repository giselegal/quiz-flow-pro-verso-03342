#!/bin/bash

# 🚀 SCRIPT DE DEPLOY COMPLETO PARA STAGING
# Executa build, validações e prepara para deploy

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DEPLOY STAGING - QUIZ FLOW PRO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ═══════════════════════════════════════════════════════════════
# [1/5] Verificar variáveis de ambiente
# ═══════════════════════════════════════════════════════════════
echo "[1/5] Verificando variáveis de ambiente..."

if [ ! -f ".env" ]; then
    echo "❌ Arquivo .env não encontrado"
    echo "💡 Copie .env.example para .env e configure as variáveis"
    exit 1
fi

# Carregar .env
source .env

if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Variáveis Supabase não configuradas"
    echo "   VITE_SUPABASE_URL: ${VITE_SUPABASE_URL:-FALTANDO}"
    echo "   VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY:-FALTANDO}"
    exit 1
fi

echo "✅ Variáveis configuradas:"
echo "   VITE_SUPABASE_URL: $VITE_SUPABASE_URL"
echo "   VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY:0:20}..."
echo ""

# ═══════════════════════════════════════════════════════════════
# [2/5] Limpar build anterior
# ═══════════════════════════════════════════════════════════════
echo "[2/5] Limpando build anterior..."

if [ -d "dist" ]; then
    rm -rf dist
    echo "✅ Diretório dist removido"
else
    echo "ℹ️  Nenhum build anterior encontrado"
fi
echo ""

# ═══════════════════════════════════════════════════════════════
# [3/5] Build de produção
# ═══════════════════════════════════════════════════════════════
echo "[3/5] Executando build de produção..."

if npm run build > /tmp/build-staging.log 2>&1; then
    echo "✅ Build concluído com sucesso"
    
    # Verificar tamanho do bundle
    if [ -d "dist" ]; then
        BUNDLE_SIZE=$(du -sh dist | cut -f1)
        echo "   📦 Tamanho do bundle: $BUNDLE_SIZE"
        
        # Listar principais chunks
        echo "   📄 Principais arquivos:"
        find dist -name "*.js" -type f -exec du -h {} \; | sort -rh | head -5 | while read size file; do
            echo "      $size - $(basename $file)"
        done
    fi
else
    echo "❌ Erro no build:"
    tail -30 /tmp/build-staging.log
    exit 1
fi
echo ""

# ═══════════════════════════════════════════════════════════════
# [4/5] Validar build
# ═══════════════════════════════════════════════════════════════
echo "[4/5] Validando build..."

# Verificar index.html
if [ -f "dist/index.html" ]; then
    echo "✅ index.html gerado"
else
    echo "❌ index.html não encontrado"
    exit 1
fi

# Verificar assets
if [ -d "dist/assets" ]; then
    JS_COUNT=$(find dist/assets -name "*.js" -type f | wc -l)
    CSS_COUNT=$(find dist/assets -name "*.css" -type f | wc -l)
    echo "✅ Assets gerados:"
    echo "   JavaScript: $JS_COUNT arquivos"
    echo "   CSS: $CSS_COUNT arquivos"
else
    echo "❌ Diretório assets não encontrado"
    exit 1
fi
echo ""

# ═══════════════════════════════════════════════════════════════
# [5/5] Preparar para deploy
# ═══════════════════════════════════════════════════════════════
echo "[5/5] Preparando instruções de deploy..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ BUILD PRONTO PARA DEPLOY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 Diretório de deploy: dist/"
echo "📊 Bundle size: $BUNDLE_SIZE"
echo ""
echo "🚀 Opções de deploy:"
echo ""
echo "OPÇÃO 1 - Netlify:"
echo "  npx netlify-cli deploy --dir=dist --prod"
echo ""
echo "OPÇÃO 2 - Vercel:"
echo "  npx vercel --prod"
echo ""
echo "OPÇÃO 3 - Manual:"
echo "  1. Faça upload do conteúdo de dist/ para seu servidor"
echo "  2. Configure redirect rules para SPA (index.html)"
echo ""
echo "⚠️  IMPORTANTE:"
echo "  1. Configure variáveis de ambiente no serviço de hosting:"
echo "     VITE_SUPABASE_URL=$VITE_SUPABASE_URL"
echo "     VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY"
echo ""
echo "  2. Configure redirect URLs no Supabase Dashboard:"
echo "     https://supabase.com/dashboard/project/pwtjuuhchtbzttrzoutw/auth/url-configuration"
echo ""
echo "  3. Adicione seu domínio de staging em 'Site URL' e 'Redirect URLs'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Gerar relatório de deploy
DEPLOY_REPORT="docs/STAGING_DEPLOY_REPORT.md"

cat > "$DEPLOY_REPORT" << EOF
# 🚀 RELATÓRIO DE DEPLOY - STAGING

**Data:** $(date +"%Y-%m-%d %H:%M:%S")  
**Status:** ✅ BUILD PRONTO  
**Bundle Size:** $BUNDLE_SIZE

---

## ✅ Build Validado

### Arquivos Gerados
- \`index.html\` ✅
- JavaScript: $JS_COUNT arquivos ✅
- CSS: $CSS_COUNT arquivos ✅

### Principais Chunks
\`\`\`
$(find dist/assets -name "*.js" -type f -exec du -h {} \; | sort -rh | head -5 | while read size file; do echo "$size - $(basename $file)"; done)
\`\`\`

---

## 🔧 Configurações Necessárias

### 1. Variáveis de Ambiente
\`\`\`bash
VITE_SUPABASE_URL=$VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
\`\`\`

### 2. Supabase Auth URLs
Configure no dashboard: https://supabase.com/dashboard/project/pwtjuuhchtbzttrzoutw/auth/url-configuration

- **Site URL:** https://seu-dominio-staging.netlify.app
- **Redirect URLs:** 
  - https://seu-dominio-staging.netlify.app/auth/callback
  - https://seu-dominio-staging.netlify.app/

### 3. Redirect Rules (Netlify)
Arquivo \`netlify.toml\` já configurado:
\`\`\`toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
\`\`\`

---

## 🚀 Comandos de Deploy

### Netlify
\`\`\`bash
npx netlify-cli deploy --dir=dist --prod
\`\`\`

### Vercel
\`\`\`bash
npx vercel --prod
\`\`\`

---

## ✅ Checklist Pré-Deploy

- [x] Build compilado
- [x] Variáveis de ambiente verificadas
- [x] Bundle otimizado ($BUNDLE_SIZE)
- [ ] RLS policies aplicadas no Supabase
- [ ] Auth URLs configuradas
- [ ] Deploy executado
- [ ] Smoke tests

---

## 📋 Próximos Passos

1. **Aplicar RLS Policies:**
   \`\`\`bash
   chmod +x scripts/apply-rls-manual.sh
   ./scripts/apply-rls-manual.sh
   \`\`\`

2. **Fazer Deploy:**
   \`\`\`bash
   npx netlify-cli deploy --dir=dist --prod
   \`\`\`

3. **Configurar Auth no Supabase:**
   - Adicionar URL de staging
   - Habilitar confirmação de email (opcional)

4. **Executar Smoke Tests:**
   - Login/Signup
   - Criar funnel
   - Publicar
   - Responder quiz
   - Verificar analytics

---

**Status:** 🟢 Pronto para deploy
EOF

echo "📄 Relatório gerado: $DEPLOY_REPORT"
echo ""
