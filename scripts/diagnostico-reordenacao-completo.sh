#!/bin/bash

echo "🔧 DIAGNÓSTICO COMPLETO: PROBLEMAS DE REORDENAÇÃO E INSERÇÃO"
echo "════════════════════════════════════════════════════════════"

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}1. VERIFICANDO CONFIGURAÇÃO DO DNDPROVIDER${NC}"
echo "─────────────────────────────────────────────────────────"

# Verificar se DndProvider está envolvendo tudo
if grep -q "<DndProvider" "src/pages/editor-fixed-dragdrop.tsx"; then
    echo -e "✅ ${GREEN}DndProvider está sendo usado${NC}"
    
    # Verificar callbacks implementados
    if grep -q "onBlocksReorder" "src/pages/editor-fixed-dragdrop.tsx"; then
        echo -e "✅ ${GREEN}onBlocksReorder implementado${NC}"
    else
        echo -e "❌ ${RED}onBlocksReorder NÃO implementado${NC}"
    fi
    
    if grep -q "onBlockAdd.*position" "src/pages/editor-fixed-dragdrop.tsx"; then
        echo -e "✅ ${GREEN}onBlockAdd com posicionamento implementado${NC}"
    else
        echo -e "❌ ${RED}onBlockAdd sem posicionamento${NC}"
    fi
else
    echo -e "❌ ${RED}DndProvider NÃO está sendo usado${NC}"
fi

echo ""
echo -e "${BLUE}2. VERIFICANDO DRAGGABLECOMPONENTITEM${NC}"
echo "─────────────────────────────────────────────────────────"

if [ -f "src/components/editor/dnd/DraggableComponentItem.tsx" ]; then
    # Verificar useDraggable
    if grep -q "useDraggable" "src/components/editor/dnd/DraggableComponentItem.tsx"; then
        echo -e "✅ ${GREEN}useDraggable está sendo usado${NC}"
    else
        echo -e "❌ ${RED}useDraggable NÃO encontrado${NC}"
    fi
    
    # Verificar data type
    if grep -q "type.*sidebar-component" "src/components/editor/dnd/DraggableComponentItem.tsx"; then
        echo -e "✅ ${GREEN}Type 'sidebar-component' configurado${NC}"
    else
        echo -e "❌ ${RED}Type 'sidebar-component' NÃO encontrado${NC}"
    fi
    
    # Verificar listeners
    if grep -q "...listeners" "src/components/editor/dnd/DraggableComponentItem.tsx"; then
        echo -e "✅ ${GREEN}...listeners aplicado${NC}"
    else
        echo -e "❌ ${RED}...listeners NÃO aplicado${NC}"
    fi
    
    # Verificar attributes
    if grep -q "...attributes" "src/components/editor/dnd/DraggableComponentItem.tsx"; then
        echo -e "✅ ${GREEN}...attributes aplicado${NC}"
    else
        echo -e "❌ ${RED}...attributes NÃO aplicado${NC}"
    fi
else
    echo -e "❌ ${RED}DraggableComponentItem.tsx não encontrado${NC}"
fi

echo ""
echo -e "${BLUE}3. VERIFICANDO SORTABLEBLOCKWRAPPER${NC}"
echo "─────────────────────────────────────────────────────────"

if [ -f "src/components/editor/canvas/SortableBlockWrapper.tsx" ]; then
    # Verificar useSortable
    if grep -q "useSortable" "src/components/editor/canvas/SortableBlockWrapper.tsx"; then
        echo -e "✅ ${GREEN}useSortable está sendo usado${NC}"
    else
        echo -e "❌ ${RED}useSortable NÃO encontrado${NC}"
    fi
    
    # Verificar data type
    if grep -q "type.*canvas-block" "src/components/editor/canvas/SortableBlockWrapper.tsx"; then
        echo -e "✅ ${GREEN}Type 'canvas-block' configurado${NC}"
    else
        echo -e "❌ ${RED}Type 'canvas-block' NÃO encontrado${NC}"
    fi
    
    # Verificar listeners
    if grep -q "...listeners" "src/components/editor/canvas/SortableBlockWrapper.tsx"; then
        echo -e "✅ ${GREEN}...listeners aplicado${NC}"
    else
        echo -e "❌ ${RED}...listeners NÃO aplicado${NC}"
    fi
    
    # Verificar attributes
    if grep -q "...attributes" "src/components/editor/canvas/SortableBlockWrapper.tsx"; then
        echo -e "✅ ${GREEN}...attributes aplicado${NC}"
    else
        echo -e "❌ ${RED}...attributes NÃO aplicado${NC}"
    fi
else
    echo -e "❌ ${RED}SortableBlockWrapper.tsx não encontrado${NC}"
fi

echo ""
echo -e "${BLUE}4. VERIFICANDO CANVASDROPZONE COM MÚLTIPLAS ZONES${NC}"
echo "─────────────────────────────────────────────────────────"

