# 🧪 FASE 1 - GUIA DE TESTES
## Validação Template/Funnel Separation

**Data:** 31 de outubro de 2025  
**Objetivo:** Validar 5 fixes implementados na Fase 1

---

## 🚀 Setup Inicial

```bash
# 1. Iniciar servidor de desenvolvimento
npm run dev

# 2. Abrir navegador
http://localhost:5173
```

---

## ✅ Teste 1: Modo Template (100% Local)

### Objetivo
Validar que `?template=X` NÃO tenta salvar no Supabase

### Passos

1. **Abrir URL de template:**
   ```
   http://localhost:5173/editor?template=quiz21StepsComplete
   ```

2. **Verificar diagnóstico visual (bottom-right):**
   - ✅ Badge deve mostrar: **"template"**
   - ✅ Expandir painel (clique)
   - ✅ Modo: **template**
   - ✅ Template ID: **quiz21StepsComplete**
   - ✅ Funnel ID: *(vazio)*
   - ✅ Status Supabase: **local / Não**

3. **Verificar console do navegador (F12):**
   ```
   Procurar mensagens:
   ✅ "🎨 Modo Template Ativado: quiz21StepsComplete"
   ✅ "🎨 [MODO TEMPLATE] Usando estratégia LOCAL-FIRST"
   ✅ "📦 Public step JSON → step-XX: N blocos"
   
   NÃO deve aparecer:
   ❌ Chamadas para Supabase
   ❌ Erros de "funnel not found"
   ```

4. **Verificar botão "Salvar como Funil":**
   - ✅ Deve aparecer no **top-left**
   - ✅ Badge azul com ícone de Save
   - ✅ Hover deve mostrar: "Salvar como Funil"

5. **Editar um bloco:**
   - Selecionar etapa (ex: step-01)
   - Editar texto de um bloco
   - Verificar console:
     ```
     ✅ Mudanças aplicadas localmente
     ❌ SEM tentativas de save Supabase
     ```

### Resultado Esperado
- ✅ **0 chamadas Supabase** em template mode
- ✅ **Blocos carregados** de JSON público
- ✅ **Edições locais** funcionando
- ✅ **Botão "Salvar como Funil"** visível

---

## ✅ Teste 2: Conversão Template → Funnel

### Objetivo
Validar workflow de conversão template para funnel persistente

### Passos

1. **Continuar da URL de template:**
   ```
   http://localhost:5173/editor?template=quiz21StepsComplete
   ```

2. **Clicar "Salvar como Funil" (top-left):**
   - ✅ Dialog modal deve abrir
   - ✅ Título: "Salvar Template como Funil"
   - ✅ Campos visíveis:
     - Nome do Funil (obrigatório)
     - Descrição (opcional)
     - Template base: quiz21StepsComplete
     - Etapas: 21

3. **Preencher formulário:**
   ```
   Nome: "Teste Quiz Fase 1"
   Descrição: "Validação do fix 1.2"
   ```

4. **Clicar "Salvar Funil":**
   - ✅ Botão muda para "Salvando..." com spinner
   - ✅ Console deve mostrar:
     ```
     ✅ "Criando funnel no Supabase..."
     ✅ "Salvando blocos como component_instances..."
     ✅ "21 etapas salvas"
     ```

5. **Aguardar redirecionamento:**
   - ✅ URL muda para: `?funnelId=<novo-id>`
   - ✅ Toast de sucesso aparece:
     ```
     "Funil criado com sucesso! 🎉"
     "Teste Quiz Fase 1 foi salvo com 21 etapas"
     ```

6. **Verificar diagnóstico (bottom-right):**
   - ✅ Badge: **"funnel"** (mudou de template)
   - ✅ Funnel ID: `<novo-id>` (preenchido)
   - ✅ Template ID: *(vazio agora)*

### Resultado Esperado
- ✅ **Funnel criado** no Supabase
- ✅ **21 etapas salvas** como component_instances
- ✅ **Redirecionamento** automático para modo funnel
- ✅ **Toast de sucesso** aparece

---

## ✅ Teste 3: Modo Funnel (Supabase Ready)

### Objetivo
Validar que `?funnelId=X` está preparado para persistência Supabase

### Passos

1. **URL após conversão (ou manual):**
   ```
   http://localhost:5173/editor?funnelId=<id-do-teste-2>
   ```

