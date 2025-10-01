# 🛑 Depreciações Ativas do Editor

| Componente / Padrão | Status | Substituto | Ação Recomendada |
|---------------------|--------|-----------|------------------|
| `UniversalStepEditor` | REMOVIDO | `ModernUnifiedEditor` | Atualizar branchs divergentes |
| `UniversalStepEditorPro` | Obsoleto | `ModernUnifiedEditor` + hooks | Remover referências residuais |

## Notas
Remoção concluída: `UniversalStepEditor` não existe mais no branch principal.
- Eventos customizados devem usar `unifiedEventTracker` com `type: 'editor_action'` + `payload.subType`.

## Checklist de Remoção Futura
- [x] Nenhum `grep` para `UniversalStepEditor` fora de `/components/editor/universal/` (arquivo removido)
- [ ] Demo atualizado exclusivamente para ModernUnifiedEditor
- [ ] Smoke tests (`smoke:step1`, `smoke:step20`) aprovados

## Referências
- Guia de Migração: `MIGRATION_GUIDE_EDITOR.md`
- Arquitetura Atual: `DOCUMENTACAO_ARQUITETURA_COMPLETA.md`
