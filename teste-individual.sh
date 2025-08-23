#!/bin/bash

echo "🔬 TESTE INDIVIDUAL DE CADA COMPONENTE"
echo "======================================"

echo ""
echo "🧪 Testando se cada arquivo tem erro de sintaxe ou import:"

echo ""
echo "1. Testando main.tsx..."
curl -s "http://localhost:8080/src/main.tsx" | grep -i "error\|failed" | head -2

echo ""
echo "2. Testando App.tsx..."
curl -s "http://localhost:8080/src/App.tsx" | grep -i "error\|failed" | head -2

echo ""
echo "3. Testando MainEditor.tsx..."
curl -s "http://localhost:8080/src/pages/MainEditor.tsx" | grep -i "error\|failed" | head -2

echo ""
echo "4. Testando EditorProvider.tsx..."
curl -s "http://localhost:8080/src/components/editor/EditorProvider.tsx" | grep -i "error\|failed" | head -2

echo ""
echo "5. Testando EditorPro.tsx..."
curl -s "http://localhost:8080/src/components/editor/EditorPro.tsx" | grep -i "error\|failed" | head -2

echo ""
echo "🔍 Verificando status HTTP de cada arquivo:"
echo "==========================================="

files=(
    "/src/main.tsx"
    "/src/App.tsx" 
    "/src/pages/MainEditor.tsx"
    "/src/components/editor/EditorProvider.tsx"
    "/src/components/editor/EditorPro.tsx"
)

for file in "${files[@]}"; do
    status=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:8080$file")
    echo "$(basename "$file"): HTTP $status"
done

echo ""
echo "🎯 Teste simples - verificando se div root tem conteúdo:"
curl -s http://localhost:8080/editor | grep -A10 -B5 '<div id="root">' | tail -15
