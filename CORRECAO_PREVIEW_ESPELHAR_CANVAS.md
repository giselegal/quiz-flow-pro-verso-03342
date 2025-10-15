# ✅ CORREÇÃO: Preview Espelha Canvas (Sincronização + Produção)

**Data:** 2025-10-15  
**Problema:** Preview deve espelhar edições do Canvas em tempo real  
**Solução:** Nova prop `previewMode` que sincroniza navegação MAS usa modo produção

---

## 🎯 PROBLEMA

Ao remover `editorMode`, o Preview parou de sincronizar com o Canvas:

```typescript
// ❌ Antes da correção anterior
<QuizAppConnected editorMode initialStepId={selectedStepId} />
// Sincronizava ✅ mas usava modo legacy ❌

// ❌ Depois da correção anterior  
<QuizAppConnected initialStepId={selectedStepId} />
// Modo produção ✅ mas não sincronizava ❌
```

**Resultado:** Canvas muda step → Preview fica travado na step antiga

---

## ✅ SOLUÇÃO: Prop `previewMode`

### **Nova Interface:**
```typescript
interface QuizAppConnectedProps {
    funnelId?: string;
    editorMode?: boolean;   // LEGACY - força rendererMode='legacy'
    previewMode?: boolean;  // 🆕 Sincroniza + usa 'auto' (produção)
    initialStepId?: string;
}
```

### **Lógica de RendererMode:**
```typescript
// QuizAppConnected.tsx linha ~118
setRendererMode(
    previewMode ? 'auto' :      // ✅ Preview: modo produção
    editorMode ? 'legacy' :     // Legacy: compatibilidade
    'auto'                      // Padrão: produção
);
```

### **Sincronização de Step:**
```typescript
// QuizAppConnected.tsx linha ~148
useEffect(() => {
    // 🎯 Sincroniza tanto em editorMode quanto em previewMode
    if ((!editorMode && !previewMode) || !initialStepId) return;
    
    const target = normalizeIncoming(initialStepId);
    if (state.currentStep !== target) {
        console.log(`🔄 Sincronizando Preview: ${state.currentStep} → ${target}`);
        nextStep(target);
    }
}, [editorMode, previewMode, initialStepId, state.currentStep, nextStep]);
```

### **Uso no Editor:**
```typescript
// QuizModularProductionEditor.tsx linha ~2687
<QuizAppConnected 
    funnelId={funnelId} 
    previewMode          // ✅ Sincroniza + produção!
    initialStepId={selectedStepId} 
/>
```

---

## 🔄 COMPARAÇÃO DE MODOS

| Prop | RendererMode | Sincroniza Step | Usa Produção | Use Case |
|------|--------------|-----------------|--------------|----------|
| `editorMode` | `'legacy'` | ✅ Sim | ❌ Não | Editor visual antigo |
| `previewMode` | `'auto'` | ✅ Sim | ✅ Sim | **Preview no editor (ideal!)** |
| (nenhum) | `'auto'` | ❌ Não | ✅ Sim | Quiz standalone |

---

## 🎯 BENEFÍCIOS DO `previewMode`

### **1. Sincronização Canvas → Preview**
```typescript
// Usuário clica em step-05 no Canvas
selectedStepId = 'step-05'
    ↓
<QuizAppConnected previewMode initialStepId="step-05" />
    ↓
useEffect detecta mudança
    ↓
nextStep('step-05')
    ↓
✅ Preview mostra step-05 imediatamente!
```

### **2. Dados do Registry (Canvas edits)**
```typescript
// Usuário edita texto no Canvas
Canvas onChange
    ↓
editorStepsToRuntimeMap
    ↓
QuizRuntimeRegistry.setSteps(runtimeMap)
    ↓
✅ Preview recebe dados atualizados via registry!
```

### **3. Comportamento de Produção**
```typescript
rendererMode = 'auto'
    ↓
✅ UnifiedStepRenderer
✅ Templates JSON normalizados
✅ Blocos dinâmicos (BlockRegistry)
✅ Auto-avanço independente (800ms)
✅ Validações completas
```

---

## 🧪 TESTES DE VALIDAÇÃO

### **Teste 1: Sincronização de Navegação**
```bash
1. No Canvas, clique em "step-02"
2. Observe console:
   🔄 Sincronizando Preview: step-01 → step-02
3. Verifique Preview muda para step-02
```

**✅ Esperado:** Preview segue Canvas instantaneamente

---

### **Teste 2: Edições de Conteúdo**
```bash
1. No Canvas, edite texto de questionText
2. Observe console:
   🔍 willUpdate: true
   ✅ Atualizando registry com 21 steps
   🔗 Registry detectado
3. Verifique Preview mostra novo texto
```

**✅ Esperado:** Preview atualiza conteúdo em tempo real

---

### **Teste 3: Modo Produção Ativo**
```bash
1. Recarregue página (Ctrl+R)
2. Observe console:
   🎯 QuizAppConnected RENDERIZADO { previewMode: true }
   ⚙️ setRendererMode('auto')
3. Verifique carrega templates:
   🔄 Carregando JSON template para step X...
   ✅ Template X carregado com sucesso
```

