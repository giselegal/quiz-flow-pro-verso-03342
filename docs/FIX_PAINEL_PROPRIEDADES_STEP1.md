# 🔧 Fix: Painel de Propriedades Não Funciona no Step 1

## 📋 Problema Identificado

### Sintoma
O Painel de Propriedades mostra "Nenhum bloco disponível" repetidamente no Step 1, mas funciona em outros steps (Step 2, Step 9, etc.).

### Logs do Console
```
❌ [PropertiesColumn] Nenhum bloco disponível
🔍 [PropertiesColumn] Props recebidas: {
  hasSelectedBlockProp: false,
  selectedBlockId: undefined,
  blocksCount: 0,        // ← Problema aqui!
  blockIds: Array(0),    // ← Array vazio!
  ...
}
```

### Diagnóstico
1. **Step 9 funciona**: `selectedBlockProp: question-hero-09` ✅
2. **Step 2 funciona**: Auto-seleção bem-sucedida ✅
3. **Step 1 FALHA**: `blocksCount: 0`, `blockIds: []` ❌

### Causa Raiz
O problema está no **`SuperUnifiedProvider`**, especificamente no `useEffect` que carrega blocos automaticamente (linhas 770-835):

```tsx
// ❌ CÓDIGO COM PROBLEMA
if (Array.isArray(blocks) && blocks.length > 0) return;

const loadKey = `${funnelId || 'default'}:${stepId}`;

// Problema: Se blocks for [] (vazio), não recarrega!
if (loadedStepsRef.current.has(loadKey)) return;
loadedStepsRef.current.add(loadKey);
```

**O que acontece:**
1. Usuário carrega editor → Step 1 inicializa com `[]` (vazio)
2. Usuário navega para Step 9 → Blocos carregados corretamente
3. Usuário retorna para Step 1 → `blocks` é `[]`, `loadKey` já existe na ref
4. Código **NÃO recarrega** porque `loadKey` já foi processado
5. Painel fica vazio permanentemente

## 🔧 Soluções Aplicadas

### 1. Fix no SuperUnifiedProvider (Auto-reload quando vazio)

**Arquivo**: `/src/contexts/providers/SuperUnifiedProvider.tsx`

```tsx
// 🆕 FIX: Se blocks está vazio mas loadKey existe, remover loadKey e tentar novamente
if (Array.isArray(blocks) && blocks.length === 0 && loadedStepsRef.current.has(loadKey)) {
    logger.debug('[SuperUnified] Step com array vazio detectado, forçando reload', { stepId, idx });
    loadedStepsRef.current.delete(loadKey);
}

// ✅ FIX: Prevenir múltiplas tentativas de load do mesmo step (mas permite reload se vazio)
if (loadedStepsRef.current.has(loadKey)) return;
loadedStepsRef.current.add(loadKey);
```

**Lógica:**
- Se `blocks` é um array vazio `[]` **E** o `loadKey` já foi processado → Remove `loadKey` e força reload
- Permite recarregar steps que falharam ou ficaram vazios anteriormente

### 2. Logs de Debug Adicionados

#### SuperUnifiedProvider - Inicialização
```tsx
initialData.pages.forEach((page: any, index: number) => {
    const blocks = Array.isArray(page.blocks) ? page.blocks : [];
    stepBlocks[index + 1] = blocks;
    
    // 🔍 DEBUG: Log de cada step sendo inicializado
    logger.debug('[SuperUnified] 📦 Inicializando step', { 
        stepNumber: index + 1, 
        stepId: page.id,
        blocksCount: blocks.length,
        blockIds: blocks.map((b: any) => b.id)
    });
});
```

#### SuperUnifiedProvider - Auto-load
```tsx
logger.debug('[SuperUnified] 🔄 Iniciando carregamento de step', { stepId, idx, funnelId });

const result = await hierarchicalTemplateSource.getPrimary(stepId, funnelId || undefined);
logger.debug('[SuperUnified] ✅ Resultado de getPrimary', { 
    stepId, 
    hasData: !!result?.data, 
    isArray: Array.isArray(result?.data),
    blocksCount: result?.data?.length || 0
});

if (result?.data && Array.isArray(result.data)) {
    dispatch({ type: 'SET_STEP_BLOCKS', payload: { stepIndex: idx, blocks: result.data } });
    logger.debug('[SuperUnified] ✅ Blocos carregados com sucesso', { stepId, blocksCount: result.data.length });
    return;
}
```

