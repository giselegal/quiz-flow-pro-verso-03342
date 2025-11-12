# 🎉 SISTEMA JSON V3.2 UNIFICADO - ADAPTAÇÃO COMPLETA

**Data de Adaptação:** 12 de novembro de 2025  
**Baseado em:** Sistema JSON v3.0 (13 de outubro de 2025)  
**Status:** ✅ **PRONTO PARA IMPLEMENTAÇÃO**

---

## 🎯 Resumo Executivo

Adaptação completa do Sistema JSON v3.0 para a arquitetura atual v3.2 do projeto, incluindo:

- **ConsolidatedTemplateService** como fonte única de templates
- **SuperUnifiedProvider** como provider principal (já migrado)
- **UnifiedStepRenderer** + **BlockRegistry** para renderização
- **Templates v3.2** com variáveis dinâmicas (`{{theme.*}}`, `{{assets.*}}`)
- **Sistema de pontuação** integrado via QuizStore
- **Fallback hierárquico** aprimorado para v3.2

---

## 📊 Estado Atual do Projeto

### ✅ **O QUE JÁ ESTÁ IMPLEMENTADO**

| Componente | Status | Localização |
|------------|--------|-------------|
| Master JSON (quiz21-complete.json) | ✅ | `/public/templates/` |
| ConsolidatedTemplateService | ✅ | `/src/services/core/` |
| SuperUnifiedProvider | ✅ | `/contexts/providers/` |
| UnifiedStepRenderer | ✅ | `/src/components/core/unified/` |
| BlockRegistry | ✅ | `/src/core/runtime/quiz/blocks/` |
| TemplateProcessor (v3.2) | ✅ | `/src/services/` |
| QuizStore (scoring) | ✅ | `/contexts/store/` |
| Templates v3.2 (63 files) | ✅ | `/templates/` |

### ⚠️ **O QUE PRECISA SER ATUALIZADO**

| Item | Prioridade | Arquivo | Status |
|------|-----------|---------|--------|
| Schemas Zod aceitar v3.2 | 🔴 CRÍTICO | `templateSchema.ts` | ⚠️ Pendente |
| Version checks hardcoded | 🔴 CRÍTICO | 6 arquivos | ⚠️ Pendente |
| Helper functions de versão | 🟡 MÉDIO | `versionHelpers.ts` | ⚠️ Criar |
| Testes v3.2 | 🟡 MÉDIO | `__tests__/` | ⚠️ Adicionar |
| Documentação | 🟢 BAIXO | `docs/` | ⚠️ Atualizar |

---

## 🏗️ Arquitetura v3.2 Atual

### Hierarquia de Serviços

```
┌────────────────────────────────────────────────────────┐
│        CAMADA DE APRESENTAÇÃO (React)                  │
│  QuizAppConnected                                      │
│  - useQuizState(), useComponentConfiguration()         │
│  - useQuizStore() (scoring system)                     │
└────────────────┬───────────────────────────────────────┘
                 │
┌────────────────▼───────────────────────────────────────┐
│         CAMADA DE CONTEXTO (Providers)                 │
│  SuperUnifiedProvider ✅ MIGRADO                       │
│  - Gerencia estado do editor                           │
│  - Undo/redo, export/import                            │
│  - useEditor() hook unificado                          │
└────────────────┬───────────────────────────────────────┘
                 │
┌────────────────▼───────────────────────────────────────┐
│       CAMADA DE RENDERIZAÇÃO (Unified)                 │
│  UnifiedStepRenderer                                   │
│  - Renderiza steps via adapters                        │
│  - IntroStepAdapter, QuestionStepAdapter, etc.         │
│  BlockRegistry                                         │
│  - Registro de blocos disponíveis                      │
│  - Renderização baseada em block.type                  │
└────────────────┬───────────────────────────────────────┘
                 │
┌────────────────▼───────────────────────────────────────┐
│        CAMADA DE NEGÓCIO (Services)                    │
│  ConsolidatedTemplateService ✅                        │
│  - Fonte única de templates                            │
│  - Fallback: JSON → Registry → TypeScript              │
│  TemplateProcessor ✅                                  │
│  - Processa variáveis v3.2 ({{theme.*}})               │
│  QuizStore (Zustand) ✅                                │
│  - Sistema de pontuação e estado                       │
└────────────────┬───────────────────────────────────────┘
                 │
┌────────────────▼───────────────────────────────────────┐
│    CAMADA DE PERSISTÊNCIA (Multi-Source)               │
│  [1] Master JSON (quiz21-complete.json) v3.0           │
│  [2] Individual JSONs v3.2 (step-XX-v3.json)           │
│  [3] TypeScript Templates (fallback garantido)         │
│  [4] localStorage (quiz-master-template-v3)            │
│  [5] Supabase (opcional - prod)                        │
└────────────────────────────────────────────────────────┘
```

