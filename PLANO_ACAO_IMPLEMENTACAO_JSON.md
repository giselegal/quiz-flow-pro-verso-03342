# 🚀 Plano de Ação: Implementação Templates JSON em /quiz-estilo

## 📋 Sumário Executivo

Este documento detalha o plano completo para migrar `/quiz-estilo` de `QUIZ_STEPS` (TypeScript) para Templates JSON, aproveitando o sistema já criado mas não conectado.

**Objetivo:** Usar templates JSON modernos (v2.0) em produção, mantendo compatibilidade e zero downtime.

**Tempo Estimado:** 2-3 semanas (com testes)  
**Complexidade:** Média-Alta  
**Risco:** Médio (mitigável com feature flags)

---

## 🎯 Objetivos e Benefícios

### Objetivos:
1. ✅ Migrar `/quiz-estilo` para usar templates JSON
2. ✅ Manter sistema legado funcionando (fallback)
3. ✅ Zero downtime durante migração
4. ✅ Melhorar performance (lazy loading)
5. ✅ Facilitar manutenção futura

### Benefícios:
- 📊 **Performance:** Lazy loading reduz bundle em ~85%
- 🔧 **Manutenção:** Editar 1 arquivo JSON vs 410 linhas TS
- 📦 **Escalabilidade:** Adicionar steps sem rebuild
- 🎨 **Flexibilidade:** Metadados ricos (analytics, validation)
- 🚀 **Futuro:** Base para CMS/editor visual

---

## 📊 Análise de Impacto

### Arquivos Afetados (8 principais):
1. `src/hooks/useQuizState.ts` - Hook de estado
2. `src/components/quiz/QuizApp.tsx` - Componente principal
3. `src/hooks/useTemplateLoader.ts` - Loader (já existe!)
4. `src/data/quizSteps.ts` - Mantido como fallback
5. `templates/step-*.json` - Templates JSON (já existem!)
6. `src/config/quizRuntimeFlags.ts` - Feature flags
7. `src/adapters/QuizStepAdapter.ts` - Novo adaptador
8. `src/services/QuizEditorBridge.ts` - Atualizar bridge

### Código Legado Preservado:
- ✅ `QUIZ_STEPS` mantido como fallback
- ✅ Componentes existentes compatíveis
- ✅ Zero breaking changes

---

## 🗓️ Cronograma Detalhado

### **FASE 1: Preparação (2-3 dias)**
**Objetivo:** Auditar templates e criar adaptadores

#### Sprint 1.1: Auditoria de Templates
- [ ] Comparar QUIZ_STEPS vs templates JSON (step-01 a step-21)
- [ ] Identificar diferenças estruturais
- [ ] Documentar gaps e incompatibilidades
- [ ] Criar planilha de mapeamento

**Entregável:** `AUDITORIA_TEMPLATES_JSON.md`

#### Sprint 1.2: Criar Adaptadores
- [ ] Criar `QuizStepAdapter.ts` (JSON → QuizStep)
- [ ] Implementar conversão de blocos JSON
- [ ] Mapear campos: `blocks[]` → `options[]`, `title`, `text`
- [ ] Testes unitários para adaptador

**Entregável:** `src/adapters/QuizStepAdapter.ts` + testes

#### Sprint 1.3: Feature Flags
- [ ] Adicionar `useJsonTemplates: boolean` em `quizRuntimeFlags.ts`
- [ ] Criar hook `useFeatureFlag('jsonTemplates')`
- [ ] Implementar toggle no localStorage/admin

**Entregável:** Sistema de feature flags funcionando

---

### **FASE 2: Integração (3-4 dias)**
**Objetivo:** Conectar templates JSON ao código

#### Sprint 2.1: Atualizar useTemplateLoader
- [ ] Revisar hook `useTemplateLoader.ts`
- [ ] Garantir que `loadQuizEstiloTemplate()` funciona
- [ ] Adicionar cache de templates carregados
- [ ] Tratar erros de carregamento (fallback)
- [ ] Adicionar logs de debug

