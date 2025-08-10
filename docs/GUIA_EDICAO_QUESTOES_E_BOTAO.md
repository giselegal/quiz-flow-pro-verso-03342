# 🎯 GUIA: Como Editar Botão "Avançar" e Grid das Questões

## 📍 Localização dos Elementos

No arquivo `/src/components/steps/Step02Template.tsx` (e outros), você encontrará:

### 1. 🎯 **GRID DAS QUESTÕES** (id: "step02-clothing-options")

```tsx
{
  id: "step02-clothing-options",
  type: "options-grid",
  properties: {
    // 🔢 CONFIGURAÇÕES DE SELEÇÃO
    questionId: "q1",
    multipleSelection: true,
    maxSelections: 3,
    minSelections: 1,
    requiredSelections: 3,

    // 🎨 LAYOUT E VISUAL
    columns: 2, // 1 ou 2 colunas
    responsiveColumns: true,
    gridGap: 20, // Espaço entre opções

    // 🖼️ IMAGENS
    showImages: true,
    imageSize: "medium", // "small", "medium", "large"
    imagePosition: "top", // "top", "left", "right"

    // ⚡ VELOCIDADE/UX
    autoAdvanceOnComplete: true,
    autoAdvanceDelay: 0, // 0 = instantâneo
    instantActivation: true,

    // 📝 MENSAGENS
    validationMessage: "Escolha até 3 estilos",
    progressMessage: "{selected} de {required} selecionados",

    // 📊 OPÇÕES DA QUESTÃO
    options: [
      {
        id: "1a",
        text: "SEU TEXTO AQUI",
        value: "1a",
        category: "Natural",
        points: 1,
        imageUrl: "SUA_URL_AQUI"
      },
      // ... mais opções
    ]
  }
}
```

### 2. 🔘 **BOTÃO AVANÇAR** (id: "step02-continue-button")

```tsx
{
  id: "step02-continue-button",
  type: "button-inline",
  properties: {
    // 📝 TEXTOS DO BOTÃO
    text: "Continuar →", // Texto quando ativado
    textWhenDisabled: "Selecione 3 estilos", // Texto quando desabilitado
    textWhenComplete: "Continuar →", // Texto quando completo

    // 🎨 VISUAL DO BOTÃO
    variant: "primary", // "primary", "secondary", "outline"
    size: "large", // "small", "medium", "large"
    backgroundColor: "#B89B7A", // Cor de fundo ativo
    textColor: "#ffffff", // Cor do texto ativo
    disabledBackgroundColor: "#E5E7EB", // Cor quando desabilitado
    disabledTextColor: "#9CA3AF", // Cor texto quando desabilitado

    // 📐 TAMANHO E POSIÇÃO
    fullWidth: true, // true = largura total
    borderRadius: "rounded-full", // "rounded-lg", "rounded-full"
    padding: "py-4 px-8", // Espaçamento interno

    // ⚡ COMPORTAMENTO
    disabled: true, // Inicia desabilitado
    requiresValidInput: true, // Só ativa com seleção válida
    instantActivation: true, // Ativa instantaneamente
    noDelay: true // Sem atraso
  }
}
```

---

## 🛠️ **EXEMPLOS DE PERSONALIZAÇÕES**

### 🎨 **1. Alterar Cores do Botão**

```tsx
// Botão verde
backgroundColor: "#22C55E",
textColor: "#ffffff",

// Botão roxo
backgroundColor: "#8B5CF6",
textColor: "#ffffff",

// Botão gradiente (via CSS)
backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
```

### 📐 **2. Alterar Layout do Grid**

```tsx
// Grid de 1 coluna (vertical)
columns: 1,
gridGap: 16,

// Grid de 3 colunas (desktop)
columns: 3,
responsiveColumns: true, // Mobile sempre 1 coluna

// Grid mais compacto
gridGap: 12,
imageSize: "small",
```

### 📝 **3. Personalizar Mensagens**

```tsx
// Mensagens customizadas
validationMessage: "Escolha suas 3 opções favoritas!",
progressMessage: "✨ {selected}/{required} selecionados",
textWhenDisabled: "👆 Selecione primeiro",
textWhenComplete: "Vamos lá! 🚀",
```

### ⚡ **4. Alterar Velocidade/UX**

```tsx
// Navegação manual (sem autoadvance)
autoAdvanceOnComplete: false,
autoAdvanceDelay: 0,

// Navegação com delay
autoAdvanceOnComplete: true,
autoAdvanceDelay: 1500, // 1.5 segundos

// Navegação instantânea (recomendado)
autoAdvanceOnComplete: true,
autoAdvanceDelay: 0,
instantActivation: true,
```

---

## 📝 **COMO EDITAR**

### **Opção 1: Edição Direta no Arquivo**

1. Abra `/src/components/steps/Step02Template.tsx`
2. Encontre o bloco com `id: "step02-clothing-options"` (grid)
3. Encontre o bloco com `id: "step02-continue-button"` (botão)
4. Modifique as propriedades desejadas
5. Salve - o hot reload aplicará as mudanças

### **Opção 2: Edição Visual no Editor**

1. Acesse `http://localhost:8080/editor`
2. Carregue o Step02Template
3. Clique no grid de opções ou botão
4. Use o painel de propriedades à direita
5. As mudanças são aplicadas em tempo real

---

## 🎯 **DICAS PRO**

### ✅ **Melhores Práticas:**

- Use `instantActivation: true` para melhor UX
- Mantenha `autoAdvanceDelay: 0` para navegação rápida
- Use `columns: 2` para questões com imagens
- Use `columns: 1` para questões só texto
- Teste sempre no mobile (responsiveColumns: true)

### 🚨 **Cuidados:**

- Sempre mantenha `requiredSelections` consistente com `maxSelections`
- Use cores com bom contraste para acessibilidade
- Teste a navegação em diferentes dispositivos
- Verifique se as imagens têm URLs válidas

---

## 🔧 **FERRAMENTAS ÚTEIS**

### **Para Cores:**

- https://coolors.co (paletas)
- https://contrast-ratio.com (contraste)

### **Para Imagens:**

- Cloudinary (já configurado)
- Unsplash para imagens gratuitas

### **Para Testes:**

- DevTools mobile view
- http://localhost:8080/editor (preview real-time)

---

**🎉 Com este guia, você pode personalizar completamente tanto o grid das questões quanto o botão "Avançar" para criar a experiência perfeita para seus usuários!**
