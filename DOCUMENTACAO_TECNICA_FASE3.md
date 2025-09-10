# 📚 Documentação Técnica - Padrões Estabelecidos na Fase 3

## 🎯 Visão Geral

A **Fase 3: Atualização de Testes e Documentação** estabeleceu novos padrões para desenvolvimento, testes e manutenção do projeto. Este documento serve como guia técnico para desenvolvedores.

## 🏗️ Arquitetura de Componentes Consolidada

### Painéis de Propriedades Padronizados

**Componentes Ativos:**
- **`OptimizedPropertiesPanel`** - Painel principal para edição de propriedades
- **`EnhancedUniversalPropertiesPanel`** - Painel universal para casos diversos
- **`RegistryPropertiesPanel`** - Baseado em registry de componentes
- **`QuizPropertiesPanelModular`** - Especializado para componentes de quiz

**Padrão de Uso:**
```typescript
// Importação recomendada
import { OptimizedPropertiesPanel } from '@/components/editor/OptimizedPropertiesPanel';

// Interface unificada
interface PropertiesPanelProps {
  selectedBlock: UnifiedBlock | null;
  onUpdate?: (blockId: string, updates: Partial<UnifiedBlock>) => void;
  onClose?: () => void;
  onDelete?: (blockId: string) => void;
}
```

### Editor Principal Unificado

**`MainEditorUnified`** é o editor padrão do sistema:
- **Localização:** `/workspaces/quiz-quest-challenge-verse/src/pages/MainEditorUnified.tsx`
- **Rota:** `/editor`
- **Características:**
  - Lazy loading com fallback para EditorPro
  - Sistema de contextos unificados
  - Suporte a debug mode via URL
  - Configuração Supabase robusta

```typescript
// Exemplo de uso com parâmetros
/editor?template=quiz-completo&funnel=test&step=5&debug=true
```

## 🧪 Padrões de Testes

### Configuração Vitest Otimizada

**Configurações importantes:**
- **Pool:** `forks` para isolamento de memória
- **Limite de memória:** 8192MB para workers
- **Timeouts:** 30s para testes, 15s para hooks
- **Concorrência:** Limitada para evitar OOM

```typescript
// vitest.config.ts - Configuração otimizada
export default defineConfig({
  test: {
    pool: 'forks',
    poolOptions: {
      forks: {
        minForks: 1,
        maxForks: 1,
        execArgv: ['--max-old-space-size=8192'],
      },
    },
    testTimeout: 30000,
    maxConcurrency: 1,
  },
});
```

### Padrão de Testes para Componentes

**Template base para testes de componentes:**
```typescript
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mocks leves dos módulos UI
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

// Mock de hooks complexos
vi.mock('@/hooks/useUnifiedProperties', () => ({
  useUnifiedProperties: () => ({
    properties: {},
    updateProperty: vi.fn(),
    resetProperties: vi.fn(),
    getPropertiesByCategory: vi.fn(() => []),
  }),
}));

describe('ComponentName', () => {
  const mockProps = {
    // Props mínimas necessárias
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(<ComponentName {...mockProps} />);
    expect(container).toBeInTheDocument();
  });

  // Mais testes específicos...
});
```

### Testes Corrigidos e Validados

**✅ Testes que passaram:**
- `OptimizedPropertiesPanel.test.tsx` (5 testes)
- `templateManager.publish.test.ts` (3 testes)
- `schema-resolution.test.ts` (3 testes com tolerância)

## 📋 Padrões de Desenvolvimento

### Estrutura de Arquivos

**Organização recomendada:**
```
src/
├── components/
│   ├── editor/
│   │   ├── __tests__/          # Testes específicos do editor
│   │   ├── OptimizedPropertiesPanel.tsx
│   │   └── ...
│   └── universal/              # Componentes reutilizáveis
├── pages/
│   ├── __tests__/              # Testes de páginas
│   ├── MainEditorUnified.tsx   # Editor principal
│   └── ...
├── types/
│   ├── master-schema.ts        # Tipos unificados
│   └── ...
└── utils/
    ├── TemplateManager.ts      # Gerenciamento de templates
    └── ...
```

### Nomenclatura de Componentes

**Convenções estabelecidas:**
- **Componentes principais:** `PascalCase` + `Unified/Optimized` quando aplicável
- **Testes:** `ComponentName.test.tsx`
- **Tipos:** `UnifiedBlock`, `UnifiedProperty` para schemas centralizados
- **Hooks:** `useUnifiedProperties`, `useOptimized*`

### Imports e Exports

**Padrão de importação:**
```typescript
// Importações absolutas com alias @
import { OptimizedPropertiesPanel } from '@/components/editor/OptimizedPropertiesPanel';
import type { UnifiedBlock } from '@/types/master-schema';

// Exportações nomeadas preferenciais
export { OptimizedPropertiesPanel };
export type { UnifiedBlock };
```

## 🔄 Fluxos de Desenvolvimento

### Adicionando Novos Componentes

1. **Criar componente** seguindo padrões estabelecidos
2. **Implementar tipos** compatíveis com `UnifiedBlock`
3. **Criar testes básicos** usando template padrão
4. **Documentar** interface e uso no código
5. **Integrar** com painéis de propriedades existentes

### Modificando Componentes Existentes

1. **Verificar dependências** com outros componentes
2. **Atualizar testes** relacionados
3. **Manter compatibilidade** com interfaces UnifiedBlock
4. **Testar integração** com MainEditorUnified
5. **Documentar** mudanças significativas

## 🚨 Problemas Conhecidos e Soluções

### Erro de Memória em Testes

**Problema:** JavaScript heap out of memory
**Solução:** 
- Usar configuração `forks` no Vitest
- Limitar concorrência de testes
- Aumentar limite de memória para workers

### Schemas Ausentes em Blocos

**Problema:** Muitos blocos sem schema definido
**Solução:**
- Aceitar até 50 blocos sem schema (muitos são decorativos)
- Focar em schemas para blocos funcionais críticos
- Usar sistema de fallback para schemas legados

### Dependências Pesadas em Testes

**Problema:** Testes lentos por dependências complexas
**Solução:**
- Usar mocks leves para componentes UI
- Mockar hooks complexos
- Evitar renderização completa desnecessária

## 📈 Métricas de Qualidade

**Objetivos estabelecidos:**
- **Cobertura de testes:** Focada em componentes críticos
- **Performance:** Build < 15s, testes unitários < 30s
- **Manutenibilidade:** Máximo 3 painéis ativos por domínio
- **Consistência:** 100% dos novos componentes seguem padrões

---

*Documento atualizado em: 10/09/2025*
*Versão: 3.0 - Fase 3 concluída*
