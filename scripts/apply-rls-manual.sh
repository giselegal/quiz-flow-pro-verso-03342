#!/bin/bash

# 🔒 SCRIPT PARA APLICAR POLÍTICAS RLS MANUALMENTE
# Use este script se não conseguir fazer supabase login

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 APLICAÇÃO MANUAL DE POLÍTICAS RLS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

RLS_FILE="supabase/migrations/20251123_critical_rls_policies.sql"

if [ ! -f "$RLS_FILE" ]; then
    echo "❌ Arquivo de migração não encontrado: $RLS_FILE"
    exit 1
fi

echo "📋 Instruções para aplicar as políticas RLS:"
echo ""
echo "1. Acesse o Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/pwtjuuhchtbzttrzoutw"
echo ""
echo "2. Vá em: SQL Editor (menu lateral esquerdo)"
echo ""
echo "3. Clique em 'New Query'"
echo ""
echo "4. Copie e cole o conteúdo do arquivo:"
echo "   $RLS_FILE"
echo ""
echo "5. Execute a query (Run/Ctrl+Enter)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📄 Conteúdo do SQL (copie abaixo):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cat "$RLS_FILE"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Após executar o SQL, execute este comando para validar:"
echo "   npm run validate:rls"
echo ""
