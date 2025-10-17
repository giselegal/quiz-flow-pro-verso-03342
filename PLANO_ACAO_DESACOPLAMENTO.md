# 🎯 PLANO DE AÇÃO: DESACOPLAMENTO DOS STEPS 12, 19, 20

**Data de Criação:** 17 de outubro de 2025  
**Objetivo:** Migrar Steps 12, 19, 20 de componentes monolíticos para sistema de blocos atômicos  
**Status:** 🟡 Em Planejamento

---

## 📊 **SITUAÇÃO ATUAL**

### **Problema Identificado:**
```
✅ Templates JSON migrados para blocos atômicos
✅ 12 blocos atômicos criados e registrados
❌ Sistema ainda renderiza componentes legados em runtime
❌ Editor e runtime desalinhados
```

### **Componentes Acoplados:**

| Step | Componente Legado | Linhas | Problema |
|------|-------------------|--------|----------|
| 12 | `TransitionStep` | 100 | Ignora template JSON |
| 19 | `TransitionStep` | 100 | Ignora template JSON |
| 20 | `ResultStep` | **469** | Ignora template JSON |

---

## 🗺️ **ROADMAP DE EXECUÇÃO**

### **FASE 1: INVESTIGAÇÃO (Tasks 1-3)** 🔍
**Objetivo:** Entender o fluxo atual e confirmar o problema

#### **Task 1: Mapear Fluxo de Renderização**
**Status:** 🔴 Not Started

**Arquivos a Investigar:**
```
1. src/components/quiz/QuizRenderer.tsx
2. src/components/quiz/StepRenderer.tsx  
3. src/components/editor/ConnectedTemplateWrapper.tsx
4. src/components/editor/blocks/BlockRenderer.tsx
5. src/components/quiz/QuizAppConnected.tsx
```

**Perguntas a Responder:**
- [ ] Qual componente decide se usa TransitionStep/ResultStep vs BlockRenderer?
- [ ] Onde está o switch/if que verifica `stepType` ou `stepNumber`?
- [ ] BlockRenderer já existe e funciona para Steps 1-11?
- [ ] Qual é o caminho de dados: Template JSON → Componente Final?

**Output Esperado:**
```
Diagrama de fluxo:
User Request → QuizRenderer → [DECISÃO AQUI] → TransitionStep OU BlockRenderer
```

---

#### **Task 2: Identificar Pontos de Decisão**
**Status:** 🔴 Not Started

**Locais Conhecidos:**
```typescript
// FunnelsContext.tsx (linhas 117-123)
type: stepNumber === 12 ? 'transition' : 
      stepNumber === 19 ? 'transition' :
      stepNumber === 20 ? 'result' : 'offer'

// FunnelsContext.tsx (linhas 252-260)
// Duplicação do código acima

// ConnectedTemplateWrapper.tsx (linha 140)
if (stepType === 'result' && stepNumber >= 19) { ... }

// ConnectedTemplateWrapper.tsx (linha 176)
// Lógica especial para result steps

// QuizAppConnected.tsx (linha 744)
stepType="result"
```

**Ação:**
```bash
# Buscar TODOS os pontos onde stepType/stepNumber determinam renderização
grep -r "stepType.*===.*transition\|stepType.*===.*result" src/
grep -r "stepNumber.*===.*12\|stepNumber.*===.*19\|stepNumber.*===.*20" src/
```

**Output Esperado:**
- Lista completa de arquivos e linhas com lógica condicional
- Matriz de impacto: qual mudança afeta quais componentes

---

#### **Task 3: Testar Renderização Atual**
**Status:** 🔴 Not Started

**Procedimento:**
```bash
# 1. Garantir que servidor está rodando
npm run dev

# 2. Abrir browser
$BROWSER http://localhost:8080/quiz

# 3. Navegar até Steps 12, 19, 20
# 4. Abrir DevTools (F12)
# 5. Inspecionar elementos renderizados
```

**Verificações:**
- [ ] Step 12: Componente renderizado é `<TransitionStep>` ou blocos atômicos?
- [ ] Step 19: Componente renderizado é `<TransitionStep>` ou blocos atômicos?
- [ ] Step 20: Componente renderizado é `<ResultStep>` ou blocos atômicos?
- [ ] Console tem erros ou warnings?
- [ ] Props passadas para os componentes (inspecionar via React DevTools)

