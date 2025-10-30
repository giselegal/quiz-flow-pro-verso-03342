#!/bin/bash
set -e

echo "🔍 Analisando uso de arquivos DEPRECATED..."

ROOT_DIR=$(dirname "$0")/..
cd "$ROOT_DIR"

echo -e "\n📋 QUIZSTEPS.TS:"
COUNT1=$(grep -r "from.*quizSteps" src/ --include="*.tsx" --include="*.ts" | wc -l || true)
echo "Total de arquivos: $COUNT1"
grep -rn "from.*quizSteps" src/ --include="*.tsx" --include="*.ts" || true

echo -e "\n📋 QUIZ21STEPSCOMPLETE.TS:"
COUNT2=$(grep -r "quiz21StepsComplete" src/ --include="*.tsx" --include="*.ts" | wc -l || true)
echo "Total de arquivos: $COUNT2"
grep -rn "quiz21StepsComplete" src/ --include="*.tsx" --include="*.ts" || true

echo -e "\n📋 MASTER JSON DIRETO:"
COUNT3=$(grep -r "quiz21-complete.json" src/ --include="*.tsx" --include="*.ts" | wc -l || true)
echo "Total de arquivos: $COUNT3"
grep -rn "quiz21-complete.json" src/ --include="*.tsx" --include="*.ts" || true

echo -e "\n✅ Concluído."