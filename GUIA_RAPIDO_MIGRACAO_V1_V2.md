# 🚀 GUIA RÁPIDO DE MIGRAÇÃO V1 → V2

**Para**: Desenvolvedores implementando migração  
**Tempo**: 5-10 minutos por arquivo  
**Dificuldade**: ⭐⭐ Média

---

## 📋 CHECKLIST POR ARQUIVO

### 1. Identificar Imports V1
```typescript
// ❌ V1 (remover)
import { useSuperUnified } from '@/contexts/providers/SuperUnifiedProvider';
```

### 2. Substituir por Hooks Individuais
```typescript
// ✅ V2 (adicionar)
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useTheme } from '@/contexts/theme/ThemeProvider';
import { useEditorState } from '@/contexts/editor/EditorStateProvider';
// ... outros conforme necessário
```

### 3. Atualizar Uso no Componente
```typescript
// ❌ ANTES (V1)
const { auth, theme, editor } = useSuperUnified();

// ✅ DEPOIS (V2)
const auth = useAuth();
const theme = useTheme();
const editor = useEditorState();
```

### 4. Atualizar Provider no Root (se aplicável)
```typescript
// ❌ ANTES (V1)
<SuperUnifiedProvider>
  <App />
</SuperUnifiedProvider>

// ✅ DEPOIS (V2)
<SuperUnifiedProvider> {/* V2 */}
  <App />
</SuperUnifiedProvider>
```

### 5. Testar
```bash
npm run dev
npm run check:architecture
```

---

## 🎯 MIGRAÇÃO POR CASO DE USO

### Caso 1: Apenas Auth
```typescript
// ANTES
import { useSuperUnified } from '@/contexts/providers/SuperUnifiedProvider';
const { auth } = useSuperUnified();

// DEPOIS
import { useAuth } from '@/contexts/auth/AuthProvider';
const auth = useAuth();
```

### Caso 2: Auth + Theme
```typescript
// ANTES
import { useSuperUnified } from '@/contexts/providers/SuperUnifiedProvider';
const { auth, theme } = useSuperUnified();

// DEPOIS
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useTheme } from '@/contexts/theme/ThemeProvider';
const auth = useAuth();
const theme = useTheme();
```

### Caso 3: Editor Complexo
```typescript
// ANTES
import { useSuperUnified } from '@/contexts/providers/SuperUnifiedProvider';
const { editor, funnel, navigation } = useSuperUnified();

// DEPOIS
import { useEditorState } from '@/contexts/editor/EditorStateProvider';
import { useFunnelData } from '@/contexts/funnel/FunnelDataProvider';
import { useNavigation } from '@/contexts/navigation/NavigationProvider';
const editor = useEditorState();
const funnel = useFunnelData();
const navigation = useNavigation();
```

### Caso 4: Migração Gradual (Bridge)
```typescript
// DURANTE MIGRAÇÃO (temporário)
import { useLegacySuperUnified } from '@/hooks/useLegacySuperUnified';
const { auth, theme, editor } = useLegacySuperUnified();
// Funciona como V1 mas usa V2 por baixo

// MIGRAR DEPOIS para hooks individuais
```

---

## 📚 MAPA DE HOOKS V1 → V2

| V1 (useSuperUnified) | V2 (Hook Individual) | Import |
|---------------------|---------------------|--------|
| `auth` | `useAuth()` | `@/contexts/auth/AuthProvider` |
| `theme` | `useTheme()` | `@/contexts/theme/ThemeProvider` |
| `editor` | `useEditorState()` | `@/contexts/editor/EditorStateProvider` |
| `funnel` | `useFunnelData()` | `@/contexts/funnel/FunnelDataProvider` |
| `navigation` | `useNavigation()` | `@/contexts/navigation/NavigationProvider` |
| `quiz` | `useQuizState()` | `@/contexts/quiz/QuizStateProvider` |
| `result` | `useResult()` | `@/contexts/result/ResultProvider` |
| `storage` | `useStorage()` | `@/contexts/storage/StorageProvider` |
| `sync` | `useSync()` | `@/contexts/sync/SyncProvider` |
| `validation` | `useValidation()` | `@/contexts/validation/ValidationProvider` |
| `collaboration` | `useCollaboration()` | `@/contexts/collaboration/CollaborationProvider` |
| `versioning` | `useVersioning()` | `@/contexts/versioning/VersioningProvider` |