### Hierarquia de Fallback v3.2 Aprimorada

```
┌─────────────────────────┐
│  🥇 NÍVEL 1             │
│  Individual JSON v3.2   │
│  step-XX-v3.json        │
│  ~3-5 KB cada           │
│  + variáveis dinâmicas  │
└───────────┬─────────────┘
            │ ❌ falhou
            ▼
┌─────────────────────────┐
│  🥈 NÍVEL 2             │
│  Master JSON v3.0       │
│  quiz21-complete.json   │
│  101.87 KB, 21 steps    │
└───────────┬─────────────┘
            │ ❌ falhou
            ▼
┌─────────────────────────┐
│  🥉 NÍVEL 3             │
│  Templates TypeScript   │
│  @/templates/imports    │
│  Garantia 100%          │
└─────────────────────────┘
```

**Nota:** Invertemos a prioridade - JSONs individuais v3.2 são agora fonte primária.

---

## 🔧 PLANO DE AÇÃO - ADAPTAÇÃO v3.2

### FASE 1: Atualizar Schemas e Types (15 min) 🔴 CRÍTICO

**Objetivo:** Garantir que todos os tipos TypeScript aceitem v3.2

#### 1.1 Atualizar Schemas Zod

**Arquivo:** `src/types/schemas/templateSchema.ts`

```typescript
// ❌ ANTES (linha 57)
templateVersion: z.literal('3.1').optional()

// ✅ DEPOIS
templateVersion: z.enum(['3.0', '3.1', '3.2']).optional()
```

#### 1.2 Atualizar Types

**Arquivo:** `src/types/template-v3.types.ts` (linha 641)

```typescript
// ❌ ANTES
type TemplateVersion = '1.0' | '2.0' | '2.1' | '3.0' | '3.1';

// ✅ DEPOIS
type TemplateVersion = '1.0' | '2.0' | '2.1' | '3.0' | '3.1' | '3.2';
```

**Arquivo:** `src/types/normalizedTemplate.ts` (linhas 6, 97)

```typescript
// ❌ ANTES (linha 6)
type CanonicalTemplateVersion = '3.0' | '3.1';

// ✅ DEPOIS
type CanonicalTemplateVersion = '3.0' | '3.1' | '3.2';

// ❌ ANTES (linha 97)
if (step.templateVersion !== '3.0' && step.templateVersion !== '3.1')

// ✅ DEPOIS
if (!['3.0', '3.1', '3.2'].includes(step.templateVersion))
```

**Arquivo:** `src/types/v3/template.ts` (linhas 22, 27)

```typescript
// ❌ ANTES
templateVersion: z.literal('3.1')

// ✅ DEPOIS
templateVersion: z.enum(['3.0', '3.1', '3.2'])
```

#### 1.3 Criar Helper Functions

**Arquivo:** `src/lib/utils/versionHelpers.ts` (NOVO)

```typescript
/**
 * 🔧 VERSION HELPERS - Utilitários para comparação de versões
 */

export type TemplateVersion = '1.0' | '2.0' | '2.1' | '3.0' | '3.1' | '3.2';

/**
 * Verifica se é template v3.x
 */
export function isV3Template(version: string | undefined): boolean {
  if (!version) return false;
  return version.startsWith('3.');
}

/**
 * Verifica se é v3.2 ou superior
 */
export function isV32OrNewer(version: string | undefined): boolean {
  if (!version) return false;
  const [major, minor] = version.split('.').map(Number);
  return major === 3 && minor >= 2;
}

/**
 * Verifica se suporta variáveis dinâmicas (v3.2+)
 */
export function supportsDynamicVariables(version: string | undefined): boolean {
  return isV32OrNewer(version);
}

/**
 * Compara duas versões
 * @returns -1 se v1 < v2, 0 se iguais, 1 se v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
  const [major1, minor1 = 0] = v1.split('.').map(Number);
  const [major2, minor2 = 0] = v2.split('.').map(Number);
  
  if (major1 !== major2) return major1 - major2;
  return minor1 - minor2;
}

/**
 * Lista de versões aceitas (mais recente primeiro)
 */
export const SUPPORTED_VERSIONS: TemplateVersion[] = ['3.2', '3.1', '3.0', '2.1', '2.0', '1.0'];

/**
 * Verifica se versão é suportada
 */
export function isSupportedVersion(version: string | undefined): boolean {
  if (!version) return false;
  return SUPPORTED_VERSIONS.includes(version as TemplateVersion);
}
```

