#!/bin/bash

# 🧪 TESTE ESPECÍFICO DRAG & DROP - Debugging em Tempo Real
# =========================================================

echo "🧪 TESTE DRAG & DROP - Debugging Avançado"
echo "========================================"
echo ""

# 1. Verificar se o servidor está rodando
echo "🌐 1. VERIFICANDO SERVIDOR"
echo "-------------------------"

if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Servidor frontend: http://localhost:8080 (ATIVO)"
else
    echo "❌ Servidor frontend: NÃO ENCONTRADO"
    echo "🚀 Iniciando servidor..."
    npm run dev &
    sleep 5
fi

if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ Servidor backend: http://localhost:3001 (ATIVO)"
else
    echo "❌ Servidor backend: NÃO ENCONTRADO"
fi

echo ""

# 2. Testar rota específica do drag & drop
echo "🎯 2. TESTANDO ROTA /editor-fixed"
echo "--------------------------------"

if curl -s http://localhost:8080/editor-fixed | grep -q "EditorFixedPageWithDragDrop\|DndProvider"; then
    echo "✅ Página /editor-fixed carregando corretamente"
else
    echo "❌ Página /editor-fixed com problemas"
fi

echo ""

# 3. Verificar logs do navegador (simulação)
echo "🔍 3. COMANDOS PARA DEBUG NO NAVEGADOR"
echo "------------------------------------"

echo "📝 Execute estes comandos no Console do navegador (F12):"
echo ""
echo "// 1. Verificar se DndContext está ativo"
echo "window.addEventListener('dragstart', (e) => console.log('🟢 Native dragstart:', e));"
echo ""
echo "// 2. Verificar elementos draggáveis"
echo "document.querySelectorAll('[data-testid*=\"draggable\"], [draggable=\"true\"]').length"
echo ""
echo "// 3. Verificar drop zones"
echo "document.querySelectorAll('[data-testid*=\"droppable\"]').length"
echo ""
echo "// 4. Verificar @dnd-kit context"
echo "window.__DND_KIT_CONTEXT__ ? 'DndContext ativo' : 'DndContext inativo'"
echo ""
echo "// 5. Forçar log de todos os eventos"
echo "const originalLog = console.log;"
echo "console.log = (...args) => {"
echo "  if (args.some(arg => typeof arg === 'string' && (arg.includes('Drag') || arg.includes('🟢') || arg.includes('🔄')))) {"
echo "    originalLog('🎯 DND EVENT:', ...args);"
echo "  }"
echo "  originalLog(...args);"
echo "};"

echo ""

# 4. Comandos para testar problemas específicos
echo "🛠️  4. TESTES ESPECÍFICOS PARA EXECUTAR"
echo "======================================="

echo ""
echo "📝 TESTE 1: CSS Interferente"
echo "// Execute no console para remover CSS que pode interferir:"
echo "document.querySelectorAll('*').forEach(el => {"
echo "  if (getComputedStyle(el).pointerEvents === 'none' && !el.classList.contains('dnd-overlay')) {"
echo "    el.style.pointerEvents = 'auto';"
echo "    console.log('Removido pointer-events:none de', el);"
echo "  }"
echo "});"

echo ""
echo "📝 TESTE 2: Verificar Sensibilidade dos Sensors"
echo "// Execute no console para testar se os eventos de mouse funcionam:"
echo "document.addEventListener('mousedown', (e) => console.log('🖱️ MouseDown:', e.target));"
echo "document.addEventListener('mousemove', (e) => console.log('🖱️ MouseMove:', e.clientX, e.clientY));"

echo ""
echo "📝 TESTE 3: Simular Drag Manualmente"
echo "// Execute no console para simular um drag:"
echo "const draggable = document.querySelector('[id^=\"sidebar-\"]');"
echo "if (draggable) {"
echo "  console.log('📦 Elemento draggável encontrado:', draggable);"
echo "  draggable.style.border = '2px solid red';"
echo "  setTimeout(() => draggable.style.border = '', 2000);"
echo "} else {"
echo "  console.log('❌ Nenhum elemento draggável encontrado');"
echo "}"

echo ""

# 5. Verificação final
echo "🎉 5. CHECKLIST DE VERIFICAÇÃO MANUAL"
echo "====================================="

echo ""
echo "□ Abrir http://localhost:8080/editor-fixed"
echo "□ Abrir Console do navegador (F12)"
echo "□ Verificar se não há erros JavaScript"
echo "□ Tentar arrastar um componente da sidebar"
echo "□ Verificar se aparecem logs de 🟢 DragStart"
echo "□ Verificar se a drop zone fica destacada"
echo "□ Verificar se aparecem logs de 🔄 DragEnd"
echo "□ Verificar se o componente é adicionado ao canvas"
echo ""

echo "🚀 URLs PARA TESTE:"
echo "=================="
echo "🌐 Frontend: http://localhost:8080/editor-fixed"
echo "🔧 Backend: http://localhost:3001"
echo ""

echo "⚠️  PROBLEMAS COMUNS A VERIFICAR:"
echo "1. Console mostra erros de hook order"
echo "2. Console mostra 'active.data.current é undefined'"
echo "3. Elementos não respondem ao mouse/touch"
echo "4. Drop zone não fica destacada"
echo "5. Callbacks não são chamados"
echo ""

echo "✅ SINAL DE SUCESSO:"
echo "- Console mostra: '🟢 DragStart: {...}'"
echo "- Console mostra: '🔄 DragEnd: {...}'"
echo "- Console mostra: '✅ SUCESSO: Adicionando bloco:'"
echo "- Componente aparece no canvas"

echo ""
echo "🎯 Execute este script e teste no navegador!"
