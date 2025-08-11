# 🎯 PLANO DE EXECUÇÃO - 21 ETAPAS DO FUNIL

## 📋 **VISÃO GERAL**

Implementar as 21 etapas do funil de Quiz de Estilo Pessoal no editor-fixed com base nos templates JSON especificados e sistema de propriedades universal.

## 🎨 **ESPECIFICAÇÕES DO DESIGN**

```json
{
  "primaryColor": "#B89B7A",
  "secondaryColor": "#432818",
  "accentColor": "#aa6b5d",
  "backgroundColor": "#FAF9F7",
  "fontFamily": "'Playfair Display', 'Inter', serif"
}
```

## 🚀 **FASE 1: ESTRUTURA BASE**

### 1.1 Verificar e corrigir templates JSON

- [ ] Gerar todos os 21 templates JSON se faltando
- [ ] Validar estrutura JSON de cada template
- [ ] Configurar sistema de carregamento dinâmico

### 1.2 Atualizar configuração dos componentes

- [ ] Definir tipos TypeScript para cada etapa
- [ ] Atualizar registry de componentes
- [ ] Configurar propriedades editáveis por tipo

## 🧩 **FASE 2: COMPONENTES CORE**

### 2.1 Componentes de Quiz (Etapas 1-14)

```typescript
interface QuizStepProps {
  title: string;
  description?: string;
  options: QuizOption[];
  multiSelect: number;
  autoAdvance: boolean;
  validationMessage: string;
}
```

### 2.2 Componentes de Transição (Etapas 15-16, 19)

```typescript
interface TransitionProps {
  title: string;
  description: string;
  backgroundImage?: string;
  showProgress: boolean;
  delay?: number;
}
```

### 2.3 Componentes de Resultado (Etapas 17-18)

```typescript
interface ResultProps {
  styles: StyleResult[];
  cta: CTAConfig;
  bonus: BonusItem[];
  personalization: PersonalizationData;
}
```

### 2.4 Componentes de Conversão (Etapas 20-21)

```typescript
interface ConversionProps {
  leadForm: LeadFormConfig;
  offer: OfferConfig;
  pricing: PricingConfig;
  guarantee: string;
}
```

## 🎨 **FASE 3: PAINEL DE PROPRIEDADES**

### 3.1 Propriedades por Categoria

```typescript
// Para componentes de Quiz
const quizProperties = {
  content: ["title", "description", "validationMessage"],
  behavior: ["multiSelect", "autoAdvance", "showProgress"],
  styling: ["primaryColor", "layout", "imageSize"],
  validation: ["minSelections", "maxSelections", "required"],
};

// Para componentes de Transição
const transitionProperties = {
  content: ["title", "description"],
  visual: ["backgroundImage", "textColor", "animation"],
  behavior: ["delay", "autoAdvance", "showProgress"],
};
```

### 3.2 Controles Visuais Inteligentes

- [ ] ColorPicker para cores do tema
- [ ] SizeSlider para dimensões de componentes
- [ ] AlignmentButtons para alinhamento
- [ ] ImageUploader para imagens de opções
- [ ] FontSelector para tipografia

## ⚡ **FASE 4: LÓGICA DE NEGÓCIO**

### 4.1 Sistema de Pontuação

```typescript
interface ScoringSystem {
  categories: StyleCategory[];
  weights: { questions: 0.7; strategic: 0.3 };
  calculation: "sum-by-category";
  tieBreaker: "first-selected";
}

const styleCategories = [
  "Natural",
  "Clássico",
  "Contemporâneo",
  "Elegante",
  "Romântico",
  "Sexy",
  "Dramático",
  "Criativo",
];
```

### 4.2 Regras de Navegação

```typescript
interface NavigationRules {
  intro: { activateOn: "name-filled" };
  questions: {
    activateOn: "min-selections";
    autoAdvance: true;
    stages: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  };
  strategic: {
    activateOn: "single-selection";
    autoAdvance: false;
    manualClick: true;
  };
}
```

### 4.3 Analytics e Tracking

```typescript
interface AnalyticsEvents {
  quiz_started: { timestamp: Date; utm: UTMParams };
  question_answered: { step: number; selections: string[]; time: number };
  quiz_completed: { totalTime: number; result: string };
  conversion: { step: number; action: string; value?: number };
}
```

## 🔧 **FASE 5: FUNCIONALIDADES AVANÇADAS**

### 5.1 Sistema de Templates Dinâmicos

- [ ] Carregamento lazy de templates por demanda
- [ ] Cache de templates para performance
- [ ] Preview de templates no painel
- [ ] Export/import de configurações

### 5.2 Modo Preview Inteligente

```typescript
interface PreviewModes {
  desktop: { width: "100%"; responsive: true };
  tablet: { width: "768px"; scale: 0.8 };
  mobile: { width: "375px"; scale: 0.6 };
}
```

### 5.3 Validação em Tempo Real

- [ ] Validação de propriedades obrigatórias
- [ ] Preview de mudanças instantâneo
- [ ] Sugestões automáticas de melhorias
- [ ] Detecção de erros de configuração

## 📱 **MAPEAMENTO DAS 21 ETAPAS**

### 🏠 **Etapa 1: Introdução**

