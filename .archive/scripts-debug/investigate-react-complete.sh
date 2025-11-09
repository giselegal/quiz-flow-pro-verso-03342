#!/bin/bash

# 🚨 INVESTIGAÇÃO COMPLETA DO PROBLEMA REACT

echo "🚨 INVESTIGAÇÃO COMPLETA - REACT NÃO RENDERIZA"
echo "================================================"

echo "📍 1. Verificando se o servidor está respondendo"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:8081/editor

echo -e "\n📍 2. Verificando se há div#root na página"
curl -s http://localhost:8081/editor | grep -c "div id=\"root\""

echo -e "\n📍 3. Verificando se main.tsx está sendo carregado"
curl -s http://localhost:8081/editor | grep -c "main.tsx"

echo -e "\n📍 4. Verificando se há scripts carregando"
curl -s http://localhost:8081/editor | grep -c "<script"

echo -e "\n📍 5. Verificando erros de JavaScript na resposta"
curl -s http://localhost:8081/editor | grep -i "error\|undefined\|null" | head -3

echo -e "\n📍 6. Verificando se a página tem conteúdo React"
curl -s http://localhost:8081/editor | grep -c "data-react"

echo -e "\n📍 7. Verificando tamanho da resposta (deve ser >10KB se tem React)"
curl -s http://localhost:8081/editor | wc -c

echo -e "\n📍 8. Verificando logs do Vite no terminal"
echo "Últimas linhas do terminal do Vite:"

echo -e "\n🎯 ANÁLISE COMPLETA FINALIZADA!"
echo "Se div#root=1, main.tsx=1, scripts>5 e tamanho>10000 → React deve funcionar"
echo "Se algum desses valores for baixo → há problema de carregamento"
