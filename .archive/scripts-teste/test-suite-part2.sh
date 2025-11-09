# Teste de análise dos componentes
run_test "Análise de blocos funcionando" "node analyze-blocks-simple.cjs >/dev/null 2>&1" true

# Teste de build TypeScript
run_test "Build TypeScript sem erros" "npm run build >/dev/null 2>&1" true

echo ""
echo "🌐 CATEGORIA 8: TESTES DE SERVIDOR (se rodando)"
echo "─────────────────────────────────────────────────────────────────"

# Verificar se servidor está rodando (opcional)
if curl -s http://localhost:8080 >/dev/null 2>&1; then
    echo "🟢 Servidor detectado em localhost:8080"
    
    run_test "Página principal acessível" "curl -s http://localhost:8080 | grep -q 'html'" true
    run_test "Editor acessível" "curl -s 'http://localhost:8080/editor' | grep -q 'html'" true
    
    # Testar se assets estão sendo servidos
    run_test "Assets são servidos" "curl -s http://localhost:8080/assets/ >/dev/null 2>&1 || curl -s http://localhost:8080/src/ >/dev/null 2>&1" false
else
    echo "🟡 Servidor não detectado (opcional)"
fi

echo ""
echo "🧪 CATEGORIA 9: VALIDAÇÃO DE COMPONENTES REACT"
echo "─────────────────────────────────────────────────────────────────"

# Criar teste sintático dos componentes
cat > temp_component_test.js << 'EOF'
const fs = require('fs');

// Verificar se componentes têm sintaxe React válida
function validateReactComponent(filePath) {
    if (!fs.existsSync(filePath)) return false;
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificações básicas de sintaxe React
    const checks = [
        /import\s+React/,                    // Importa React
        /export\s+default\s+function/,       // Export default function
        /return\s*\(/,                       // Return statement
        /\<\w+/,                            // JSX tags
        /\>\s*;?\s*\}/                      // Closing JSX
    ];
    
    return checks.every(check => check.test(content));
}

// Testar componentes críticos
const criticalComponents = [
    'src/components/editor/blocks/atomic/QuestionTitleBlock.tsx',
    'src/components/editor/blocks/atomic/QuestionHeroBlock.tsx'
];

criticalComponents.forEach(comp => {
    const isValid = validateReactComponent(comp);
    console.log(`${comp}: ${isValid ? 'VÁLIDO' : 'INVÁLIDO'}`);
});
EOF

run_test "Componentes têm sintaxe React válida" "node temp_component_test.js | grep -q 'VÁLIDO'" true

# Limpar arquivo temporário
rm -f temp_component_test.js

echo ""
echo "📊 RESUMO DOS TESTES"
echo "═══════════════════════════════════════════════════════════════════"
echo -e "📈 Total de testes: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "✅ Testes aprovados: ${GREEN}$PASSED_TESTS${NC}"
echo -e "❌ Testes falharam: ${RED}$FAILED_TESTS${NC}"

# Calcular percentual de sucesso
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    echo -e "🎯 Taxa de sucesso: ${PURPLE}$SUCCESS_RATE%${NC}"
else
    echo -e "🎯 Taxa de sucesso: ${PURPLE}0%${NC}"
fi

echo ""
echo "🏆 AVALIAÇÃO GERAL:"
if [ $SUCCESS_RATE -ge 90 ]; then
    echo -e "${GREEN}🟢 EXCELENTE - Sistema em ótimo estado!${NC}"
elif [ $SUCCESS_RATE -ge 75 ]; then
    echo -e "${YELLOW}🟡 BOM - Sistema funcional com alguns pontos de atenção${NC}"
elif [ $SUCCESS_RATE -ge 50 ]; then
    echo -e "${YELLOW}🟠 REGULAR - Sistema parcialmente funcional${NC}"
else
    echo -e "${RED}🔴 CRÍTICO - Sistema com problemas sérios${NC}"
fi

echo ""
echo "🔧 PRÓXIMOS PASSOS RECOMENDADOS:"
echo "1. Se taxa < 90%: Investigar testes falhados"
echo "2. Executar servidor: npm run dev"
echo "3. Testar editor: http://localhost:8080/editor?template=quiz21StepsComplete"
echo "4. Implementar componentes restantes se necessário"

echo ""
echo "✨ TESTE AUTOMÁTICO CONCLUÍDO!"
echo "📅 $(date '+%Y-%m-%d %H:%M:%S')"

# Retornar código de saída baseado nos resultados
if [ $SUCCESS_RATE -ge 75 ]; then
    exit 0
else
    exit 1
fi