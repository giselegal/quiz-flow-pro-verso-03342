# 🚀 PLANO DE MIGRAÇÃO v3.0 - DETALHADO

**Data de Criação:** 12 de outubro de 2025  
**Estratégia:** Migração Gradual Híbrida  
**Duração Total:** 4 semanas (20 dias úteis)  
**Status:** 🟢 Em Planejamento

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Arquitetura Alvo](#arquitetura-alvo)
3. [Sprints Detalhados](#sprints-detalhados)
4. [Tasks por Prioridade](#tasks-por-prioridade)
5. [Critérios de Aceitação](#critérios-de-aceitação)
6. [Riscos e Mitigações](#riscos-e-mitigações)
7. [Rollback Plan](#rollback-plan)

---

## 🎯 VISÃO GERAL

### Objetivo

Migrar sistema de templates de v2.0 (blocks-based) para v3.0 (sections-based) mantendo compatibilidade retroativa e zero downtime.

### Abordagem

**Migração Gradual Híbrida:**
- ✅ Sistema v2.0 continua funcionando
- 🆕 Sistema v3.0 implementado em paralelo
- 🔄 Adapter unifica ambos os sistemas
- 📊 Validação incremental por step

### Estado Atual

```
✅ Templates v2.0: 21 steps funcionando
✅ Template v3.0: step-20-v3.json criado (21KB)
✅ Script generator: gera v2.0 de public/templates/
❌ Editor: não suporta v3.0
❌ Components: nenhum section component criado
```

### Estado Alvo (4 semanas)

```
✅ Templates v2.0: mantidos para steps 1-19, 21
✅ Template v3.0: step-20 integrado e funcionando
✅ Infraestrutura: adapter + renderer + types
✅ Components: 11 section components implementados
✅ Testes: cobertura mínima 80%
✅ Documentação: guia de migração completo
```

---

## 🏗️ ARQUITETURA ALVO

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                  QuizModularProductionEditor            │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │          TemplateLoader                          │  │
│  │  - Detecta versão (v2.0 ou v3.0)                │  │
│  │  - Carrega template apropriado                   │  │
│  └────────────────┬─────────────────────────────────┘  │
│                   │                                     │
│         ┌─────────┴─────────┐                          │
│         ▼                   ▼                          │
│  ┌─────────────┐     ┌─────────────┐                  │
│  │ v2.0 Path   │     │ v3.0 Path   │                  │
│  │             │     │             │                  │
│  │ BlockRenderer│     │TemplateAdapter│                │
│  │   (atual)   │     │     ↓       │                  │
│  │             │     │SectionRenderer│                │
│  └─────────────┘     └──────┬──────┘                  │
│                             │                          │
│                    ┌────────┴────────┐                 │
│                    │ Section Components│               │
│                    │                 │                 │
│                    │ - HeroSection   │                 │
│                    │ - CTAButton     │                 │
│                    │ - OfferSection  │                 │
│                    │ - ...+8 more    │                 │
│                    └─────────────────┘                 │
└─────────────────────────────────────────────────────────┘
```

### Stack Tecnológico

```typescript
// Types
src/types/template-v3.types.ts           // Interfaces v3.0

// Adapters
src/adapters/TemplateAdapter.ts          // v2↔v3 adapter

// Components
src/components/sections/
  ├── SectionRenderer.tsx                // Router de sections
  ├── HeroSection.tsx                    // Section components
  ├── CTAButton.tsx
  ├── OfferSection.tsx
  ├── GuaranteeSection.tsx
  ├── StyleProfileSection.tsx
  ├── TransformationSection.tsx
  ├── MethodStepsSection.tsx
  ├── BonusSection.tsx
  └── SocialProofSection.tsx

// Hooks
src/hooks/useTheme.ts                    // Theme system hook
src/hooks/useSectionTracking.ts          // Analytics hook

// Utils
src/utils/templateVersionDetector.ts     // Detecta versão
src/utils/sectionFactory.ts              // Factory pattern

// Tests
src/__tests__/sections/                  // Unit tests
src/__tests__/integration/               // Integration tests
```

---

## 📅 SPRINTS DETALHADOS

### 🔵 SPRINT 0: Preparação (2 dias)

**Objetivo:** Setup inicial e planejamento técnico

#### Tasks

- [x] Analisar template v3.0 existente
- [x] Criar ANALISE_TEMPLATE_V3_COMPLETA.md
- [ ] Criar PLANO_MIGRACAO_V3_DETALHADO.md
- [ ] Setup branch `feature/v3-migration`
- [ ] Configurar ambiente de testes
- [ ] Definir code review process

#### Entregáveis

```
✅ ANALISE_TEMPLATE_V3_COMPLETA.md (15KB)
🔄 PLANO_MIGRACAO_V3_DETALHADO.md (este arquivo)
🔄 Branch feature/v3-migration
🔄 .github/workflows/v3-tests.yml
```

---

### 🟢 SPRINT 1: Infraestrutura (5 dias)

**Objetivo:** Base técnica para suportar v3.0

#### 📋 Task 1.1: TypeScript Types (1 dia)

**Arquivo:** `src/types/template-v3.types.ts`

```typescript
// Interfaces principais
export interface TemplateV3 {
  templateVersion: "3.0";
  metadata: MetadataV3;
  offer: OfferSystem;
  theme: ThemeSystem;
  layout: LayoutConfig;
  sections: Section[];
  validation: ValidationRules;
  analytics: AnalyticsConfig;
}

export interface Section {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  title?: string;
  props: SectionProps;
}

export type SectionType =
  | "HeroSection"
  | "StyleProfileSection"
  | "CTAButton"
  | "TransformationSection"
  | "MethodStepsSection"
  | "BonusSection"
  | "SocialProofSection"
  | "OfferSection"
  | "GuaranteeSection";

// ... +20 interfaces
```

**Critérios de Aceitação:**
- [ ] Todas as interfaces do v3.0 tipadas
- [ ] Compatível com step-20-v3.json
- [ ] Sem erros TypeScript
- [ ] Documentação inline (JSDoc)

---

#### 📋 Task 1.2: Template Adapter (1,5 dias)

**Arquivo:** `src/adapters/TemplateAdapter.ts`

```typescript
export class TemplateAdapter {
  /**
   * Detecta versão do template
   */
  static detectVersion(template: any): "2.0" | "3.0" {
    const version = template.templateVersion || "2.0";
    return version.startsWith("3") ? "3.0" : "2.0";
  }

  /**
   * Converte v2→v3 se necessário
   */
  static normalize(template: any): TemplateV3 | TemplateV2 {
    const version = this.detectVersion(template);
    
    if (version === "3.0") {
      return this.validateV3(template);
    } else {
      return template; // Mantém v2
    }
  }

  /**
   * Valida estrutura v3.0
   */
  static validateV3(template: any): TemplateV3 {
    // Validação runtime
    if (!template.sections || !Array.isArray(template.sections)) {
      throw new Error("v3.0 template must have sections array");
    }
    
    if (!template.theme || !template.offer) {
      throw new Error("v3.0 template must have theme and offer");
    }
    
    return template as TemplateV3;
  }

  /**
   * Converte v2→v3 (opcional)
   */
  static convertV2ToV3(templateV2: TemplateV2): TemplateV3 {
    // Implementação futura
    throw new Error("v2→v3 conversion not implemented yet");
  }
}
```

**Critérios de Aceitação:**
- [ ] Detecta versão corretamente (v2.0, v2.1, v3.0)
- [ ] Valida step-20-v3.json sem erros
- [ ] Mantém templates v2.0 intactos
- [ ] Testes unitários (90% coverage)

---

#### 📋 Task 1.3: Section Renderer Base (1,5 dias)

**Arquivo:** `src/components/sections/SectionRenderer.tsx`

```typescript
import React from 'react';
import { Section } from '@/types/template-v3.types';

// Lazy load components
const HeroSection = React.lazy(() => import('./HeroSection'));
const CTAButton = React.lazy(() => import('./CTAButton'));
const OfferSection = React.lazy(() => import('./OfferSection'));
// ... +8 imports

interface SectionRendererProps {
  section: Section;
  theme: ThemeSystem;
  offer: OfferSystem;
  userData?: any;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  theme,
  offer,
  userData
}) => {
  if (!section.enabled) return null;

  const componentMap: Record<SectionType, React.ComponentType<any>> = {
    HeroSection,
    CTAButton,
    OfferSection,
    GuaranteeSection,
    StyleProfileSection,
    TransformationSection,
    MethodStepsSection,
    BonusSection,
    SocialProofSection,
  };

  const Component = componentMap[section.type];

  if (!Component) {
    console.warn(`Unknown section type: ${section.type}`);
    return null;
  }

  return (
    <React.Suspense fallback={<SectionSkeleton />}>
      <Component
        {...section.props}
        theme={theme}
        offer={offer}
        userData={userData}
      />
    </React.Suspense>
  );
};
```

**Critérios de Aceitação:**
- [ ] Mapeia todos os 11 section types
- [ ] Lazy loading implementado
- [ ] Fallback skeleton funcional
- [ ] Props tipadas corretamente
- [ ] Error boundary implementado

---

#### 📋 Task 1.4: Theme System Hook (1 dia)

**Arquivo:** `src/hooks/useTheme.ts`

```typescript
import { useMemo } from 'react';
import { ThemeSystem } from '@/types/template-v3.types';

export function useTheme(theme: ThemeSystem) {
  const cssVariables = useMemo(() => {
    return {
      '--color-primary': theme.colors.primary,
      '--color-secondary': theme.colors.secondary,
      '--color-background': theme.colors.background,
      '--color-text': theme.colors.text,
      '--color-accent': theme.colors.accent,
      '--color-success': theme.colors.success,
      '--color-warning': theme.colors.warning,
      
      '--font-heading': theme.fonts.heading,
      '--font-body': theme.fonts.body,
      
      '--spacing-section': theme.spacing.section,
      '--spacing-block': theme.spacing.block,
      
      '--radius-small': theme.borderRadius.small,
      '--radius-medium': theme.borderRadius.medium,
      '--radius-large': theme.borderRadius.large,
    };
  }, [theme]);

  return { cssVariables };
}
```

**Critérios de Aceitação:**
- [ ] CSS variables geradas corretamente
- [ ] Memoização funcional
- [ ] Suporte a theme switching
- [ ] TypeScript strict mode

---

### 🟡 SPRINT 2: Core Components (5 dias)

**Objetivo:** Implementar 4 componentes essenciais

#### 📋 Task 2.1: HeroSection Component (1,5 dias)

**Arquivo:** `src/components/sections/HeroSection.tsx`

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

interface HeroSectionProps {
  showCelebration: boolean;
  celebrationEmoji: string;
  celebrationAnimation: 'bounce' | 'fade' | 'scale';
  greetingFormat: string;
  titleFormat: string;
  styleNameDisplay: string;
  colors: {
    greeting: string;
    greetingHighlight: string;
    title: string;
    styleName: string;
  };
  spacing: {
    padding: string;
    marginBottom: string;
  };
  theme: ThemeSystem;
  userData?: {
    name: string;
    styleName: string;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  showCelebration,
  celebrationEmoji,
  celebrationAnimation,
  greetingFormat,
  titleFormat,
  styleNameDisplay,
  colors,
  spacing,
  theme,
  userData
}) => {
  const { cssVariables } = useTheme(theme);

  const greeting = greetingFormat.replace(
    '{userName}',
    userData?.name || 'você'
  );
  
  const styleName = styleNameDisplay.replace(
    '{styleName}',
    userData?.styleName || 'Seu Estilo'
  );

  const animationVariants = {
    bounce: {
      y: [0, -20, 0],
      transition: { repeat: Infinity, duration: 1.5 }
    },
    fade: {
      opacity: [0, 1],
      transition: { duration: 1 }
    },
    scale: {
      scale: [0.8, 1.2, 1],
      transition: { duration: 0.8 }
    }
  };

  return (
    <section
      className="hero-section"
      style={{
        ...cssVariables,
        padding: spacing.padding,
        marginBottom: spacing.marginBottom,
        background: `var(--color-background)`,
      }}
    >
      {showCelebration && (
        <motion.div
          className="celebration"
          animate={animationVariants[celebrationAnimation]}
        >
          <span className="celebration-emoji" style={{ fontSize: '3rem' }}>
            {celebrationEmoji}
          </span>
        </motion.div>
      )}

      <h2
        className="greeting"
        style={{
          color: `var(--color-${colors.greeting})`,
          fontFamily: 'var(--font-body)',
        }}
      >
        {greeting}
      </h2>

      <h1
        className="title"
        style={{
          color: `var(--color-${colors.title})`,
          fontFamily: 'var(--font-heading)',
        }}
      >
        {titleFormat}
      </h1>

      <div
        className="style-name"
        style={{
          color: `var(--color-${colors.styleName})`,
          fontFamily: 'var(--font-heading)',
          fontSize: '2.5rem',
          fontWeight: 'bold',
        }}
      >
        {styleName}
      </div>
    </section>
  );
};
```

**Critérios de Aceitação:**
- [ ] Renderiza celebração com animação
- [ ] Suporta 3 tipos de animação
- [ ] Substitui variáveis {userName}, {styleName}
- [ ] Aplica theme colors corretamente
- [ ] Responsivo (mobile, tablet, desktop)
- [ ] Storybook story criada
- [ ] Testes de snapshot

---

#### 📋 Task 2.2: CTAButton Component (1 dia)

**Arquivo:** `src/components/sections/CTAButton.tsx`

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useSectionTracking } from '@/hooks/useSectionTracking';

interface CTAButtonProps {
  id: string;
  label: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  icon?: string;
  animation?: 'pulse' | 'shake' | 'none';
  tracking?: {
    event: string;
    category: string;
  };
  theme: ThemeSystem;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  id,
  label,
  href,
  variant,
  size,
  icon,
  animation,
  tracking,
  theme
}) => {
  const { cssVariables } = useTheme(theme);
  const { trackClick } = useSectionTracking();

  const handleClick = () => {
    if (tracking) {
      trackClick({
        sectionId: id,
        event: tracking.event,
        category: tracking.category,
        href,
      });
    }
  };

  const sizeStyles = {
    small: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    medium: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    large: { padding: '1rem 2rem', fontSize: '1.125rem' },
  };

  const variantStyles = {
    primary: {
      background: 'var(--color-success)',
      color: '#fff',
      border: 'none',
    },
    secondary: {
      background: 'var(--color-primary)',
      color: 'var(--color-secondary)',
      border: 'none',
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '2px solid var(--color-primary)',
    },
  };

  const animationVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { repeat: Infinity, duration: 2 }
    },
    shake: {
      x: [-5, 5, -5, 5, 0],
      transition: { repeat: Infinity, duration: 1, delay: 3 }
    },
    none: {}
  };

  return (
    <motion.a
      href={href}
      className={`cta-button cta-${variant} cta-${size}`}
      style={{
        ...cssVariables,
        ...sizeStyles[size],
        ...variantStyles[variant],
        borderRadius: 'var(--radius-medium)',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      animate={animationVariants[animation || 'none']}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      {icon && <span className="cta-icon">{icon}</span>}
      {label}
    </motion.a>
  );
};
```

**Critérios de Aceitação:**
- [ ] 3 variantes (primary, secondary, outline)
- [ ] 3 tamanhos (small, medium, large)
- [ ] Tracking analytics integrado
- [ ] Animações configuráveis
- [ ] Acessibilidade (ARIA, keyboard)
- [ ] Testes de interação

---

#### 📋 Task 2.3: OfferSection Component (1,5 dias)

**Arquivo:** `src/components/sections/OfferSection.tsx`

```typescript
import React from 'react';
import { OfferSystem, ThemeSystem } from '@/types/template-v3.types';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency } from '@/utils/formatters';

interface OfferSectionProps {
  offer: OfferSystem;
  theme: ThemeSystem;
  showDiscount?: boolean;
  showFeatures?: boolean;
  layout?: 'card' | 'inline' | 'split';
}

export const OfferSection: React.FC<OfferSectionProps> = ({
  offer,
  theme,
  showDiscount = true,
  showFeatures = true,
  layout = 'card'
}) => {
  const { cssVariables } = useTheme(theme);

  const discountPercentage = offer.pricing.discount.percentage;
  const installmentText = `${offer.pricing.installments.count}x de ${formatCurrency(offer.pricing.installments.value)}`;

  return (
    <section
      className={`offer-section offer-layout-${layout}`}
      style={{ ...cssVariables }}
    >
      <div className="offer-header">
        <h2 style={{ fontFamily: 'var(--font-heading)' }}>
          {offer.productName}
        </h2>
        <p className="mentor">
          com {offer.mentor} • {offer.mentorTitle}
        </p>
      </div>

      <div className="offer-pricing">
        {showDiscount && (
          <div className="discount-badge">
            {discountPercentage}% OFF
          </div>
        )}

        <div className="price-original">
          <span className="label">De:</span>
          <span className="value strikethrough">
            {formatCurrency(offer.pricing.originalPrice)}
          </span>
        </div>

        <div className="price-sale">
          <span className="label">Por apenas:</span>
          <span className="value" style={{ 
            color: 'var(--color-success)',
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            {formatCurrency(offer.pricing.salePrice)}
          </span>
        </div>

        <div className="installments">
          ou {installmentText}
        </div>
      </div>

      {showFeatures && (
        <div className="offer-features">
          <h3>O que você vai receber:</h3>
          <ul>
            <li>✅ {offer.features.totalLessons} aulas completas</li>
            <li>✅ {offer.features.accessType}</li>
            <li>✅ Formato {offer.features.format}</li>
            <li>✅ Garantia de {offer.guarantee.days} dias</li>
          </ul>
        </div>
      )}

      <div className="offer-description">
        <p>{offer.description}</p>
      </div>
    </section>
  );
};
```

**Critérios de Aceitação:**
- [ ] Exibe precificação corretamente
- [ ] Calcula desconto automaticamente
- [ ] Formata moeda brasileira (BRL)
- [ ] Suporta 3 layouts (card, inline, split)
- [ ] Integra com theme system
- [ ] Visual atrativo e profissional

---

#### 📋 Task 2.4: GuaranteeSection Component (1 dia)

**Arquivo:** `src/components/sections/GuaranteeSection.tsx`

```typescript
import React from 'react';
import { OfferSystem, ThemeSystem } from '@/types/template-v3.types';
import { useTheme } from '@/hooks/useTheme';

interface GuaranteeSectionProps {
  guarantee: OfferSystem['guarantee'];
  theme: ThemeSystem;
  icon?: string;
  variant?: 'badge' | 'card' | 'banner';
}

export const GuaranteeSection: React.FC<GuaranteeSectionProps> = ({
  guarantee,
  theme,
  icon = '✅',
  variant = 'card'
}) => {
  const { cssVariables } = useTheme(theme);

  return (
    <section
      className={`guarantee-section guarantee-${variant}`}
      style={{
        ...cssVariables,
        background: 'var(--color-background)',
        border: '2px solid var(--color-success)',
        borderRadius: 'var(--radius-large)',
        padding: 'var(--spacing-block)',
      }}
    >
      <div className="guarantee-icon" style={{ fontSize: '3rem' }}>
        {icon}
      </div>

      <div className="guarantee-content">
        <h3 style={{ 
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-success)'
        }}>
          Garantia de {guarantee.days} dias
        </h3>
        
        <p style={{ 
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text)'
        }}>
          {guarantee.description}
        </p>
      </div>
    </section>
  );
};
```

**Critérios de Aceitação:**
- [ ] Exibe dias de garantia
- [ ] 3 variantes visuais
- [ ] Integra com theme
- [ ] Ícone customizável

---

### 🟣 SPRINT 3: Remaining Components (5 dias)

**Objetivo:** Implementar 7 componentes restantes

#### Components a Implementar

1. **StyleProfileSection** (1 dia)
   - Exibe perfil do estilo do usuário
   - Cards com características
   - Cores e fontes personalizadas

2. **TransformationSection** (1 dia)
   - Antes/Depois visual
   - Timeline de transformação
   - Storytelling visual

3. **MethodStepsSection** (1 dia)
   - 5 passos da metodologia
   - Layout numerado
   - Ícones por passo

4. **BonusSection** (1 dia)
   - Lista de bônus
   - Valores agregados
   - Visual destacado

5. **SocialProofSection** (1 dia)
   - Depoimentos
   - Avatares
   - Ratings/avaliações

**Critérios Gerais:**
- [ ] Todos implementados com TypeScript
- [ ] Props tipadas
- [ ] Theme integration
- [ ] Responsivos
- [ ] Storybook stories
- [ ] Testes unitários

---

### 🔴 SPRINT 4: Integration & Testing (3 dias)

**Objetivo:** Integrar v3.0 no editor e testar

#### 📋 Task 4.1: Editor Integration (1,5 dias)

**Arquivo:** `src/components/editor/QuizModularProductionEditor.tsx`

```typescript
// Adicionar ao início do componente
import { TemplateAdapter } from '@/adapters/TemplateAdapter';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { TemplateV3 } from '@/types/template-v3.types';

// No método de render
const renderTemplate = (stepId: string) => {
  const template = templates[stepId];
  const version = TemplateAdapter.detectVersion(template);

  if (version === "3.0") {
    const templateV3 = template as TemplateV3;
    
    return (
      <div className="template-v3-container" style={cssVariables}>
        {templateV3.sections
          .sort((a, b) => a.order - b.order)
          .map(section => (
            <SectionRenderer
              key={section.id}
              section={section}
              theme={templateV3.theme}
              offer={templateV3.offer}
              userData={userData}
            />
          ))}
      </div>
    );
  } else {
    // v2.0 path (existente)
    return renderBlocksV2(template);
  }
};
```

**Critérios de Aceitação:**
- [ ] Detecta v3.0 automaticamente
- [ ] Renderiza step-20-v3.json corretamente
- [ ] Mantém v2.0 funcionando
- [ ] Sem regressões visuais
- [ ] Performance mantida

---

#### 📋 Task 4.2: End-to-End Testing (1 dia)

**Arquivos:** `src/__tests__/e2e/v3-migration.test.ts`

```typescript
describe('v3.0 Template Integration', () => {
  it('should load step-20 v3.0 template', async () => {
    const response = await fetch('/templates/step-20-v3.json');
    const template = await response.json();
    
    expect(template.templateVersion).toBe('3.0');
    expect(template.sections).toHaveLength(11);
  });

  it('should render all 11 sections', () => {
    render(<QuizModularProductionEditor stepId="step-20" />);
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('cta-primary')).toBeInTheDocument();
    expect(screen.getByTestId('offer-section')).toBeInTheDocument();
    // ... +8 assertions
  });

  it('should apply theme colors correctly', () => {
    const { container } = render(<HeroSection {...props} />);
    
    const styles = getComputedStyle(container.firstChild);
    expect(styles.getPropertyValue('--color-primary')).toBe('#B89B7A');
  });

  it('should track CTA clicks', async () => {
    const trackingMock = jest.fn();
    render(<CTAButton {...props} onTrack={trackingMock} />);
    
    fireEvent.click(screen.getByRole('link'));
    expect(trackingMock).toHaveBeenCalledWith({
      event: 'cta_click',
      sectionId: 'cta-primary'
    });
  });
});
```

**Critérios de Aceitação:**
- [ ] Cobertura mínima 80%
- [ ] Testes de integração passando
- [ ] Testes E2E no Playwright
- [ ] Visual regression tests

---

#### 📋 Task 4.3: Performance Optimization (0,5 dia)

**Otimizações:**

```typescript
// Lazy loading
const sections = React.lazy(() => import('./sections'));

// Memoization
const MemoizedSection = React.memo(SectionRenderer);

// Code splitting
const loadSection = (type: SectionType) => {
  return import(`./sections/${type}`);
};

// Image optimization
<Image
  src={offer.image}
  loading="lazy"
  decoding="async"
  width={800}
  height={600}
/>
```

**Métricas Alvo:**
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Bundle size < 150KB

---

### 🟠 SPRINT 5: Documentation & Rollout (2 dias)

**Objetivo:** Documentar e deployar

#### 📋 Task 5.1: Documentation (1 dia)

**Arquivos a criar:**

1. `docs/GUIA_MIGRACAO_V3.md`
   - Tutorial completo
   - Exemplos de código
   - Troubleshooting

2. `docs/API_SECTIONS.md`
   - Props de cada section
   - Exemplos de uso
   - Best practices

3. `docs/THEME_SYSTEM.md`
   - Design tokens
   - Customização
   - Exemplos visuais

4. Update `README.md`
   - Adicionar seção v3.0
   - Badge de versão
   - Quick start

**Critérios de Aceitação:**
- [ ] Documentação completa
- [ ] Exemplos funcionais
- [ ] Screenshots/GIFs
- [ ] Changelog atualizado

---

#### 📋 Task 5.2: Gradual Rollout (1 dia)

**Estratégia:**

```typescript
// Feature flag
const V3_ENABLED = process.env.NEXT_PUBLIC_V3_ENABLED === 'true';

// A/B testing
const shouldUseV3 = () => {
  const rolloutPercentage = 10; // 10% dos usuários
  return Math.random() * 100 < rolloutPercentage;
};

// Canary deployment
if (V3_ENABLED && (stepId === 'step-20' || shouldUseV3())) {
  return renderV3(template);
}
```

**Fases:**

1. ✅ **Alpha** (Dia 1): Dev environment only
2. 🔵 **Beta** (Dia 2-3): 10% tráfego staging
3. 🟡 **Canary** (Dia 4-5): 10% tráfego produção
4. 🟢 **Full** (Dia 6-7): 100% step-20

**Monitoramento:**

```typescript
// Métricas a acompanhar
- Conversion rate (step-20)
- Bounce rate
- Time on page
- CTA click rate
- Error rate
- Performance metrics
```

---

## 📊 TASKS POR PRIORIDADE

### 🔴 P0 - Crítico (Bloqueadores)

| Task | Descrição | Sprint | Dias |
|------|-----------|--------|------|
| 1.1 | TypeScript Types | 1 | 1 |
| 1.2 | Template Adapter | 1 | 1.5 |
| 1.3 | Section Renderer | 1 | 1.5 |
| 2.1 | HeroSection | 2 | 1.5 |
| 2.2 | CTAButton | 2 | 1 |
| 4.1 | Editor Integration | 4 | 1.5 |

**Total P0:** 8 dias

---

### 🟡 P1 - Alto (Essenciais)

| Task | Descrição | Sprint | Dias |
|------|-----------|--------|------|
| 1.4 | Theme Hook | 1 | 1 |
| 2.3 | OfferSection | 2 | 1.5 |
| 2.4 | GuaranteeSection | 2 | 1 |
| 3.1-3.5 | Remaining 7 Components | 3 | 5 |
| 4.2 | E2E Testing | 4 | 1 |

**Total P1:** 9.5 dias

---

### 🟢 P2 - Médio (Importantes)

| Task | Descrição | Sprint | Dias |
|------|-----------|--------|------|
| 4.3 | Performance Optimization | 4 | 0.5 |
| 5.1 | Documentation | 5 | 1 |
| 5.2 | Gradual Rollout | 5 | 1 |

**Total P2:** 2.5 dias

---

## ✅ CRITÉRIOS DE ACEITAÇÃO GLOBAIS

### Funcionalidade

- [ ] Step-20 v3.0 renderiza perfeitamente
- [ ] Todas as 11 sections funcionam
- [ ] Theme system aplicado corretamente
- [ ] Offer data exibida corretamente
- [ ] CTAs rastreados no analytics
- [ ] Garantia exibida de forma clara

### Qualidade

- [ ] TypeScript strict mode (sem `any`)
- [ ] ESLint 0 warnings
- [ ] Prettier formatado
- [ ] Cobertura de testes ≥ 80%
- [ ] Acessibilidade WCAG 2.1 AA

### Performance

- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Bundle v3 < 150KB
- [ ] Images otimizadas (WebP)

### Compatibilidade

- [ ] v2.0 templates funcionam
- [ ] v3.0 templates funcionam
- [ ] Mobile responsive
- [ ] Cross-browser (Chrome, Firefox, Safari)
- [ ] A11y keyboard navigation

---

## ⚠️ RISCOS E MITIGAÇÕES

### 🔴 Risco 1: Breaking Changes no Editor

**Probabilidade:** Média  
**Impacto:** Alto

**Mitigação:**
- Adapter pattern isola mudanças
- Feature flag para rollback rápido
- Testes de regressão automatizados

---

### 🟡 Risco 2: Performance Degradation

**Probabilidade:** Baixa  
**Impacto:** Médio

**Mitigação:**
- Lazy loading de components
- Code splitting por section
- Monitoring com Web Vitals
- Otimização de bundles

---

### 🟡 Risco 3: Complexidade de Migração

**Probabilidade:** Média  
**Impacto:** Médio

**Mitigação:**
- Documentação detalhada
- Exemplos práticos
- Suporte via Slack/Discord
- Video tutorials

---

### 🟢 Risco 4: User Confusion

**Probabilidade:** Baixa  
**Impacto:** Baixo

**Mitigação:**
- Mudanças visuais mínimas
- A/B testing antes do rollout
- Feedback loop com usuários
- Rollback plan pronto

---

## 🔄 ROLLBACK PLAN

### Estratégia de Rollback

```typescript
// 1. Feature flag OFF
process.env.NEXT_PUBLIC_V3_ENABLED = 'false';

// 2. Reverter para v2.0
const template = templates[stepId];
return renderBlocksV2(template);

// 3. Deploy automático
git revert <commit-v3>
git push origin main
```

### Triggers para Rollback

- Error rate > 5%
- Conversion rate drop > 20%
- Performance degradation > 30%
- Critical bugs reportados

### Tempo de Rollback

- **Automático:** < 5 minutos (feature flag)
- **Manual:** < 30 minutos (revert + deploy)

---

## 📈 MÉTRICAS DE SUCESSO

### KPIs Principais

| Métrica | Baseline (v2.0) | Meta (v3.0) | Método |
|---------|-----------------|-------------|--------|
| **Conversion Rate** | X% | X*1.15% | Google Analytics |
| **Time on Page** | Ys | Y*1.2s | GA4 |
| **CTA Click Rate** | Z% | Z*1.25% | Custom events |
| **Bounce Rate** | W% | W*0.9% | GA4 |
| **Page Load Time** | 800ms | <600ms | Web Vitals |

### Métricas Técnicas

| Métrica | Target | Ferramenta |
|---------|--------|------------|
| **Test Coverage** | ≥80% | Jest |
| **Bundle Size** | <150KB | Webpack Analyzer |
| **Lighthouse Score** | ≥90 | Lighthouse CI |
| **Error Rate** | <1% | Sentry |
| **Build Time** | <3min | GitHub Actions |

---

## 📚 RECURSOS E REFERÊNCIAS

### Documentos Relacionados

- `ANALISE_TEMPLATE_V3_COMPLETA.md` - Análise técnica detalhada
- `RECOMENDACAO_OPCAO_2.md` - Script generator (v2.0)
- `GUIA_SISTEMA_TEMPLATES.md` - Sistema atual

### Templates

- `templates/step-20-v3.json` - Template v3.0 completo (21KB)
- `templates/step-20-template.json` - Template v2.0 (1.3KB)

### Stack Tecnológico

- **Frontend:** React 18, TypeScript 5, Tailwind CSS
- **Animations:** Framer Motion
- **Testing:** Jest, React Testing Library, Playwright
- **Build:** Webpack 5, SWC
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry, Google Analytics

---

## 👥 RESPONSABILIDADES

### Desenvolvimento

- **TypeScript Types:** Dev 1
- **Adapter + Renderer:** Dev 1
- **Core Components (4):** Dev 1
- **Remaining Components (7):** Dev 1
- **Integration:** Dev 1

### QA

- **Unit Tests:** Dev 1
- **E2E Tests:** QA Lead
- **Visual Regression:** QA Lead
- **Performance Tests:** QA Lead

### DevOps

- **CI/CD Setup:** DevOps
- **Feature Flags:** DevOps
- **Monitoring:** DevOps
- **Rollout:** DevOps

---

## 📅 CRONOGRAMA VISUAL

```
Semana 1: ██████████ Sprint 1 (Infraestrutura)
Semana 2: ██████████ Sprint 2 (Core Components)
Semana 3: ██████████ Sprint 3 (Remaining) + Sprint 4 (Testing)
Semana 4: █████      Sprint 5 (Docs + Rollout)
```

---

## ✅ CHECKLIST FINAL

### Antes do Deploy

- [ ] Todos os testes passando (unit + E2E)
- [ ] Code review completo
- [ ] Performance metrics OK
- [ ] Documentação atualizada
- [ ] Feature flag configurada
- [ ] Rollback plan testado
- [ ] Staging validation OK
- [ ] Stakeholders aprovaram

### Durante Deploy

- [ ] Canary deployment (10%)
- [ ] Monitorar métricas (30min)
- [ ] Aumentar para 50%
- [ ] Monitorar (1h)
- [ ] Full rollout (100%)
- [ ] Monitorar (24h)

### Pós-Deploy

- [ ] Retrospectiva do sprint
- [ ] Documentar lessons learned
- [ ] Atualizar métricas baseline
- [ ] Planejar próximas migrations (steps 1-19, 21)
- [ ] Celebrar! 🎉

---

**Última atualização:** 12/10/2025  
**Status:** 🟢 Pronto para iniciar  
**Próxima ação:** Criar branch feature/v3-migration
