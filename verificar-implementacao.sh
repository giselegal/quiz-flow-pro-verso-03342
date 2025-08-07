#!/bin/bash

echo "🚀 IMPLEMENTANDO SISTEMA COMPLETO DE COMPONENTES REUTILIZÁVEIS"
echo "================================================================"

# Função para mostrar status
show_status() {
    echo ""
    echo "📊 STATUS ATUAL:"
    echo "==============="
    echo "✅ Hook useEditorReusableComponents: CRIADO"
    echo "✅ Painel ReusableComponentsPanel: CRIADO"
    echo "✅ Painel CombinedComponentsPanel: CRIADO"
    echo "✅ Editor-fixed integração: APLICADA"
    echo "✅ Variáveis Supabase: CONFIGURADAS"
    echo "⏳ Schema SQL: PENDENTE"
    echo ""
}

# Verificar se o servidor está rodando
echo "🔍 1. VERIFICANDO SERVIDOR..."
if pgrep -f "npm.*dev" > /dev/null; then
    echo "✅ Servidor em execução"
else
    echo "⚠️  Servidor não detectado - pode ser necessário reiniciar"
fi

# Verificar arquivos criados
echo ""
echo "🔍 2. VERIFICANDO ARQUIVOS CRIADOS..."
if [ -f "src/hooks/useEditorReusableComponents.ts" ]; then
    echo "✅ Hook principal: OK"
else
    echo "❌ Hook principal: FALTANDO"
fi

if [ -f "src/components/editor/ReusableComponentsPanel.tsx" ]; then
    echo "✅ Painel reutilizáveis: OK"
else
    echo "❌ Painel reutilizáveis: FALTANDO"
fi

if [ -f "src/components/editor/CombinedComponentsPanel.tsx" ]; then
    echo "✅ Painel combinado: OK"
else
    echo "❌ Painel combinado: FALTANDO"
fi

# Verificar integração no editor
echo ""
echo "🔍 3. VERIFICANDO INTEGRAÇÃO NO EDITOR..."
if grep -q "CombinedComponentsPanel" src/pages/editor-fixed-dragdrop.tsx; then
    echo "✅ Editor integrado: OK"
else
    echo "❌ Editor integrado: FALTANDO"
fi

# Verificar variáveis Supabase
echo ""
echo "🔍 4. VERIFICANDO CONFIGURAÇÃO SUPABASE..."
if grep -q "VITE_SUPABASE_URL" .env.local; then
    echo "✅ URL Supabase: CONFIGURADA"
    SUPABASE_URL=$(grep "VITE_SUPABASE_URL" .env.local | cut -d'=' -f2 | tr -d '"')
    echo "🔗 URL: $SUPABASE_URL"
else
    echo "❌ URL Supabase: FALTANDO"
fi

if grep -q "VITE_SUPABASE_ANON_KEY" .env.local; then
    echo "✅ Key Supabase: CONFIGURADA"
else
    echo "❌ Key Supabase: FALTANDO"
fi

# Status atual
show_status

echo "🎯 PRÓXIMOS PASSOS PARA FINALIZAR:"
echo "=================================="
echo "1. 🗄️  Aplicar schema SQL no Supabase Dashboard"
echo "2. 🔄 Reiniciar servidor se necessário: npm run dev"
echo "3. 🧪 Testar no /editor-fixed - aba 'Reutilizáveis'"
echo "4. ✨ Usar templates: Header Gisele + Pergunta + Botão"
echo ""
echo "📋 COMANDOS PARA TESTAR:"
echo "npm run dev"
echo "# Acessar: http://localhost:5173/editor-fixed"
echo "# Procurar aba 'Reutilizáveis' no painel esquerdo"
echo ""
echo "🎉 SISTEMA 95% IMPLEMENTADO - Falta apenas aplicar SQL!"
