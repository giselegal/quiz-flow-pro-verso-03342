# 📋 PLANO DE AÇÃO: Step02 e Options-Grid

## Configurações Avançadas para Componentes de Quiz

---

## 🎯 **OBJETIVO PRINCIPAL**

Implementar configurações completas para Step02 e criar sistema avançado de propriedades para `options-grid` com funcionalidades profissionais de quiz.

---

## 📊 **FASE 1: ANÁLISE E CORREÇÕES DO STEP02**

### ✅ **1. Quiz-Intro-Header (APROVEITADO)**

```typescript
// ✅ JÁ IMPLEMENTADO - Usar configurações do Step01
- Propriedades universais aplicadas
- Controles de logo, progresso e navegação
- Status: COMPLETO
```

### 🔧 **2. Text-Inline - Step02-Question-Title**

```typescript
// 🎯 PROBLEMA: Renderização genérica
// 📝 SOLUÇÃO:
{
  id: "step02-question-title",
  type: "text-inline",
  properties: {
    content: "QUAL O SEU TIPO DE ROUPA FAVORITA?", // ✅ Texto correto
    fontSize: "text-2xl",
    fontWeight: "font-bold",
    textAlign: "text-center",
    color: "#432818",
    // + Propriedades universais do Step01
  }
}
```

### 🔧 **3. Text-Inline - Step02-Question-Counter**

```typescript
// 🎯 PROBLEMA: Renderização genérica
// 📝 SOLUÇÃO:
{
  id: "step02-question-counter",
  type: "text-inline",
  properties: {
    content: "Questão 1 de 10", // ✅ Texto correto da etapa
    fontSize: "text-sm",
    textAlign: "text-center",
    color: "#6B7280",
    // + Propriedades universais do Step01
  }
}
```

### ❌ **4. Remoção - Image-Display-Inline**

```typescript
// 🗑️ AÇÃO: Excluir componente
// ID para remoção: "step02-clothing-image"
// Motivo: Não usado na Step02 atual
```

---

## 📊 **FASE 2: IMPLEMENTAÇÃO COMPLETA DO OPTIONS-GRID**

### 🎨 **SEÇÃO 1: LAYOUT**

#### **Colunas do Grid**

```typescript
{
  key: "gridColumns",
  value: 2,
  type: PropertyType.SELECT,
  label: "Colunas do Grid",
  category: PropertyCategory.LAYOUT,
  options: [
    { value: 1, label: "1 Coluna" },
    { value: 2, label: "2 Colunas" },
  ]
}
```

#### **Direção do Conteúdo**

```typescript
{
  key: "contentDirection",
  value: "vertical",
  type: PropertyType.SELECT,
  label: "Direção do Conteúdo",
  category: PropertyCategory.LAYOUT,
  options: [
    { value: "vertical", label: "Vertical (Imagem → Texto)" },
    { value: "horizontal", label: "Horizontal (Lado a Lado)" },
  ]
}
```

#### **Disposição do Texto**

```typescript
{
  key: "contentLayout",
  value: "image-text",
  type: PropertyType.SELECT,
  label: "Disposição Texto",
  category: PropertyCategory.LAYOUT,
  options: [
    { value: "image-text", label: "Imagem | Texto" },
    { value: "text-only", label: "Apenas | Texto" },
    { value: "image-only", label: "Apenas | Imagem" },
  ]
}
```

#### **Tamanho das Imagens**

```typescript
{
  key: "imageSize",
  value: "256x256",
  type: PropertyType.SELECT,
  label: "Tamanho da Imagem",
  category: PropertyCategory.LAYOUT,
  options: [
    { value: "256x256", label: "256x256 pixels (Padrão)" },
    { value: "200x200", label: "200x200 pixels" },
    { value: "300x300", label: "300x300 pixels" },
  ]
}
```

#### **Classes CSS**

```typescript
{
  key: "imageClasses",
  value: "w-full h-full object-cover rounded-lg",
  type: PropertyType.TEXT,
  label: "Classes CSS da Imagem",
  category: PropertyCategory.ADVANCED
}
```

#### **Gap do Grid**

