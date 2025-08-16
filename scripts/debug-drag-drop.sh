#!/bin/bash

echo "🔧 Testando Drag and Drop Components..."
echo ""

# Função para verificar se um componente existe e está válido
check_component() {
    local file=$1
    local component_name=$2
    
    echo "🔍 Verificando $component_name..."
    
    if [ ! -f "$file" ]; then
        echo "❌ ERRO: Arquivo $file não encontrado"
        return 1
    fi
    
    # Verificar se o arquivo é TypeScript/TSX válido
    if ! npm run type-check 2>/dev/null | grep -q "error"; then
        echo "✅ $component_name: TypeScript válido"
    else
        echo "⚠️ $component_name: Pode ter erros de TypeScript"
    fi
    
    # Verificar se tem os hooks do dnd-kit
    if grep -q "useDraggable\|useSortable\|useDroppable" "$file"; then
        echo "✅ $component_name: Hooks do dnd-kit encontrados"
    else
        echo "❌ $component_name: Hooks do dnd-kit não encontrados"
        return 1
    fi
    
    # Verificar se exporta corretamente
    if grep -q "export.*$component_name" "$file"; then
        echo "✅ $component_name: Exportação encontrada"
    else
        echo "⚠️ $component_name: Exportação pode estar incorreta"
    fi
    
    echo ""
    return 0
}

# Verificar componentes principais
echo "===== VERIFICAÇÃO DE COMPONENTES ====="
echo ""

check_component "src/components/editor/dnd/DraggableComponentItem.tsx" "DraggableComponentItem"
check_component "src/components/editor/canvas/SortableBlockWrapper.tsx" "SortableBlockWrapper" 
check_component "src/components/editor/canvas/CanvasDropZone.tsx" "CanvasDropZone"
check_component "src/components/editor/dnd/DndProvider.tsx" "DndProvider"

echo "===== VERIFICAÇÃO DE DADOS ====="
echo ""

# Verificar se os dados estão sendo passados corretamente
echo "🔍 Verificando se os dados são passados corretamente..."

# DraggableComponentItem - verificar se passa type: "sidebar-component"
if grep -q 'type: "sidebar-component"' "src/components/editor/dnd/DraggableComponentItem.tsx"; then
    echo "✅ DraggableComponentItem: type: 'sidebar-component' configurado"
else
    echo "❌ DraggableComponentItem: type: 'sidebar-component' não encontrado"
fi

# SortableBlockWrapper - verificar se passa type: "canvas-block"
if grep -q 'type: "canvas-block"' "src/components/editor/canvas/SortableBlockWrapper.tsx"; then
    echo "✅ SortableBlockWrapper: type: 'canvas-block' configurado"
else
    echo "❌ SortableBlockWrapper: type: 'canvas-block' não encontrado"
fi

# CanvasDropZone - verificar se aceita os tipos corretos
if grep -q 'accepts:.*"sidebar-component"' "src/components/editor/canvas/CanvasDropZone.tsx"; then
    echo "✅ CanvasDropZone: accepts 'sidebar-component' configurado"
else
    echo "❌ CanvasDropZone: accepts 'sidebar-component' não encontrado"
fi

echo ""
echo "===== VERIFICAÇÃO DE IMPORTS ====="
echo ""

# Verificar se todos os imports estão corretos
echo "🔍 Verificando imports do @dnd-kit..."

for file in "src/components/editor/dnd/DraggableComponentItem.tsx" "src/components/editor/canvas/SortableBlockWrapper.tsx" "src/components/editor/canvas/CanvasDropZone.tsx" "src/components/editor/dnd/DndProvider.tsx"; do
    if [ -f "$file" ]; then
        echo "📁 $file:"
        if grep -q "@dnd-kit/core" "$file"; then
            echo "  ✅ @dnd-kit/core importado"
        else
            echo "  ❌ @dnd-kit/core não importado"
        fi
        
        if grep -q "@dnd-kit/utilities" "$file"; then
            echo "  ✅ @dnd-kit/utilities importado"
        elif grep -q "CSS\.Transform" "$file"; then
            echo "  ⚠️ Usa CSS.Transform mas pode não ter importado @dnd-kit/utilities"
        fi
        
        if grep -q "@dnd-kit/sortable" "$file"; then
            echo "  ✅ @dnd-kit/sortable importado"
        fi
        echo ""
    fi
done

echo "===== VERIFICAÇÃO DE PÁGINA DE TESTE ====="
echo ""

if [ -f "src/pages/drag-drop-test.tsx" ]; then
    echo "✅ Página de teste criada: src/pages/drag-drop-test.tsx"
    echo ""
    echo "Para testar o drag and drop:"
    echo "1. Adicione a rota /drag-drop-test ao seu router"
    echo "2. Navegue para http://localhost:3000/drag-drop-test"
    echo "3. Tente arrastar componentes da sidebar para o canvas"
    echo "4. Verifique o console do navegador para logs de debug"
else
    echo "❌ Página de teste não encontrada"
fi

echo ""
echo "===== DICAS DE DEBUG ====="
echo ""
echo "🔍 Para debugar problemas de drag and drop:"
echo "1. Abra o console do navegador (F12)"
echo "2. Procure por logs com emojis (🟢, ❌, 🔧, etc.)"
echo "3. Verifique se 'active.data.current' não está undefined"
echo "4. Confirme se os tipos ('sidebar-component', 'canvas-block') estão corretos"
echo "5. Teste primeiro no desktop, depois no mobile"
echo ""

echo "🎯 Problemas comuns:"
echo "- CSS z-index conflitando com drag overlay"
echo "- pointer-events: none bloqueando eventos"
echo "- Dados do drag não sendo passados corretamente"
echo "- IDs duplicados ou inválidos"
echo "- Sensores muito ou pouco sensíveis"
echo ""

echo "✅ Verificação concluída!"
