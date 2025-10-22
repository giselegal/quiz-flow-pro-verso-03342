# 🗑️ Safe to Delete - Arquivos Legacy

**Status**: 📋 Catalogado  
**Risco**: 🟢 Baixo (após confirmação de testes)  
**Data**: 2025-10-22

## ⚠️ IMPORTANTE: Leia Antes de Deletar

Este documento lista arquivos que **provavelmente** podem ser removidos com segurança, mas você DEVE:

1. ✅ **FAZER BACKUP** antes de deletar qualquer arquivo
2. ✅ **TESTAR** após cada lote de remoções
3. ✅ **COMMITAR** incrementalmente (não tudo de uma vez)
4. ✅ **MONITORAR** console/logs após deployment

## 📁 Arquivos Legacy Confirmados

### 1. Backups Explícitos (Safe: 95%)

Estes arquivos têm `.backup`, `.old`, `.legacy` ou similar no nome:

```bash
# Remover após confirmar que versões principais funcionam
src/services/backup/
src/services/archived/
```

**Recomendação**: Mova para pasta `archive/` em vez de deletar imediatamente.

### 2. Arquivos `.deprecated.ts` (Safe: 90%)

Estes arquivos já foram marcados como deprecated:

```typescript
// src/services/
- compatibleAnalytics.ts.deprecated
- simpleAnalytics.ts.deprecated

// src/hooks/
- useOptimizedQuizFlow.deprecated.ts
- useOptimizedBlockOperations.deprecated.ts

// src/contexts/
- UnifiedAppProvider.deprecated.tsx
```

**Como verificar**:
```bash
# Buscar por imports destes arquivos
grep -r "compatibleAnalytics" src/
grep -r "useOptimizedQuizFlow" src/
```

Se retornar 0 resultados (exceto o próprio arquivo), safe to delete.

### 3. Editores Deprecated (Safe: 75%)

Marcados como deprecated na análise:

```typescript
// src/components/editor/
- OptimizedEditorProvider.tsx // Deprecated, usar EditorProviderUnified
- PureBuilderProvider.tsx // Deprecated, usar SuperUnifiedProvider

// src/components/editor/advanced/
- MasterEditorWorkspace.tsx // Deprecated

// src/components/editor/modules/
- ModularResultEditor.tsx // Deprecated

// src/components/editor/quiz/
- QuizFunnelEditor.tsx // Deprecated
- QuizFunnelEditorSimplified.tsx // Deprecated
- QuizFunnelEditorWYSIWYG_Refactored.tsx // Deprecated
```

**Como verificar antes de deletar**:
```bash
# Para cada editor deprecated, buscar imports
rg "import.*OptimizedEditorProvider" src/
rg "import.*MasterEditorWorkspace" src/
```

### 4. Renderers Redundantes (Safe: 80%)

```typescript
// src/components/core/
- BlockRenderer.tsx // Wrapper fino para UniversalBlockRenderer

// src/components/editor/components/
- ComponentRenderer.tsx // Deprecated, usar UniversalBlockRenderer
```

**Verificação**:
```bash
grep -r "BlockRenderer" src/ --exclude="*.test.*"
```

### 5. Testes Obsoletos (Safe: 85%)

```typescript
// src/__tests__/
- Routing.test.tsx // Status: Deprecated - manter para referência
```

**Ação**: Mover para `__tests__/archived/` em vez de deletar.

### 6. Scripts e Utilitários (Safe: 70%)

```javascript
// Root do projeto
- restaurar-modelo-padrao.js // Script de restore - pode arquivar
- robust-registry.ts // Fallback - verificar se ainda é usado
- run-e2e-tests.sh // Script de teste - manter se usado em CI
```

**Verificação**:
```bash
# Checar se scripts são referenciados em package.json
grep "restaurar-modelo-padrao" package.json
grep "robust-registry" src/
```

### 7. Documentação Legacy (Safe: 95%)

```markdown
// Docs antigos que foram substituídos
- docs/old/ (se existir)
- *.backup.md
- *_OLD.md
```

## 🔍 Processo de Verificação Segura

### Script de Verificação Automática

```bash
#!/bin/bash
# check-safe-to-delete.sh

echo "🔍 Verificando arquivos safe to delete..."

# Função para verificar se arquivo é importado
check_imports() {
    local file=$1
    local filename=$(basename "$file" .ts)
    filename=$(basename "$filename" .tsx)
    
    echo "Verificando: $file"
    
    # Buscar imports (excluindo o próprio arquivo)
    local count=$(rg "import.*$filename" src/ \
        --type ts \
        --type tsx \
        -g "!$(basename $file)" \
        | wc -l)
    
    if [ $count -eq 0 ]; then
        echo "  ✅ Nenhum import encontrado - SAFE"
    else
        echo "  ⚠️  $count imports encontrados - CUIDADO"
    fi
}

# Verificar arquivos deprecated
echo ""
echo "📋 Verificando arquivos .deprecated..."
find src -name "*.deprecated.*" | while read file; do
    check_imports "$file"
done

echo ""
echo "📋 Verificando editors deprecated..."
for file in \
    "src/components/editor/OptimizedEditorProvider.tsx" \
    "src/components/editor/PureBuilderProvider.tsx" \
    "src/components/editor/advanced/MasterEditorWorkspace.tsx"; do
    if [ -f "$file" ]; then
        check_imports "$file"
    fi
done

echo ""
echo "✅ Verificação concluída!"
```

