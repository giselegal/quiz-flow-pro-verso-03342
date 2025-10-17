#!/bin/bash
# 🎯 SCRIPT DE VERIFICAÇÃO - SOLUÇÃO B IMPLEMENTADA

echo "═══════════════════════════════════════════════════════════════"
echo "  ✅ SOLUÇÃO B: PROPS → BLOCKS - IMPLEMENTAÇÃO COMPLETA"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# 1. Verificar Schemas
echo "📋 1. Schemas Zod..."
ls -1 src/schemas/*.schema.ts 2>/dev/null | grep -E "(intro|question|strategic|transition|result|offer)" | wc -l | xargs echo "   Encontrados:"
echo ""

# 2. Verificar Normalizadores
echo "📋 2. Normalizadores..."
test -f src/utils/normalize.ts && echo "   ✓ normalize.ts"
test -f src/utils/normalizeByType.ts && echo "   ✓ normalizeByType.ts"
echo ""

# 3. Verificar Adapter
echo "📋 3. Adapter..."
test -f src/services/editor/PropsToBlocksAdapter.ts && echo "   ✓ PropsToBlocksAdapter.ts"
test -f src/services/editor/UnifiedQuizStepAdapter.ts && echo "   ✓ UnifiedQuizStepAdapter.ts"
echo ""

# 4. Verificar Step Editors
echo "📋 4. Step Editors (React Hook Form)..."
test -f src/components/editor/step-editors/QuestionStepEditor.tsx && echo "   ✓ QuestionStepEditor.tsx"
test -f src/components/editor/step-editors/IntroStepEditor.tsx && echo "   ✓ IntroStepEditor.tsx"
echo ""

# 5. Verificar Testes
echo "📋 5. Testes Unitários..."
test -f src/tests/editor-core/normalize.utils.test.ts && echo "   ✓ normalize.utils.test.ts"
test -f src/tests/editor-core/props-to-blocks.adapter.test.ts && echo "   ✓ props-to-blocks.adapter.test.ts"
test -f src/tests/editor-core/question.schema.test.ts && echo "   ✓ question.schema.test.ts"
echo ""

# 6. Verificar Documentação
echo "📋 6. Documentação..."
test -f SOLUCAO_B_DOCUMENTACAO.md && echo "   ✓ SOLUCAO_B_DOCUMENTACAO.md"
test -f IMPLEMENTACAO_CHECKLIST.md && echo "   ✓ IMPLEMENTACAO_CHECKLIST.md"
echo ""

# 7. Verificar Integração no Editor
echo "📋 7. Integração no Editor..."
grep -q "onStepPropsApply" src/components/editor/quiz/QuizModularProductionEditor.tsx && echo "   ✓ onStepPropsApply handler"
grep -q "PropsToBlocksAdapter" src/components/editor/quiz/QuizModularProductionEditor.tsx && echo "   ✓ PropsToBlocksAdapter import"
grep -q "SCHEMAS" src/components/editor/quiz/QuizModularProductionEditor.tsx && echo "   ✓ SCHEMAS import"
grep -q "StepPropsEditor" src/components/editor/quiz/components/PropertiesPanel.tsx && echo "   ✓ StepPropsEditor component"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "  🚀 PRÓXIMOS PASSOS"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "1. Iniciar dev server:"
echo "   npm run dev"
echo ""
echo "2. Abrir editor:"
echo "   http://localhost:5173/editor?template=quiz21StepsComplete"
echo ""
echo "3. Selecionar uma etapa e editar propriedades:"
echo "   - Ir a 'Propriedades da Etapa'"
echo "   - Editar JSON"
echo "   - Clicar 'Aplicar Props → Blocks'"
echo ""
echo "4. Executar testes:"
echo "   npm run -s test -- src/tests/editor-core"
echo ""
echo "═══════════════════════════════════════════════════════════════"