```typescript
{
  key: "gridGap",
  value: 8,
  type: PropertyType.SELECT,
  label: "Espaçamento Grid (gap-2 = 8px)",
  category: PropertyCategory.LAYOUT,
  options: [
    { value: 2, label: "gap-0.5 (2px)" },
    { value: 4, label: "gap-1 (4px)" },
    { value: 8, label: "gap-2 (8px) - Padrão" },
    { value: 16, label: "gap-4 (16px)" },
  ]
}
```

### 📝 **SEÇÃO 2: EDITOR DE OPÇÕES**

#### **Lista de Opções Dinâmica**

```typescript
{
  key: "options",
  value: [
    {
      id: "option-a",
      text: "Amo roupas confortáveis e práticas para o dia a dia.",
      image: "",
      points: 1,
      category: "Casual"
    }
  ],
  type: PropertyType.ARRAY,
  label: "Lista de Opções",
  category: PropertyCategory.CONTENT,
  arrayItemSchema: {
    text: { type: "TEXT", label: "Texto da Opção", required: true },
    image: { type: "UPLOAD", label: "Imagem (256x256)", required: false },
    points: { type: "NUMBER", label: "Pontuação", min: 1, max: 10, default: 1 },
    category: { type: "TEXT", label: "Categoria/Palavra-Chave", required: true }
  }
}
```

#### **Botão Adicionar Opção**

```typescript
{
  key: "enableAddOption",
  value: true,
  type: PropertyType.SWITCH,
  label: "Permitir Adicionar Opções",
  category: PropertyCategory.BEHAVIOR
}
```

### ⚖️ **SEÇÃO 3: VALIDAÇÕES**

#### **Múltipla Escolha**

```typescript
{
  key: "multipleSelection",
  value: true,
  type: PropertyType.SWITCH,
  label: "Múltipla Escolha",
  category: PropertyCategory.BEHAVIOR
}
```

#### **Quantidade de Seleções**

```typescript
{
  key: "minSelections",
  value: 1,
  type: PropertyType.RANGE,
  label: "Mínimo de Seleções",
  category: PropertyCategory.BEHAVIOR,
  min: 1, max: 8, step: 1
},
{
  key: "maxSelections",
  value: 3,
  type: PropertyType.RANGE,
  label: "Máximo de Seleções",
  category: PropertyCategory.BEHAVIOR,
  min: 1, max: 8, step: 1
}
```

#### **Auto-Avanço**

```typescript
{
  key: "autoAdvance",
  value: false,
  type: PropertyType.SWITCH,
  label: "Auto-avançar",
  category: PropertyCategory.BEHAVIOR
},
{
  key: "autoAdvanceDelay",
  value: 1000,
  type: PropertyType.RANGE,
  label: "Delay do Auto-avanço (ms)",
  category: PropertyCategory.BEHAVIOR,
  min: 500, max: 3000, step: 100
}
```

#### **Ativação do Botão**

```typescript
{
  key: "enableButtonWhenValid",
  value: true,
  type: PropertyType.SWITCH,
  label: "Ativar Botão Apenas Quando Válido",
  category: PropertyCategory.BEHAVIOR
}
```

### 🎨 **SEÇÃO 4: ESTILIZAÇÃO**

#### **Bordas**

```typescript
{
  key: "borderWidth",
  value: "medium",
  type: PropertyType.SELECT,
  label: "Espessura das Bordas",
  category: PropertyCategory.STYLE,
  options: [
    { value: "thin", label: "Fina (1px)" },
    { value: "medium", label: "Média (2px)" },
    { value: "thick", label: "Grossa (3px)" },
  ]
}
```

#### **Sombras**

```typescript
{
  key: "shadowSize",
  value: "small",
  type: PropertyType.SELECT,
  label: "Tamanho da Sombra",
  category: PropertyCategory.STYLE,
  options: [
    { value: "none", label: "Sem Sombra" },
    { value: "small", label: "Pequena" },
    { value: "medium", label: "Média" },
    { value: "large", label: "Grande" },
  ]
}
```

#### **Espaçamento**

```typescript
{
  key: "optionSpacing",
  value: "none",
  type: PropertyType.SELECT,
  label: "Espaçamento entre Opções",
  category: PropertyCategory.STYLE,
  options: [
    { value: "none", label: "Nenhum (0px)" },
    { value: "small", label: "Pequeno (4px)" },
    { value: "medium", label: "Médio (8px)" },
    { value: "large", label: "Grande (16px)" },
  ]
}
```

