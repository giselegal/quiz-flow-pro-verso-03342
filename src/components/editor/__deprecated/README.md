# ⚠️ Deprecated Components

Esta pasta contém componentes que foram **consolidados** e não devem mais ser usados em código novo.

## 📁 Arquivos Deprecated

### EditorProviderUnified.tsx
**Status**: DEPRECATED (2025-01-17)  
**Substituído por**: `EditorProviderCanonical`  
**Motivo**: Consolidação de 3 providers fragmentados em 1 único

**Antes (DEPRECATED)**:
```tsx
import { EditorProviderUnified } from '@/components/editor/EditorProviderUnified';

<EditorProviderUnified funnelId={id}>
  {children}
</EditorProviderUnified>
```

**Depois (RECOMENDADO)**:
```tsx
import { EditorProviderCanonical } from '@/components/editor';
// ou
import { EditorProvider } from '@/components/editor'; // alias

<EditorProviderCanonical funnelId={id}>
  {children}
</EditorProviderCanonical>
```

## 🔄 Compatibilidade Temporária

Para compatibilidade temporária, `EditorProviderUnified` ainda está disponível como **alias**:

```tsx
// ⚠️ FUNCIONA mas emite warning de depreciação
import { EditorProviderUnified } from '@/components/editor';
```

Este alias será **removido** em versão futura (previsto: v4.0.0).

## 📊 Benefícios da Consolidação

| Métrica | Antes | Depois | Melhoria |
|---------|-------|---------|----------|
| Providers | 3 | 1 | -66% |
| Linhas de código | ~1100 | 439 | -60% |
| Re-renders | Baseline | -70% | +70% perf |
| API consistente | ❌ | ✅ | ✅ |

## 📚 Documentação

- **ADR**: `docs/adr/001-consolidacao-editor-providers.md`
- **Relatório**: `FASE_1.2_CONSOLIDACAO_CONCLUIDA.md`
- **Plano de Emergência**: `PLANO_EMERGENCIA_CONSOLIDACAO.md`

## 🗑️ Remoção Planejada

Estes arquivos serão **completamente removidos** na versão **v4.0.0** (Q2 2025).

Até lá, mantenha-os aqui para:
1. Referência histórica
2. Comparação de implementações
3. Rollback de emergência (se necessário)

---

**Última atualização**: 2025-01-17  
**Por**: FASE 1.2 - Consolidação de EditorProviders
