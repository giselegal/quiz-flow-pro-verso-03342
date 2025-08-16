#!/bin/bash

echo "🧪 TESTE RÁPIDO DO PAINEL DE PROPRIEDADES"
echo "========================================="

echo ""
echo "📋 1. VERIFICANDO SE SERVIDOR ESTÁ RODANDO..."
echo "---------------------------------------------"

# Verificar se o servidor está respondendo
if curl -s http://localhost:8087/editor-fixed > /dev/null; then
    echo "✅ Servidor está ativo na porta 8087"
else
    echo "❌ Servidor não está respondendo na porta 8087"
    echo "💡 Execute: npm run dev"
    exit 1
fi

echo ""
echo "📋 2. VERIFICANDO ERROS DE COMPILAÇÃO..."
echo "----------------------------------------"

# Verificar erros críticos de TypeScript
echo "🔍 Verificando erros críticos..."
npx tsc --noEmit --skipLibCheck 2>&1 | grep -E "(error|Error)" | grep -E "(EnhancedUniversalPropertiesPanel|useUnifiedProperties|EditorContext)" | head -5

echo ""
echo "📋 3. VERIFICANDO CONSOLE DO NAVEGADOR..."
echo "-----------------------------------------"

echo "🔍 Para verificar se o painel está funcionando:"
echo "1. Abra: http://localhost:8087/editor-fixed"
echo "2. Abra DevTools (F12)"
echo "3. Clique em uma etapa (ex: Etapa 1)"
echo "4. Adicione um componente (ex: Text Inline)"
echo "5. Clique no componente para selecioná-lo"
echo "6. Verifique se o painel de propriedades aparece à direita"
echo "7. Teste mudanças nas propriedades"

echo ""
echo "📋 4. LOGS ESPERADOS NO CONSOLE..."
echo "----------------------------------"
echo "✅ Deve aparecer: '🔥 EditorFixedPage: PÁGINA RENDERIZANDO COM DRAG&DROP!'"
echo "✅ Deve aparecer: '🚀 Atualizando bloco via EnhancedUniversalPropertiesPanel:'"
echo "✅ NÃO deve ter erros de: 'Cannot read property' ou 'undefined'"

echo ""
echo "📋 5. ESTRUTURA VISUAL ESPERADA..."
echo "----------------------------------"
echo "┌─────────────────────────────────────────────────────────┐"
echo "│ [Etapas] │ [Componentes] │    [Canvas]    │ [Propriedades] │"
echo "│          │               │                │               │"
echo "│ Etapa 1  │ • Text Inline │  ┌─────────────┐│ Propriedades  │"
echo "│ Etapa 2  │ • Button      │  │ Componente  ││ ┌───────────┐ │"
echo "│ Etapa 3  │ • Image       │  │ Selecionado ││ │ Conteúdo  │ │"
echo "│ ...      │ • Quiz Result │  └─────────────┘│ │ Estilo    │ │"
echo "│          │               │                │ │ Avançado  │ │"
echo "│          │               │                │ └───────────┘ │"
echo "└─────────────────────────────────────────────────────────┘"

echo ""
echo "📋 6. TESTE MANUAL SUGERIDO..."
echo "------------------------------"
echo "1. ✅ Adicionar componente 'Text Inline' na Etapa 1"
echo "2. ✅ Selecionar o componente adicionado"
echo "3. ✅ Verificar se painel de propriedades aparece"
echo "4. ✅ Mudar o texto no campo 'Conteúdo HTML'"
echo "5. ✅ Verificar se o texto atualiza no canvas"
echo "6. ✅ Mudar para Etapa 2 e voltar para Etapa 1"
echo "7. ✅ Verificar se as mudanças persistiram"

echo ""
echo "🚀 PRONTO PARA TESTAR!"
echo "======================"
echo "Abra http://localhost:8087/editor-fixed no navegador"
