#!/bin/bash

# Script para adicionar campos faltantes nos schemas

echo "🔧 Corrigindo cobertura de schemas..."

# Adicionar campo subtitle e alignment ao result-header-inline já existe, só precisa verificar

# Adicionar campos ao urgency-timer-inline já existem

# Vamos rodar os testes para ver o relatório completo
npm test -- blockPropertySchemas.props-coverage.test.ts --run

echo "✅ Verificação de cobertura concluída!"
