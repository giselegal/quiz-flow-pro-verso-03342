# Análise WYSIWYG: Boas Práticas vs. Implementação Atual

**Data**: 27 de novembro de 2025  
**Pergunta**: "O WYSIWYG segue boas práticas? Quero edição com reflexo instantâneo + visual idêntico à publicação"

---

## ❌ Problemas Críticos Identificados

### 1. **Nomenclatura Invertida** (20+ ocorrências)

```typescript
// ❌ ATUAL (ERRADO)
previewMode === 'live'        // ← Nome sugere "ao vivo" mas bloqueia edição
previewMode === 'production'  // ← Nome sugere "publicado" mas é modo de edição

// Consequências:
- Linha 432: Auto-save DESLIGADO em 'live' (deveria ser ligado)
- Linha 375: Snapshot DESLIGADO em 'live' (deveria ser ligado)
- Linha 908: WYSIWYG bloqueado em 'live' (deveria ser ativo)
```

**Impacto**: Lógica de negócio **completamente invertida** em todo o código.

---

### 2. **Impossibilidade Técnica: Dois Modos Simultâneos**

#### Arquitetura Atual (Tentando fazer o impossível)
```
┌─────────────────────────────────────────────┐
│  previewMode: 'live' | 'production'         │
│  ├─ 'live': Tenta ser edição + preview      │ ❌
│  └─ 'production': Tenta ser preview real    │ ❌
└─────────────────────────────────────────────┘
```

**Por que é impossível?**

1. **Fontes de dados conflitantes**:
   ```typescript
   // Modo 'live'
   wysiwyg.state.blocks          // Buffer local não salvo
   
   // Modo 'production'  
   unifiedState.editor.stepBlocks // Dados persistidos
   ```

2. **Você não pode editar E visualizar publicado AO MESMO TEMPO**:
   - Edição requer **buffer local** (mudanças não salvas)
   - Preview requer **dados publicados** (Supabase/cache)
   - São **estados mutuamente exclusivos**

---

### 3. **WYSIWYG Não É Verdadeiro WYSIWYG**

#### Definição de WYSIWYG (What You See Is What You Get)
✅ **Edição instantânea** onde o visual durante edição é **idêntico** ao resultado final

#### Implementação Atual
```typescript
// Linha 2155-2183: Canvas muda fonte dependendo do modo
blocks={(() => {
    const blocksToRender = previewMode === 'live'
        ? (virtualization.isVirtualized ? virtualization.visibleBlocks : wysiwyg.state.blocks)
        : blocks; // ← DIFERENTES fontes = DIFERENTES visuais
```

**Problema**: 
- Em `'live'`: Renderiza `wysiwyg.state.blocks` (local)
- Em `'production'`: Renderiza `blocks` (persistido)
- **Resultado**: Visual muda entre modos ❌

---

## ✅ Como Deveria Ser (Boas Práticas Reais)

### Arquitetura Correta: Dual-Mode True WYSIWYG

```
┌──────────────────────────────────────────────────┐
│ MODO 1: Edição WYSIWYG (Edit Mode)              │
├──────────────────────────────────────────────────┤
│ • Fonte: wysiwyg.state.blocks (buffer local)    │
│ • Reflexo: INSTANTÂNEO (onChange)                │
│ • Visual: Componentes reais de produção         │
│ • Auto-save: Ativado (debounce 2s)              │
│ • Seleção: Ativada                               │
│ • Properties Panel: Visível e editável          │
│ • Snapshot: Ativado (recuperação de drafts)     │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ MODO 2: Preview de Publicação (Preview Mode)    │
├──────────────────────────────────────────────────┤
│ • Fonte: Dados publicados (Supabase/cache)      │
│ • Reflexo: N/A (read-only)                       │
│ • Visual: EXATAMENTE como usuário final vê       │
│ • Auto-save: Desabilitado                        │
│ • Seleção: Desabilitada                          │
│ • Properties Panel: Escondido                    │
│ • Snapshot: Desabilitado                         │
└──────────────────────────────────────────────────┘
```

---

## 🎯 Resposta à Pergunta Original

### "Quero edição com reflexo instantâneo + visual idêntico à publicação. Isso é possível?"

✅ **SIM, é possível!** Mas requer implementação correta:

