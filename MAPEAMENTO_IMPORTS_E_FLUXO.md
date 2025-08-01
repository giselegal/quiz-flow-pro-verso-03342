# 🗺️ MAPEAMENTO COMPLETO: IMPORTS E FLUXO DE ETAPAS

## 📦 ANÁLISE DETALHADA DOS IMPORTS

### 🔧 **React Core & Hooks**
```typescript
import React, { useState, useCallback, useMemo, useEffect } from 'react';
```
- **React**: Biblioteca principal para criação de componentes
- **useState**: Gerencia estado local (etapa selecionada, blocos, modo preview)
- **useCallback**: Otimiza funções para evitar re-renderizações desnecessárias
- **useMemo**: Otimiza cálculos pesados (filtros de blocos, categorias)
- **useEffect**: Executa efeitos colaterais (carregar dados, listeners)

### 🎨 **UI Components (Shadcn/UI)**
```typescript
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
```
- **ResizablePanelGroup/Panel/Handle**: Cria layout dividido em painéis redimensionáveis
- **ScrollArea**: Área com scroll customizado para listas longas
- **Button**: Componente de botão padronizado

### 🎯 **Ícones (Lucide React)**
```typescript
import { Plus, Eye, EyeOff, Download, Upload, Trash2, Monitor, Tablet, Smartphone, PlayCircle, ExternalLink } from 'lucide-react';
```
- **Plus**: Adicionar blocos/etapas
- **Eye/EyeOff**: Alternar modo preview/edição
- **Download/Upload**: Carregar/salvar templates
- **Trash2**: Excluir blocos/etapas
- **Monitor/Tablet/Smartphone**: Seletores de modo de preview
- **PlayCircle**: Abrir demo
- **ExternalLink**: Links externos

### 🛠️ **Utilitários Core**
```typescript
import { cn } from '../../lib/utils';
```
- **cn**: Função para combinar classes CSS condicionalmente (clsx + tailwind-merge)

### 🎮 **Editor Core**
```typescript
import { useEditor } from '../../hooks/useEditor';
```
- **useEditor**: Hook principal que gerencia:
  - Estado dos blocos (config.blocks)
  - Funções CRUD: addBlock, updateBlock, deleteBlock
  - Persistência (saveConfig, setConfig)
  - Histórico de ações

### 🧱 **Sistema de Blocos**
```typescript
import { UniversalBlockRenderer } from './blocks/UniversalBlockRenderer';
import type { BlockData } from '../../types/blocks';
import { EditorBlock } from '../../types/editor';
import { normalizeBlock } from '../../utils/blockTypeMapping';
```
- **UniversalBlockRenderer**: Renderiza qualquer tipo de bloco dinamicamente
- **BlockData**: Interface para dados de bloco (id, type, properties)
- **EditorBlock**: Interface estendida com content, order, stepId
- **normalizeBlock**: Converte formatos de bloco para padronização

### 🎛️ **Painéis do Editor**
```typescript
import { DynamicPropertiesPanel } from './panels/DynamicPropertiesPanel';
import { EditorStatus } from './components/EditorStatus';
import { StepsPanel } from './StepsPanel';
import { ComponentsPanel } from './ComponentsPanel';
```
- **DynamicPropertiesPanel**: Painel de propriedades do bloco selecionado
- **EditorStatus**: Barra de status (blocos totais, etapa atual, histórico)
- **StepsPanel**: Lista e navegação das 21 etapas
- **ComponentsPanel**: Galeria de componentes disponíveis

### 🏗️ **Arquitetura de Steps**
```typescript
import { getStepById } from './steps';
```
- **getStepById**: Função para buscar dados específicos de uma etapa
- **⚠️ PROBLEMA**: Este import pode estar em conflito com stepTemplateService

### 🚀 **Serviços de Backend**
```typescript
import { schemaDrivenFunnelService } from '../../services/schemaDrivenFunnelService';
import { stepTemplateService } from '../../services/stepTemplateService';
```
- **schemaDrivenFunnelService**: Carrega funis salvos do backend/supabase
- **stepTemplateService**: Gerencia templates das 21 etapas do quiz

### 🍞 **UI Feedback**
```typescript
import { useToast } from '../../hooks/use-toast';
```
- **useToast**: Sistema de notificações toast (sucesso, erro, info)

---

## 🔄 FLUXO DETALHADO: SELEÇÃO DE ETAPAS

### 1️⃣ **Inicialização do Sistema**
```typescript
// 🚀 Ao carregar o componente:
useEffect(() => {
  const loadUnifiedData = async () => {
    if (!funnelId) {
      // Modo padrão: usar stepTemplateService para 21 etapas
      return;
    }
    
    // Modo funil: carregar funil específico
    const funnelData = await schemaDrivenFunnelService.loadFunnel(funnelId);
    // Mesclar dados do funil COM templates do stepTemplateService
  }
}, [funnelId]);
```

### 2️⃣ **Carregamento das Etapas**
```typescript
// 🎯 Fonte única de verdade: stepTemplateService
const getStepsFromService = useCallback(() => {
  const allSteps = stepTemplateService.getAllSteps();
  return allSteps.map(stepInfo => ({
    id: stepInfo.id,           // "etapa-1", "etapa-2"...
    name: stepInfo.name,       // "Introdução", "Q1: Tipo de Roupa"...
    order: stepInfo.order,     // 1, 2, 3...
    type: stepInfo.type,       // 'intro', 'question', 'strategic'...
    blocksCount: 0,            // Contador de blocos na etapa
    isActive: index === 0,     // Primeira etapa ativa por padrão
    description: stepInfo.description
  }));
}, []);
```

