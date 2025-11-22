# 📋 Plano de Consolidação de Serviços - Incremental

**Status**: 🟢 PRONTO PARA EXECUÇÃO  
**Data**: 2025-01-17  
**Objetivo**: Consolidar serviços de template, remover código deprecated, adicionar testes e melhorias de segurança

---

## 🎯 Análise Atual

### ✅ Situação Melhor que o Esperado

1. **Código Deprecated Sem Uso Ativo**
   - `@/core/funnel/services/TemplateService` → apenas 4 referências em docs
   - Nenhuma importação ativa no código de produção
   - **Safe to delete** ✓

2. **Serviço Canônico Já em Uso**
   - `@/services/canonical/TemplateService` → usado em 6 arquivos ativos:
     - `/src/pages/editor/index.tsx`
     - `/src/components/editor/quiz/QuizModularEditor/index.tsx`
     - `/src/components/editor/__tests__/StreamingConversion.test.tsx`
     - `/src/__tests__/quiz_estilo_layout_questions.test.tsx`
     - `/src/__tests__/QuizEstiloGapsValidation.test.ts`
     - `/src/__tests__/json-loading-tracker.test.ts`

3. **Infraestrutura de Testes Existente**
   - 216+ arquivos de teste
   - Vitest configurado (`vitest.setup.ts`)
   - Testes passando: 43/43 (do PR #58)

4. **Itens Já Removidos**
   - `__deprecated/` folder → não encontrado ✓
   - `QuizModularProductionEditor` → não encontrado ✓

---

## 📊 Inventário de Serviços Duplicados

### 🎯 TemplateService Implementations

| Arquivo | Linhas | Status | Ação |
|---------|--------|--------|------|
| `/src/services/canonical/TemplateService.ts` | 1913 | ✅ PRODUCTION-READY | **MANTER** (consolidou 20 serviços) |
| `/src/services/TemplateService.ts` | 244 | ⚠️ Oficial mas menor | **MIGRAR** para canonical |
| `/src/core/funnel/services/TemplateService.ts` | 474 | ❌ @deprecated | **REMOVER** |
| `/src/services/UnifiedTemplateService.ts` | ? | ❌ Duplicado | **REMOVER** |
| `/src/services/core/ConsolidatedTemplateService.ts` | ? | ❌ Duplicado | **REMOVER** |
| `/src/services/templateService.refactored.ts` | ? | ❌ Duplicado | **REMOVER** |
| `/server/templates/service.ts` | ? | ⚠️ Server-side | **AVALIAR** (pode ser específico do backend) |

### 🔍 Decisão: Por que Canonical é o Padrão?

**Canonical TemplateService vence porque:**
1. ✅ **Consolidou 20+ serviços** → menos fragmentação
2. ✅ **PRODUCTION-READY status** → código maduro
3. ✅ **Já usado em 6 arquivos ativos** → adoção real
4. ✅ **1913 linhas** → feature-complete
5. ✅ **API unificada** → única interface para todos os casos de uso

**Official TemplateService (244 linhas):**
- Menor e mais simples
- Usa core/quiz types (bom)
- Mas **menos features** que canonical
- **Ação**: Verificar se alguma funcionalidade do official está faltando no canonical, migrar se necessário

---

## 🚀 Plano de Execução - 8 Etapas Incrementais

### ✅ ETAPA 1: Análise Inicial
**Status**: COMPLETO  
**Data**: 2025-01-17  
**Resultados**:
- Mapeou 6 implementações de TemplateService
- Confirmou que deprecated não tem uso ativo
- Identificou canonical como padrão
- Infraestrutura de testes validada

---

### 🔄 ETAPA 2: Consolidar TemplateService
**Status**: IN PROGRESS  
**Prioridade**: 🔴 ALTA  
**Sem Breaking Changes**: ✅

#### 2.1. Comparar Official vs Canonical
```bash
# Extrair interfaces públicas de ambos
grep -A 10 "class.*TemplateService\|public.*(" src/services/TemplateService.ts > /tmp/official-api.txt
grep -A 10 "class.*TemplateService\|public.*(" src/services/canonical/TemplateService.ts > /tmp/canonical-api.txt
```

**Checklist**:
- [ ] Verificar métodos únicos do official que faltam no canonical
- [ ] Verificar types exportados (FunnelTemplate, BlockRegistry)
- [ ] Validar compatibilidade de cache/config

#### 2.2. Atualizar Canonical (se necessário)
```typescript
// Se official tiver métodos únicos, adicionar ao canonical
// Exemplo: se official.loadTemplate() difere de canonical.load()
```

#### 2.3. Atualizar Importações (Apenas se Necessário)
**Impacto**: 0 arquivos (já usam canonical!)  
**Ação**: Validar que nenhum arquivo usa official diretamente

#### 2.4. Remover Deprecated
```bash
# Safe delete - nenhum uso ativo
rm src/core/funnel/services/TemplateService.ts
```

#### 2.5. Atualizar Documentação
```bash
# Atualizar 4 referências em docs
docs/DEPRECATED_SERVICES.md (2 linhas)
docs/MIGRATION_GUIDE.md (2 linhas)
```

**Resultado Esperado**:
- ✅ 1 serviço TemplateService (canonical)
- ✅ 0 breaking changes (já era usado)
- ✅ Documentação atualizada

---

### ⏸️ ETAPA 3: Remover Código Deprecated
**Status**: NOT STARTED  
**Prioridade**: 🟡 MÉDIA  
**Dependências**: Etapa 2 completa

#### 3.1. Limpeza de Serviços Duplicados
```bash
# Remover duplicados identificados
rm src/services/UnifiedTemplateService.ts
rm src/services/core/ConsolidatedTemplateService.ts
rm src/services/templateService.refactored.ts

# Verificar se server/templates/service.ts é específico do backend
# (pode ser legítimo se tiver lógica de persistência)
```

#### 3.2. Limpeza de Templates Deprecated
```bash
# Remover pasta deprecated de templates
rm -rf public/templates/.deprecated/
```

#### 3.3. Limpeza de Arquivos Soltos na Raiz
```bash
# Organizar arquivos de relatórios e documentação
mkdir -p docs/archive
mv *REPORT*.md docs/archive/
mv *SUMMARY*.md docs/archive/
mv WAVES_*.md docs/archive/
```

**Resultado Esperado**:
- ✅ 3-5 arquivos duplicados removidos
- ✅ Pasta `.deprecated/` removida
- ✅ Raiz do projeto organizada

---

### ⏸️ ETAPA 4: Alinhar Blocos e Schemas
**Status**: NOT STARTED  
**Prioridade**: 🟡 MÉDIA  
**Dependências**: Etapa 2 completa

#### 4.1. Analisar quiz21-complete.json
```bash
# Extrair tipos de blocos usados no template
jq '.steps[].blocks[].type' public/templates/quiz21-complete.json | sort -u
```

#### 4.2. Comparar com BlockRegistry
```typescript
// Verificar se todos os tipos estão registrados
import { BlockRegistry } from '@/core/quiz';

const templateTypes = [...]; // do passo 4.1
const registeredTypes = BlockRegistry.getAllTypes();
const missing = templateTypes.filter(t => !registeredTypes.includes(t));
```

#### 4.3. Registrar Blocos Faltantes
```typescript
// Se houver blocos faltantes, registrá-los
BlockRegistry.register({
  type: 'missingType',
  schema: {...},
  // ...
});
```

**Resultado Esperado**:
- ✅ 100% dos blocos do template no BlockRegistry
- ✅ Schemas validados no schemaInterpreter

---

### ⏸️ ETAPA 5: Expandir Testes
**Status**: NOT STARTED  
**Prioridade**: 🟡 MÉDIA  
**Dependências**: Etapa 2 completa

#### 5.1. Criar Teste de Consolidação
```typescript
// tests/integration/templateService.consolidated.test.ts
import { describe, it, expect } from 'vitest';
import { templateService } from '@/services/canonical/TemplateService';

describe('TemplateService Consolidation', () => {
  it('loads quiz21-complete template', async () => {
    const template = await templateService.load('quiz21-complete');
    expect(template).toBeDefined();
    expect(template.steps).toHaveLength(21);
  });

  it('validates all block types are registered', () => {
    // Test de validação do BlockRegistry
  });

  it('caches templates correctly', async () => {
    // Test de cache
  });
});
```

#### 5.2. Expandir Testes de Segurança (preparação)
```typescript
// tests/security/xss.test.ts (preparar estrutura)
describe('XSS Prevention', () => {
  it.skip('sanitizes HTML input', () => {
    // Será implementado na Etapa 6
  });
});
```

**Resultado Esperado**:
- ✅ Novo arquivo: `tests/integration/templateService.consolidated.test.ts`
- ✅ Testes passando: 43 + ~5 novos = 48 testes

---

### ⏸️ ETAPA 6: Melhorias de Segurança
**Status**: NOT STARTED  
**Prioridade**: 🔴 ALTA  
**Dependências**: Nenhuma (independente)

#### 6.1. Adicionar DOMPurify
```bash
npm install --save dompurify
npm install --save-dev @types/dompurify
```

#### 6.2. Criar Utilitário de Sanitização
```typescript
// src/utils/security/sanitize.ts
import DOMPurify from 'dompurify';

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title'],
  });
}

export function sanitizeUserInput(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}
```

#### 6.3. Aplicar em Property Panels
```typescript
// src/components/editor/PropertiesPanel/index.tsx
import { sanitizeHTML } from '@/utils/security/sanitize';

// Nas atualizações de blocos:
const handleUpdate = (value: string) => {
  const safe = sanitizeHTML(value);
  updateBlock({ ...block, content: safe });
};
```

#### 6.4. Criar SECURITY.md
```markdown
# Security Policy

## Supported Versions
- v3.x (current)

## Reporting a Vulnerability
Email: security@example.com

## Security Measures
1. XSS Prevention: DOMPurify sanitization
2. Content Security Policy: configured in index.html
3. Input Validation: zod schemas
```

#### 6.5. Testes de Segurança
```typescript
// tests/security/xss.test.ts
import { sanitizeHTML } from '@/utils/security/sanitize';

describe('XSS Prevention', () => {
  it('removes script tags', () => {
    const dirty = '<script>alert("xss")</script>';
    expect(sanitizeHTML(dirty)).toBe('');
  });

  it('preserves safe HTML', () => {
    const safe = '<p>Safe <strong>text</strong></p>';
    expect(sanitizeHTML(safe)).toContain('<p>');
  });
});
```

**Resultado Esperado**:
- ✅ DOMPurify instalado e configurado
- ✅ Sanitização em property panels
- ✅ SECURITY.md criado
- ✅ Testes de segurança passando

---

### ⏸️ ETAPA 7: Organizar Repositório
**Status**: NOT STARTED  
**Prioridade**: 🟢 BAIXA  
**Dependências**: Nenhuma

#### 7.1. Mover Arquivos de Relatórios
```bash
mkdir -p docs/archive/{reports,summaries,migration}

# Relatórios de waves
mv WAVE*.md docs/archive/reports/
mv *REPORT*.md docs/archive/reports/
mv *SUMMARY*.md docs/archive/summaries/

# Documentação de migração
mv MIGRACAO*.md docs/archive/migration/
mv MIGRAÇÃO*.md docs/archive/migration/
```

#### 7.2. Mover Scripts de Fix
```bash
mkdir -p scripts/archive/fixes
mv fix-*.sh scripts/archive/fixes/
mv migrate-*.sh scripts/archive/fixes/
```

#### 7.3. Limpar Arquivos Temporários
```bash
rm -f "t -n 1 --before=2025-08-17 2359 HEAD"
rm -f "tatus --porcelain=v1"
rm -f test-*.html (mover para examples/)
```

**Resultado Esperado**:
- ✅ Raiz com ~15 arquivos (essenciais)
- ✅ Documentação em docs/
- ✅ Scripts em scripts/

---

### ⏸️ ETAPA 8: Atualizar Documentação
**Status**: NOT STARTED  
**Prioridade**: 🟡 MÉDIA  
**Dependências**: Etapas 2-7 completas

#### 8.1. Atualizar README.md
```markdown
## Development

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Run Dev Server
\`\`\`bash
npm run dev
\`\`\`

### Run Tests
\`\`\`bash
npm test                 # All tests
npm test templateService # Specific suite
\`\`\`

### Security
See [SECURITY.md](./SECURITY.md) for security policies.

## Architecture

### Services
- **TemplateService**: Canonical service in \`@/services/canonical/TemplateService\`
- **BlockRegistry**: Core block system in \`@/core/quiz\`

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.
```

#### 8.2. Atualizar CONTRIBUTING.md
```markdown
## Service Architecture

### TemplateService (Canonical)
Location: \`src/services/canonical/TemplateService.ts\`

**Usage:**
\`\`\`typescript
import { templateService } from '@/services/canonical/TemplateService';

const template = await templateService.load('quiz21-complete');
\`\`\`

### ❌ Deprecated Services (DO NOT USE)
- \`@/core/funnel/services/TemplateService\` → REMOVED
- \`@/services/TemplateService\` → USE CANONICAL INSTEAD
```

#### 8.3. Criar CHANGELOG.md
```markdown
# Changelog

## [Unreleased]

### Added
- DOMPurify for XSS prevention
- Consolidated TemplateService (canonical)
- Security documentation (SECURITY.md)
- 5 new integration tests

### Changed
- Standardized on canonical/TemplateService

### Removed
- Deprecated core/funnel/services/TemplateService
- 3 duplicate service implementations
- .deprecated/ template folder

### Security
- XSS sanitization in property panels
```

**Resultado Esperado**:
- ✅ README.md atualizado com instruções
- ✅ CONTRIBUTING.md com arquitetura atual
- ✅ CHANGELOG.md com todas as mudanças

---

## 📈 Métricas de Sucesso

| Métrica | Antes | Meta | Como Medir |
|---------|-------|------|------------|
| TemplateService implementations | 6 | 1 | `find . -name "*TemplateService*.ts" \| wc -l` |
| Deprecated imports | 4 | 0 | `grep -r "@/core/funnel/services" src/` |
| Test coverage (template) | ? | >80% | `npm test -- --coverage` |
| Vulnerabilidades XSS | ? | 0 | `npm audit` + manual review |
| Arquivos na raiz | 60+ | <20 | `ls -1 \| wc -l` |

---

## ⚠️ Riscos e Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Breaking changes em canonical | 🔴 Alto | 🟢 Baixo | Canonical já é usado, sem mudanças na API |
| Funcionalidade do official perdida | 🟡 Médio | 🟡 Médio | Etapa 2.1: comparar APIs antes de remover |
| Testes falhando após consolidação | 🟡 Médio | 🟢 Baixo | Rodar testes após cada etapa |
| Server service.ts é necessário | 🟡 Médio | 🟡 Médio | Não remover sem análise (backend específico) |

---

## 🎯 Próximos Passos Imediatos

**AGORA (Etapa 2 - IN PROGRESS):**

1. **Comparar APIs** (10 min):
   ```bash
   # Extrair métodos públicos de ambos os serviços
   grep -E "(public|export).*(function|const|class)" src/services/TemplateService.ts
   grep -E "(public|export).*(function|const|class)" src/services/canonical/TemplateService.ts
   ```

2. **Decidir sobre Official** (5 min):
   - Se official tem métodos únicos → migrar para canonical
   - Se não → remover official, usar canonical em todos os lugares

3. **Executar Consolidação** (15 min):
   - Remover `/src/core/funnel/services/TemplateService.ts`
   - Atualizar 4 referências em docs
   - Verificar se `/src/services/TemplateService.ts` deve ser removido ou atualizado

4. **Validar** (5 min):
   ```bash
   npm test                    # Deve passar 43+ testes
   grep -r "core/funnel/services/TemplateService" src/  # Deve retornar 0
   ```

**Total**: ~35 minutos para completar Etapa 2

---

## 📚 Referências

- **PR #58**: Bridge adapter + editor integration (43/43 testes ✅)
- **BlockRegistry**: `src/core/quiz/blocks/registry.ts`
- **Canonical Service**: `src/services/canonical/TemplateService.ts` (1913 linhas)
- **Vitest Config**: `vitest.config.ts`, `vitest.setup.ts`

---

**Aprovado por**: AI Agent  
**Data de Criação**: 2025-01-17  
**Última Atualização**: 2025-01-17  
**Versão**: 1.0
