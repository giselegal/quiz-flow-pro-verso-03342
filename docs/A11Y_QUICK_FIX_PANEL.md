# 🔧 Quick Fix Panel - Correções Automáticas de Acessibilidade

## 📋 Visão Geral

O **QuickFixPanel** é um componente integrado ao auditor de acessibilidade que permite aplicar correções automáticas básicas com **preview antes de salvar**.

## ✨ Funcionalidades

### 4 Tipos de Correções Automáticas

1. **Alt Text em Imagens** 🖼️
   - Detecta imagens sem `alt`
   - Gera descrição baseada no nome do arquivo
   - Exemplo: `profile-photo.jpg` → `alt="profile photo"`

2. **Labels de Botões** 🔘
   - Identifica botões sem texto visível
   - Adiciona `aria-label` baseado no contexto
   - Exemplo: botão com ícone de lixeira → `aria-label="Excluir"`

3. **Ícones Decorativos** 🎨
   - Marca SVGs dentro de botões/links com `aria-hidden="true"`
   - Evita duplicação de anúncios para leitores de tela

4. **Labels de Inputs** 📝
   - Adiciona `aria-label` em inputs sem label associado
   - Usa o `placeholder` como base para o label

## 🎯 Como Usar

### Passo 1: Selecione as Correções
- Marque os checkboxes das correções que deseja aplicar
- Todas vêm selecionadas por padrão

### Passo 2: Preview
1. Clique em **"Preview"**
2. Aguarde análise (1-2 segundos)
3. Veja resumo das correções que serão aplicadas:
   - ✅ Número de correções
   - ⏭️ Elementos ignorados
   - ❌ Erros encontrados

### Passo 3: Revisar Detalhes
- Expanda o scroll area para ver todas as correções
- Revise exemplos dos 3 primeiros itens de cada tipo
- Verifique se as correções fazem sentido

### Passo 4: Aplicar
1. Clique em **"Aplicar Correções"**
2. Aguarde confirmação (feedback verde)
3. Execute nova auditoria para verificar melhorias

## 🎨 Interface

```
┌─────────────────────────────────────┐
│ 🔧 Correções Automáticas            │
├─────────────────────────────────────┤
│ ⚠️ Atenção: valores genéricos       │
│                                     │
│ ☑️ Alt Text em Imagens              │
│ ☑️ Labels de Botões                 │
│ ☑️ Ícones Decorativos               │
│ ☑️ Labels de Inputs                 │
│                                     │
│ [👁️ Preview] [🪄 Aplicar]          │
└─────────────────────────────────────┘
```

### Preview Expandido

```
┌─────────────────────────────────────┐
│ 👁️ Preview das Correções           │
├─────────────────────────────────────┤
│ Alt Text em Imagens                 │
│   ✅ 3 correções  ⏭️ 1 ignorado     │
│   • Adicionado alt="logo" em...    │
│   • Adicionado alt="hero image"... │
│   ... e mais 1 correção             │
│                                     │
│ Labels de Botões                    │
│   ✅ 2 correções                    │
│   • Adicionado aria-label="Fechar" │
│   • Adicionado aria-label="Salvar" │
│                                     │
│ Total: 5 correções serão aplicadas │
└─────────────────────────────────────┘
```

## ⚠️ Avisos Importantes

### ❌ O Que NÃO Fazer
- **Não confie cegamente** nas correções automáticas
- **Não use em produção** sem revisão manual
- **Não aplique** sem fazer preview primeiro

### ✅ Melhores Práticas
1. **Sempre faça preview** antes de aplicar
2. **Revise manualmente** após aplicar
3. **Execute nova auditoria** para verificar
4. **Ajuste valores genéricos** para descrições significativas

## 🔄 Workflow Recomendado

```
1. Executar Auditoria
   ↓
2. Identificar issues comuns (image-alt, button-name, etc)
   ↓
3. Selecionar correções no Quick Fix Panel
   ↓
4. Preview das correções
   ↓
5. Revisar detalhes no scroll area
   ↓
6. Aplicar correções
   ↓
7. Executar nova auditoria
   ↓
8. Ajustar manualmente valores genéricos
   ↓
9. Auditoria final
```

## 📊 Exemplo de Resultado

### Antes
```tsx
<img src="/logo.png" />
<button><TrashIcon /></button>
<input placeholder="Nome" />
```

### Após Quick Fix
```tsx
<img src="/logo.png" alt="logo" />
<button aria-label="Excluir"><TrashIcon /></button>
<input placeholder="Nome" aria-label="Nome" />
```

### Após Revisão Manual
```tsx
<img src="/logo.png" alt="Logotipo da Empresa XYZ" />
<button aria-label="Excluir item do carrinho"><TrashIcon /></button>
<input placeholder="Nome" aria-label="Digite seu nome completo" />
```

## 🧪 Testando

### Console Manual
```javascript
// Testar correções sem aplicar
const { fixMissingAltText } = window.a11yQuickFix;
const clone = document.body.cloneNode(true);
const result = fixMissingAltText(clone);
console.log(result);
```

### Reverter Mudanças
- Recarregue a página (F5)
- As correções são aplicadas no DOM, não no código fonte

## 🚀 Próximos Passos

Após usar o Quick Fix Panel:

1. **Revisar Issues Restantes**
   - Focar em issues que não podem ser corrigidos automaticamente
   - Priorizar por severidade (critical → serious)

2. **Melhorar Correções**
   - Substituir alt text genérico por descrições significativas
   - Ajustar aria-labels para contextos específicos

3. **Documentar Padrões**
   - Criar guia de estilo de acessibilidade
   - Definir padrões de alt text e labels

4. **Automatizar no CI/CD**
   - Integrar auditoria no pipeline
   - Bloquear deploy com issues críticos

## 📚 Referências

- [Guia de Correções Comuns](./A11Y_COMMON_FIXES.md)
- [Quick Start Auditoria](./A11Y_QUICK_START.md)
- [Checklist Completo](./A11Y_AUDIT_CHECKLIST.md)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)

---

**Lembre-se:** Quick Fix é um **ponto de partida**, não a solução final. Sempre revise e melhore as correções automáticas! 🎯
