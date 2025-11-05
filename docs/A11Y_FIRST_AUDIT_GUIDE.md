# 🚀 Primeira Auditoria de Acessibilidade - Guia Prático

## 📋 Passo a Passo

### 1. Acessar o Auditor

```
http://localhost:8080/debug/accessibility
```

### 2. Executar Auditoria

1. Clicar botão **"Executar Auditoria"**
2. Aguardar 2-5 segundos (análise do DOM)
3. Ver resultados agrupados por severidade

---

## 📊 Como Interpretar Resultados

### Cartões de Severidade

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Críticos   │   Sérios    │  Moderados  │   Menores   │
│      X      │      X      │      X      │      X      │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Priorização

| Severidade | Ação | Prazo |
|------------|------|-------|
| 🔴 **Crítico** | Corrigir imediatamente | Hoje |
| 🟠 **Sério** | Corrigir urgente | Hoje/Amanhã |
| 🟡 **Moderado** | Corrigir importante | Esta semana |
| 🔵 **Menor** | Melhorias | Backlog |

---

## 🔧 Issues Comuns e Como Corrigir

### 1. `image-alt` (Crítico)

**Problema**:
```html
<img src="logo.png" />
```

**Correção**:
```html
<img src="logo.png" alt="Logo Caktoquiz" />
```

---

### 2. `button-name` (Sério)

**Problema**:
```tsx
<button><FiTrash /></button>
```

**Correção**:
```tsx
<button aria-label="Excluir item">
  <FiTrash aria-hidden="true" />
</button>
```

---

### 3. `label` (Crítico)

**Problema**:
```html
<input type="text" placeholder="Nome" />
```

**Correção**:
```html
<label htmlFor="name">Nome</label>
<input id="name" type="text" placeholder="Digite seu nome" />
```

---

### 4. `color-contrast` (Sério)

**Problema**:
```css
color: #999;  /* 2.8:1 */
background: #fff;
```

**Correção**:
```css
color: #767676;  /* 4.5:1 */
background: #fff;
```

Verificar: https://webaim.org/resources/contrastchecker/

---

### 5. `link-name` (Sério)

**Problema**:
```tsx
<a href="/page">
  <FiArrowRight />
</a>
```

**Correção**:
```tsx
<a href="/page" aria-label="Ir para página">
  <FiArrowRight aria-hidden="true" />
</a>
```

---

## 📝 Template de Relatório

Copie e preencha após auditoria:

```markdown
# Auditoria de Acessibilidade - [Data]

## Resumo
- Total de issues: __
- Críticos: __
- Sérios: __
- Moderados: __
- Menores: __

## Issues Críticos (Prioridade 1)

### 1. [ID do Issue]
- **Descrição**: 
- **Elementos afetados**: 
- **Correção planejada**: 
- **Responsável**: 
- **Prazo**: Hoje

### 2. [ID do Issue]
...

## Issues Sérios (Prioridade 2)

### 1. [ID do Issue]
...

## Plano de Ação
- [ ] Corrigir críticos (hoje)
- [ ] Corrigir sérios (amanhã)
- [ ] Re-auditar (após correções)
- [ ] Validar com screen reader
```

---

## ✅ Workflow de Correção

### Passo 1: Anotar Issues

Para cada issue crítico/sério:
1. Copiar ID e descrição
2. Copiar HTML dos elementos afetados
3. Ler documentação (link "Saiba mais")

### Passo 2: Priorizar

```
Críticos → Hoje (bloqueia produção)
Sérios → Amanhã (afeta usabilidade)
Moderados → Esta semana
Menores → Próximo sprint
```

### Passo 3: Corrigir

1. Criar branch: `fix/a11y-critical-issues`
2. Corrigir um issue por vez
3. Testar com screen reader (NVDA/VoiceOver)
4. Re-auditar após cada correção

### Passo 4: Validar

```bash
# Re-executar auditoria
http://localhost:8080/debug/accessibility

# Executar testes
npm test -- a11y

# Commit
git commit -m "fix(a11y): corrigir [issue-id]"
```

---

## 🎯 Meta de Conformidade

### Objetivo: WCAG 2.1 AA

- ✅ 0 issues críticos
- ✅ 0 issues sérios
- ⚠️ < 5 issues moderados (aceitável)
- ℹ️ Issues menores (melhorias contínuas)

---

## 📞 Próximos Passos

1. **Agora**: Execute auditoria
2. **Hoje**: Corrija críticos
3. **Amanhã**: Corrija sérios
4. **Esta semana**: Re-audite e valide

**Boa auditoria!** 🚀
