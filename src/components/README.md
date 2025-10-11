# 📚 Component Library - Quiz Quest Challenge Verse

## 🎯 Visão Geral

Esta biblioteca organiza todos os componentes do Quiz Quest em uma estrutura modular e escalável, facilitando importações e manutenção.

## 📦 Estrutura Principal

```
src/components/
├── quiz/                    # Componentes do Quiz
│   ├── builder/            # Construtor de Quiz
│   ├── editor/             # Editor de Quiz
│   ├── offer/              # Página de Oferta
│   ├── result-pages/       # Páginas de Resultado
│   └── components/         # Componentes Visuais
├── result/                  # Páginas de Resultado
│   ├── editor/             # Editor de Resultado
│   └── blocks/             # Blocos de Conteúdo
├── dashboard/              # Dashboard e Analytics
├── editor/                 # Editor Universal
└── funnel/                 # Funis de Vendas
```

## 🚀 Como Usar

### Importações Simplificadas

Ao invés de importar com caminhos profundos:

```typescript
// ❌ Forma antiga
import QuizApp from '@/components/quiz/QuizApp';
import IntroStep from '@/components/quiz/IntroStep';
import QuestionStep from '@/components/quiz/QuestionStep';
```

Use barrel exports organizados:

```typescript
// ✅ Forma nova
import { QuizApp, IntroStep, QuestionStep } from '@/components/quiz';
```

### Exemplos de Importação por Feature

#### 📝 Quiz Components

```typescript
// Componentes principais
import { 
  QuizApp, 
  QuizNavigation, 
  Quiz21StepsProvider 
} from '@/components/quiz';

// Steps do Quiz
import { 
  IntroStep, 
  QuestionStep, 
  ResultStep, 
  OfferStep 
} from '@/components/quiz';

// Componentes de UI
import { 
  QuizOption, 
  QuizProgress, 
  QuizHeader 
} from '@/components/quiz';

// Sub-módulos
import { QuizBuilder, EnhancedQuizBuilder } from '@/components/quiz/builder';
import { QuizEditor, QuestionEditor } from '@/components/quiz/editor';
```

#### 🎨 Result Components

```typescript
// Layout
import { 
  HeroSection, 
  PricingSection, 
  SecondaryStylesSection 
} from '@/components/result';

// Blocos de Conteúdo
import { 
  TestimonialsBlock, 
  GuaranteeBlock, 
  BonusBlock 
} from '@/components/result/blocks';

// Editor
import { 
  SectionEditor, 
  ColorPicker, 
  HeroSectionBlockEditor 
} from '@/components/result/editor';
```

#### 🏗️ Builder Components

```typescript
// Construtor de Quiz
import { 
  QuizBuilder, 
  EnhancedQuizBuilder,
  ComponentsSidebar,
  PropertiesPanel,
  PreviewPanel,
  StagesPanel
} from '@/components/quiz/builder';
```

#### 📊 Dashboard Components

```typescript
// Analytics
import { 
  AnalyticsDashboard,
  RealTimeDashboard,
  QuizFunnelCard 
} from '@/components/dashboard';
```

## 🎨 Padrões de Código

### Organização de Exports

Cada `index.ts` organiza exports por categoria:

```typescript
/**
 * 🎯 FEATURE NAME - Barrel Exports
 * 
 * Descrição da feature
 */

// Category 1: Main Components
export { Component1 } from './Component1';
export { Component2 } from './Component2';

// Category 2: Secondary Components
export { Component3 } from './Component3';

// Sub-modules
export * from './sub-module';
```

### Nomenclatura

- **PascalCase**: Componentes React (`QuizApp`, `QuizBuilder`)
- **camelCase**: Hooks e funções (`useQuiz`, `validateAnswer`)
- **UPPER_CASE**: Constantes (`MAX_QUESTIONS`, `DEFAULT_THEME`)

## 📋 Checklist de Adição de Componentes

Ao adicionar um novo componente:

1. ✅ Criar o componente na pasta apropriada
2. ✅ Adicionar export no `index.ts` da pasta
3. ✅ Categorizar adequadamente (Main, UI, System, etc.)
4. ✅ Adicionar JSDoc comentário descritivo
5. ✅ Validar que o componente pode ser importado
6. ✅ Atualizar este README se necessário

## 🔧 Manutenção

### Verificar Imports Não Utilizados

```bash
# Buscar imports diretos (devem usar barrel exports)
grep -r "from '@/components/quiz/" src/ --include="*.tsx" --include="*.ts"
```

### Validar Exports

```bash
# Verificar se todos os componentes estão exportados
find src/components/quiz -name "*.tsx" -type f -exec basename {} .tsx \; | sort
cat src/components/quiz/index.ts | grep "export"
```

## 📚 Recursos Adicionais

- [Documentação TypeScript](https://www.typescriptlang.org/docs/)
- [Barrel Exports Best Practices](https://basarat.gitbook.io/typescript/main-1/barrel)
- [Component Organization Patterns](https://reactjs.org/docs/file-structure.html)

## 🎯 Próximos Passos

Sprint 2 - Tarefas Restantes:

- [ ] Task 3: Implementar lazy loading para componentes
- [ ] Task 4: Otimizar bundle size (code splitting)
- [ ] Task 5: Adicionar testes automatizados

---

**Última atualização:** Sprint 2 - Task 2 Concluída  
**Mantido por:** Equipe Quiz Quest
