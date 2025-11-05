# 🔧 Correções Comuns de Acessibilidade

## 📋 Guia de Referência Rápida

### 1. image-alt (Crítico)

**Problema**: Imagens sem texto alternativo

**Como detectar**:
```html
<img src="..." />  <!-- SEM alt -->
```

**Como corrigir**:
```tsx
// ✅ Imagem informativa
<img src="logo.png" alt="Logo Caktoquiz - Ferramenta de Quiz" />

// ✅ Imagem decorativa
<img src="decoration.png" alt="" />  {/* alt vazio, não remover */}

// ✅ Ícone com aria-hidden
<img src="icon.png" aria-hidden="true" />  {/* quando tem texto próximo */}
```

**Regras**:
- Imagens informativas: descrever conteúdo/função
- Imagens decorativas: `alt=""` (vazio)
- Ícones com texto: `aria-hidden="true"`
- Evitar: "imagem de", "foto de" (redundante)

---

### 2. button-name (Sério)

**Problema**: Botões sem nome acessível

**Como detectar**:
```tsx
<button><IconOnly /></button>  {/* sem texto/aria-label */}
```

**Como corrigir**:
```tsx
// ✅ Opção 1: Texto visível
<button>
  <FiTrash className="mr-2" />
  Excluir
</button>

// ✅ Opção 2: aria-label (ícone apenas)
<button aria-label="Excluir item">
  <FiTrash aria-hidden="true" />
</button>

// ✅ Opção 3: Texto oculto visualmente
<button>
  <span className="sr-only">Excluir</span>
  <FiTrash aria-hidden="true" />
</button>
```

**Classe sr-only** (adicionar em index.css):
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

### 3. label (Crítico)

**Problema**: Form inputs sem label associado

**Como detectar**:
```tsx
<input type="text" />  {/* sem label */}
```

**Como corrigir**:
```tsx
// ✅ Opção 1: Label visível com htmlFor
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ✅ Opção 2: Label envolvendo input
<label>
  Email
  <input type="email" />
</label>

// ✅ Opção 3: aria-label (quando label visual não é desejável)
<input
  type="email"
  aria-label="Email"
  placeholder="Digite seu email"
/>

// ✅ Opção 4: aria-labelledby (label está em outro elemento)
<h2 id="email-heading">Email de contato</h2>
<input type="email" aria-labelledby="email-heading" />
```

---

### 4. color-contrast (Sério)

**Problema**: Contraste insuficiente (mínimo 4.5:1)

**Como detectar**:
- Usar ferramenta: https://webaim.org/resources/contrastchecker/
- Lighthouse DevTools

**Como corrigir**:
```css
/* ❌ ANTES - Contraste 2.8:1 */
.text-muted {
  color: #999999;
  background-color: #ffffff;
}

/* ✅ DEPOIS - Contraste 4.6:1 */
.text-muted {
  color: #767676;
  background-color: #ffffff;
}

/* ❌ ANTES - Contraste 3.1:1 */
.text-primary {
  color: #4A9EFF;
  background-color: #ffffff;
}

/* ✅ DEPOIS - Contraste 4.5:1 */
.text-primary {
  color: #0066CC;
  background-color: #ffffff;
}
```

**Tabela de Referência**:
| Foreground | Background | Contraste | Status |
|------------|------------|-----------|--------|
| #000000 | #FFFFFF | 21:1 | ✅ Ótimo |
| #767676 | #FFFFFF | 4.6:1 | ✅ OK |
| #999999 | #FFFFFF | 2.8:1 | ❌ Falha |
| #CCCCCC | #FFFFFF | 1.6:1 | ❌ Falha |

---

### 5. link-name (Sério)

**Problema**: Links sem texto acessível

**Como detectar**:
```tsx
<a href="/page"><IconOnly /></a>  {/* sem texto */}
```

**Como corrigir**:
```tsx
// ✅ Opção 1: Texto visível
<a href="/page">
  Ir para página
  <FiArrowRight className="ml-2" />
</a>

// ✅ Opção 2: aria-label
<a href="/page" aria-label="Ir para página">
  <FiArrowRight aria-hidden="true" />
</a>

// ✅ Opção 3: title (menos recomendado)
<a href="/page" title="Ir para página">
  <FiArrowRight />
</a>
```

