# 🧹 Limpeza Final - Código Legado

**Data:** 03/12/2025  
**Status:** Em andamento

---

## 🎯 Objetivo

Remover código legado, duplicado e não utilizado após a migração completa para arquitetura unificada.

---

## ✅ Já Removido (Sessões Anteriores)

### 1. EditorCompatLayer
- ✅ `/src/core/contexts/EditorContext/EditorCompatLayer.tsx` - DELETADO
- ✅ Todas as referências removidas do codebase
- ✅ Exports limpos de `/src/core/contexts/EditorContext/index.ts`

### 2. Serviços Legados
- ✅ `/src/services/legacy/` - Diretório inteiro DELETADO
- ✅ Substituído por `FunnelServiceCompatAdapter`

### 3. Painéis Legados
- ✅ Imports de `@/archive/legacy-panels/*` - Todos removidos/comentados
- ✅ `UltraUnifiedPropertiesPanel` - Substituído por `SinglePropertiesPanel`

---

## 🔍 Código Legado Identificado para Remoção

### 1. Componentes Deprecados com Comentários

#### 📁 `src/contexts/providers/SuperUnifiedProviderV2.tsx`
```typescript
// LEGACY HOOK (compatibilidade) - linha 166
// ⚠️ DEPRECATED: Use hooks específicos ao invés deste - linha 172
```

**Ação recomendada:**
- ✅ Manter por enquanto (usado como compatibility layer)
- ⚠️ Adicionar plano de migração para Q1 2026
- 📝 Documentar hooks específicos recomendados

---

#### 📁 `src/components/quiz/QuizApp.tsx`
```typescript
const showLegacyProgressBar = false; // linha 188
// Renderização condicional nas linhas 200-201
```

**Ação recomendada:**
- ✅ **REMOVER** bloco inteiro de `showLegacyProgressBar`
- Já está desativado (false) e não é mais necessário

---

#### 📁 `src/components/editor/properties/NoCodeEditorIntegration.tsx`
**Status:** Arquivo substituído por mensagem de deprecação

**Ação recomendada:**
- ✅ **DELETAR** arquivo completamente
- Nenhum import ativo encontrado

---

#### 📁 `src/components/editor/__tests__/OptimizedPropertiesPanel.test.tsx`
**Status:** Teste inteiro comentado com markers "DEPRECATED"

**Ação recomendada:**
- ✅ **DELETAR** arquivo completamente
- Teste não é mais relevante (painel foi substituído)

---

### 2. Arquivos de Server Legacy

#### 📁 `server/quiz-style/adapter.ts`
```typescript
// Tipos simplificados do legacy (apenas campos usados no nível 1)
interface LegacyBlock { ... }
interface LegacyStepFile { ... }
export async function loadLegacyStepsFromJson(): Promise<LegacyLoadResult> { ... }
```

**Ação recomendada:**
- ⚠️ **MANTER temporariamente**
- Usado para migração de dados antigos
- Marcar para remoção após migração completa de produção

---

#### 📁 `server/quiz-style/controller.ts`
```typescript
if (process.env.LEGACY_ADAPTER_FALLBACK === 'true') {
  const result = await safeToTemplateDraft({ slug, name: 'Quiz Estilo Legacy' });
}
```

**Ação recomendada:**
- ⚠️ **MANTER**
- Feature flag útil para rollback de emergência
- Documentar quando pode ser removido (após 30 dias em produção)

---

### 3. Scripts de Migração/Auditoria

#### 📦 `package.json`
```json
"audit:registries:legacy": "tsx scripts/audit/legacy-registries-usage.ts",
"migrate:canonical-imports": "tsx scripts/migration/find-legacy-imports.ts",
"migrate:canonical-imports:apply": "tsx scripts/migration/find-legacy-imports.ts --apply-alias"
```

**Ação recomendada:**
- ✅ **MANTER**
- Scripts úteis para auditorias futuras
- Mover para seção "devDependencies" se não estiverem

---

### 4. Testes Legados (Potencialmente Não Utilizados)

#### Lista de Testes para Revisar:
```
src/__tests__/ConsolidatedTemplateService.v32.test.ts
src/__tests__/HybridTemplateService.test.ts
src/__tests__/fase-2-integration.test.ts
src/__tests__/fase-3a-components.test.ts
```

**Ação recomendada:**
- 🔍 **REVISAR MANUALMENTE**
- Verificar se ainda são executados no CI
- Se não executam: deletar
- Se executam mas falham: consertar ou deletar

---

## 🚀 Plano de Limpeza Gradual

### Fase 1: Limpeza Segura Imediata ✅
**Pode executar agora sem riscos:**

1. ✅ Remover `showLegacyProgressBar` de `QuizApp.tsx`
2. ✅ Deletar `NoCodeEditorIntegration.tsx`
3. ✅ Deletar `OptimizedPropertiesPanel.test.tsx`
4. ✅ Deletar `NoCodePropertiesPanelClean.tsx` (se não usado)