```json
{
  "type": "intro",
  "components": [
    "quiz-intro-header",
    "heading-inline",
    "text-inline",
    "image-hero",
    "input-field",
    "button-primary"
  ],
  "properties": {
    "inputType": "text",
    "validation": { "minLength": 2 },
    "buttonActivation": "name-required"
  }
}
```

### 🔵 **Etapas 2-14: Questões Principais**

```json
{
  "type": "question",
  "components": ["quiz-intro-header", "text-inline", "options-grid", "button-inline"],
  "properties": {
    "multiSelect": 3,
    "autoAdvance": true,
    "layout": "2col",
    "imageSize": { "width": 256, "height": 256 }
  }
}
```

### 🔄 **Etapa 15: Transição Principal**

```json
{
  "type": "transition",
  "components": ["quiz-intro-header", "text-inline", "loading-animation"],
  "properties": {
    "backgroundImage": "transition-bg.webp",
    "delay": 3000,
    "showProgress": false
  }
}
```

### 🎯 **Etapas 16-18: Questões Estratégicas**

```json
{
  "type": "strategic",
  "components": ["quiz-intro-header", "text-inline", "options-grid", "button-inline"],
  "properties": {
    "multiSelect": 1,
    "autoAdvance": false,
    "layout": "1col",
    "imageSize": { "width": 400, "height": 256 }
  }
}
```

### ✨ **Etapa 19: Processamento**

```json
{
  "type": "processing",
  "components": ["quiz-intro-header", "text-inline", "progress-animation"],
  "properties": {
    "calculationTime": 2000,
    "showCalculation": true,
    "animationType": "pulse"
  }
}
```

### 🏆 **Etapas 20-21: Resultado + Conversão**

```json
{
  "type": "result",
  "components": ["quiz-intro-header", "result-card", "cta-section", "bonus-grid"],
  "properties": {
    "personalizedContent": true,
    "showSecondaryStyles": true,
    "ctaText": "Ver Guia Completo"
  }
}
```

## 🎨 **COMANDOS PRETTIER INTELIGENTES**

### Formatação Automática por Lotes

```bash
# Formatar todos os templates JSON
npx prettier --write "templates/**/*.json"

# Formatar componentes React do editor
npx prettier --write "src/components/editor/**/*.{ts,tsx}"

# Formatar contextos e hooks
npx prettier --write "src/{context,hooks}/**/*.{ts,tsx}"

# Verificar formatação sem alterar arquivos
npx prettier --check "src/**/*.{ts,tsx,json}"
```

### Scripts NPM Customizados

```json
{
  "scripts": {
    "format:editor": "prettier --write 'src/components/editor/**/*.{ts,tsx}'",
    "format:templates": "prettier --write 'templates/**/*.json'",
    "format:funnel": "prettier --write 'src/**/*{funnel,quiz,step}*.{ts,tsx}'",
    "check:all": "prettier --check 'src/**/*.{ts,tsx,json}' && tsc --noEmit"
  }
}
```

## 📊 **CRONOGRAMA DE IMPLEMENTAÇÃO**

### **Semana 1: Fundação**

- ✅ Análise completa da estrutura atual
- 🔄 Geração de todos os 21 templates JSON
- 🔧 Configuração do sistema de propriedades universal
- 🎨 Aplicação do Prettier em todos os arquivos

### **Semana 2: Componentes Core**

- 🧩 Implementação dos 5 tipos de componentes principais
- 🎯 Sistema de validação em tempo real
- 🔄 Integração com EditorContext unificado
- 📱 Testes de responsividade

### **Semana 3: Lógica de Negócio**

- ⚡ Sistema de pontuação e cálculos
- 🚀 Regras de navegação automática/manual
- 📊 Analytics e tracking de eventos
- 🎨 Personalização dinâmica de conteúdo

### **Semana 4: Refinamento**

- 🔍 Testes completos em todas as 21 etapas
- 🎨 Aplicação final do design system
- ⚡ Otimização de performance
- 📋 Documentação completa

## 🎯 **CRITÉRIOS DE SUCESSO**

### ✅ **Funcionalidades Obrigatórias**

- [ ] 21 etapas funcionando perfeitamente
- [ ] Sistema de propriedades universal operacional
- [ ] Drag & drop entre etapas
- [ ] Preview em tempo real
- [ ] Validação completa
- [ ] Sistema de pontuação funcionando
- [ ] Navegação automática/manual
- [ ] Personalização por propriedades

### 🎨 **Qualidade Visual**

- [ ] Design system aplicado consistentemente
- [ ] Responsividade em todos os viewports
- [ ] Animações suaves e profissionais
- [ ] Tipografia e cores corretas
- [ ] Imagens otimizadas e carregamento rápido

### ⚡ **Performance**

- [ ] Carregamento inicial < 2s
- [ ] Transições entre etapas < 300ms
- [ ] Templates carregados sob demanda
- [ ] Código formatado com Prettier
- [ ] Zero erros TypeScript

## 🔧 **PRÓXIMOS PASSOS IMEDIATOS**

1. **Executar análise completa**: `npm run dev` + abrir `/editor-fixed`
2. **Gerar templates JSON faltantes**: Script automatizado
3. **Aplicar Prettier**: Formatação em lote
4. **Implementar componentes base**: Quiz, Transição, Resultado
5. **Configurar painel de propriedades**: Controles visuais inteligentes

---

**🚀 Pronto para implementação! Cada etapa será executada com precisão, mantendo a qualidade e seguindo as especificações do JSON.**
