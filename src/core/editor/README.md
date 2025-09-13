# 🎨 Sistema de Editor de Funil Desacoplado

## 📋 Visão Geral

O sistema de editor desacoplado permite criar, editar e gerenciar funis de forma completamente independente do contexto da aplicação. Ele oferece interfaces claras, implementações mock para testes, e componentes reutilizáveis que podem ser integrados em qualquer ambiente.

## 🏗️ Arquitetura

### Estrutura de Arquivos
```
src/core/editor/
├── interfaces/
│   └── EditorInterfaces.ts      # Definições de todas as interfaces
├── mocks/
│   └── EditorMocks.ts           # Implementações mock para testes
├── components/
│   ├── FunnelEditor.tsx         # Componente principal do editor
│   └── EditorComponents.tsx     # Componentes auxiliares
├── examples/
│   └── EditorExamples.tsx       # Exemplos de uso e integrações
└── __tests__/
    └── EditorTests.test.tsx     # Testes completos do sistema
```

### Principais Interfaces

#### `EditorFunnelData`
Define a estrutura completa de um funil no editor:
```typescript
interface EditorFunnelData {
  id: string;
  name: string;
  description: string;
  pages: EditorPageData[];
  settings: EditorFunnelSettings;
  metadata: EditorFunnelMetadata;
}
```

#### `EditorDataProvider`
Abstrai todas as operações de dados:
```typescript
interface EditorDataProvider {
  loadFunnel(id: string): Promise<EditorFunnelData | null>;
  saveFunnel(data: EditorFunnelData): Promise<EditorSaveResult>;
  listFunnels(options?: EditorListOptions): Promise<EditorFunnelSummary[]>;
  createFunnel(data: Partial<EditorFunnelData>): Promise<EditorFunnelData>;
  deleteFunnel(id: string): Promise<boolean>;
  duplicateFunnel(id: string, newName: string): Promise<EditorFunnelData>;
}
```

#### `EditorConfig`
Controla todos os aspectos do comportamento do editor:
```typescript
interface EditorConfig {
  mode: EditorMode;
  features: EditorFeatures;
  autoSave: EditorAutoSave;
  validation: EditorValidation;
  ui: EditorUIConfig;
}
```

## 🚀 Como Usar

### 1. Uso Básico com Dados Mock

```tsx
import React from 'react';
import { FunnelEditor } from '../components/FunnelEditor';
import { EditorMockProvider } from '../mocks/EditorMocks';

export const BasicEditorExample: React.FC = () => {
  const { dataProvider, validator, eventHandler } = EditorMockProvider.createFullMockSetup();

  return (
    <div className="h-screen">
      <FunnelEditor
        funnelId="my-funnel"
        dataProvider={dataProvider}
        validator={validator}
        eventHandler={eventHandler}
        onSave={(data) => console.log('Saved:', data)}
        onChange={(data) => console.log('Changed:', data)}
      />
    </div>
  );
};
```

### 2. Uso com Dados Iniciais

```tsx
export const InitialDataExample: React.FC = () => {
  const { dataProvider, utils } = EditorMockProvider.createMinimalMockSetup();

  const initialFunnel = utils.createEmptyFunnel('Meu Funil Personalizado');
  initialFunnel.pages = [
    utils.createEmptyPage('intro'),
    utils.createEmptyPage('questoes'),
    utils.createEmptyPage('resultado')
  ];

  return (
    <FunnelEditor
      initialData={initialFunnel}
      dataProvider={dataProvider}
      onSave={(data) => console.log('Custom funnel saved:', data)}
    />
  );
};
```

### 3. Configuração Personalizada

