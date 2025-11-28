#!/bin/bash
##############################################################################
# Script para Aplicar Migrations de Segurança
# 
# Aplica as migrations SQL diretamente no Supabase usando psql ou CLI
##############################################################################

set -e  # Exit on error

echo "🔒 Aplicando Migrations de Segurança..."
echo ""

# Carregar variáveis de ambiente
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
fi

SUPABASE_URL="${VITE_SUPABASE_URL:-$SUPABASE_URL}"
SUPABASE_KEY="${VITE_SUPABASE_ANON_KEY:-$SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SUPABASE_URL" ]; then
    echo "❌ ERRO: VITE_SUPABASE_URL não definida"
    exit 1
fi

# Extrair project ref do URL (pwtjuuhchtbzttrzoutw)
PROJECT_REF=$(echo "$SUPABASE_URL" | sed -n 's/.*\/\/\([^.]*\).*/\1/p')

echo "📡 Projeto: $PROJECT_REF"
echo "🔗 URL: $SUPABASE_URL"
echo ""

# Verificar se está linkado ao projeto
echo "🔗 Verificando link com projeto Supabase..."
if ! supabase status &>/dev/null; then
    echo "⚠️  Projeto não está linkado. Tentando linkar..."
    
    # Tentar linkar usando o project ref
    if ! supabase link --project-ref "$PROJECT_REF" 2>/dev/null; then
        echo ""
        echo "❌ Não foi possível linkar automaticamente."
        echo ""
        echo "📖 APLICAÇÃO MANUAL RECOMENDADA:"
        echo "   1. Acesse: $SUPABASE_URL"
        echo "   2. Vá para SQL Editor"
        echo "   3. Execute os arquivos na ordem:"
        echo "      a) supabase/migrations/20251110_auth_hardening_rls.sql"
        echo "      b) supabase/migrations/20251128_security_enhancements.sql"
        echo ""
        echo "   OU via CLI:"
        echo "   1. Execute: supabase login"
        echo "   2. Execute: supabase link --project-ref $PROJECT_REF"
        echo "   3. Execute novamente este script"
        echo ""
        exit 1
    fi
fi

echo "✅ Projeto linkado"
echo ""

# Aplicar migrations
echo "📋 Aplicando Migrations..."
echo "─────────────────────────────────────────────────────────"
echo ""

MIGRATION_1="supabase/migrations/20251110_auth_hardening_rls.sql"
MIGRATION_2="supabase/migrations/20251128_security_enhancements.sql"

# Migration 1
if [ -f "$MIGRATION_1" ]; then
    echo "📄 Aplicando: $MIGRATION_1"
    if supabase db execute -f "$MIGRATION_1"; then
        echo "✅ Migration 1 aplicada com sucesso"
    else
        echo "⚠️  Erro na migration 1 (pode já estar aplicada)"
    fi
    echo ""
else
    echo "⚠️  Arquivo não encontrado: $MIGRATION_1"
    echo ""
fi

# Migration 2
if [ -f "$MIGRATION_2" ]; then
    echo "📄 Aplicando: $MIGRATION_2"
    if supabase db execute -f "$MIGRATION_2"; then
        echo "✅ Migration 2 aplicada com sucesso"
    else
        echo "⚠️  Erro na migration 2 (pode já estar aplicada)"
    fi
    echo ""
else
    echo "⚠️  Arquivo não encontrado: $MIGRATION_2"
    echo ""
fi

echo "═══════════════════════════════════════════════════════"
echo "✅ PROCESSO DE MIGRATION CONCLUÍDO"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "🔄 Próximos passos:"
echo "   1. Validar aplicação:"
echo "      node scripts/validate-security.mjs"
echo ""
echo "   2. Configurar Dashboard manualmente:"
echo "      - Password Breach Protection"
echo "      - Rate Limiting de Auth"
echo "      - CORS apropriado"
echo ""
echo "   3. Ver guia completo:"
echo "      docs/GUIA_CONFIGURACAO_SEGURANCA_SUPABASE.md"
echo ""
