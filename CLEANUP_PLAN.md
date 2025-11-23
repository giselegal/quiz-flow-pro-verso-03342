# 🧹 PLANO DE LIMPEZA - Services Deprecated

## 📊 Status Atual
- **Total de arquivos em `/src/services`**: ~80 arquivos
- **Services deprecated identificados**: 28 services
- **Impacto estimado**: -3.5MB de código redundante

## 🎯 FASE 1: Services Seguros para Remover (ZERO BREAKING CHANGES)

### Categoria 1: Template Services Duplicados
Migrar para `TemplateService` canônico:

```bash
# Deletar (8 arquivos):
rm src/services/UnifiedTemplateService.ts
rm src/services/HybridTemplateService.ts
rm src/services/TemplateFunnelService.ts
rm src/services/stepTemplateService.ts
rm src/services/customTemplateService.ts
rm src/services/templateLibraryService.ts
rm src/services/ScalableHybridTemplateService.ts
rm src/services/templateService.old.ts  # se existir
```

**Substituir imports por**: `@/services/canonical/TemplateService`

### Categoria 2: Funnel Services Duplicados
Migrar para `FunnelService` canônico:

```bash
# Deletar (10 arquivos):
rm src/services/FunnelUnifiedService.ts
rm src/services/FunnelUnifiedServiceV2.ts
rm src/services/EnhancedFunnelService.ts
rm src/services/contextualFunnelService.ts
rm src/services/migratedContextualFunnelService.ts
rm src/services/funnelService.old.ts  # se existir
rm src/services/improvedFunnelSystem.ts
rm src/services/correctedSchemaDrivenFunnelService.ts
rm src/services/schemaDrivenFunnelService.ts
rm src/services/core/EditorFunnelConsolidatedService.ts
```

**Substituir imports por**: `@/services/canonical/FunnelService`

### Categoria 3: Stubs e Facades
```bash
# Deletar (3 arquivos):
rm src/services/funnelLocalStore.ts  # stub vazio
rm src/services/TemplateProcessor.ts  # deprecated
rm src/services/legacy/  # diretório inteiro se existir
```

## 🎯 FASE 2: Consolidação de `/src/services/core`

### Análise de Redundância
**45 arquivos** em `/services/core` podem ser consolidados em **5 canonical services**:

#### Manter (5 arquivos canônicos):
1. `/services/canonical/TemplateService.ts` - ✅ Único para templates
2. `/services/canonical/FunnelService.ts` - ✅ Único para funnels
3. `/services/canonical/QuizService.ts` - ✅ Único para quiz state
4. `/services/canonical/StorageService.ts` - ✅ Único para persistence
5. `/services/canonical/AnalyticsService.ts` - ✅ Único para metrics

#### Deletar/Migrar (40 arquivos):
```bash
# Services com prefixo "Consolidated" (duplicados):
rm src/services/core/ConsolidatedFunnelService.ts
rm src/services/core/ConsolidatedTemplateService.ts
rm src/services/core/ConsolidatedQuizService.ts

# Services com prefixo "Unified" (tentativa anterior):
rm src/services/core/UnifiedDataService.ts
rm src/services/core/UnifiedEditorService.ts
rm src/services/core/UnifiedQuizStorage.ts
rm src/services/core/UnifiedServiceManager.ts

# Services com prefixo "Contextual" (abordagem alternativa):
rm src/services/core/ContextualFunnelService.ts
rm src/services/core/ContextualStorageService.ts

# Services específicos demais:
rm src/services/core/EditorDashboardSyncService.ts
rm src/services/core/EditorFunnelConsolidatedService.ts

# ... (resto dos 40 arquivos)
```

## 🎯 FASE 3: Otimizações de Bundle

### Implementar Code Splitting Agressivo
```typescript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendors
          'vendor-react': ['react', 'react-dom'],
          'vendor-radix': ['@radix-ui/react-tooltip', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable'],
          
          // Features
          'feature-editor': ['src/components/editor/**'],
          'feature-quiz': ['src/components/quiz/**'],
          'feature-dashboard': ['src/pages/dashboard/**'],
          'feature-admin': ['src/pages/admin/**'],
          
          // Services (canonical only)
          'services': ['src/services/canonical/**'],
        }
      }
    }
  }
};
```

## 📊 Métricas de Sucesso

### Antes da Limpeza:
| Métrica | Valor |
|---------|-------|
| Arquivos em `/services` | ~80 |
| Bundle size | ~800KB (estimado) |
| Services deprecated | 28 |

### Meta Após Limpeza:
| Métrica | Valor | Delta |
|---------|-------|-------|
| Arquivos em `/services` | ~10 | -87% |
| Bundle size | <300KB | -62% |
| Services deprecated | 0 | -100% |

## ⚠️ RISCOS E MITIGAÇÕES

### Risco 1: Breaking changes em código não mapeado
**Mitigação**: 
- Buscar todas as referências antes de deletar: `grep -r "NomeDoService" src/`
- Manter backup em branch separada
- Testar build após cada fase

### Risco 2: Testes dependentes de services deprecated
**Mitigação**:
- Atualizar mocks nos testes
- Executar `npm test` após cada fase

### Risco 3: Imports dinâmicos não detectados
**Mitigação**:
- Buscar por imports dinâmicos: `grep -r "import(" src/ | grep services`
- Verificar arquivos de configuração (vite.config, tsconfig)

## 🚀 Execução do Plano

### Comando Único para FASE 1 (Segura):
```bash
#!/bin/bash
# Script de limpeza segura - FASE 1

echo "🧹 Iniciando limpeza FASE 1..."

# Backup
git checkout -b cleanup-phase1-backup
git add -A
git commit -m "Backup antes de cleanup FASE 1"
git checkout main

# Deletar services deprecated (FASE 1 apenas)
echo "Deletando template services deprecated..."
rm -f src/services/UnifiedTemplateService.ts
rm -f src/services/HybridTemplateService.ts
rm -f src/services/TemplateFunnelService.ts

echo "Deletando funnel services deprecated..."
rm -f src/services/FunnelUnifiedService.ts
rm -f src/services/FunnelUnifiedServiceV2.ts

echo "Deletando stubs vazios..."
rm -f src/services/funnelLocalStore.ts
rm -f src/services/TemplateProcessor.ts

# Verificar build
echo "Verificando build..."
npm run build:dev

echo "✅ Cleanup FASE 1 completo!"
echo "📊 Próximo: Atualizar imports e testar aplicação"
```

### Próximos Passos:
1. ✅ **FASE 1**: Executar script acima (10min)
2. 🔄 **Atualizar imports**: Substituir referências aos deleted services (30min)
3. 🧪 **Testar**: Executar suite de testes e verificar aplicação (20min)
4. 📈 **Medir**: Comparar bundle size antes/depois (5min)
5. 🎯 **FASE 2**: Repetir processo para `/services/core` (1 dia)

## 📝 Checklist de Execução

- [ ] Criar branch de backup
- [ ] Executar FASE 1 script
- [ ] Buscar e substituir imports deprecated
- [ ] Executar `npm run build:dev` - verificar sucesso
- [ ] Executar `npm test` - verificar testes
- [ ] Executar `npm run dev` - testar aplicação manualmente
- [ ] Medir bundle size (antes vs depois)
- [ ] Commit e push das mudanças
- [ ] Merge na main após validação
- [ ] Planejar FASE 2
