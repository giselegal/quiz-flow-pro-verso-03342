#!/bin/bash

# 📊 SCRIPT DE ANÁLISE DE BUNDLE
# Sprint 5: Dependency Audit
# Data: 2025-01-16

echo "📊 Análise de Bundle Size"
echo "========================="
echo ""

# Build o projeto
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build falhou!"
    exit 1
fi

echo ""
echo "📦 Tamanho dos arquivos gerados:"
echo ""

# Analisar tamanho dos arquivos
cd dist/assets
ls -lh *.js | awk '{print $5 "\t" $9}'

echo ""
echo "📊 Total por tipo:"
echo ""
echo "JavaScript:"
du -ch *.js | tail -1

if ls *.css 1> /dev/null 2>&1; then
    echo ""
    echo "CSS:"
    du -ch *.css | tail -1
fi

echo ""
echo "📈 Análise detalhada salva em: bundle-analysis.txt"

# Criar relatório detalhado
{
    echo "=== BUNDLE ANALYSIS REPORT ==="
    echo "Data: $(date)"
    echo ""
    echo "=== JavaScript Files ==="
    ls -lh *.js
    echo ""
    echo "=== CSS Files ==="
    ls -lh *.css 2>/dev/null || echo "No CSS files"
    echo ""
    echo "=== Total Size ==="
    du -ch * | tail -1
} > bundle-analysis.txt

cd ../..

echo ""
echo "✅ Análise completa!"
echo ""
echo "💡 Dica: Compare este relatório antes e depois da remoção de dependências"
