# ✅ CHECKLIST COMPLETO: Sistema JSON v3.2

**Acompanhamento visual da implementação**

---

## 📊 VISÃO GERAL

```
┌────────────────────────────────────────────────────────────┐
│  PROGRESSO GERAL                                           │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Documentação:     ████████████████████ 100% ✅            │
│  Implementação:    ░░░░░░░░░░░░░░░░░░░░   0% ⏳            │
│  Testes:           ░░░░░░░░░░░░░░░░░░░░   0% ⏳            │
│  Migração:         ░░░░░░░░░░░░░░░░░░░░   0% ⏳            │
│                    ─────────────────────                    │
│  TOTAL:            ████░░░░░░░░░░░░░░░░  25% ⏳            │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Status:** 🟡 Em andamento  
**Última atualização:** 12/11/2025  
**Responsável:** [Atribuir]

---

## 📋 FASE 1: Schemas e Types (15 min)

**Objetivo:** Garantir que todos os tipos TypeScript aceitem v3.2

### Arquivos a Atualizar (5 total)

#### 1.1 templateSchema.ts
- [ ] Abrir: `src/types/schemas/templateSchema.ts`
- [ ] Localizar: linha 57 (`templateVersion: z.literal('3.1')`)
- [ ] Alterar para: `z.enum(['3.0', '3.1', '3.2'])`
- [ ] Salvar arquivo
- [ ] Executar: `npm run typecheck`
- [ ] Confirmar: 0 erros

**Código esperado:**
```typescript
export const stepSchema = z.object({
  templateVersion: z.enum(['3.0', '3.1', '3.2']).optional(),
  // ...
});
```

#### 1.2 template-v3.types.ts
- [ ] Abrir: `src/types/template-v3.types.ts`
- [ ] Localizar: linha 641 (`type TemplateVersion = ...`)
- [ ] Adicionar: `'3.2'` na union
- [ ] Salvar arquivo
- [ ] Executar: `npm run typecheck`
- [ ] Confirmar: 0 erros

**Código esperado:**
```typescript
type TemplateVersion = '1.0' | '2.0' | '2.1' | '3.0' | '3.1' | '3.2';
```

#### 1.3 normalizedTemplate.ts
- [ ] Abrir: `src/types/normalizedTemplate.ts`
- [ ] Localizar: linha 6 (`type CanonicalTemplateVersion = ...`)
- [ ] Adicionar: `'3.2'` na union
- [ ] Localizar: linha 97 (check de versão)
- [ ] Alterar para: array `['3.0', '3.1', '3.2'].includes(...)`
- [ ] Salvar arquivo
- [ ] Executar: `npm run typecheck`
- [ ] Confirmar: 0 erros

**Código esperado:**
```typescript
type CanonicalTemplateVersion = '3.0' | '3.1' | '3.2';

