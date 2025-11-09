# 📋 Plano de Modularização Completa - Steps 1-21

## 🎯 Objetivo

Transformar **TODOS os 21 steps** do quiz em componentes modulares, independentes, reutilizáveis e responsivos usando a arquitetura **v3.0 baseada em Sections**.

---

## 📊 Status Atual

### Inventário de Templates

```
Total de templates: 23 arquivos JSON
├── 20 templates v2.0/v2.1 (blocks-based) ❌
├── 1 template v3.0 (sections-based) ✅ step-20-v3.json
└── 2 templates legados (análise pendente)
```

### Análise dos Formatos

**v2.0/v2.1 (Atual - 20 templates):**
- Estrutura: `blocks[]` array com componentes inline
- Tipos: 15+ block types (text-inline, button-inline, options-grid, lead-form, etc)
- Layout: containerWidth, spacing por bloco
- Validação: Por step (required, minAnswers, maxAnswers)
- Problema: ❌ Não modular, difícil reutilizar, acoplado

**v3.0 (Novo - 1 template):**
- Estrutura: `sections[]` array com componentes semânticos
- Tipos: 11 section types (Hero, CTA, Offer, SocialProof, etc)
- Layout: Global theme + section overrides
- Validação: Schema unificado
- Vantagem: ✅ Modular, reutilizável, desacoplado, responsivo

---

## 🏗️ Arquitetura da Modularização

### 1. Categorização dos Steps

| Categoria | Steps | Seções Necessárias | Prioridade |
|-----------|-------|-------------------|------------|
| **Intro** | 1 | IntroHero, WelcomeForm, NameInput | 🔴 ALTA |
| **Questions** | 2-11 | QuestionHero, OptionsGrid, Progress, ValidationMessage | 🔴 ALTA |
| **Transition** | 12, 19 | TransitionHero, LoadingAnimation, Message | 🟡 MÉDIA |
| **Strategic** | 13-18 | StrategyQuestionHero, OptionsGrid, Insights | 🟡 MÉDIA |
| **Result** | 20 | ✅ JÁ IMPLEMENTADO (11 sections) | ✅ COMPLETO |
| **Offer** | 21 | OfferHero, ProductDetails, Pricing, Guarantee, CTA | 🟢 BAIXA |

### 2. Biblioteca de Seções (Section Library)

#### 2.1. Seções de Introdução
```typescript
// IntroSections.tsx
export const IntroHeroSection: React.FC<IntroHeroProps>
export const WelcomeFormSection: React.FC<WelcomeFormProps>
export const NameInputSection: React.FC<NameInputProps>
export const IntroMessageSection: React.FC<IntroMessageProps>
```

#### 2.2. Seções de Perguntas
```typescript
// QuestionSections.tsx
export const QuestionHeroSection: React.FC<QuestionHeroProps>
export const OptionsGridSection: React.FC<OptionsGridProps>
export const ProgressIndicatorSection: React.FC<ProgressProps>
export const ValidationMessageSection: React.FC<ValidationProps>
export const QuestionImageSection: React.FC<QuestionImageProps>
```

#### 2.3. Seções de Transição
```typescript
// TransitionSections.tsx
export const TransitionHeroSection: React.FC<TransitionHeroProps>
export const LoadingAnimationSection: React.FC<LoadingAnimationProps>
export const MessageSection: React.FC<MessageProps>
export const ProgressAnimationSection: React.FC<ProgressAnimationProps>
```

#### 2.4. Seções de Resultado (✅ Já existem)
```typescript
// ResultSections.tsx (src/components/sections/result/)
// ✅ 11 sections já implementadas:
// Hero, StyleProfile, CTA, Transformation, MethodSteps, 
// Bonus, SocialProof, Offer, Guarantee, FAQ, Footer
```

#### 2.5. Seções de Oferta
```typescript
// OfferSections.tsx
export const OfferHeroSection: React.FC<OfferHeroProps>
export const ProductDetailsSection: React.FC<ProductDetailsProps>
export const PricingSection: React.FC<PricingProps>
export const GuaranteeSection: React.FC<GuaranteeProps>
export const FeaturesListSection: React.FC<FeaturesListProps>
export const CTAButtonSection: React.FC<CTAProps>
```

