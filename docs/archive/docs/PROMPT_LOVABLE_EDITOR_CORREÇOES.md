# 🎯 PROMPT PARA LOVABLE: CORREÇÃO DO EDITOR DE ETAPAS DO FUNIL

## 📋 CONTEXTO

O editor `SchemaDrivenEditorResponsive.tsx` está com problemas na navegação entre etapas e carregamento de templates. As etapas não estão sendo filtradas corretamente e há dependências desnecessárias do Supabase.

## 🚨 PROBLEMAS IDENTIFICADOS

### 1. **Navegação de Etapas Quebrada**

- Usuário clica em etapa mas continua vendo blocos de outras etapas
- Filtro `sortedBlocks` não funciona corretamente
- Blocos não têm `stepId` associado

### 2. **Templates Não Carregam**

- `getStepTemplate()` retorna array vazio
- `stepTemplateService.getStepTemplate()` falha silenciosamente
- Fallback não funciona adequadamente

### 3. **Dependência Desnecessária do Supabase**

- Editor trava aguardando resposta do Supabase
- Deveria funcionar 100% offline com `stepTemplateService`
- `loadUnifiedData` bloqueia inicialização

### 4. **Hooks Duplicados**

- 71 hooks reduzidos para 36, mas ainda há conflitos
- Import errors: `./useHistory` não encontrado
- Bundle size ainda grande (chunks > 500kB)

## 🎯 ALTERAÇÕES PONTUAIS SOLICITADAS

### **PRIORIDADE 1: Corrigir Navegação de Etapas**

```typescript
// EM: src/components/editor/SchemaDrivenEditorResponsive.tsx

// 1. CORREÇÃO: Sempre associar stepId aos blocos
const handleAddBlock = useCallback(
  (blockType: string) => {
    const newBlockId = addBlock(blockType as any);
    setSelectedBlockId(newBlockId);

    // 🔧 ADICIONAR: Associar à etapa atual SEMPRE
    if (newBlockId) {
      setTimeout(() => {
        updateBlock(newBlockId, { stepId: selectedStepId });
      }, 50);
    }
  },
  [addBlock, selectedStepId, updateBlock]
);

// 2. CORREÇÃO: Filtro de blocos mais robusto
const sortedBlocks = useMemo(() => {
  const stepBlocks = blocks.filter(block => {
    // Se tem stepId, deve corresponder à etapa atual
    if (block.stepId) {
      return block.stepId === selectedStepId;
    }
    // Se não tem stepId, só mostrar se for a primeira etapa
    return selectedStepId === 'etapa-1';
  });

  console.log(`🔍 Etapa: ${selectedStepId}, Blocos: ${stepBlocks.length}`);
  return [...stepBlocks].sort((a, b) => (a.order || 0) - (b.order || 0));
}, [blocks, selectedStepId]);
```

### **PRIORIDADE 2: Inicialização Local First**

```typescript
// 3. CORREÇÃO: Priorizar stepTemplateService
useEffect(() => {
  // SEMPRE carregar dados locais primeiro
  const loadLocalSteps = () => {
    try {
      const serviceSteps = stepTemplateService.getAllSteps();
      if (serviceSteps && serviceSteps.length > 0) {
        setSteps(serviceSteps);
        setSelectedStepId('etapa-1');
        console.log('✅ Etapas locais carregadas:', serviceSteps.length);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar etapas locais:', error);
    }
  };

  // Carregar imediatamente
  loadLocalSteps();

  // Supabase opcional, em background
  if (funnelId) {
    loadSupabaseData(funnelId).catch(() => {
      console.log('🔄 Supabase indisponível, mantendo dados locais');
    });
  }
}, []);
```

### **PRIORIDADE 3: Template Loading Robusto**

```typescript
// 4. CORREÇÃO: getStepTemplate com fallback garantido
const getStepTemplate = useCallback((stepId: string) => {
  try {
    const stepNumber = parseInt(stepId.replace(/\D/g, ''));
    console.log(`🔍 Buscando template para step ${stepNumber}`);

    const template = stepTemplateService.getStepTemplate(stepNumber);

    if (template && template.length > 0) {
      console.log(`✅ Template encontrado: ${template.length} blocos`);
      return template;
    }

    // FALLBACK GARANTIDO
    console.warn(`⚠️ Template vazio, usando fallback para step ${stepNumber}`);
    return [
      {
        type: 'heading-inline',
        properties: {
          content: `Etapa ${stepNumber}`,
          level: 'h2',
          textAlign: 'center',
        },
      },
      {
        type: 'text-inline',
        properties: {
          content: `Conteúdo da etapa ${stepNumber}`,
          textAlign: 'center',
        },
      },
    ];
  } catch (error) {
    console.error('❌ Erro crítico no getStepTemplate:', error);
    return [];
  }
}, []);
```

## 🔧 ARQUIVOS PARA MODIFICAR

### **1. `/src/components/editor/SchemaDrivenEditorResponsive.tsx`**

- Implementar correções acima
- Remover dependência obrigatória do Supabase
- Adicionar logs de debug para filtro de blocos

### **2. `/src/hooks/useHistory.ts`** - CRIAR

```typescript
import { useState } from 'react';

export const useHistory = <T>(initialState: T) => {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initialState);
  const [future, setFuture] = useState<T[]>([]);

  const set = (newPresent: T) => {
    setPast([...past, present]);
    setPresent(newPresent);
    setFuture([]);
  };

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast(past.slice(0, -1));
    setFuture([present, ...future]);
    setPresent(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setPast([...past, present]);
    setPresent(next);
    setFuture(future.slice(1));
  };

  return { past, present, future, set, undo, redo };
};
```

### **3. `/vite.config.ts`** - JÁ CORRIGIDO

- Chunking otimizado implementado
- Bundle size reduzido significativamente

## 🧪 TESTES PARA VALIDAR

### **Teste 1: Navegação de Etapas**

```javascript
// No console do browser:
// 1. Clicar em "Etapa 2"
// 2. Verificar se apenas blocos da Etapa 2 aparecem
// 3. Console deve mostrar: "🔍 Etapa: etapa-2, Blocos: X"
```

### **Teste 2: Template Loading**

```javascript
// No console do browser:
// 1. Clicar em "Popular Etapa"
// 2. Verificar se blocos aparecem
// 3. Console deve mostrar: "✅ Template encontrado: X blocos"
```

### **Teste 3: Modo Offline**

```javascript
// Desconectar internet e verificar se:
// 1. Editor carrega normalmente
// 2. Etapas funcionam
// 3. Templates carregam com fallback
```

## 📊 RESULTADO ESPERADO

### **✅ Após as Correções:**

1. **Navegação funcional** - Cada etapa mostra apenas seus blocos
2. **Templates carregam** - Sempre há conteúdo, mesmo com fallback
3. **Editor offline** - Funciona sem dependência do Supabase
4. **Bundle otimizado** - Chunks menores, carregamento mais rápido
5. **Imports corrigidos** - Sem erros de módulos não encontrados

### **📈 Métricas de Sucesso:**

- ✅ Navegação entre 21 etapas funcionando
- ✅ Filtro de blocos por stepId operacional
- ✅ Templates carregando em < 1 segundo
- ✅ Editor iniciando em modo offline
- ✅ Build sem warnings de chunk size

## 🎯 PRIORIZAÇÃO

1. **CRÍTICO**: Corrigir filtro de blocos (sortedBlocks)
2. **ALTO**: Implementar Local First loading
3. **MÉDIO**: Criar useHistory hook
4. **BAIXO**: Otimizações adicionais de performance

Esta é uma correção pontual e focada nos problemas principais identificados.
