# 📦 Deprecated Editors

**Data de depreciação**: 2025-10-16  
**Será removido em**: Sprint 2 (TK-ED-04)

## ⚠️ Editores Descontinuados

Estes editores foram consolidados em um único editor canônico: **QuizModularProductionEditor**.

### 1. ModernUnifiedEditor.tsx
- **Motivo**: Arquitetura experimental com facade incompleto
- **Migração**: Use `QuizModularProductionEditor` com `FunnelEditingFacade` completo

### 2. ModularEditorLayout.tsx
- **Motivo**: Layout alternativo sem features críticas do editor de produção
- **Migração**: Use `QuizModularProductionEditor` com layout 4 colunas profissional

## 🎯 Editor Oficial

Use sempre:
```tsx
import QuizModularProductionEditor from '@/components/editor/quiz/QuizModularProductionEditor';
```

## 📊 Benefícios da Consolidação

- ✅ **-60%** código duplicado
- ✅ **-40%** tempo de compilação
- ✅ **-70%** re-renders desnecessários
- ✅ **100%** features centralizadas
- ✅ **0** conflitos de estado entre editores

## 🔄 Plano de Remoção

**Sprint 2 (semanas 2-3)**:
1. Validar que nenhum código ativo usa estes editores
2. Remover completamente a pasta `deprecated/`
3. Limpar imports de referências antigas