### 3. Sistema de Design Unificado

#### 3.1. Tokens de Design
```typescript
// design-tokens.ts
export const DesignTokens = {
  colors: {
    primary: '#B89B7A',
    secondary: '#432818',
    background: '#FAF9F7',
    text: '#1F2937',
    border: '#E5E7EB',
    hover: '#F3E8D3'
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Inter', sans-serif"
  },
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48
  },
  borderRadius: {
    sm: 4, md: 8, lg: 12, xl: 16
  },
  breakpoints: {
    mobile: 320, tablet: 768, desktop: 1024, wide: 1280
  }
}
```

#### 3.2. Componentes Responsivos
```typescript
// ResponsiveWrapper.tsx
export const ResponsiveSection: React.FC<{
  mobile: ReactNode;
  tablet?: ReactNode;
  desktop?: ReactNode;
}>

// useResponsive.ts
export const useResponsive = () => ({
  isMobile: boolean,
  isTablet: boolean,
  isDesktop: boolean,
  currentBreakpoint: string
})
```

---

## 📝 Plano de Implementação

### Fase 1: Infraestrutura (4-6h) 🔴 CRÍTICA

#### 1.1. Criar Biblioteca de Seções Base (2h)
```bash
src/components/sections/
├── intro/
│   ├── IntroHeroSection.tsx
│   ├── WelcomeFormSection.tsx
│   ├── NameInputSection.tsx
│   └── index.ts
├── questions/
│   ├── QuestionHeroSection.tsx
│   ├── OptionsGridSection.tsx
│   ├── ProgressIndicatorSection.tsx
│   ├── ValidationMessageSection.tsx
│   └── index.ts
├── transitions/
│   ├── TransitionHeroSection.tsx
│   ├── LoadingAnimationSection.tsx
│   ├── MessageSection.tsx
│   └── index.ts
├── result/ ✅ (JÁ EXISTE)
│   └── [11 sections implementadas]
├── offer/
│   ├── OfferHeroSection.tsx
│   ├── ProductDetailsSection.tsx
│   ├── PricingSection.tsx
│   ├── GuaranteeSection.tsx
│   └── index.ts
└── shared/
    ├── ResponsiveWrapper.tsx
    ├── SectionContainer.tsx
    └── AnimatedTransition.tsx
```

**Arquivos a criar:**
1. `src/components/sections/intro/` (4 componentes)
2. `src/components/sections/questions/` (5 componentes)
3. `src/components/sections/transitions/` (4 componentes)
4. `src/components/sections/offer/` (5 componentes)
5. `src/components/sections/shared/` (3 utilitários)

#### 1.2. Sistema de Design Unificado (1h)
```bash
src/styles/
├── design-tokens.ts
├── theme-provider.tsx
└── responsive-utilities.ts
```

#### 1.3. Hooks e Utilitários (1h)
```bash
src/hooks/
├── useResponsive.ts
├── useSectionAnalytics.ts
└── useSectionValidation.ts
```

#### 1.4. Tipos e Interfaces (1h)
```bash
src/types/
├── section-types.ts (base interfaces)
├── intro-section-types.ts
├── question-section-types.ts
├── transition-section-types.ts
└── offer-section-types.ts
```

---

### Fase 2: Templates v3.0 (8-12h) 🔴 CRÍTICA

#### 2.1. Step 01 - Introdução (1h)
**Estrutura v3.0:**
```json
{
  "templateVersion": "3.0",
  "metadata": {
    "id": "step-01-intro-v3",
    "category": "intro"
  },
  "theme": {
    "colors": { "primary": "#B89B7A", "secondary": "#432818" },
    "fonts": { "heading": "Playfair Display", "body": "Inter" }
  },
  "sections": [
    {
      "type": "intro-hero",
      "id": "intro-hero-01",
      "content": {
        "logoUrl": "...",
        "title": "Chega de um guarda-roupa lotado...",
        "subtitle": "Descubra seu ESTILO PREDOMINANTE"
      }
    },
    {
      "type": "welcome-form",
      "id": "intro-form-01",
      "content": {
        "nameLabel": "Como posso te chamar?",
        "namePlaceholder": "Digite seu primeiro nome aqui...",
        "submitText": "Quero Descobrir meu Estilo Agora!"
      }
    }
  ],
  "validation": {
    "required": ["userName"],
    "rules": { "userName": { "minLength": 2 } }
  }
}
```