**Checklist FASE 1:**
- [ ] `templateSchema.ts` atualizado
- [ ] `template-v3.types.ts` atualizado
- [ ] `normalizedTemplate.ts` atualizado
- [ ] `v3/template.ts` atualizado
- [ ] `versionHelpers.ts` criado
- [ ] Testes TypeScript passando (0 erros)

---

### FASE 2: Atualizar Version Checks (20 min) 🔴 CRÍTICO

**Objetivo:** Substituir checks hardcoded por helpers

#### 2.1 Arquivos a Atualizar

**1. UnifiedStepRenderer.tsx** (linha 144)

```typescript
// ❌ ANTES
if (template && (template.templateVersion === '3.1' || template.templateVersion === '3.0'))

// ✅ DEPOIS
import { isV3Template } from '@/lib/utils/versionHelpers';

if (template && isV3Template(template.templateVersion))
```

**2. QuizRenderer.tsx** (linha 442)

```typescript
// ❌ ANTES
if (templateV3 && templateV3.templateVersion === '3.0')

// ✅ DEPOIS
import { isV3Template } from '@/lib/utils/versionHelpers';

if (templateV3 && isV3Template(templateV3.templateVersion))
```

**3. ImportTemplateButton.tsx** (linhas 43, 141)

```typescript
// ❌ ANTES
if (!json.templateVersion || json.templateVersion !== '3.0')

// ✅ DEPOIS
import { isSupportedVersion } from '@/lib/utils/versionHelpers';

if (!json.templateVersion || !isSupportedVersion(json.templateVersion))
```

**4. TestV3Page.tsx** (linha 46)

```typescript
// ❌ ANTES
if (!data.templateVersion || (data.templateVersion !== '3.0' && data.templateVersion !== '3.1'))

// ✅ DEPOIS
import { isV3Template } from '@/lib/utils/versionHelpers';

if (!data.templateVersion || !isV3Template(data.templateVersion))
```

**5. StepDebug.ts** (linhas 187, 224)

```typescript
// ❌ ANTES
const looksLikeV3 = !!(effectiveStep && (effectiveStep.templateVersion === '3.0' || ...))

// ✅ DEPOIS
import { isV3Template } from '@/lib/utils/versionHelpers';

const looksLikeV3 = !!(effectiveStep && isV3Template(effectiveStep.templateVersion))
```

**Checklist FASE 2:**
- [ ] UnifiedStepRenderer.tsx atualizado
- [ ] QuizRenderer.tsx atualizado
- [ ] ImportTemplateButton.tsx atualizado
- [ ] TestV3Page.tsx atualizado
- [ ] StepDebug.ts atualizado
- [ ] Grep search confirma 0 checks hardcoded

---

### FASE 3: Atualizar ConsolidatedTemplateService (20 min) 🟡 MÉDIO

**Objetivo:** Priorizar JSONs v3.2 individuais no fallback

#### 3.1 Atualizar loadTemplateInternal

**Arquivo:** `src/services/core/ConsolidatedTemplateService.ts` (linha ~135)

```typescript
/**
 * 🔄 LOAD TEMPLATE INTERNAL - v3.2 prioritizado
 */
private async loadTemplateInternal(templateId: string): Promise<FullTemplate | null> {
  const loadMethods = [
    // ✅ PRIORIDADE 1: JSON v3.2 individual (fonte canônica)
    () => this.loadFromJSONV32(templateId),
    // ✅ PRIORIDADE 2: Master JSON v3.0 (fallback consolidado)
    () => this.loadFromMasterJSON(templateId),
    // ✅ PRIORIDADE 3: Registry (memória)
    () => this.loadFromRegistry(templateId),
    // ✅ PRIORIDADE 4: TypeScript legado (garantia)
    () => this.loadFromTypeScript(templateId),
    // ✅ ÚLTIMO RECURSO: Fallback sintético
    () => this.generateFallback(templateId),
  ];

  for (const loadMethod of loadMethods) {
    try {
      const template = await loadMethod();
      if (template) {
        appLogger.info(`✅ Template carregado: ${templateId}`, {
          data: [{ method: loadMethod.name, version: template.metadata?.version }]
        });
        return template;
      }
    } catch (error) {
      appLogger.warn(`⚠️ Método ${loadMethod.name} falhou para ${templateId}:`, {
        data: [error]
      });
    }
  }

  appLogger.error(`❌ Falha ao carregar template: ${templateId}`);
  return null;
}
```