#### **Detalhes Visuais**

```typescript
{
  key: "visualDetail",
  value: "simple",
  type: PropertyType.SELECT,
  label: "Estilo do Detalhe Visual",
  category: PropertyCategory.STYLE,
  options: [
    { value: "simple", label: "Simples" },
    { value: "modern", label: "Moderno" },
    { value: "elegant", label: "Elegante" },
  ]
}
```

### 🔧 **SEÇÃO 5: PROPRIEDADES DO BOTÃO**

#### **Texto do Botão**

```typescript
{
  key: "buttonText",
  value: "Continuar",
  type: PropertyType.TEXT,
  label: "Texto do Botão",
  category: PropertyCategory.CONTENT,
  required: true
}
```

#### **🎨 Aparência**

```typescript
{
  key: "buttonScale",
  value: "100%",
  type: PropertyType.SELECT,
  label: "Tamanho Uniforme",
  category: PropertyCategory.STYLE,
  options: [
    { value: "50%", label: "50%" },
    { value: "100%", label: "100%" },
    { value: "200%", label: "200%" },
  ]
},
{
  key: "buttonTextColor",
  value: "#FFFFFF",
  type: PropertyType.COLOR,
  label: "Cor de Fundo do Texto",
  category: PropertyCategory.STYLE
},
{
  key: "buttonContainerColor",
  value: "#B89B7A",
  type: PropertyType.COLOR,
  label: "Cor de Fundo do Container",
  category: PropertyCategory.STYLE
},
{
  key: "buttonBorderColor",
  value: "#B89B7A",
  type: PropertyType.COLOR,
  label: "Cor da Borda",
  category: PropertyCategory.STYLE
},
{
  key: "fontFamily",
  value: "inherit",
  type: PropertyType.SELECT,
  label: "Família da Fonte",
  category: PropertyCategory.STYLE,
  options: [
    { value: "inherit", label: "Padrão" },
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },
  ]
}
```

#### **Alinhamento**

```typescript
{
  key: "buttonAlignment",
  value: "center",
  type: PropertyType.SELECT,
  label: "Alinhamento",
  category: PropertyCategory.LAYOUT,
  options: [
    { value: "left", label: "Esquerda" },
    { value: "center", label: "Centro" },
    { value: "right", label: "Direita" },
  ]
}
```

#### **Efeitos Visuais**

```typescript
{
  key: "shadowType",
  value: "none",
  type: PropertyType.SELECT,
  label: "Tipo de Sombra",
  category: PropertyCategory.STYLE,
  options: [
    { value: "none", label: "Sem Sombra" },
    { value: "small", label: "Pequena" },
    { value: "medium", label: "Média" },
  ]
},
{
  key: "shadowColor",
  value: "#000000",
  type: PropertyType.COLOR,
  label: "Cor da Sombra",
  category: PropertyCategory.STYLE
},
{
  key: "visualEffect",
  value: "shine",
  type: PropertyType.SELECT,
  label: "Efeito Visual",
  category: PropertyCategory.STYLE,
  options: [
    { value: "none", label: "Nenhum" },
    { value: "shine", label: "Brilho Deslizante" },
    { value: "pulse", label: "Pulsação" },
    { value: "hover", label: "Efeito Hover" },
  ]
},
{
  key: "borderRadius",
  value: 7,
  type: PropertyType.RANGE,
  label: "Raio da Borda",
  category: PropertyCategory.STYLE,
  min: 0, max: 50, step: 1, unit: "px"
},
{
  key: "hoverOpacity",
  value: 75,
  type: PropertyType.RANGE,
  label: "Opacidade no Hover",
  category: PropertyCategory.STYLE,
  min: 50, max: 100, step: 5, unit: "%"
}
```

#### **⚙️ Comportamento**