#### 2.2. Steps 02-11 - Perguntas (6h)
**Estrutura v3.0 (exemplo step-02):**
```json
{
  "templateVersion": "3.0",
  "metadata": {
    "id": "step-02-question-v3",
    "category": "quiz-question",
    "questionNumber": 1,
    "totalQuestions": 13
  },
  "theme": { /* design system */ },
  "sections": [
    {
      "type": "question-hero",
      "id": "question-hero-02",
      "content": {
        "title": "Q1 - ROUPA FAVORITA",
        "subtitle": "Questão 1 de 13",
        "progressValue": 10
      }
    },
    {
      "type": "options-grid",
      "id": "options-grid-02",
      "content": {
        "options": [
          {
            "id": "2a",
            "imageUrl": "...",
            "text": "Opção A",
            "category": "Natural",
            "points": 1
          }
          // ... 3 more options
        ],
        "columns": 2,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3
      }
    },
    {
      "type": "validation-message",
      "id": "validation-02",
      "content": {
        "message": "Selecione 3 opções para continuar",
        "type": "info"
      }
    }
  ],
  "validation": {
    "required": ["selectedOptions"],
    "rules": {
      "selectedOptions": {
        "minItems": 3,
        "maxItems": 3
      }
    }
  }
}
```

**Passos:**
1. Criar `step-02-v3.json` (Q1)
2. Criar `step-03-v3.json` (Q2)
3. Criar `step-04-v3.json` (Q3)
4. ... até `step-11-v3.json` (Q10)

#### 2.3. Steps 12, 19 - Transições (2h)
**Estrutura v3.0:**
```json
{
  "templateVersion": "3.0",
  "metadata": {
    "id": "step-12-transition-v3",
    "category": "transition"
  },
  "sections": [
    {
      "type": "transition-hero",
      "id": "transition-hero-12",
      "content": {
        "title": "Analisando suas respostas...",
        "subtitle": "Preparando sua jornada personalizada"
      }
    },
    {
      "type": "loading-animation",
      "id": "loading-12",
      "content": {
        "animationType": "pulse",
        "duration": 3000
      }
    },
    {
      "type": "message",
      "id": "message-12",
      "content": {
        "text": "Estamos quase lá! Continue para descobrir mais sobre você.",
        "type": "encouragement"
      }
    }
  ]
}
```

#### 2.4. Steps 13-18 - Perguntas Estratégicas (3h)
Similar ao 2.2, mas com seções de insights adicionais.

#### 2.5. Step 20 - Resultado ✅ (JÁ FEITO)
- Template: `step-20-v3.json`
- Componente: `V3Renderer.tsx`
- Status: ✅ Em produção

#### 2.6. Step 21 - Oferta (1h)
**Estrutura v3.0:**
```json
{
  "templateVersion": "3.0",
  "metadata": {
    "id": "step-21-offer-v3",
    "category": "offer"
  },
  "offer": {
    "productName": "5 Passos – Vista-se de Você",
    "pricing": {
      "originalPrice": 447.00,
      "salePrice": 97.00,
      "installments": { "count": 8, "value": 14.11 }
    }
  },
  "sections": [
    {
      "type": "offer-hero",
      "content": { "title": "Transforme seu guarda-roupa hoje!" }
    },
    {
      "type": "product-details",
      "content": { "features": [...] }
    },
    {
      "type": "pricing",
      "content": { "pricing": { /* from offer */ } }
    },
    {
      "type": "guarantee",
      "content": { "days": 7, "description": "..." }
    },
    {
      "type": "cta",
      "content": { "text": "Quero Transformar Meu Estilo Agora!", "url": "..." }
    }
  ]
}
```

