# 📋 **GUIA COMPLETO DE CONFIGURAÇÕES - Quiz21StepsComplete.ts**

## 🎯 **RESUMO EXECUTIVO**

O arquivo `quiz21StepsComplete.ts` define um sistema completo de quiz com **3 tipos diferentes de questões**:
1. **Questões do Quiz (Etapas 2-11)** - Múltiplas seleções obrigatórias com pontuação
2. **Questões Estratégicas (Etapas 13-18)** - Seleção única para personalização
3. **Páginas Especiais** - Coleta de dados, transições, resultados e ofertas

---

## 📐 **CONFIGURAÇÕES DE IMAGENS**

### **Tamanhos Padrão por Tipo de Questão:**

#### **Questões do Quiz (Com Imagens):**
```typescript
imageSize: 'custom',
imageWidth: 300,        // 300px de largura
imageHeight: 300,       // 300px de altura (quadrado)
```

#### **Questões Estratégicas (Sem Imagens):**
```typescript
showImages: false,      // Sem imagens - apenas texto
```

#### **Páginas de Resultado:**
```typescript
imageWidth: 380,        // 380px (imagens maiores para destaque)
imageHeight: 380,
```

#### **Ofertas e CTAs:**
```typescript
imageWidth: 500,        // 500px (imagens promocionais)
imageHeight: 'auto',    // Altura automática
```

### **Configurações Responsivas:**
```typescript
responsiveColumns: true,    // Adapta colunas ao dispositivo
breakpoints: {
  sm: '640px',             // Mobile
  md: '768px',             // Tablet
  lg: '1024px',            // Desktop
  xl: '1280px'             // Desktop large
}
```

---

## 🔢 **CONFIGURAÇÕES DE COLUNAS**

### **REGRA PRINCIPAL:**

#### **✅ Opções COM Imagem + Texto:**
```typescript
columns: 2,                 // 2 colunas no desktop
responsiveColumns: true,    // Adapta: Mobile=1, Tablet=2, Desktop=2
showImages: true,          // Mostra imagens
```

#### **✅ Opções SÓ com Texto:**
```typescript
columns: 1,                 // SEMPRE 1 coluna
responsiveColumns: false,   // Não adapta
showImages: false,         // Sem imagens
```

### **Por Tipo de Questão:**

#### **Questões do Quiz (Etapas 2-11):**
```typescript
// COM IMAGENS
columns: 2,                 // 2 colunas no desktop
showImages: true,          // Mostra imagens 300x300px
responsiveColumns: true,    // Adapta: Mobile=1, Tablet=2, Desktop=2
```

#### **Questões Estratégicas (Etapas 13-18):**
```typescript
// APENAS TEXTO
columns: 1,                 // SEMPRE 1 coluna (texto longo)
showImages: false,         // Sem imagens
responsiveColumns: false,   // Não adapta
```

#### **Grid Responsivo para Imagens:**
- **Mobile (< 640px):** 1 coluna (mesmo com imagens)
- **Tablet (640px - 1024px):** 2 colunas (quando tem imagens)
- **Desktop (> 1024px):** 2 colunas (quando tem imagens)

---

## ✅ **REGRAS DE SELEÇÃO**

### **Questões do Quiz (Etapas 2-11):**
```typescript
multipleSelection: true,        // Permite múltiplas seleções
requiredSelections: 3,          // Exige 3 seleções
minSelections: 3,              // Mínimo: 3 opções
maxSelections: 3,              // Máximo: 3 opções
enableButtonOnlyWhenValid: true // Botão só ativa quando válido
```

### **Questões Estratégicas (Etapas 13-18):**
```typescript
multipleSelection: false,       // Apenas uma seleção
requiredSelections: 1,          // Exige 1 seleção
minSelections: 1,              // Mínimo: 1 opção
maxSelections: 1,              // Máximo: 1 opção
enableButtonOnlyWhenValid: true // Botão só ativa quando válido
```

### **Validação e Feedback:**
```typescript
showValidationFeedback: true,
validationMessage: 'Selecione 3 opções para continuar', // Quiz
validationMessage: 'Selecione 1 opção para continuar',  // Estratégica
progressMessage: 'Você selecionou {count} de {required} opções',
showSelectionCount: true
```

---

## 🚀 **AUTO-AVANÇO CONFIGURAÇÕES**

### **Questões do Quiz:**
```typescript
autoAdvanceOnComplete: true,    // Avança automaticamente
autoAdvanceDelay: 1500,        // 1.5 segundos de delay
```

