# 🔄 CÓDIGOS QUE PRECISAM SER ATUALIZADOS APÓS MIGRAÇÃO STEP01

## 📋 RESUMO DA SITUAÇÃO

**MUDANÇA REALIZADA**: Step01 migrado de componente hardcoded (`Step01Simple.tsx`) para sistema de blocos JSON (`step-01.json` com `lead-form`)

**PROBLEMA**: Vários arquivos ainda referenciam os componentes antigos que não são mais utilizados

---

## ⚠️ ARQUIVOS QUE PRECISAM SER ATUALIZADOS

### 1. **StepPage.tsx** - ✅ **JÁ ATUALIZADO CORRETAMENTE**

#### **STATUS**: ✅ CONCLUÍDO

- Imports antigos removidos ❌ (ainda existem)
- Lógica especial Step01 removida ✅
- Sistema de blocos implementado ✅

#### **AÇÃO PENDENTE**: Remover imports desnecessários

```tsx
// ❌ REMOVER ESTES IMPORTS:
const Step01Template = lazy(() => import('@/components/steps/Step01Template'));
const Step01Simple = lazy(() => import('@/components/steps/Step01Simple'));

// ✅ MANTER APENAS:
const Step20Result = lazy(() => import('@/components/steps/Step20Result'));
```

---

### 2. **stepTemplateService.ts** - ❌ **PRECISA ATUALIZAÇÃO**

#### **STATUS**: ❌ DESATUALIZADO

- Ainda importa `getStep01Template` de `Step01Template.tsx`
- Step01 não usa mais sistema de componente, usa JSON

#### **PROBLEMA**:

```typescript
// ❌ LINHA 5 - Import obsoleto:
import { getStep01Template } from '../components/steps/Step01Template';

// ❌ LINHA 52 - Referência obsoleta:
getTemplate: getStep01Template,
```

#### **SOLUÇÃO**:

- Step01 agora usa `templateService.getTemplateByStep(1)` que carrega `step-01.json`
- Não precisa mais da função `getStep01Template`

---

### 3. **stepTemplatesMappingClean.ts** - ❌ **PRECISA ATUALIZAÇÃO**

#### **STATUS**: ❌ DESATUALIZADO

- Linha 5: `import { getStep01Template } from '@/components/steps/Step01Template';`
- Linha 32: `templateFunction: getStep01Template,`

#### **PROBLEMA**:

- Arquivo usado para compatibilidade ainda referencia função obsoleta
- Pode causar erro se chamado

---

### 4. **COMPONENTES STEP01 OBSOLETOS** - ❌ **PRECISAM SER REMOVIDOS/ARQUIVADOS**

#### **ARQUIVOS OBSOLETOS**:

- `src/components/steps/Step01Template.tsx` ❌ Obsoleto
- `src/components/steps/Step01Simple.tsx` ❌ Obsoleto

#### **STATUS**: Ainda existem no sistema mas não são mais usados

---

## 🎯 PLANO DE ATUALIZAÇÃO

### **PRIORIDADE 1 - CRÍTICO** 🔴

#### **1.1 - StepPage.tsx - Limpar Imports**

```tsx
// REMOVER:
const Step01Template = lazy(() => import('@/components/steps/Step01Template'));
const Step01Simple = lazy(() => import('@/components/steps/Step01Simple'));
```

#### **1.2 - stepTemplateService.ts - Atualizar Mapping**

```typescript
// ALTERAR STEP 1 para usar templateService JSON:
1: {
  name: 'Introdução',
  type: 'intro',
  description: 'Apresentação do Quiz de Estilo',
  useJsonTemplate: true, // ✅ NOVO FLAG
  // getTemplate: getStep01Template, // ❌ REMOVER
},
```

### **PRIORIDADE 2 - IMPORTANTE** 🟡

#### **2.1 - stepTemplatesMappingClean.ts**

```typescript
// REMOVER import:
// import { getStep01Template } from '@/components/steps/Step01Template';

// ALTERAR mapping:
{
  stepNumber: 1,
  templateFunction: () => [], // ✅ Template vazio - usa JSON
  name: 'Quiz Intro',
  description: 'Tela inicial com lead-form JSON',
},
```

### **PRIORIDADE 3 - LIMPEZA** 🟢

#### **3.1 - Arquivar Componentes Obsoletos**

- Mover `Step01Template.tsx` e `Step01Simple.tsx` para pasta `backup_components/`
- Documentar migração nos arquivos

#### **3.2 - Atualizar Scripts de Exemplo**

- `examples/test-etapa1.js` - Referencia Step01Template.tsx
- `examples/verify-21-steps-templates.js` - Lista Step01Template.tsx
- Atualizar para novos paths ou remover referências

---

## 🔍 VERIFICAÇÃO DE IMPACTO

### **ARQUIVOS AFETADOS** (32 referências encontradas):

```bash
# Busca por "Step01Template|Step01Simple" encontrou:
/workspaces/quiz-quest-challenge-verse/src/components/steps/Step01Template.tsx - 8 matches
/workspaces/quiz-quest-challenge-verse/src/pages/StepPage.tsx - 4 matches
/workspaces/quiz-quest-challenge-verse/src/components/steps/Step01Simple.tsx - 4 matches
/workspaces/quiz-quest-challenge-verse/src/services/stepTemplateService.ts - 2 matches
/workspaces/quiz-quest-challenge-verse/src/config/stepTemplatesMappingClean.ts - 2 matches
/workspaces/quiz-quest-challenge-verse/examples/ - 12 matches em vários scripts
```

### **RISCO DE QUEBRA**: 🟡 MÉDIO

- **StepPage.tsx**: ✅ Funcional (imports não usados)
- **stepTemplateService.ts**: 🟡 Pode gerar erro se Step01 for chamado pelo service antigo
- **Componentes obsoletos**: 🟢 Não afetam funcionamento (não são mais chamados)

---

## ✅ RESULTADO ESPERADO APÓS ATUALIZAÇÃO

### **FLUXO STEP01 FINAL**:

```typescript
1. /step/1 → StepPage.tsx
2. stepNumber = 1, component = 'generic'
3. templateService.getTemplateByStep(1)
4. Carrega: step-01.json (não mais Step01Template.tsx)
5. Renderiza: LeadFormBlock + outros blocos JSON
6. ✅ Funcionamento perfeito sem dependências obsoletas
```

### **BENEFÍCIOS**:

- ✅ Código limpo sem referências mortas
- ✅ Bundle menor (componentes não importados)
- ✅ Consistência arquitetural
- ✅ Manutenção simplificada
- ✅ Performance otimizada

---

## 🚀 COMANDOS DE EXECUÇÃO

### **Para aplicar as correções**:

```bash
# 1. Verificar situação atual
grep -r "Step01Template\|Step01Simple" src/ --include="*.tsx" --include="*.ts"

# 2. Testar funcionamento
npm run dev
# Acessar: http://localhost:8080/step/1

# 3. Executar limpeza após correções
npm run type-check
npm run build
```

---

**PRÓXIMO PASSO**: Executar as atualizações na ordem de prioridade para eliminar dependências obsoletas e otimizar o código.