#### 3.2 Adicionar loadFromJSONV32

```typescript
/**
 * 🆕 Carregar JSON v3.2 individual
 */
private async loadFromJSONV32(templateId: string): Promise<FullTemplate | null> {
  try {
    // Normalizar stepId (step-01, step-02, etc.)
    const stepId = this.normalizeStepId(templateId);
    const jsonPath = `/templates/${stepId}-v3.json`;
    
    appLogger.info(`📥 Tentando carregar v3.2: ${jsonPath}`);
    
    const response = await fetch(jsonPath);
    if (!response.ok) {
      appLogger.info(`⏭️ JSON v3.2 não encontrado: ${jsonPath}`);
      return null;
    }
    
    const json = await response.json();
    
    // Verificar versão
    if (!json.templateVersion || !isV3Template(json.templateVersion)) {
      appLogger.warn(`⚠️ Versão inválida em ${jsonPath}: ${json.templateVersion}`);
      return null;
    }
    
    // Processar variáveis dinâmicas se v3.2+
    let processedJson = json;
    if (isV32OrNewer(json.templateVersion)) {
      processedJson = await processTemplate(json);
      appLogger.info(`✨ Variáveis v3.2 processadas para ${stepId}`);
    }
    
    // Converter para FullTemplate
    return this.convertToFullTemplate(processedJson, stepId);
    
  } catch (error) {
    appLogger.error(`❌ Erro ao carregar JSON v3.2:`, { data: [error] });
    return null;
  }
}

/**
 * Normalizar ID de step (aceita 1, '1', 'step-1', 'step-01')
 */
private normalizeStepId(templateId: string): string {
  // Extrair número
  const match = templateId.match(/(\d{1,2})/);
  if (!match) return templateId;
  
  const num = parseInt(match[1], 10);
  return `step-${String(num).padStart(2, '0')}`;
}
```

#### 3.3 Atualizar loadFromMasterJSON

```typescript
/**
 * Carregar do Master JSON v3.0 (fallback)
 */
private async loadFromMasterJSON(templateId: string): Promise<FullTemplate | null> {
  try {
    const masterPath = '/templates/quiz21-complete.json';
    
    appLogger.info(`📥 Tentando carregar Master JSON: ${masterPath}`);
    
    const response = await fetch(masterPath);
    if (!response.ok) {
      appLogger.info(`⏭️ Master JSON não encontrado`);
      return null;
    }
    
    const master = await response.json();
    const stepId = this.normalizeStepId(templateId);
    
    // Buscar step no master
    const stepData = master.steps?.[stepId];
    if (!stepData) {
      appLogger.warn(`⚠️ Step ${stepId} não encontrado no master`);
      return null;
    }
    
    return this.convertToFullTemplate(stepData, stepId);
    
  } catch (error) {
    appLogger.error(`❌ Erro ao carregar Master JSON:`, { data: [error] });
    return null;
  }
}
```

**Checklist FASE 3:**
- [ ] `loadTemplateInternal` atualizado com nova hierarquia
- [ ] `loadFromJSONV32` implementado
- [ ] `loadFromMasterJSON` implementado
- [ ] `normalizeStepId` helper criado
- [ ] Logs indicam prioridade v3.2
- [ ] Performance mantida (< 300ms)

---

### FASE 4: Atualizar QuizAppConnected (15 min) 🟢 BAIXO

**Objetivo:** Garantir compatibilidade com v3.2 no runtime

#### 4.1 Adicionar Helper de Versão

**Arquivo:** `src/components/quiz/QuizAppConnected.tsx` (início do arquivo)

```typescript
import { isV32OrNewer, supportsDynamicVariables } from '@/lib/utils/versionHelpers';
```

#### 4.2 Atualizar Normalização de Steps

**Localização:** Após linha 107 (onde externalSteps é definido)