**Output Esperado:**
```markdown
# RESULTADO DO TESTE

## Step 12
- Componente: TransitionStep ❌
- Props: { data: {...}, onComplete: fn }
- Blocos renderizados: Nenhum
- Template JSON carregado: Sim, mas ignorado

## Step 19
- [mesmo formato]

## Step 20
- [mesmo formato]
```

---

### **FASE 2: PLANEJAMENTO (Task 4)** 📋
**Objetivo:** Definir estratégia de migração segura

#### **Task 4: Criar Estratégia de Migração**
**Status:** 🔴 Not Started

**Opções a Avaliar:**

##### **OPÇÃO A: Big Bang Migration** ⚡
```
Pros:
✅ Mais rápido (1 PR)
✅ Sem código de compatibilidade
✅ Alinhamento imediato editor/runtime

Contras:
❌ Alto risco
❌ Difícil rollback
❌ Pode quebrar funcionalidades
```

##### **OPÇÃO B: Feature Flag Migration** 🚩
```typescript
// Adicionar flag de configuração
const USE_ATOMIC_BLOCKS_FOR_SPECIAL_STEPS = true;

if (USE_ATOMIC_BLOCKS_FOR_SPECIAL_STEPS && [12, 19, 20].includes(stepNumber)) {
    return <BlockRenderer blocks={template.blocks} />;
} else {
    return <LegacyComponent />;
}
```

```
Pros:
✅ Migração gradual
✅ Rollback instantâneo (mudar flag)
✅ Teste A/B possível
✅ Baixo risco

Contras:
❌ Código de compatibilidade temporário
❌ 2 PRs (implementação + limpeza)
```

##### **OPÇÃO C: Shadow Rendering** 👥
```typescript
// Renderizar AMBOS mas só mostrar um
<div>
    {showLegacy ? <TransitionStep /> : <BlockRenderer />}
    {__DEV__ && <ComparisonTool legacy={...} atomic={...} />}
</div>
```

```
Pros:
✅ Validação visual lado-a-lado
✅ Teste de regressão automático
✅ Confiança máxima

Contras:
❌ Performance overhead
❌ Mais complexo
❌ Apenas para desenvolvimento
```

**Decisão Recomendada:** **OPÇÃO B - Feature Flag Migration**

**Justificativa:**
- Equilíbrio entre segurança e velocidade
- Rollback trivial se algo der errado
- Permite testar em staging antes de prod
- Código de compatibilidade é temporário e isolado

---

### **FASE 3: IMPLEMENTAÇÃO (Tasks 5-7)** 🔧
**Objetivo:** Modificar o código para usar blocos atômicos

#### **Task 5: Implementar BlockRenderer para Steps 12/19/20**
**Status:** 🔴 Not Started

**Arquivos a Modificar:**

##### **1. Criar Feature Flag**
```typescript
// src/config/features.ts (NOVO ARQUIVO)
export const FEATURE_FLAGS = {
    USE_ATOMIC_BLOCKS_FOR_SPECIAL_STEPS: true,
} as const;
```

##### **2. Modificar Renderizador Principal**
```typescript
// src/components/quiz/QuizRenderer.tsx (ou similar)

import { FEATURE_FLAGS } from '@/config/features';
import { BlockRenderer } from '@/components/editor/blocks/BlockRenderer';

function renderStep(step: Step, template: Template) {
    // Verificar se é step especial E flag está ativa
    const isSpecialStep = [12, 19, 20].includes(step.stepNumber);
    const useAtomicBlocks = FEATURE_FLAGS.USE_ATOMIC_BLOCKS_FOR_SPECIAL_STEPS;
    
    if (isSpecialStep && useAtomicBlocks) {
        // NOVO: Renderizar via blocos atômicos
        return <BlockRenderer blocks={template.blocks} context={step.context} />;
    }
    
    // LEGADO: Manter comportamento atual para outros steps
    switch (step.type) {
        case 'transition':
            return <TransitionStep data={step.data} onComplete={step.onComplete} />;
        case 'result':
            return <ResultStep data={step.data} userProfile={step.userProfile} />;
        default:
            return <BlockRenderer blocks={template.blocks} />;
    }
}
```