---

### Fase 3: Integração e Testes (4-6h) 🟡 IMPORTANTE

#### 3.1. Atualizar Template Generator (1h)
```typescript
// scripts/generate-templates.ts
// ✅ JÁ SUPORTA v3.0, mas precisa validar novas sections

// Adicionar validação para novos section types:
const VALID_SECTION_TYPES_V3 = [
  // Result sections (existentes)
  'hero', 'style-profile', 'cta', 'transformation', 'method-steps',
  'bonus', 'social-proof', 'offer', 'guarantee', 'faq', 'footer',
  
  // Intro sections (NOVOS)
  'intro-hero', 'welcome-form', 'name-input', 'intro-message',
  
  // Question sections (NOVOS)
  'question-hero', 'options-grid', 'progress-indicator', 
  'validation-message', 'question-image',
  
  // Transition sections (NOVOS)
  'transition-hero', 'loading-animation', 'message', 'progress-animation',
  
  // Offer sections (NOVOS)
  'offer-hero', 'product-details', 'pricing', 'features-list'
];
```

#### 3.2. Regenerar quiz21StepsComplete.ts (30min)
```bash
npm run generate-templates
# Output: quiz21StepsComplete.ts com todos os 21 templates v3.0
```

#### 3.3. Atualizar V3Renderer (2h)
```typescript
// src/components/core/V3Renderer.tsx
// Adicionar lazy loading para novos section types

const IntroSections = lazy(() => import('../sections/intro'));
const QuestionSections = lazy(() => import('../sections/questions'));
const TransitionSections = lazy(() => import('../sections/transitions'));
const OfferSections = lazy(() => import('../sections/offer'));

// Atualizar renderSection() para mapear novos types
const renderSection = (section: TemplateSection) => {
  switch (section.type) {
    // Result sections (existentes)
    case 'hero': return <HeroSection {...section} />;
    // ... 10 more
    
    // Intro sections (NOVOS)
    case 'intro-hero': return <IntroHeroSection {...section} />;
    case 'welcome-form': return <WelcomeFormSection {...section} />;
    case 'name-input': return <NameInputSection {...section} />;
    
    // Question sections (NOVOS)
    case 'question-hero': return <QuestionHeroSection {...section} />;
    case 'options-grid': return <OptionsGridSection {...section} />;
    case 'progress-indicator': return <ProgressIndicatorSection {...section} />;
    
    // Transition sections (NOVOS)
    case 'transition-hero': return <TransitionHeroSection {...section} />;
    case 'loading-animation': return <LoadingAnimationSection {...section} />;
    
    // Offer sections (NOVOS)
    case 'offer-hero': return <OfferHeroSection {...section} />;
    case 'pricing': return <PricingSection {...section} />;
    // ... etc
  }
};
```

#### 3.4. Testes Progressivos (2h)
```bash
# Testar step por step em desenvolvimento
1. Step 01 (intro) → Validar form + navegação
2. Step 02 (primeira pergunta) → Validar seleção + progresso
3. Step 12 (transição) → Validar animação + auto-advance
4. Step 20 (resultado) ✅ → Já validado
5. Step 21 (oferta) → Validar CTA + links

# Verificar:
- ✅ Responsividade (mobile, tablet, desktop)
- ✅ Validação de inputs
- ✅ Navegação entre steps
- ✅ Analytics (GA4 + FB Pixel)
- ✅ Loading states
- ✅ Error boundaries
```

---

### Fase 4: Editor Support (6-8h) 🟢 FUTURA

#### 4.1. Atualizar PropertiesPanel (3h)
```typescript
// src/components/editor/unified/PropertiesPanel.tsx
// Adicionar suporte para edição de sections v3.0

// Detectar se template é v3.0:
const isV3Template = currentTemplate?.templateVersion === '3.0';

// Renderizar painel apropriado:
{isV3Template ? (
  <V3SectionPropertiesPanel 
    sections={currentTemplate.sections}
    onUpdate={handleUpdateSection}
  />
) : (
  <BlockPropertiesPanel 
    blocks={currentTemplate.blocks}
    onUpdate={handleUpdateBlock}
  />
)}
```

