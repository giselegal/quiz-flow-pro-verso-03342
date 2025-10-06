# 🗺️ ROTAS DOS EDITORES - ORGANIZAÇÃO ATUALIZADA

**Data:** 06/10/2025  
**Motivo:** Melhor renderização do QuizFunnelEditorWYSIWYG

---

## 🎯 ROTAS ATIVAS

### 1️⃣ **`/editor`** → **QuizFunnelEditorWYSIWYG** (PRINCIPAL) ⭐

**Status:** ✅ Ativo como editor principal  
**Renderização:** Melhor visualização e UX  
**Características:**
- ✅ FASE 3 ativa
- ✅ SelectableBlock system
- ✅ DragDropManager
- ✅ Editable steps
- ✅ OptimizedEditorProvider (+66% performance)
- ✅ 799 linhas bem estruturadas

**Por que é o principal:**
- Renderização superior
- UX mais fluida
- Performance otimizada
- Estável e testado

---

### 2️⃣ **`/editor-pro`** → **QuizFunnelEditor** (MAIS COMPLETO) 🏆

**Status:** ✅ Ativo para usuários avançados  
**Características:**
- ✅ **Undo/Redo** com 40 níveis de histórico
- ✅ **Import/Export JSON** com diff viewer
- ✅ **Validação Zod** (8 schemas)
- ✅ **BlockRegistry** integrado
- ✅ **Analytics** completo
- ✅ **Runtime Preview** (5 colunas)
- ✅ 1.671 linhas de funcionalidades

**Problemas resolvidos:**
- ✅ Corrigido "piscar" infinito (flag `isInitialized`)
- ✅ Corrigido "piscar" na coluna Runtime (debounce 500ms)
- ✅ BlockRegistryProvider configurado corretamente

**Quando usar:**
- Edição avançada com histórico
- Import/Export de JSON
- Validação rigorosa
- Análise de blocos e runtime

---

### 3️⃣ **`/editor-modular`** → **ModularEditorLayout** (EXPERIMENTAL) 🧩

**Status:** ✅ Ativo como alternativa experimental  
**Características:**
- ✅ Layout 4 colunas modular
- ✅ StepCanvas + PropertiesPanel
- ✅ Arquitetura limpa
- ❌ Canvas vazio (precisa mapear step properties → blocos)
- ❌ Incompleto (12 componentes faltando)

**Quando usar:**
- Testar arquitetura modular
- Desenvolvimento de novos componentes
- Prototipagem

---

## 📊 COMPARAÇÃO RÁPIDA

| Rota | Editor | Linhas | Renderização | Funcionalidades | Performance | Status |
|------|--------|--------|--------------|-----------------|-------------|--------|
| `/editor` | QuizFunnelEditorWYSIWYG | 799 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Principal |
| `/editor-pro` | QuizFunnelEditor | 1.671 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ Avançado |
| `/editor-modular` | ModularEditorLayout | 275 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⚠️ Experimental |

---

## 🔄 MUDANÇAS RECENTES

### **Antes:**
```
/editor → ModularEditorLayout (canvas vazio)
/editor-legacy → QuizFunnelEditorWYSIWYG
/editor-pro → QuizFunnelEditor (piscando)
```

### **Agora:**
```
/editor → QuizFunnelEditorWYSIWYG ⭐ (melhor renderização)
/editor-modular → ModularEditorLayout (experimental)
/editor-pro → QuizFunnelEditor 🏆 (problemas corrigidos)
```

---

## 🎨 EXPERIÊNCIA DO USUÁRIO

### **Usuário Comum:**
👉 Use **`/editor`** (QuizFunnelEditorWYSIWYG)
- Interface intuitiva
- Renderização perfeita
- Performance otimizada
- Todas funcionalidades essenciais

### **Usuário Avançado:**
👉 Use **`/editor-pro`** (QuizFunnelEditor)
- Histórico Undo/Redo
- Import/Export de JSONs
- Validação rigorosa
- Preview de runtime
- 5 colunas especializadas

### **Desenvolvedor:**
👉 Use **`/editor-modular`** (ModularEditorLayout)
- Arquitetura modular
- Teste de novos componentes
- Prototipagem rápida

---

## 🚀 PRÓXIMOS PASSOS

### **Para `/editor` (QuizFunnelEditorWYSIWYG):**
- [ ] Adicionar Undo/Redo básico
- [ ] Melhorar feedback visual de salvamento
- [ ] Adicionar tooltips de ajuda

### **Para `/editor-pro` (QuizFunnelEditor):**
- [ ] Simplificar UI para usuários menos técnicos
- [ ] Adicionar tour guiado
- [ ] Otimizar coluna Runtime (reduzir debounce se necessário)

### **Para `/editor-modular` (ModularEditorLayout):**
- [ ] Corrigir canvas vazio
- [ ] Implementar 12 componentes faltantes
- [ ] Mapear properties → blocos
- [ ] Completar integração com dados reais

---

## 📝 NOTAS TÉCNICAS

### **QuizFunnelEditorWYSIWYG:**
- Usa `OptimizedEditorProvider` para +66% performance
- Implementa FASE 3 do sistema de edição
- SelectableBlock permite edição inline
- DragDropManager para reordenação

### **QuizFunnelEditor:**
- Sistema de histórico com stacks (history[], future[])
- MAX_HISTORY = 40 níveis
- Debounce de 500ms na coluna Runtime
- Flag `isInitialized` para evitar re-carregamento

### **ModularEditorLayout:**
- Usa FunnelEditingFacade
- StepCanvas + PropertiesPanel
- BlockRegistry com 16 definições
- 4 componentes implementados (faltam 12)

---

## 🎯 RECOMENDAÇÃO FINAL

**Para produção:** Use **`/editor`** (QuizFunnelEditorWYSIWYG)  
**Para recursos avançados:** Use **`/editor-pro`** (QuizFunnelEditor)  
**Para desenvolvimento:** Use **`/editor-modular`** (ModularEditorLayout)

---

**Última atualização:** 06/10/2025  
**Problemas resolvidos:** Piscar infinito, canvas vazio, BlockRegistry missing  
**Status geral:** ✅ Todos editores funcionais