// E na linha 97:
if (!['3.0', '3.1', '3.2'].includes(step.templateVersion)) {
  // ...
}
```

#### 1.4 v3/template.ts
- [ ] Abrir: `src/types/v3/template.ts`
- [ ] Localizar: linhas 22 e 27 (`z.literal('3.1')`)
- [ ] Alterar para: `z.enum(['3.0', '3.1', '3.2'])`
- [ ] Salvar arquivo
- [ ] Executar: `npm run typecheck`
- [ ] Confirmar: 0 erros

#### 1.5 versionHelpers.ts (CRIAR NOVO)
- [ ] Criar: `src/lib/utils/versionHelpers.ts`
- [ ] Copiar código de: `SISTEMA_JSON_V32_ADAPTADO.md` - FASE 1.3
- [ ] Salvar arquivo
- [ ] Testar imports: `import { isV3Template } from '@/lib/utils/versionHelpers'`
- [ ] Executar: `npm run typecheck`
- [ ] Confirmar: 0 erros

### Validação FASE 1
- [ ] Executar: `npm run typecheck`
- [ ] Resultado: **0 erros TypeScript** ✅
- [ ] Executar: `npm run lint`
- [ ] Resultado: **0 warnings** ✅
- [ ] Commit: `git add . && git commit -m "feat: FASE 1 - Schemas aceitam v3.2"`

**Tempo gasto:** ______ min (meta: 15 min)  
**Status:** ⚪ Não iniciado | 🟡 Em progresso | ✅ Concluído

---

## 📋 FASE 2: Version Checks (20 min)

**Objetivo:** Substituir checks hardcoded por helpers

### Arquivos a Atualizar (6 total)

#### 2.1 UnifiedStepRenderer.tsx
- [ ] Abrir: `src/components/editor/unified/UnifiedStepRenderer.tsx`
- [ ] Adicionar import: `import { isV3Template } from '@/lib/utils/versionHelpers'`
- [ ] Localizar: linha 144 (check de versão)
- [ ] Substituir por: `isV3Template(template.templateVersion)`
- [ ] Salvar e testar
- [ ] Confirmar: componente renderiza corretamente

#### 2.2 QuizRenderer.tsx
- [ ] Abrir: `src/components/core/QuizRenderer.tsx`
- [ ] Adicionar import: `import { isV3Template } from '@/lib/utils/versionHelpers'`
- [ ] Localizar: linha 442 (check de versão)
- [ ] Substituir por: `isV3Template(templateV3.templateVersion)`
- [ ] Salvar e testar
- [ ] Confirmar: quiz renderiza corretamente

#### 2.3 ImportTemplateButton.tsx
- [ ] Abrir: `src/components/editor/ImportTemplateButton.tsx`
- [ ] Adicionar import: `import { isSupportedVersion } from '@/lib/utils/versionHelpers'`
- [ ] Localizar: linhas 43 e 141 (checks de versão)
- [ ] Substituir por: `isSupportedVersion(json.templateVersion)`
- [ ] Salvar e testar
- [ ] Confirmar: import funciona para v3.0, v3.1, v3.2

#### 2.4 TestV3Page.tsx
- [ ] Abrir: `src/pages/TestV3Page.tsx`
- [ ] Adicionar import: `import { isV3Template } from '@/lib/utils/versionHelpers'`
- [ ] Localizar: linha 46 (check de versão)
- [ ] Substituir por: `isV3Template(data.templateVersion)`
- [ ] Salvar e testar
- [ ] Confirmar: página de teste funciona

#### 2.5 StepDebug.ts
- [ ] Abrir: `src/components/step-registry/StepDebug.ts`
- [ ] Adicionar import: `import { isV3Template } from '@/lib/utils/versionHelpers'`
- [ ] Localizar: linhas 187 e 224 (checks de versão)
- [ ] Substituir por: `isV3Template(effectiveStep.templateVersion)`
- [ ] Salvar e testar
- [ ] Confirmar: debug info correto

#### 2.6 Verificação Final
- [ ] Executar: `npm run grep "templateVersion === '3" src/`
- [ ] Resultado esperado: **0 ocorrências** (ou apenas comentários/strings)
- [ ] Se houver mais: repetir processo para cada arquivo

### Validação FASE 2
- [ ] Executar: `npm run typecheck`
- [ ] Resultado: **0 erros** ✅
- [ ] Executar: `npm run dev`
- [ ] Abrir: http://localhost:8081/editor
- [ ] Testar: carregar step-01
- [ ] Confirmar: renderiza corretamente
- [ ] Commit: `git add . && git commit -m "feat: FASE 2 - Version checks com helpers"`

**Tempo gasto:** ______ min (meta: 20 min)  
**Status:** ⚪ Não iniciado | 🟡 Em progresso | ✅ Concluído

---

## 📋 FASE 3: ConsolidatedTemplateService (20 min)

**Objetivo:** Priorizar JSONs v3.2 individuais no fallback

### Implementação

#### 3.1 Atualizar loadTemplateInternal
- [ ] Abrir: `src/services/core/ConsolidatedTemplateService.ts`
- [ ] Localizar: método `loadTemplateInternal` (~linha 135)
- [ ] Alterar hierarquia para:
  ```typescript
  const loadMethods = [
    () => this.loadFromJSONV32(templateId),      // 🆕 Prioridade 1
    () => this.loadFromMasterJSON(templateId),   // 🆕 Prioridade 2
    () => this.loadFromRegistry(templateId),     // Prioridade 3
    () => this.loadFromTypeScript(templateId),   // Prioridade 4
    () => this.generateFallback(templateId),     // Último recurso
  ];
  ```
- [ ] Salvar arquivo

#### 3.2 Implementar loadFromJSONV32
- [ ] Adicionar método `loadFromJSONV32` (após loadTemplateInternal)
- [ ] Copiar código de: `SISTEMA_JSON_V32_ADAPTADO.md` - FASE 3.2
- [ ] Adicionar imports:
  ```typescript
  import { isV3Template, isV32OrNewer } from '@/lib/utils/versionHelpers';
  import { processTemplate } from '@/services/TemplateProcessor';
  ```
- [ ] Salvar arquivo

#### 3.3 Implementar loadFromMasterJSON
- [ ] Adicionar método `loadFromMasterJSON` (após loadFromJSONV32)
- [ ] Copiar código de: `SISTEMA_JSON_V32_ADAPTADO.md` - FASE 3.3
- [ ] Salvar arquivo

#### 3.4 Implementar normalizeStepId
- [ ] Adicionar método `normalizeStepId` (privado)
- [ ] Copiar código de: `SISTEMA_JSON_V32_ADAPTADO.md` - FASE 3.3
- [ ] Salvar arquivo

### Validação FASE 3
- [ ] Executar: `npm run typecheck`
- [ ] Resultado: **0 erros** ✅
- [ ] Abrir console do browser (F12)
- [ ] Executar:
  ```javascript
  const { consolidatedTemplateService } = await import('@/services/core/ConsolidatedTemplateService');
  
  console.time('load-v32');
  const step01 = await consolidatedTemplateService.getTemplate('step-01');
  console.timeEnd('load-v32');
  
  console.log('Version:', step01?.metadata?.version);
  console.log('Blocks:', step01?.steps[0]?.blocks?.length);
  ```
- [ ] Confirmar: load time **< 300ms** ✅
- [ ] Confirmar: template carregado corretamente ✅
- [ ] Commit: `git add . && git commit -m "feat: FASE 3 - v3.2 prioritizado no fallback"`

**Tempo gasto:** ______ min (meta: 20 min)  
**Status:** ⚪ Não iniciado | 🟡 Em progresso | ✅ Concluído

---

## 📋 FASE 4: QuizAppConnected (15 min)

**Objetivo:** Garantir compatibilidade v3.2 no runtime

### Implementação

#### 4.1 Adicionar Imports
- [ ] Abrir: `src/components/quiz/QuizAppConnected.tsx`
- [ ] Adicionar no início do arquivo:
  ```typescript
  import { isV32OrNewer, supportsDynamicVariables } from '@/lib/utils/versionHelpers';
  ```
- [ ] Salvar arquivo

#### 4.2 Atualizar Normalização de Steps
- [ ] Localizar: após linha 107 (onde `externalSteps` é definido)
- [ ] Substituir lógica por código de: `SISTEMA_JSON_V32_ADAPTADO.md` - FASE 4.2
- [ ] Incluir processamento de variáveis v3.2
- [ ] Salvar arquivo

### Validação FASE 4
- [ ] Executar: `npm run typecheck`
- [ ] Resultado: **0 erros** ✅
- [ ] Executar: `npm run dev`
- [ ] Abrir: http://localhost:8081/editor
- [ ] Selecionar: step-01
- [ ] Verificar console: deve mostrar log `✨ Step v3.2 com variáveis: step-01`
- [ ] Confirmar: step renderiza corretamente
- [ ] Testar: navegação entre steps (01 → 02 → 03)
- [ ] Confirmar: todas transições funcionam
- [ ] Commit: `git add . && git commit -m "feat: FASE 4 - QuizAppConnected suporta v3.2"`

**Tempo gasto:** ______ min (meta: 15 min)  
**Status:** ⚪ Não iniciado | 🟡 Em progresso | ✅ Concluído

---

## 📋 FASE 5: Testes e Validação (30 min)

**Objetivo:** Garantir 100% de compatibilidade v3.2

### Testes Unitários

#### 5.1 Criar versionHelpers.test.ts
- [ ] Criar: `src/__tests__/versionHelpers.test.ts`
- [ ] Copiar código de: `SISTEMA_JSON_V32_ADAPTADO.md` - FASE 5.1
- [ ] Salvar arquivo
- [ ] Executar: `npm test -- versionHelpers`
- [ ] Resultado: **todos testes passando** ✅

#### 5.2 Criar ConsolidatedTemplateService.v32.test.ts
- [ ] Criar: `src/__tests__/ConsolidatedTemplateService.v32.test.ts`
- [ ] Copiar código de: `SISTEMA_JSON_V32_ADAPTADO.md` - FASE 5.2
- [ ] Salvar arquivo
- [ ] Executar: `npm test -- ConsolidatedTemplateService.v32`
- [ ] Resultado: **todos testes passando** ✅

### Testes de Integração

#### 5.3 Teste End-to-End
- [ ] Executar: `npm run dev`
- [ ] Abrir: http://localhost:8081/editor
- [ ] Testar sequência:
  - [ ] Carregar step-01
  - [ ] Editar propriedade
  - [ ] Salvar (Ctrl+S)
  - [ ] Recarregar página (F5)
  - [ ] Confirmar: mudança persistida
- [ ] Testar export/import:
  - [ ] Export JSON (Ctrl+E)
  - [ ] Modificar JSON manualmente
  - [ ] Import JSON (Ctrl+I)
  - [ ] Confirmar: mudanças aplicadas

### Testes Manuais (Console)

#### 5.4 Executar Comandos de Teste
- [ ] Abrir console (F12)
- [ ] Copiar/colar cada comando de: `SISTEMA_JSON_V32_ADAPTADO.md` - FASE 5.3
- [ ] Verificar outputs esperados
- [ ] Confirmar: performance < 300ms

### Validação Final FASE 5
- [ ] Executar: `npm test`
- [ ] Resultado: **50+ testes passando** (meta: 85%+ cobertura) ✅
- [ ] Executar: `npm run typecheck`
- [ ] Resultado: **0 erros** ✅
- [ ] Executar: `npm run lint`
- [ ] Resultado: **0 warnings** ✅
- [ ] Executar: `npm run build`
- [ ] Resultado: **build sucesso** ✅
- [ ] Commit: `git add . && git commit -m "feat: FASE 5 - Testes v3.2 completos"`

**Tempo gasto:** ______ min (meta: 30 min)  
**Status:** ⚪ Não iniciado | 🟡 Em progresso | ✅ Concluído

---

## 📋 MIGRAÇÃO DE TEMPLATES

**Objetivo:** Migrar 21 templates de v3.0 para v3.2

### Opção A: Automática (Recomendado) ✅

#### Preparação
- [ ] Criar: `scripts/migrate-to-v32.mjs`
- [ ] Copiar código de: `GUIA_MIGRACAO_V30_PARA_V32.md` - Script
- [ ] Tornar executável: `chmod +x scripts/migrate-to-v32.mjs`
- [ ] Testar com step-01: `node scripts/migrate-to-v32.mjs step-01`
- [ ] Verificar: backup criado em `templates/step-01-v3.json.v30.backup`
- [ ] Verificar: arquivo migrado corretamente

#### Execução em Lote
- [ ] Executar script para todos:
  ```bash
  for i in {01..21}; do
    node scripts/migrate-to-v32.mjs step-$i
  done
  ```
- [ ] Aguardar conclusão (~5 minutos)
- [ ] Verificar logs: todos 21 steps migrados ✅

### Opção B: Manual (Alternativa)

#### Lotes 1-5 (Steps 01-05)
- [ ] step-01: Seguir checklist de `GUIA_MIGRACAO_V30_PARA_V32.md`
- [ ] step-02: Seguir checklist
- [ ] step-03: Seguir checklist
- [ ] step-04: Seguir checklist
- [ ] step-05: Seguir checklist

#### Lotes 6-10 (Steps 06-10)
- [ ] step-06 até step-10: Repetir processo

#### Lotes 11-15 (Steps 11-15)
- [ ] step-11 até step-15: Repetir processo

#### Lotes 16-21 (Steps 16-21)
- [ ] step-16 até step-21: Repetir processo

### Validação Pós-Migração

#### Validação Individual
- [ ] Para cada step (01-21):
  - [ ] Validar JSON: `node -e "JSON.parse(require('fs').readFileSync('templates/step-XX-v3.json'))"`
  - [ ] Verificar versão: `"templateVersion": "3.2"`
  - [ ] Confirmar: sem chave `config` (apenas `properties`)
  - [ ] Confirmar: variáveis `{{theme.*}}` presentes
  - [ ] Verificar redução: ~40% menor que backup

#### Validação Visual
- [ ] Abrir: http://localhost:8081/editor
- [ ] Para cada step (01-21):
  - [ ] Carregar step
  - [ ] Confirmar: renderiza corretamente
  - [ ] Verificar: cores/fontes corretas
  - [ ] Testar: navegação funciona

#### Validação de Performance
- [ ] Para 3 steps aleatórios:
  ```javascript
  console.time('load-stepXX');
  await consolidatedTemplateService.getTemplate('step-XX');
  console.timeEnd('load-stepXX');
  ```
- [ ] Confirmar: todos < 300ms ✅

### Checklist Final Migração
- [ ] 21 steps migrados
- [ ] 21 backups criados
- [ ] Todos JSONs válidos
- [ ] Todos com `templateVersion: "3.2"`
- [ ] Redução média: ~40-58%
- [ ] Renderização: 100% OK
- [ ] Performance: < 300ms
- [ ] Commit: `git add templates/ && git commit -m "feat: Migração completa para v3.2 (21 steps)"`

**Tempo gasto:** ______ min (meta: 5 min automático / 200 min manual)  
**Status:** ⚪ Não iniciado | 🟡 Em progresso | ✅ Concluído

---

## 📋 DEPLOY E VALIDAÇÃO FINAL

### Staging

#### Deploy Staging
- [ ] Executar: `npm run build`
- [ ] Resultado: **build sucesso** ✅
- [ ] Deploy para staging
- [ ] Aguardar conclusão

#### Smoke Tests Staging
- [ ] Abrir: https://staging.seudominio.com/editor
- [ ] Testar: carregar step-01
- [ ] Testar: editar e salvar
- [ ] Testar: navegação entre steps
- [ ] Testar: export/import JSON
- [ ] Verificar console: sem erros
- [ ] Verificar network: performance < 300ms
- [ ] Testar em 3 browsers diferentes:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari

### Produção

#### Pré-Deploy Checklist
- [ ] Todos testes passando (50+)
- [ ] 0 erros TypeScript
- [ ] 0 warnings ESLint
- [ ] Staging validado 100%
- [ ] Backups criados
- [ ] Rollback plan pronto

#### Deploy Produção
- [ ] Executar: `npm run build`
- [ ] Deploy para produção
- [ ] Aguardar conclusão
- [ ] Verificar status: healthy ✅

#### Smoke Tests Produção
- [ ] Abrir: https://seudominio.com/editor
- [ ] Repetir todos smoke tests de staging
- [ ] Monitorar logs por 30 minutos
- [ ] Verificar métricas:
  - [ ] Performance: < 300ms ✅
  - [ ] Error rate: < 0.1% ✅
  - [ ] Load time: normal ✅

### Monitoramento Pós-Deploy
- [ ] Dia 1: Verificar métricas 3x ao dia
- [ ] Dia 2-3: Verificar 2x ao dia
- [ ] Dia 4-7: Verificar 1x ao dia
- [ ] Coletar feedback de usuários
- [ ] Documentar issues encontradas

### Checklist Final Geral
- [ ] ✅ Documentação 100% completa
- [ ] ✅ Implementação 100% completa (5 fases)
- [ ] ✅ Testes 100% completos (50+)
- [ ] ✅ Migração 100% completa (21 templates)
- [ ] ✅ Deploy staging OK
- [ ] ✅ Deploy produção OK
- [ ] ✅ Monitoramento ativo
- [ ] ✅ 0 issues críticos

**Status Final:** ⚪ Não iniciado | 🟡 Em progresso | ✅ CONCLUÍDO 🎉

---

## 📊 MÉTRICAS FINAIS

### Performance

| Métrica | Meta | Resultado | Status |
|---------|------|-----------|--------|
| Load Time v3.2 | < 300ms | _____ ms | ⚪ |
| Process Vars | < 10ms | _____ ms | ⚪ |
| Total Load | < 500ms | _____ ms | ⚪ |
| Cache Hit | < 5ms | _____ ms | ⚪ |

### Qualidade

| Métrica | Meta | Resultado | Status |
|---------|------|-----------|--------|
| Cobertura Testes | 85%+ | _____ % | ⚪ |
| Erros TypeScript | 0 | _____ | ⚪ |
| Warnings ESLint | 0 | _____ | ⚪ |
| Templates v3.2 | 21/21 | ___/21 | ⚪ |

### Tamanho

| Métrica | Antes | Depois | Redução |
|---------|-------|--------|---------|
| Template Médio | 5.0 KB | _____ KB | _____ % |
| Total 21 Steps | 105 KB | _____ KB | _____ % |
| Bundle Size | _____ KB | _____ KB | _____ % |

### Tempo

| Fase | Meta | Real | Delta |
|------|------|------|-------|
| FASE 1 | 15 min | _____ min | _____ |
| FASE 2 | 20 min | _____ min | _____ |
| FASE 3 | 20 min | _____ min | _____ |
| FASE 4 | 15 min | _____ min | _____ |
| FASE 5 | 30 min | _____ min | _____ |
| Migração | 5 min | _____ min | _____ |
| **TOTAL** | **105 min** | **_____ min** | **_____** |

---

## 🎉 CONCLUSÃO

### Quando Todos os Checkboxes Estiverem Marcados:

```
┌────────────────────────────────────────────────────────────┐
│                                                             │
│            🎊 PARABÉNS! PROJETO COMPLETO! 🎊               │
│                                                             │
│  Sistema JSON v3.2 Implementado com Sucesso!               │
│                                                             │
│  ✅ 5 Fases Implementadas                                  │
│  ✅ 21 Templates Migrados                                  │
│  ✅ 50+ Testes Passando                                    │
│  ✅ 0 Erros TypeScript                                     │
│  ✅ Performance < 300ms                                    │
│  ✅ Deploy em Produção                                     │
│                                                             │
│  Próximo: Coletar feedback e planejar v4.0                │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

**Mantido por:** [Seu Nome]  
**Iniciado em:** ___/___/_____  
**Concluído em:** ___/___/_____  
**Tempo total:** _____ minutos  
**Status:** 🟡 Em andamento

---

**💪 Bora finalizar esse projeto!**
