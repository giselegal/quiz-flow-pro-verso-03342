#!/bin/bash

# 🧪 TESTE RÁPIDO: Validar Testes TypeScript
# Verifica se os testes compilam sem erros

echo "🔍 Verificando erros de TypeScript nos testes..."
echo ""

# Verificar apenas nossos arquivos de teste
npx tsc --noEmit \
  tests/unit/template-service-json-loading.test.ts \
  tests/integration/unified-registry-aliases.test.ts \
  tests/integration/json-loading-flow.test.ts \
  2>&1 | grep -E "(template-service|unified-registry|json-loading)" || echo "✅ Nenhum erro encontrado nos testes!"

echo ""
echo "📝 Testes criados:"
echo "  ✓ tests/unit/template-service-json-loading.test.ts"
echo "  ✓ tests/integration/unified-registry-aliases.test.ts"
echo "  ✓ tests/integration/json-loading-flow.test.ts"
echo "  ✓ tests/e2e/funnel-json-loading.spec.ts"
echo ""
echo "Para executar:"
echo "  npm run test:unit tests/unit/template-service-json-loading.test.ts"
echo "  npm run test:unit tests/integration/unified-registry-aliases.test.ts"
echo "  npx playwright test tests/e2e/funnel-json-loading.spec.ts"
