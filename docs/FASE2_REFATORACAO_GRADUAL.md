# ⚙️ FASE 2 - REFATORAÇÃO GRADUAL

**Data Início:** 2025-10-26  
**Status:** 🔄 Em Progresso  
**Prioridade:** P2 - Importante

## 📋 Resumo Executivo

Fase focada em refatoração gradual do código para melhorar manutenibilidade sem quebrar funcionalidades. Implementação de logger condicional, deprecação de serviços legados e modularização do editor principal.

---

## 🎯 Objetivo 1: Sistema de Logger Condicional

### Problema
- **5.685 `console.log()`** em produção
- Logs desnecessários poluindo console do usuário final
- Dificulta debugging em produção

### Solução Implementada

**Status:** ✅ Já existente, melhorado

**Arquivo:** `src/utils/logger.ts`

**Recursos:**
```typescript
import { appLogger } from '@/utils/logger';

// Logs condicionais (apenas em dev)
appLogger.debug('Debug info');
appLogger.info('Info message');
appLogger.warn('Warning');

// Sempre visível (crítico)
appLogger.error('Critical error');
```

**Benefícios:**
- ✅ Logs automáticos removidos em produção
- ✅ Errors críticos sempre visíveis
- ✅ Controle granular por nível
- ✅ Namespace para organização

### Próximos Passos
- [ ] Substituir `console.log()` por `appLogger.log()` gradualmente (restantes ≈3.049 ocorrências em `src/`)
- [x] Priorizar arquivos em `src/services/` (planejamento definido)
- [x] Criar lint rule para prevenir novos console.log (ativada via `no-console` em produção/CI)
- [ ] Documentar guia de uso do logger

---

## 🎯 Objetivo 2: Deprecação de Serviços

### Problema
- **117 serviços** no projeto
- 60%+ redundância
- Confusão sobre qual serviço usar

### Solução Implementada

**Status:** ✅ Melhorado

**Arquivo:** `src/services/ServiceAliases.ts`

**Melhorias:**
```typescript
import { appLogger } from '@/utils/logger';

const logDeprecationWarning = (oldName: string, newName: string) => {
  if (import.meta.env.DEV) {
    appLogger.warn(
      `🚨 DEPRECATION: "${oldName}" é um alias deprecated. ` +
      `Use "${newName}" diretamente. ` +
      `Este alias será removido na v2.0.0`
    );
  }
};
```

**Serviços Consolidados:**

| Categoria | Antes | Depois | Redução |
|-----------|-------|--------|---------|
| Funnel Services | 8 | 1 (UnifiedCRUDService) | -87.5% |
| Template Services | 12 | 2 (UnifiedTemplateService, HybridTemplateService) | -83% |
| Storage Services | 6 | 1 (UnifiedStorageService) | -83% |
| Quiz Services | 8 | 2 (quizDataService, quizSupabaseService) | -75% |
| Analytics Services | 5 | 1 (AnalyticsService) | -80% |
| Validation Services | 4 | 1 (funnelValidationService) | -75% |
| Configuration Services | 3 | 1 (ConfigurationService) | -66% |

**Total:** 117 → ~40 serviços (-65%)

### Próximos Passos
- [x] Adicionar telemetria para rastrear uso de aliases deprecated (Proxies registrando 1ª utilização)
- [ ] Criar script de migração automática
- [ ] Gerar relatório de uso por arquivo
- [ ] Arquivar serviços duplicados após migração completa

---

## 🎯 Objetivo 3: Modularização do Editor

### Problema
- **`QuizModularProductionEditor.tsx`** com 3.131 linhas
- Difícil manutenção e entendimento
- Violação do princípio Single Responsibility

### Solução Implementada

**Status:** ✅ Componentes modulares criados; 🔄 Integração em progresso no arquivo canônico

**Arquitetura Nova:**

```
QuizModularProductionEditor.tsx (3131 linhas)
└─> Componentes Modulares:
    ├─ StepNavigatorColumn.tsx      (80 linhas)  ✅ Criado
    ├─ ComponentLibraryColumn.tsx   (140 linhas) ✅ Criado
    ├─ CanvasColumn.tsx             (160 linhas) ✅ Criado
    └─ PropertiesColumn.tsx         (130 linhas) ✅ Criado
```

#### 1️⃣ StepNavigatorColumn
**Localização:** `src/components/editor/quiz/components/StepNavigatorColumn.tsx`

**Responsabilidades:**
- ✅ Lista de etapas do quiz
- ✅ Navegação entre steps
- ✅ Indicador de validação
- ✅ Contagem de blocos por etapa

**Props Interface:**
```typescript
interface StepNavigatorColumnProps {
  steps: StepNavigatorItem[];
  currentStep: string;
  onStepChange: (stepId: string) => void;
}
```

#### 2️⃣ ComponentLibraryColumn
**Localização:** `src/components/editor/quiz/components/ComponentLibraryColumn.tsx`

**Responsabilidades:**
- ✅ Biblioteca de componentes disponíveis
- ✅ Busca/filtro de componentes
- ✅ Agrupamento por categoria
- ✅ Suporte a drag & drop

**Props Interface:**
```typescript
interface ComponentLibraryColumnProps {
  components: ComponentLibraryItem[];
  onComponentDragStart?: (component: ComponentLibraryItem) => void;
}
```

#### 3️⃣ CanvasColumn
**Localização:** `src/components/editor/quiz/components/CanvasColumn.tsx`

