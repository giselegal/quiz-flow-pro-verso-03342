#!/bin/bash

###############################################################################
# 🚀 SCRIPT DE MIGRAÇÃO - Steps Restantes (02-21)
#
# Extrai steps do arquivo legado quiz21StepsComplete.ts e cria arquivos
# individuais na nova estrutura
#
# Uso: ./scripts/migrate-remaining-steps.sh
###############################################################################

set -euo pipefail

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Diretórios
LEGACY_FILE="src/templates/quiz21StepsComplete.ts"
NEW_STEPS_DIR="src/templates/funnels/quiz21Steps/steps"
BACKUP_DIR=".backup-templates-refactor-20251126"

echo -e "${GREEN}🚀 Iniciando migração de steps...${NC}\n"

# Verificar se arquivo legado existe
if [ ! -f "$LEGACY_FILE" ]; then
  echo -e "${RED}❌ Arquivo legado não encontrado: $LEGACY_FILE${NC}"
  exit 1
fi

# Verificar se diretório de destino existe
if [ ! -d "$NEW_STEPS_DIR" ]; then
  echo -e "${RED}❌ Diretório de destino não encontrado: $NEW_STEPS_DIR${NC}"
  exit 1
fi

# Contador de steps migrados
MIGRATED=0
FAILED=0

# Função para extrair um step específico
extract_step() {
  local step_num=$1
  local step_id=$(printf "step-%02d" "$step_num")
  local output_file="$NEW_STEPS_DIR/${step_id}.ts"
  
  echo -e "${YELLOW}📝 Extraindo ${step_id}...${NC}"
  
  # Usar node para extrair JSON do arquivo TypeScript (não falhar o script em caso de erro)
  set +e
  node -e "
    const fs = require('fs');
    const content = fs.readFileSync('$LEGACY_FILE', 'utf8');
    
    // Encontrar início do step
    const stepPatternMid = new RegExp(\`'${step_id}': \\\\[([\\\\s\\\\S]*?)\\\\],\\\\n\\\\n  'step-\`, 'g');
    let match = stepPatternMid.exec(content);
    
    // Fallback: último step (não tem próximo 'step-')
    if (!match) {
      const stepPatternLast = new RegExp(\`'${step_id}': \\\\[([\\\\s\\\\S]*?)\\\\]\\\\s*,\\\\s*\\\\n\\\\};\`);
      match = stepPatternLast.exec(content);
    }
    
    if (!match) {
      console.error('Step não encontrado: ${step_id}');
      process.exit(1);
    }
    
    const blocksJson = '[' + match[1] + ']';
    
    // Gerar TypeScript
    const output = \`/**
 * 🎯 STEP ${step_num} - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step${step_num}: Block[] = \${blocksJson};

export default step${step_num};
\`;
    
    fs.writeFileSync('$output_file', output);
    console.log('✅ Step ${step_id} migrado com sucesso');
  " 2>&1
  rc=$?
  set -e
  
  if [ $rc -eq 0 ]; then
    ((MIGRATED++)) || true
  else
    ((FAILED++)) || true
  fi

  return 0
}

# Migrar steps 02 a 21
for i in {2..21}; do
  extract_step $i
  sleep 0.1 # Delay para não sobrecarregar
done

# Relatório final
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ MIGRAÇÃO COMPLETA${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "Steps migrados: ${GREEN}${MIGRATED}${NC}"
echo -e "Steps com erro: ${RED}${FAILED}${NC}"
echo -e "\n${YELLOW}📂 Arquivos criados em: $NEW_STEPS_DIR${NC}"
echo -e "${YELLOW}📦 Backup disponível em: $BACKUP_DIR${NC}"

# Verificar erros TypeScript
echo -e "\n${YELLOW}🔍 Verificando erros TypeScript...${NC}"
npm run typecheck -- --noEmit 2>&1 | grep -A 5 "src/templates" || echo -e "${GREEN}✅ Nenhum erro encontrado!${NC}"

echo -e "\n${GREEN}🎉 Migração concluída!${NC}"
echo -e "${YELLOW}📖 Próximos passos:${NC}"
echo -e "  1. Revisar arquivos gerados em $NEW_STEPS_DIR"
echo -e "  2. Testar lazy loading: npm run test:templates"
echo -e "  3. Atualizar registry: src/templates/loaders/dynamic.ts"
echo -e "  4. Commit mudanças: git add . && git commit -m 'feat: migrate steps 02-21'"
