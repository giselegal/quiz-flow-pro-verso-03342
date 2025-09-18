# 🎯 PLANO DE AÇÃO - CORRIGIR PAINEL DE PROPRIEDADES

## 🚨 PROBLEMA IDENTIFICADO
O painel de propriedades está "totalmente desconectado da fonte de verdade" quando o usuário clica em componentes.

## 📊 DIAGNÓSTICO ATUAL

### ✅ DEBUG LOGS IMPLEMENTADOS
- **SinglePropertiesPanel**: Logs detalhados do selectedBlock
- **useOptimizedUnifiedProperties**: Logs de processamento
- **ModularEditorPro**: Logs de selectedBlock calculation
- **EditorProvider**: Logs de updateBlock merge

### 🔍 FLUXO DE DADOS MAPEADO
```
1. [USUÁRIO] Clique no componente
     ↓
2. [ModularEditorPro] Detecta seleção → calcula selectedBlock
     ↓  
3. [EditorProvider] Gerencia estado → updateBlock
     ↓
4. [SinglePropertiesPanel] Recebe selectedBlock via props
     ↓
5. [useOptimizedUnifiedProperties] Processa propriedades
     ↓
6. [PropertyEditors] Renderizam campos
```

## 🎯 PLANO DE CORREÇÃO (6 FASES)

### **FASE 1: VERIFICAÇÃO DE LOGS** ⏱️ 5 minutos
**OBJETIVO**: Confirmar onde está a quebra no fluxo

**AÇÕES**:
1. Acessar http://localhost:3000/editor/new
2. Abrir Console (F12)
3. Clicar em diferentes componentes
4. Coletar logs de cada etapa do fluxo
5. Identificar onde `selectedBlock` se perde

**CRITÉRIO SUCESSO**: Logs mostrando exatamente onde o selectedBlock não é propagado

### **FASE 2: DIAGNÓSTICO DE SELECTEDBLOCK** ⏱️ 10 minutos
**OBJETIVO**: Verificar se o selectedBlock chega correto no painel

**POSSÍVEIS PROBLEMAS**:
- selectedBlock é `null` ou `undefined`
- selectedBlock tem estrutura incorreta
- selectedBlock não tem propriedades carregadas
- Timing issue: painel renderiza antes dos dados chegarem

**AÇÕES**:
1. Adicionar breakpoints no SinglePropertiesPanel
2. Verificar estrutura do selectedBlock recebido
3. Confirmar se props estão sendo passadas corretamente
4. Validar se o hook useOptimizedUnifiedProperties está funcionando

### **FASE 3: VERIFICAÇÃO DO HOOK** ⏱️ 10 minutos  
**OBJETIVO**: Confirmar se useOptimizedUnifiedProperties processa corretamente

**POSSÍVEIS PROBLEMAS**:
- Hook não hidrata propriedades corretamente
- Mapeamento de propriedades falha
- onUpdate não está conectado ao EditorProvider
- Cache ou memoização incorreta

**AÇÕES**:
1. Verificar se `currentBlock` é passado corretamente
2. Testar se `updateProperty` funciona
3. Validar `getPropertiesByCategory`
4. Confirmar conexão com `onUpdate` do painel

### **FASE 4: VALIDAÇÃO DE UPDATES** ⏱️ 15 minutos
**OBJETIVO**: Garantir que mudanças no painel sejam salvas

**POSSÍVEIS PROBLEMAS**:
- onUpdate não está conectado ao EditorProvider
- Format mismatch entre painel e editor
- Updates sendo perdidos por debouncing
- Estado local não sincronizado

**AÇÕES**:  
1. Testar alteração de propriedade simples (ex: texto)
2. Verificar se EditorProvider.updateBlock é chamado
3. Confirmar se mudança persiste no estado
4. Validar se UI reflete a mudança

### **FASE 5: CORREÇÃO ESPECÍFICA** ⏱️ 20 minutos
**OBJETIVO**: Implementar correção baseada no diagnóstico

**CORREÇÕES POSSÍVEIS**:

**A) Se selectedBlock não chega:**
```typescript
// Verificar passagem de props em ModularEditorPro
<SinglePropertiesPanel 
  selectedBlock={selectedBlock} // ← Garantir que não é null
  onUpdate={handleUpdate}
/>
```

**B) Se hook não processa:**
```typescript
// Verificar useOptimizedUnifiedProperties
const { updateProperty, getPropertiesByCategory } = useOptimizedUnifiedProperties({
  blockType: selectedBlock?.type || '',
  blockId: selectedBlock?.id,
  currentBlock: selectedBlock, // ← Garantir dados corretos
  onUpdate: onUpdate // ← Garantir conexão
});
```

**C) Se onUpdate não funciona:**
```typescript
// Verificar formato de dados em SinglePropertiesPanel
onUpdate: onUpdate ? (_blockId: string, updates: any) => {
  // Garantir formato correto
  onUpdate(updates.properties || updates);
} : undefined
```

**D) Se properties não carregam:**
```typescript
// Adicionar fallback de propriedades
const properties = selectedBlock?.properties || {};
```

### **FASE 6: VALIDAÇÃO E TESTE** ⏱️ 10 minutos
**OBJETIVO**: Confirmar que correção funciona

**TESTES**:
1. Clicar em diferentes tipos de blocos
2. Alterar propriedades (texto, cor, tamanho)  
3. Confirmar que mudanças são salvas
4. Verificar que painel não perde conexão
5. Testar em diferentes navegadores

**CRITÉRIO SUCESSO**: 
- ✅ Painel mostra propriedades do bloco selecionado
- ✅ Alterações são salvas em tempo real
- ✅ Não há desconexão ao trocar componentes
- ✅ Performance mantida

## 🔧 FERRAMENTAS DE DEBUG

### Console Commands para Teste:
```javascript
// Verificar estado atual do editor
window.__EDITOR_DEBUG__ = true;

// Verificar selectedBlock
console.log('Selected:', window.__SELECTED_BLOCK__);

// Verificar propriedades
console.log('Properties:', window.__BLOCK_PROPERTIES__);
```

### Breakpoints Estratégicos:
1. `SinglePropertiesPanel.tsx:448` - Recebimento do selectedBlock
2. `useOptimizedUnifiedProperties.ts:199` - Processamento do hook
3. `ModularEditorPro.tsx` - Cálculo do selectedBlock  
4. `EditorProvider.tsx` - updateBlock function

## 📈 MÉTRICAS DE SUCESSO

### Antes da Correção:
- ❌ Painel desconectado da fonte de verdade
- ❌ Propriedades não carregam ao selecionar
- ❌ Updates não persistem

### Após a Correção:
- ✅ Painel sincronizado com seleção
- ✅ Propriedades carregam instantaneamente  
- ✅ Updates salvos em tempo real
- ✅ Performance otimizada

## 🎯 PRÓXIMOS PASSOS

1. **EXECUTAR FASE 1**: Coletar logs do console
2. **ANALISAR DADOS**: Identificar ponto de falha
3. **APLICAR CORREÇÃO**: Baseada no diagnóstico
4. **VALIDAR FUNCIONALIDADE**: Testes completos
5. **DOCUMENTAR SOLUÇÃO**: Para futuras referências

---
**TEMPO ESTIMADO TOTAL**: 70 minutos
**PRIORIDADE**: CRÍTICA 🚨
**STATUS**: PRONTO PARA EXECUÇÃO 🚀