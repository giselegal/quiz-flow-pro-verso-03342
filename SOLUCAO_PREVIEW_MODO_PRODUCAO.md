# 🎯 SOLUÇÃO: Preview com Dados de Produção

**Data:** 2025-01-15  
**Problema:** Preview usa `editorMode=true` → sistema legacy, não produção  
**Solução:** Remover `editorMode` do Preview para usar comportamento real

---

## ✅ MUDANÇA APLICADA

### **Antes (linha 2687):**
```typescript
<QuizAppConnected 
    funnelId={funnelId} 
    editorMode  // ❌ Forçava modo legacy
    initialStepId={selectedStepId} 
/>
```

### **Depois:**
```typescript
<QuizAppConnected 
    funnelId={funnelId} 
    // editorMode removido → usa modo produção!
    initialStepId={selectedStepId} 
/>
```

---

## 🔄 O QUE MUDA?

| Aspecto | ANTES (editorMode=true) | DEPOIS (editorMode=false) |
|---------|-------------------------|---------------------------|
| **RendererMode** | `'legacy'` (fixo) | `'auto'` (inteligente) |
| **Templates** | ❌ Ignorados | ✅ Carregados via JSON |
| **Blocos** | Hardcoded | Dinâmicos (BlockRegistry) |
| **Normalização** | ❌ Desabilitada | ✅ `loadNormalizedStep` |
| **Auto-avanço** | Sincroniza com Canvas | ✅ Independente (800ms) |
| **Validações** | Simplificadas | ✅ Produção completas |

---

## 🎯 BENEFÍCIOS

### **1. Preview = Produção**
```typescript
// QuizAppConnected.tsx linha 118
setRendererMode(editorMode ? 'legacy' : 'auto');
//                                      ^^^^ Agora usa 'auto'!
```

- ✅ Usa `UnifiedStepRenderer`
- ✅ Carrega templates normalizados
- ✅ Sistema de blocos completo

### **2. Auto-avanço Real**
```typescript
// Antes: Sincronizava com Canvas
if (!editorMode || !initialStepId) return;

// Depois: Funciona independente
if (completed) {
    setTimeout(() => nextStep(), 800);
}
```

### **3. Dados via Registry**
```typescript
// Registry atualiza via hash comparison (já corrigido)
const currentHash = JSON.stringify(runtimeMap);
if (currentHash !== lastUpdateRef.current) {
    setSteps(runtimeMap); // ✅ Preview atualiza!
}
```

---

## 🧪 TESTES NECESSÁRIOS

### **1. Verificar RendererMode**
```bash
# Console deve mostrar:
🎯 QuizAppConnected RENDERIZADO { editorMode: false }
⚙️ setRendererMode('auto')
```

### **2. Testar Sincronização Canvas → Preview**
1. Edite texto de pergunta no Canvas
2. Observe console:
   ```
   🔍 willUpdate: true
   ✅ Atualizando Live preview registry com 21 steps
   🔗 Registry detectado com 21 steps
   ```
3. **ESPERADO:** Preview atualiza imediatamente

### **3. Testar Auto-avanço Independente**
1. No Preview, vá para step-02
2. Selecione 3 opções
3. NÃO clique em "Continuar"
4. Observe console:
   ```
   🔍 Checking auto-advance: step-02
   📝 Pergunta com 3/3 seleções
   ⏰ Agendando auto-avanço...
   ✨ Auto-avanço: step-02 → step-03
   ```
5. **ESPERADO:** Avança sozinho após ~800ms

### **4. Testar Templates Normalizados**
```bash
# Console deve mostrar:
🔄 [useQuizState] Carregando JSON template para step 2...
✅ [useQuizState] Template 2 carregado com sucesso
✅ Normalized step loaded: { blocks: [...] }
```

---

## ⚠️ POSSÍVEIS EFEITOS COLATERAIS

### **1. Preview não segue Canvas passivamente**
**ANTES:**
- Canvas muda step → Preview muda junto

**DEPOIS:**
- Canvas muda step → Preview mantém navegação independente
- **SOLUÇÃO:** Registry já atualiza dados, só navegação é independente

### **2. initialStepId pode não funcionar igual**
```typescript
// QuizAppConnected.tsx linha 150
if (!editorMode || !initialStepId) return;
//   ^^^^^^^^^^^ Agora é false → não entra aqui
```

**IMPACTO:** Preview não sincroniza step com Canvas  
**SOLUÇÃO:** Adicionar prop `syncWithEditor` se necessário

---

## 🔧 IMPLEMENTAÇÃO ALTERNATIVA (SE NECESSÁRIO)

Se precisar manter sincronização com Canvas:

```typescript
interface QuizAppConnectedProps {
    editorMode?: boolean;
    previewMode?: boolean; // NOVO
    initialStepId?: string;
}

// QuizAppConnected.tsx
useEffect(() => {
    if (previewMode) {
        // Usa 'auto' mas sincroniza navegação
        setRendererMode('auto');
    } else if (editorMode) {
        setRendererMode('legacy');
    } else {
        setRendererMode('auto');
    }
}, [editorMode, previewMode]);

// Sincronizar step com Canvas só em preview
useEffect(() => {
    if (!previewMode || !initialStepId) return;
    nextStep(initialStepId);
}, [previewMode, initialStepId]);
```

---

## 📊 CHECKLIST DE VALIDAÇÃO

- [ ] Console mostra `rendererMode='auto'`
- [ ] Carrega templates via `loadNormalizedStep`
- [ ] Usa `UnifiedStepRenderer` (não IntroStep/QuestionStep)
- [ ] Auto-avanço funciona após 800ms
- [ ] Edições no Canvas aparecem no Preview
- [ ] Blocos renderizam corretamente
- [ ] Validações de produção ativas
- [ ] Sem erros no console

---

## 🚀 COMANDO PARA TESTAR

```bash
# 1. Recarregue a página
Ctrl + R

# 2. Abra console (F12)

# 3. No Canvas, edite texto de step-02

# 4. Observe logs:
# ✅ willUpdate: true
# ✅ Atualizando registry
# ✅ rendererMode='auto'

# 5. No Preview, teste auto-avanço
```

---

## 📝 RESULTADO ESPERADO

```
╔══════════════════════════════════════════════════════╗
║     PREVIEW AGORA USA DADOS DE PRODUÇÃO!            ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  ✅ RendererMode: 'auto'                            ║
║  ✅ Templates: Carregados de JSON                   ║
║  ✅ Blocos: Sistema unificado                       ║
║  ✅ Auto-avanço: Independente (800ms)               ║
║  ✅ Validações: Completas de produção               ║
║  ✅ Dados: Via registry (atualiza do Canvas)        ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

---

**Conclusão:** Preview agora é uma **janela real para produção**, não um modo especial! 🎯
