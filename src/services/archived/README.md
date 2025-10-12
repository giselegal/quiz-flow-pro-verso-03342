# 🗄️ Serviços Arquivados - Sprint 3

Este diretório contém serviços com **baixo uso** (< 3 referências) arquivados automaticamente.

## ⚠️ Status: ARQUIVADO (Não usar)

Estes serviços foram identificados como pouco utilizados ou obsoletos.

## 📋 Lista de Arquivados

| Arquivo | Refs | Usado Em |
|---------|------|----------|
| OptimizedHybridTemplateService.ts | 0 | nenhum |
| ScalableHybridTemplateService.ts | 2 | src/components/core/ScalableQuizRenderer.tsx, src/hooks/useStepConfig.ts |
| ActivatedAnalytics.ts | 1 | src/hooks/useActivatedFeatures.ts |
| unifiedAnalytics.ts | 2 | src/hooks/useDashboard.ts, src/services/archived/ActivatedAnalytics.ts |
| FunnelUnifiedServiceV2.ts | 0 | nenhum |
| correctedSchemaDrivenFunnelService.ts | 0 | nenhum |
| migratedContextualFunnelService.ts | 1 | src/components/editor/FunnelManager.tsx |

## 🔄 Restauração

Se algum destes serviços for necessário:
1. Mova de volta para `src/services/`
2. Remova o header de arquivamento
3. Atualize imports se necessário

## 🗑️ Deleção

Após 2 semanas sem necessidade, deletar com segurança:
```bash
rm -rf src/services/archived/
```

---

**Data:** 2025-10-12  
**Arquivados:** 7 serviços  
**Critério:** < 3 referências no código