```tsx
export const CustomConfigExample: React.FC = () => {
  const { dataProvider } = EditorMockProvider.createMinimalMockSetup();

  const customConfig = {
    mode: 'edit' as const,
    features: {
      canAddPages: true,
      canRemovePages: true,
      canEditBlocks: true,
      canPreview: true,
      canPublish: false,
      canExport: true
    },
    autoSave: {
      enabled: true,
      interval: 15000, // 15 segundos
      onUserInput: true,
      showIndicator: true
    },
    ui: {
      theme: 'dark' as const,
      layout: 'sidebar' as const,
      showMinimap: true,
      showGridlines: true
    }
  };

  return (
    <FunnelEditor
      funnelId="custom-funnel"
      dataProvider={dataProvider}
      config={customConfig}
    />
  );
};
```

### 4. Hook Personalizado

```tsx
import { useEditor } from '../examples/EditorExamples';

export const HookExample: React.FC = () => {
  const { isReady, dataProvider, validator, eventHandler, config } = useEditor({
    provider: 'mock',
    config: {
      mode: 'edit',
      autoSave: { enabled: true, interval: 30000 }
    }
  });

  if (!isReady) {
    return <div>Carregando editor...</div>;
  }

  return (
    <FunnelEditor
      funnelId="hook-funnel"
      dataProvider={dataProvider}
      validator={validator}
      eventHandler={eventHandler}
      config={config}
    />
  );
};
```

## 🔧 Implementações de Provider

### Mock Provider (para testes e desenvolvimento)

O `EditorMockProvider` oferece implementações completas para todos os casos:

```typescript
// Setup completo com todas as funcionalidades
const { dataProvider, templateProvider, validator, eventHandler, utils } = 
  EditorMockProvider.createFullMockSetup();

// Setup mínimo apenas com data provider
const { dataProvider, utils } = EditorMockProvider.createMinimalMockSetup();

// Utilitários para criar dados
const funnel = utils.createEmptyFunnel('Meu Funil');
const page = utils.createEmptyPage('pagina-1');
const textBlock = utils.createTextBlock('Conteúdo do texto');
const questionBlock = utils.createQuestionBlock('Qual sua idade?', 'multiple-choice');
```

### Supabase Provider (exemplo de implementação real)

```typescript
import { SupabaseFunnelDataProvider } from '../examples/EditorExamples';

const supabaseProvider = new SupabaseFunnelDataProvider(supabaseClient);

// Usar como qualquer outro provider
<FunnelEditor
  funnelId="supabase-funnel"
  dataProvider={supabaseProvider}
  // ... outras props
/>
```

## ⚙️ Configurações

### Modos do Editor

- **`edit`**: Modo completo de edição com todas as funcionalidades
- **`preview`**: Visualização sem edição, mas com navegação
- **`readonly`**: Apenas visualização, sem interação

### Funcionalidades Configuráveis

```typescript
interface EditorFeatures {
  canAddPages: boolean;        // Pode adicionar páginas
  canRemovePages: boolean;     // Pode remover páginas
  canReorderPages: boolean;    // Pode reordenar páginas
  canEditBlocks: boolean;      // Pode editar blocos
  canPreview: boolean;         // Pode visualizar preview
  canPublish: boolean;         // Pode publicar funil
  canDuplicate: boolean;       // Pode duplicar funil
  canExport: boolean;          // Pode exportar funil
}
```

### Auto-Save

```typescript
interface EditorAutoSave {
  enabled: boolean;           // Habilita auto-save
  interval: number;           // Intervalo em ms (0 = desabilitado)
  onUserInput: boolean;       // Salva após input do usuário
  showIndicator: boolean;     // Mostra indicador de salvamento
}
```

### Validação

```typescript
interface EditorValidation {
  realTime: boolean;          // Validação em tempo real
  onSave: boolean;           // Validação ao salvar
  showWarnings: boolean;     // Mostra avisos não-críticos
  strictMode: boolean;       // Modo estrito (bloqueia salvamento com erros)
}
```

## 🧪 Testes

### Executar Testes

```bash
# Executar todos os testes do editor
npm test src/core/editor/__tests__/

# Executar testes específicos
npm test EditorTests.test.tsx

# Executar testes em watch mode
npm test EditorTests.test.tsx --watch
```

### Estrutura dos Testes