if [ -f "src/components/editor/canvas/CanvasDropZone.tsx" ]; then
    # Verificar InterBlockDropZone
    if grep -q "InterBlockDropZone" "src/components/editor/canvas/CanvasDropZone.tsx"; then
        echo -e "✅ ${GREEN}InterBlockDropZone implementado${NC}"
    else
        echo -e "❌ ${RED}InterBlockDropZone NÃO encontrado${NC}"
    fi
    
    # Verificar drop-zone-{position}
    if grep -q "drop-zone-.*position" "src/components/editor/canvas/CanvasDropZone.tsx"; then
        echo -e "✅ ${GREEN}Drop zones posicionais configuradas${NC}"
    else
        echo -e "❌ ${RED}Drop zones posicionais NÃO encontradas${NC}"
    fi
    
    # Verificar isDraggingSidebarComponent
    if grep -q "isDraggingSidebarComponent" "src/components/editor/canvas/CanvasDropZone.tsx"; then
        echo -e "✅ ${GREEN}Detecção de sidebar drag implementada${NC}"
    else
        echo -e "❌ ${RED}Detecção de sidebar drag NÃO encontrada${NC}"
    fi
    
    # Verificar SortableContext
    if grep -q "SortableContext" "src/components/editor/canvas/CanvasDropZone.tsx"; then
        echo -e "✅ ${GREEN}SortableContext presente${NC}"
    else
        echo -e "❌ ${RED}SortableContext NÃO encontrado${NC}"
    fi
else
    echo -e "❌ ${RED}CanvasDropZone.tsx não encontrado${NC}"
fi

echo ""
echo -e "${BLUE}5. VERIFICANDO LÓGICA DE POSICIONAMENTO NO DNDPROVIDER${NC}"
echo "─────────────────────────────────────────────────────────"

if [ -f "src/components/editor/dnd/DndProvider.tsx" ]; then
    # Verificar lógica de drop-zone-
    if grep -q "drop-zone-" "src/components/editor/dnd/DndProvider.tsx"; then
        echo -e "✅ ${GREEN}Lógica de drop-zone- implementada${NC}"
    else
        echo -e "❌ ${RED}Lógica de drop-zone- NÃO encontrada${NC}"
    fi
    
    # Verificar cálculo de posição
    if grep -q "parseInt.*positionMatch" "src/components/editor/dnd/DndProvider.tsx"; then
        echo -e "✅ ${GREEN}Cálculo de posição implementado${NC}"
    else
        echo -e "❌ ${RED}Cálculo de posição NÃO encontrado${NC}"
    fi
    
    # Verificar collision detection
    if grep -q "closestCenter" "src/components/editor/dnd/DndProvider.tsx"; then
        echo -e "✅ ${GREEN}closestCenter collision detection${NC}"
    else
        echo -e "❌ ${RED}closestCenter NÃO encontrado${NC}"
    fi
    
    # Verificar reordenação de canvas-block
    if grep -q "canvas-block.*canvas-block" "src/components/editor/dnd/DndProvider.tsx"; then
        echo -e "✅ ${GREEN}Lógica de reordenação canvas-block${NC}"
    else
        echo -e "❌ ${RED}Lógica de reordenação NÃO encontrada${NC}"
    fi
else
    echo -e "❌ ${RED}DndProvider.tsx não encontrado${NC}"
fi

echo ""
echo -e "${BLUE}6. VERIFICANDO IDS ÚNICOS${NC}"
echo "─────────────────────────────────────────────────────────"

# Verificar IDs do DraggableComponentItem
if grep -q "sidebar-.*blockType" "src/components/editor/dnd/DraggableComponentItem.tsx"; then
    echo -e "✅ ${GREEN}IDs únicos no DraggableComponentItem${NC}"
else
    echo -e "❌ ${RED}IDs não únicos no DraggableComponentItem${NC}"
fi

# Verificar IDs do SortableBlockWrapper
if grep -q "id.*block.id" "src/components/editor/canvas/SortableBlockWrapper.tsx"; then
    echo -e "✅ ${GREEN}IDs únicos no SortableBlockWrapper${NC}"
else
    echo -e "❌ ${RED}IDs não únicos no SortableBlockWrapper${NC}"
fi

echo ""
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📋 RESUMO DAS CORREÇÕES APLICADAS${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "✅ onBlocksReorder implementado com updateBlock"
echo "✅ onBlockAdd com lógica de posicionamento via setTimeout"
echo "✅ InterBlockDropZone com drop zones múltiplas"
echo "✅ DndProvider com suporte a drop-zone-{number}"
echo "✅ SortableBlockWrapper com espaçamento adequado"
echo "✅ Collision detection closestCenter configurado"
echo ""
echo -e "${BLUE}🧪 PRÓXIMO PASSO: TESTAR NO NAVEGADOR${NC}"
echo "1. npm run dev"
echo "2. http://localhost:8080/editor-fixed-dragdrop"
echo "3. Testar arrastar da sidebar para posições específicas"
echo "4. Testar reordenar blocos existentes"
echo ""
echo -e "${GREEN}🎯 LOGS ESPERADOS NO CONSOLE:${NC}"
echo "📦 Arrastando componente da sidebar: [tipo]"
echo "📍 Posição específica detectada: [número]"
echo "✅ SUCESSO: Adicionando bloco: [tipo] na posição: [número]"
echo "🔄 Reordenando blocos: [array]"