### **Questões Estratégicas:**
```typescript
autoAdvanceOnComplete: true,    // Avança automaticamente
autoAdvanceDelay: 1200,        // 1.2 segundos de delay (mais rápido)
```

### **Formulários (Nome/Email):**
```typescript
autoAdvanceOnComplete: true,    // Avança automaticamente
autoAdvanceDelay: 600,         // 0.6 segundos (muito rápido)
```

---

## 🎨 **CONFIGURAÇÕES VISUAIS**

### **Estilos de Seleção - BORDA DOURADA FINA:**
```typescript
// Questões do Quiz
selectionStyle: 'border',       // Borda fina com sombra
selectedColor: '#F59E0B',       // Dourado amber-500
backgroundColor: '#FFFBEB',     // Fundo dourado claro amber-50
boxShadow: '0 0 0 1px rgba(245, 158, 11, 0.2), 0 2px 8px rgba(245, 158, 11, 0.15)',

// Questões Estratégicas  
selectionStyle: 'background',   // Fundo colorido sutil
selectionStyle: 'glow',        // Efeito glow dourado especial
```

### **Cores do Sistema:**
```typescript
primary: '#F59E0B',            // Dourado amber-500 (borda selecionada)
secondary: '#92400E',          // Dourado escuro amber-800 
accent: '#FEF3C7',            // Dourado claro amber-100 (fundo)
neutral: '#E5E7EB',           // Cinza claro (borda normal)
```

### **Efeitos Visuais:**
```typescript
// Seleção Padrão (border)
borderWidth: '1px',            // Borda bem fina
borderColor: '#F59E0B',        // Dourado
boxShadow: 'sutil com dourado',// Sombra dourada sutil
backgroundColor: '#FFFBEB',    // Fundo dourado claro

// Hover (não selecionado)
borderColor: '#F3F4F6',        // Cinza claro
boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Sombra sutil
```

### **Espaçamentos:**
```typescript
gridGap: 16,                   // 16px entre itens (quiz)
gridGap: 12,                   // 12px entre itens (estratégicas)
```

### **Animações:**
```typescript
animationType: 'scale',        // Efeito de escala ao clicar
animationType: 'fade',         // Efeito de fade
```

---

## 📊 **SISTEMA DE PONTUAÇÃO**

### **Questões do Quiz (Etapas 2-11):**
```typescript
scoreValues: {
  natural_q1: 1,              // Cada opção vale 1 ponto
  classico_q1: 1,             // Para sua categoria
  contemporaneo_q1: 1,
  elegante_q1: 1,
  romantico_q1: 1,
  sexy_q1: 1,
  dramatico_q1: 1,
  criativo_q1: 1,
},
```

### **Questões Estratégicas (Etapas 13-18):**
```typescript
// SEM pontuação - são para personalização e segmentação
// Armazenadas separadamente para recomendações personalizadas
```

---

## 🎯 **CONFIGURAÇÕES POR TIPO DE ETAPA**

### **📝 Etapa 1: Coleta de Nome**
- **Tipo:** Formulário simples
- **Auto-avanço:** 600ms
- **Validação:** Nome obrigatório

### **🎮 Etapas 2-11: Quiz Pontuado**
- **Seleções:** 3 obrigatórias
- **Imagens:** 300x300px, 2 colunas
- **Auto-avanço:** 1500ms
- **Pontuação:** 1 ponto por opção selecionada

### **🎯 Etapa 12: Transição**
- **Tipo:** Página informativa
- **Auto-avanço:** Automático com delay

### **💭 Etapas 13-18: Questões Estratégicas**
- **Seleções:** 1 obrigatória
- **Layout:** 1 coluna, sem imagens
- **Auto-avanço:** 1200ms
- **Função:** Personalização de recomendações

### **🏆 Etapa 19: Transição para Resultado**
- **Tipo:** Loading/Calculando
- **Auto-avanço:** Automático

### **📋 Etapa 20: Página de Resultado**
- **Imagens:** 380x380px
- **Layout:** Resultado personalizado
- **CTAs:** Botões de ação

### **💰 Etapa 21: Página de Oferta**
- **Imagens:** 500px width
- **Layout:** Página comercial
- **CTAs:** Conversão

---

## 🔧 **CONFIGURAÇÕES GLOBAIS NOCODE**

### **Responsividade:**
```typescript
layout: {
  maxWidth: '1200px',
  containerPadding: '1rem',
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px'
  }
}
```

### **Cores e Branding:**
```typescript
brandColors: {
  primary: '#B89B7A',          // Cor primária
  secondary: '#432818',        // Cor secundária
  accent: '#3B82F6',          // Cor de destaque
  background: '#FAF9F7',       // Fundo
  border: '#E6DDD4',          // Bordas
}
```