Os testes cobrem:
- ✅ Interfaces e conformidade de tipos
- ✅ Renderização com diferentes configurações
- ✅ Funcionalidades de CRUD (criar, ler, editar, deletar)
- ✅ Validação e tratamento de erros
- ✅ Auto-save e sincronização
- ✅ Performance com dados grandes
- ✅ Limpeza de recursos e memória

### Helpers de Teste

```typescript
import { createTestEditor } from '../__tests__/EditorTests.test';

// Criar editor para testes
const { props, mockSetup } = createTestEditor({
  config: { mode: 'readonly' }
});

// Usar em componentes de teste
render(<FunnelEditor {...props} />);
```

## 📚 Exemplos Avançados

### Editor Incorporado

```tsx
export const EmbeddedEditor: React.FC<{ funnelId: string }> = ({ funnelId }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 text-sm font-medium">
        Editor de Funil
      </div>
      
      <div className="h-96">
        <FunnelEditor
          funnelId={funnelId}
          dataProvider={/* seu provider */}
          config={{
            mode: 'edit',
            ui: {
              theme: 'light',
              layout: 'compact',
              showMinimap: false
            }
          }}
          onLoad={() => setIsLoaded(true)}
          onSave={(data) => console.log('Embedded save:', data)}
        />
      </div>
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div>Carregando editor...</div>
        </div>
      )}
    </div>
  );
};
```

### Multi-Editor

```tsx
export const MultiEditor: React.FC = () => {
  const [activeFunnel, setActiveFunnel] = React.useState<string | null>(null);
  const [funnels] = React.useState(['funnel-1', 'funnel-2', 'funnel-3']);

  return (
    <div className="flex h-screen">
      {/* Sidebar com lista de funis */}
      <div className="w-64 bg-gray-50 border-r">
        <div className="p-4">
          <h3 className="font-bold mb-3">Meus Funis</h3>
          {funnels.map(funnelId => (
            <button
              key={funnelId}
              onClick={() => setActiveFunnel(funnelId)}
              className={`block w-full text-left p-2 rounded mb-2 ${
                activeFunnel === funnelId 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {funnelId}
            </button>
          ))}
        </div>
      </div>

      {/* Editor principal */}
      <div className="flex-1">
        {activeFunnel ? (
          <FunnelEditor
            key={activeFunnel} // Force re-render quando muda funil
            funnelId={activeFunnel}
            dataProvider={/* seu provider */}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Selecione um funil para editar
          </div>
        )}
      </div>
    </div>
  );
};
```

## 🎯 Benefícios da Arquitetura

### ✅ **Desacoplamento Total**
- Editor não depende de contexto específico da aplicação
- Pode ser usado em qualquer ambiente React
- Interfaces claras definem contratos bem estabelecidos

### ✅ **Testabilidade Máxima**
- Mocks completos para todos os cenários
- Testes isolados sem dependências externas
- Cobertura abrangente de funcionalidades

### ✅ **Reusabilidade**
- Componente pode ser usado em múltiplos contextos
- Configuração flexível para diferentes necessidades
- Providers intercambiáveis (mock, Supabase, localStorage, etc.)

### ✅ **Manutenibilidade**
- Separação clara de responsabilidades
- Fácil extensão e modificação
- Documentação abrangente e exemplos práticos

### ✅ **Performance**
- Renderização eficiente mesmo com dados grandes
- Auto-save configurável e otimizado
- Limpeza adequada de recursos

## 🔮 Próximos Passos

1. **Implementar providers adicionais** (localStorage, IndexedDB)
2. **Expandir templates e blocos** disponíveis
3. **Adicionar funcionalidades avançadas** (histórico, colaboração)
4. **Melhorar acessibilidade** e UX
5. **Integrar com sistema de analytics** da aplicação

## 📞 Suporte

Para dúvidas ou problemas com o editor desacoplado:
1. Consulte os exemplos em `/examples/EditorExamples.tsx`
2. Execute os testes para validar comportamento
3. Verifique a documentação das interfaces
4. Use as implementações mock como referência