### Fase 2: Revisão de Testes (1 dia) ⏳
**Requer análise:**

1. Rodar suite de testes: `npm test`
2. Identificar testes que falham
3. Consertar ou deletar testes obsoletos
4. Atualizar snapshots se necessário

### Fase 3: Deprecação com Warnings (2 semanas) ⏳
**Para componentes ainda em uso:**

1. Adicionar console.warn nos componentes legados
2. Coletar métricas de uso real
3. Planejar migração dos últimos consumidores
4. Deletar após período de transição

### Fase 4: Server Legacy (após produção estável) ⏳
**Aguardar 30 dias em produção:**

1. Monitorar se `LEGACY_ADAPTER_FALLBACK` é usado
2. Se não: remover código legacy do server
3. Manter scripts de migração arquivados

---

## 📊 Métricas de Limpeza

### Antes da Migração
- **Providers legados:** 5+
- **Painéis de propriedades:** 7+
- **Serviços duplicados:** 15+
- **Linhas de código morto:** ~5000+

### Após Fase 1-3 (Atual)
- **Providers legados:** 0 ✅
- **Painéis de propriedades:** 1 (SinglePropertiesPanel) ✅
- **Serviços duplicados:** 1 (FunnelServiceCompatAdapter) ✅
- **Linhas de código morto:** ~500 (server legacy)

### Meta Fase 4
- **Providers legados:** 0 ✅
- **Painéis de propriedades:** 1 ✅
- **Serviços duplicados:** 0 ✅
- **Linhas de código morto:** 0 ✅

---

## 🎯 Comandos de Limpeza Rápida

### Remover arquivos deprecados agora:
```bash
# Backup antes de deletar
mkdir -p .archive/cleanup-$(date +%Y%m%d)

# Deletar arquivos seguros
rm -f src/components/editor/properties/NoCodeEditorIntegration.tsx
rm -f src/components/editor/__tests__/OptimizedPropertiesPanel.test.tsx

# Commitar
git add -A
git commit -m "chore: remove deprecated components (NoCodeEditorIntegration, OptimizedPropertiesPanel test)"
```

### Limpar showLegacyProgressBar:
```bash
# Editar manualmente src/components/quiz/QuizApp.tsx
# Remover linhas 188-209 (bloco showLegacyProgressBar)

git add src/components/quiz/QuizApp.tsx
git commit -m "chore: remove unused showLegacyProgressBar from QuizApp"
```

### Verificar testes obsoletos:
```bash
# Rodar todos os testes
npm test

# Listar testes que falharam
npm test 2>&1 | grep -E "FAIL|● "

# Investigar cada teste falhando e decidir: fix ou delete
```

---

## ✅ Checklist de Limpeza

### Imediato (Fase 1)
- [ ] Remover `showLegacyProgressBar` de `QuizApp.tsx`
- [ ] Deletar `NoCodeEditorIntegration.tsx`
- [ ] Deletar `OptimizedPropertiesPanel.test.tsx`
- [ ] Verificar se `NoCodePropertiesPanelClean.tsx` é usado
- [ ] Build e type-check após remoções

### Curto Prazo (Fase 2)
- [ ] Rodar suite de testes completa
- [ ] Revisar testes obsoletos (lista acima)
- [ ] Deletar testes não utilizados
- [ ] Atualizar documentação de testes

### Médio Prazo (Fase 3)
- [ ] Adicionar warnings em `SuperUnifiedProviderV2.tsx`
- [ ] Coletar métricas de uso dos hooks legados
- [ ] Planejar migração final dos consumidores
- [ ] Criar guia de migração para time

### Longo Prazo (Fase 4)
- [ ] Aguardar 30 dias em produção estável
- [ ] Verificar uso de `LEGACY_ADAPTER_FALLBACK`
- [ ] Remover código legacy do server
- [ ] Arquivar scripts de migração

---

## 📝 Notas Finais

### O que NÃO deletar:
- ✅ `FunnelServiceCompatAdapter` - Adapter ativo em uso
- ✅ `SuperUnifiedProviderV2` - Compatibility layer necessária
- ✅ Scripts de migração - Úteis para auditorias futuras
- ✅ Feature flags - Sistema ativo e necessário
- ✅ Server legacy adapter - Necessário para migração de dados

### O que pode deletar com segurança:
- ✅ `NoCodeEditorIntegration.tsx` - Substituído por deprecation message
- ✅ `OptimizedPropertiesPanel.test.tsx` - Teste de painel removido
- ✅ `showLegacyProgressBar` - Flag desativada e não usada
- ✅ Testes que falham e não são mais relevantes

### Próximos Passos:
1. Executar Fase 1 (limpeza segura)
2. Validar build e testes
3. Commitar mudanças
4. Planejar Fase 2 (revisão de testes)

---

**Status:** Documentação completa. Pronto para executar Fase 1. ✅
