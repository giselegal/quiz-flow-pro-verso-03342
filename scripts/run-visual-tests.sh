#!/bin/bash

# 🎨 Script de Testes Visuais Automáticos
# Executa testes visuais e gera relatório comparativo

echo "🎨 Iniciando Testes Visuais Automáticos..."
echo ""

# Criar diretório para screenshots se não existir
mkdir -p tests/screenshots/visual
mkdir -p tests/screenshots/baseline

# Limpar screenshots antigos (opcional)
if [ "$1" == "--clean" ]; then
    echo "🧹 Limpando screenshots antigos..."
    rm -rf tests/screenshots/visual/*
    echo "✅ Screenshots limpos"
fi

# Executar testes visuais
echo "📸 Capturando screenshots..."
echo ""

npx playwright test tests/e2e/visual/editor-visual.spec.ts \
    --project=chromium \
    --workers=1 \
    --reporter=html \
    --output=test-results/visual

# Verificar resultado
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Testes visuais concluídos com sucesso!"
    echo ""
    echo "📊 Screenshots salvos em: tests/screenshots/visual/"
    echo "📈 Relatório HTML: playwright-report/index.html"
    echo ""
    echo "Para visualizar o relatório:"
    echo "  npx playwright show-report"
    echo ""
else
    echo ""
    echo "❌ Alguns testes falharam"
    echo "Verifique o relatório para mais detalhes"
    echo ""
fi

# Listar screenshots capturados
echo "📁 Screenshots capturados:"
ls -lh tests/screenshots/visual/ 2>/dev/null || echo "Nenhum screenshot encontrado"
