# 🎨 PALETA DE CORES OFICIAL - QUIZ QUEST CHALLENGE VERSE

## 🎯 **CORES APROVADAS - USO EXCLUSIVO**

### **1. Cores Principais da Marca**

```css
/* 🤎 Marrom Principal */
#B89B7A  /* text-brand, bg-brand */

/* 🌰 Marrom Escuro */
#432818  /* text-brand-dark, bg-brand-dark */

/* 🏆 Marrom Intermediário (Gradiente) */
#8B7355  /* Usado apenas no gradiente */

/* ⚪ Branco Puro */
#FEFEFE  /* Backgrounds, textos em fundos escuros */
```

### **2. Classes CSS Oficiais**

```css
.text-brand {
  color: #b89b7a;
}
.text-brand-dark {
  color: #432818;
}
.bg-brand {
  background-color: #b89b7a;
}
.bg-brand-dark {
  background-color: #432818;
}
.bg-brand-gradient {
  background: linear-gradient(135deg, #b89b7a 0%, #8b7355 100%);
}
.text-brand-gradient {
  /* Gradiente de texto */
}
```

### **3. Tons Neutros Permitidos (Derivados)**

```css
/* 🎨 Variações do Marrom com Opacidade */
rgba(184, 155, 122, 0.1)  /* bg-brand/10 - Fundos sutis */
rgba(184, 155, 122, 0.2)  /* bg-brand/20 - Hover leve */
rgba(184, 155, 122, 0.5)  /* bg-brand/50 - Overlay */
rgba(184, 155, 122, 0.8)  /* bg-brand/80 - Destaque */

/* 🌫️ Tons de Cinza Neutro (apenas se necessário) */
rgba(67, 40, 24, 0.05)    /* Cinza muito claro baseado no brand-dark */
rgba(67, 40, 24, 0.1)     /* Cinza claro */
rgba(67, 40, 24, 0.3)     /* Cinza médio */
```

---

## ❌ **CORES PROIBIDAS - REMOÇÃO OBRIGATÓRIA**

### **Cores que devem ser REMOVIDAS:**

- 🟣 **Purple** (purple-50, purple-500, purple-600, etc.)
- 🔵 **Blue** (blue-50, blue-500, blue-600, etc.)
- 🟢 **Green** (green-50, green-500, green-600, etc.)
- 🟠 **Orange** (orange-50, orange-500, orange-600, etc.)
- 🔴 **Red** (red-50, red-500, red-600, etc.)
- 🟡 **Yellow** (yellow-50, yellow-500, yellow-600, etc.)

---

## 🔄 **MAPEAMENTO DE SUBSTITUIÇÕES**

### **Estados de Interação:**

```css
/* ✅ CORRETO - Hover States */
hover:bg-brand/20        /* Hover sutil */
hover:text-brand-dark    /* Texto em hover */
hover:border-brand       /* Borda em hover */

/* ✅ CORRETO - Estados Ativos */
border-brand             /* Borda ativa */
bg-brand/10             /* Fundo ativo */
text-brand-dark         /* Texto ativo */

/* ✅ CORRETO - Estados de Foco */
ring-brand              /* Ring de foco */
ring-brand/30           /* Ring com opacidade */
focus:border-brand      /* Borda em foco */
```

### **Substituições Específicas:**

```css
/* 🔴 ANTES → ✅ DEPOIS */
purple-500    → brand
purple-50     → brand/10
blue-500      → brand
blue-50       → brand/10
green-500     → brand
green-50      → brand/10
yellow-500    → brand
yellow-50     → brand/10
red-500       → brand-dark
red-50        → brand/10
```

---

## 🎨 **GUIA DE USO POR COMPONENTE**

### **1. Botões**

```css
/* Botão Principal */
bg-brand text-white hover:bg-brand/90

/* Botão Secundário */
border-brand text-brand hover:bg-brand/10

/* Botão de Perigo */
border-brand-dark text-brand-dark hover:bg-brand-dark/10
```

### **2. Cards e Painéis**

```css
/* Card Normal */
border-brand/20 bg-white

/* Card Ativo */
border-brand bg-brand/5

/* Card Hover */
hover:border-brand/40 hover:shadow-lg
```

### **3. Estados de Seleção**

```css
/* Selecionado */
border-brand bg-brand/10 ring-2 ring-brand/30

/* Hover */
hover:border-brand/40 hover:bg-brand/5

/* Foco */
focus:ring-2 focus:ring-brand/50
```

---

## 🛠️ **IMPLEMENTAÇÃO PRIORITÁRIA**

### **Arquivos para Correção Imediata:**

1. `/src/pages/editor-fixed.tsx`
2. `/src/components/editor/funnel/FunnelStagesPanel.tsx`
3. `/src/components/editor/blocks/*.tsx`
4. `/src/components/editor/properties/*.tsx`

### **Checklist de Validação:**

- [ ] ❌ Purple removido
- [ ] ❌ Blue removido
- [ ] ❌ Green removido
- [ ] ❌ Orange removido
- [ ] ❌ Red removido
- [ ] ❌ Yellow removido
- [ ] ✅ Apenas brand colors
- [ ] ✅ Tons neutros derivados
- [ ] ✅ Branco #FEFEFE

---

**🎯 OBJETIVO: 100% CONFORMIDADE COM A PALETA OFICIAL**