```typescript
// Overrides de steps vindos do editor
let externalSteps: Record<string, any> | undefined;

if (initialConfig && initialConfig.steps && initialConfig.steps.length) {
  externalSteps = {};
  initialConfig.steps.forEach((step: any) => {
    // ✅ Processar variáveis v3.2 se necessário
    let processedStep = step;
    if (supportsDynamicVariables(step.templateVersion)) {
      // Variáveis já processadas pelo TemplateProcessor no servidor
      // Apenas garantir estrutura correta
      processedStep = {
        ...step,
        blocks: step.blocks || [],
      };
      appLogger.info(`✨ Step v3.2 com variáveis: ${step.id}`);
    }
    
    externalSteps![step.id] = {
      ...processedStep,
      type: step.type || 'question',
      blocks: processedStep.blocks || [],
    };
  });
  appLogger.info(`🔄 Usando initialConfig com ${initialConfig.steps.length} steps (v3.2 ready)`);
}
```

**Checklist FASE 4:**
- [ ] Imports de versionHelpers adicionados
- [ ] Detecção de v3.2 implementada
- [ ] Logs indicam suporte v3.2
- [ ] Teste manual confirma steps v3.2 carregam

---

### FASE 5: Testes e Validação (30 min) 🟡 MÉDIO

**Objetivo:** Garantir 100% de compatibilidade v3.2

#### 5.1 Testes Unitários

**Arquivo:** `src/__tests__/versionHelpers.test.ts` (NOVO)

```typescript
import { describe, test, expect } from 'vitest';
import {
  isV3Template,
  isV32OrNewer,
  supportsDynamicVariables,
  compareVersions,
  isSupportedVersion,
} from '@/lib/utils/versionHelpers';

describe('versionHelpers', () => {
  describe('isV3Template', () => {
    test('retorna true para v3.0, v3.1, v3.2', () => {
      expect(isV3Template('3.0')).toBe(true);
      expect(isV3Template('3.1')).toBe(true);
      expect(isV3Template('3.2')).toBe(true);
    });

    test('retorna false para v2.x e undefined', () => {
      expect(isV3Template('2.0')).toBe(false);
      expect(isV3Template(undefined)).toBe(false);
    });
  });

  describe('isV32OrNewer', () => {
    test('retorna true apenas para v3.2+', () => {
      expect(isV32OrNewer('3.2')).toBe(true);
      expect(isV32OrNewer('3.1')).toBe(false);
      expect(isV32OrNewer('3.0')).toBe(false);
    });
  });

  describe('supportsDynamicVariables', () => {
    test('suporte apenas em v3.2+', () => {
      expect(supportsDynamicVariables('3.2')).toBe(true);
      expect(supportsDynamicVariables('3.1')).toBe(false);
    });
  });

  describe('compareVersions', () => {
    test('compara versões corretamente', () => {
      expect(compareVersions('3.2', '3.1')).toBe(1);
      expect(compareVersions('3.0', '3.1')).toBe(-1);
      expect(compareVersions('3.1', '3.1')).toBe(0);
    });
  });

  describe('isSupportedVersion', () => {
    test('aceita versões suportadas', () => {
      expect(isSupportedVersion('3.2')).toBe(true);
      expect(isSupportedVersion('3.1')).toBe(true);
      expect(isSupportedVersion('4.0')).toBe(false);
    });
  });
});
```

#### 5.2 Testes de Integração

**Arquivo:** `src/__tests__/ConsolidatedTemplateService.v32.test.ts` (NOVO)

```typescript
import { describe, test, expect, beforeEach } from 'vitest';
import { ConsolidatedTemplateService } from '@/services/core/ConsolidatedTemplateService';

describe('ConsolidatedTemplateService - v3.2 Support', () => {
  let service: ConsolidatedTemplateService;

  beforeEach(() => {
    service = new ConsolidatedTemplateService();
  });

  test('carrega template v3.2 individual', async () => {
    const template = await service.getTemplate('step-01');
    
    expect(template).toBeDefined();
    expect(template?.metadata?.version).toMatch(/3\.[0-2]/);
  });

  test('processa variáveis v3.2', async () => {
    const template = await service.getTemplate('step-01');
    
    // Verificar se variáveis {{theme.*}} foram processadas
    const firstBlock = template?.steps[0]?.blocks[0];
    expect(firstBlock?.config?.backgroundColor).not.toMatch(/{{theme\./);
  });

  test('fallback para master JSON se v3.2 falhar', async () => {
    // Forçar falha do v3.2
    const template = await service.getTemplate('step-99-nonexistent');
    
    // Deve falhar graciosamente
    expect(template).toBeNull();
  });

  test('performance < 300ms', async () => {
    const start = Date.now();
    await service.getTemplate('step-01');
    const elapsed = Date.now() - start;
    
    expect(elapsed).toBeLessThan(300);
  });
});
```

