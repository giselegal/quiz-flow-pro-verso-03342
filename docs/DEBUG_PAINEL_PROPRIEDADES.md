# 🔍 INVESTIGAÇÃO: Painel de Propriedades Não Funciona

**Data:** 19/11/2025  
**Status:** 🔍 EM INVESTIGAÇÃO  
**Componente:** PropertiesColumn  

---

## 📊 Testes Automatizados - ✅ TODOS PASSANDO

```bash
✓ src/__tests__/providers/properties-panel-diagnosis.test.tsx (5 tests) 34ms
  ✓ ✅ DEVE ter estado showPropertiesPanel 19ms
  ✓ ✅ DEVE ter selectedBlockId no estado do editor 4ms
  ✓ ✅ DEVE permitir selecionar um bloco 4ms
  ✓ ⚠️ DEVE identificar se setSelectedBlock está disponível no contexto 3ms
  ✓ ❌ DEVE detectar se o PropertiesColumn está recebendo selectedBlock 3ms
```

**Conclusão:** A lógica de estado está funcionando perfeitamente. O problema está na camada de UI/renderização.

---

## 🔍 Análise do Código

### 1. QuizModularEditor (Linha 1641)

```tsx
<PropertiesColumnWithJson
    selectedBlock={
        blocks?.find(b => b.id === selectedBlockId) ||
        undefined  // ⚠️ POSSÍVEL PROBLEMA: retorna undefined se não encontrar
    }
    blocks={blocks}
    onBlockSelect={handleBlockSelect}
    onBlockUpdate={(id, updates) => {
        updateBlock(safeCurrentStep, id, updates);
    }}
    onClearSelection={() => setSelectedBlock(null)}
    fullTemplate={{
        step: currentStepKey,
        blocks: blocks || []
    }}
    // ...
/>
```

**Possíveis Problemas:**
- ❓ `selectedBlockId` pode estar `null` (nenhum bloco selecionado)
- ❓ `blocks` array pode estar vazio
- ❓ `blocks.find()` não encontra o bloco com o ID correspondente

---

### 2. PropertiesColumn Auto-Select (Linhas 48-65)

```tsx
const selectedBlock = React.useMemo(() => {
    if (selectedBlockProp) return selectedBlockProp;

    // Fallback: auto-selecionar primeiro bloco
    const firstBlock = blocks && blocks.length > 0 ? blocks[0] : null;
    if (firstBlock && onBlockSelect && !prevSelectedIdRef.current) {
        appLogger.info(`[WAVE1] Auto-selecionando primeiro bloco: ${firstBlock.id}`);
        setTimeout(() => onBlockSelect(firstBlock.id), 0);
    }

    return firstBlock;  // ⚠️ Retorna null se não há blocos
}, [selectedBlockProp, blocks, onBlockSelect]);
```

**Comportamento Esperado:**
1. Se `selectedBlockProp` existe → usa ele
2. Se não existe mas há blocos → auto-seleciona primeiro
3. Se não há blocos → mostra mensagem "Nenhum bloco disponível"

---

### 3. Renderização Condicional (Linha 190)

```tsx
if (!selectedBlock) {
    return (
        <div className="w-80 border-l bg-gradient-to-b from-muted/20 to-background">
            <div className="p-4 border-b bg-background/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-sm">Propriedades</h3>
                </div>
            </div>
            <div className="p-8 text-center text-muted-foreground animate-fade-in">
                <p className="text-sm font-medium mb-2">
                    Nenhum bloco disponível
                </p>
            </div>
        </div>
    );
}
```

**Se chegar aqui:** Significa que `selectedBlock` é `null` ou `undefined`.

---

## 🎯 Hipóteses de Falha (Ordem de Probabilidade)

### 1. ⚠️ **ALTA PROBABILIDADE: Blocos não carregados no step**

**Sintomas:**
- Painel mostra "Nenhum bloco disponível"
- `blocks` array está vazio
- Auto-select não é executado porque não há blocos

**Causa Raiz:**
- Step atual não tem blocos carregados no estado
- `getStepBlocks(currentStep)` retorna array vazio
- Problema no carregamento lazy dos blocos

**Como Verificar:**
```javascript
// No console do browser:
const state = window.__SUPER_UNIFIED_STATE__;
console.log('Blocos do step 1:', state?.editor?.stepBlocks?.[1]);
```

---

### 2. 🟡 **MÉDIA PROBABILIDADE: selectedBlockId desincronizado**

