#!/bin/bash

# 🧪 TESTE DE CANVAS VAZIO
echo "🧪 TESTANDO FUNCIONALIDADE DE CANVAS VAZIO"
echo "=========================================="

# Função para testar uma URL
test_url() {
    local url=$1
    local description=$2
    
    echo ""
    echo "🔍 Testando: $description"
    echo "   URL: $url"
    
    # Fazer requisição e verificar se retorna 200
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ $status_code -eq 200 ]; then
        echo "   ✅ STATUS: $status_code - OK"
    else
        echo "   ❌ STATUS: $status_code - ERRO"
    fi
    
    # Verificar se a página contém elementos específicos
    response=$(curl -s "$url")
    
    if echo "$response" | grep -q "EmptyCanvasInterface"; then
        echo "   ✅ CONTÉM: EmptyCanvasInterface detectada"
    else
        echo "   ❌ NÃO CONTÉM: EmptyCanvasInterface não encontrada"
    fi
    
    if echo "$response" | grep -q "Criar Primeira Etapa"; then
        echo "   ✅ CONTÉM: Botão 'Criar Primeira Etapa' encontrado"
    else
        echo "   ❌ NÃO CONTÉM: Botão não encontrado"
    fi
    
    if echo "$response" | grep -q "Canvas vazio"; then
        echo "   ✅ CONTÉM: Texto 'Canvas vazio' encontrado"
    else
        echo "   ❌ NÃO CONTÉM: Texto não encontrado"
    fi
}

# Aguardar servidor iniciar
echo "⏳ Aguardando servidor iniciar..."
sleep 5

# Verificar se servidor está rodando
if ! curl -s http://localhost:8080 > /dev/null; then
    echo "❌ ERRO: Servidor não está rodando em localhost:8080"
    exit 1
fi

echo "✅ Servidor está rodando"

# Testar diferentes cenários
test_url "http://localhost:8080/editor" "Editor sem parâmetros (deve mostrar canvas vazio)"
test_url "http://localhost:8080/editor?id=" "Editor com ID vazio (deve mostrar canvas vazio)"
test_url "http://localhost:8080/editor?id=invalid" "Editor com ID inválido (deve mostrar canvas vazio)"
test_url "http://localhost:8080/editor?id=quiz21StepsComplete" "Editor com ID válido (deve carregar template)"

echo ""
echo "🏁 TESTE CONCLUÍDO"
echo "=================="

# Verificar logs do servidor para erros
echo ""
echo "📋 ÚLTIMOS LOGS DO SERVIDOR:"
tail -20 /tmp/vite.log