##### **3. Atualizar BlockRenderer (se necessário)**
```typescript
// src/components/editor/blocks/BlockRenderer.tsx

interface BlockRendererProps {
    blocks: Block[];
    context?: StepContext;  // ← ADICIONAR para passar dados do quiz
    mode?: 'edit' | 'preview';
}

export function BlockRenderer({ blocks, context, mode = 'preview' }: BlockRendererProps) {
    return blocks.map((block, index) => {
        const Component = ENHANCED_BLOCK_REGISTRY[block.type];
        
        if (!Component) {
            console.error(`Block type not found: ${block.type}`);
            return null;
        }
        
        // Passar context para blocos que precisam (ex: result-main precisa de userProfile)
        return (
            <Component
                key={block.id || index}
                content={block.content}
                context={context}  // ← NOVO
                mode={mode}
            />
        );
    });
}
```

**Testes:**
```typescript
// src/components/quiz/__tests__/AtomicStepRendering.test.tsx

describe('Atomic Block Rendering for Special Steps', () => {
    it('should render Step 12 with atomic blocks when flag is enabled', () => {
        const template = loadTemplate('step-12');
        const result = render(<QuizRenderer step={12} template={template} />);
        
        // Verificar que blocos atômicos estão presentes
        expect(result.getByTestId('transition-title')).toBeInTheDocument();
        expect(result.getByTestId('transition-loader')).toBeInTheDocument();
        
        // Verificar que componente legado NÃO está presente
        expect(result.queryByTestId('transition-step-legacy')).not.toBeInTheDocument();
    });
    
    // Similar para Steps 19 e 20
});
```

---

#### **Task 6: Remover Hardcoded stepType**
**Status:** 🔴 Not Started

**Arquivo:** `src/context/FunnelsContext.tsx`

**Modificação 1 (linhas 117-123):**
```typescript
// ANTES:
type: stepNumber === 12
    ? 'transition'
    : stepNumber === 19
        ? 'transition'
        : stepNumber === 20
            ? 'result'
            : 'offer'

// DEPOIS:
type: 'question'  // Deixar template JSON definir comportamento via blocks[]
```

**Modificação 2 (linhas 252-260):**
```typescript
// Remover duplicação da mesma lógica
// Usar função auxiliar para determinar tipo baseado no template, não no stepNumber
```

**Nova Função Auxiliar:**
```typescript
function inferStepType(stepNumber: number, template: Template): StepType {
    // Se tem feature flag ativa e é step especial, tipo não importa mais
    if (FEATURE_FLAGS.USE_ATOMIC_BLOCKS_FOR_SPECIAL_STEPS && 
        [12, 19, 20].includes(stepNumber)) {
        return 'atomic';  // Novo tipo para steps com blocos atômicos
    }
    
    // Inferir tipo baseado nos blocos do template
    const blockTypes = template.blocks.map(b => b.type);
    
    if (blockTypes.some(t => t.startsWith('result-'))) return 'result';
    if (blockTypes.some(t => t.startsWith('transition-'))) return 'transition';
    if (blockTypes.some(t => t.startsWith('options-'))) return 'question';
    
    return 'question';  // default
}
```

---

#### **Task 7: Deprecar Componentes Legados**
**Status:** 🔴 Not Started

**Arquivos a Modificar:**

##### **1. Adicionar @deprecated**
```typescript
// src/components/quiz/TransitionStep.tsx

/**
 * @deprecated Este componente será removido na v2.0.
 * Use blocos atômicos no template JSON em vez disso:
 * 
 * ```json
 * {
 *   "blocks": [
 *     { "type": "transition-title", "content": {...} },
 *     { "type": "transition-loader", "content": {...} }
 *   ]
 * }
 * ```
 * 
 * @see src/components/editor/blocks/atomic/TransitionTitleBlock.tsx
 * @see src/config/templates/step-12.json
 */
export default function TransitionStep({ data, onComplete }: TransitionStepProps) {
    // ... código existente
}
```