#### QuizModularEditor - getStepBlocks
```tsx
useEffect(() => {
    console.group('🎯 [QuizModularEditor] getStepBlocks chamado');
    console.log('safeCurrentStep:', safeCurrentStep);
    console.log('blocks retornado:', blocks);
    console.log('Análise:', {
        isNull: blocks === null,
        isArray: Array.isArray(blocks),
        blocksCount: blocks?.length || 0,
        blockIds: blocks?.map(b => b.id) || []
    });
    console.groupEnd();
}, [safeCurrentStep, blocks]);
```

## 🧪 Como Testar

### Passos para Reproduzir o Problema (Antes do Fix)
1. Abrir editor: `http://localhost:8080/editor?resource=quiz21StepsComplete&step=1`
2. Verificar: Painel mostra "Nenhum bloco disponível"
3. Navegar para Step 9: Painel funciona
4. Retornar para Step 1: Painel continua vazio (problema!)

### Validação do Fix (Depois)
1. Abrir editor: `http://localhost:8080/editor?resource=quiz21StepsComplete&step=1`
2. Verificar console:
   ```
   🎯 [QuizModularEditor] getStepBlocks chamado
   safeCurrentStep: 1
   blocks retornado: [...]  // ← Deve ter blocos!
   blocksCount: 3
   ```
3. Navegar entre steps: Painel deve funcionar em todos
4. Retornar para Step 1: Painel deve mostrar blocos

### Logs Esperados (Sucesso)
```
[SuperUnified] 📦 Inicializando step { stepNumber: 1, blocksCount: 3 }
🎯 [QuizModularEditor] getStepBlocks chamado { blocksCount: 3 }
✅ [PropertiesColumn] Usando selectedBlockProp: quiz-intro-header
```

### Logs de Falha (Se problema persistir)
```
[SuperUnified] ⚠️ Step com array vazio detectado, forçando reload
[SuperUnified] 🔄 Iniciando carregamento de step { stepId: 'step-01' }
[SuperUnified] ⚠️ getPrimary retornou sem dados
```

## 📊 Cenários de Falha Conhecidos

### Cenário 1: initialData.pages[0].blocks está vazio
**Causa**: Template quiz21StepsComplete não tem blocos no step 1  
**Solução**: Verificar arquivo de template e adicionar blocos padrão

### Cenário 2: hierarchicalTemplateSource.getPrimary falha
**Causa**: Erro de rede, Supabase offline, ou dados corrompidos  
**Solução**: Verificar logs de `getPrimary`, implementar fallback local

### Cenário 3: Race condition no carregamento
**Causa**: Step muda antes de blocos serem carregados  
**Solução**: Implementar loading state no PropertiesColumn

## 🔄 Próximos Passos

### Se Fix Funcionar
- [ ] Remover logs de debug (ou manter se úteis)
- [ ] Adicionar testes unitários para `getStepBlocks`
- [ ] Documentar comportamento esperado

### Se Fix NÃO Funcionar
- [ ] Verificar se `initialData.pages[0]` tem blocos
- [ ] Verificar se `hierarchicalTemplateSource.getPrimary` retorna dados
- [ ] Adicionar fallback: carregar blocos do template padrão
- [ ] Implementar loading indicator no painel

## 📝 Arquivos Modificados

1. **SuperUnifiedProvider.tsx** (linhas 770-835)
   - Fix: Permitir reload quando `blocks === []`
   - Logs: Inicialização e auto-load

2. **QuizModularEditor/index.tsx** (linha 638)
   - Logs: Debug do retorno de `getStepBlocks`

3. **PropertiesColumn/index.tsx** (linha 48)
   - Logs: Props recebidas (já existentes)

## 🎯 Resultado Esperado

Após aplicar este fix:
- ✅ Step 1 deve mostrar blocos no painel
- ✅ Navegação entre steps deve funcionar perfeitamente
- ✅ Auto-seleção deve ocorrer quando necessário
- ✅ Nenhum loop infinito de renderização
- ✅ Performance mantida (sem reloads desnecessários)

---

**Status**: 🔄 Fix aplicado, aguardando validação do usuário  
**Data**: 2025-11-19  
**Autor**: GitHub Copilot
