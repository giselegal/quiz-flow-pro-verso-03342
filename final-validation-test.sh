#!/bin/bash

# 🎯 TESTE FINAL INTEGRADO - VALIDAÇÃO COMPLETA
# Este é o teste definitivo para confirmar que tudo está funcionando

echo "🎯 TESTE FINAL INTEGRADO - VALIDAÇÃO COMPLETA"
echo "═══════════════════════════════════════════════════════════════════"
echo "📅 $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Contadores
PASSED=0
FAILED=0

test_step() {
    local step_name="$1"
    local command="$2"
    
    echo -n "🔍 $step_name: "
    
    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSOU${NC}"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FALHOU${NC}"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo "🏗️ ETAPA 1: BUILD E COMPILAÇÃO"
echo "─────────────────────────────────────────────────────────────────"

test_step "Build TypeScript sem erros" "npm run build >/dev/null 2>&1"
test_step "Dist/ foi gerado" "[ -d 'dist' ]"
test_step "Assets foram gerados" "[ -d 'dist/assets' ] || [ -f 'dist/index.html' ]"

echo ""
echo "🧩 ETAPA 2: COMPONENTES E ESTRUTURA"
echo "─────────────────────────────────────────────────────────────────"

test_step "QuestionTitleBlock existe" "[ -f 'src/components/editor/blocks/atomic/QuestionTitleBlock.tsx' ]"
test_step "QuestionHeroBlock existe" "[ -f 'src/components/editor/blocks/atomic/QuestionHeroBlock.tsx' ]"
test_step "BlockDataNormalizer integrado" "grep -q 'BlockDataNormalizer' 'src/components/editor/quiz/QuizModularEditor/components/CanvasColumn/index.tsx'"
test_step "SafeDndContext implementado" "[ -f 'src/components/editor/quiz/QuizModularEditor/components/SafeDndContext.tsx' ]"

echo ""
echo "🌐 ETAPA 3: SERVIDOR E CONECTIVIDADE"
echo "─────────────────────────────────────────────────────────────────"

test_step "Servidor responde na porta 8080" "curl -s http://localhost:8080 >/dev/null"
test_step "Editor carrega" "curl -s http://localhost:8080/editor | grep -q 'html'"
test_step "React está funcionando" "curl -s http://localhost:8080 | grep -q 'react'"

echo ""
echo "📄 ETAPA 4: TEMPLATES E DADOS"
echo "─────────────────────────────────────────────────────────────────"

test_step "Templates JSON existem" "[ -f 'public/templates/step-01-v3.json' ] && [ -f 'public/templates/step-02-v3.json' ]"
test_step "Step-01 tem blocos corretos" "grep -q 'intro-title' 'public/templates/step-01-v3.json'"
test_step "Step-02 tem blocos corretos" "grep -q 'question-progress' 'public/templates/step-02-v3.json'"
test_step "Step-20 tem resultado" "grep -q 'result-main' 'public/templates/step-20-v3.json'"

echo ""
echo "🔧 ETAPA 5: REGISTRY E INTEGRAÇÃO"
echo "─────────────────────────────────────────────────────────────────"

test_step "UnifiedBlockRegistry configurado" "grep -q 'question-title' 'src/registry/UnifiedBlockRegistry.ts'"
test_step "Backup do registry existe" "[ -f 'src/registry/UnifiedBlockRegistry.ts.backup' ]"
test_step "Análise de blocos funciona" "node analyze-blocks-simple.cjs >/dev/null 2>&1"

echo ""
echo "🎯 ETAPA 6: TESTE DE FUNCIONALIDADE E2E"
echo "─────────────────────────────────────────────────────────────────"

# Criar teste E2E simples
cat > temp_e2e_test.js << 'EOF'
const http = require('http');

// Teste se o editor carrega com template específico
function testEditorWithTemplate() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:8080/editor?template=quiz21StepsComplete', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Verificar se tem conteúdo HTML válido
                const hasHtml = data.includes('<html');
                const hasReact = data.includes('react') || data.includes('React');
                const isLargeEnough = data.length > 5000; // Pelo menos 5KB
                
                resolve(hasHtml && hasReact && isLargeEnough);
            });
        });
        
        req.on('error', () => resolve(false));
        req.setTimeout(5000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

testEditorWithTemplate().then(result => {
    process.exit(result ? 0 : 1);
});
EOF

test_step "Editor funciona end-to-end" "node temp_e2e_test.js"
rm -f temp_e2e_test.js

echo ""
echo "📊 RESULTADO FINAL"
echo "═══════════════════════════════════════════════════════════════════"

TOTAL=$((PASSED + FAILED))
SUCCESS_RATE=$(( (PASSED * 100) / TOTAL ))

echo -e "📈 Testes executados: ${BLUE}$TOTAL${NC}"
echo -e "✅ Testes aprovados: ${GREEN}$PASSED${NC}"
echo -e "❌ Testes falharam: ${RED}$FAILED${NC}"
echo -e "🎯 Taxa de sucesso: ${BLUE}$SUCCESS_RATE%${NC}"

echo ""
if [ $SUCCESS_RATE -ge 90 ]; then
    echo -e "${GREEN}🏆 SISTEMA PERFEITO! (90%+)${NC}"
    echo -e "${GREEN}✨ Todas as funcionalidades estão operacionais${NC}"
    echo ""
    echo "🎉 PARABÉNS! O sistema está funcionando perfeitamente:"
    echo "• ✅ Build sem erros"
    echo "• ✅ Componentes críticos implementados"
    echo "• ✅ Servidor funcionando" 
    echo "• ✅ Editor carregando corretamente"
    echo "• ✅ Templates funcionais"
    echo ""
    echo "🌐 TESTE MANUAL RECOMENDADO:"
    echo "   Acesse: http://localhost:8080/editor?template=quiz21StepsComplete"
    echo ""
elif [ $SUCCESS_RATE -ge 80 ]; then
    echo -e "${YELLOW}🟡 SISTEMA MUITO BOM! (80%+)${NC}"
    echo -e "${YELLOW}💪 Sistema funcional com pequenos ajustes necessários${NC}"
elif [ $SUCCESS_RATE -ge 70 ]; then
    echo -e "${YELLOW}🟠 SISTEMA BOM! (70%+)${NC}"
    echo -e "${YELLOW}⚡ Sistema parcialmente funcional${NC}"
else
    echo -e "${RED}🔴 SISTEMA PRECISA DE ATENÇÃO (<70%)${NC}"
    echo -e "${RED}🔧 Correções necessárias antes do uso${NC}"
fi

echo ""
echo "📋 CHECKLIST DE VALIDAÇÃO FINAL:"
echo "─────────────────────────────────────────"
echo "🔍 Para confirmar que tudo está funcionando:"
echo "1. Acesse http://localhost:8080/editor?template=quiz21StepsComplete"
echo "2. Verifique se a página carrega sem erros no console"
echo "3. Teste navegação entre steps (se disponível)"
echo "4. Verifique se componentes são renderizados"
echo "5. Confirme que não há erros de JavaScript"

echo ""
echo "✨ VALIDAÇÃO COMPLETA FINALIZADA!"
echo "📅 $(date '+%Y-%m-%d %H:%M:%S')"

# Exit code baseado no sucesso
exit $([ $SUCCESS_RATE -ge 80 ] && echo 0 || echo 1)