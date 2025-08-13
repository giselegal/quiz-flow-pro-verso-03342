#!/bin/bash

echo "🔍 DIAGNÓSTICO COMPLETO: PORTAS E CONECTIVIDADE"
echo "=============================================="

echo ""
echo "📊 1. STATUS DO SERVIDOR NPM/VITE"
echo "================================="

# Verificar processos node/npm
if pgrep -f "vite.*8080" > /dev/null; then
    echo "✅ Servidor Vite: RODANDO na porta 8080"
    echo "   URL: http://localhost:8080"
else
    echo "❌ Servidor Vite: NÃO ENCONTRADO"
fi

if pgrep -f "npm.*dev" > /dev/null; then
    echo "✅ Processo npm dev: ATIVO"
else
    echo "❌ Processo npm dev: NÃO ATIVO"
fi

echo ""
echo "🌐 2. TESTE DE CONECTIVIDADE"
echo "============================"

# Testar conectividade local
if curl -s -I http://localhost:8080 | grep -q "200 OK"; then
    echo "✅ localhost:8080: RESPONDE (200 OK)"
    
    # Tentar acessar a rota específica
    if curl -s http://localhost:8080/editor-fixed >/dev/null; then
        echo "✅ /editor-fixed: ACESSÍVEL"
        echo "🎯 LINK DIRETO: http://localhost:8080/editor-fixed"
    else
        echo "⚠️  /editor-fixed: PRECISA VERIFICAR ROTEAMENTO"
        echo "📋 ROTAS DISPONÍVEIS:"
        curl -s http://localhost:8080 | grep -o 'href="[^"]*' | sed 's/href="//g' | head -5
    fi
else
    echo "❌ localhost:8080: NÃO RESPONDE"
fi

# Testar Supabase
echo ""
echo "🗄️  3. TESTE DE CONECTIVIDADE SUPABASE"
echo "===================================="

SUPABASE_URL="https://pwtjuuhchtbzttrzoutw.supabase.co"
if curl -s -I "$SUPABASE_URL" | grep -q "200\|301\|302"; then
    echo "✅ Supabase: CONECTANDO"
    
    # Testar API REST
    if curl -s "$SUPABASE_URL/rest/v1/" >/dev/null 2>&1; then
        echo "✅ API REST: DISPONÍVEL"
    else
        echo "⚠️  API REST: PODE PRECISAR AUTENTICAÇÃO"
    fi
else
    echo "❌ Supabase: PROBLEMA DE CONECTIVIDADE"
fi

echo ""
echo "🚀 4. SISTEMA DE COMPONENTES REUTILIZÁVEIS"
echo "=========================================="

# Verificar arquivos do sistema
if [ -f "src/components/editor/CombinedComponentsPanel.tsx" ]; then
    echo "✅ Sistema implementado: ARQUIVOS PRESENTES"
    echo "✅ Painel combinado: OK"
else
    echo "❌ Sistema: ARQUIVOS FALTANDO"
fi

# Verificar integração
if grep -q "CombinedComponentsPanel" src/pages/editor-fixed-dragdrop.tsx; then
    echo "✅ Integração editor: APLICADA"
else
    echo "❌ Integração editor: PENDENTE"
fi

echo ""
echo "🎯 5. PRÓXIMOS PASSOS"
echo "===================="

if curl -s -I http://localhost:8080 | grep -q "200 OK"; then
    echo "✅ SERVIDOR FUNCIONANDO!"
    echo ""
    echo "📋 PARA TESTAR O SISTEMA:"
    echo "1. Acesse: http://localhost:8080/editor-fixed"
    echo "2. Procure a aba 'Reutilizáveis' no painel esquerdo"
    echo "3. Teste os templates da marca Gisele Galvão"
    echo ""
    echo "🗄️  PARA FINALIZAR:"
    echo "1. Aplicar schema SQL no Supabase Dashboard"
    echo "2. Executar: ./aplicar-schema-real.sh"
else
    echo "⚠️  PROBLEMAS IDENTIFICADOS:"
    echo "1. Servidor pode precisar ser reiniciado"
    echo "2. Porta pode estar em uso"
    echo ""
    echo "🔧 SOLUÇÕES:"
    echo "npm run dev  # Reiniciar servidor"
    echo "pkill -f vite  # Matar processos antigos se necessário"
fi

echo ""
echo "📊 RESUMO:"
echo "========="
if pgrep -f "vite.*8080" > /dev/null && curl -s -I http://localhost:8080 | grep -q "200"; then
    echo "🎉 STATUS: SISTEMA PRONTO PARA TESTE!"
else
    echo "⚠️  STATUS: PRECISA REINICIAR SERVIDOR"
fi
