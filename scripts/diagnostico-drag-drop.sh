#!/bin/bash

# 🔍 LEVANTAMENTO COMPLETO: Por que o Drag & Drop não está soltando
# ================================================================

echo "🔍 LEVANTAMENTO DRAG & DROP - Quiz Quest Challenge Verse"
echo "======================================================="
echo ""

# 1. VERIFICAÇÃO DE DEPENDÊNCIAS
echo "📦 1. VERIFICAÇÃO DE DEPENDÊNCIAS DND-KIT"
echo "-----------------------------------------"

if grep -q "@dnd-kit/core" package.json; then
    DND_CORE_VERSION=$(grep "@dnd-kit/core" package.json | cut -d'"' -f4)
    echo "✅ @dnd-kit/core: $DND_CORE_VERSION"
else
    echo "❌ @dnd-kit/core: NÃO INSTALADO"
fi

if grep -q "@dnd-kit/sortable" package.json; then
    DND_SORTABLE_VERSION=$(grep "@dnd-kit/sortable" package.json | cut -d'"' -f4)
    echo "✅ @dnd-kit/sortable: $DND_SORTABLE_VERSION"
else
    echo "❌ @dnd-kit/sortable: NÃO INSTALADO"
fi

if grep -q "@dnd-kit/modifiers" package.json; then
    DND_MODIFIERS_VERSION=$(grep "@dnd-kit/modifiers" package.json | cut -d'"' -f4)
    echo "✅ @dnd-kit/modifiers: $DND_MODIFIERS_VERSION"
else
    echo "❌ @dnd-kit/modifiers: NÃO INSTALADO"
fi

echo ""

# 2. VERIFICAÇÃO DE ARQUIVOS ESSENCIAIS
echo "📁 2. VERIFICAÇÃO DE ARQUIVOS ESSENCIAIS"
echo "---------------------------------------"

