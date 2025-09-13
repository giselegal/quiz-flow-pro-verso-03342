# 🔗 PLANO DE INTEGRAÇÃO - QuestionPropertyEditor

## 📋 **Status Atual**

- ✅ **QuestionPropertyEditor**: Implementado e funcional
- ✅ **PropertiesPanel**: Implementado e funcional  
- ❌ **Integração**: Não existe conexão entre os sistemas

## 🎯 **Objetivo da Integração**

Fazer o QuestionPropertyEditor aparecer automaticamente no painel quando blocos de questão (`quiz-question`, `options-grid`) forem selecionados.

## 🚀 **Plano de Implementação**

### **OPÇÃO 1: Integração Direta no PropertiesPanel**

```tsx
// src/components/editor/properties/PropertiesPanel.tsx

import QuestionPropertyEditor from './editors/QuestionPropertyEditor';

const EnhancedPropertiesPanel = ({ selectedBlock, onUpdate, ... }) => {
  // Verificar se é um bloco de questão
  if (selectedBlock?.type === 'quiz-question' || 
      selectedBlock?.type === 'options-grid' ||
      selectedBlock?.type === 'form-input') {
    
    return (
      <QuestionPropertyEditor 
        block={selectedBlock}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    );
  }

  // Continuar com painel genérico para outros blocos
  return (
    <TooltipProvider>
      {/* Painel genérico atual */}
    </TooltipProvider>
  );
};
```

### **OPÇÃO 2: Registro no Sistema de Editores**

```tsx
// src/components/editor/properties/core/propertyEditors.tsx

import QuestionPropertyEditor from '../editors/QuestionPropertyEditor';

// Adicionar ao pickPropertyEditor:
export const pickPropertyEditor = (property: any, blockType?: string) => {
  // Editores por tipo de bloco
  if (blockType === 'quiz-question' || blockType === 'options-grid') {
    return QuestionPropertyEditor;
  }
  
  // Continuar com lógica atual...
};
```

### **OPÇÃO 3: Adaptador de Interface**

```tsx
// src/components/editor/properties/adapters/QuestionEditorAdapter.tsx

const QuestionEditorAdapter = ({ selectedBlock, onUpdate }) => {
  return (
    <QuestionPropertyEditor
      block={selectedBlock}
      onUpdate={(updates) => onUpdate(updates)}
    />
  );
};
```

## 🔧 **Implementação Recomendada: OPÇÃO 1**

**Vantagens:**
- ✅ Mais simples e direto
- ✅ Não quebra sistema existente
- ✅ Performance melhor (sem overhead)
- ✅ Manutenção mais fácil

**Modificações Necessárias:**

1. **Importar QuestionPropertyEditor no PropertiesPanel**
2. **Adicionar verificação de tipo de bloco**  
3. **Renderizar condicionalmente o editor**
4. **Manter painel genérico como fallback**

## 📦 **Arquivos a Modificar**

1. **PropertiesPanel.tsx** - Adicionar roteamento
2. **QuestionPropertyEditor.tsx** - Ajustar interface se necessário
3. **Types/interfaces** - Garantir compatibilidade

## ⚡ **Resultado Esperado**

Após a integração:

```
Usuário seleciona bloco quiz-question → QuestionPropertyEditor aparece
Usuário seleciona bloco header → Painel genérico aparece
Usuário seleciona bloco options-grid → QuestionPropertyEditor aparece
```

## 🎯 **Próximos Passos**

1. ✅ Implementar OPÇÃO 1 no PropertiesPanel
2. ✅ Testar com blocos de questão
3. ✅ Verificar compatibilidade de interfaces
4. ✅ Documentar comportamento
5. ✅ Deploy e validação
