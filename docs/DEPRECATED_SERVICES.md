# 🗑️ SERVIÇOS DEPRECATED

**Status:** Fase 1 - Deprecation Warnings Ativos  
**Timeline:** Remoção prevista para 2025-12-01

## Arquivos Marcados como Deprecated

### 1. Hooks

#### `src/hooks/useUnifiedEditor.ts`
- **Status:** ⚠️ DEPRECATED
- **Motivo:** Muito complexo (274 linhas) com auto-detecção excessiva
- **Substituir por:** `src/hooks/useEditor.ts` (simplificado)
- **Redução:** 70% menos código
- **Prazo:** Remoção em 2 semanas

#### `src/hooks/useEditorWrapper.ts`
- **Status:** ⚠️ DEPRECATED
- **Motivo:** Camada desnecessária de indireção
- **Substituir por:** `src/hooks/useEditor.ts` diretamente
- **Prazo:** Remoção em 2 semanas

### 2. Services

#### `src/core/funnel/services/TemplateService.ts`
- **Status:** ⚠️ DEPRECATED
- **Motivo:** Duplicação com TemplateService canônico
- **Substituir por:** `src/services/canonical/TemplateService.ts`
- **Dependências:** ~50 arquivos
- **Prazo:** Remoção em 4 semanas (após migração de dependências)

#### `src/services/HybridTemplateService.ts`
- **Status:** ⚠️ DEPRECATED
- **Motivo:** Funcionalidade movida para TemplateService canônico
- **Substituir por:** `src/services/canonical/TemplateService.ts`
- **Dependências:** ~15 arquivos
- **Prazo:** Remoção em 2 semanas

#### `src/services/TemplatesCacheService.ts`
- **Status:** ⚠️ DEPRECATED
- **Motivo:** Consolidado em CacheService canônico
- **Substituir por:** `src/services/canonical/CacheService.ts`
- **Dependências:** ~8 arquivos
- **Prazo:** Remoção em 2 semanas

### 3. Providers

#### `src/providers/ConsolidatedProvider.tsx`
- **Status:** ⚠️ DEPRECATED
- **Motivo:** Substituído por UnifiedAppProvider
- **Substituir por:** `src/providers/UnifiedAppProvider.tsx`
- **Dependências:** ~5 arquivos
- **Prazo:** Remoção em 4 semanas

#### `src/providers/FunnelMasterProvider.tsx`
- **Status:** ⚠️ DEPRECATED
- **Motivo:** Funcionalidade consolidada em UnifiedAppProvider
- **Substituir por:** `src/providers/UnifiedAppProvider.tsx`
- **Dependências:** ~3 arquivos
- **Prazo:** Remoção em 4 semanas

### 4. Rotas (App.tsx)

#### `/editor-new`
- **Status:** ⚠️ DEPRECATED → Auto-redirect
- **Motivo:** Consolidação em rota canônica
- **Redireciona para:** `/editor`
- **Prazo:** Remoção do redirect em 8 semanas

#### `/editor-modular`
- **Status:** ⚠️ DEPRECATED → Auto-redirect
- **Motivo:** Consolidação em rota canônica
- **Redireciona para:** `/editor`
- **Prazo:** Remoção do redirect em 8 semanas

## Timeline de Remoção

```
Semana 1-2 (Atual):
✅ Deprecation warnings ativos
✅ Guias de migração disponíveis
✅ Redirects configurados

Semana 3-4:
🔄 Migração de dependências críticas
🔄 Atualização de imports em massa
🔄 Testes de regressão

Semana 5-6:
🗑️ Remoção de hooks deprecated
🗑️ Remoção de services simples
🗑️ Limpeza de imports

Semana 7-8:
🗑️ Remoção de providers legacy
🗑️ Remoção de redirects de rota
🗑️ Limpeza final
```

## Guia de Migração

### Hooks

```typescript
// ❌ DEPRECATED
import { useEditor } from '@/hooks/useUnifiedEditor';
import { useEditorOptional } from '@/hooks/useEditorWrapper';

// ✅ NOVO
import { useEditor, useEditorOptional } from '@/hooks/useEditor';
```

### Services

```typescript
// ❌ DEPRECATED
import { TemplateService } from '@/core/funnel/services/TemplateService';
import { HybridTemplateService } from '@/services/HybridTemplateService';
import { TemplatesCacheService } from '@/services/TemplatesCacheService';

// ✅ NOVO
import { TemplateService, templateService } from '@/services/canonical/TemplateService';
import { cacheService } from '@/services/canonical/CacheService';
```

### Providers

```typescript
// ❌ DEPRECATED
import ConsolidatedProvider from '@/providers/ConsolidatedProvider';
import { FunnelMasterProvider } from '@/providers/FunnelMasterProvider';

// ✅ NOVO
import UnifiedAppProvider from '@/providers/UnifiedAppProvider';
```

### Rotas

```typescript
// ❌ DEPRECATED
<Link href="/editor-new">Novo Editor</Link>
<Link href="/editor-modular">Editor Modular</Link>

// ✅ NOVO
<Link href="/editor">Editor</Link>
```

## Impacto por Arquivo

### Alto Impacto (>10 dependências)

1. **useUnifiedEditor.ts** - 50+ arquivos dependem
2. **TemplateService (core/funnel)** - 45+ arquivos dependem
3. **HybridTemplateService.ts** - 15+ arquivos dependem

### Médio Impacto (5-10 dependências)

4. **TemplatesCacheService.ts** - 8 arquivos dependem
5. **ConsolidatedProvider.tsx** - 5 arquivos dependem

### Baixo Impacto (<5 dependências)

6. **useEditorWrapper.ts** - 3 arquivos dependem
7. **FunnelMasterProvider.tsx** - 3 arquivos dependem

## Checklist de Remoção

Para cada arquivo deprecated:

- [ ] Verificar todas as dependências
- [ ] Criar issues de migração
- [ ] Atualizar imports
- [ ] Executar testes
- [ ] Verificar warnings no console
- [ ] Commitar migração
- [ ] Aguardar período de estabilização
- [ ] Remover arquivo
- [ ] Atualizar documentação
- [ ] Anunciar remoção

## Monitoramento

### Métricas de Adoção

Use o dashboard de monitoramento canônico:
```typescript
import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';

const stats = CanonicalServicesMonitor.getStats();
console.log('Adoption rate:', stats.adoptionRate);
```

### Warnings no Console

Todos os arquivos deprecated emitem warnings:
```
⚠️ [DEPRECATED] useEditorWrapper is deprecated. Use @/hooks/useEditor directly
⚠️ [DEPRECATED] ConsolidatedProvider is deprecated. Use UnifiedAppProvider instead
```

## Suporte

Para dúvidas sobre migração:
1. Consulte `docs/MIGRATION_GUIDE.md`
2. Verifique `docs/ARCHITECTURE_CURRENT.md`
3. Procure por warnings no console
4. Abra issue no repositório

## Benefícios da Remoção

Ao final do processo:

✅ -40% no tamanho do codebase  
✅ -50% nos warnings de TypeScript  
✅ -30% no bundle size  
✅ +50% na velocidade de build  
✅ Código mais simples e maintível
