# 📊 Status da Consolidação de Exports

**Data**: 2025-01-28  
**Objetivo**: Consolidar 212 duplicate exports identificados pelo knip  
**Prioridade**: Alta

## ✅ Arquivo Central Criado

`src/core/exports/index.ts` - Ponto único de exportação para:
- ✅ Hooks do Editor (useEditor, useEditorContext, useEditorAdapter)
- ✅ Stores (useQuizStore, useEditorStore)
- ✅ Serviços (funnelService, templateService, storageService)
- ✅ Contextos principais
- ✅ Utilities
- ✅ Types principais

## 📋 Análise de Uso Atual

### useEditor - 20+ importações

**Localizações canônicas:**
1. `/src/core/hooks/useEditorContext.ts` - **OFICIAL (FASE 2)** ✨
2. `/src/hooks/useEditor.ts` - Wrapper com deprecation warning ⚠️
3. `/src/contexts/editor/EditorContext.tsx` - Legado (1081 linhas) 🔧

**Estratégia de migração:**
- **Imediato**: Manter exports atuais funcionando
- **Gradual**: Adicionar comentários de deprecação
- **Futuro**: Migrar imports para `@/core/exports`

### useEditorAdapter - 7+ duplicações

**Localizações encontradas:**
1. `/src/core/editor/hooks/useEditorAdapter.ts` - **CANÔNICO** ✨
2. `/src/hooks/editor/useEditorAdapter.ts` - Re-export
3. `/src/hooks/useEditorAdapter.ts` - Re-export com warning
4. `/src/components/editor/index.ts` - Alias (removido) ✅

**Arquivos usando:**
- `ComponentsSidebar.tsx`
- `UnifiedEditorCore.tsx`
- `Step20ComponentsButton.tsx`
- `ModernPropertiesPanel.tsx`
- Testes

## 🎯 Abordagem Conservadora

### Fase 1: Documentação (✅ COMPLETO)
- [x] Criar `src/core/exports/index.ts`
- [x] Adicionar comentários de deprecação nos arquivos duplicados
- [x] Documentar localizações canônicas
- [x] Criar este documento de status

### Fase 2: Migração Opcional (🔄 PRÓXIMO)
Permitir que desenvolvedores usem exports centrais opcionalmente:

```typescript
// Novo estilo (recomendado)
import { useEditor, useEditorAdapter } from '@/core/exports';

// Estilo antigo (ainda funciona)
import { useEditor } from '@/hooks/useEditor';
```

### Fase 3: Migração Gradual
Quando confiar em testes E2E estáveis:
- Migrar arquivo por arquivo
- Testar após cada batch
- Reverter se houver problemas

### Fase 4: Cleanup Final
Após 100% migração:
- Remover re-exports duplicados
- Simplificar estrutura
- Atualizar documentação

## 📊 Impacto Estimado

**Arquivos com imports diretos:**
- `useEditor`: ~50 arquivos
- `useEditorAdapter`: ~10 arquivos
- `services`: ~30 arquivos
- **Total**: ~100 arquivos para migrar eventualmente

**Benefícios da consolidação:**
- ✅ Elimina confusão sobre qual import usar
- ✅ Facilita refatorações futuras
- ✅ Melhora tree-shaking
- ✅ Reduz tamanho do bundle
- ✅ Resolve warnings do knip

## 🚫 Não Fazer Agora

- ❌ Migração automática em massa (alto risco)
- ❌ Remover re-exports (quebra código existente)
- ❌ Forçar novo padrão (sem testes E2E completos)

## ✅ Fazer Agora

- ✅ Manter sistema funcionando
- ✅ Documentar estrutura correta
- ✅ Adicionar avisos de deprecação
- ✅ Preparar para migração futura

## 💡 Recomendação

**Status**: Sistema funcionando com ModernQuizEditor ativo  
**Ação**: Manter abordagem conservadora  
**Próximo passo**: Fortalecer testes E2E antes de migrations

---

**Knip Report Original:**
```
⚠ 212 duplicate exports found
Priority: High
Action: Consolidate to single export location
```

**Nossa Solução:**
✅ Arquivo central criado  
⚠️ Migração opcional disponível  
📋 Aguardando testes E2E mais robustos
