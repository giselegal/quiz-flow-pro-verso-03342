#!/bin/bash

# 🎨 Script de Correção Automática de Cores da Marca Gisele Galvão
# Corrige todas as cores incorretas para a paleta oficial

echo "🎨 Iniciando correção de cores da marca..."
echo ""

# Arquivo alvo
FILE="src/components/quiz/ResultStep.tsx"

# Criar backup
cp "$FILE" "${FILE}.backup-before-colors"
echo "✅ Backup criado: ${FILE}.backup-before-colors"
echo ""

# Contadores
TOTAL_CHANGES=0

echo "🔄 Aplicando correções..."
echo ""

# 1. Corrigir dourado principal: #deac6d → #B89B7A
echo "1️⃣  Corrigindo dourado principal (#deac6d → #B89B7A)..."
COUNT=$(grep -o '#deac6d' "$FILE" | wc -l)
sed -i 's/#deac6d/#B89B7A/g' "$FILE"
sed -i 's/\[#deac6d\]/[#B89B7A]/g' "$FILE"
echo "   ✓ $COUNT ocorrências corrigidas"
TOTAL_CHANGES=$((TOTAL_CHANGES + COUNT))

# 2. Corrigir gradiente dourado: #c19952 → #a08966
echo "2️⃣  Corrigindo gradiente dourado (#c19952 → #a08966)..."
COUNT=$(grep -o '#c19952' "$FILE" | wc -l)
sed -i 's/#c19952/#a08966/g' "$FILE"
sed -i 's/\[#c19952\]/[#a08966]/g' "$FILE"
echo "   ✓ $COUNT ocorrências corrigidas"
TOTAL_CHANGES=$((TOTAL_CHANGES + COUNT))

# 3. Corrigir background: #faf5f0 → #fffaf7
echo "3️⃣  Corrigindo background (#faf5f0 → #fffaf7)..."
COUNT=$(grep -o '#faf5f0' "$FILE" | wc -l)
sed -i 's/#faf5f0/#fffaf7/g' "$FILE"
echo "   ✓ $COUNT ocorrências corrigidas"
TOTAL_CHANGES=$((TOTAL_CHANGES + COUNT))

# 4. Simplificar gradiente de background
echo "4️⃣  Simplificando gradiente de background..."
sed -i 's/bg-gradient-to-br from-\[#fffaf7\] to-\[#fffaf7\]/bg-[#fffaf7]/g' "$FILE"
echo "   ✓ Gradiente simplificado"

# 5. Corrigir títulos: #5b4135 → #432818
echo "5️⃣  Corrigindo cor dos títulos (#5b4135 → #432818)..."
COUNT=$(grep -o '#5b4135' "$FILE" | wc -l)
sed -i 's/#5b4135/#432818/g' "$FILE"
sed -i 's/text-\[#5b4135\]/text-[#432818]/g' "$FILE"
echo "   ✓ $COUNT ocorrências corrigidas"
TOTAL_CHANGES=$((TOTAL_CHANGES + COUNT))

# 6. Remover verde esmeralda dos CTAs
echo "6️⃣  Removendo verde esmeralda dos CTAs..."
COUNT=$(grep -o 'from-emerald-500 to-green-600' "$FILE" | wc -l)
sed -i 's/from-emerald-500 to-green-600/from-[#B89B7A] to-[#a08966]/g' "$FILE"
echo "   ✓ $COUNT botões corrigidos"
TOTAL_CHANGES=$((TOTAL_CHANGES + COUNT))

# 7. Corrigir cores verdes em textos
echo "7️⃣  Corrigindo cores verdes em textos..."
sed -i 's/text-green-600/text-[#B89B7A]/g' "$FILE"
sed -i 's/text-green-700/text-[#B89B7A]/g' "$FILE"
sed -i 's/bg-green-50/bg-[#B89B7A]\/5/g' "$FILE"
sed -i 's/bg-green-100/bg-[#B89B7A]\/10/g' "$FILE"
sed -i 's/border-green-200/border-[#B89B7A]\/20/g' "$FILE"
sed -i 's/text-green-500/text-[#B89B7A]/g' "$FILE"
echo "   ✓ Cores verdes removidas"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅ CORREÇÕES CONCLUÍDAS"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "📊 Estatísticas:"
echo "   • Total de mudanças: $TOTAL_CHANGES"
echo "   • Arquivo modificado: $FILE"
echo "   • Backup salvo em: ${FILE}.backup-before-colors"
echo ""

# Verificar resultados
echo "🔍 Verificação final:"
echo ""

CORRECT_PRIMARY=$(grep -o '#B89B7A' "$FILE" | wc -l)
CORRECT_ACCENT=$(grep -o '#a08966' "$FILE" | wc -l)
CORRECT_SECONDARY=$(grep -o '#432818' "$FILE" | wc -l)
WRONG_DEAC6D=$(grep -o '#deac6d' "$FILE" | wc -l)
WRONG_C19952=$(grep -o '#c19952' "$FILE" | wc -l)
WRONG_5B4135=$(grep -o '#5b4135' "$FILE" | wc -l)
WRONG_EMERALD=$(grep -o 'emerald-500' "$FILE" | wc -l)

echo "   ✅ Cores corretas:"
echo "      • #B89B7A (primary): $CORRECT_PRIMARY ocorrências"
echo "      • #a08966 (accent): $CORRECT_ACCENT ocorrências"
echo "      • #432818 (secondary): $CORRECT_SECONDARY ocorrências"
echo ""

if [ $WRONG_DEAC6D -eq 0 ] && [ $WRONG_C19952 -eq 0 ] && [ $WRONG_5B4135 -eq 0 ] && [ $WRONG_EMERALD -eq 0 ]; then
  echo "   🎉 SUCESSO! Nenhuma cor incorreta encontrada!"
else
  echo "   ⚠️  Cores incorretas ainda presentes:"
  [ $WRONG_DEAC6D -gt 0 ] && echo "      • #deac6d: $WRONG_DEAC6D ocorrências"
  [ $WRONG_C19952 -gt 0 ] && echo "      • #c19952: $WRONG_C19952 ocorrências"
  [ $WRONG_5B4135 -gt 0 ] && echo "      • #5b4135: $WRONG_5B4135 ocorrências"
  [ $WRONG_EMERALD -gt 0 ] && echo "      • emerald-500: $WRONG_EMERALD ocorrências"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "📝 Próximos passos:"
echo "   1. Revisar mudanças: git diff $FILE"
echo "   2. Testar visualmente: npm run dev"
echo "   3. Se OK, commit: git add $FILE && git commit -m '🎨 fix: Corrigir cores da marca para paleta oficial'"
echo "═══════════════════════════════════════════════════════"
