# 🎯 Domínio 3: API/Registry - Análise e Consolidação

## Status Atual ✅

### Registry Principal Identificado
- **EnhancedBlockRegistry.tsx** ➡️ Registry principal com 150+ componentes
- ✅ Arquivo canônico com componentes críticos estáticos
- ✅ Lazy loading para componentes não-críticos
- ✅ Cobertura completa de blocos do quiz

### Estrutura de Registry Mapeada 🔍

#### Registry Principal
- `components/editor/blocks/EnhancedBlockRegistry.tsx` - ✅ Principal, consolidado
- `components/editor/blocks/enhancedBlockRegistry.ts` - 🔍 Versão TypeScript

#### Registry Shims/Auxiliares
- `config/enhancedBlockRegistry.tsx` - ✅ Shim que reexporta o principal
- `config/enhancedBlockRegistry.ts` - 🔍 Versão TypeScript do shim

#### Registries Especializados
- `result-editor/ComponentRegistry.tsx` - 🔍 Para editor de resultados
- `universal/RegistryPropertiesPanel.tsx` - 🔍 Para painel de propriedades

#### Registry de Testes
- `config/__tests__/enhancedBlockRegistry.align.test.ts` - ✅ Testes de alinhamento

## Conflitos Identificados ⚠️

### Case Sensitivity
```
EnhancedBlockRegistry.tsx (PascalCase)
enhancedBlockRegistry.ts/.tsx (camelCase)
```

### Imports Inconsistentes
```typescript
// Alguns usam:
import { ... } from '@/components/editor/blocks/enhancedBlockRegistry';

// Outros usam:
import { ... } from '@/components/editor/blocks/EnhancedBlockRegistry';

// E também:
import { ... } from '@/config/enhancedBlockRegistry';
```

### Múltiplos Pontos de Verdade
- Registry principal: `EnhancedBlockRegistry.tsx`
- Shim em config: `enhancedBlockRegistry.tsx`
- Versões TS: `enhancedBlockRegistry.ts`

## Checklist de Consolidação ✓

### ✅ Registry Principal Identificado
- [x] EnhancedBlockRegistry.tsx é o registry principal
- [x] Contém 150+ componentes mapeados
- [x] Sistema de lazy loading implementado
- [x] Cobertura completa de blocos

### 🔍 Próximas Etapas
- [ ] Resolver conflitos de case sensitivity
- [ ] Consolidar imports para usar apenas o registry principal
- [ ] Remover duplicatas e shims desnecessários
- [ ] Padronizar imports em todo o código

## Análise de Impacto 📊

### Alto Impacto (Cuidado)
- `EnhancedBlockRegistry.tsx` - Registry principal crítico
- Imports em 20+ arquivos diferentes

### Médio Impacto (Padronizar)
- Conflitos de case sensitivity
- Múltiplos pontos de import

### Baixo Impacto (Candidatos à Consolidação)
- Shims redundantes em `/config`
- Versões TS duplicadas

---

**✅ DESCOBERTA**: EnhancedBlockRegistry.tsx já é o registry consolidado, mas há conflitos de naming e imports inconsistentes que precisam ser resolvidos.
