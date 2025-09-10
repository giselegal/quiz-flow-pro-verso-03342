#!/bin/bash

echo "🔍 VERIFICAÇÃO COMPLETA DO CANVAS - DEBUG SISTÊMICO"
echo "================================================"

echo "1. ✅ Testando servidor Vite..."
curl -s http://localhost:8080/ > /dev/null && echo "✅ Servidor OK" || echo "❌ Servidor falhou"

echo ""
echo "2. 🔍 Verificando se React está renderizando..."
REACT_CONTENT=$(curl -s http://localhost:8080/editor | grep -E "data-react|DraggableComponentItem|Canvas|editorpro" | wc -l)
echo "Elementos React encontrados: $REACT_CONTENT"

if [ "$REACT_CONTENT" -eq 0 ]; then
    echo "❌ PROBLEMA: React não está renderizando!"
    
    echo ""
    echo "3. 🔍 Verificando console de erros..."
    # Vamos simular uma requisição para verificar se há erros de módulo
    curl -s http://localhost:8080/src/App.tsx | grep -i "error\|failed\|cannot" | head -3
    
    echo ""
    echo "4. 🔍 Verificando imports problemáticos..."
    echo "Arquivo App.tsx tem imports @:"
    grep -n "from '@/" src/App.tsx | head -5
    
    echo ""
    echo "Arquivo MainEditor.tsx:"
    grep -n "from.*components" src/pages/MainEditor.tsx
    
    echo ""
    echo "5. 🔍 Verificando se alias @ está funcionando..."
    curl -s "http://localhost:8080/@/components/editor/EditorPro" 2>&1 | head -1
    
else
    echo "✅ React está renderizando!"
    echo ""
    echo "3. 🔍 Procurando Canvas específico..."
    curl -s http://localhost:8080/editor | grep -i -E "canvas|drop.*zone" | head -3
fi

echo ""
echo "6. 🔍 Status dos arquivos essenciais:"
echo "EditorPro.tsx: $([ -f "src/components/editor/EditorPro.tsx" ] && echo "✅ existe" || echo "❌ não existe")"
echo "CanvasDropZone.tsx: $([ -f "src/components/editor/canvas/CanvasDropZone.tsx" ] && echo "✅ existe" || echo "❌ não existe")"
echo "ErrorBoundary.tsx: $([ -f "src/components/editor/ErrorBoundary.tsx" ] && echo "✅ existe" || echo "❌ não existe")"
