# 🚀 PLANO DE IMPLEMENTAÇÃO - MIGRAÇÃO JSON v3.0

**Data:** 2025-10-12  
**Status:** 🟢 INICIALIZANDO  
**Estratégia:** HÍBRIDA (v2.0 para perguntas + v3.0 para conversão)

---

## 📋 ÍNDICE

1. [Status Atual](#status-atual)
2. [Estratégia de Migração](#estratégia-de-migração)
3. [Roadmap de Implementação](#roadmap-de-implementação)
4. [Fases Detalhadas](#fases-detalhadas)
5. [Testes e Validação](#testes-e-validação)
6. [Rollback Plan](#rollback-plan)

---

## ✅ STATUS ATUAL

### **O Que JÁ EXISTE** ✅

#### **1. Types e Adaptadores (100% completo)**
- ✅ `/src/types/template-v3.types.ts` (658 linhas)
  - TemplateV3, MetadataV3, OfferSystem, ThemeSystem
  - 10 Section types com props específicas
  - Utility types (UserData, CSSVariables)
  
- ✅ `/src/adapters/TemplateAdapter.ts` (465 linhas)
  - Detecção automática de versão (v2.0, v3.0)
  - Validação de estrutura
  - Compatibilidade entre versões

#### **2. Template JSON v3.0 (100% completo)**
- ✅ `/templates/step-20-v3.json` (548 linhas)
  - Metadata expandido (author, timestamps)
  - Sistema de ofertas completo (pricing, guarantee, features)
  - Design system (7 cores, fontes, spacing, borderRadius)
  - 11 sections configuradas
  - Validation rules
  - Analytics avançado (9 eventos + pixels)

#### **3. Renderizadores de Sections (100% completo)** ✅

**Estrutura:**
```
/src/components/sections/
├── SectionRenderer.tsx          ✅ (350 linhas) - Router principal
├── HeroSection.tsx              ✅ - Celebração + estilo
├── StyleProfileSection.tsx      ✅ - Perfil completo (mais complexo)
├── CTAButton.tsx                ✅ - Botões de conversão
├── TransformationSection.tsx    ✅ - Benefícios
├── MethodStepsSection.tsx       ✅ - 5 passos do método
├── BonusSection.tsx             ✅ - Bônus exclusivos
├── SocialProofSection.tsx       ✅ - Depoimentos
├── OfferSection.tsx             ✅ - Preço e oferta
└── GuaranteeSection.tsx         ✅ - Garantia
```

**Features Implementadas:**
- ✅ Lazy loading de sections (code splitting)
- ✅ Error boundaries por section
- ✅ Skeleton loaders
- ✅ Intersection Observer para analytics
- ✅ CSS variables do theme
- ✅ Props typesafe
- ✅ Ordenação dinâmica
- ✅ Enable/disable sections

#### **4. Container de Sections (100% completo)** ✅
- ✅ `SectionsContainer` component
  - Filtra sections habilitadas
  - Ordena por prop `order`
  - Injeta CSS variables do theme
  - Tracking de visualizações

---

## ❌ O QUE FALTA IMPLEMENTAR

### **1. Integração com Sistema de Quiz** ⚠️
- ❌ Conectar v3.0 ao `QuizRenderer`
- ❌ Passar dados do quiz para sections
- ❌ Roteamento step 20 → v3.0 renderer

### **2. Editor Support** ⚠️
- ❌ Painel de propriedades para sections
- ❌ Drag & drop de sections
- ❌ Preview em tempo real
- ❌ Validação visual

### **3. Templates Adicionais** ⚠️
- ✅ step-20-v3.json (resultado)
- ❌ step-21-v3.json (thank you / upsell)
- ❌ landing-page-v3.json (captura)

### **4. Migração de Dados** ⚠️
- ❌ Script de conversão v2.0 → v3.0
- ❌ Ferramenta de migração no editor
- ❌ Validação de migração

### **5. Testes** ⚠️
- ❌ Unit tests para sections
- ❌ Integration tests
- ❌ E2E tests de conversão
- ❌ Visual regression tests

### **6. Documentação** ⚠️
- ✅ Análise completa JSON v3.0
- ❌ Guia do desenvolvedor
- ❌ Exemplos de uso
- ❌ API reference

---

## 🎯 ESTRATÉGIA DE MIGRAÇÃO

### **ABORDAGEM HÍBRIDA RECOMENDADA**

```
┌─────────────────────────────────────────┐
│  QUIZ FLOW (21 steps)                   │
├─────────────────────────────────────────┤
│  Steps 1-19: v2.0 (perguntas simples)   │  ← NÃO MIGRAR
│    - Blocos lineares                    │
│    - Templates leves (~95 linhas)       │
│    - Mantém simplicidade                │
├─────────────────────────────────────────┤
│  Step 20: v3.0 (resultado + oferta)     │  ← MIGRAR (FASE 1)
│    - Sections componíveis               │
│    - Sistema de ofertas                 │
│    - Analytics avançado                 │
├─────────────────────────────────────────┤
│  Step 21: v3.0 (thank you / upsell)     │  ← CRIAR (FASE 2)
│    - Confirmação de compra              │
│    - Upsell adicional                   │
│    - Next steps                         │
└─────────────────────────────────────────┘
```

### **Por Que Híbrida?**

| Critério | v2.0 (Perguntas) | v3.0 (Conversão) |
|----------|------------------|------------------|
| **Complexidade** | Baixa (ideal) | Alta (necessária) |
| **Tamanho** | ~95 linhas | ~548 linhas |
| **Performance** | Rápida | Code splitting |
| **Customização** | Limitada (suficiente) | Extensa (necessária) |
| **Ofertas** | Não precisa | Essencial |
| **Analytics** | Básico | Avançado |
| **Manutenção** | Simples | Complexa |

**Conclusão:** Use a ferramenta certa para o trabalho certo.

---

## 🗺️ ROADMAP DE IMPLEMENTAÇÃO

### **📅 TIMELINE ESTIMADO: 4-6 SEMANAS**

```
Semana 1-2: Fase 1 (Integração Básica)
Semana 2-3: Fase 2 (Templates Adicionais)
Semana 3-4: Fase 3 (Editor Support)
Semana 4-5: Fase 4 (Testes e QA)
Semana 5-6: Fase 5 (Deploy e Monitoramento)
```

---

## 📊 FASES DETALHADAS

### **FASE 1: INTEGRAÇÃO BÁSICA (Semana 1-2)** 🔴 PRIORIDADE ALTA

**Objetivo:** Fazer step 20 usar v3.0 em produção

#### **Tarefa 1.1: Criar V3Renderer** ⏱️ 4h
**Arquivo:** `/src/components/core/V3Renderer.tsx`

```typescript
/**
 * V3Renderer - Renderiza templates JSON v3.0
 */
import React from 'react';
import { TemplateV3, UserData } from '@/types/template-v3.types';
import { SectionsContainer } from '@/components/sections/SectionRenderer';

interface V3RendererProps {
  template: TemplateV3;
  userData?: UserData;
  onAnalytics?: (event: string, data: any) => void;
}

export const V3Renderer: React.FC<V3RendererProps> = ({
  template,
  userData,
  onAnalytics,
}) => {
  // Callback para tracking de sections
  const handleSectionView = React.useCallback((sectionId: string) => {
    onAnalytics?.('section_viewed', { sectionId });
  }, [onAnalytics]);

  return (
    <div className="v3-renderer">
      {/* Container principal com theme CSS variables */}
      <SectionsContainer
        sections={template.sections}
        theme={template.theme}
        offer={template.offer}
        userData={userData}
        onSectionView={handleSectionView}
      />
    </div>
  );
};

export default V3Renderer;
```

**Checklist:**
- [ ] Criar arquivo V3Renderer.tsx
- [ ] Adicionar prop types
- [ ] Implementar analytics callback
- [ ] Adicionar error boundary global
- [ ] Testar com step-20-v3.json

---

#### **Tarefa 1.2: Integrar ao QuizRenderer** ⏱️ 6h
**Arquivo:** `/src/components/core/QuizRenderer.tsx`

**Modificações:**
1. Detectar versão do template (usar TemplateAdapter)
2. Renderizar V3Renderer se v3.0
3. Renderizar BlockRenderer se v2.0

```typescript
import { TemplateAdapter } from '@/adapters/TemplateAdapter';
import V3Renderer from './V3Renderer';

// Dentro do QuizRenderer
const renderTemplate = () => {
  const adapter = new TemplateAdapter(template);
  
  if (adapter.isV3()) {
    return (
      <V3Renderer
        template={adapter.getV3Template()}
        userData={getUserData()}
        onAnalytics={handleAnalytics}
      />
    );
  }
  
  // Fallback para v2.0
  return <BlockRenderer blocks={template.blocks} />;
};
```

**Checklist:**
- [ ] Adicionar imports
- [ ] Implementar detecção de versão
- [ ] Criar função renderTemplate()
- [ ] Adicionar getUserData() helper
- [ ] Testar ambas versões

---

#### **Tarefa 1.3: Passar Dados do Quiz** ⏱️ 4h

**Dados Necessários:**
```typescript
interface QuizUserData {
  userName: string;           // Nome do usuário
  styleName: string;          // Estilo predominante
  scores: Record<string, number>; // Pontuações dos 8 estilos
  secondaryStyles?: string[]; // Top 3 estilos
  keywords?: string[];        // Palavras-chave
  specialTips?: string[];     // Dicas personalizadas
}
```

**Implementação:**
```typescript
// Em QuizRenderer ou QuizContext
const getUserData = (): UserData => {
  const quizState = useQuizState();
  
  return {
    userName: quizState.userName || 'Você',
    styleName: quizState.result.primaryStyle,
    email: quizState.email,
    completedAt: new Date().toISOString(),
  };
};
```

**Checklist:**
- [ ] Criar função getUserData()
- [ ] Mapear quizState → UserData
- [ ] Validar dados obrigatórios
- [ ] Adicionar fallbacks
- [ ] Testar com dados reais

---

#### **Tarefa 1.4: Analytics Integration** ⏱️ 3h

**Eventos a Rastrear:**
```typescript
// step-20-v3.json analytics
const ANALYTICS_EVENTS = [
  'page_view',           // Page load
  'step_completed',      // Quiz finalizado
  'cta_primary_click',   // CTA #1
  'cta_secondary_click', // CTA #2
  'cta_final_click',     // CTA #3
  'section_viewed',      // Section visível
  'offer_viewed',        // Oferta visível
  'scroll_depth',        // % de scroll
  'time_on_page',        // Tempo na página
];
```

**Implementação:**
```typescript
const handleAnalytics = (event: string, data: any) => {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', event, data);
  }
  
  // Facebook Pixel
  if (typeof fbq !== 'undefined' && event.includes('cta')) {
    fbq('track', 'Lead', data);
  }
  
  // Internal analytics
  analyticsService.track(event, data);
};
```

**Checklist:**
- [ ] Implementar handleAnalytics()
- [ ] Integrar com GA4
- [ ] Integrar com Facebook Pixel
- [ ] Adicionar UTM params
- [ ] Testar eventos

---

#### **Tarefa 1.5: Deploy Step 20 v3.0** ⏱️ 2h

**Passos:**
1. Mover `/templates/step-20-v3.json` → `/public/templates/step-20-v3.json`
2. Atualizar `generate-templates.ts` para incluir v3.0
3. Regenerar `quiz21StepsComplete.ts`
4. Atualizar configuração do step 20
5. Testar em dev
6. Deploy para staging
7. Validar em staging
8. Deploy para produção

**Checklist:**
- [ ] Mover arquivo JSON
- [ ] Atualizar script de geração
- [ ] Regenerar types
- [ ] Atualizar config
- [ ] Testar dev
- [ ] Deploy staging
- [ ] Validar staging
- [ ] Deploy production

---

### **FASE 2: TEMPLATES ADICIONAIS (Semana 2-3)** 🟡 PRIORIDADE MÉDIA

#### **Tarefa 2.1: Criar step-21-v3.json** ⏱️ 6h

**Estrutura:**
```json
{
  "templateVersion": "3.0",
  "metadata": {
    "id": "step-21-thank-you-v3",
    "name": "Thank You Page",
    "category": "thank-you"
  },
  "offer": {
    "productName": "Upsell: Consultoria 1:1",
    "pricing": {
      "originalPrice": 997.00,
      "salePrice": 497.00
    }
  },
  "sections": [
    { "id": "confirmation", "type": "HeroSection" },
    { "id": "next-steps", "type": "MethodStepsSection" },
    { "id": "upsell", "type": "OfferSection" },
    { "id": "cta-upsell", "type": "CTAButton" }
  ]
}
```

**Sections:**
1. **ConfirmationHero**: "Parabéns! Você garantiu sua vaga"
2. **NextSteps**: O que fazer agora (3 passos)
3. **UpsellOffer**: Oferta adicional (consultoria 1:1)
4. **CTAUpsell**: "Sim, quero a consultoria"

**Checklist:**
- [ ] Criar arquivo JSON
- [ ] Definir metadata
- [ ] Configurar offer de upsell
- [ ] Adicionar 4 sections
- [ ] Configurar theme
- [ ] Adicionar analytics
- [ ] Validar com types
- [ ] Testar renderização

---

#### **Tarefa 2.2: Criar landing-page-v3.json** ⏱️ 8h

**Estrutura:**
Landing page standalone para captura de leads

**Sections:**
1. **Hero**: Headline + subheadline + CTA
2. **Problem**: Dores do público
3. **Solution**: Como o quiz resolve
4. **Benefits**: 4 benefícios principais
5. **HowItWorks**: 3 passos simples
6. **SocialProof**: 6 depoimentos
7. **CTA Final**: "Fazer o quiz agora"

**Checklist:**
- [ ] Criar arquivo JSON
- [ ] Definir 7 sections
- [ ] Configurar theme
- [ ] Adicionar copy persuasivo
- [ ] Testar responsividade
- [ ] Otimizar para conversão

---

### **FASE 3: EDITOR SUPPORT (Semana 3-4)** 🟡 PRIORIDADE MÉDIA

#### **Tarefa 3.1: Painel de Propriedades para Sections** ⏱️ 12h

**Componente:** `SectionPropertiesPanel.tsx`

**Features:**
- Editar props de cada section type
- Validação em tempo real
- Preview ao vivo
- Undo/redo

**Interface:**
```typescript
interface SectionPropertiesPanelProps {
  section: Section;
  onUpdate: (section: Section) => void;
  theme: ThemeSystem;
}
```

**Campos por Section Type:**

**HeroSection:**
- [ ] Text input: greetingFormat
- [ ] Text input: titleFormat
- [ ] Toggle: showCelebration
- [ ] Text input: celebrationEmoji
- [ ] Select: celebrationAnimation

**CTAButton:**
- [ ] Text input: text
- [ ] Select: icon
- [ ] Color picker: colors.from
- [ ] Color picker: colors.to
- [ ] Select: size

**OfferSection:**
- [ ] Number input: pricing.originalPrice
- [ ] Number input: pricing.salePrice
- [ ] Number input: installments.count
- [ ] Toggle: showUrgency
- [ ] Rich text: includes.items[]

**Checklist:**
- [ ] Criar componente base
- [ ] Implementar field renderers
- [ ] Adicionar validação
- [ ] Conectar ao state
- [ ] Testar todas sections

---

#### **Tarefa 3.2: Drag & Drop de Sections** ⏱️ 10h

**Biblioteca:** `@dnd-kit/core`

**Features:**
- Arrastar sections para reordenar
- Drag handles visuais
- Animações suaves
- Snap to grid

**Implementação:**
```typescript
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const SectionsEditor = ({ sections, onReorder }) => {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    // Atualizar ordem
    onReorder(reorderedSections);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={sections} strategy={verticalListSortingStrategy}>
        {sections.map(section => (
          <SortableSection key={section.id} section={section} />
        ))}
      </SortableContext>
    </DndContext>
  );
};
```

**Checklist:**
- [ ] Instalar @dnd-kit/core
- [ ] Criar SortableSection component
- [ ] Implementar handleDragEnd
- [ ] Adicionar drag handles
- [ ] Testar performance
- [ ] Adicionar animações

---

#### **Tarefa 3.3: Section Palette** ⏱️ 6h

**Componente:** Sidebar com sections disponíveis

**Features:**
- Lista de 10 section types
- Preview thumbnails
- Drag para adicionar
- Descrição de cada type

**Layout:**
```
┌─────────────────────┐
│ SECTIONS PALETTE    │
├─────────────────────┤
│ 🎉 HeroSection      │
│    Título + imagem  │
├─────────────────────┤
│ 👤 StyleProfile     │
│    Perfil completo  │
├─────────────────────┤
│ 🔘 CTAButton        │
│    Botão conversão  │
├─────────────────────┤
│ ...                 │
└─────────────────────┘
```

**Checklist:**
- [ ] Criar componente SectionPalette
- [ ] Adicionar todos os 10 types
- [ ] Criar thumbnails
- [ ] Implementar drag to add
- [ ] Adicionar tooltips

---

### **FASE 4: TESTES E QA (Semana 4-5)** 🟢 PRIORIDADE NORMAL

#### **Tarefa 4.1: Unit Tests** ⏱️ 8h

**Coverage Alvo:** 80%+

**Arquivos a Testar:**
```
src/components/sections/
├── SectionRenderer.test.tsx
├── HeroSection.test.tsx
├── StyleProfileSection.test.tsx
├── CTAButton.test.tsx
├── OfferSection.test.tsx
└── GuaranteeSection.test.tsx
```

**Exemplo:**
```typescript
describe('HeroSection', () => {
  it('renders greeting with user name', () => {
    const userData = { userName: 'João', styleName: 'Clássico' };
    render(<HeroSection {...props} userData={userData} />);
    expect(screen.getByText(/João/i)).toBeInTheDocument();
  });

  it('shows celebration animation when enabled', () => {
    const props = { showCelebration: true, celebrationEmoji: '🎉' };
    render(<HeroSection {...props} />);
    expect(screen.getByText('🎉')).toHaveClass('bounce');
  });
});
```

**Checklist:**
- [ ] Configurar Jest + React Testing Library
- [ ] Escrever tests para cada section
- [ ] Mockar dependencies
- [ ] Testar edge cases
- [ ] Alcançar 80%+ coverage

---

#### **Tarefa 4.2: Integration Tests** ⏱️ 6h

**Cenários:**
1. **Fluxo Completo:** Quiz → Step 20 v3.0 → Conversão
2. **Lazy Loading:** Sections carregam sob demanda
3. **Error Recovery:** Sections com erro não quebram a página
4. **Analytics:** Eventos são disparados corretamente

**Exemplo:**
```typescript
describe('V3 Integration', () => {
  it('completes quiz and renders step 20 with v3', async () => {
    // 1. Responder quiz
    await answerQuizQuestions();
    
    // 2. Verificar step 20
    expect(screen.getByText(/Seu Estilo Predominante é/i)).toBeInTheDocument();
    
    // 3. Verificar sections
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('offer-section')).toBeInTheDocument();
    
    // 4. Click CTA
    fireEvent.click(screen.getByText(/Quero Dominar/i));
    
    // 5. Verificar analytics
    expect(analyticsService.track).toHaveBeenCalledWith('cta_primary_click', ...);
  });
});
```

**Checklist:**
- [ ] Escrever cenários principais
- [ ] Mockar APIs
- [ ] Testar fluxos críticos
- [ ] Validar analytics
- [ ] Documentar casos de teste

---

#### **Tarefa 4.3: E2E Tests** ⏱️ 8h

**Ferramenta:** Playwright

**Cenários:**
1. Quiz completo + conversão
2. Responsividade (mobile, tablet, desktop)
3. Performance (Core Web Vitals)
4. Checkout Hotmart

**Exemplo:**
```typescript
test('quiz to conversion flow', async ({ page }) => {
  // 1. Acessar quiz
  await page.goto('/quiz/5-passos-estilo');
  
  // 2. Responder 20 perguntas
  for (let i = 1; i <= 19; i++) {
    await page.click('[data-answer="1"]');
    await page.click('button:has-text("Próximo")');
  }
  
  // 3. Verificar step 20 v3.0
  await expect(page.locator('[data-section="hero"]')).toBeVisible();
  await expect(page.locator('[data-section="offer"]')).toBeVisible();
  
  // 4. Scroll até CTA
  await page.locator('[data-section="cta-primary"]').scrollIntoViewIfNeeded();
  
  // 5. Click CTA
  await page.click('button:has-text("Quero Dominar Meu Estilo")');
  
  // 6. Verificar redirecionamento Hotmart
  await expect(page).toHaveURL(/pay.hotmart.com/);
});
```

**Checklist:**
- [ ] Configurar Playwright
- [ ] Escrever 5 cenários principais
- [ ] Testar em 3 viewports
- [ ] Medir performance
- [ ] Gerar relatórios

---

#### **Tarefa 4.4: Visual Regression Tests** ⏱️ 4h

**Ferramenta:** Percy.io ou Chromatic

**Screenshots a Capturar:**
- Step 20 completo (desktop)
- Step 20 completo (mobile)
- Cada section individual
- Estados de erro
- Skeleton loaders

**Checklist:**
- [ ] Configurar Percy/Chromatic
- [ ] Capturar baselines
- [ ] Integrar ao CI/CD
- [ ] Revisar diferenças
- [ ] Aprovar mudanças

---

### **FASE 5: DEPLOY E MONITORAMENTO (Semana 5-6)** 🟢 PRIORIDADE NORMAL

#### **Tarefa 5.1: Feature Flag** ⏱️ 3h

**Implementação:**
```typescript
// Gradual rollout com feature flag
const shouldUseV3 = useFeatureFlag('step-20-v3', {
  percentage: 10, // Começar com 10% dos usuários
  allowlist: ['user-id-1', 'user-id-2'], // Beta testers
});

return shouldUseV3 ? (
  <V3Renderer template={template} />
) : (
  <BlockRenderer blocks={template.blocks} />
);
```

**Rollout Plan:**
- Dia 1: 10% dos usuários
- Dia 3: 25% dos usuários
- Dia 5: 50% dos usuários
- Dia 7: 100% dos usuários

**Checklist:**
- [ ] Implementar feature flag
- [ ] Configurar percentuais
- [ ] Adicionar allowlist
- [ ] Monitorar métricas
- [ ] Escalar gradualmente

---

#### **Tarefa 5.2: Monitoramento** ⏱️ 4h

**Métricas a Acompanhar:**

**Performance:**
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1
- TTI (Time to Interactive) < 3.5s

**Conversão:**
- Taxa de conversão step 20
- Taxa de click por CTA (primary, secondary, final)
- Tempo médio na página
- Scroll depth médio

**Erros:**
- Error rate por section
- Lazy loading failures
- Analytics tracking failures

**Dashboards:**
```
Datadog / New Relic / Sentry
├── Performance Dashboard
├── Conversion Dashboard
└── Errors Dashboard
```

**Checklist:**
- [ ] Configurar Datadog/New Relic
- [ ] Criar dashboards
- [ ] Configurar alertas
- [ ] Documentar métricas
- [ ] Revisar diariamente

---

#### **Tarefa 5.3: A/B Testing** ⏱️ 6h

**Hipóteses a Testar:**

**Teste 1: Quantidade de CTAs**
- Variante A: 3 CTAs (atual)
- Variante B: 2 CTAs (remover secundário)
- Métrica: Taxa de conversão

**Teste 2: Ordem das Sections**
- Variante A: Ordem atual (hero → profile → cta → offer)
- Variante B: Ordem alternativa (hero → offer → profile → cta)
- Métrica: Taxa de conversão

**Teste 3: Cores do Tema**
- Variante A: Paleta atual (bege)
- Variante B: Paleta alternativa (azul)
- Métrica: Taxa de conversão + tempo na página

**Ferramenta:** Google Optimize ou Optimizely

**Checklist:**
- [ ] Configurar A/B testing tool
- [ ] Criar 3 experimentos
- [ ] Definir sample size
- [ ] Rodar por 2 semanas
- [ ] Analisar resultados
- [ ] Implementar vencedor

---

## ✅ TESTES E VALIDAÇÃO

### **Checklist Pré-Deploy**

**Funcional:**
- [ ] Step 20 renderiza corretamente com v3.0
- [ ] Todas as 11 sections aparecem
- [ ] Dados do quiz são injetados corretamente
- [ ] CTAs redirecionam para Hotmart
- [ ] Analytics tracking funciona
- [ ] Lazy loading carrega sections

**Performance:**
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Bundle size aceitável
- [ ] Code splitting funcionando

**Cross-browser:**
- [ ] Chrome (desktop + mobile)
- [ ] Firefox (desktop + mobile)
- [ ] Safari (desktop + mobile)
- [ ] Edge (desktop)

**Responsividade:**
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)

**Acessibilidade:**
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] ARIA labels
- [ ] Color contrast (WCAG AA)

---

## 🔄 ROLLBACK PLAN

### **Se Algo Der Errado:**

**Sintomas de Problema:**
- Taxa de erro > 5%
- Taxa de conversão < 80% da baseline
- Performance degradada (LCP > 4s)
- Reclamações de usuários

**Plano de Rollback:**

**Opção 1: Feature Flag (RÁPIDO - 5 min)**
```typescript
// Desabilitar v3.0 imediatamente
setFeatureFlag('step-20-v3', { percentage: 0 });
```

**Opção 2: Revert Commit (MÉDIO - 15 min)**
```bash
git revert <commit-hash>
git push origin main
# Redeploy automático via CI/CD
```

**Opção 3: Deploy Anterior (LENTO - 30 min)**
```bash
# Voltar para última versão estável
git checkout <tag-anterior>
npm run build
npm run deploy
```

**Comunicação:**
1. Alertar time no Slack #engineering
2. Atualizar status page
3. Notificar stakeholders
4. Postar mortem após resolução

---

## 📈 MÉTRICAS DE SUCESSO

### **KPIs Principais**

| Métrica | Baseline (v2.0) | Meta (v3.0) | Como Medir |
|---------|-----------------|-------------|------------|
| **Taxa de Conversão** | 8% | 10% (+25%) | GA4 conversion tracking |
| **Tempo na Página** | 3min | 4min (+33%) | GA4 engagement |
| **Scroll Depth** | 60% | 75% (+25%) | Custom event |
| **CTA Click Rate** | 15% | 20% (+33%) | Button click tracking |
| **Erro Rate** | 0.5% | < 1% | Sentry error tracking |
| **LCP** | 3.2s | < 2.5s | Web Vitals |
| **Bundle Size** | 250 KB | < 300 KB (+20%) | Webpack analyzer |

### **Validação de Sucesso**

**Após 2 semanas com 100% rollout:**
- ✅ Taxa de conversão aumentou 25%+
- ✅ Tempo na página aumentou 30%+
- ✅ Erro rate < 1%
- ✅ Core Web Vitals "Bom"
- ✅ Feedback positivo de usuários

**Se atingir metas:** ✅ Migração bem-sucedida, escalar para step 21

**Se não atingir:** ⚠️ Investigar, ajustar, A/B test, iterar

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### **SPRINT 1 (Esta Semana)**

**Dia 1-2: Setup**
- [ ] Criar branch `feature/v3-integration`
- [ ] Criar V3Renderer.tsx
- [ ] Adicionar ao QuizRenderer
- [ ] Testar localmente

**Dia 3-4: Integração**
- [ ] Implementar getUserData()
- [ ] Conectar analytics
- [ ] Testar step 20 completo
- [ ] Code review

**Dia 5: Deploy Staging**
- [ ] Deploy para staging
- [ ] QA completo
- [ ] Validar com stakeholders
- [ ] Preparar rollout

---

## 📚 DOCUMENTAÇÃO

### **Guias a Criar**

1. **Developer Guide**
   - Como criar uma nova section
   - Como editar props de sections
   - Como adicionar analytics
   - Como testar sections

2. **Content Editor Guide**
   - Como editar textos
   - Como trocar imagens
   - Como ajustar cores
   - Como reordenar sections

3. **API Reference**
   - Section types
   - Props de cada section
   - Theme tokens
   - Offer system

---

## 💡 CONSIDERAÇÕES FINAIS

### **Riscos Identificados**

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Performance degradada | Média | Alto | Code splitting, lazy loading |
| Bugs em sections | Baixa | Médio | Error boundaries, extensive testing |
| Confusão no editor | Média | Baixo | Documentação, training |
| Rollback necessário | Baixa | Alto | Feature flags, gradual rollout |

### **Dependências Externas**

- ✅ TemplateAdapter já implementado
- ✅ Sections já implementadas
- ✅ Types já definidos
- ⚠️ Hotmart API (checkout)
- ⚠️ Analytics providers (GA4, FB Pixel)
- ⚠️ CDN (Cloudinary para imagens)

### **Aprovações Necessárias**

- [ ] Tech Lead (arquitetura)
- [ ] Product Manager (roadmap)
- [ ] Design Lead (UI/UX)
- [ ] Marketing (copy, analytics)

---

## 🚀 COMEÇAR AGORA

### **Primeira Tarefa**

**🎯 Tarefa: Criar V3Renderer** ⏱️ 4h

**Arquivo:** `/src/components/core/V3Renderer.tsx`

**O Que Fazer:**
1. Criar arquivo novo
2. Copiar código do template acima
3. Ajustar imports
4. Adicionar error boundary
5. Testar com step-20-v3.json

**Comando para iniciar:**
```bash
git checkout -b feature/v3-integration
touch src/components/core/V3Renderer.tsx
```

---

**Status:** 🟢 Pronto para iniciar  
**Próxima Atualização:** Após completar Fase 1  
**Responsável:** Dev Team  
**Revisão:** Diária

