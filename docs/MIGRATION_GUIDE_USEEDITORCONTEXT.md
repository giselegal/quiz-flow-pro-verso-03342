# 📘 GUIA DE MIGRAÇÃO: useEditorContext

**Versão**: 1.0.0  
**Data**: 26 de Novembro de 2025  
**Objetivo**: Migrar componentes de hooks individuais para `useEditorContext` unificado

---

## 🎯 VISÃO GERAL

Este guia ensina como migrar componentes que usam hooks individuais (`useAuth`, `useTheme`, `useNavigation`, etc.) para o hook unificado `useEditorContext`.

### Benefícios da Migração
✅ **Menos imports** - Um único import vs múltiplos  
✅ **API consistente** - Mesma interface em todos os componentes  
✅ **Type-safe** - TypeScript completo com autocomplete  
✅ **Performance** - Menos subscriptions a contextos  
✅ **Manutenibilidade** - Código mais fácil de entender e modificar

---

## 📋 PADRÕES DE MIGRAÇÃO

### 1. Auth Provider

#### ❌ ANTES
```typescript
import { useAuth } from '@/contexts/auth/AuthProvider';
// ou
import { useAuth } from '@/contexts';

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();
  
  return (
    <div>
      {user ? `Welcome ${user.email}` : 'Please login'}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### ✅ DEPOIS
```typescript
import { useEditorContext } from '@/core/hooks/useEditorContext';

