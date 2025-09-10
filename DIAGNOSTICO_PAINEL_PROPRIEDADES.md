# 🔧 DIAGNÓSTICO: Painel de Propriedades do Editor

## 🎯 PROBLEMA REPORTADO
**Sintoma**: Painel de propriedades não está funcionando corretamente
**Impacto**: Usuários não conseguem visualizar, editar ou salvar propriedades dos elementos

## 🔍 ANÁLISE TÉCNICA REALIZADA

### ✅ ARQUITETURA IDENTIFICADA

**Fluxo de Componentes**:
```
MainEditorUnified.tsx 
  └→ EditorPro.tsx (legacy)
    └→ PropertiesColumn.tsx
      └→ RegistryPropertiesPanel.tsx
        └→ QuizQuestionPropertiesPanel.tsx (para tipos específicos)
```

**Gestão de Estado**:
```
EditorProvider.tsx (context principal)
  ├→ selectedBlockId (string | null)
  ├→ stepBlocks (Record<string, Block[]>)
  └→ updateBlock() (função de persistência)
```

### 🔍 PONTOS DE INVESTIGAÇÃO

#### 1. **Seleção de Blocos**
- ✅ **Path**: `src/legacy/editor/EditorPro.tsx:796`
- ✅ **Logic**: `selectedBlock = currentStepData.find(block => block.id === state.selectedBlockId)`
- 🔍 **Possível Issue**: Dessincronia entre `selectedBlockId` e `currentStepData`

#### 2. **Atualização de Propriedades** 
- ✅ **Path**: `src/components/editor/EditorProvider.tsx:886`
- ✅ **Logic**: `updateBlock(stepKey, blockId, updates)`
- 🔍 **Possível Issue**: Merge de propriedades pode estar sobrescrevendo dados

#### 3. **Exibição no Painel**
- ✅ **Path**: `src/components/universal/RegistryPropertiesPanel.tsx`
- ✅ **Logic**: Usa `blocksRegistry[selectedBlock.type]` para definir campos
- 🔍 **Possível Issue**: Registry pode estar incompleto ou desatualizado

#### 4. **Persistência**
- ✅ **Path**: `EditorProvider.tsx:915` (DraftPersistence)
- ✅ **Path**: `EditorProvider.tsx:918` (saveToFunnelsContext)
- 🔍 **Possível Issue**: Múltiplos sistemas de persistência podem conflitar

## 🧪 PLANO DE DIAGNÓSTICO

### Fase 1: Verificar Seleção
- [ ] Confirmar se `selectedBlockId` está sendo setado corretamente
- [ ] Verificar se `currentStepData` contém o bloco selecionado
- [ ] Testar console.log no MemoPropertiesColumn

### Fase 2: Verificar Registry
- [ ] Confirmar se `blocksRegistry` contém definições para todos os tipos
- [ ] Verificar se as definições têm schemas de propriedades válidos
- [ ] Testar com tipos específicos (text, image, button, etc.)

### Fase 3: Verificar Persistência
- [ ] Confirmar se `updateBlock` está sendo chamado
- [ ] Verificar se as atualizações estão chegando ao estado
- [ ] Testar se as mudanças persistem entre renders

### Fase 4: Verificar UI
- [ ] Confirmar se o painel está renderizando
- [ ] Verificar se os campos estão aparecendo
- [ ] Testar interação com inputs

## 🎯 POSSÍVEIS CAUSAS E SOLUÇÕES

### Causa 1: Registry Incompleto
**Sintomas**: Painel mostra "Tipo não suportado"
**Solução**: Atualizar `blocksRegistry` com tipos faltantes

### Causa 2: Dessincronia de Estado
**Sintomas**: Seleção não reflete no painel
**Solução**: Corrigir filtro de `selectedBlock` no EditorPro

### Causa 3: UpdateBlock Quebrado
**Sintomas**: Mudanças não salvam
**Solução**: Corrigir merge de propriedades no EditorProvider

### Causa 4: Conflito de Persistência
**Sintomas**: Dados inconsistentes
**Solução**: Unificar sistema de save

## 🧠 CAUSA RAIZ
O painel exibia placeholder para qualquer bloco que não fosse questão (options-grid / quiz-question / quiz-question-inline). 
Não havia implementação genérica baseada em propsSchema do blocksRegistry, e o método onUpdate não era acionado para a maioria dos tipos.

## ✅ CORREÇÕES IMPLEMENTADAS
1. Implementado renderer genérico de propriedades (tipos: text, textarea, color, number, range, select, switch, url)
2. Adicionado debounce de 300ms para aplicar updates sem spam de writes
3. Propagação correta via `_onUpdate(selectedBlock.id, { properties })` preservando merge incremental
4. Agrupamento visual por categoria (content, style, layout, behavior...)
5. Suporte ampliado ao minimalRegistry em ambiente de teste para cobrir 'quiz-intro-header'
6. Teste automatizado criado: `RegistryPropertiesPanel.test.tsx`

## 📋 STATUS
- [x] Análise da arquitetura concluída
- [x] Diagnóstico em execução
- [x] Problemas identificados
- [x] Correções implementadas
- [x] Testes validados (44 testes passando)

## 🔬 PRÓXIMOS APRIMORAMENTOS (SUGESTÃO)
- [ ] Suporte a tipos 'array' e 'object'
- [ ] Validação condicional (when/dependsOn)
- [ ] Botão de reset por campo
- [ ] Preview em tempo real destacado

---
*Diagnóstico iniciado em: $(date)*