##### **2. Mover para Seção Legacy no Registry**
```typescript
// src/components/editor/blocks/EnhancedBlockRegistry.tsx

export const ENHANCED_BLOCK_REGISTRY: Record<string, ComponentType<any>> = {
    // ✅ ATOMIC BLOCKS (Preferir usar estes)
    'transition-title': TransitionTitleBlock,
    'transition-loader': TransitionLoaderBlock,
    'result-main': ResultMainBlock,
    'result-style': ResultStyleBlock,
    // ... outros blocos atômicos
    
    // ❌ LEGACY COMPONENTS (Deprecated - Não usar em novos templates)
    'transition-step-legacy': TransitionStep,
    'result-step-legacy': ResultStep,
};

// Manter aliases temporários para compatibilidade (remover na v2.0)
ENHANCED_BLOCK_REGISTRY['transition-step'] = ENHANCED_BLOCK_REGISTRY['transition-step-legacy'];
ENHANCED_BLOCK_REGISTRY['result-step'] = ENHANCED_BLOCK_REGISTRY['result-step-legacy'];
```

##### **3. Adicionar Warning em Runtime (Desenvolvimento)**
```typescript
// src/components/quiz/TransitionStep.tsx

export default function TransitionStep(props: TransitionStepProps) {
    if (__DEV__) {
        console.warn(
            '⚠️ TransitionStep is deprecated and will be removed in v2.0. ' +
            'Please migrate to atomic blocks. See MIGRATION_GUIDE.md'
        );
    }
    
    // ... código existente
}
```

---

### **FASE 4: TESTES (Tasks 8-9)** ✅
**Objetivo:** Validar que a migração funcionou sem quebrar nada

#### **Task 8: Testar Steps 12, 19, 20 com Blocos Atômicos**
**Status:** 🔴 Not Started

**Checklist de Testes Manuais:**

##### **Step 12 - Transição:**
```
□ Título de transição aparece corretamente
□ Loader/spinner é exibido
□ Barra de progresso atualiza
□ Auto-avança após timer (verificar configuração do template)
□ Animações funcionam
□ Edição no /editor funciona
□ Propriedades salvam corretamente
```

##### **Step 19 - Transição (segunda):**
```
□ Mesmo checklist do Step 12
□ Diferentes textos/configurações funcionam
□ Transição entre Step 18 → 19 → 20 é suave
```

##### **Step 20 - Resultado:**
```
□ result-main: Título e descrição aparecem
□ result-style: Estilo calculado é exibido corretamente
□ result-characteristics: Características listadas
□ result-cta-primary: Botão principal funciona
□ result-cta-secondary: Botão secundário funciona
□ result-social-proof: Prova social exibida
□ result-guarantee: Garantia exibida
□ result-testimonials: Depoimentos funcionam
□ Pontuação calculada corretamente
□ Imagens carregam
□ Links funcionam
□ Edição no /editor funciona para TODOS os blocos
```

**Testes Automatizados:**
```bash
# Rodar suite de testes
npm test -- --grep "atomic blocks"

# Testes E2E
npm run test:e2e -- --spec "quiz-flow.spec.ts"
```

---

#### **Task 9: Verificar Regressões em Steps 1-11, 13-18**
**Status:** 🔴 Not Started

**Checklist:**
```
□ Step 1 (intro) ainda funciona
□ Steps 2-11 (perguntas) funcionam normalmente
□ Step 13-18 (perguntas estratégicas) funcionam
□ Navegação entre steps não quebrou
□ Blocos existentes não foram afetados:
  □ text-inline
  □ image-display-inline
  □ options-grid
  □ options-button-grid
□ Painel de propriedades funciona para todos os blocos
□ Salvar/carregar quiz funciona
□ Exportar quiz funciona
```

**Teste de Regressão Completo:**
```bash
# Navegar do início ao fim do quiz
1. Abrir http://localhost:8080/quiz
2. Responder todas as 21 etapas
3. Verificar que nenhum step quebrou
4. Verificar que resultado final é correto
5. Verificar console sem erros
```

---

### **FASE 5: DOCUMENTAÇÃO E VALIDAÇÃO (Tasks 10-11)** 📚
**Objetivo:** Documentar mudanças e validar integridade do sistema

#### **Task 10: Atualizar Documentação**
**Status:** 🔴 Not Started

**Documentos a Criar/Atualizar:**

