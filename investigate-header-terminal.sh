#!/bin/bash

# 🔍 Investigação específica do cabeçalho fixo no editor

echo "🚨 INVESTIGANDO CABEÇALHO FIXO NO EDITOR..."

# 1. Verificar se há cabeçalho na página /editor
echo "📍 1. Verificando presença de cabeçalho sticky/fixed na página /editor"
curl -s http://localhost:8081/editor | grep -i "sticky\|fixed" | head -5

echo -e "\n📍 2. Verificando elementos com z-50 ou superior"
curl -s http://localhost:8081/editor | grep -i "z-50\|z-999\|z-100" | head -5

echo -e "\n📍 3. Verificando se há header tag"
curl -s http://localhost:8081/editor | grep -i "<header" | head -3

echo -e "\n📍 4. Verificando CSS que pode interferir"
curl -s http://localhost:8081/editor | grep -i "pointer-events\|user-select" | head -5

echo -e "\n🎯 RESULTADO: Se encontrar elementos, eles podem estar interceptando os eventos de drag!"