**Código Atual:**
```typescript
// src/hooks/useTemplateLoader.ts (já existe!)
const loadQuizEstiloTemplate = useCallback(
  async (stepNumber: number) => {
    const template = await import(`/templates/step-${stepNumber}.json`);
    return template;
  },
  []
);
```

**Melhorias Necessárias:**
```typescript
const loadQuizEstiloTemplate = useCallback(
  async (stepNumber: number): Promise<QuizStep> => {
    try {
      // 1. Tentar carregar JSON
      const jsonTemplate = await import(`/templates/step-${stepNumber.toString().padStart(2, '0')}-template.json`);
      
      // 2. Adaptar para formato QuizStep
      const adapted = QuizStepAdapter.fromJSON(jsonTemplate.default);
      
      // 3. Cache
      templateCache.set(`step-${stepNumber}`, adapted);
      
      return adapted;
    } catch (error) {
      console.warn(`⚠️ Erro ao carregar template JSON ${stepNumber}, usando fallback`, error);
      
      // 4. Fallback para QUIZ_STEPS
      return QUIZ_STEPS[`step-${stepNumber.toString().padStart(2, '0')}`];
    }
  },
  []
);
```

#### Sprint 2.2: Atualizar useQuizState
- [ ] Modificar `useQuizState` para usar loader JSON
- [ ] Implementar carregamento assíncrono de steps
- [ ] Manter fallback para QUIZ_STEPS
- [ ] Adicionar estado de loading

**Código Atual:**
```typescript
// src/hooks/useQuizState.ts - Linha 76
export function useQuizState(funnelId?: string, externalSteps?: Record<string, any>) {
  const [state, setState] = useState<QuizState>(initialState);
  
  // Atualmente usa: externalSteps || loadedSteps || QUIZ_STEPS
  const stepsSource = externalSteps || loadedSteps || QUIZ_STEPS;
}
```

**Código Novo:**
```typescript
export function useQuizState(funnelId?: string, externalSteps?: Record<string, any>) {
  const [state, setState] = useState<QuizState>(initialState);
  const [jsonSteps, setJsonSteps] = useState<Record<string, QuizStep> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { loadQuizEstiloTemplate } = useTemplateLoader();
  const { useJsonTemplates } = useFeatureFlags();

  // Carregar todos os 21 steps do JSON
  useEffect(() => {
    if (useJsonTemplates && !externalSteps) {
      setIsLoading(true);
      
      // Carregar steps em paralelo (1-21)
      const promises = Array.from({ length: 21 }, (_, i) => 
        loadQuizEstiloTemplate(i + 1)
          .then(step => [`step-${(i + 1).toString().padStart(2, '0')}`, step])
      );
      
      Promise.all(promises)
        .then(entries => {
          const stepsMap = Object.fromEntries(entries);
          console.log('✅ Templates JSON carregados:', Object.keys(stepsMap).length);
          setJsonSteps(stepsMap);
        })
        .catch(err => {
          console.error('❌ Erro ao carregar templates JSON:', err);
          setJsonSteps(QUIZ_STEPS); // Fallback completo
        })
        .finally(() => setIsLoading(false));
    }
  }, [useJsonTemplates, externalSteps, loadQuizEstiloTemplate]);

  // Prioridade: external > json > loaded > default
  const stepsSource = externalSteps || jsonSteps || loadedSteps || QUIZ_STEPS;
  
  // Mostrar loading state
  if (isLoading) {
    return { ...defaultReturn, isLoading: true };
  }
  
  // ... resto do código
}
```

#### Sprint 2.3: Atualizar QuizApp
- [ ] Adicionar suporte a loading state
- [ ] Mostrar skeleton/spinner enquanto carrega
- [ ] Tratar erros gracefully

