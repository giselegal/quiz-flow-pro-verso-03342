#!/bin/bash

# 🧹 Script de Verificação de Arquivos .md Vazios
# Previne commit de arquivos .md vazios

echo "🔍 Verificando arquivos .md vazios..."

EMPTY_FILES=$(find . -name "*.md" -size 0 -type f | grep -v node_modules)

if [ ! -z "$EMPTY_FILES" ]; then
    echo "❌ Arquivos .md vazios encontrados:"
    echo "$EMPTY_FILES"
    echo ""
    echo "💡 Remova ou preencha estes arquivos antes de continuar."
    exit 1
else
    echo "✅ Nenhum arquivo .md vazio encontrado!"
    exit 0
fi