#### 1. **Reflexo Instantâneo** ✅
```typescript
// WYSIWYG em modo edição
const handleBlockUpdate = (id: string, updates: Partial<Block>) => {
  // ✅ Atualização instantânea no buffer local
  wysiwyg.actions.updateBlock(id, updates);
  
  // ⏱️ Auto-save com debounce (não bloqueia UI)
  debouncedSave(wysiwyg.state.blocks);
};
```

**Resultado**: Mudanças aparecem **IMEDIATAMENTE** no canvas.

#### 2. **Visual Idêntico à Publicação** ✅
```typescript
// Canvas renderiza SEMPRE com os mesmos componentes
<CanvasColumn
  blocks={modeState.isEditing ? wysiwyg.state.blocks : publishedBlocks}
  isEditable={modeState.isEditing}
  // ✅ Mesmos componentes BlockHeader, BlockImage, etc.
  // ✅ Mesmos estilos CSS
  // ✅ Mesmas regras de validação
/>
```

**Chave**: Usar **mesmos componentes React** em ambos os modos, apenas com props diferentes.

---

## 🔧 Correções Necessárias

### Fase 1: Renomear e Simplificar Estados

```typescript
// ❌ REMOVER
const [previewMode, setPreviewMode] = useState<'live' | 'production'>('live');

// ✅ ADICIONAR
const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
```

**Impacto**: 20+ linhas precisam ser atualizadas.

---

### Fase 2: Unificar Fonte de Blocos no Canvas

```typescript
// ❌ ANTES: Fonte muda dependendo do modo
const blocksToRender = previewMode === 'live'
    ? wysiwyg.state.blocks
    : blocks;

// ✅ DEPOIS: Fonte determinada por modo claro
const blocksToRender = editorMode === 'edit'
    ? wysiwyg.state.blocks     // Buffer local (editável)
    : publishedBlocks;          // Dados publicados (read-only)
```

---

### Fase 3: Corrigir Auto-Save

```typescript
// ❌ ANTES: Auto-save desligado em 'live'
const autoSave = enableAutoSave && resourceId && previewMode !== 'live' ? useAutoSave({...}) : {...};

// ✅ DEPOIS: Auto-save ligado em 'edit'
const autoSave = enableAutoSave && resourceId && editorMode === 'edit' ? useAutoSave({...}) : {...};
```

---

### Fase 4: Garantir Visual Idêntico

```typescript
// ✅ Componentes compartilhados entre modos
const BlockRenderer = ({ block, isEditable }: BlockRendererProps) => {
  return (
    <div className={cn(
      'block-wrapper',
      isEditable && 'hover:ring-2 hover:ring-blue-500'
    )}>
      {/* ✅ Mesmo componente em edit e preview */}
      <BlockContent block={block} />
      
      {/* ✅ Controles apenas em modo edit */}
      {isEditable && <BlockControls blockId={block.id} />}
    </div>
  );
};
```

---

## 📊 Comparação: Antes vs. Depois

| Aspecto | ❌ Atual | ✅ Correto |
|---------|----------|-----------|
| **Nomenclatura** | `'live'` / `'production'` (confuso) | `'edit'` / `'preview'` (claro) |
| **Auto-save** | Desligado em edição ❌ | Ligado em edição ✅ |
| **Snapshot** | Desligado em edição ❌ | Ligado em edição ✅ |
| **WYSIWYG Sync** | Bloqueado no modo errado ❌ | Ativo em edição ✅ |
| **Reflexo de Mudanças** | Não instantâneo ❌ | Instantâneo ✅ |
| **Visual Consistente** | Muda entre modos ❌ | Idêntico em ambos ✅ |
| **Fontes de Dados** | Conflitantes ❌ | Claramente separadas ✅ |

---

## 🎯 Implementação Recomendada

### Hook `useEditorMode` (Novo)

```typescript
export function useEditorMode(initialMode: 'edit' | 'preview' = 'edit') {
  const [mode, setMode] = useState<'edit' | 'preview'>(initialMode);
  
  const config = useMemo(() => ({
    isEditing: mode === 'edit',
    isPreviewing: mode === 'preview',
    
    // Configurações derivadas
    enableAutoSave: mode === 'edit',
    enableSnapshot: mode === 'edit',
    enableSelection: mode === 'edit',
    showPropertiesPanel: mode === 'edit',
    
    // Fonte de dados
    dataSource: mode === 'edit' ? 'wysiwyg' : 'published',
  }), [mode]);
  
  return {
    mode,
    setMode,
    config,
    toggleMode: () => setMode(m => m === 'edit' ? 'preview' : 'edit'),
  };
}
```

