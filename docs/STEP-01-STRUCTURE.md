# Step 1 - Estrutura Unificada

## 📋 Fonte Canônica

- **TypeScript**: `src/templates/quiz21StepsComplete.ts` (key: 'step-01')
- **JSON Backup v2**: `templates-backup-v2/step-01-template.json`
- **JSON Backup v1**: `templates-backup/step-01-template.json`

**Formato**: Template v2.0 com array de `blocks`

---

## 🧱 Blocos (8 total)

| Ordem | ID | Tipo | Descrição |
|-------|-----|------|-----------|
| 0 | `step01-quiz-intro-header-1` | `quiz-intro-header` | Logo + Progress bar (oculto) |
| 1 | `step01-decorative-bar-1` | `decorative-bar-inline` | Barra decorativa dourada (#B89B7A) |
| 2 | `step01-text-inline-1` | `text-inline` | Título principal com palavras destacadas em dourado |
| 3 | `step01-image-display-inline-1` | `image-display-inline` | Imagem hero do quiz |
| 4 | `step01-text-description-1` | `text-inline` | Descrição "Descubra seu ESTILO PREDOMINANTE..." |
| 5 | `step01-form-input-1` | `form-input` | Campo de entrada para nome do usuário |
| 6 | `step01-button-inline-1` | `button-inline` | CTA "Quero Descobrir meu Estilo Agora!" |
| 7 | `step01-footer-text-1` | `text-inline` | Texto footer com opacidade reduzida |

---

## ✅ Tipos Registrados

Todos os blocos usam tipos devidamente registrados no sistema:

- ✅ `quiz-intro-header`
- ✅ `decorative-bar-inline`
- ✅ `text-inline`
- ✅ `image-display-inline`
- ✅ `form-input`
- ✅ `button-inline`

**Mapeamento**: Definido em `src/utils/quiz21StepsRenderer.ts` (linhas 41-60)

---

## 🎨 Marcação de Cor

### Formato
```
[#B89B7A]**texto**[/#B89B7A]
```

### Exemplo de Uso
```
[#B89B7A]**Chega**[/#B89B7A] de um guarda-roupa lotado e da sensação de que [#B89B7A]**nada combina com você**[/#B89B7A].
```

### Renderização
- **Parser**: Implementado em componentes `TextInlineBlock`
- **Suporte**: Markdown + marcação de cor personalizada
- **Cores**: Hex codes convertidos para estilos inline

---

## 🔄 Mudanças da Unificação

### ❌ Removido

1. **Estrutura v3.0 com `sections`** em `src/templates/quiz21StepsComplete.ts`
   - Removidas seções `intro-hero` e `welcome-form`
   - Eliminada estrutura complexa com `metadata`, `theme`, `validation`, etc.

2. **Geração Dinâmica de Blocos** em `QuizModularProductionEditor.tsx` (linhas 651-678)
   - Case `'intro'` que gerava blocos com tipos não registrados (`heading`, `image`, `button`)

3. **HTML Inline** nos templates JSON
   - Trocado `<span style="color: #B89B7A">` por marcação `[#B89B7A]**texto**[/#B89B7A]`

### ✅ Adicionado

1. **Array de Blocos v2.0** em todos os 3 arquivos fonte
2. **Novos Blocos**:
   - `decorative-bar-inline` (linha dourada)
   - `text-description-1` (descrição do quiz)
   - `footer-text-1` (texto rodapé)
3. **Mapeamentos Completos** em `quiz21StepsRenderer.ts`
4. **Propriedades Padronizadas**:
   - `name: 'userName'` no form-input
   - `action: 'next-step'` no button-inline

---

## 🎯 Resultado Esperado

### No Editor (`/editor?template=quiz21StepsComplete&funnel=funnel-quiz21StepsComplete`)
- ✅ Logo renderiza no topo
- ✅ Barra decorativa dourada visível
- ✅ Título com palavras "Chega" e "nada combina com você" em dourado (#B89B7A)
- ✅ Imagem hero exibida
- ✅ Descrição "Descubra seu ESTILO PREDOMINANTE..." legível
- ✅ Input de nome funcional
- ✅ Botão "Quero Descobrir meu Estilo Agora!" clicável
- ✅ Texto footer com menor opacidade

### Em Produção (`/quiz`)
- ✅ Renderização idêntica ao editor
- ✅ Input captura `userName` corretamente
- ✅ Botão avança para `step-02` ao clicar
- ✅ Analytics registrando eventos (page_view, step_completed)

### Consistência
- ✅ Nenhum HTML literal visível (sem `<span>`, `<strong>`)
- ✅ Cores douradas aplicadas via marcação personalizada
- ✅ Fontes "Playfair Display" e "Inter" carregadas via design system
- ✅ Layout responsivo em mobile/desktop

---

## 📝 Histórico de Versões

- **v3.0** (obsoleto): Estrutura com `sections`, não compatível com editor
- **v2.0** (atual): Array de `blocks` com tipos registrados, unificado em 2025-10-16

---

## 🔗 Referências

- **Template TypeScript**: `src/templates/quiz21StepsComplete.ts` (linhas 99-183)
- **JSON Backup v2**: `templates-backup-v2/step-01-template.json`
- **JSON Backup v1**: `templates-backup/step-01-template.json`
- **Renderizador**: `src/utils/quiz21StepsRenderer.ts`
- **Editor**: `src/components/editor/quiz/QuizModularProductionEditor.tsx`
- **Conversor**: `src/utils/templateConverter.ts`