#### 4.2. Criar V3SectionPropertiesPanel (2h)
```typescript
// src/components/editor/v3/V3SectionPropertiesPanel.tsx
export const V3SectionPropertiesPanel: React.FC<{
  sections: TemplateSection[];
  onUpdate: (sectionId: string, updates: Partial<TemplateSection>) => void;
}> = ({ sections, onUpdate }) => {
  // Renderizar formulário de edição para cada section type
  // - IntroHero: editar title, subtitle, logo
  // - OptionsGrid: editar options[], columns, validation
  // - Pricing: editar prices, installments
  // etc
};
```

#### 4.3. Section Picker (1h)
```typescript
// src/components/editor/v3/SectionPicker.tsx
// Permitir adicionar/remover/reordenar sections

<SectionPicker
  availableSections={AVAILABLE_SECTIONS_BY_CATEGORY[currentCategory]}
  onAddSection={(type) => handleAddSection(type)}
  onRemoveSection={(id) => handleRemoveSection(id)}
  onReorderSections={(newOrder) => handleReorder(newOrder)}
/>
```

#### 4.4. Testes do Editor (2h)
- Criar template v3.0 do zero
- Editar sections existentes
- Adicionar/remover sections
- Reordenar sections
- Salvar e visualizar

---

### Fase 5: Deploy e Rollout (2-3h) 🟢 FINAL

#### 5.1. Estratégia de Deploy Progressivo
```
Etapa 1 (Semana 1): Steps 1, 2, 20 ✅
├── Step 01: Intro (ponto de entrada)
├── Step 02: Primeira pergunta (validação de UX)
└── Step 20: Resultado (já em produção)

Etapa 2 (Semana 2): Steps 3-11 (perguntas)
├── Steps 03-06: Perguntas 2-5
└── Steps 07-11: Perguntas 6-10

Etapa 3 (Semana 3): Steps 12-19 (transições + estratégicas)
├── Step 12: Transição mid-quiz
├── Steps 13-18: Perguntas estratégicas
└── Step 19: Transição pré-resultado

Etapa 4 (Semana 4): Step 21 (oferta)
└── Step 21: Página de oferta final
```

#### 5.2. Monitoramento
```typescript
// analytics/v3-rollout-tracking.ts
export const trackV3Adoption = () => {
  // Métricas por step:
  // - % users que veem v3.0 vs v2.0
  // - Bounce rate por step
  // - Time on page
  // - Conversion rate
  // - Error rate
};
```

#### 5.3. Rollback Plan
```typescript
// Feature flag para reverter se necessário
const ENABLE_V3_STEPS = {
  step01: process.env.ENABLE_V3_STEP_01 === 'true',
  step02: process.env.ENABLE_V3_STEP_02 === 'true',
  // ... etc
};

// No UnifiedStepRenderer:
const shouldUseV3 = (stepNum: number) => {
  const stepKey = `step${stepNum.toString().padStart(2, '0')}`;
  return ENABLE_V3_STEPS[stepKey] && templateVersion === '3.0';
};
```

---

## 📊 Estimativa de Tempo

| Fase | Descrição | Tempo Estimado | Prioridade |
|------|-----------|----------------|------------|
| **1** | Infraestrutura (sections library) | 4-6h | 🔴 CRÍTICA |
| **2** | Templates v3.0 (21 templates) | 8-12h | 🔴 CRÍTICA |
| **3** | Integração e Testes | 4-6h | 🟡 IMPORTANTE |
| **4** | Editor Support | 6-8h | 🟢 FUTURA |
| **5** | Deploy e Rollout | 2-3h | 🟢 FINAL |
| **TOTAL** | | **24-35h** | |