2. **Verificar diagnóstico (bottom-right):**
   - ✅ Badge: **"funnel"**
   - ✅ Modo: **funnel**
   - ✅ Funnel ID: `<id>`
   - ✅ Status Supabase: **supabase / Sim**
   - ⚠️ Fonte: **individual-json** (fallback - normal por enquanto)

3. **Verificar console:**
   ```
   ✅ "💾 Modo Funnel Ativado: <id>"
   ✅ "💾 [MODO FUNNEL] Usando estratégia SUPABASE-FIRST"
   ⚠️ "Funnel mode: Carregado de JSON público (fallback)"
   ```

4. **Verificar botão "Salvar como Funil":**
   - ✅ **NÃO deve aparecer** (já é um funnel)

5. **Editar um bloco:**
   - Selecionar etapa (ex: step-02)
   - Editar opção de resposta
   - **NOTA:** Auto-save ainda não implementado (Fase 2)
   - Verificar que edição local funciona

### Resultado Esperado
- ✅ **Modo funnel detectado** corretamente
- ✅ **Supabase habilitado** no estado
- ⚠️ **Carregamento ainda via JSON** (fallback - Fase 2 implementará Supabase)
- ✅ **Botão "Salvar" NÃO aparece** (já é funnel)

---

## ✅ Teste 4: Priorização de Fontes

### Objetivo
Validar que TemplateLoader usa a fonte correta por modo

### Teste 4.1: Template Mode (LOCAL-FIRST)

```bash
# Abrir template mode
http://localhost:5173/editor?template=quiz21StepsComplete

# Verificar console (ordem de tentativas):
1. ✅ "📦 Public step JSON → step-01: N blocos"  # ← SUCESSO aqui
2. ❌ NÃO tenta Master JSON se JSON público existir
3. ❌ NÃO tenta TypeScript se JSON público existir
```

### Teste 4.2: Funnel Mode (SUPABASE-FIRST - preparado)

```bash
# Abrir funnel mode
http://localhost:5173/editor?funnelId=abc-123

# Verificar console (ordem de tentativas):
1. ⚠️ "TODO: Fase 2 - Implementar carregamento do Supabase"
2. ✅ "📦 Public step JSON → step-01: N blocos"  # ← FALLBACK atual
3. ❌ NÃO tenta TypeScript se JSON público existir
```

### Teste 4.3: Modo Unknown (CASCATA)

```bash
# Abrir sem parâmetros ou com parâmetros inválidos
http://localhost:5173/editor

# Verificar console (cascata original):
1. "❓ [MODO DESCONHECIDO] Usando estratégia cascata"
2. Tenta todas as fontes na ordem original
```

### Resultado Esperado
- ✅ **Template mode:** JSON público priorizado
- ✅ **Funnel mode:** Preparado para Supabase (fallback JSON)
- ✅ **Unknown mode:** Cascata original mantida

---

## ✅ Teste 5: Diagnóstico Visual (DEV Only)

### Objetivo
Validar painel de debug no editor

### Passos

1. **Abrir qualquer modo:**
   ```
   http://localhost:5173/editor?template=quiz21StepsComplete
   ```

2. **Localizar painel (bottom-right):**
   - ✅ Card fixo com borda azul
   - ✅ Ícone de Bug + "Editor Debug"
   - ✅ Badge com modo atual

3. **Clicar para expandir:**
   - ✅ Painel expande
   - ✅ Seções visíveis:
     - **Modo Template/Funnel** (com ícone)
     - **Status Supabase** (modo + habilitado)
     - **Etapas Carregadas** (total + blocos)
     - **Fontes por Etapa** (primeiras 5)

4. **Verificar dados:**
   ```
   ✅ Template ID: quiz21StepsComplete (quando ?template=X)
   ✅ Funnel ID: <id> (quando ?funnelId=X)
   ✅ Total: 21 steps
   ✅ Blocos: ~200 blocks
   ✅ Fontes: individual-json / master-json / etc.
   ```

5. **Clicar novamente para colapsar:**
   - ✅ Painel minimiza
   - ✅ Apenas header visível

6. **Verificar produção:**
   ```bash
   # Build de produção
   npm run build
   npm run preview
   
   # Abrir editor
   http://localhost:4173/editor?template=quiz21StepsComplete
   
   # Verificar:
   ❌ Painel NÃO deve aparecer (PROD mode)
   ```