### **Performance:**
```typescript
optimization: {
  lazyLoading: true,          // Carregamento lazy de imagens
  imageCompression: true,     // Compressão automática
  cacheImages: true,          // Cache de imagens
  prefetchNext: true,         // Pré-carrega próxima etapa
}
```

---

### **📱 Adaptações MOBILE**

### **Colunas Responsivas - REGRA CLARA:**
- **Opções COM imagens:** Desktop=2 colunas, Mobile=1 coluna
- **Opções SÓ texto:** SEMPRE 1 coluna (qualquer dispositivo)

### **Layout por Dispositivo:**
```typescript
// COM IMAGENS (showImages: true)
Desktop/Tablet: 2 colunas
Mobile: 1 coluna (automático)

// SEM IMAGENS (showImages: false)  
Qualquer dispositivo: 1 coluna
```

### **Imagens Mobile:**
```typescript
mobileImageSize: {
  width: '100%',              // Largura total
  maxWidth: '280px',          // Máximo 280px
  aspectRatio: '1:1',         // Quadrado
}
```

### **Touch Otimizado:**
```typescript
touch: {
  minTouchArea: '44px',       // Área mínima para toque
  swipeGestures: false,       // Sem gestos de swipe
  tapAnimation: true,         // Animação no toque
}
```

---

## ⚡ **OTIMIZAÇÕES DE PERFORMANCE**

### **Carregamento:**
```typescript
performance: {
### **Configuração para Questão COM Imagens:**
```typescript
{
  properties: {
    showImages: true,            // Mostra imagens
    columns: 2,                 // 2 colunas no desktop
    responsiveColumns: true,     // Adapta para mobile
    imageWidth: 300,            // Imagem quadrada
    imageHeight: 300,
    requiredSelections: 3,       // Quiz: 3 seleções
    multipleSelection: true,
    autoAdvanceOnComplete: true,
    autoAdvanceDelay: 1500,
    
    // 🎨 ESTILO VISUAL DOURADO
    selectionStyle: 'border',    // Borda fina
    selectedColor: '#F59E0B',    // Dourado amber-500
    selectedBackground: '#FFFBEB', // Fundo dourado claro
    borderWidth: '1px',          // Borda bem fina
    boxShadow: 'sutil dourada',  // Sombra dourada
  }
}

// CSS resultante: "border-amber-400 bg-amber-50 shadow-lg ring-amber-300"
```

### **Configuração para Questão SÓ Texto:**
```typescript
{
  properties: {
    showImages: false,           // Sem imagens
    columns: 1,                 // Sempre 1 coluna
    responsiveColumns: false,    // Não adapta
    requiredSelections: 1,       // Estratégica: 1 seleção
    multipleSelection: false,
    autoAdvanceOnComplete: true,
    autoAdvanceDelay: 1200,
    
    // 🎨 ESTILO VISUAL DOURADO
    selectionStyle: 'background', // Fundo sutil
    selectedColor: '#F59E0B',     // Dourado amber-500
    selectedBackground: '#FEF3C7', // Fundo dourado mais claro
  }
}

// CSS resultante: "grid-cols-1" com fundo dourado ao selecionar
``` autoAdvanceDelay: 1500,
  }
}

// CSS resultante: "grid-cols-1 md:grid-cols-2"
```

### **Configuração para Questão SÓ Texto:**
```typescript
{
  properties: {
    showImages: false,       // Sem imagens
    columns: 1,             // Sempre 1 coluna
    responsiveColumns: false,// Não adapta
    requiredSelections: 1,   // Estratégica: 1 seleção
    multipleSelection: false,
    autoAdvanceOnComplete: true,
    autoAdvanceDelay: 1200,
  }
}

// CSS resultante: "grid-cols-1"
```

---

## 🔧 **CONFIGURAÇÕES PERSONALIZÁVEIS NO EDITOR**

### **Por Administrador:**
- ✅ Cores e branding
- ✅ Textos e títulos
- ✅ Imagens e media
- ✅ Delays de auto-avanço
- ✅ Regras de validação
- ✅ Layout e colunas

### **Por Usuário/Sessão:**
- ✅ Respostas do quiz
- ✅ Pontuações calculadas
- ✅ Progresso atual
- ✅ Dados coletados
- ✅ Resultado personalizado

---

Esta é a estrutura completa de configurações do **Quiz21StepsComplete.ts** - um sistema robusto e totalmente configurável para quizzes interativos com múltiplos tipos de questões e funcionalidades avançadas de personalização!