#### 5.3 Testes Manuais

```bash
# 1. Abrir console do navegador (F12)

# 2. Carregar template v3.2
const { consolidatedTemplateService } = await import('@/services/core/ConsolidatedTemplateService');
const step01 = await consolidatedTemplateService.getTemplate('step-01');
console.log('Step 01 version:', step01?.metadata?.version);
console.log('Blocks:', step01?.steps[0]?.blocks?.length);

# 3. Verificar processamento de variáveis
const firstBlock = step01?.steps[0]?.blocks[0];
console.log('Block config:', firstBlock?.config);
// Não deve conter {{theme.*}} ou {{assets.*}}

# 4. Testar fallback
const step99 = await consolidatedTemplateService.getTemplate('step-99');
console.log('Fallback:', step99 === null ? 'OK' : 'FALHOU');

# 5. Testar performance
console.time('load-step-01');
await consolidatedTemplateService.getTemplate('step-01');
console.timeEnd('load-step-01');
// Deve ser < 300ms
```

**Checklist FASE 5:**
- [ ] `versionHelpers.test.ts` criado
- [ ] `ConsolidatedTemplateService.v32.test.ts` criado
- [ ] Testes unitários passando (20+)
- [ ] Testes de integração passando (4+)
- [ ] Testes manuais executados
- [ ] Performance validada (< 300ms)

---

## 📚 Documentação Atualizada

### Arquivos a Criar/Atualizar

1. ✅ **SISTEMA_JSON_V32_ADAPTADO.md** (este arquivo)
   - Adaptação completa v3.0 → v3.2
   - Plano de ação detalhado
   - Checklists por fase

2. **GUIA_MIGRACAO_V30_PARA_V32.md** (NOVO)
   - Diferenças v3.0 vs v3.2
   - Breaking changes
   - Como migrar templates existentes

3. **API_CONSOLIDATED_TEMPLATE_SERVICE.md** (ATUALIZAR)
   - Documentar novos métodos
   - Hierarquia de fallback v3.2
   - Exemplos de uso

4. **VERSIONHELPERS_REFERENCE.md** (NOVO)
   - Todas as funções helper
   - Casos de uso
   - Exemplos práticos

---

## 🔮 Roadmap Futuro

### v3.2.1 (1-2 semanas)

- [ ] Completar FASES 1-5 deste documento
- [ ] Migrar todos os 21 steps para v3.2
- [ ] Atualizar master JSON para v3.2
- [ ] Testes E2E com Playwright
- [ ] CI/CD pipeline atualizado

### v3.3 (1-2 meses)

- [ ] Sistema de versionamento (histórico)
- [ ] Diff visual entre versões
- [ ] Rollback de templates
- [ ] API REST completa
- [ ] Editor visual de variáveis v3.2

### v4.0 (6+ meses)

- [ ] Novo formato v4.0 (schema otimizado)
- [ ] Migração automática v3.2 → v4.0
- [ ] Colaboração multi-usuário
- [ ] WebSocket sync em tempo real
- [ ] Template marketplace

---

## 📊 Métricas de Sucesso

### Performance (já alcançadas)

| Operação | Meta | Atual | v3.2 Target |
|----------|------|-------|-------------|
| Load v3.2 JSON | < 300ms | - | **< 250ms** |
| Load Master JSON | < 500ms | 299ms | **< 300ms** |
| Process Variables | - | ~2ms | **< 5ms** |
| Total Load Time | - | - | **< 300ms** |

### Qualidade

| Métrica | v3.0 | v3.2 Target |
|---------|------|-------------|
| Testes Unitários | 36 | **50+** |
| Cobertura | 75% | **85%+** |
| Erros TypeScript | 0 | **0** |
| Templates v3.2 | 0 | **21/21** |

### Tamanho