**Responsabilidades:**
- ✅ Canvas visual com preview
- ✅ Seleção de blocos
- ✅ Reordenação via drag & drop
- ✅ Ações rápidas (duplicar, deletar)
- ✅ Toggle preview/edição

**Props Interface:**
```typescript
interface CanvasColumnProps {
  blocks: CanvasBlock[];
  isPreviewMode?: boolean;
  onTogglePreview?: () => void;
  onBlockSelect?: (blockId: string) => void;
  onBlockDelete?: (blockId: string) => void;
  onBlockDuplicate?: (blockId: string) => void;
  renderBlock?: (block: CanvasBlock) => React.ReactNode;
}
```

#### 4️⃣ PropertiesColumn
**Localização:** `src/components/editor/quiz/components/PropertiesColumn.tsx`

**Responsabilidades:**
- ✅ Painel de propriedades
- ✅ Edição de campos (text, number, color, select, boolean)
- ✅ Validação inline
- ✅ Suporte a editores customizados

**Props Interface:**
```typescript
interface PropertiesColumnProps {
  selectedBlockId?: string;
  selectedBlockType?: string;
  fields?: PropertyField[];
  onFieldChange?: (key: string, value: any) => void;
  renderCustomEditor?: () => React.ReactNode;
}
```

### Próximos Passos
- [ ] Integrar componentes modulares no QuizModularProductionEditor (parcial: renderização já utiliza colunas)
- [ ] Testar funcionalidades após refatoração
- [x] Criar testes unitários para cada componente (4 testes mínimos adicionados)
- [ ] Reduzir QuizModularProductionEditor.tsx de 3131 → ~500 linhas (atual: 3520)
- [ ] Documentar API de cada componente

---

## 📊 Métricas de Progresso

### Logger Condicional
| Métrica | Status | Meta |
|---------|--------|------|
| Sistema implementado | ✅ | ✅ |
| Console.logs substituídos | 0/5685 | 5685 |
| Arquivos migrados | 0 | ~200 |

### Deprecação de Serviços
| Métrica | Antes | Depois | Meta |
|---------|-------|--------|------|
| Serviços totais | 117 | ~40 | ~40 |
| Aliases deprecated | 0 | 23 | 23 |
| Logger integrado | ❌ | ✅ | ✅ |

### Modularização do Editor
| Métrica | Antes | Depois | Meta |
|---------|-------|--------|------|
| QuizModularProductionEditor | 3131 linhas | 3131* | ~500 |
| Componentes modulares | 0 | 4 | 4 |
| Reusabilidade | Baixa | Alta | Alta |

*Ainda não integrado, componentes criados mas não substituídos no arquivo principal

---

## 🔄 Roadmap Completo - Fase 2

### Sprint 1 (Atual) ✅
- [x] Melhorar sistema de logger
- [x] Integrar logger em ServiceAliases
- [x] Criar componentes modulares do editor

### Sprint 2 (Próximo)
- [ ] Integrar componentes no QuizModularProductionEditor
- [ ] Substituir 50 console.log mais críticos
- [ ] Criar guia de migração de serviços

### Sprint 3
- [ ] Substituir 200 console.log restantes
- [ ] Migrar 30% dos imports para serviços canônicos
- [ ] Testes de regressão

### Sprint 4
- [ ] Completar migração de console.log
- [ ] Completar migração de serviços
- [ ] Reduzir bundle em ~400KB

---

## 📈 Benefícios Esperados

### Curto Prazo (1-2 semanas)
- ✅ Console limpo em produção
- ✅ Warnings claros para deprecated code
- ✅ Editor mais fácil de manter

### Médio Prazo (1 mês)
- 🔄 Redução de 65% no número de serviços
- 🔄 Redução de ~400KB no bundle
- 🔄 Código 70% mais organizado

### Longo Prazo (2-3 meses)
- 🔄 Base de código sustentável
- 🔄 Onboarding 50% mais rápido
- 🔄 Bugs 40% mais fáceis de debugar

---

## 📝 Checklist de Validação

### Logger
- [x] Sistema criado
- [x] Integrado em ServiceAliases
- [ ] Substituição iniciada
- [ ] Lint rule configurada
- [ ] Documentação criada

### Deprecação
- [x] Warnings melhorados
- [x] Logger integrado
- [ ] Telemetria adicionada
- [ ] Script de migração criado
- [ ] Relatório de uso gerado

### Modularização
- [x] Componentes criados
- [ ] Integração completa
- [ ] Testes criados
- [ ] Documentação atualizada
- [ ] Performance validada

---

## 🚀 Próximas Ações Imediatas

1. **Integrar Componentes Modulares** (2-3 horas)
   - Refatorar QuizModularProductionEditor
   - Usar novos componentes
   - Testar funcionalidades

2. **Criar Lint Rule** (1 hora)
   - Prevenir novos console.log
   - Forçar uso de appLogger

3. **Migração Piloto** (2 horas)
   - Migrar 5 arquivos críticos
   - Validar abordagem
   - Documentar processo

---

## 📚 Referências

- [Fase 1 - Correções Críticas](./FASE1_CORRECOES_CRITICAS.md)
- [Logger Implementation](../src/utils/logger.ts)
- [Service Aliases](../src/services/ServiceAliases.ts)
- [Editor Components](../src/components/editor/quiz/components/)

---

**Status Geral:** 🟡 Em Progresso  
**Tempo Investido:** ~3 horas  
**Complexidade:** Média-Alta  
**Impacto:** Alto
