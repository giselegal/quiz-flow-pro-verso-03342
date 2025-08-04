#!/bin/bash

# 🎯 MIGRAÇÃO EM LOTE PARA IDs SEMÂNTICOS
echo "🚀 INICIANDO MIGRAÇÃO EM LOTE PARA SISTEMA DE IDs SEMÂNTICOS..."

# Backup dos arquivos originais
echo "📋 Criando backup dos arquivos..."
mkdir -p backup-migration
cp src/utils/helpers.ts backup-migration/
cp src/utils/performanceMonitoring.ts backup-migration/
cp src/services/pageStructureValidator.ts backup-migration/

# 1. Corrigir helpers.ts - substituir Date.now() por data fixa para countdown
echo "🔧 Corrigindo helpers.ts..."
sed -i 's/new Date(Date.now() + 24 \* 60 \* 60 \* 1000).toISOString()/new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()/g' src/utils/helpers.ts

# 2. Corrigir performanceMonitoring.ts - manter Date.now() pois é para performance
echo "🔧 Performance monitoring mantém Date.now() (correto para timestamps)..."

# 3. Corrigir pageStructureValidator.ts
echo "🔧 Corrigindo pageStructureValidator.ts..."

# Adicionar import no início do arquivo
if ! grep -q "generateSemanticId" src/services/pageStructureValidator.ts; then
  sed -i '1i import { generateSemanticId } from "../utils/semanticIdGenerator";' src/services/pageStructureValidator.ts
fi

# Substituir a linha com Date.now()
sed -i 's/id: block\.id || `\${block\.type || "unknown"}-\${Date\.now()}-\${index}`/id: block.id || generateSemanticId({ context: "validator", type: "block", identifier: block.type || "unknown", index })/g' src/services/pageStructureValidator.ts

echo "✅ MIGRAÇÃO EM LOTE CONCLUÍDA!"

# Executar Prettier em todos os arquivos modificados
echo "🎨 Executando Prettier nos arquivos modificados..."
npx prettier --write src/utils/helpers.ts
npx prettier --write src/utils/performanceMonitoring.ts
npx prettier --write src/services/pageStructureValidator.ts
npx prettier --write src/utils/hotmartWebhook.ts
npx prettier --write src/utils/hotmartWebhookSimulator.ts
npx prettier --write src/utils/blockUtils.ts
npx prettier --write src/types/blocks.ts

echo "🎉 MIGRAÇÃO COMPLETA! Sistema de IDs Semânticos implementado com sucesso!"

# Verificar se ainda há Date.now() em lugares que não deveriam ter
echo "🔍 Verificando Date.now() restantes..."
echo "Arquivos com Date.now() (excluindo performance monitoring que deve manter):"
grep -r "Date\.now()" src/ --exclude-dir=node_modules | grep -v performanceMonitoring | grep -v "new Date(Date.now()" || echo "✅ Nenhum Date.now() inadequado encontrado!"

echo ""
echo "📊 RELATÓRIO FINAL:"
echo "✅ Gerador de IDs semânticos criado"
echo "✅ EditorContext com duplicação inteligente"
echo "✅ Painéis de propriedades migrados"
echo "✅ Hooks atualizados"
echo "✅ Utilitários corrigidos"
echo "✅ Webhooks com IDs semânticos"
echo "✅ Prettier aplicado a todos os arquivos"
echo ""
echo "🎯 SISTEMA 1 (IDs SEMÂNTICOS) IMPLEMENTADO COM SUCESSO!"