**Código Novo:**
```typescript
// src/components/quiz/QuizApp.tsx
export default function QuizApp({ funnelId, externalSteps }: QuizAppProps) {
  const {
    state,
    currentStepData,
    isLoading, // ← NOVO
    error, // ← NOVO
    progress,
    nextStep,
    // ...
  } = useQuizState(funnelId, externalSteps);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fefefe] flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-[#5b4135]">Carregando quiz...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#fefefe] flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Erro ao carregar o quiz.</p>
          <button onClick={() => window.location.reload()}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  // ... resto do código normal
}
```

---

### **FASE 3: Testes (3-4 dias)**
**Objetivo:** Garantir qualidade e compatibilidade

#### Sprint 3.1: Testes Unitários
- [ ] Testar `QuizStepAdapter` (conversão JSON → QuizStep)
- [ ] Testar `useTemplateLoader` (carregamento + cache)
- [ ] Testar `useQuizState` (com JSON + fallback)
- [ ] Mock de templates JSON para testes

**Arquivo:** `src/__tests__/adapters/QuizStepAdapter.test.ts`
```typescript
describe('QuizStepAdapter', () => {
  it('deve converter template JSON para QuizStep', () => {
    const jsonTemplate = {
      templateVersion: "2.0",
      blocks: [
        { id: "step01-header", type: "quiz-intro-header", properties: {...} }
      ]
    };
    
    const quizStep = QuizStepAdapter.fromJSON(jsonTemplate);
    
    expect(quizStep.type).toBe('intro');
    expect(quizStep.title).toBeDefined();
  });

  it('deve usar fallback se JSON inválido', () => {
    const invalidJSON = { invalid: true };
    
    expect(() => {
      QuizStepAdapter.fromJSON(invalidJSON);
    }).toThrow();
  });
});
```

#### Sprint 3.2: Testes de Integração
- [ ] Testar fluxo completo (21 steps)
- [ ] Testar navegação entre steps
- [ ] Testar respostas e pontuação
- [ ] Testar resultado final

**Arquivo:** `src/__tests__/integration/quiz-json-templates.test.tsx`
```typescript
describe('Quiz com Templates JSON', () => {
  it('deve carregar step-01 do JSON', async () => {
    const { result } = renderHook(() => useQuizState());
    
    await waitFor(() => {
      expect(result.current.currentStepData).toBeDefined();
      expect(result.current.currentStepData.type).toBe('intro');
    });
  });

  it('deve navegar entre steps JSON', async () => {
    const { result } = renderHook(() => useQuizState());
    
    act(() => result.current.nextStep());
    
    await waitFor(() => {
      expect(result.current.state.currentStep).toBe('step-02');
    });
  });

  it('deve usar fallback se JSON falhar', async () => {
    // Forçar erro no carregamento
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const { result } = renderHook(() => useQuizState());
    
    await waitFor(() => {
      expect(result.current.currentStepData).toBeDefined(); // Usou QUIZ_STEPS
    });
  });
});
```

#### Sprint 3.3: Testes E2E
- [ ] Cypress/Playwright: fluxo completo do quiz
- [ ] Testar em diferentes navegadores
- [ ] Testar em mobile
- [ ] Testar performance (bundle size, load time)

**Arquivo:** `cypress/e2e/quiz-json-templates.cy.ts`
```typescript
describe('Quiz /quiz-estilo com JSON', () => {
  it('deve carregar página inicial', () => {
    cy.visit('/quiz-estilo');
    cy.contains('Chega de um guarda-roupa lotado').should('be.visible');
  });

  it('deve completar quiz inteiro', () => {
    cy.visit('/quiz-estilo');
    
    // Step 1: Nome
    cy.get('input[name="userName"]').type('Maria');
    cy.contains('Quero Descobrir').click();
    
    // Step 2: Primeira pergunta
    cy.contains('QUAL O SEU TIPO DE ROUPA').should('be.visible');
    cy.get('[data-style-id="natural"]').click();
    cy.get('[data-style-id="classico"]').click();
    cy.get('[data-style-id="romantico"]').click();
    cy.contains('Próxima').click();
    
    // ... continuar até step 21
  });
});
```