| Item | v3.0 | v3.2 |
|------|------|------|
| Master JSON | 101.87 KB | **~80 KB** (otimizado) |
| Individual JSON | ~5 KB | **~3 KB** (sem duplicação) |
| Total Size | 228 KB | **~150 KB** (redução 34%) |

---

## 🎓 Principais Diferenças v3.0 → v3.2

### 1. Estrutura de Blocos

**v3.0:**
```json
{
  "blocks": [{
    "type": "hero",
    "config": {
      "backgroundColor": "#fefefe"
    },
    "properties": {
      "backgroundColor": "#fefefe"  // ❌ DUPLICAÇÃO
    }
  }]
}
```

**v3.2:**
```json
{
  "blocks": [{
    "type": "hero",
    "properties": {
      "backgroundColor": "{{theme.colors.background}}"  // ✅ VARIÁVEL DINÂMICA
    }
  }]
}
```

### 2. Variáveis Dinâmicas

**v3.2 suporta:**
- `{{theme.colors.*}}` - cores do tema
- `{{theme.fonts.*}}` - fontes
- `{{theme.spacing.*}}` - espaçamentos
- `{{assets.images.*}}` - URLs de imagens
- `{{assets.icons.*}}` - URLs de ícones

**Processamento:**
```typescript
// Input (v3.2 JSON)
{ backgroundColor: "{{theme.colors.primary}}" }

// Output (após TemplateProcessor)
{ backgroundColor: "#B89B7A" }
```

### 3. Sistema de Fallback

**v3.0:**
```
Master JSON → TypeScript
```

**v3.2:**
```
Individual v3.2 → Master v3.0 → Registry → TypeScript
```

### 4. Validação

**v3.0:** Apenas estrutural (Zod)

**v3.2:** Estrutural + Semântica + Variáveis
- Valida sintaxe de variáveis
- Verifica existência de valores
- Previne loops infinitos

---

## 🚀 Como Implementar

### Passo a Passo Completo

```bash
# 1. Criar branch de trabalho
git checkout -b feat/sistema-json-v32-adaptacao

# 2. FASE 1: Schemas e Types (15 min)
# Editar arquivos conforme documentado
npm run typecheck  # Verificar 0 erros

# 3. FASE 2: Version Checks (20 min)
# Atualizar 6 arquivos com helpers
npm run lint  # Verificar qualidade

# 4. FASE 3: ConsolidatedTemplateService (20 min)
# Adicionar métodos v3.2
npm run dev  # Testar localmente

# 5. FASE 4: QuizAppConnected (15 min)
# Adicionar suporte v3.2
# Abrir http://localhost:8081/editor

# 6. FASE 5: Testes (30 min)
npm test  # Rodar todos os testes
npm run test:e2e  # E2E com Playwright

# 7. Validação final
npm run build  # Build de produção
npm run preview  # Testar build

# 8. Commit e PR
git add .
git commit -m "feat: Sistema JSON v3.2 completo - adaptação final

- Schemas Zod aceitam v3.2
- Version helpers centralizados
- ConsolidatedTemplateService prioriza v3.2
- QuizAppConnected com suporte v3.2
- 50+ testes implementados
- Performance < 300ms mantida
- Documentação completa"

git push origin feat/sistema-json-v32-adaptacao
# Abrir PR no GitHub
```

---

## 🎉 Conclusão

### Sistema JSON v3.2 Adaptado está PRONTO!

✅ **Baseado em:** Sistema v3.0 comprovado e funcional  
✅ **Adaptado para:** Arquitetura atual v3.2 do projeto  
✅ **Mantém:** Performance, qualidade e confiabilidade  
✅ **Adiciona:** Suporte completo v3.2 + variáveis dinâmicas  
✅ **Inclui:** Plano detalhado + testes + documentação  

### Próximos Passos Imediatos

1. ⏰ **HOJE:** Implementar FASES 1-2 (35 min) - schemas e version checks
2. ⏰ **AMANHÃ:** Implementar FASES 3-4 (35 min) - services e components
3. ⏰ **DIA 3:** Implementar FASE 5 (30 min) - testes e validação

**Total:** ~100 minutos de trabalho focado para sistema completo v3.2!

---

**Desenvolvido por:** GitHub Copilot  
**Baseado em:** Sistema JSON v3.0 (13/out/2025)  
**Adaptado para:** Arquitetura v3.2 atual  
**Data:** 12 de novembro de 2025  

🎊 **PRONTO PARA IMPLEMENTAÇÃO!** 🎊
