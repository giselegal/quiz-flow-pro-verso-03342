#!/bin/bash

echo "🔄 CAMINHO REVERSO DO CANVAS - IDENTIFICAÇÃO DO ERRO"
echo "=================================================="

echo "ETAPA 1: O que DEVERIA aparecer na página /editor"
echo "→ CanvasDropZone component com drag & drop funcional"
echo ""

echo "ETAPA 2: Verificando se a página /editor está carregando"
EDITOR_SIZE=$(curl -s http://localhost:8080/editor | wc -c)
echo "Tamanho da resposta /editor: $EDITOR_SIZE bytes"

if [ "$EDITOR_SIZE" -lt 1000 ]; then
    echo "❌ ERRO: Página muito pequena - provavelmente erro 404 ou redirecionamento"
    curl -s http://localhost:8080/editor | head -5
else
    echo "✅ Página carrega, mas vamos verificar o conteúdo..."
fi

echo ""
echo "ETAPA 3: Verificando se MainEditor está sendo chamado"
MAIN_EDITOR_ROUTE=$(curl -s http://localhost:8080/editor | grep -i "maineditor\|editor.*main" | wc -l)
echo "Referências a MainEditor: $MAIN_EDITOR_ROUTE"

echo ""
echo "ETAPA 4: Verificando roteamento no App.tsx"
echo "Rotas configuradas:"
grep -n "Route.*editor\|/editor" src/App.tsx

echo ""
echo "ETAPA 5: Verificando se App.tsx está carregando"
curl -s http://localhost:8080/src/App.tsx | grep -E "Failed|Error|Cannot" | head -3

echo ""
echo "ETAPA 6: Verificando main.tsx"
curl -s http://localhost:8080/src/main.tsx | grep -E "Failed|Error|Cannot" | head -3

echo ""
echo "ETAPA 7: Verificando se EditorPro existe e tem Canvas"
echo "EditorPro renderiza CanvasDropZone?"
grep -n -A5 -B5 "CanvasDropZone\|Canvas.*Drop" src/components/editor/EditorPro.tsx | head -10

echo ""
echo "ETAPA 8: Verificando se há erros de import no console"
echo "Status final da cadeia:"
echo "main.tsx → App.tsx → MainEditor → EditorPro → CanvasDropZone"