---

## 🔧 FERRAMENTAS

### Script de Verificação
```bash
# Ver progresso da migração
npm run check:architecture

# Saída esperada:
# V1: 21 arquivos → 0 arquivos
# V2: 1 arquivo → 22 arquivos
# Progresso: 4.5% → 100%
```

### Buscar Arquivos V1
```bash
# Listar todos arquivos ainda usando V1
grep -r "from.*SuperUnifiedProvider['\"]" src --include="*.ts" --include="*.tsx" | grep -v ".test." | cut -d: -f1 | sort -u
```

### Validar Após Migração
```bash
# Build deve passar
npm run build

# Testes devem passar
npm run test

# Type-check deve passar
npm run type-check
```

---

## ⚠️ ARMADILHAS COMUNS

### 1. Esquecer de Adicionar Imports
```typescript
// ❌ ERRO
const auth = useAuth(); // useAuth is not defined

// ✅ CORRETO
import { useAuth } from '@/contexts/auth/AuthProvider';
const auth = useAuth();
```

### 2. Importar do Lugar Errado
```typescript
// ❌ ERRO (V1)
import { useAuth } from '@/contexts/providers/SuperUnifiedProvider';

// ✅ CORRETO (V2)
import { useAuth } from '@/contexts/auth/AuthProvider';
```

### 3. Não Atualizar Destructuring
```typescript
// ❌ ERRO
const { auth, theme } = useAuth(); // useAuth não retorna objeto

// ✅ CORRETO
const auth = useAuth();
const theme = useTheme();
```

### 4. Provider Não Envolvendo Componente
```typescript
// ❌ ERRO
<App />
const auth = useAuth(); // Error: must be within AuthProvider

// ✅ CORRETO
<SuperUnifiedProviderV2>
  <App />
</SuperUnifiedProviderV2>
```

---

## 📊 PROGRESSO

### Como Acompanhar
Execute periodicamente:
```bash
npm run check:architecture
```

### Métricas de Sucesso
- [ ] V1 imports: 21 → 0
- [ ] V2 imports: 1 → 20+
- [ ] Progresso: 4.5% → 100%
- [ ] Build: ✅ Passa
- [ ] Testes: ✅ Todos passam
- [ ] Providers órfãos: 0/12

---

## 🆘 PROBLEMAS COMUNS

### "Hook must be within Provider"
**Causa**: Componente não está dentro do SuperUnifiedProviderV2

**Solução**: 
```typescript
// Em App.tsx ou root
import { SuperUnifiedProvider } from '@/contexts/providers/SuperUnifiedProviderV2';

<SuperUnifiedProvider>
  <YourApp />
</SuperUnifiedProvider>
```

### "Module not found"
**Causa**: Import path incorreto

**Solução**: Verificar path exato:
```bash
ls src/contexts/auth/AuthProvider.tsx
```

### Build falha após migração
**Causa**: Type errors ou imports circulares

**Solução**:
```bash
npm run type-check
npm run lint
```

---

## 📚 REFERÊNCIAS COMPLETAS

- **Análise Técnica**: `ANALISE_ESTRUTURAS_DUPLICADAS.md`
- **Plano Completo**: `CHECKLIST_RESOLUCAO_DUPLICACOES.md`
- **Resumo Executivo**: `SUMARIO_EXECUTIVO_DUPLICACOES.md`
- **Hook de Bridge**: `src/hooks/useLegacySuperUnified.ts`

---

## 💡 DICA PRO

Use search & replace no VS Code:

**Buscar**:
```regex
import \{ useSuperUnified \} from '@/contexts/providers/SuperUnifiedProvider';
```

**Substituir por**:
```typescript
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useTheme } from '@/contexts/theme/ThemeProvider';
// Adicionar outros conforme necessário
```

Depois ajustar o destructuring manualmente em cada arquivo.

---

**Atualizado**: 21 de Novembro de 2025  
**Próxima revisão**: Após 50% de progresso
