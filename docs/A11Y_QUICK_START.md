# 🚀 Guia Rápido - Primeira Auditoria

## ⚡ Começar AGORA (2 minutos)

### 1. Abrir Auditor

```
http://localhost:8080/debug/accessibility
```

### 2. Clicar Botão

```
"Executar Auditoria" → Aguardar 3s → Ver Resultados
```

### 3. Anotar Números

```
Críticos: ___
Sérios:   ___
Moderados: ___
Menores:  ___
```

---

## 🎯 Foco Imediato

### Se tiver CRÍTICOS (🔴)

**Corrigir HOJE - Bloqueia produção**

Comum: `image-alt`, `label`, `input-button-name`

### Se tiver SÉRIOS (🟠)

**Corrigir HOJE/AMANHÃ - Afeta usabilidade**

Comum: `button-name`, `color-contrast`, `link-name`

---

## 🔧 Correção Rápida (Console)

Abra DevTools → Console → Cole:

```javascript
// Ver preview de problemas
const axe = await import('axe-core');
const results = await axe.default.run();
console.table(results.violations.map(v => ({
  id: v.id,
  impact: v.impact,
  count: v.nodes.length,
  help: v.help,
})));
```

---

## 📊 Interpretar Resultados

### Exemplo de Saída

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Críticos   │   Sérios    │  Moderados  │   Menores   │
│      3      │      5      │      8      │      4      │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**O que fazer**:
- 3 críticos → Corrigir nos próximos 30 min
- 5 sérios → Corrigir hoje
- 8 moderados → Planejar para semana
- 4 menores → Backlog

---

## 🛠️ Top 5 Correções Rápidas

### 1. Imagem sem Alt (30s)

```tsx
// ❌ Antes
<img src="logo.png" />

// ✅ Depois
<img src="logo.png" alt="Logo da empresa" />
```

### 2. Botão sem Label (1 min)

```tsx
// ❌ Antes
<button onClick={handleDelete}>
  <FiTrash />
</button>

// ✅ Depois
<button onClick={handleDelete} aria-label="Excluir item">
  <FiTrash aria-hidden="true" />
</button>
```

### 3. Input sem Label (2 min)

```tsx
// ❌ Antes
<input type="text" placeholder="Nome" />

// ✅ Depois
<label htmlFor="name">Nome</label>
<input id="name" type="text" placeholder="Digite seu nome" />
```

### 4. Link sem Texto (1 min)

```tsx
// ❌ Antes
<a href="/page"><FiArrowRight /></a>

// ✅ Depois
<a href="/page" aria-label="Ir para página">
  <FiArrowRight aria-hidden="true" />
</a>
```

### 5. Contraste Baixo (5 min)

```css
/* ❌ Antes - 2.8:1 */
color: #999999;
background: #ffffff;

/* ✅ Depois - 4.6:1 */
color: #767676;
background: #ffffff;
```

Verificar: https://webaim.org/resources/contrastchecker/

---

## ✅ Checklist Pós-Auditoria

```
[ ] Auditoria executada
[ ] Números anotados
[ ] Críticos priorizados
[ ] Issues documentados
[ ] Plano de correção criado
```

---

## 📞 Recursos Rápidos

- **Auditor**: `/debug/accessibility`
- **Guia completo**: `docs/A11Y_FIRST_AUDIT_GUIDE.md`
- **Integração**: `docs/ACCESSIBILITY_INTEGRATION.md`
- **Verificar contraste**: https://webaim.org/resources/contrastchecker/

---

## 🎯 Meta Simples

**Objetivo: 0 críticos, 0 sérios**

Tempo estimado: 2-4 horas (depende da quantidade)

**Boa auditoria!** 🚀
