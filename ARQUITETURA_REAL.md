# 🏗️ ARQUITETURA REAL DO SISTEMA (2025)

## ✅ ESTRUTURA EM PRODUÇÃO (ÚNICA VERDADE)

```
App.tsx (/editor route)
├── EditorErrorBoundary
├── HybridEditorPro (wrapper - 89 linhas)
    ├── EditorProvider (EditorContext.tsx - 923 linhas) ✅ ATIVO
    ├── UnifiedDndProvider ✅ ATIVO
    └── HybridModularEditorPro (700 linhas) ✅ EDITOR PRINCIPAL
        ├── APIPropertiesPanel ✅ PAINEL ATIVO
        ├── StepSidebar ✅ SIDEBAR
        ├── ComponentsSidebar ✅ COMPONENTES
        └── EditorCanvas ✅ CANVAS
```

## ❌ CÓDIGO MORTO (PARA REMOÇÃO)

### Providers Obsoletos:
- ❌ `UnifiedEditorProvider.tsx` (509 linhas) - NUNCA USADO
- ❌ `EditorProvider.tsx` (1508 linhas) - NÃO USADO (confunde com EditorContext)
- ❌ `HeadlessEditorProvider.tsx` - SÓ EM TESTES
- ❌ `PureBuilderProvider.tsx` - NÃO USADO NO EDITOR PRINCIPAL

### Editores Obsoletos:
- ❌ `ModernUnifiedEditor.tsx` - COMENTADO NO APP.TSX
- ❌ `UnifiedEditor.tsx` - NUNCA USADO
- ❌ `ModularEditorPro.tsx` - SUBSTITUÍDO POR HybridModularEditorPro

### Hooks Conflitantes:
- ❌ `useUnifiedEditor` (múltiplas versões)
- ❌ `useHeadlessEditor` - NÃO USADO
- ❌ `useEditor` legacy - SUBSTITUÍDO

## 🎯 REGRA DE OURO

**SE VOCÊ QUER EDITAR ALGO NO EDITOR:**
1. Vá para `HybridModularEditorPro.tsx` (700 linhas)
2. Este é o ÚNICO editor em produção
3. Ele usa `EditorContext.tsx` como provider
4. API Panel já está ATIVO e funcionando

**NÃO TOQUE EM NADA COM "Unified" NO NOME** - São códigos mortos!

## 🧹 LIMPEZA NECESSÁRIA

1. Remover UnifiedEditorProvider.tsx
2. Remover EditorProvider.tsx (o pesado)
3. Remover ModernUnifiedEditor.tsx
4. Documentar apenas HybridModularEditorPro como editor oficial

## 📊 MÉTRICAS

- ✅ **1 Editor Real**: HybridModularEditorPro (700 linhas)
- ✅ **1 Provider Real**: EditorProvider do EditorContext (923 linhas)
- ❌ **20+ Arquivos Mortos**: Para remover
- ✅ **API Panel**: Funcionando e ativo