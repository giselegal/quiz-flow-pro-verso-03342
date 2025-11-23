# 🗑️  Relatório de Cleanup - FASE 3

**Data:** 2025-11-23T02:51:04.587Z  
**Total de arquivos:** 10  
**Tamanho total:** 128.01 KB

## Arquivos para Remover


### 1. `./src/services/DEPRECATED_CacheSystems.md`
- **Tamanho:** 5.07 KB
- **Razão:** Nome com DEPRECATED


### 2. `./src/services/DEPRECATED_FunnelUnifiedService.md`
- **Tamanho:** 1.56 KB
- **Razão:** Nome com DEPRECATED


### 3. `./src/services/ServiceAliases.ts`
- **Tamanho:** 10.40 KB
- **Razão:** @deprecated ou TODO remove no código


### 4. `./src/services/TemplatesCacheService.ts`
- **Tamanho:** 0.50 KB
- **Razão:** @deprecated ou TODO remove no código


### 5. `./src/services/canonical/NavigationService.ts`
- **Tamanho:** 14.86 KB
- **Razão:** @deprecated ou TODO remove no código


### 6. `./src/services/canonical/TemplateService.ts`
- **Tamanho:** 61.64 KB
- **Razão:** @deprecated ou TODO remove no código


### 7. `./src/services/data/index.ts`
- **Tamanho:** 1.84 KB
- **Razão:** @deprecated ou TODO remove no código


### 8. `./src/services/deprecated/DEPRECATION_WARNINGS.ts`
- **Tamanho:** 3.37 KB
- **Razão:** Padrão deprecated detectado


### 9. `./src/services/stepTemplateService.ts`
- **Tamanho:** 15.51 KB
- **Razão:** @deprecated ou TODO remove no código


### 10. `./src/services/unified/UnifiedCacheService.ts`
- **Tamanho:** 13.25 KB
- **Razão:** @deprecated ou TODO remove no código


## Recomendação

Para remover todos os arquivos deprecated:

```bash
# BACKUP primeiro!
tar -czf deprecated-backup.tar.gz ./src/services/DEPRECATED_CacheSystems.md ./src/services/DEPRECATED_FunnelUnifiedService.md ./src/services/ServiceAliases.ts ./src/services/TemplatesCacheService.ts ./src/services/canonical/NavigationService.ts ./src/services/canonical/TemplateService.ts ./src/services/data/index.ts ./src/services/deprecated/DEPRECATION_WARNINGS.ts ./src/services/stepTemplateService.ts ./src/services/unified/UnifiedCacheService.ts

# Remover arquivos
rm ./src/services/DEPRECATED_CacheSystems.md
rm ./src/services/DEPRECATED_FunnelUnifiedService.md
rm ./src/services/ServiceAliases.ts
rm ./src/services/TemplatesCacheService.ts
rm ./src/services/canonical/NavigationService.ts
rm ./src/services/canonical/TemplateService.ts
rm ./src/services/data/index.ts
rm ./src/services/deprecated/DEPRECATION_WARNINGS.ts
rm ./src/services/stepTemplateService.ts
rm ./src/services/unified/UnifiedCacheService.ts
```

**⚠️  ATENÇÃO:** Teste completamente antes de remover!
