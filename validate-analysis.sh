#!/bin/bash

echo "�� VALIDAÇÃO COMPLETA DA ANÁLISE"
echo "================================="
echo ""

# 1. Serviços
echo "1️⃣ SERVIÇOS:"
SERVICES_COUNT=$(find src -type f -name "*Service*.ts" 2>/dev/null | wc -l)
echo "   Total: $SERVICES_COUNT"
echo "   Funnel: $(find src -type f -name "*Funnel*.ts" 2>/dev/null | grep -i service | wc -l)"
echo "   Template: $(find src -type f -name "*Template*.ts" 2>/dev/null | grep -i service | wc -l)"
echo ""

# 2. @ts-nocheck
echo "2️⃣ @TS-NOCHECK:"
TS_NOCHECK=$(grep -r "@ts-nocheck" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
echo "   Total: $TS_NOCHECK arquivos"
echo ""

# 3. Arquivos raiz
echo "3️⃣ ARQUIVOS TEMPORÁRIOS NA RAIZ:"
ROOT_FILES=$(ls -1 *.{sh,py,md} 2>/dev/null | wc -l)
echo "   Total: $ROOT_FILES"
echo ""

# 4. Testes
echo "4️⃣ TESTES:"
TEST_FILES=$(find . -name "*.test.ts" -o -name "*.spec.ts" 2>/dev/null | wc -l)
echo "   Arquivos de teste: $TEST_FILES"
echo ""

# 5. Bundle (se existir)
echo "5️⃣ BUNDLE SIZE:"
if [ -d "dist" ]; then
    BUNDLE_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
    echo "   Tamanho: $BUNDLE_SIZE"
else
    echo "   ⚠️ Sem build disponível"
fi
echo ""

# 6. Deprecated code
echo "6️⃣ CÓDIGO DEPRECATED:"
DEPRECATED=$(grep -r "@deprecated" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
echo "   Itens marcados: $DEPRECATED"
echo ""

# 7. Documentação
echo "7️⃣ DOCUMENTAÇÃO:"
DOC_FILES=$(find docs -name "*.md" 2>/dev/null | wc -l)
ROOT_DOCS=$(ls -1 *.md 2>/dev/null | wc -l)
echo "   Arquivos em docs/: $DOC_FILES"
echo "   Arquivos na raiz: $ROOT_DOCS"
echo ""

# 8. Detalhamento de Serviços duplicados
echo "8️⃣ SERVIÇOS DUPLICADOS (CRÍTICO):"
echo "   Funnel Services:"
find src -type f -name "*Funnel*Service*.ts" 2>/dev/null | sed 's|src/||' | sort
echo ""
echo "   Template Services:"
find src -type f -name "*Template*Service*.ts" 2>/dev/null | sed 's|src/||' | sort
echo ""

echo "================================="
echo "✅ Validação concluída!"