ESSENTIAL_FILES=(
    "src/components/editor/dnd/DndProvider.tsx"
    "src/components/editor/dnd/DraggableComponentItem.tsx"
    "src/components/editor/canvas/CanvasDropZone.tsx"
    "src/components/editor/canvas/SortableBlockWrapper.tsx"
    "src/components/editor/EnhancedComponentsSidebar.tsx"
    "src/pages/editor-fixed-dragdrop.tsx"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - ARQUIVO AUSENTE!"
    fi
done

echo ""

# 3. ANÁLISE DO DRAGGABLECOMPONENTITEM
echo "🎯 3. ANÁLISE DO DRAGGABLECOMPONENTITEM"
echo "-------------------------------------"

if [ -f "src/components/editor/dnd/DraggableComponentItem.tsx" ]; then
    echo "📝 Verificando configuração do useDraggable..."
    
    # Verificar se está usando o hook corretamente
    if grep -q "useDraggable" "src/components/editor/dnd/DraggableComponentItem.tsx"; then
        echo "✅ Hook useDraggable importado"
    else
        echo "❌ Hook useDraggable NÃO encontrado"
    fi
    
    # Verificar dados do draggable
    if grep -q "type.*sidebar-component" "src/components/editor/dnd/DraggableComponentItem.tsx"; then
        echo "✅ Tipo 'sidebar-component' configurado"
    else
        echo "❌ Tipo 'sidebar-component' NÃO encontrado"
    fi
    
    # Verificar listeners
    if grep -q "...listeners" "src/components/editor/dnd/DraggableComponentItem.tsx"; then
        echo "✅ Event listeners configurados"
    else
        echo "❌ Event listeners NÃO configurados"
    fi
    
    # Verificar attributes
    if grep -q "...attributes" "src/components/editor/dnd/DraggableComponentItem.tsx"; then
        echo "✅ Attributes configurados"
    else
        echo "❌ Attributes NÃO configurados"
    fi
    
else
    echo "❌ DraggableComponentItem.tsx não encontrado!"
fi

echo ""

# 4. ANÁLISE DO CANVASDROPZONE
echo "🎯 4. ANÁLISE DO CANVASDROPZONE"
echo "-----------------------------"

if [ -f "src/components/editor/canvas/CanvasDropZone.tsx" ]; then
    echo "📝 Verificando configuração do useDroppable..."
    
    # Verificar se está usando o hook corretamente
    if grep -q "useDroppable" "src/components/editor/canvas/CanvasDropZone.tsx"; then
        echo "✅ Hook useDroppable importado"
    else
        echo "❌ Hook useDroppable NÃO encontrado"
    fi
    
    # Verificar ID da drop zone
    if grep -q "canvas-drop-zone" "src/components/editor/canvas/CanvasDropZone.tsx"; then
        echo "✅ ID 'canvas-drop-zone' configurado"
    else
        echo "❌ ID 'canvas-drop-zone' NÃO encontrado"
    fi
    
    # Verificar setNodeRef
    if grep -q "setNodeRef" "src/components/editor/canvas/CanvasDropZone.tsx"; then
        echo "✅ setNodeRef configurado"
    else
        echo "❌ setNodeRef NÃO configurado"
    fi
    
else
    echo "❌ CanvasDropZone.tsx não encontrado!"
fi

echo ""

# 5. ANÁLISE DO DNDPROVIDER
echo "🎯 5. ANÁLISE DO DNDPROVIDER"
echo "--------------------------"

if [ -f "src/components/editor/dnd/DndProvider.tsx" ]; then
    echo "📝 Verificando configuração do DndContext..."
    
    # Verificar DndContext
    if grep -q "DndContext" "src/components/editor/dnd/DndProvider.tsx"; then
        echo "✅ DndContext importado e usado"
    else
        echo "❌ DndContext NÃO encontrado"
    fi
    
    # Verificar handlers
    HANDLERS=("onDragStart" "onDragOver" "onDragEnd")
    for handler in "${HANDLERS[@]}"; do
        if grep -q "$handler" "src/components/editor/dnd/DndProvider.tsx"; then
            echo "✅ Handler $handler configurado"
        else
            echo "❌ Handler $handler NÃO encontrado"
        fi
    done
    
    # Verificar collision detection
    if grep -q "collisionDetection" "src/components/editor/dnd/DndProvider.tsx"; then
        echo "✅ Collision detection configurado"
    else
        echo "❌ Collision detection NÃO configurado"
    fi
    
    # Verificar sensors
    if grep -q "sensors" "src/components/editor/dnd/DndProvider.tsx"; then
        echo "✅ Sensors configurados"
    else
        echo "❌ Sensors NÃO configurados"
    fi
    
else
    echo "❌ DndProvider.tsx não encontrado!"
fi

echo ""

# 6. ANÁLISE DA INTEGRAÇÃO NO EDITOR
echo "🎯 6. ANÁLISE DA INTEGRAÇÃO NO EDITOR"
echo "------------------------------------"

if [ -f "src/pages/editor-fixed-dragdrop.tsx" ]; then
    echo "📝 Verificando integração no editor..."
    
    # Verificar se o DndProvider está envolvendo tudo
    if grep -q "<DndProvider" "src/pages/editor-fixed-dragdrop.tsx"; then
        echo "✅ DndProvider está sendo usado"
    else
        echo "❌ DndProvider NÃO está sendo usado"
    fi
    
    # Verificar se EnhancedComponentsSidebar está sendo usado
    if grep -q "EnhancedComponentsSidebar" "src/pages/editor-fixed-dragdrop.tsx"; then
        echo "✅ EnhancedComponentsSidebar está sendo usado"
    else
        echo "❌ EnhancedComponentsSidebar NÃO está sendo usado"
    fi
    
    # Verificar se CanvasDropZone está sendo usado
    if grep -q "CanvasDropZone" "src/pages/editor-fixed-dragdrop.tsx"; then
        echo "✅ CanvasDropZone está sendo usado"
    else
        echo "❌ CanvasDropZone NÃO está sendo usado"
    fi
    
    # Verificar callbacks essenciais
    CALLBACKS=("onBlocksReorder" "onBlockAdd" "onBlockSelect")
    for callback in "${CALLBACKS[@]}"; do
        if grep -q "$callback" "src/pages/editor-fixed-dragdrop.tsx"; then
            echo "✅ Callback $callback configurado"
        else
            echo "❌ Callback $callback NÃO configurado"
        fi
    done
    
else
    echo "❌ editor-fixed-dragdrop.tsx não encontrado!"
fi

echo ""

# 7. PROBLEMAS COMUNS IDENTIFICADOS
echo "⚠️  7. PROBLEMAS COMUNS IDENTIFICADOS"
echo "-----------------------------------"

echo "🔍 VERIFICANDO PROBLEMAS MAIS COMUNS:"
echo ""

# Problema 1: Conflito de CSS pointer-events
echo "1. CSS pointer-events:"
if grep -r "pointer-events.*none" src/components/editor/ 2>/dev/null | head -3; then
    echo "   ⚠️  ENCONTRADO - pode estar bloqueando interações"
else
    echo "   ✅ OK - não encontrado"
fi
echo ""

# Problema 2: Elementos sobrepostos
echo "2. Z-index e sobreposição:"
if grep -r "z-index\|absolute.*inset\|fixed.*inset" src/components/editor/ 2>/dev/null | head -3; then
    echo "   ⚠️  ELEMENTOS SOBREPOSTOS encontrados - verificar se não bloqueiam drag"
else
    echo "   ✅ OK - sem sobreposições evidentes"
fi
echo ""

# Problema 3: Console errors
echo "3. Verificação de erros no console (simulação):"
echo "   📝 Recomendação: Verificar o console do navegador para:"
echo "      - Erros de JavaScript"
echo "      - Warnings do @dnd-kit"
echo "      - Problemas de hook order"
echo ""

# 8. DIAGNÓSTICO E SOLUÇÕES
echo "🛠️  8. DIAGNÓSTICO E SOLUÇÕES RECOMENDADAS"
echo "==========================================="

echo ""
echo "🎯 POSSÍVEIS CAUSAS DO PROBLEMA:"
echo ""
echo "1. **SENSORS MAL CONFIGURADOS**"
echo "   - PointerSensor com activationConstraint muito alto"
echo "   - TouchSensor com delay/tolerance inadequados"
echo ""
echo "2. **COLLISION DETECTION INCORRETO**"
echo "   - rectIntersection pode não funcionar bem"
echo "   - Tentar closestCenter ou closestCorners"
echo ""
echo "3. **DADOS INCONSISTENTES**"
echo "   - active.data.current pode estar undefined"
echo "   - Tipos não coincidindo entre draggable e droppable"
echo ""
echo "4. **ELEMENTOS CSS INTERFERINDO**"
echo "   - pointer-events: none bloqueando interações"
echo "   - Elementos sobrepostos capturando eventos"
echo ""
echo "5. **REACT STRICT MODE**"
echo "   - Pode causar problemas com hooks do @dnd-kit"
echo "   - Verificar se está ativo no main.tsx"
echo ""

echo "✅ SOLUÇÕES RECOMENDADAS:"
echo ""
echo "1. **AJUSTAR SENSORS (MAIS SENSÍVEL)**"
echo "   PointerSensor: activationConstraint.distance = 1"
echo "   TouchSensor: delay = 50, tolerance = 3"
echo ""
echo "2. **TESTAR COLLISION DETECTION DIFERENTE**"
echo "   Trocar rectIntersection por closestCenter"
echo ""
echo "3. **ADICIONAR MAIS DEBUG LOGS**"
echo "   Console.log em todos os eventos de drag"
echo ""
echo "4. **VERIFICAR CSS INTERFERENTE**"
echo "   Remover pointer-events: none temporariamente"
echo ""
echo "5. **TESTAR SEM STRICT MODE**"
echo "   Desabilitar temporariamente para teste"

echo ""
echo "🎉 CHECKLIST FINAL:"
echo "=================="
echo "□ Dependências @dnd-kit instaladas"
echo "□ DndProvider envolvendo toda a aplicação"
echo "□ DraggableComponentItem com useDraggable correto"
echo "□ CanvasDropZone com useDroppable correto"
echo "□ Sensors configurados adequadamente"
echo "□ Console sem erros JavaScript"
echo "□ CSS não interferindo (pointer-events)"
echo "□ Handlers onDragStart/End/Over funcionando"
echo "□ Tipos de dados consistentes"
echo "□ Collision detection apropriado"
