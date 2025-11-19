#!/bin/bash

# 🔐 Setup GitHub Secrets
# Script para adicionar secrets do Supabase ao GitHub Actions
#
# REQUISITOS:
#   - GitHub CLI (gh) instalado
#   - Autenticado com permissões de admin
#
# USO:
#   bash scripts/setup-github-secrets.sh

set -e

echo "═══════════════════════════════════════════════════════════"
echo "🔐 CONFIGURAR GITHUB SECRETS"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Verificar GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) não está instalado!"
    echo "   Instale em: https://cli.github.com/"
    exit 1
fi

# Verificar autenticação
if ! gh auth status &> /dev/null; then
    echo "❌ Você não está autenticado no GitHub CLI!"
    echo "   Execute: gh auth login"
    exit 1
fi

REPO="giselegal/quiz-flow-pro-verso-03342"

echo "📦 Repositório: $REPO"
echo ""

# Ler valores do .env
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    exit 1
fi

# Extrair valores
SUPABASE_URL=$(grep VITE_SUPABASE_URL .env | cut -d '=' -f2)
SUPABASE_KEY=$(grep VITE_SUPABASE_ANON_KEY .env | cut -d '=' -f2)

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    echo "❌ Credenciais não encontradas no .env!"
    echo "   Verifique se as variáveis estão configuradas:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    exit 1
fi

echo "✅ Credenciais encontradas no .env"
echo ""

# Criar secrets
echo "🔄 Criando secret: VITE_SUPABASE_URL..."
if echo "$SUPABASE_URL" | gh secret set VITE_SUPABASE_URL -R "$REPO"; then
    echo "✅ VITE_SUPABASE_URL criado com sucesso!"
else
    echo "❌ Falha ao criar VITE_SUPABASE_URL"
    echo ""
    echo "⚠️  ERRO DE PERMISSÃO:"
    echo "   O token atual não tem permissão para criar secrets."
    echo ""
    echo "📝 SOLUÇÃO MANUAL:"
    echo "   1. Acesse: https://github.com/$REPO/settings/secrets/actions"
    echo "   2. Clique em 'New repository secret'"
    echo "   3. Name: VITE_SUPABASE_URL"
    echo "   4. Secret: $SUPABASE_URL"
    echo ""
    exit 1
fi

echo ""
echo "🔄 Criando secret: VITE_SUPABASE_ANON_KEY..."
if echo "$SUPABASE_KEY" | gh secret set VITE_SUPABASE_ANON_KEY -R "$REPO"; then
    echo "✅ VITE_SUPABASE_ANON_KEY criado com sucesso!"
else
    echo "❌ Falha ao criar VITE_SUPABASE_ANON_KEY"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ SECRETS CONFIGURADOS COM SUCESSO!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📋 Secrets criados:"
echo "   ✅ VITE_SUPABASE_URL"
echo "   ✅ VITE_SUPABASE_ANON_KEY"
echo ""
echo "🚀 Próximos passos:"
echo "   1. Testar workflow:"
echo "      https://github.com/$REPO/actions/workflows/sync-templates.yml"
echo ""
echo "   2. Executar manualmente:"
echo "      Actions → Sync Templates → Run workflow → Dry run ✅"
echo ""
echo "═══════════════════════════════════════════════════════════"