---

### 6. html-has-lang (Sério)

**Problema**: Tag HTML sem atributo lang

**Como detectar**:
```html
<html>  <!-- sem lang -->
```

**Como corrigir**:
```html
<!-- index.html -->
<html lang="pt-BR">
```

---

### 7. landmark-one-main (Moderado)

**Problema**: Página sem landmark `<main>`

**Como detectar**:
- Ausência de tag `<main>`

**Como corrigir**:
```tsx
// App.tsx ou layout principal
export default function App() {
  return (
    <div>
      <header>
        <nav>...</nav>
      </header>
      
      <main>  {/* ✅ Adicionar main */}
        <h1>Conteúdo Principal</h1>
        {/* ... */}
      </main>
      
      <footer>...</footer>
    </div>
  );
}
```

---

### 8. page-has-heading-one (Moderado)

**Problema**: Página sem `<h1>`

**Como corrigir**:
```tsx
// Garantir que toda página tenha H1
export default function MyPage() {
  return (
    <div>
      <h1>Título da Página</h1>  {/* ✅ Sempre ter H1 */}
      <h2>Subtítulo</h2>
      {/* ... */}
    </div>
  );
}
```

**Hierarquia correta**:
```tsx
// ✅ CORRETO
<h1>Título Principal</h1>
<h2>Seção 1</h2>
<h3>Subseção 1.1</h3>
<h2>Seção 2</h2>

// ❌ ERRADO - Pula níveis
<h1>Título Principal</h1>
<h3>Subseção</h3>  {/* Pulou H2 */}
```

---

### 9. aria-valid-attr (Sério)

**Problema**: Atributos ARIA inválidos

**Como corrigir**:
```tsx
// ❌ ERRADO - Atributo não existe
<div aria-labelby="title">...</div>  {/* Typo: labelby */}

// ✅ CORRETO
<div aria-labelledby="title">...</div>

// ❌ ERRADO - Valor inválido
<button aria-pressed="yes">...</button>

// ✅ CORRETO - Valores booleanos: true/false
<button aria-pressed="true">...</button>
```

**ARIA Roles Comuns**:
```tsx
// Navegação
<nav role="navigation" aria-label="Menu principal">

// Dialog/Modal
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">

// Alertas
<div role="alert" aria-live="assertive">

// Tabs
<div role="tablist">
  <button role="tab" aria-selected="true">Tab 1</button>
</div>
```

---

### 10. region (Moderado)

**Problema**: Conteúdo fora de landmarks

**Como corrigir**:
```tsx
// ✅ Usar landmarks semânticos
<body>
  <header>
    <nav aria-label="Menu principal">...</nav>
  </header>
  
  <main>
    <article>...</article>
    <aside>...</aside>
  </main>
  
  <footer>...</footer>
</body>
```

**Landmarks disponíveis**:
- `<header>` - Cabeçalho
- `<nav>` - Navegação
- `<main>` - Conteúdo principal
- `<aside>` - Conteúdo relacionado
- `<footer>` - Rodapé
- `<section>` - Seção genérica (com heading)
- `<article>` - Conteúdo independente

---

## 🚀 Workflow de Correção

### 1. Identificar Issue

```
Auditoria → Ver issue → Copiar ID e descrição
```

### 2. Encontrar Elementos

```tsx
// No código, buscar por:
- Imagens: <img
- Botões: <button, <Button
- Inputs: <input, <Input
- Links: <a, <Link
```

### 3. Aplicar Correção

```tsx
// Seguir exemplos acima para cada tipo de issue
```

### 4. Validar

```bash
# Re-executar auditoria
http://localhost:8080/debug/accessibility

# Verificar que issue sumiu
```

---

## 📚 Recursos

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Deque University Rules](https://dequeuniversity.com/rules/axe/)
- [MDN ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [WebAIM](https://webaim.org/)

---

**Última atualização**: 2025-01-05
