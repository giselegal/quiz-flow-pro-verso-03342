#!/bin/bash

# 🧪 Script para rodar testes do QuizModularEditorV4
# Uso: ./run-v4-tests.sh [unit|integration|all|watch]

set -e

MODE="${1:-all}"

echo "🧪 Running QuizModularEditorV4 Tests - Mode: $MODE"
echo "=================================================="

case "$MODE" in
  unit)
    echo "Running unit tests..."
    npx vitest run \
      src/components/editor/quiz/QuizModularEditor/__tests__/QuizModularEditorV4.test.tsx \
      src/components/editor/quiz/QuizModularEditor/__tests__/useV4BlockAdapter.test.ts \
      --config vitest.v4.config.ts
    ;;
  
  integration)
    echo "Running integration tests..."
    npx vitest run \
      src/components/editor/quiz/QuizModularEditor/__tests__/QuizModularEditorV4.integration.test.tsx \
      --config vitest.v4.config.ts
    ;;
  
  watch)
    echo "Running tests in watch mode..."
    npx vitest watch \
      src/components/editor/quiz/QuizModularEditor/__tests__/ \
      --config vitest.v4.config.ts
    ;;
  
  coverage)
    echo "Running tests with coverage..."
    npx vitest run \
      src/components/editor/quiz/QuizModularEditor/__tests__/ \
      --coverage \
      --config vitest.v4.config.ts
    ;;
  
  all|*)
    echo "Running all tests..."
    npx vitest run \
      src/components/editor/quiz/QuizModularEditor/__tests__/ \
      --config vitest.v4.config.ts
    ;;
esac

echo ""
echo "✅ Tests completed!"
