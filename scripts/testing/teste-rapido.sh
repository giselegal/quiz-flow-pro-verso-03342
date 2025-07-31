#!/bin/bash

# 🧪 SCRIPT DE TESTE AUTOMÁTICO DO SISTEMA
echo "🚀 TESTANDO SISTEMA SEM NAVEGADOR..."
echo "Data: $(date)"
echo "=================================="

# Teste 1: Servidor
echo "📋 TESTE 1: SERVIDOR"
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Servidor respondendo"
else
    echo "❌ Servidor não responde"
fi

# Teste 2: Dashboard
echo "📋 TESTE 2: DASHBOARD"
if curl -s http://localhost:8080/admin | grep -q "title"; then
    echo "✅ Dashboard OK"
else
    echo "❌ Dashboard falha"
fi

# Teste 3: Editor
echo "📋 TESTE 3: EDITOR"
if curl -s http://localhost:8080/editor | grep -q "title"; then
    echo "✅ Editor OK"
else
    echo "❌ Editor falha"
fi

# Teste 4: Correção Calendar
echo "📋 TESTE 4: CORREÇÃO CALENDAR"
if grep -q "Calendar," src/pages/admin/FunnelPanelPage.tsx; then
    echo "✅ Calendar importado"
else
    echo "❌ Calendar com problema"
fi

echo "=================================="
echo "💡 Acesse http://localhost:8080/admin"
echo "   para continuar testes manuais"
