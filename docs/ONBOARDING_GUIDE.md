# 🚀 Guia de Onboarding - Quiz Quest Challenge Verse

> **Bem-vindo ao time!** Este guia vai te ajudar a começar a contribuir no projeto de forma eficiente e segura.

## 📋 Índice
1. [Setup Inicial](#setup-inicial)
2. [Primeira Contribuição](#primeira-contribuição)
3. [Arquitetura Overview](#arquitetura-overview)
4. [Workflows de Desenvolvimento](#workflows-de-desenvolvimento)
5. [Padrões e Convenções](#padrões-e-convenções)
6. [Debugging e Troubleshooting](#debugging-e-troubleshooting)
7. [Recursos e Documentação](#recursos-e-documentação)

---

## 🏗️ Setup Inicial

### **Passo 1: Ambiente de Desenvolvimento**

```bash
# 1. Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd quiz-quest-challenge-verse

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local

# 4. Execute o servidor de desenvolvimento
npm run dev
```

### **Passo 2: Configuração das Variáveis de Ambiente**

```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_ENV=development
VITE_DEBUG_EDITOR=true
VITE_ENABLE_ANALYTICS=false
```

> 💡 **Dica**: Consulte o arquivo [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) para detalhes completos sobre cada variável.

### **Passo 3: Verificação do Setup**

```bash
# Teste se tudo está funcionando
npm run test

# Verifique o linter
npm run lint

# Execute o build de produção
npm run build
```

### **Passo 4: Ferramentas de Desenvolvimento**

**Extensões VS Code Recomendadas:**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer

**Configuração do VS Code:**
```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 🎯 Primeira Contribuição

### **Tutorial Prático: Adicionando um Novo Tipo de Bloco**

**Objetivo**: Criar um bloco de "Countdown Timer" que pode ser usado nos funis.

#### **Etapa 1: Estrutura do Componente**

```bash
# Crie a estrutura de arquivos
mkdir -p src/components/blocks/countdown
touch src/components/blocks/countdown/CountdownBlock.tsx
touch src/components/blocks/countdown/CountdownBlock.test.tsx
touch src/components/blocks/countdown/index.ts
```

#### **Etapa 2: Implementação Básica**

```typescript
// src/components/blocks/countdown/CountdownBlock.tsx
import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';

interface CountdownBlockProps {
  blockId: string;
  data: {
    targetDate: string;
    title: string;
    expiredMessage: string;
    textColor: string;
    backgroundColor: string;
  };
  isPreview?: boolean;
}

export const CountdownBlock: React.FC<CountdownBlockProps> = ({
  blockId,
  data,
  isPreview = false
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);
  const { updateBlock } = useEditor();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(data.targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
        setIsExpired(false);
      } else {
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [data.targetDate]);

  // Modo de edição
  if (!isPreview) {
    return (
      <div className="p-4 border border-gray-300 rounded">
        <h3 className="text-lg font-semibold mb-4">⏰ Contador Regressivo</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => updateBlock(blockId, {
                properties: { ...data, title: e.target.value }
              })}
              className="w-full p-2 border rounded"
              placeholder="Digite o título..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Data/Hora de Destino</label>
            <input
              type="datetime-local"
              value={data.targetDate}
              onChange={(e) => updateBlock(blockId, {
                properties: { ...data, targetDate: e.target.value }
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Mensagem Expirado</label>
            <input
              type="text"
              value={data.expiredMessage}
              onChange={(e) => updateBlock(blockId, {
                properties: { ...data, expiredMessage: e.target.value }
              })}
              className="w-full p-2 border rounded"
              placeholder="Mensagem quando expirar..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Cor do Texto</label>
              <input
                type="color"
                value={data.textColor}
                onChange={(e) => updateBlock(blockId, {
                  properties: { ...data, textColor: e.target.value }
                })}
                className="w-full h-10 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Cor de Fundo</label>
              <input
                type="color"
                value={data.backgroundColor}
                onChange={(e) => updateBlock(blockId, {
                  properties: { ...data, backgroundColor: e.target.value }
                })}
                className="w-full h-10 border rounded"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modo de visualização
  return (
    <div 
      className="text-center p-6 rounded-lg"
      style={{ 
        color: data.textColor, 
        backgroundColor: data.backgroundColor 
      }}
    >
      <h2 className="text-2xl font-bold mb-6">{data.title}</h2>
      
      {isExpired ? (
        <div className="text-xl font-semibold">
          {data.expiredMessage}
        </div>
      ) : (
        <div className="flex justify-center gap-4">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="text-center">
              <div className="text-4xl font-bold">{value.toString().padStart(2, '0')}</div>
              <div className="text-sm uppercase">{unit}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountdownBlock;
```

#### **Etapa 3: Registrar o Bloco**

```typescript
// src/components/blocks/countdown/index.ts
export { CountdownBlock } from './CountdownBlock';

// Factory function
export const createCountdownBlock = () => ({
  id: `countdown-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type: 'countdown',
  properties: {
    targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, -8), // +24h
    title: 'Oferta Limitada!',
    expiredMessage: 'Oferta Expirada!',
    textColor: '#ffffff',
    backgroundColor: '#3b82f6'
  }
});
```

#### **Etapa 4: Registrar no Sistema**

```typescript
// src/components/editor/BlockRegistry.ts (ou arquivo similar)
import { CountdownBlock, createCountdownBlock } from '../blocks/countdown';

export const BLOCK_TYPES = {
  // ... outros blocos
  countdown: {
    component: CountdownBlock,
    factory: createCountdownBlock,
    displayName: 'Contador Regressivo',
    category: 'engagement',
    icon: '⏰',
    description: 'Contador regressivo personalizável'
  }
};
```

#### **Etapa 5: Teste**

```typescript
// src/components/blocks/countdown/CountdownBlock.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CountdownBlock } from './CountdownBlock';

// Mock do contexto
const mockUpdateBlock = jest.fn();
jest.mock('@/context/EditorContext', () => ({
  useEditor: () => ({ updateBlock: mockUpdateBlock })
}));

describe('CountdownBlock', () => {
  const defaultProps = {
    blockId: 'test-countdown',
    data: {
      targetDate: new Date(Date.now() + 60000).toISOString(), // +1 minuto
      title: 'Test Countdown',
      expiredMessage: 'Expired!',
      textColor: '#000000',
      backgroundColor: '#ffffff'
    }
  };

  it('renders countdown timer', () => {
    render(<CountdownBlock {...defaultProps} isPreview />);
    
    expect(screen.getByText('Test Countdown')).toBeInTheDocument();
    expect(screen.getByText('00')).toBeInTheDocument(); // segundos
  });

  it('shows expired message when time is up', () => {
    const expiredProps = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        targetDate: new Date(Date.now() - 60000).toISOString() // -1 minuto
      }
    };

    render(<CountdownBlock {...expiredProps} isPreview />);
    
    expect(screen.getByText('Expired!')).toBeInTheDocument();
  });

  it('renders edit mode correctly', () => {
    render(<CountdownBlock {...defaultProps} isPreview={false} />);
    
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Data/Hora de Destino')).toBeInTheDocument();
  });
});
```

#### **Etapa 6: Commit e Pull Request**

```bash
# Adicione os arquivos
git add .

# Faça um commit descritivo
git commit -m "feat: adicionar bloco de contador regressivo

- Implementa CountdownBlock com timer em tempo real
- Suporte a personalização de cores e mensagens
- Inclui modo de edição e preview
- Adiciona testes unitários
- Registra no sistema de blocos

Closes #123"

# Push para sua branch
git push origin feature/countdown-block

# Abra um Pull Request no GitHub
```

---

## 🏛️ Arquitetura Overview

### **Diagrama de Alto Nível**

```
Quiz Quest Challenge Verse
├── 🎨 Presentation Layer
│   ├── React Components (UI)
│   ├── Custom Hooks
│   └── Pages/Routes
├── 🧠 Business Logic Layer  
│   ├── Context Providers
│   ├── Custom Hooks
│   └── Services
├── 💾 Data Layer
│   ├── Local Storage
│   ├── IndexedDB (AdvancedStorage)
│   └── External APIs (Supabase)
└── 🛠️ Infrastructure
    ├── Build Tools (Vite)
    ├── Testing (Vitest)
    └── Deployment
```

### **Fluxo de Dados Principais**

```
User Interaction
     ↓
React Components
     ↓
Custom Hooks
     ↓
Context Providers
     ↓
Services/APIs
     ↓
Storage Systems
```

### **Contexts Principais**

| Context | Responsabilidade | Quando Usar |
|---------|-----------------|-------------|
| `EditorContext` | Estado do editor, blocos, etapas | Componentes do editor |
| `UnifiedFunnelContext` | Dados dos funis, CRUD | Funcionalidades de funis |
| `Quiz21StepsContext` | Navegação 21 etapas | Sistema de quiz |
| `ThemeContext` | Temas e estilos | Componentes de UI |

> 📖 **Saiba mais**: Leia o [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md) para detalhes completos.

---

## 🔄 Workflows de Desenvolvimento

### **Workflow Padrão de Feature**

```bash
# 1. Criar branch da feature
git checkout main
git pull origin main
git checkout -b feature/nome-da-feature

# 2. Desenvolver com commits pequenos
git add .
git commit -m "feat: implementar componente base"
git commit -m "test: adicionar testes unitários"
git commit -m "docs: atualizar documentação"

# 3. Testar localmente
npm run test
npm run lint
npm run build

# 4. Push e Pull Request
git push origin feature/nome-da-feature
# Abrir PR no GitHub

# 5. Após aprovação e merge
git checkout main
git pull origin main
git branch -d feature/nome-da-feature
```

### **Workflow de Hotfix**

```bash
# 1. Branch de hotfix
git checkout main
git pull origin main
git checkout -b hotfix/descricao-do-problema

# 2. Fix mínimo e direto
# ... fazer correção

# 3. Teste e commit
npm run test
git add .
git commit -m "fix: corrigir problema crítico X"

# 4. PR direto para main
git push origin hotfix/descricao-do-problema
# PR com revisão expedita
```

### **Debugging de Desenvolvimento**

```bash
# Habilitar debug verbose
export VITE_DEBUG_EDITOR=true
export VITE_LOG_LEVEL=debug

# Rodar com logs detalhados
npm run dev

# Limpar cache se necessário
rm -rf node_modules/.vite
npm run dev
```

---

## 📏 Padrões e Convenções

### **Estrutura de Arquivos**

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes básicos (Button, Input)
│   ├── blocks/         # Blocos do editor
│   ├── editor/         # Componentes do editor
│   └── layout/         # Componentes de layout
├── context/            # Context providers
├── hooks/              # Custom hooks
├── services/           # Lógica de negócio
├── utils/              # Utilitários
├── types/              # TypeScript types
└── __tests__/          # Testes
```

### **Nomenclatura**

**Componentes:**
- `PascalCase` para componentes: `CountdownBlock`, `EditorToolbar`
- `camelCase` para props: `isVisible`, `onValueChange`
- `kebab-case` para IDs e classes: `countdown-block`, `editor-toolbar`

**Hooks:**
- Prefixo `use`: `useEditor`, `useCountdown`, `useLocalStorage`

**Types/Interfaces:**
- Sufixo `Props` para props: `CountdownBlockProps`
- Sufixo `Data` para dados: `FunnelData`, `BlockData`
- Prefixo `I` para interfaces genéricas: `IStorageProvider`

### **Padrões de Código**

**1. Estrutura de Componente:**

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';

// 2. Types/Interfaces
interface ComponentProps {
  // props aqui
}

// 3. Componente principal
export const Component: React.FC<ComponentProps> = ({
  // destructure props
}) => {
  // 4. Estados
  const [state, setState] = useState();
  
  // 5. Contextos/Hooks
  const { data, actions } = useEditor();
  
  // 6. Effects
  useEffect(() => {
    // efeitos aqui
  }, []);
  
  // 7. Handlers
  const handleAction = () => {
    // lógica aqui
  };
  
  // 8. Early returns
  if (!data) return <div>Loading...</div>;
  
  // 9. Render principal
  return (
    <div>
      {/* JSX aqui */}
    </div>
  );
};

// 10. Default export
export default Component;
```

**2. Padrão de Custom Hook:**

```typescript
export const useCustomHook = (param?: string) => {
  const [state, setState] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Lógica do hook
  
  return {
    // Estado
    state,
    loading,
    error,
    
    // Ações
    actions: {
      doSomething: () => {},
      reset: () => setState(undefined)
    }
  };
};
```

### **Tratamento de Erros**

```typescript
// 1. Error Boundaries para componentes
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>

// 2. Try-catch em funções async
const handleAsyncAction = async () => {
  try {
    setLoading(true);
    const result = await someAsyncOperation();
    setState(result);
  } catch (error) {
    setError(error.message);
    console.error('Erro na operação:', error);
  } finally {
    setLoading(false);
  }
};

// 3. Validação de dados
const validateData = (data: unknown): data is ExpectedType => {
  return data && typeof data === 'object' && 'requiredField' in data;
};
```

---

## 🐛 Debugging e Troubleshooting

### **Problemas Comuns e Soluções**

**1. Context não encontrado:**
```typescript
// ❌ Erro comum
const { data } = useContext(SomeContext); // Pode retornar undefined

// ✅ Solução
const { data } = useContext(SomeContext);
if (!data) {
  throw new Error('useContext deve ser usado dentro do Provider apropriado');
}
```

**2. State não atualizando:**
```typescript
// ❌ Mutação direta
state.push(newItem); // Não re-renderiza

// ✅ Imutável
setState(prevState => [...prevState, newItem]);
```

**3. Dependências useEffect:**
```typescript
// ❌ Dependência faltando
useEffect(() => {
  doSomething(data);
}, []); // data deveria estar nas dependências

// ✅ Dependências corretas
useEffect(() => {
  doSomething(data);
}, [data]);
```

### **Ferramentas de Debug**

**Console Debugging:**
```typescript
// Debug condicional
if (process.env.VITE_DEBUG_EDITOR === 'true') {
  console.log('Estado atual:', state);
  console.trace('Stack trace');
}

// Debug com contexto
const debug = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`[${new Date().toISOString()}] ${message}`, data);
  }
};
```

**React DevTools:**
- Componentes → Props, State, Hooks
- Profiler → Performance
- Context → Valores atuais

### **Logs Estruturados**

```typescript
// utils/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`ℹ️ ${message}`, meta);
  },
  
  warn: (message: string, meta?: any) => {
    console.warn(`⚠️ ${message}`, meta);
  },
  
  error: (message: string, error?: Error) => {
    console.error(`❌ ${message}`, error);
    
    // Enviar para serviço de monitoramento em produção
    if (import.meta.env.PROD && window.gtag) {
      window.gtag('event', 'exception', {
        description: message,
        fatal: false
      });
    }
  }
};
```

---

## 📚 Recursos e Documentação

### **Documentação Interna**

| Documento | Conteúdo | Quando Consultar |
|-----------|----------|------------------|
| [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md) | Arquitetura completa | Entender o sistema |
| [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) | Configuração de ambiente | Setup e deploy |
| [FALLBACK_FLOWS.md](./FALLBACK_FLOWS.md) | Fluxos de fallback | Tratar erros |
| [PRACTICAL_EXAMPLES.md](./PRACTICAL_EXAMPLES.md) | Exemplos de código | Implementar features |

### **Recursos Externos**

**React/TypeScript:**
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

**Ferramentas:**
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev/)

### **Comunidade e Suporte**

**Onde Buscar Ajuda:**
1. 📖 Documentação interna primeiro
2. 🔍 Issues no GitHub do projeto
3. 💬 Chat da equipe
4. 🌍 Comunidades React/TypeScript

**Como Pedir Ajuda:**
```markdown
## 🆘 Template de Pedido de Ajuda

**Problema:** 
Descreva o que está tentando fazer e o que não está funcionando.

**Código:**
```typescript
// Cole o código relevante aqui
```

**Erro:**
```
Cole mensagens de erro ou comportamento inesperado
```

**Contexto:**
- Branch: feature/minha-feature
- Node: v18.17.0
- Navegador: Chrome 115

**Tentativas:**
- O que já tentou resolver
- Documentação consultada
```

### **Próximos Passos Sugeridos**

**Semana 1:**
- [ ] Configurar ambiente local
- [ ] Executar todos os testes
- [ ] Fazer o tutorial da primeira contribuição
- [ ] Ler documentação de arquitetura

**Semana 2:**
- [ ] Implementar uma pequena feature
- [ ] Fazer review de PRs existentes
- [ ] Explorar codebase
- [ ] Configurar ferramentas de debug

**Mês 1:**
- [ ] Contribuir com features significativas
- [ ] Propor melhorias na documentação
- [ ] Ajudar outros novos membros
- [ ] Participar de discussões arquiteturais

---

## 🎉 Bem-vindo à equipe!

Agora você está pronto para começar a contribuir com o Quiz Quest Challenge Verse. Lembre-se:

- ❓ **Pergunte sempre que tiver dúvidas**
- 📖 **Consulte a documentação regularmente**
- 🧪 **Teste tudo antes de enviar**
- 💡 **Contribua com ideias e melhorias**
- 🤝 **Colabore e ajude outros membros**

**Happy coding!** 🚀