### 3️⃣ **Quando uma Etapa é Selecionada**
```typescript
const handleStepSelect = useCallback((stepId: string) => {
  console.log(`🎯 Selecionando etapa: ${stepId}`);
  
  // 1. Atualizar estado da etapa atual
  setSelectedStepId(stepId);
  setSelectedBlockId(null); // Limpar seleção de bloco
  
  // 2. Verificar se etapa está vazia
  const selectedStep = steps.find(step => step.id === stepId);
  if (selectedStep && selectedStep.blocksCount === 0) {
    console.log(`📝 Etapa ${stepId} está vazia, populando automaticamente...`);
    
    // 3. Popular etapa automaticamente
    setTimeout(() => {
      handlePopulateStep(stepId);
    }, 100);
  }
}, [steps]);
```

### 4️⃣ **População de Etapa com Template**
```typescript
const handlePopulateStep = useCallback((stepId: string) => {
  // 1. Extrair número da etapa (etapa-1 → 1)
  const stepNumber = parseInt(stepId.replace('etapa-', ''));
  
  // 2. Buscar template no stepTemplateService
  const stepTemplate = getStepTemplate(stepNumber.toString());
  
  // 3. Adicionar cada bloco do template
  stepTemplate.forEach((blockData, index) => {
    const newBlockId = addBlock(blockData.type);
    
    setTimeout(() => {
      // Aplicar propriedades
      updateBlock(newBlockId, blockData.properties);
      // 🆔 IMPORTANTE: Associar bloco à etapa
      updateBlock(newBlockId, { stepId: stepId });
    }, index * 100);
  });
  
  // 4. Atualizar contador de blocos
  setSteps(prevSteps => 
    prevSteps.map(step => 
      step.id === stepId 
        ? { ...step, blocksCount: stepTemplate.length }
        : step
    )
  );
}, []);
```

### 5️⃣ **Filtragem de Blocos por Etapa**
```typescript
// 🎯 CORREÇÃO: Filtrar blocos apenas da etapa atual
const sortedBlocks = useMemo(() => {
  const stepBlocks = blocks.filter(block => {
    // Se o bloco tem stepId, verificar se corresponde à etapa atual
    if (block.stepId) {
      return block.stepId === selectedStepId;
    }
    // Se não tem stepId, mostrar apenas quando não há outros blocos
    return !block.stepId;
  });
  
  return [...stepBlocks].sort((a, b) => (a.order || 0) - (b.order || 0));
}, [blocks, selectedStepId]);
```

---

## 🚨 PROBLEMAS IDENTIFICADOS

### ❌ **1. Conflito de Imports**
```typescript
import { getStepById } from './steps'; // ← Pode estar obsoleto
import { stepTemplateService } from '../../services/stepTemplateService'; // ← Novo sistema
```
**Solução**: Usar apenas stepTemplateService como fonte única

### ❌ **2. Blocos Não Associados à Etapa**
```typescript
// Problema: Blocos criados sem stepId
const newBlockId = addBlock(blockType);

// Solução: Sempre associar à etapa atual
updateBlock(newBlockId, { stepId: selectedStepId });
```

### ❌ **3. Templates Não Carregam**
```typescript
// Problema: getStepTemplate retorna array vazio
const stepTemplate = getStepTemplate(stepNumber.toString());

// Causa: stepTemplateService.getStepTemplate() pode estar falhando
// Solução: Adicionar fallback robusto
```

---

## 🔧 CORREÇÕES NECESSÁRIAS

### 1️⃣ **Remover Import Obsoleto**
```typescript
// ❌ Remover
import { getStepById } from './steps';

// ✅ Manter apenas
import { stepTemplateService } from '../../services/stepTemplateService';
```

### 2️⃣ **Garantir Associação de Blocos**
```typescript
const handleAddBlock = useCallback((blockType: string) => {
  const newBlockId = addBlock(blockType as any);
  
  // ✅ SEMPRE associar à etapa atual
  setTimeout(() => {
    updateBlock(newBlockId, { stepId: selectedStepId });
  }, 50);
}, [addBlock, selectedStepId, updateBlock]);
```

### 3️⃣ **Fallback Robusto para Templates**
```typescript
const getStepTemplate = (stepId: string) => {
  try {
    const template = stepTemplateService.getStepTemplate(stepNumber);
    
    if (template && template.length > 0) {
      return template;
    }
    
    // ✅ Fallback básico
    return [
      {
        type: 'heading-inline',
        properties: { content: `Etapa ${stepNumber}` }
      },
      {
        type: 'text-inline',
        properties: { content: 'Template em desenvolvimento' }
      }
    ];
  } catch (error) {
    console.error('❌ Erro ao obter template:', error);
    return [];
  }
};
```

---

## 📊 FLUXO VISUAL

```
🔄 USUÁRIO CLICA EM ETAPA
       ↓
🎯 handleStepSelect(stepId)
       ↓
📝 setSelectedStepId(stepId)
       ↓
🔍 Verifica se etapa tem blocos
       ↓
📦 Se vazia → handlePopulateStep()
       ↓
🧱 getStepTemplate(stepNumber)
       ↓
➕ addBlock() para cada template
       ↓
🔧 updateBlock() com propriedades
       ↓
🆔 updateBlock() com stepId
       ↓
🎨 sortedBlocks filtra por stepId
       ↓
✅ Blocos renderizados na tela
```

Este mapeamento mostra exatamente onde estão os problemas e como corrigi-los!
