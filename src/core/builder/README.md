# 🏗️ Builder System - Sistema de Construção Avançado

Sistema moderno e robusto para construção de componentes, funis e layouts do Quiz Quest Challenge Verse usando **Builder Pattern** com validação automática, templates predefinidos e otimizações inteligentes.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Instalação](#-instalação)
- [Builders Disponíveis](#-builders-disponíveis)
- [Guia de Uso](#-guia-de-uso)
- [Templates](#-templates)
- [Validação](#-validação)
- [Exemplos Práticos](#-exemplos-práticos)
- [API Reference](#-api-reference)
- [Contribuição](#-contribuição)

## 🎯 Visão Geral

O Builder System oferece três builders principais:

### 🧩 ComponentBuilder
Cria componentes individuais (perguntas, capturas de lead, hero sections, etc.) com validação automática e suporte a templates.

### 🔄 FunnelBuilder  
Constrói funis completos com múltiplas etapas, lógica de fluxo, analytics e otimizações automáticas.

### 🎨 UIBuilder
Gera layouts responsivos, temas customizados, animações e configurações de acessibilidade.

## 📦 Instalação

```typescript
import {
  ComponentBuilder,
  FunnelBuilder, 
  UIBuilder,
  createQuizQuestion,
  createFunnelFromTemplate,
  createQuizLayout
} from '@/core/builder';
```

## 🏗️ Builders Disponíveis

### ComponentBuilder

```typescript
const pergunta = createQuizQuestion()
  .withProperty('questionType', 'single-choice')
  .withContentField('question', 'Qual sua cor favorita?')
  .withContentField('options', ['Azul', 'Verde', 'Vermelho'])
  .withProperty('required', true)
  .build();
```

### FunnelBuilder

```typescript
const funil = new FunnelBuilder('Meu Quiz')
  .addStep('Introdução')
    .addComponentFromTemplate('hero-section')
    .complete()
  .addStep('Perguntas')
    .addComponent(perguntaComponent)
    .complete()
  .autoConnect()
  .optimize()
  .build();
```

### UIBuilder

```typescript
const layout = createQuizLayout('Layout Moderno')
  .withTheme('modern-blue')
  .withEntranceAnimation('fade', 300)
  .optimizeForMobile()
  .build();
```

## 🎨 Templates

### Templates de Componentes

```typescript
import { fromTemplate } from '@/core/builder';

// Quiz components
const perguntaSimples = fromTemplate('simple-question');
const multiplaEscolha = fromTemplate('multiple-choice');
const entradaTexto = fromTemplate('text-input');

// Lead capture
const capturaEmail = fromTemplate('email-capture');
const capturaCompleta = fromTemplate('full-lead-capture');

// Content blocks  
const heroSection = fromTemplate('hero-section');
const infoCard = fromTemplate('info-card');
```

### Templates de Funis

```typescript
import { createFunnelFromTemplate } from '@/core/builder';

// Funis predefinidos
const qualificacaoLead = createFunnelFromTemplate('lead-qualification');
const quizProduto = createFunnelFromTemplate('product-quiz');
const satisfacaoCliente = createFunnelFromTemplate('customer-satisfaction');
```

### Templates de Layout

```typescript
import { createQuizLayout, createLandingLayout } from '@/core/builder';

// Layouts otimizados
const layoutQuiz = createQuizLayout('Meu Quiz');
const layoutLanding = createLandingLayout('Landing Page');
```

## ✅ Validação

### Validação Automática

```typescript
const resultado = builder.build();

if (resultado.validation.isValid) {
  console.log('✅ Componente válido');
} else {
  console.log('❌ Erros:', resultado.validation.errors);
  console.log('⚠️ Avisos:', resultado.validation.warnings);
}
```

### Validação Standalone

```typescript
import { validateComponent } from '@/core/builder';

const validacao = validateComponent(meuComponente);
console.log('Válido:', validacao.isValid);
```

## 🚀 Exemplos Práticos

### 1. Quiz Simples

```typescript
// Criar pergunta
const pergunta = createQuizQuestion()
  .withContentField('question', 'Como você prefere trabalhar?')
  .withContentField('options', ['Em equipe', 'Sozinho', 'Flexível'])
  .withProperty('required', true)
  .build();

// Criar captura de dados
const captura = fromTemplate('email-capture')
  .withContentField('title', 'Receba seus resultados!')
  .build();

// Montar funil
const funil = new FunnelBuilder('Quiz de Trabalho')
  .addStep('Pergunta Principal')
    .addComponent(pergunta.component)
    .complete()
  .addStep('Captura de Email')
    .addComponent(captura.component)
    .complete()
  .autoConnect()
  .build();
```

### 2. Landing Page Otimizada

```typescript
// Criar hero section
const hero = fromTemplate('hero-section')
  .withContentField('title', 'Descubra Seu Potencial')
  .withContentField('subtitle', 'Quiz gratuito em 3 minutos')
  .withContentField('buttonText', 'Começar Agora')
  .build();

// Criar layout responsivo
const layout = createLandingLayout('Landing Principal')
  .withTheme('warm-orange')
  .withFullAccessibility()
  .withEntranceAnimation('scale', 500)
  .optimize()
  .build();

// Gerar CSS
const css = new UIBuilder('', 'single-column').generateCSS();
```

### 3. Funil de Lead Qualification

```typescript
const funil = createFunnelFromTemplate('lead-qualification')
  .withDescription('Qualifique leads para consultoria')
  .withSettings({
    showProgress: true,
    allowBackward: false,
    saveProgress: true
  })
  .withAnalytics({
    trackingEnabled: true,
    events: ['step_complete', 'lead_qualified']
  })
  .optimize()
  .build();
```

### 4. Validação Avançada

```typescript
// Componente com validação customizada
const builder = new ComponentBuilder('quiz-question')
  .withContentField('question', 'Pergunta teste')
  .withContentField('options', ['A', 'B']);

// Adicionar validação extra
const resultado = builder.build();

if (resultado.validation.warnings.length > 0) {
  console.log('⚠️ Sugestões:', resultado.suggestions);
  console.log('🔧 Otimizações:', resultado.optimizations);
}
```

## 📚 API Reference

### ComponentBuilder

#### Métodos Principais
- `withId(id: string)` - Define ID customizado
- `withProperty(key: string, value: any)` - Adiciona propriedade
- `withContentField(key: string, value: any)` - Adiciona conteúdo
- `withStyle(style: object)` - Define estilos
- `fromTemplate(name: string)` - Aplica template
- `build()` - Constrói o componente
- `validate()` - Valida configuração

#### Factory Functions
- `createQuizQuestion(context?)` - Cria pergunta de quiz
- `createLeadCapture(context?)` - Cria captura de lead
- `createHero(context?)` - Cria seção hero
- `fromTemplate(templateName, context?)` - Cria de template

### FunnelBuilder

#### Métodos Principais
- `withDescription(desc: string)` - Define descrição
- `withTheme(theme: string)` - Configura tema
- `withSettings(settings: object)` - Configura comportamentos
- `addStep(name: string)` - Adiciona nova etapa
- `autoConnect()` - Conecta etapas automaticamente
- `optimize()` - Otimiza o funil
- `build()` - Constrói o funil

#### StepBuilder
- `addComponent(builder: ComponentBuilder)` - Adiciona componente
- `addComponentFromTemplate(name: string)` - Adiciona de template
- `withMetadata(metadata: object)` - Configura metadados
- `required(isRequired: boolean)` - Marca como obrigatória
- `complete()` - Finaliza etapa

### UIBuilder

#### Métodos Principais
- `withTheme(themeName: string)` - Aplica tema predefinido
- `withGrid(config: object)` - Configura grid
- `withBreakpoints(breakpoints: object)` - Define responsividade
- `withAnimation(animation: object)` - Adiciona animação
- `withAccessibility(config: object)` - Configura acessibilidade
- `optimize()` - Otimiza layout
- `generateCSS()` - Gera CSS final
- `build()` - Constrói layout

## 🎯 Padrões de Uso

### 1. Construção Fluente
```typescript
const resultado = createQuizQuestion()
  .withProperty('required', true)
  .withContentField('question', 'Sua pergunta aqui')
  .withStyle({ borderRadius: '8px' })
  .build();
```

### 2. Validação Defensiva
```typescript
const safe = builder.buildSafe();
if (safe) {
  // Usar o componente válido
  processComponent(safe);
} else {
  // Tratar erro de validação
  handleValidationError();
}
```

### 3. Templates com Customização
```typescript
const customizado = fromTemplate('email-capture')
  .withContentField('title', 'Título personalizado')
  .withProperty('validateEmail', true)
  .withStyle({ theme: 'dark' })
  .build();
```

### 4. Pipeline Condicional
```typescript
const builder = new ComponentBuilder('quiz-question');

if (isAdvancedMode) {
  builder.withProperty('showScoring', true);
}

if (mobileLayout) {
  builder.withStyle({ mobileFirst: true });
}

const result = builder.build();
```

## 🔧 Configuração e Extensão

### Adicionando Novos Templates

```typescript
// Em ComponentBuilder.ts
export const COMPONENT_TEMPLATES = {
  'meu-template': {
    type: 'custom-type',
    properties: { /* configurações */ },
    content: { /* conteúdo padrão */ }
  }
};
```

### Validações Customizadas

```typescript
// Extender o builder com validação extra
const customBuilder = new ComponentBuilder('quiz-question');
const originalBuild = customBuilder.build;

customBuilder.build = function() {
  const result = originalBuild.call(this);
  // Adicionar validação customizada
  return result;
};
```

## 🚀 Performance e Otimização

### Lazy Loading
```typescript
// Componentes são marcados para lazy loading automaticamente
builder.optimize(); // Habilita lazy loading
```

### Minificação de CSS
```typescript
const layout = createQuizLayout('Meu Layout')
  .optimize() // Remove CSS desnecessário
  .build();
```

### Validação em Lote
```typescript
const components = [comp1, comp2, comp3];
const validations = components.map(validateComponent);
const allValid = validations.every(v => v.isValid);
```

## 🤝 Contribuição

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Diretrizes

- Mantenha o padrão Builder Pattern
- Adicione testes para novas funcionalidades
- Atualize a documentação
- Use TypeScript strict mode
- Valide com ESLint

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

**Quiz Quest Challenge Verse** - Sistema de builders para criação de quizzes e funis interativos.
