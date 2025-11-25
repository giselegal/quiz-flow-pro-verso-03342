# 🧪 GUIA DE TESTE: PROPERTIES PANEL HÍBRIDO

## ✅ STATUS DA CORREÇÃO

**5/5 Erros TypeScript Corrigidos:**
- ✅ FunnelSettingsModal linha 49: Type cast adicionado
- ✅ FunnelSettingsModal linha 125: exportSettings async
- ✅ UnifiedEditorLayout.hybrid linhas 79-91: fetch direto, tipos explícitos
- ✅ Build completo: `npm run build` passou
- ✅ Dev server: rodando em http://localhost:8080

---

## 🎯 COMO TESTAR

### **Modo 1: TEMPLATE JSON (Recomendado para teste inicial)**

1. **Acesse:** http://localhost:8080/editor?template=quiz21StepsComplete
2. **Clique em qualquer bloco** no canvas
3. **Observe:** Properties Panel deve abrir à direita
4. **Teste:** Editar propriedades (título, cor, etc.)
5. **Resultado esperado:** Alterações aparecem instantaneamente no bloco

**⚠️ Limitação:** Modo template não persiste no Supabase (só JSON em memória)

---

### **Modo 2: SUPABASE PERSISTENTE**

1. **Acesse:** http://localhost:8080/editor/result?funnelId=<UUID_VALIDO>
2. **Ou crie um funil novo** em Meus Funis
3. **Clique em bloco** no canvas
4. **Edite propriedades** no Properties Panel
5. **Resultado esperado:** 
   - Toast de sucesso: "✓ Bloco atualizado"
   - Mudanças salvas no Supabase
   - Recarregar página mantém alterações

---

### **Modo 3: HÍBRIDO (Em Desenvolvimento)**

1. **Arquivo:** `UnifiedEditorLayout.hybrid.tsx`
2. **Detecta automaticamente:**
   - `?templateId=X` → Carrega JSON do `/templates/`
   - `?funnelId=UUID` → Carrega do Supabase
3. **Status:** TypeScript OK, mas ainda não integrado na rota

**Para usar híbrido:**
```tsx
// Em App.tsx, trocar rota /editor para:
<Route path="/editor" element={<UnifiedEditorLayoutHybrid />} />
```

---

## 🔍 DEBUGGING

### **Console do Browser (F12)**

**Esperado ver:**
```
🔍 handleBlockUpdate called with:
  blockId: "abc123-..."
  updates: { title: "Novo Título" }
  
✓ Bloco atualizado com sucesso!
```

**Se aparecer erro:**
```
❌ Erro ao atualizar bloco: [detalhes]
```
→ Capture screenshot e compartilhe!

---

### **Network Tab (F12 → Network)**

**No modo Supabase:**
- Deve haver requisição `PATCH /rest/v1/component_instances?id=eq.<blockId>`
- Status 200: sucesso
- Status 401: não autenticado
- Status 404: bloco não existe

---

### **Mock Blocks (Fallback)**

Se não houver `funnelId`, o editor cria blocos MOCK automaticamente:

```tsx
const mockBlocks = [
  { id: 'mock-hero-1', type: 'hero', properties: {...} },
  { id: 'mock-cta-1', type: 'cta', properties: {...} }
];
```

**Para testar mock:** http://localhost:8080/editor/result (sem parâmetros)

---

## 📊 CHECKLIST DE VALIDAÇÃO

### **Teste 1: Visual Feedback**
- [ ] Properties Panel abre ao clicar em bloco
- [ ] Campos preenchidos com dados do bloco
- [ ] Mudanças refletem no canvas em tempo real

### **Teste 2: Persistência (Supabase)**
- [ ] Toast "✓ Bloco atualizado" aparece
- [ ] Recarregar página mantém mudanças
- [ ] Verificar no Supabase: tabela `component_instances` atualizada

### **Teste 3: Duplicação de Bloco**
- [ ] Botão "Duplicar" aparece no Properties Panel
- [ ] Clicar duplica bloco com novo UUID
- [ ] Toast "✓ Bloco duplicado"

### **Teste 4: Validação de Constraints**
- [ ] Enum: dropdown mostra opções corretas
- [ ] Min/Max: inputs numéricos respeitam limites
- [ ] Required: campos obrigatórios marcados

---

## 🐛 PROBLEMAS CONHECIDOS

### **1. "Não acontece merda nenhuma"**

**Causas possíveis:**
- ❌ Testando rota errada (`/editor?template` vs `/editor/result`)
- ❌ funnelId inválido ou não existe no Supabase
- ❌ Não autenticado (sem session do Supabase)
- ❌ JavaScript desabilitado/erro não visível

**Solução:** Ver console do browser (F12) para erros reais

---

### **2. Properties Panel não abre**

**Verificar:**
```tsx
// Em CanvasDropZone.tsx ou equivalente:
<Block 
  {...block} 
  onClick={() => onBlockSelect(block.id)} // ← DEVE chamar onBlockSelect
/>
```

**Debug:** Adicionar console.log em `handleBlockSelect`:
```tsx
const handleBlockSelect = useCallback((blockId: string) => {
  console.log('🎯 BLOCO CLICADO:', blockId);
  setSelectedBlockId(blockId);
}, []);
```

---

### **3. Mudanças não persistem**

**Verificar:**
- Session do Supabase ativa? `supabase.auth.getSession()`
- funnelId válido? Deve ser UUID do Supabase
- Permissões RLS (Row Level Security) corretas?

**Debug:** Ver Network tab para requisições PATCH falhando

---

## 📂 ARQUIVOS RELEVANTES

### **Principais:**
- `src/components/editor/layouts/UnifiedEditorLayout.tsx` - Modo Supabase
- `src/components/editor/layouts/UnifiedEditorLayout.hybrid.tsx` - Modo híbrido
- `src/hooks/useBlockMutations.ts` - Persistência Supabase
- `src/hooks/useEditorAdapter.ts` - duplicateBlock
- `src/types/propertyConstraints.ts` - Validações

### **Configuração:**
- `supabase/migrations/20251125_create_templates_table.sql` - Schema
- `src/types/funnelSettings.ts` - UnifiedFunnelSettings interface

---

## 🚀 PRÓXIMOS PASSOS

1. **Testar Modo Template** (mais fácil, sem Supabase)
2. **Ver console do browser** para confirmar funcionalidade
3. **Se funcionar:** migrar para modo Supabase
4. **Se não funcionar:** compartilhar screenshot do console + Network tab

---

## 💡 DICA PRO

**Para debug rápido, adicionar em `UnifiedEditorLayout.tsx`:**

```tsx
useEffect(() => {
  console.log('📊 STATE ATUAL:', {
    selectedBlockId,
    blocksCount: blocks.length,
    selectedBlock: blocks.find(b => b.id === selectedBlockId)
  });
}, [selectedBlockId, blocks]);
```

Isso mostra o estado em tempo real no console.

---

**Última atualização:** 25/11/2025 - Correções TypeScript completas ✅