```typescript
{
  key: "buttonAction",
  value: "next-step",
  type: PropertyType.SELECT,
  label: "Ação do Botão",
  category: PropertyCategory.BEHAVIOR,
  options: [
    { value: "next-step", label: "Próxima Etapa" },
    { value: "specific-step", label: "Etapa Específica" },
    { value: "url", label: "URL Externa" },
  ]
},
{
  key: "targetUrl",
  value: "",
  type: PropertyType.URL,
  label: "URL de Destino",
  category: PropertyCategory.BEHAVIOR
},
{
  key: "linkTarget",
  value: "_blank",
  type: PropertyType.SELECT,
  label: "Destino do Link",
  category: PropertyCategory.BEHAVIOR,
  options: [
    { value: "_self", label: "Mesma Aba (_self)" },
    { value: "_blank", label: "Nova Aba (_blank)" },
  ]
},
{
  key: "requireValidInput",
  value: true,
  type: PropertyType.SWITCH,
  label: "Requer Input Válido",
  category: PropertyCategory.BEHAVIOR
},
{
  key: "disabled",
  value: false,
  type: PropertyType.SWITCH,
  label: "Desabilitado",
  category: PropertyCategory.BEHAVIOR
}
```

#### **🔧 Avançado**

```typescript
{
  key: "componentId",
  value: "step-2-block-options-grid-pos-1",
  type: PropertyType.TEXT,
  label: "ID do Componente",
  category: PropertyCategory.ADVANCED,
  required: true,
  placeholder: "Ex: step-2-block-options-grid-pos-1"
}
```

---

## 📊 **FASE 3: CRONOGRAMA DE IMPLEMENTAÇÃO**

### **🏃‍♂️ SPRINT 1 (2-3 horas)**

1. ✅ Corrigir textos do Step02
2. ✅ Remover image-display-inline desnecessário
3. ✅ Aplicar propriedades universais nos text-inline

### **🏃‍♂️ SPRINT 2 (4-5 horas)**

1. ✅ Criar case "options-grid" no useUnifiedProperties
2. ✅ Implementar todas as propriedades de Layout
3. ✅ Implementar editor de opções dinâmico

### **🏃‍♂️ SPRINT 3 (3-4 horas)**

1. ✅ Implementar validações e comportamentos
2. ✅ Implementar propriedades de estilização
3. ✅ Criar sistema completo de botão

### **🏃‍♂️ SPRINT 4 (2-3 horas)**

1. ✅ Testes e validações
2. ✅ Documentação final
3. ✅ Deploy e verificações

---

## 📋 **FASE 4: CRITÉRIOS DE ACEITAÇÃO**

### ✅ **Step02 Corrigido**

- [ ] Quiz-intro-header mantém configurações do Step01
- [ ] Text-inline exibe textos corretos da questão
- [ ] Counter exibe "Questão 1 de 10"
- [ ] Image-display-inline removido
- [ ] Propriedades universais aplicadas

### ✅ **Options-Grid Completo**

- [ ] Sistema de layout com 1-2 colunas
- [ ] Editor de opções com imagem + texto + pontos + categoria
- [ ] Validações de seleção (1-3 opções)
- [ ] Auto-avanço configurável
- [ ] Estilização completa (bordas, sombras, espaçamentos)
- [ ] Sistema de botão com 25+ propriedades
- [ ] Responsividade em dispositivos móveis

### ✅ **Integração EnhancedUniversalPropertiesPanel**

- [ ] Todas as propriedades aparecem organizadas por categoria
- [ ] Controles funcionam em tempo real
- [ ] Validação de campos obrigatórios
- [ ] Persistência de configurações

---

## 🚀 **FASE 5: PRÓXIMOS PASSOS**

1. **Iniciar SPRINT 1** - Correções do Step02
2. **Implementar options-grid** - Propriedades completas
3. **Testes extensivos** - Validar funcionalidades
4. **Documentação** - Guia de uso completo
5. **Expansão** - Aplicar padrão para outras Steps

---

## 📊 **RESULTADO ESPERADO**

✅ **Step02 100% funcional** com textos corretos e configurações universais  
✅ **Options-Grid profissional** com 50+ propriedades configuráveis  
✅ **Sistema de quiz avançado** com validações e auto-avanço  
✅ **Interface unificada** no painel de propriedades  
✅ **Responsividade total** em todos os dispositivos

---

_Plano criado por: GitHub Copilot_  
_Data: Janeiro 2025_  
_Status: 📋 PRONTO PARA EXECUÇÃO_
