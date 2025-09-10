# 📝 Domínio 1: Editor - Checklist de Validação e Migração

## 🎯 Objetivo
Consolidar todos os editores em torno do **MainEditorUnified** e **UnifiedEditor**, removendo editores legados e duplicatas.

## 📊 Estado Atual Detectado

### ✅ Editores Ativos (Manter)
- **`MainEditorUnified.tsx`** - Editor principal da aplicação (/editor)
- **`UnifiedEditor.tsx`** - Componente unificado com lazy loading
- **`EditorProvider.tsx`** - Context provider principal

### ⚠️ Editores Legados (Avaliar Remoção)
- **`EditorPro.tsx`** - Usado como fallback no UnifiedEditor
- **`SchemaDrivenEditorResponsive.tsx`** - Usado em SchemaEditorPage e fallback
- **`EditorUnified.tsx`** - Versão anterior (sem imports ativos)
- **`EditorConsolidated.tsx`** - Wrapper que redireciona para UnifiedEditor
- **`QuizEditorPro.tsx`** - Editor específico de quiz (sem imports ativos)
- **`PageEditor.tsx`** - Editor de página (sem imports ativos)

### 🔄 Rotas Ativas
- **`/editor`** → `MainEditorUnified` ✅
- **`/editor/:funnelId`** → `MainEditorUnified` ✅
- **`/editor-schema`** → `SchemaDrivenEditorResponsive` (página de teste)

## 📋 Checklist de Execução

### Etapa 1: Validação do Editor Unificado ✅
- [ ] Confirmar que `MainEditorUnified.tsx` está funcionando
- [ ] Verificar se `UnifiedEditor.tsx` carrega corretamente
- [ ] Testar lazy loading e fallbacks
- [ ] Validar contextos e providers

### Etapa 2: Migração de Fluxos Dependentes
- [ ] Verificar todas as páginas que importam editores antigos
- [ ] Migrar `SchemaEditorPage` para usar `MainEditorUnified`
- [ ] Atualizar imports de componentes lazy
- [ ] Corrigir imports em testes

### Etapa 3: Atualização de Rotas e Testes
- [ ] Verificar se todas as rotas `/editor*` usam `MainEditorUnified`
- [ ] Atualizar testes para usar apenas o editor unificado
- [ ] Validar que não há imports quebrados

### Etapa 4: Remoção de Arquivos Legados
- [ ] Mover editores legados para pasta de backup
- [ ] Remover imports não utilizados
- [ ] Atualizar index.ts e exports
- [ ] Validar build após remoção

## 🎯 Validação Final

### Checklist de Sucesso
- [ ] Todos os fluxos de criação/edição de funil usam `MainEditorUnified`
- [ ] Nenhum import de editores legados nos arquivos do projeto
- [ ] Testes de edição/criação de funil passam com o editor unificado
- [ ] Build completo sem erros
- [ ] Performance mantida ou melhorada

### Métricas de Validação
- **Antes:** 6+ editores diferentes
- **Depois:** 1 editor principal (`MainEditorUnified`) + 1-2 fallbacks
- **Imports legados:** 0
- **Rotas quebradas:** 0

---

**Status:** 🔄 Em execução
**Próximo passo:** Executar Etapa 1 - Validação do Editor Unificado