function MyComponent() {
  const { auth } = useEditorContext();
  const { user, login, logout, isLoading } = auth;
  
  return (
    <div>
      {user ? `Welcome ${user.email}` : 'Please login'}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### 🎯 ALTERNATIVA (Destructuring direto)
```typescript
import { useEditorContext } from '@/core/hooks/useEditorContext';

function MyComponent() {
  const { auth: { user, login, logout, isLoading } } = useEditorContext();
  
  // Resto do código igual
}
```

---

### 2. Navigation Provider

#### ❌ ANTES
```typescript
import { useNavigation } from '@/contexts/navigation/NavigationProvider';

function MyComponent() {
  const { navigate, goBack, currentPath } = useNavigation();
  
  const handleClick = () => {
    navigate('/dashboard');
  };
  
  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

#### ✅ DEPOIS
```typescript
import { useEditorContext } from '@/core/hooks/useEditorContext';

function MyComponent() {
  const { navigation } = useEditorContext();
  const { navigate, goBack, currentPath } = navigation;
  
  const handleClick = () => {
    navigate('/dashboard');
  };
  
  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

---

### 3. Theme Provider

#### ❌ ANTES
```typescript
import { useTheme } from '@/contexts/theme/ThemeProvider';

function MyComponent() {
  const { theme, setTheme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

#### ✅ DEPOIS
```typescript
import { useEditorContext } from '@/core/hooks/useEditorContext';

function MyComponent() {
  const { theme } = useEditorContext();
  const { theme: currentTheme, setTheme, toggleTheme } = theme;
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {currentTheme}
    </button>
  );
}
```

**⚠️ ATENÇÃO**: O provider consolidado é `ux`, mas o alias `theme` funciona:
```typescript
// Ambos funcionam:
const { theme } = useEditorContext();  // Alias (recomendado para migração)
const { ux } = useEditorContext();     // Provider real (novo código)
```

---

### 4. Storage Provider

#### ❌ ANTES
```typescript
import { useStorage } from '@/contexts/storage/StorageProvider';

function MyComponent() {
  const { set, get, remove } = useStorage();
  
  const saveData = () => {
    set('user-preference', { darkMode: true });
  };
  
  return <button onClick={saveData}>Save Preference</button>;
}
```

#### ✅ DEPOIS
```typescript
import { useEditorContext } from '@/core/hooks/useEditorContext';

function MyComponent() {
  const { storage } = useEditorContext();
  const { set, get, remove } = storage;
  
  const saveData = () => {
    set('user-preference', { darkMode: true });
  };
  
  return <button onClick={saveData}>Save Preference</button>;
}
```

**ℹ️ NOTA**: `storage` é um alias de `authStorage` (provider consolidado).

---

### 5. Múltiplos Providers

#### ❌ ANTES
```typescript
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useNavigation } from '@/contexts/navigation/NavigationProvider';
import { useTheme } from '@/contexts/theme/ThemeProvider';

function ComplexComponent() {
  const { user, logout } = useAuth();
  const { navigate } = useNavigation();
  const { theme, toggleTheme } = useTheme();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <div className={theme}>
      <p>User: {user?.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

#### ✅ DEPOIS
```typescript
import { useEditorContext } from '@/core/hooks/useEditorContext';

function ComplexComponent() {
  const { auth, navigation, theme } = useEditorContext();
  const { user, logout } = auth;
  const { navigate } = navigation;
  const { theme: currentTheme, toggleTheme } = theme;
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <div className={currentTheme}>
      <p>User: {user?.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

**💡 VANTAGEM**: Um único import em vez de 3!

---

## 🗺️ MAPEAMENTO COMPLETO DE ALIASES

| Provider Antigo | Provider Consolidado | Alias Disponível |
|----------------|---------------------|------------------|
| `useAuth()` | `authStorage` | `auth` ✅ |
| `useStorage()` | `authStorage` | `storage` ✅ |
| `useSync()` | `realTime` | `sync` ✅ |
| `useCollaboration()` | `realTime` | `collaboration` ✅ |
| `useValidation()` | `validationResult` | `validation` ✅ |
| `useResult()` | `validationResult` | `result` ✅ |
| `useTheme()` | `ux` | `theme` ✅ |
| `useUI()` | `ux` | `ui` ✅ |
| `useNavigation()` | `ux` | `navigation` ✅ |

---

## ⚡ EXEMPLOS PRÁTICOS

### Exemplo 1: Componente de Login

```typescript
// ❌ ANTES
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useNavigation } from '@/contexts/navigation/NavigationProvider';

function LoginForm() {
  const { login, isLoading } = useAuth();
  const { navigate } = useNavigation();
  
  const handleSubmit = async (email: string, password: string) => {
    await login(email, password);
    navigate('/dashboard');
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}

// ✅ DEPOIS
import { useEditorContext } from '@/core/hooks/useEditorContext';

function LoginForm() {
  const { auth, navigation } = useEditorContext();
  const { login, isLoading } = auth;
  const { navigate } = navigation;
  
  const handleSubmit = async (email: string, password: string) => {
    await login(email, password);
    navigate('/dashboard');
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Exemplo 2: Protected Route

```typescript
// ❌ ANTES
import { useAuth } from '@/contexts/auth/AuthProvider';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
}

// ✅ DEPOIS
import { useEditorContext } from '@/core/hooks/useEditorContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { auth } = useEditorContext();
  const { user, isLoading } = auth;
  
  if (isLoading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
}
```

### Exemplo 3: Theme Toggle

```typescript
// ❌ ANTES
import { useTheme } from '@/contexts/theme/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}

// ✅ DEPOIS
import { useEditorContext } from '@/core/hooks/useEditorContext';
import { Moon, Sun } from 'lucide-react';

function ThemeToggle() {
  const { theme } = useEditorContext();
  const { theme: currentTheme, toggleTheme } = theme;
  
  return (
    <button onClick={toggleTheme}>
      {currentTheme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}
```

---

## 🔍 CHECKLIST DE MIGRAÇÃO

Para cada componente:

- [ ] **1. Identificar hooks usados**
  - Procurar por `useAuth()`, `useTheme()`, `useNavigation()`, etc.
  
- [ ] **2. Substituir imports**
  ```typescript
  // Remover:
  import { useAuth } from '@/contexts/auth/AuthProvider';
  
  // Adicionar:
  import { useEditorContext } from '@/core/hooks/useEditorContext';
  ```

- [ ] **3. Atualizar chamadas de hooks**
  ```typescript
  // De:
  const { user } = useAuth();
  
  // Para:
  const { auth } = useEditorContext();
  const { user } = auth;
  ```

- [ ] **4. Verificar TypeScript**
  - Garantir que não há erros de compilação
  - Autocomplete deve funcionar normalmente

- [ ] **5. Testar funcionalidade**
  - Verificar que o componente funciona como antes
  - Testar todas as ações (login, logout, navegação, etc.)

- [ ] **6. Commit**
  - Fazer commit das mudanças com mensagem descritiva

---

## ⚠️ CASOS ESPECIAIS

### ResultContext (NÃO MIGRAR)

❌ **NÃO** migre componentes que usam `useResult()` de `@/contexts/ResultContext`:

```typescript
// ❌ NÃO FAZER
import { useResult } from '@/contexts/ResultContext';

// Este é um contexto específico de quiz results
// que não foi consolidado no useEditorContext
```

**Motivo**: O `ResultContext` tem métodos específicos (`handleCTAClick`, `userProfile`, `styleConfig`) que não estão no provider consolidado `validationResult`.

**Componentes afetados**:
- `ResultMainBlock.tsx`
- `ResultStyleBlock.tsx`
- `ResultCTAPrimaryBlock.tsx`

### Theme Providers Externos

Componentes que usam providers de bibliotecas externas não devem ser migrados:

```typescript
// ❌ NÃO MIGRAR
import { useTheme } from 'next-themes';
import { useTheme } from '@/components/theme-provider';
```

**Exemplos**:
- `sonner.tsx` (usa `next-themes`)
- Alguns componentes de UI que têm seu próprio theme system

---

## 📊 MÉTRICAS DE SUCESSO

Após migração, você deve ver:

✅ **Menos imports** por arquivo  
✅ **0 erros TypeScript**  
✅ **Funcionalidade preservada**  
✅ **Autocomplete funcionando**  
✅ **Testes passando**

---

## 🆘 TROUBLESHOOTING

### Erro: "Property X does not exist"

**Causa**: Tentando acessar propriedade que não existe no alias.

**Solução**: Verificar o mapeamento de aliases acima e usar o correto.

```typescript
// ❌ Errado
const { theme } = useEditorContext();
const { user } = theme; // theme não tem user!

// ✅ Correto
const { auth } = useEditorContext();
const { user } = auth;
```

### Erro: "Cannot destructure property"

**Causa**: Hook sendo chamado condicionalmente ou em loop.

**Solução**: Chamar `useEditorContext` no topo do componente, sempre.

```typescript
// ❌ Errado
function MyComponent() {
  if (condition) {
    const { auth } = useEditorContext(); // Hooks não podem ser condicionais!
  }
}

// ✅ Correto
function MyComponent() {
  const { auth } = useEditorContext();
  
  if (condition) {
    // usar auth aqui
  }
}
```

---

## 📚 REFERÊNCIAS

- **Fase 2**: [FASE_2_CONSOLIDACAO_RELATORIO.md](../FASE_2_CONSOLIDACAO_RELATORIO.md)
- **Fase 3**: [FASE_3_CONSOLIDACAO_PROVIDERS.md](../FASE_3_CONSOLIDACAO_PROVIDERS.md)
- **Fase 4**: [FASE_4_MIGRACAO_COMPONENTES.md](../FASE_4_MIGRACAO_COMPONENTES.md)
- **Hook**: [useEditorContext.ts](../src/core/hooks/useEditorContext.ts)

---

**Última Atualização**: 26 de Novembro de 2025  
**Mantido por**: GitHub Copilot
