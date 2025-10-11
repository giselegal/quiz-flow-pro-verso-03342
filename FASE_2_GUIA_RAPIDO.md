# 🚀 FASE 2 - Guia Rápido de Integração

**Objetivo:** Integrar o sistema de templates JSON com `useQuizState` e `QuizApp`

---

## 📋 Checklist Fase 2

### Sprint 2.1 - Atualizar useQuizState (1-2 horas)
- [ ] Importar `useTemplateLoader` e `useFeatureFlags`
- [ ] Adicionar lógica condicional: JSON vs QUIZ_STEPS
- [ ] Implementar estados de loading
- [ ] Implementar tratamento de erros
- [ ] Testar com feature flag ativada

### Sprint 2.2 - Atualizar QuizApp (1-2 horas)
- [ ] Adicionar loading spinner
- [ ] Adicionar error boundary
- [ ] Adicionar retry button
- [ ] Implementar prefetch dos próximos steps
- [ ] Testar navegação entre steps

### Sprint 2.3 - Testes de Integração (1 hora)
- [ ] Testar fluxo completo com JSON
- [ ] Testar fallback para QUIZ_STEPS
- [ ] Testar transição entre templates
- [ ] Validar dados salvos

---

## 🛠️ Código Pronto Para Usar

### 1. **useQuizState.ts** - Modificações necessárias

**Localização:** `src/hooks/useQuizState.ts`

**Adicionar no topo:**
```typescript
import { useFeatureFlags } from './useFeatureFlags';
import { useTemplateLoader } from './useTemplateLoader';
import { QuizStepAdapter } from '@/adapters/QuizStepAdapter';
```

**Adicionar dentro do hook:**
```typescript
export const useQuizState = (initialStep = 1) => {
  // Feature flags
  const { useJsonTemplates } = useFeatureFlags();
  
  // Template loader
  const {
    loadQuizEstiloTemplate,
    prefetchNextSteps,
    isLoading,
    error
  } = useTemplateLoader();

  // Estados existentes
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  
  // Novos estados para JSON
  const [currentTemplate, setCurrentTemplate] = useState<QuizStep | null>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);

  // Carregar template quando step mudar
  useEffect(() => {
    const loadCurrentStep = async () => {
      if (!useJsonTemplates) {
        // Usa QUIZ_STEPS antigo
        const step = QUIZ_STEPS.find(s => s.step === currentStep);
        setCurrentTemplate(step || null);
        return;
      }

      // Usa templates JSON
      setLoadingTemplate(true);
      setTemplateError(null);

      try {
        const template = await loadQuizEstiloTemplate(currentStep);
        if (template) {
          setCurrentTemplate(template);
          
          // Prefetch próximos steps
          prefetchNextSteps(currentStep);
        } else {
          throw new Error(`Template ${currentStep} não encontrado`);
        }
      } catch (err) {
        console.error('Erro ao carregar template:', err);
        setTemplateError(err.message);
        
        // Fallback para QUIZ_STEPS
        const fallbackStep = QUIZ_STEPS.find(s => s.step === currentStep);
        setCurrentTemplate(fallbackStep || null);
      } finally {
        setLoadingTemplate(false);
      }
    };

    loadCurrentStep();
  }, [currentStep, useJsonTemplates]);

  // Retornar novos valores
  return {
    currentStep,
    currentTemplate, // ✨ NOVO: template carregado
    loadingTemplate, // ✨ NOVO: estado de loading
    templateError,   // ✨ NOVO: erro de carregamento
    answers,
    setCurrentStep,
    setAnswers,
    // ... resto dos métodos existentes
  };
};
```

---

### 2. **QuizApp.tsx** - Modificações necessárias

**Localização:** `src/components/quiz/QuizApp.tsx`

**Adicionar loading state:**
```typescript
export const QuizApp = () => {
  const {
    currentStep,
    currentTemplate,
    loadingTemplate,
    templateError,
    // ... resto dos valores
  } = useQuizState();

  // Loading spinner
  if (loadingTemplate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando próxima etapa...</p>
        </div>
      </div>
    );
  }

  // Error boundary
  if (templateError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Erro ao carregar etapa</h2>
          <p className="text-muted-foreground mb-4">{templateError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Template não encontrado
  if (!currentTemplate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">
            Etapa {currentStep} não encontrada
          </p>
        </div>
      </div>
    );
  }

  // Renderizar template normalmente
  return (
    <div className="quiz-container">
      {/* Seu código de renderização existente */}
      {/* ... */}
    </div>
  );
};
```

---

### 3. **Componente de Debug** (opcional mas útil)

**Criar:** `src/components/debug/FeatureFlagDebug.tsx`