---

### **FASE 4: Deploy Gradual (1 semana)**
**Objetivo:** Release seguro em produção

#### Sprint 4.1: Feature Flag em Staging
- [ ] Deploy para staging com flag OFF
- [ ] Ativar flag para 10% dos usuários
- [ ] Monitorar erros no Sentry
- [ ] Validar métricas (bundle size, performance)

**Configuração:**
```typescript
// src/config/featureFlags.ts
export const FEATURE_FLAGS = {
  jsonTemplates: {
    enabled: process.env.VITE_JSON_TEMPLATES === 'true',
    rolloutPercentage: 10, // 10% dos usuários
    environments: ['staging'], // Apenas staging inicialmente
  }
};

// Implementação de rollout gradual
export function shouldEnableJsonTemplates(): boolean {
  const { enabled, rolloutPercentage } = FEATURE_FLAGS.jsonTemplates;
  
  if (!enabled) return false;
  
  // Hash do userId ou sessionId para rollout consistente
  const userId = getUserId();
  const hash = simpleHash(userId);
  
  return (hash % 100) < rolloutPercentage;
}
```

#### Sprint 4.2: Monitoramento
- [ ] Configurar logs no Sentry/DataDog
- [ ] Dashboard de métricas (success rate, load time)
- [ ] Alertas automáticos (error rate > 5%)
- [ ] A/B testing (JSON vs Legacy)

**Métricas a Monitorar:**
- ✅ Success rate de carregamento JSON
- ✅ Fallback rate (quantos usaram QUIZ_STEPS)
- ✅ Bundle size (antes vs depois)
- ✅ First Contentful Paint (FCP)
- ✅ Largest Contentful Paint (LCP)
- ✅ Time to Interactive (TTI)
- ✅ Taxa de conclusão do quiz
- ✅ Taxa de erro/crash

#### Sprint 4.3: Aumento Gradual
- [ ] Aumentar para 25% (se métricas OK)
- [ ] Aumentar para 50% (após 2 dias)
- [ ] Aumentar para 100% (após 1 semana)
- [ ] Remover feature flag (código limpo)

**Checklist de Aumento:**
```markdown
Antes de aumentar rollout:
- [ ] Error rate < 1%
- [ ] Fallback rate < 5%
- [ ] Performance igual ou melhor que legado
- [ ] Nenhum bug crítico reportado
- [ ] Aprovação do time
```

---

### **FASE 5: Otimização (3-5 dias)**
**Objetivo:** Melhorar performance e DX

#### Sprint 5.1: Lazy Loading Avançado
- [ ] Carregar apenas step atual (não todos 21)
- [ ] Prefetch dos próximos 2 steps
- [ ] Cache inteligente (LRU)
- [ ] Service Worker para offline

**Implementação:**
```typescript
// Lazy loading por step
const loadStepOnDemand = async (stepNumber: number) => {
  // Cache check
  if (stepCache.has(stepNumber)) {
    return stepCache.get(stepNumber);
  }
  
  // Carregar apenas step atual
  const step = await loadQuizEstiloTemplate(stepNumber);
  stepCache.set(stepNumber, step);
  
  // Prefetch próximos 2 steps em background
  if (stepNumber < 21) {
    loadQuizEstiloTemplate(stepNumber + 1).catch(() => {});
    loadQuizEstiloTemplate(stepNumber + 2).catch(() => {});
  }
  
  return step;
};
```

#### Sprint 5.2: Build Optimization
- [ ] Code splitting por step
- [ ] Tree shaking de código não usado
- [ ] Minificação de JSON templates
- [ ] Compression (gzip/brotli)