**Sintomas:**
- `selectedBlockId` tem valor mas não corresponde a nenhum bloco
- `blocks.find(b => b.id === selectedBlockId)` retorna `undefined`

**Causa Raiz:**
- Bloco foi deletado mas `selectedBlockId` não foi limpo
- IDs incompatíveis entre diferentes fontes de dados
- Race condition entre carregar blocos e selecionar

**Como Verificar:**
```javascript
// No console do browser:
const state = window.__SUPER_UNIFIED_STATE__;
const currentStep = state?.editor?.currentStep || 1;
const blocks = state?.editor?.stepBlocks?.[currentStep];
const selectedId = state?.editor?.selectedBlockId;
console.log('selectedId:', selectedId);
console.log('Bloco encontrado:', blocks?.find(b => b.id === selectedId));
```

---

### 3. 🟢 **BAIXA PROBABILIDADE: CSS/Layout oculto**

**Sintomas:**
- Painel renderizado mas não visível na tela
- `display: none` ou `opacity: 0` aplicado
- Painel fora da viewport

**Como Verificar:**
```javascript
const panel = document.querySelector('[data-testid="column-properties"]');
console.log('Painel encontrado:', panel !== null);
console.log('Visível:', panel?.offsetParent !== null);
console.log('Dimensões:', panel?.getBoundingClientRect());
```

---

## 🔧 Debug Adicionado ao Código

### Logs Automáticos no PropertiesColumn

```tsx
// 🔍 DEBUG: Log props recebidas
React.useEffect(() => {
    console.log('🔍 [PropertiesColumn] Props recebidas:', {
        hasSelectedBlockProp: !!selectedBlockProp,
        selectedBlockId: selectedBlockProp?.id,
        selectedBlockType: selectedBlockProp?.type,
        blocksCount: blocks?.length || 0,
        blockIds: blocks?.map(b => b.id) || [],
        hasOnBlockSelect: !!onBlockSelect
    });
}, [selectedBlockProp, blocks, onBlockSelect]);
```

**Como Usar:**
1. Recarregue o editor: `http://localhost:8080/editor?resource=quiz21StepsComplete&step=1`
2. Abra o Console (F12)
3. Observe os logs automáticos `🔍 [PropertiesColumn]`
4. Verifique os valores das props

---

## 🚀 Próximos Passos

### 1. **IMEDIATO: Coletar Logs**

Execute no Console do Browser:

```javascript
console.log('=== DIAGNÓSTICO PAINEL PROPRIEDADES ===');
const state = window.__SUPER_UNIFIED_STATE__;
console.log('📊 Estado Global:', state);
console.log('🎯 selectedBlockId:', state?.editor?.selectedBlockId);
console.log('📝 currentStep:', state?.editor?.currentStep);
console.log('📦 stepBlocks:', state?.editor?.stepBlocks);
const currentStep = state?.editor?.currentStep || 1;
const blocks = state?.editor?.stepBlocks?.[currentStep];
console.log(`📋 Blocos do Step ${currentStep}:`, blocks);
console.log('=== FIM DO DIAGNÓSTICO ===');
```

### 2. **Enviar Saída do Console**

Copie a saída completa do console e envie para análise.

### 3. **Verificar Visualmente**

- [ ] O painel está visível na tela?
- [ ] Aparece mensagem "Nenhum bloco disponível"?
- [ ] Aparece mensagem "Nenhum bloco selecionado"?
- [ ] Há blocos no canvas?
- [ ] Clicar em um bloco no canvas atualiza o painel?

---

## 📄 Ferramentas de Debug Criadas

1. **Teste Automatizado:**
   - `src/__tests__/providers/properties-panel-diagnosis.test.tsx`
   - Status: ✅ Todos passando

2. **Página HTML de Diagnóstico:**
   - `public/diagnostico-painel-propriedades.html`
   - Acesso: `http://localhost:8080/diagnostico-painel-propriedades.html`

3. **Logs no Código:**
   - `PropertiesColumn/index.tsx` - console.log adicionados

---

## ✅ Correções Aplicadas

- ✅ Loop infinito corrigido no SuperUnifiedProvider
- ✅ Testes automatizados criados e passando
- ✅ Logs de debug adicionados ao PropertiesColumn
- ✅ Página HTML de diagnóstico criada

---

## ⏳ Aguardando

**Necessário:** Executar o editor e coletar logs do console para identificar qual das 3 hipóteses é a causa real do problema.