### Distribuição Semanal (Sugerida)
```
Semana 1 (Sprint 1): Fases 1-2 ✅ Fundação
├── Criar section library (6h)
├── Templates intro + questions (8h)
└── Testes iniciais (2h)

Semana 2 (Sprint 2): Fase 2-3 ✅ Implementação
├── Templates transitions + offer (4h)
├── Integração V3Renderer (2h)
├── Template generator (1h)
└── Testes completos (2h)

Semana 3 (Sprint 3): Fase 4 🟢 Editor
├── PropertiesPanel v3.0 (3h)
├── V3SectionPropertiesPanel (2h)
├── Section Picker (1h)
└── Testes editor (2h)

Semana 4 (Sprint 4): Fase 5 🟢 Deploy
├── Deploy progressivo (2h)
├── Monitoramento (1h)
└── Ajustes finais (2h)
```

---

## 🎯 Critérios de Sucesso

### Funcionalidade ✅
- [x] Step 20 v3.0 funcionando (FEITO)
- [ ] Todos os 21 steps em v3.0
- [ ] Navegação entre steps fluida
- [ ] Validação funcionando em todos steps
- [ ] Analytics tracking completo

### Performance ⚡
- [ ] Lazy loading de sections
- [ ] Bundle size < 500KB por step
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse Score > 90

### UX/UI 🎨
- [ ] Design consistente (design tokens)
- [ ] Responsivo (mobile, tablet, desktop)
- [ ] Animações suaves (transitions)
- [ ] Loading states claros
- [ ] Error handling amigável

### Manutenibilidade 🛠️
- [ ] Código modular e reutilizável
- [ ] TypeScript sem erros
- [ ] Documentação completa
- [ ] Testes unitários (opcional)
- [ ] Editor funcional para v3.0

---

## 🚀 Próximos Passos Imediatos

### Opção A: Full Speed (Recomendado) 🔥
Implementar Fases 1-3 de uma vez (16-24h):
1. ✅ **AGORA**: Criar section library completa
2. ✅ **DEPOIS**: Gerar todos 21 templates v3.0
3. ✅ **FIM**: Integrar e testar tudo

**Vantagens:**
- Modularização completa em 1 semana
- Consistência garantida
- Momentum mantido

**Desvantagens:**
- Requer foco intenso
- Mais arriscado (muitas mudanças)

### Opção B: Progressive (Seguro) 🐢
Implementar step-by-step:
1. ✅ Fase 1 (section library)
2. ✅ Step 01 v3.0
3. ✅ Testar em produção
4. ✅ Step 02 v3.0
5. ... repetir até step 21

**Vantagens:**
- Menos risco
- Feedback rápido
- Rollback fácil

**Desvantagens:**
- Mais lento (3-4 semanas)
- Possível inconsistência temporária

---

## ❓ Decisão Necessária

**Qual abordagem você prefere?**

1. **Opção A - Full Speed** 🔥
   - Implementar tudo de uma vez (Fases 1-3)
   - Prioridade: Steps 1, 2-11, 12, 19, 21 (20 já feito)
   - Tempo: 16-24h concentradas

2. **Opção B - Progressive** 🐢
   - Implementar step-by-step
   - Prioridade: 01 → 02 → 03 → ... → 21
   - Tempo: 3-4 semanas, 2-3h/dia

**Por favor, confirme:**
- [ ] Qual opção prefere? (A ou B)
- [ ] Posso começar pela Fase 1 (section library)? 
- [ ] Alguma seção específica tem prioridade?

---

## 📚 Documentação Relacionada

- [PLANO_MIGRACAO_V3_IMPLEMENTACAO.md](./PLANO_MIGRACAO_V3_IMPLEMENTACAO.md) - Plano original v3.0
- [FASE_1_6_INTEGRACAO_PRODUCAO.md](./FASE_1_6_INTEGRACAO_PRODUCAO.md) - Integração UnifiedStepRenderer
- [PROGRESSO_MIGRACAO_V3.md](./PROGRESSO_MIGRACAO_V3.md) - Tracking de progresso
- [ANALISE_COMPLETA_JSON_V3.md](./ANALISE_COMPLETA_JSON_V3.md) - Análise v2.1 vs v3.0

---

**Última atualização:** 2025-01-XX
**Status:** 🟡 Aguardando confirmação para início
**Progresso:** 5% (1/21 steps completos)