**Vite Config:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'quiz-templates': [
            '/templates/step-01-template.json',
            '/templates/step-02-template.json',
            // ... ou carregar dinamicamente
          ]
        }
      }
    }
  }
});
```

#### Sprint 5.3: Developer Experience
- [ ] Script para converter QUIZ_STEPS → JSON
- [ ] Script para validar templates JSON
- [ ] Hot reload de templates em dev
- [ ] Documentação completa

**Script de Conversão:**
```typescript
// scripts/convert-quiz-steps-to-json.ts
import { QUIZ_STEPS } from '../src/data/quizSteps';
import fs from 'fs';
import path from 'path';

function convertStepToJSON(stepId: string, step: QuizStep) {
  const jsonTemplate = {
    templateVersion: "2.0",
    metadata: {
      id: `quiz-${stepId}`,
      name: step.title || `Step ${stepId}`,
      category: step.type,
      createdAt: new Date().toISOString()
    },
    layout: {
      containerWidth: "full",
      spacing: "small",
      backgroundColor: "#FAF9F7"
    },
    blocks: QuizStepAdapter.toJSONBlocks(step)
  };
  
  return JSON.stringify(jsonTemplate, null, 2);
}

// Converter todos os steps
Object.entries(QUIZ_STEPS).forEach(([stepId, step]) => {
  const json = convertStepToJSON(stepId, step);
  const filename = `step-${stepId.replace('step-', '')}-template.json`;
  fs.writeFileSync(path.join(__dirname, '../templates', filename), json);
  console.log(`✅ Convertido: ${filename}`);
});
```

---

### **FASE 6: Limpeza e Documentação (2-3 dias)**
**Objetivo:** Finalizar migração

#### Sprint 6.1: Remover Código Legado
- [ ] Avaliar se QUIZ_STEPS ainda é necessário (fallback?)
- [ ] Remover código morto (se não usado)
- [ ] Atualizar imports em todos os arquivos
- [ ] Limpar comentários e TODOs

**Decisão:** Manter QUIZ_STEPS como fallback ou remover?

**Opção A - Manter (Recomendado):**
```typescript
// Mantém QUIZ_STEPS como fallback de segurança
// Útil se JSON falhar ou for corrompido
const stepsSource = jsonSteps || QUIZ_STEPS;
```

**Opção B - Remover:**
```typescript
// Remove QUIZ_STEPS completamente
// JSON é única fonte de verdade
const stepsSource = jsonSteps;
if (!stepsSource) throw new Error('Failed to load templates');
```

#### Sprint 6.2: Documentação
- [ ] Atualizar README.md
- [ ] Criar guia de manutenção de templates
- [ ] Documentar estrutura JSON
- [ ] Exemplos de customização

**Documentos a Criar:**
- `docs/TEMPLATES_JSON_GUIDE.md` - Guia completo
- `docs/TEMPLATE_SCHEMA.md` - Schema dos templates
- `docs/MIGRATION_GUIDE.md` - Guia de migração
- `CHANGELOG.md` - Mudanças da versão

#### Sprint 6.3: Treinamento do Time
- [ ] Apresentação sobre nova estrutura
- [ ] Workshop hands-on
- [ ] Gravar vídeos tutoriais
- [ ] Q&A session

---

## 📊 Métricas de Sucesso

### Performance
- ✅ Bundle size: Redução de 85% (~120KB → ~20KB inicial)
- ✅ First Load: < 1.5s (vs ~2.5s atual)
- ✅ LCP: < 2s (vs ~3s atual)
- ✅ TTI: < 3s (vs ~4s atual)

### Qualidade
- ✅ Test Coverage: > 90%
- ✅ Error Rate: < 1%
- ✅ Fallback Rate: < 5%
- ✅ Zero breaking changes

### Developer Experience
- ✅ Tempo para editar step: 2min (vs 10min antes)
- ✅ Hot reload: < 1s
- ✅ Build time: Igual ou menor

---

## 🚨 Riscos e Mitigações

### Risco 1: Templates JSON incompletos ou com erros
**Probabilidade:** Alta  
**Impacto:** Alto  
**Mitigação:**
- ✅ Validação automática de schema
- ✅ Testes unitários para cada template
- ✅ Fallback para QUIZ_STEPS sempre disponível
- ✅ Monitoramento de erros em tempo real

### Risco 2: Performance pior que esperado
**Probabilidade:** Baixa  
**Impacto:** Médio  
**Mitigação:**
- ✅ Benchmarking antes/depois
- ✅ Lazy loading otimizado
- ✅ Cache agressivo
- ✅ Rollback fácil via feature flag

### Risco 3: Incompatibilidade com componentes existentes
**Probabilidade:** Média  
**Impacto:** Alto  
**Mitigação:**
- ✅ Adapter layer (QuizStepAdapter)
- ✅ Testes de integração abrangentes
- ✅ Deploy gradual (10% → 100%)
- ✅ Monitoramento de bugs

### Risco 4: Time não familiarizado com nova estrutura
**Probabilidade:** Alta  
**Impacto:** Baixo  
**Mitigação:**
- ✅ Documentação detalhada
- ✅ Treinamento hands-on
- ✅ Scripts de conversão automática
- ✅ Suporte contínuo

---

## 💰 Estimativa de Esforço

| Fase | Duração | Complexidade | Pessoas |
|------|---------|--------------|---------|
| 1. Preparação | 2-3 dias | Baixa | 1 dev |
| 2. Integração | 3-4 dias | Alta | 1-2 devs |
| 3. Testes | 3-4 dias | Média | 1 dev + 1 QA |
| 4. Deploy Gradual | 1 semana | Baixa | 1 dev |
| 5. Otimização | 3-5 dias | Média | 1 dev |
| 6. Limpeza | 2-3 dias | Baixa | 1 dev |
| **TOTAL** | **2-3 semanas** | - | **1-2 devs** |

**Esforço Total:** 15-20 dias úteis  
**Custo Estimado:** 2-3 semanas de 1 desenvolvedor senior

---

## 📋 Checklist Completo

### Pré-requisitos
- [ ] Aprovação do time/stakeholders
- [ ] Ambiente de staging disponível
- [ ] Ferramentas de monitoramento configuradas
- [ ] Backup do código atual

### Fase 1: Preparação
- [ ] Auditoria de templates JSON vs QUIZ_STEPS
- [ ] Criar QuizStepAdapter
- [ ] Implementar feature flags
- [ ] Testes unitários do adapter

### Fase 2: Integração
- [ ] Atualizar useTemplateLoader
- [ ] Atualizar useQuizState
- [ ] Atualizar QuizApp
- [ ] Adicionar loading states

### Fase 3: Testes
- [ ] Testes unitários (adapter, loader, hook)
- [ ] Testes de integração (fluxo completo)
- [ ] Testes E2E (Cypress/Playwright)
- [ ] Testes de performance

### Fase 4: Deploy
- [ ] Deploy staging com flag OFF
- [ ] Ativar para 10% (monitorar 2 dias)
- [ ] Ativar para 25% (monitorar 2 dias)
- [ ] Ativar para 50% (monitorar 3 dias)
- [ ] Ativar para 100% (monitorar 1 semana)

### Fase 5: Otimização
- [ ] Implementar lazy loading avançado
- [ ] Otimizar build (code splitting)
- [ ] Criar scripts de conversão
- [ ] Documentar DX

### Fase 6: Finalização
- [ ] Decidir sobre QUIZ_STEPS (manter/remover)
- [ ] Remover código morto
- [ ] Atualizar documentação
- [ ] Treinamento do time
- [ ] Post-mortem e lições aprendidas

---

## 🔄 Plano de Rollback

### Cenário 1: Bugs Críticos em Produção
**Ação Imediata:**
1. Desativar feature flag `useJsonTemplates = false`
2. Deploy emergency (rollback)
3. Investigar causa raiz
4. Corrigir e re-testar em staging

### Cenário 2: Performance Degradada
**Ação Imediata:**
1. Reduzir rollout para 10%
2. Analisar métricas (LCP, TTI, FCP)
3. Otimizar carregamento
4. Re-testar antes de aumentar

### Cenário 3: Alta Taxa de Fallback
**Ação Imediata:**
1. Investigar logs de erro
2. Validar templates JSON
3. Corrigir templates com erros
4. Re-deploy gradual

---

## 🎯 Próximos Passos Imediatos

### Semana 1 (AGORA):
1. ✅ **Aprovar plano** com time/stakeholders
2. ✅ **Criar branch** `feature/json-templates`
3. ✅ **Auditar templates** JSON existentes
4. ✅ **Criar QuizStepAdapter** básico
5. ✅ **Testes iniciais** do adapter

### Semana 2:
1. ✅ Integração com useQuizState
2. ✅ Testes de integração
3. ✅ Deploy staging com flag OFF

### Semana 3:
1. ✅ Ativar flag gradualmente (10% → 100%)
2. ✅ Monitoramento contínuo
3. ✅ Otimizações

---

## 📞 Pontos de Contato

### Responsáveis:
- **Tech Lead:** [Nome] - Aprovação arquitetural
- **Developer:** [Nome] - Implementação
- **QA:** [Nome] - Testes e validação
- **DevOps:** [Nome] - Deploy e monitoramento

### Reuniões:
- **Daily Stand-up:** 15min - Status updates
- **Review Semanal:** 1h - Demo e feedback
- **Post-Mortem:** 2h - Lições aprendidas

---

## 📚 Recursos e Referências

### Documentação:
- `ANALISE_COMPLETA_TEMPLATES_PROJETO.md` - Análise inicial
- `COMPARACAO_DIRETA_TEMPLATES_JSON_VS_TS.md` - Comparação técnica
- `TEMPLATE_USADO_QUIZ_ESTILO.md` - Sistema atual

### Código Relacionado:
- `src/hooks/useTemplateLoader.ts` - Loader já criado
- `templates/step-*.json` - Templates JSON já existem
- `src/data/quizSteps.ts` - Sistema atual (fallback)

### Ferramentas:
- Vite - Build tool
- Vitest - Testes unitários
- Cypress - Testes E2E
- Sentry - Error tracking
- Vercel Analytics - Performance

---

## ✅ Critérios de Aceitação

### Funcional:
- ✅ `/quiz-estilo` carrega templates JSON
- ✅ Todos os 21 steps funcionam perfeitamente
- ✅ Navegação entre steps OK
- ✅ Respostas e pontuação corretas
- ✅ Resultado final personalizado OK
- ✅ Fallback para QUIZ_STEPS funciona

### Performance:
- ✅ Bundle size < 30KB (inicial)
- ✅ First Load < 1.5s
- ✅ LCP < 2s
- ✅ Zero layout shifts

### Qualidade:
- ✅ Test coverage > 90%
- ✅ Zero breaking changes
- ✅ Error rate < 1%
- ✅ Documentação completa

---

## 🎉 Conclusão

Este plano fornece um roadmap completo e seguro para migrar `/quiz-estilo` para templates JSON, aproveitando o sistema já criado mas não conectado.

**Principais Destaques:**
- ✅ Abordagem gradual e segura (feature flags)
- ✅ Zero downtime (fallback sempre disponível)
- ✅ Melhorias significativas de performance
- ✅ Facilita manutenção futura
- ✅ Base sólida para evoluções (CMS/editor)

**Recomendação:** Iniciar ASAP com Fase 1 (Preparação)

---

**Última atualização:** 11 de outubro de 2025  
**Status:** 📋 Plano Pronto para Execução  
**Próxima Ação:** Aprovação e início da Fase 1
