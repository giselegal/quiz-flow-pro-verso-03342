# 🗂️ EDITORES LEGADOS - NÃO UTILIZADOS

## ⚠️ AVISO IMPORTANTE

**Estes editores foram movidos para cá durante o processo de unificação e NÃO devem ser utilizados.**

O único editor ativo no sistema é: **`src/unified/editor/EditorUnified.tsx`**

## 📋 Editores Movidos para Legacy

- `EditorWithPreview-clean.tsx` - Editor com preview (versão limpa)
- `EditorProTestFixed.tsx` - Editor Pro com correções de teste
- `QuizEditorProDemo.tsx` - Demo do Editor Pro
- `MainEditor.tsx` - Editor principal antigo
- `EditorWithPreview-FINAL.tsx` - Versão final do editor com preview
- `EditorWithPreview.tsx` - Editor com preview original
- `EditorProTestPage.tsx` - Página de teste do Editor Pro
- `QuizEditorShowcase.tsx` - Showcase do editor de quiz
- `EditorTeste.tsx` - Editor de teste
- `EditorProSimpleTest.tsx` - Teste simples do Editor Pro
- `MainEditor-new.tsx` - Nova versão do editor principal
- `SimpleEditor.tsx` - Editor simples

## 🎯 Sistema Unificado Atual

### Editor Ativo:

- **`src/unified/editor/EditorUnified.tsx`** - Editor principal unificado

### Arquitetura de Suporte:

- **`src/unified/editor/UnifiedEditorProvider.tsx`** - Provider de estado
- **`src/unified/editor/UnifiedCalculationEngine.ts`** - Engine de cálculo
- **`src/unified/editor/types.ts`** - Definições de tipos
- **`src/unified/editor/TemplateAdapter.ts`** - Adaptador de templates

### Páginas Que Usam o Sistema Unificado:

- **`src/pages/QuizUnifiedPage.tsx`** - Página principal do quiz unificado

## 🚫 Não Utilizar

Todos os arquivos nesta pasta são considerados **LEGACY** e não devem ser importados ou utilizados no código de produção.

## 🧹 Próximos Passos

Após confirmação de que o sistema unificado está funcionando perfeitamente, estes arquivos podem ser removidos permanentemente do projeto.

---

**Data da Migração:** 23 de Agosto de 2025
**Status:** ❌ DESCONTINUADOS - Usar apenas EditorUnified.tsx