**✅ Esperado:** Preview usa sistema de produção completo

---

### **Teste 4: Auto-avanço Independente**
```bash
1. No Preview, vá para step-02
2. Selecione 3 opções
3. NÃO clique em "Continuar"
4. Aguarde ~800ms
5. Observe console:
   ✨ Auto-avanço: step-02 → step-03
```

**✅ Esperado:** Preview avança sozinho (não espera Canvas)

---

## 📊 FLUXO COMPLETO

```
┌─────────────────────────────────────────────────────────┐
│                   CANVAS EDITOR                         │
│  Usuário clica step-05 / edita texto                   │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
        ▼                            ▼
┌──────────────────┐    ┌────────────────────────┐
│ selectedStepId   │    │ editorStepsToRuntimeMap│
│ = 'step-05'      │    │ + QuizRuntimeRegistry  │
└────────┬─────────┘    └───────────┬────────────┘
         │                          │
         └──────────┬───────────────┘
                    ▼
        ┌───────────────────────────┐
        │  <QuizAppConnected        │
        │    previewMode            │
        │    initialStepId="05"  /> │
        └───────────┬───────────────┘
                    │
        ┌───────────┴────────────────┐
        │                            │
        ▼                            ▼
┌──────────────────┐    ┌────────────────────────┐
│ Sincroniza Step  │    │ Registry Provider      │
│ nextStep('05')   │    │ externalSteps={...}    │
└────────┬─────────┘    └───────────┬────────────┘
         │                          │
         └──────────┬───────────────┘
                    ▼
        ┌───────────────────────────┐
        │  PREVIEW RENDERIZADO      │
        │  ✅ Step correta          │
        │  ✅ Dados atualizados     │
        │  ✅ Modo produção         │
        └───────────────────────────┘
```

---

## 🔍 LOGS ESPERADOS

### **Ao Carregar:**
```
🎯 QuizAppConnected RENDERIZADO {
  funnelId: "quiz-estilo-21-steps",
  editorMode: false,
  previewMode: true,  ← ✅ Ativado!
  initialStepId: "step-01"
}
⚙️ setRendererMode('auto')  ← ✅ Produção!
🔗 Registry detectado com 21 steps
```

### **Ao Mudar Step no Canvas:**
```
🔄 Sincronizando Preview: step-01 → step-05  ← ✅ Segue Canvas!
✅ Atualizando Live preview registry com 21 steps
```

### **Ao Editar Texto no Canvas:**
```
🔍 willUpdate: true
✅ Atualizando Live preview registry com 21 steps
📦 Exemplo de step: { id: "step-02", questionText: "NOVO TEXTO" }
🔗 Registry detectado com 21 steps
```

---

## ⚠️ IMPORTANTE: Diferença para `editorMode`

| Comportamento | `editorMode` | `previewMode` |
|---------------|--------------|---------------|
| **Finalidade** | Editor visual legado | Preview no editor modular |
| **RendererMode** | `'legacy'` (componentes fixos) | `'auto'` (dinâmico) |
| **Templates JSON** | ❌ Ignorados | ✅ Carregados |
| **Blocos** | Hardcoded | ✅ BlockRegistry |
| **Normalização** | ❌ Desabilitada | ✅ Habilitada |
| **Sincroniza Step** | ✅ Sim | ✅ Sim |
| **Auto-avanço** | ⚠️ Pode conflitar | ✅ Independente |

**Conclusão:** Use `previewMode` no editor modular, `editorMode` é legacy!

---

## 📝 CHECKLIST DE VALIDAÇÃO

- [ ] Console mostra `previewMode: true`
- [ ] Console mostra `rendererMode='auto'`
- [ ] Canvas muda step → Preview acompanha
- [ ] Canvas edita texto → Preview atualiza conteúdo
- [ ] Carrega templates JSON normalizados
- [ ] Auto-avanço funciona após 800ms
- [ ] Blocos renderizam via BlockRegistry
- [ ] Sem erros no console

---

## 🚀 RESULTADO FINAL

```
╔════════════════════════════════════════════════════════════╗
║     ✅ PREVIEW ESPELHA CANVAS + USA MODO PRODUÇÃO!        ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  ✅ Sincroniza navegação (Canvas → Preview)               ║
║  ✅ Sincroniza conteúdo (Registry atualiza)               ║
║  ✅ Usa rendererMode='auto' (produção)                    ║
║  ✅ Templates JSON normalizados                           ║
║  ✅ Blocos dinâmicos (BlockRegistry)                      ║
║  ✅ Auto-avanço independente (800ms)                      ║
║  ✅ Validações completas                                  ║
║                                                            ║
║  🎯 PREVIEW = JANELA PARA PRODUÇÃO + ESPELHO DO CANVAS    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

**Resumo:** `previewMode` é o melhor dos dois mundos - sincroniza com o Canvas como `editorMode`, mas usa sistema de produção completo! 🎯✨
