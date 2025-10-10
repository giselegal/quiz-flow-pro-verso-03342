# 📚 Documentação Técnica - Padrões Unificados

## 🎯 Visão Geral dos Componentes Consolidados

Este documento estabelece os padrões técnicos para os componentes unificados após o processo de consolidação arquitetural.

## 🧩 Painéis de Propriedades

### Hierarquia de Componentes

1. **OptimizedPropertiesPanel** (Principal)
   - **Localização:** `src/components/editor/OptimizedPropertiesPanel.tsx`
   - **Uso:** Editor principal (/editor-fixed)
   - **Características:** Interface moderna, performance otimizada, funcionalidade completa
   - **Props Interface:**
     ```typescript
     interface OptimizedPropertiesPanelProps {
       selectedBlock: UnifiedBlock | null;
       onUpdate?: (blockId: string, updates: Partial<UnifiedBlock>) => void;
       onClose?: () => void;
       onDelete?: (blockId: string) => void;
     }
     ```

2. **EnhancedUniversalPropertiesPanel** (Universal)
   - **Localização:** `src/components/universal/EnhancedUniversalPropertiesPanel.tsx`
   - **Uso:** Múltiplos contextos, editores especializados
   - **Características:** Painel universal com editores especializados por tipo

3. **RegistryPropertiesPanel** (Registry-based)
   - **Localização:** `src/components/universal/RegistryPropertiesPanel.tsx`
   - **Uso:** SchemaDrivenEditorResponsive
   - **Características:** Baseado em registry de componentes

4. **QuizPropertiesPanelModular** (Especializado)
   - **Localização:** `src/components/editor/quiz/QuizPropertiesPanelModular.tsx`
   - **Uso:** Específico para quiz
   - **Características:** Wrapper do EditorPropertiesPanel

## 📱 Editor Principal

### MainEditorUnified
- **Localização:** `src/pages/MainEditorUnified.tsx`
- **Rota:** `/editor`
- **Características:**
  - Lazy loading com fallback robusto
  - Múltiplos contexts integrados
  - Configuração Supabase consolidada
  - Sistema de debug via URL params
  - Compatibilidade máxima com componentes legacy

### Configuração via URL
```
/editor?template=quiz-completo&funnel=test-funnel&step=5&debug=true
```

**Parâmetros suportados:**
- `template`: ID do template a carregar
- `funnel`: ID do funil
- `step`: Etapa inicial (1-21)
- `debug`: Ativa modo debug (true/false)

## 🔧 Hooks e Utilitários

### useUnifiedProperties
- **Localização:** `src/hooks/useUnifiedProperties.ts`
- **Uso:** Gerenciamento de propriedades dos blocos
- **Retorna:**
  ```typescript
  {
    properties: Record<string, any>;
    updateProperty: (key: string, value: any) => void;
    resetProperties: () => void;
    getPropertiesByCategory: (category: string) => any[];
  }
  ```

### TemplateManager
- **Localização:** `src/utils/TemplateManager.ts`
- **Uso:** Gerenciamento de templates consolidado
- **Delega para:** `UnifiedTemplateService`
- **Métodos principais:**
  ```typescript
  static async loadStepBlocks(stepId: string): Promise<Block[]>;
  static publishStep(stepId: string, blocks: Block[]): void;
  static unpublishStep(stepId: string): void;
  ```

## 📋 Tipos Unificados

### UnifiedBlock
- **Localização:** `src/types/master-schema.ts`
- **Definição:** Baseado em Zod schema
- **Campos principais:**
  ```typescript
  {
    id: string;
    type: BlockType;
    order: number;
    properties: Record<string, UnifiedProperty>;
    version: string;
    children: UnifiedBlock[];
    events: any[];
    locked: boolean;
    visible: boolean;
  }
  ```

## 🧪 Padrões de Teste

### Estrutura de Testes
```
src/
├── components/
│   └── editor/
│       └── __tests__/
│           └── OptimizedPropertiesPanel.test.tsx
├── pages/
│   └── __tests__/
│       └── MainEditorUnified.test.tsx
└── __tests__/
    └── templateManager.publish.test.ts
```

### Configuração Vitest
- **Pool:** forks (isolamento de memória)
- **Memory limit:** 8192MB por worker
- **Concurrency:** Desabilitada para estabilidade
- **Mocks:** Componentes UI mockados para testes leves

### Padrões de Mock
```typescript
// Mock básico de componentes UI
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

// Mock de hooks
vi.mock('@/hooks/useUnifiedProperties', () => ({
  useUnifiedProperties: () => ({
    properties: {},
    updateProperty: vi.fn(),
    resetProperties: vi.fn(),
    getPropertiesByCategory: vi.fn(() => []),
  }),
}));
```

## 🚀 Performance

### Lazy Loading
- Todos os componentes pesados usam React.lazy()
- Fallbacks graceiros para componentes legacy
- Sistema de retry automático

### Cache
- Templates são cacheados por 5 minutos
- Invalidação automática em mudanças
- Cache inteligente com timestamp

### Bundle Optimization
- Code splitting por rotas
- Import dinâmico de editores
- Preload seletivo de recursos críticos

## 📈 Métricas de Qualidade

### Cobertura de Testes
- Componentes principais: 100%
- Utilitários críticos: 95%+
- Fluxos de integração: 85%+

### Performance Targets
- Time to Interactive: < 3s
- Bundle principal: < 2MB
- Lazy chunks: < 500KB cada

---

*Última atualização: Setembro 10, 2025*
*Versão: 3.0 - Consolidação Arquitetural*