##### **1. ARQUITETURA_RENDERIZACAO.md** (NOVO)
```markdown
# Arquitetura de Renderização - Quiz Flow Pro

## Fluxo Unificado (Após Migração)

```
User Request
    ↓
QuizRenderer
    ↓
[Feature Flag Check]
    ↓
BlockRenderer ← Template JSON
    ↓
Blocos Atômicos (registry lookup)
    ↓
Componentes Finais
```

## Tipos de Steps

| Step Type | Blocos Usados | Exemplo |
|-----------|---------------|---------|
| Intro | text-inline, image-display-inline | Step 1 |
| Question | text-inline, options-grid | Steps 2-11 |
| Strategic | text-inline, options-button-grid | Steps 13-18 |
| Transition | transition-title, transition-loader | Steps 12, 19 |
| Result | result-main, result-style, result-cta | Step 20 |

## Sistema de Blocos

Todos os steps agora usam blocos atômicos do template JSON.
Não há mais componentes monolíticos especiais.
```

##### **2. MIGRATION_GUIDE.md** (ATUALIZAR)
```markdown
# Guia de Migração - Steps Especiais

## O que mudou?

### Antes (Legado):
- Steps 12, 19: `<TransitionStep>` (100 linhas hardcoded)
- Step 20: `<ResultStep>` (469 linhas hardcoded)
- Templates JSON eram ignorados

### Depois (Novo):
- Todos os steps usam BlockRenderer
- Templates JSON definem estrutura
- Blocos atômicos reutilizáveis
- Editor e runtime alinhados

## Como migrar templates customizados:

Se você tem templates customizados para Steps 12, 19, 20:

1. Substitua `transition-step` por blocos atômicos:
```json
// Antes:
{ "type": "transition-step", "properties": {...} }

// Depois:
[
    { "type": "transition-title", "content": {...} },
    { "type": "transition-loader", "content": {...} }
]
```

2. [Instruções detalhadas...]
```

##### **3. README.md** (ATUALIZAR)
```markdown
## Sistema de Blocos Atômicos

O Quiz Flow Pro usa um sistema modular de blocos atômicos:

- ✅ **12 blocos atômicos** para composição de steps
- ✅ **Templates JSON** definem estrutura
- ✅ **Editor visual** para customização
- ✅ **Reutilizáveis** entre diferentes steps

### Blocos Disponíveis:

#### Transição:
- `transition-title` - Título da transição
- `transition-subtitle` - Subtítulo
- `transition-loader` - Indicador de loading
- `transition-progress` - Barra de progresso

#### Resultado:
- `result-main` - Título e descrição principal
- `result-style` - Exibição do estilo calculado
- `result-characteristics` - Lista de características
- `result-cta-primary` - Call-to-action principal
- `result-cta-secondary` - Call-to-action secundário
- `result-social-proof` - Prova social
- `result-guarantee` - Garantia
- `result-testimonials` - Depoimentos

### Exemplo de Template:

```json
{
  "stepNumber": 20,
  "blocks": [
    {
      "type": "result-main",
      "content": {
        "title": "Seu Resultado",
        "description": "Baseado nas suas respostas..."
      }
    },
    {
      "type": "result-cta-primary",
      "content": {
        "text": "Ver Oferta",
        "url": "/oferta"
      }
    }
  ]
}
```
```

---

#### **Task 11: Executar Raio-X Final**
**Status:** 🔴 Not Started

**Comando:**
```bash
node scripts/raio-x-completo.mjs 2>&1 | tee RESULTADO_RAIO_X_FINAL.txt
```

**Critérios de Sucesso:**
```
✅ 0 problemas detectados
✅ Todos os blocos lendo de 'content'
✅ Nenhum bloco lendo de 'properties'
✅ Nenhum acoplamento residual
✅ TransitionStep e ResultStep marcados como legacy
✅ Sistema 100% modular
```

**Comparação Antes/Depois:**
```markdown
## Métricas

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Componentes monolíticos | 2 | 0 | -100% |
| Linhas de código acoplado | 569 | 0 | -100% |
| Steps usando blocos atômicos | 17/21 | 21/21 | +23% |
| Editor/runtime alinhados | ❌ | ✅ | 100% |
| Problemas no raio-x | 0 | 0 | ✅ |
```

---

## 📋 **CHECKLIST GERAL**