```typescript
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export const FeatureFlagDebug = () => {
  const flags = useFeatureFlags();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div className="font-bold mb-2">🚩 Feature Flags</div>
      <div className="space-y-1">
        <div>JSON Templates: {flags.useJsonTemplates ? '✅' : '❌'}</div>
        <div>Rollout: {flags.rolloutPercentage}%</div>
        <div>Prefetch: {flags.enablePrefetch ? '✅' : '❌'}</div>
      </div>
      <button
        onClick={() => {
          localStorage.setItem('feature_useJsonTemplates', 
            String(!flags.useJsonTemplates));
          window.location.reload();
        }}
        className="mt-2 px-3 py-1 bg-primary rounded text-white w-full"
      >
        Toggle JSON
      </button>
    </div>
  );
};
```

**Adicionar no QuizApp:**
```typescript
import { FeatureFlagDebug } from '@/components/debug/FeatureFlagDebug';

export const QuizApp = () => {
  return (
    <>
      {/* Seu conteúdo existente */}
      <FeatureFlagDebug />
    </>
  );
};
```

---

## 🧪 Como Testar

### 1. **Testar com JSON desabilitado (padrão)**
```bash
# Garantir que está usando QUIZ_STEPS antigo
npm run dev
# Acessar http://localhost:5173/quiz-estilo
# Deve funcionar normalmente com QUIZ_STEPS
```

### 2. **Ativar JSON Templates**
```javascript
// Console do navegador
localStorage.setItem('feature_useJsonTemplates', 'true');
location.reload();
```

### 3. **Verificar loading**
- Deve mostrar spinner ao mudar de step
- Spinner deve desaparecer quando template carregar

### 4. **Testar erro (simular falha)**
```javascript
// Temporariamente no useTemplateLoader.ts
throw new Error('Teste de erro');
// Deve mostrar tela de erro com botão "Tentar novamente"
```

### 5. **Testar prefetch**
```javascript
// Console
console.log('Cache atual:', cacheRef.current);
// Deve mostrar próximos 3 steps já carregados
```

---

## 📊 Ordem de Implementação Recomendada

### **Dia 2 (Segunda-feira)**
1. ✅ Atualizar `useQuizState.ts` (1 hora)
2. ✅ Testar carregamento de template (30 min)
3. ✅ Implementar loading state (30 min)

### **Dia 3 (Terça-feira)**  
4. ✅ Atualizar `QuizApp.tsx` (1 hora)
5. ✅ Adicionar error boundary (30 min)
6. ✅ Testar fluxo completo (30 min)
7. ✅ Adicionar componente de debug (30 min)

---

## 🚨 Problemas Comuns e Soluções

### **Problema 1: Template não carrega**
**Sintoma:** Loading infinito  
**Solução:** Verificar se arquivo JSON existe em `/templates/`

### **Problema 2: Erro de tipo TypeScript**
**Sintoma:** `Type 'QuizStep | null' is not assignable...`  
**Solução:** Adicionar verificação `if (!currentTemplate) return null;`

### **Problema 3: Fallback não funciona**
**Sintoma:** Erro não tratado  
**Solução:** Garantir que `QUIZ_STEPS` está importado e acessível

### **Problema 4: Prefetch não funciona**
**Sintoma:** Cada step demora para carregar  
**Solução:** Verificar se `prefetchNextSteps()` está sendo chamado

---

## 📈 Métricas de Sucesso

- [ ] Fluxo completo funciona com JSON templates
- [ ] Loading state aparece e desaparece corretamente
- [ ] Erro é tratado e mostra UI amigável
- [ ] Fallback funciona se JSON falhar
- [ ] Prefetch melhora performance (sem delay entre steps)
- [ ] Debug component mostra feature flags corretamente

---

## 🎯 Checklist de Conclusão Fase 2

Antes de avançar para Fase 3, garantir:

- [ ] `useQuizState` usa JSON quando flag ativa
- [ ] `QuizApp` renderiza loading/error states
- [ ] Navegação entre steps funciona
- [ ] Dados são salvos corretamente
- [ ] Fallback para QUIZ_STEPS funciona
- [ ] Prefetch melhora performance
- [ ] Nenhum erro no console
- [ ] TypeScript compila sem erros
- [ ] Git commit com mensagem descritiva

---

## 🤝 Próximo Passo

Quando Fase 2 estiver completa:
1. Fazer commit: `git commit -m "feat: Fase 2 - Integração JSON templates com useQuizState e QuizApp"`
2. Criar `FASE_2_COMPLETA_STATUS.md`
3. Avançar para **Fase 3 - Testes**

---

**Bom trabalho! 🚀 Qualquer dúvida, consulte FASE_1_COMPLETA_STATUS.md**