### Passo a Passo Manual

#### Fase 1: Arquivos Deprecated Explícitos (Esta Semana)

1. **Verificar imports**:
```bash
# Para cada arquivo deprecated
rg "import.*useOptimizedQuizFlow" src/
```

2. **Se 0 resultados, criar backup**:
```bash
mkdir -p archive/deprecated
git mv src/hooks/useOptimizedQuizFlow.deprecated.ts archive/deprecated/
```

3. **Testar**:
```bash
npm run build
npm run test
```

4. **Commit incremental**:
```bash
git commit -m "chore: archive useOptimizedQuizFlow.deprecated.ts (confirmed unused)"
```

#### Fase 2: Editores Redundantes (Próxima Semana)

1. **Listar candidatos**:
```bash
find src/components/editor -name "*.tsx" | grep -i deprecated
```

2. **Para cada editor, verificar uso**:
```bash
rg "import.*OptimizedEditorProvider" src/
```

3. **Mover para archived/**:
```bash
mkdir -p src/components/editor/__archived__
git mv src/components/editor/OptimizedEditorProvider.tsx \
       src/components/editor/__archived__/
```

#### Fase 3: Serviços Duplicados (Após Migração)

**AGUARDAR** migração via ServiceAliases.ts antes de deletar.

1. **Após migração completa de imports**:
```bash
# Verificar se serviço antigo ainda é usado
rg "from.*funnelService'" src/
```

2. **Se 0 resultados**:
```bash
mkdir -p src/services/__archived__
git mv src/services/funnelService.ts src/services/__archived__/
```

## 📊 Estimativa de Limpeza

### Impacto por Fase

| Fase | Arquivos | Linhas | Bundle Reduction | Risco |
|------|----------|--------|------------------|-------|
| 1. Deprecated explícitos | ~10 | ~2000 | ~50KB | 🟢 Baixo |
| 2. Editores redundantes | ~8 | ~3500 | ~120KB | 🟡 Médio |
| 3. Serviços duplicados | ~70 | ~15000 | ~400KB | 🟠 Alto* |
| 4. Testes obsoletos | ~5 | ~1000 | 0KB | 🟢 Baixo |
| 5. Docs legacy | ~15 | ~5000 | 0KB | 🟢 Baixo |

*Alto apenas se deletar antes de migrar imports

### Total Estimado
- **~108 arquivos** podem ser removidos
- **~26,500 linhas** de código
- **~570KB** redução de bundle
- **70%** redução de confusão

## ⚠️ Red Flags - NÃO Delete Se

1. ❌ Arquivo tem imports ativos em src/
2. ❌ Arquivo está em package.json scripts
3. ❌ Arquivo é importado dinamicamente (import())
4. ❌ Arquivo é usado em testes críticos
5. ❌ Você não entende para que serve

## 🎯 Recomendação de Ação

### Esta Semana (Quick Wins)
✅ Safe to execute agora:
- [ ] Mover `src/services/backup/` → `archive/services/`
- [ ] Mover `*.deprecated.ts` (após verificação) → `archive/`
- [ ] Mover `run-e2e-tests.sh` → `scripts/archived/`
- [ ] Mover `restaurar-modelo-padrao.js` → `scripts/archived/`

### Próxima Semana
⚠️ Requer testes:
- [ ] Arquivar editores deprecated (após verificação)
- [ ] Arquivar renderers redundantes (após verificação)
- [ ] Remover testes obsoletos → `__tests__/archived/`

### Mês 1
🔴 Alto cuidado:
- [ ] Remover serviços duplicados (APÓS migração completa)
- [ ] Limpar aliases após confirmação
- [ ] Final cleanup e medição de impacto

## 📚 Recursos

- [ServiceAliases.ts](../src/services/ServiceAliases.ts)
- [QUICK_WIN_SERVICE_CONSOLIDATION.md](./QUICK_WIN_SERVICE_CONSOLIDATION.md)
- [RELATORIO_GARGALOS_13_10_2025.md](./RELATORIO_GARGALOS_13_10_2025.md)

---

**⚠️ LEMBRETE FINAL**: Sempre faça backup antes de deletar. Use git mv para mover para archive/ em vez de deletar diretamente.