### **Pré-requisitos:**
- [x] Servidor rodando (`npm run dev`)
- [x] 12 blocos atômicos criados
- [x] Templates JSON migrados
- [x] Raio-x inicial executado (0 problemas)

### **Fase 1 - Investigação:**
- [ ] Task 1: Mapear fluxo de renderização
- [ ] Task 2: Identificar pontos de decisão
- [ ] Task 3: Testar renderização atual

### **Fase 2 - Planejamento:**
- [ ] Task 4: Criar estratégia de migração

### **Fase 3 - Implementação:**
- [ ] Task 5: Implementar BlockRenderer para Steps 12/19/20
- [ ] Task 6: Remover hardcoded stepType
- [ ] Task 7: Deprecar componentes legados

### **Fase 4 - Testes:**
- [ ] Task 8: Testar Steps 12, 19, 20 com blocos atômicos
- [ ] Task 9: Verificar regressões em Steps 1-11, 13-18

### **Fase 5 - Documentação:**
- [ ] Task 10: Atualizar documentação
- [ ] Task 11: Executar raio-x final

---

## ⏱️ **ESTIMATIVAS DE TEMPO**

| Fase | Tasks | Tempo Estimado | Complexidade |
|------|-------|----------------|--------------|
| **Fase 1** | 1-3 | 2-3 horas | 🟢 Baixa |
| **Fase 2** | 4 | 1 hora | 🟢 Baixa |
| **Fase 3** | 5-7 | 4-6 horas | 🟡 Média |
| **Fase 4** | 8-9 | 2-3 horas | 🟡 Média |
| **Fase 5** | 10-11 | 1-2 horas | 🟢 Baixa |
| **TOTAL** | 11 tasks | **10-15 horas** | 🟡 Média |

---

## 🎯 **CRITÉRIOS DE SUCESSO**

### **Técnicos:**
- ✅ Steps 12, 19, 20 renderizam blocos atômicos
- ✅ Componentes legados deprecados
- ✅ 0 problemas no raio-x final
- ✅ Todos os testes passando
- ✅ Sem regressões

### **Funcionais:**
- ✅ Editor e runtime alinhados
- ✅ Usuário vê mesma coisa no editor e no quiz
- ✅ Todas as funcionalidades preservadas
- ✅ Performance mantida ou melhorada

### **Documentação:**
- ✅ Arquitetura documentada
- ✅ Guia de migração criado
- ✅ README atualizado
- ✅ Código comentado

---

## 🚨 **RISCOS E MITIGAÇÕES**

### **Risco 1: Quebrar funcionalidades existentes**
**Probabilidade:** 🟡 Média  
**Impacto:** 🔴 Alto  
**Mitigação:** 
- Usar feature flag para rollback rápido
- Testes extensivos antes de remover legado
- Manter componentes legados até validação completa

### **Risco 2: Performance degradada**
**Probabilidade:** 🟢 Baixa  
**Impacto:** 🟡 Médio  
**Mitigação:**
- Comparar métricas antes/depois
- Usar React.memo nos blocos atômicos
- Lazy loading se necessário

### **Risco 3: Bugs em edge cases**
**Probabilidade:** 🟡 Média  
**Impacto:** 🟡 Médio  
**Mitigação:**
- Testes E2E cobrindo todos os fluxos
- Beta testing com usuários reais
- Monitoramento em produção

---

## 🎉 **PRÓXIMOS PASSOS**

### **Imediato (Agora):**
1. ✅ Plano criado e documentado
2. ⏳ **Iniciar Task 1:** Mapear fluxo de renderização

### **Curto Prazo (Hoje):**
- Completar Fase 1 (Investigação)
- Tomar decisão sobre estratégia (Task 4)

### **Médio Prazo (Esta Semana):**
- Implementar correções (Fase 3)
- Executar testes (Fase 4)

### **Longo Prazo (Próxima Sprint):**
- Remover feature flags
- Deletar componentes legados completamente
- Publicar v2.0 com sistema 100% modular

---

**Status do Plano:** 🟢 **APROVADO PARA EXECUÇÃO**  
**Próxima Ação:** Iniciar Task 1 - Mapear fluxo de renderização completo  
**Responsável:** Agente AI  
**Prazo:** 15 horas de trabalho efetivo
