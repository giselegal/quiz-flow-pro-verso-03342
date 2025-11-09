# 🏗️ ARQUITETURA DE TEMPLATES - HIERARQUIA COMPLETA

## 📊 Camadas de Templates (Do Editor → Runtime)

```
┌─────────────────────────────────────────────────────────────┐
│ 🎨 CAMADA 1: EDITOR (Fonte Editável)                       │
├─────────────────────────────────────────────────────────────┤
│ public/templates/quiz21-complete.json                       │
│ ↳ JSON MASTER - Fonte única de verdade                     │
│ ↳ Editável manualmente                                     │
│ ↳ 3957 linhas                                              │
│ ↳ Usado por: Editor, Build scripts, Runtime fallback       │
└─────────────────────────────────────────────────────────────┘
                            ↓
                      [Build Script]
                  npm run build:templates
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ ⚡ CAMADA 2: RUNTIME OTIMIZADO (TypeScript)                │
├─────────────────────────────────────────────────────────────┤
│ src/templates/quiz21StepsComplete.ts                        │
│ ↳ Gerado automaticamente do JSON                           │
│ ↳ ⚠️ NÃO EDITAR MANUALMENTE!                               │
│ ↳ Named export: QUIZ_STYLE_21_STEPS_TEMPLATE               │
│ ↳ Cache em memória otimizado                               │
│ ↳ Sem overhead de parsing JSON                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
                   [Runtime Loading]
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 🎯 CAMADA 3: CARREGAMENTO HIERÁRQUICO                      │
├─────────────────────────────────────────────────────────────┤
│ HierarchicalTemplateSource (src/services/core/)             │
│                                                             │
│ Prioridades:                                                │
│ 1. USER_EDIT      → Supabase edits                         │
│ 2. ADMIN_OVERRIDE → Supabase template_overrides (disabled) │
│ 3. TEMPLATE_DEFAULT → .ts primeiro, depois .json           │
│ 4. FALLBACK       → Registry hardcoded                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 🖼️ CAMADA 4: RENDERIZAÇÃO                                  │
├─────────────────────────────────────────────────────────────┤
│ UniversalBlockRenderer                                      │
│ ↳ Recebe Block[]                                           │
│ ↳ Resolve componente via UnifiedBlockRegistry              │
│ ↳ Normaliza props via PropNormalizer                       │
│ ↳ Renderiza React component                                │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Edição

### ✏️ Para EDITAR templates:

1. **Edite o JSON master**:
   ```bash
   public/templates/quiz21-complete.json
   ```

2. **Rebuild do .ts**:
   ```bash
   npm run build:templates
   ```

3. **Commit AMBOS**:
   ```bash
   git add public/templates/quiz21-complete.json
   git add src/templates/quiz21StepsComplete.ts
   git commit -m "feat: update template data"
   ```

### 🚫 NÃO FAZER:

- ❌ Editar `quiz21StepsComplete.ts` diretamente
- ❌ Confiar apenas no .json em produção (performance)
- ❌ Esquecer de rodar build:templates após editar JSON

## 📂 Arquivos Individuais (Legacy)

```
public/templates/
├── quiz21-complete.json     ← MASTER (fonte única)
├── step-01-v3.json          ← Gerado do master
├── step-02-v3.json          ← Gerado do master
├── ...
└── step-21-v3.json          ← Gerado do master
```

**Status**: Usados como fallback se master falhar

## 🎯 RESPOSTA À SUA PERGUNTA

> "o funil/template não deveria ser editado por json?"

✅ **SIM! Você está 100% correto!**

- **Fonte de edição**: `public/templates/quiz21-complete.json`
- **Fonte de runtime**: `src/templates/quiz21StepsComplete.ts` (gerado)

A confusão acontece porque:
1. O **editor** lê do `.json`
2. O **runtime** usa `.ts` (performance)
3. São **sincronizados** via build script

## 🔍 Por que .ts E .json?

| Aspecto | JSON | TypeScript |
|---------|------|------------|
| **Edição** | ✅ Fácil | ❌ Código gerado |
| **Runtime** | ⚠️ Parse overhead | ✅ Zero overhead |
| **Type Safety** | ❌ Nenhuma | ✅ Full typing |
| **Cache** | ⚠️ Manual | ✅ Automático |
| **Versionamento** | ✅ Git friendly | ✅ Git friendly |

## 🐛 Debug do question-hero-05

Agora que entendemos a arquitetura, o problema pode ser:

### ❓ Possibilidade 1: JSON → .ts dessincronia
```bash
# Verificar se .ts está atualizado
git status public/templates/quiz21-complete.json
git status src/templates/quiz21StepsComplete.ts

# Rebuildar se necessário
npm run build:templates
```

### ❓ Possibilidade 2: Editor lê .json mas Canvas usa .ts
- Editor pode estar lendo JSON desatualizado
- Canvas renderiza do .ts gerado
- **Solução**: Garantir ambos sincronizados

### ❓ Possibilidade 3: Cache do HierarchicalSource
- Prioridade pode estar pegando fonte errada
- **Solução**: Verificar logs de `[HierarchicalSource]`

## 🧪 Teste para Verificar Sincronia

```typescript
// Rodar: npm test -- template-sync.test.ts
describe('JSON <-> TS Sync', () => {
  it('deve ter mesmos dados em ambos', async () => {
    const jsonData = await fetch('/templates/quiz21-complete.json');
    const jsonTemplate = await jsonData.json();
    
    const tsTemplate = QUIZ_STYLE_21_STEPS_TEMPLATE;
    
    // Comparar step-05, question-hero-05
    const jsonBlock = jsonTemplate.steps['step-05'].blocks
      .find(b => b.id === 'question-hero-05');
    
    const tsBlock = tsTemplate['step-05']
      .find(b => b.id === 'question-hero-05');
    
    expect(jsonBlock).toEqual(tsBlock);
  });
});
```

## 🎯 Ação Imediata

1. **Verificar sincronia**:
   ```bash
   npm run build:templates
   ```

2. **Recarregar página** com cache limpo (Ctrl+Shift+R)

3. **Verificar logs** do HierarchicalSource para ver qual fonte está sendo usada
