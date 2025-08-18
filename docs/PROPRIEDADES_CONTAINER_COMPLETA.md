# 🎯 PROPRIEDADES DE CONTAINER E POSICIONAMENTO - DOCUMENTAÇÃO COMPLETA

## 📋 RESUMO

Sistema completo de controle de largura e posicionamento de containers para todos os componentes do QuizQuest, permitindo edição visual através do painel de propriedades.

## ⚙️ PROPRIEDADES IMPLEMENTADAS

### 🔧 containerWidth (Largura do Container)

**Opções disponíveis:**

- `"full"` → `w-full` (100% da largura)
- `"large"` → `max-w-4xl mx-auto` (1024px máximo, centralizado)
- `"medium"` → `max-w-2xl mx-auto` (672px máximo, centralizado)
- `"small"` → `max-w-md mx-auto` (448px máximo, centralizado)

### 🎯 containerPosition (Posição do Container)

**Opções disponíveis:**

- `"left"` → `justify-start` + `ml-0 mr-auto`
- `"center"` → `justify-center` + `mx-auto`
- `"right"` → `justify-end` + `ml-auto mr-0`

### 📐 gridColumns (Sistema de Grid)

**Opções disponíveis:**

- `"auto"` → `w-full md:w-[calc(50%-0.5rem)]` (Responsivo padrão)
- `"full"` → `col-span-full` (Ocupar linha completa)
- `"half"` → `col-span-6` (Metade da largura)

### 📦 spacing (Espaçamento Interno)

**Opções disponíveis:**

- `"none"` → Sem padding
- `"compact"` → `p-2` (8px)
- `"normal"` → `p-4` (16px)
- `"comfortable"` → `p-6` (24px)
- `"spacious"` → `p-8` (32px)

### 📏 marginTop e marginBottom (Margens)

**Valores em pixels convertidos para classes Tailwind:**

- `0` → Sem margem
- `8` → `mt-2` ou `mb-2`
- `16` → `mt-4` ou `mb-4`
- `24` → `mt-6` ou `mb-6`
- `32` → `mt-8` ou `mb-8`
- `40` → `mt-10` ou `mb-10`

### 🎨 backgroundColor (Cor de Fundo)

**Opções disponíveis:**

- `"transparent"` → Sem cor de fundo (padrão)
- `"white"` → `bg-white`
- `"gray-50"` → `bg-gray-50`
- `"brand-light"` → `bg-brand-light`

## 📊 CONFIGURAÇÕES POR COMPONENTE NA ETAPA 1

### 🎯 quiz-intro-header-step01

```javascript
containerWidth: 'full'; // Largura completa
containerPosition: 'center'; // Centralizado
spacing: 'normal'; // Padding padrão
```

### 🎨 decorative-bar-step01

```javascript
containerWidth: 'full'; // Largura completa
containerPosition: 'center'; // Centralizado
spacing: 'normal'; // Padding padrão
```

### 📝 main-title-step01

```javascript
containerWidth: 'large'; // Largura grande (1024px)
containerPosition: 'center'; // Centralizado
spacing: 'normal'; // Padding padrão
```

### 🖼️ hero-image-step01

```javascript
containerWidth: 'large'; // Largura grande (1024px)
containerPosition: 'center'; // Centralizado
spacing: 'normal'; // Padding padrão
```

### 💬 Textos Motivacionais (motivation, highlight, continuation)

```javascript
containerWidth: 'medium'; // Largura média (672px)
containerPosition: 'center'; // Centralizado
spacing: 'normal'; // Padding padrão
```

### 📋 name-input-step01

```javascript
containerWidth: 'medium'; // Largura média (672px)
containerPosition: 'center'; // Centralizado
spacing: 'normal'; // Padding padrão
```

### 🎯 cta-button-step01

```javascript
containerWidth: 'large'; // Largura grande (1024px)
containerPosition: 'center'; // Centralizado
spacing: 'normal'; // Padding padrão
```

### ⚖️ legal-notice-step01

```javascript
containerWidth: 'full'; // Largura completa
containerPosition: 'center'; // Centralizado
spacing: 'compact'; // Padding reduzido para footer
```

## 🎨 COMO EDITAR VISUALMENTE

### No Painel de Propriedades:

1. **Largura do Container**: Dropdown com opções (Pequeno, Médio, Grande, Completo)
2. **Posição**: Botões de alinhamento (Esquerda, Centro, Direita)
3. **Espaçamento**: Slider ou dropdown (Nenhum, Compacto, Normal, Confortável, Espaçoso)
4. **Margens**: Inputs numéricos para Top e Bottom
5. **Cor de Fundo**: Color picker ou seletor de cores

### Visualização em Tempo Real:

- As mudanças são aplicadas instantaneamente no canvas
- Preview responsivo mostra como fica em mobile/desktop
- Guias visuais indicam os limites do container

## 🔄 APLICAÇÃO AUTOMÁTICA DE CLASSES CSS

O sistema UniversalBlockRenderer irá:

1. **Ler as propriedades** do componente
2. **Converter para classes Tailwind** apropriadas
3. **Aplicar responsividade** automática
4. **Manter consistência** visual em todos os dispositivos

## 📱 RESPONSIVIDADE

Todas as configurações são automaticamente responsivas:

- **Mobile**: Containers se adaptam à largura da tela
- **Tablet**: Larguras intermediárias são aplicadas
- **Desktop**: Larguras máximas são respeitadas

## ✅ VANTAGENS DO SISTEMA

1. **Edição Visual**: Sem necessidade de código
2. **Consistência**: Padrões visuais mantidos
3. **Responsividade**: Automática em todos os dispositivos
4. **Flexibilidade**: Ajustes granulares por componente
5. **Performance**: Classes Tailwind otimizadas

---

**Status**: ✅ Implementado na Etapa 1 - Pronto para teste
**Próximos Passos**: Testar no editor visual e aplicar às demais etapas