### Resultado Esperado
- ✅ **Painel visível em DEV**
- ✅ **Dados corretos** por modo
- ✅ **Expansível/colapsável**
- ✅ **Oculto em PROD**

---

## ✅ Teste 6: Schema do Banco (SQL)

### Objetivo
Validar que migration SQL funciona corretamente

### ⚠️ NOTA
Este teste requer acesso ao Supabase configurado

### Passos (quando Supabase disponível)

```bash
# 1. Aplicar migration
npx supabase migration up

# 2. Verificar no Supabase Studio:
✅ Tabela 'funnels' tem colunas:
   - category (TEXT, NOT NULL, DEFAULT 'quiz')
   - context (TEXT, NOT NULL, DEFAULT 'editor')

✅ Índices criados:
   - idx_funnels_category
   - idx_funnels_context
   - idx_funnels_category_context

✅ Constraints ativos:
   - funnels_category_check (quiz, lead-magnet, etc.)
   - funnels_context_check (editor, viewer, public)

# 3. Testar criação de funnel:
# (usar teste 2 acima)
✅ Novos funnels têm category='quiz' e context='editor'
```

### Resultado Esperado
- ✅ **Migration aplica sem erros**
- ✅ **Campos adicionados** com defaults
- ✅ **Índices criados** para performance
- ✅ **Constraints validam** valores

---

## 📊 Checklist Final

### Funcionalidades
- [ ] Template mode carrega 100% local (0 Supabase)
- [ ] Funnel mode detecta corretamente
- [ ] Conversão template→funnel funciona
- [ ] Diagnóstico visual aparece (DEV only)
- [ ] Priorização de fontes por modo

### Performance
- [ ] Tempo de carregamento < 1s (template mode)
- [ ] Sem tentativas Supabase em template mode
- [ ] Console limpo (sem erros)

### UI/UX
- [ ] Botão "Salvar como Funil" aparece apenas em template mode
- [ ] Dialog de conversão validação funciona
- [ ] Toast de sucesso aparece
- [ ] Redirecionamento automático funciona
- [ ] Diagnóstico expansível/colapsável

### Console
- [ ] Logs corretos por modo:
  - 🎨 "Modo Template Ativado" (template)
  - 💾 "Modo Funnel Ativado" (funnel)
- [ ] Fonte correta reportada:
  - 📦 "Public step JSON" (prioridade)
  - 📦 "Master JSON" (fallback)
  - 📦 "TS template" (fallback final)

---

## 🐛 Problemas Conhecidos (Esperados)

### ⚠️ Funnel Mode - Fonte ainda é JSON (Fase 2)
**Problema:** Ao abrir `?funnelId=X`, fonte é "individual-json" (fallback)  
**Motivo:** `loadFromSupabase()` ainda não implementado  
**Status:** **NORMAL** - será implementado na Fase 2  
**Console esperado:**
```
💾 [MODO FUNNEL] Usando estratégia SUPABASE-FIRST
⚠️ Funnel mode: Carregado de JSON público (fallback)
```

### ⚠️ Auto-save não funciona (Fase 2)
**Problema:** Editar blocos em funnel mode não salva automaticamente  
**Motivo:** Auto-save com debounce ainda não implementado  
**Status:** **NORMAL** - será implementado na Fase 2

---

## 📝 Relatório de Bugs

Se encontrar bugs **NÃO esperados**, documente:

```markdown
### Bug: [Título]
**Modo:** template / funnel / unknown
**URL:** http://localhost:5173/editor?...
**Passos para reproduzir:**
1. ...
2. ...

**Resultado esperado:** ...
**Resultado obtido:** ...

**Console:**
```
[cole logs do console]
```

**Diagnóstico:**
- Modo: ...
- Fonte: ...
- Supabase: ...
```

---

## ✅ Conclusão dos Testes

**Ao completar todos os testes:**
- ✅ Fase 1 está **funcionando corretamente**
- ✅ Template mode: **100% local** (zero Supabase)
- ✅ Funnel mode: **Preparado** para Fase 2
- ✅ Conversão template→funnel: **Funcional**
- ✅ Diagnóstico: **Útil para debug**

**Próximos passos:**
1. Confirmar todos os checkboxes
2. Documentar qualquer bug não esperado
3. Prosseguir para **Fase 2: Supabase Integration**

---

**Data dos Testes:** ___/___/2025  
**Testado por:** _________________  
**Status:** ⬜ Aprovado | ⬜ Com ressalvas | ⬜ Reprovado
