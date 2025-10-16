# 🎨 GUIA COMPLETO: Como Criar Componentes Separados (Como IntroStep)

> **Tutorial passo a passo para criar novos steps no Quiz Flow Pro**  
> Data: 16 de Outubro de 2025

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Anatomia de um Step Component](#anatomia-de-um-step-component)
3. [Passo a Passo Completo](#passo-a-passo-completo)
4. [Exemplo Prático](#exemplo-prático-welcomestep-completo)
5. [Integração no Sistema](#integração-no-sistema)
6. [Checklist de Validação](#checklist-de-validação)
7. [Troubleshooting](#troubleshooting)
8. [Templates Prontos](#templates-prontos)
9. [Design System](#design-system)
10. [Recursos Adicionais](#recursos-adicionais)

---

## 🎯 VISÃO GERAL

### O que vamos criar?
Um novo step component seguindo o padrão do `IntroStep`, incluindo:
- ✅ Componente React com TypeScript
- ✅ Interface de props tipada
- ✅ Fallbacks e proteções
- ✅ Adapter para o sistema
- ✅ Registro no StepRegistry
- ✅ Dados no QUIZ_STEPS
- ✅ Lazy loading configurado

### Estrutura de Arquivos
```
src/
├── components/quiz/
│   └── WelcomeStep.tsx           # 1️⃣ Componente principal
├── components/step-registry/
│   └── ProductionStepsRegistry.tsx  # 2️⃣ Adapter
├── data/
│   └── quizSteps.ts              # 3️⃣ Dados
└── components/editor/unified/
    └── UnifiedStepRenderer.tsx   # 4️⃣ Lazy loading
```

---

## 💡 EXEMPLO PRÁTICO: WelcomeStep Completo

✅ **Arquivo criado:** `src/components/quiz/WelcomeStep.tsx`

### Features Incluídas:
- ✅ Animações com Framer Motion
- ✅ Scroll progress bar
- ✅ Detecção de leitura completa
- ✅ Checkbox de confirmação
- ✅ Validações robustas
- ✅ Fallbacks de dados
- ✅ Design system consistente
- ✅ Saudação personalizada
- ✅ Lista de benefícios
- ✅ Responsivo mobile-first

---

## 🔗 INTEGRAÇÃO NO SISTEMA

### Passo 1: Atualizar ProductionStepsRegistry

**Arquivo:** `src/components/step-registry/ProductionStepsRegistry.tsx`

```tsx
// No início do arquivo, adicione o import:
import OriginalWelcomeStep from '@/components/quiz/WelcomeStep';

// ... código existente ...

/**
 * 🏠 WELCOME STEP ADAPTER
 */
const WelcomeStepAdapter: React.FC<BaseStepProps> = (props) => {
    const {
        stepId,
        onNext,
        onSave,
        data = {},
        quizState,
        ...otherProps
    } = props as any;

    const adaptedProps = {
        data: {
            id: stepId,
            type: 'welcome' as const,
            ...data
        },
        userName: quizState?.userName,
        onContinue: () => {
            console.log('[WelcomeStep] Avançando');
            onSave({ welcomeConfirmed: true });
            onNext();
        },
        showAnimation: true,
        ...otherProps
    };

    return <OriginalWelcomeStep {...adaptedProps} />;
};

// No final do arquivo, adicione ao export:
export {
    IntroStepAdapter,
    QuestionStepAdapter,
    StrategicQuestionStepAdapter,
    TransitionStepAdapter,
    ResultStepAdapter,
    OfferStepAdapter,
    WelcomeStepAdapter, // ← NOVO
};
```

### Passo 2: Adicionar ao QUIZ_STEPS

**Arquivo:** `src/data/quizSteps.ts`

```tsx
export const QUIZ_STEPS: Record<string, QuizStep> = {
    'step-00': {
        type: 'welcome',
        title: '👋 Bem-vindo(a) ao Quiz de Estilo Pessoal!',
        subtitle: 'Descubra qual estilo combina com você',
        description: 'Este quiz foi desenvolvido por especialistas em consultoria de imagem. Em apenas 3 minutos, você vai descobrir seu estilo predominante e receber dicas personalizadas.',
        buttonText: 'Vamos Começar! 🚀',
        image: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_600,c_limit/v1752443943/welcome-quiz.png',
        backgroundColor: '#FAF9F7',
        textColor: '#432818',
        accentColor: '#B89B7A',
        features: [
            '⏱️ Apenas 3 minutos',
            '🎯 Resultado personalizado',
            '💯 100% gratuito',
            '🔒 Dados seguros'
        ],
        nextStep: 'step-01',
    },
    
    'step-01': {
        type: 'intro',
        // ... dados existentes
    },
    
    // ... outros steps
};

// Atualizar STEP_ORDER
export const STEP_ORDER = [
    'step-00', // ← NOVO
    'step-01',
    'step-02',
    'step-03',
    // ... outros
];
```

### Passo 3: Configurar Lazy Loading

**Arquivo:** `src/components/editor/unified/UnifiedStepRenderer.tsx`

```tsx
const LazyStepComponents = {
    // ⭐ NOVO STEP
    'step-00': lazy(() => 
        import('@/components/step-registry/ProductionStepsRegistry')
            .then(m => ({ default: m.WelcomeStepAdapter }))
    ),
    
    // Steps existentes
    'step-01': lazy(() => 
        import('@/components/step-registry/ProductionStepsRegistry')
            .then(m => ({ default: m.IntroStepAdapter }))
    ),
    
    // ... outros
} as const;
```

### Passo 4: Registrar no StepRegistry

**Arquivo:** `src/components/editor/unified/index.ts`

```tsx
import { WelcomeStepAdapter } from '@/components/step-registry/ProductionStepsRegistry';

export function registerProductionSteps() {
    // ⭐ NOVO STEP
    stepRegistry.register('step-00', WelcomeStepAdapter, {
        name: 'Welcome Step',
        category: 'intro',
        description: 'Tela de boas-vindas com features avançadas',
        icon: '👋',
        version: '1.0.0',
        editable: true,
        configurable: {
            title: true,
            subtitle: true,
            description: true,
            buttonText: true,
            image: true,
            backgroundColor: true,
            textColor: true,
            accentColor: true,
            features: true,
        }
    });
    
    // Steps existentes
    stepRegistry.register('step-01', IntroStepAdapter, {
        // ... config existente
    });
    
    // ... outros
}
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Use esta checklist para garantir que seu novo step está completo:

### Código do Componente
- [ ] Arquivo criado em `src/components/quiz/[NomeStep].tsx`
- [ ] Interface de props tipada
- [ ] Fallback de dados implementado
- [ ] Handlers com try-catch
- [ ] Validações de props
- [ ] Console.log para debug (remover em produção)
- [ ] Classes CSS com design system
- [ ] Responsivo (mobile-first)
- [ ] Acessibilidade (labels, ARIA)
- [ ] Export default

### Adapter
- [ ] Import do componente original
- [ ] Função adapter criada
- [ ] Props convertidas corretamente
- [ ] Callbacks conectados (onNext, onSave)
- [ ] Export adicionado ao final do arquivo

### Dados
- [ ] Step adicionado em QUIZ_STEPS
- [ ] Tipo definido (type: 'welcome')
- [ ] Todos os campos necessários
- [ ] nextStep configurado
- [ ] STEP_ORDER atualizado

### Sistema
- [ ] Lazy loading configurado
- [ ] Step registrado no StepRegistry
- [ ] Config de edição definida
- [ ] Icon e metadata adicionados

### Testes
- [ ] Testado em modo preview
- [ ] Testado em modo production
- [ ] Testado com dados vazios
- [ ] Testado sem callbacks
- [ ] Testado em mobile
- [ ] Testado navegação anterior/próxima

---

## 🧪 TESTANDO SEU NOVO STEP

### Teste Manual Rápido

1. **Iniciar servidor:**
```bash
npm run dev
```

2. **Acessar rota:**
```
http://localhost:8080/quiz-estilo
```

3. **Verificar console:**
```javascript
// Deve aparecer:
🔍 [UnifiedStepRenderer] stepId: step-00
✅ [V3.0 DETECTED] Usando V3Renderer para step-00
[WelcomeStep] Avançando
```

4. **Testar interações:**
- [ ] Página carrega corretamente
- [ ] Imagem aparece
- [ ] Textos estão corretos
- [ ] Checkbox funciona
- [ ] Botão só ativa após checkbox
- [ ] Botão avança para próximo step
- [ ] Animações funcionam (se configuradas)

### Teste com Dados Vazios

Temporariamente modifique o adapter para testar fallbacks:

```tsx
const adaptedProps = {
    data: null, // ← Forçar dados vazios
    onContinue: () => onNext(),
};
```

Verificar:
- [ ] Não quebra a aplicação
- [ ] Mostra dados padrão
- [ ] Ainda é funcional

### Teste de Navegação

```bash
# No console do navegador:
window.__quizState__ = {
    currentStep: 'step-00'
};
```

Verificar:
- [ ] Step renderiza corretamente
- [ ] Avança para step-01
- [ ] Estado persiste

---

## 🐛 TROUBLESHOOTING

### Problema: "Component not found"

**Erro:**
```
Error: Cannot find module '@/components/quiz/WelcomeStep'
```

**Solução:**
1. Verificar se arquivo foi criado no caminho correto
2. Verificar nome do arquivo (case-sensitive)
3. Verificar export default
4. Reiniciar servidor dev

---

### Problema: "onContinue is not a function"

**Erro:**
```
⚠️ [WelcomeStep] onContinue não fornecido
```

**Solução:**
1. Verificar adapter está conectando callback
2. Verificar UnifiedStepRenderer passa onNext
3. Adicionar fallback no componente:
```tsx
const handleContinue = () => {
    if (typeof onContinue === 'function') {
        onContinue();
    } else {
        console.warn('Callback não fornecido, usando navegação manual');
        window.location.href = '/quiz-estilo?step=step-01';
    }
};
```

---

### Problema: "Data is undefined"

**Erro:**
```
Cannot read property 'title' of undefined
```

**Solução:**
1. Verificar fallback de dados:
```tsx
const safeData = data || {
    type: 'welcome',
    title: 'Título Padrão',
    // ... outros campos
};
```

2. Verificar QUIZ_STEPS tem o step:
```tsx
console.log(QUIZ_STEPS['step-00']); // Deve existir
```

---

### Problema: "Step não renderiza"

**Possíveis causas:**

1. **Lazy loading não configurado:**
```tsx
// Adicionar em LazyStepComponents
'step-00': lazy(() => import('...'))
```

2. **Step não registrado:**
```tsx
// Adicionar em registerProductionSteps()
stepRegistry.register('step-00', WelcomeStepAdapter, {...});
```

3. **STEP_ORDER desatualizado:**
```tsx
export const STEP_ORDER = [
    'step-00', // ← Deve estar aqui
    'step-01',
    // ...
];
```

---

## 📚 TEMPLATES PRONTOS

### Template Minimalista

```tsx
'use client';
import React from 'react';
import type { QuizStep } from '../../data/quizSteps';

interface MyStepProps {
    data: QuizStep;
    onComplete?: () => void;
}

export default function MyStep({ data, onComplete }: MyStepProps) {
    const safeData = data || { type: 'mystep', title: 'Título' };
    
    return (
        <main className="min-h-screen p-8">
            <h1>{safeData.title}</h1>
            <button onClick={onComplete}>
                Continuar
            </button>
        </main>
    );
}
```

### Template com Form

```tsx
'use client';
import React, { useState } from 'react';
import type { QuizStep } from '../../data/quizSteps';

interface FormStepProps {
    data: QuizStep;
    onSubmit?: (formData: Record<string, any>) => void;
}

export default function FormStep({ data, onSubmit }: FormStepProps) {
    const [formData, setFormData] = useState({});
    const safeData = data || { type: 'form', fields: [] };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof onSubmit === 'function') {
            onSubmit(formData);
        }
    };
    
    return (
        <main className="min-h-screen p-8">
            <form onSubmit={handleSubmit}>
                {safeData.fields?.map(field => (
                    <input
                        key={field.name}
                        type={field.type}
                        placeholder={field.label}
                        onChange={(e) => setFormData({
                            ...formData,
                            [field.name]: e.target.value
                        })}
                    />
                ))}
                <button type="submit">Enviar</button>
            </form>
        </main>
    );
}
```

### Template com Múltiplas Escolhas

```tsx
'use client';
import React, { useState } from 'react';
import type { QuizStep } from '../../data/quizSteps';

interface ChoiceStepProps {
    data: QuizStep;
    onChoice?: (choices: string[]) => void;
}

export default function ChoiceStep({ data, onChoice }: ChoiceStepProps) {
    const [selected, setSelected] = useState<string[]>([]);
    const safeData = data || { type: 'choice', options: [] };
    
    const toggleChoice = (id: string) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };
    
    const handleContinue = () => {
        if (typeof onChoice === 'function') {
            onChoice(selected);
        }
    };
    
    return (
        <main className="min-h-screen p-8">
            <h1>{safeData.title}</h1>
            <div className="space-y-4">
                {safeData.options?.map(option => (
                    <button
                        key={option.id}
                        onClick={() => toggleChoice(option.id)}
                        className={selected.includes(option.id) ? 'active' : ''}
                    >
                        {option.text}
                    </button>
                ))}
            </div>
            <button 
                onClick={handleContinue}
                disabled={selected.length === 0}
            >
                Continuar
            </button>
        </main>
    );
}
```

---

## 🎨 DESIGN SYSTEM

### Cores Padrão (Gisele Galvão)

```tsx
const DESIGN_TOKENS = {
    colors: {
        primary: '#B89B7A',      // Dourado principal
        secondary: '#A1835D',    // Dourado escuro
        text: '#432818',         // Marrom texto
        background: '#FAF9F7',   // Off-white
        surface: '#FEFEFE',      // Branco puro
        accent: '#deac6d',       // Dourado claro
        error: '#DC2626',        // Vermelho
        success: '#16A34A',      // Verde
    },
    fonts: {
        heading: '"Playfair Display", serif',
        body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    spacing: {
        xs: '0.5rem',  // 8px
        sm: '1rem',    // 16px
        md: '1.5rem',  // 24px
        lg: '2rem',    // 32px
        xl: '3rem',    // 48px
    },
    borderRadius: {
        sm: '0.375rem',  // 6px
        md: '0.5rem',    // 8px
        lg: '0.75rem',   // 12px
        xl: '1rem',      // 16px
    },
};
```

### Classes Tailwind Recomendadas

```tsx
// Container
className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto px-4"

// Título
className="text-2xl sm:text-3xl md:text-4xl font-bold text-center"
style={{ fontFamily: '"Playfair Display", serif', color: '#B89B7A' }}

// Texto
className="text-sm sm:text-base md:text-lg text-center leading-relaxed"

// Botão
className="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300"
style={{ backgroundColor: '#B89B7A', color: '#fff' }}

// Input
className="w-full p-2.5 rounded-md border-2 border-[#B89B7A] focus:ring-2"

// Card
className="bg-white rounded-xl shadow-lg p-6"
```

---

## 🚀 PRÓXIMOS PASSOS

Depois de criar seu componente:

1. **Testar Extensivamente**
   - [ ] Teste em dev
   - [ ] Teste em preview
   - [ ] Teste em produção
   - [ ] Teste em mobile

2. **Otimizar Performance**
   - [ ] Lazy loading configurado
   - [ ] Imagens otimizadas
   - [ ] Memoization onde necessário
   - [ ] Bundle size verificado

3. **Documentar**
   - [ ] Adicionar JSDoc
   - [ ] Exemplos de uso
   - [ ] Props documentadas
   - [ ] Edge cases listados

4. **Integrar com Analytics**
   - [ ] Track page view
   - [ ] Track interactions
   - [ ] Track completion time

5. **A/B Testing** (Opcional)
   - [ ] Variantes de copy
   - [ ] Variantes de layout
   - [ ] Variantes de CTA

---

## 📖 RECURSOS ADICIONAIS

### Documentação do Projeto
- `FLUXO_RENDERIZACAO_COMPONENTES.md` - Como componentes são renderizados
- `ANALISE_COMPLETA_PROJETO.md` - Visão geral do projeto
- `QUICK_START.md` - Guia rápido para iniciantes
- `DEPRECATED.md` - O que NÃO usar

### Exemplos Existentes
- `src/components/quiz/IntroStep.tsx` - Step de introdução
- `src/components/quiz/QuestionStep.tsx` - Step de pergunta
- `src/components/quiz/ResultStep.tsx` - Step de resultado
- `src/components/quiz/WelcomeStep.tsx` - Step de boas-vindas (NOVO)

### Ferramentas
- React DevTools - Debug de componentes
- Redux DevTools - Debug de estado (se usar)
- Lighthouse - Audit de performance
- Wave - Audit de acessibilidade

---

## 🎓 CONCLUSÃO

Você agora sabe como:
- ✅ Criar um componente step do zero
- ✅ Seguir o padrão do IntroStep
- ✅ Integrar com o sistema unificado
- ✅ Adicionar dados e configuração
- ✅ Testar e validar
- ✅ Resolver problemas comuns

**Dica Final:** Sempre comece com um template simples e adicione complexidade gradualmente. Use o IntroStep como referência, mas não tenha medo de inovar!

---

**Última atualização:** 16 de Outubro de 2025  
**Próxima revisão:** Conforme necessário

**Dúvidas?** Consulte os documentos de referência ou o código existente!