### Uso no Editor

```typescript
function QuizModularEditorInner(props: QuizModularEditorProps) {
  const editorMode = useEditorMode('edit');
  
  // ✅ Auto-save correto
  const autoSave = useAutoSave({
    enabled: editorMode.config.enableAutoSave && !!resourceId,
    data: wysiwyg.state.blocks,
    onSave: async () => {
      await saveStepBlocks(currentStep);
    },
  });
  
  // ✅ Snapshot correto
  const snapshot = useSnapshot({
    enabled: editorMode.config.enableSnapshot && !!resourceId,
    resourceId,
  });
  
  // ✅ Blocos corretos
  const blocksToRender = editorMode.config.dataSource === 'wysiwyg'
    ? wysiwyg.state.blocks
    : publishedBlocks;
  
  return (
    <div>
      {/* ✅ Canvas com visual consistente */}
      <CanvasColumn
        blocks={blocksToRender}
        isEditable={editorMode.isEditing}
      />
      
      {/* ✅ Properties apenas em modo edit */}
      {editorMode.config.showPropertiesPanel && (
        <PropertiesColumn
          selectedBlock={selectedBlock}
          onBlockUpdate={handleBlockUpdate}
        />
      )}
    </div>
  );
}
```

---

## ✅ Benefícios da Correção

1. **Lógica Clara**: `edit` = editar, `preview` = visualizar
2. **WYSIWYG Real**: Reflexo instantâneo + visual idêntico
3. **Performance**: Auto-save apenas quando necessário
4. **UX Melhor**: Usuário sabe exatamente em qual modo está
5. **Manutenção**: Código mais legível e testável
6. **Sem Bugs**: Elimina lógica invertida

---

## 🚨 Riscos da Implementação Atual

### Bug 1: Auto-Save Desligado em Edição
```typescript
// Linha 432: ERRO CRÍTICO
const autoSave = previewMode !== 'live' ? useAutoSave({...}) : {...};
//                            ^^^^^^^^^ Desliga auto-save em 'live' (edição)
```

**Consequência**: Usuário perde trabalho se fechar o navegador.

### Bug 2: Snapshot Desligado em Edição
```typescript
// Linha 375: ERRO CRÍTICO
const snapshot = useSnapshot({
  enabled: previewMode !== 'live', // ← Desliga snapshot em edição
});
```

**Consequência**: Impossível recuperar drafts não salvos.

### Bug 3: WYSIWYG Bloqueado no Modo Errado
```typescript
// Linha 908: ERRO CRÍTICO
if (previewMode === 'live') {
  return; // ← Bloqueia auto-seleção em 'live' (edição)
}
```

**Consequência**: Seleção de blocos não funciona em modo edição.

---

## 📝 Conclusão

### Resposta Direta

**❌ NÃO, o WYSIWYG atual NÃO segue boas práticas.**

**Problemas**:
1. Nomenclatura invertida (20+ lugares)
2. Lógica de negócio invertida (auto-save, snapshot, seleção)
3. Visual não é idêntico entre modos (fontes diferentes)
4. Impossível ter edição instantânea E preview ao mesmo tempo

### Solução

**✅ SIM, é POSSÍVEL ter edição instantânea + visual idêntico.**

**Requisitos**:
1. Renomear `'live'`/`'production'` → `'edit'`/`'preview'`
2. Corrigir 20+ linhas de lógica invertida
3. Unificar componentes de renderização
4. Garantir auto-save apenas em modo `'edit'`
5. Usar mesmos componentes React em ambos os modos

**Esforço**: 2-3 horas de refactoring  
**Risco**: Médio (muitas mudanças, mas todas localizadas)  
**Benefício**: Sistema WYSIWYG verdadeiro + código mais limpo

---

**Recomendação**: Implementar correção completa antes de adicionar novas features, pois a base atual tem falhas arquiteturais graves que causarão bugs crescentes.
