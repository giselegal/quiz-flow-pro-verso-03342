#!/bin/bash

# 🌐 TESTE REAL NO NAVEGADOR: Abrir /templates
# Execute: bash scripts/open-templates-page.sh

echo "🌐 Abrindo página /templates no navegador..."
echo ""
echo "Servidor rodando em: http://localhost:8081"
echo "Página de templates: http://localhost:8081/templates"
echo ""
echo "📋 O que verificar manualmente:"
echo ""
echo "1️⃣ PÁGINA /templates"
echo "   • Título: 'Templates de Funis'"
echo "   • Cards com templates devem aparecer"
echo "   • Badge '21 etapas' deve estar visível"
echo "   • Filtros de categoria (Todos, quiz-complete, etc.)"
echo ""
echo "2️⃣ CLICAR EM UM TEMPLATE"
echo "   • Deve redirecionar para /editor?template=quiz21StepsComplete"
echo "   • Aguardar 2-3 segundos (carregando JSON...)"
echo "   • Editor deve carregar com blocos reais"
echo ""
echo "3️⃣ ABRIR CONSOLE DO NAVEGADOR (F12)"
echo "   • Procurar por: '📚 getAllSteps usando templateId'"
echo "   • Procurar requisições para: 'quiz21-complete.json'"
echo "   • Verificar se não há erros 404 ou 500"
echo ""
echo "=========================================="
echo ""

# Tentar abrir no navegador
if command -v xdg-open > /dev/null; then
    xdg-open "http://localhost:8081/templates"
    echo "✅ Página aberta no navegador padrão"
elif command -v open > /dev/null; then
    open "http://localhost:8081/templates"
    echo "✅ Página aberta no navegador padrão (macOS)"
else
    echo "⚠️ Não foi possível abrir automaticamente"
    echo "   Abra manualmente: http://localhost:8081/templates"
fi

echo ""
echo "📊 CHECKLIST DE VALIDAÇÃO:"
echo ""
echo "[ ] 1. Página /templates carregou corretamente"
echo "[ ] 2. Templates estão visíveis (cards com nomes)"
echo "[ ] 3. Badge '21 etapas' aparece em pelo menos 1 template"
echo "[ ] 4. Ao clicar, redireciona para /editor?template=..."
echo "[ ] 5. No console (F12): requisição para quiz21-complete.json"
echo "[ ] 6. Editor carrega blocos reais (não '⚠️ Conteúdo Temporário')"
echo ""
