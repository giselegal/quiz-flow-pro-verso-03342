#!/bin/bash
set -e

echo "🔄 Substituindo imports obsoletos..."

ROOT_DIR=$(dirname "$0")/..
cd "$ROOT_DIR"

FILES=$(grep -rl "from.*quizSteps" src/ --include="*.tsx" --include="*.ts" || true)

for file in $FILES; do
  echo "Processando: $file"
  # Substituir import do tipo apenas (type-only) para novos tipos canônicos
  sed -i "s|from ['\"]@/data/quizSteps['\"]|from '@\/types\/quiz'|g" "$file"
  sed -i "s|from ['\"]../data/quizSteps['\"]|from '@\/types\/quiz'|g" "$file"
  sed -i "s|from ['\"]\.\.\/\.\.\/data/quizSteps['\"]|from '@\/types\/quiz'|g" "$file"
  sed -i "s|\bQuizStep\b|QuizStepV3|g" "$file"
  sed -i "s|\bQuizOption\b|QuizOptionV3|g" "$file"

echo "✅ Imports atualizados em $file"

done

echo "✅ Substituição concluída."