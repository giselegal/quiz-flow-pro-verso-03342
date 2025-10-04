# 🧩 Sistema Modular de Editor de Quiz

> **Sistema completamente modular para criação de funis de quiz com componentes independentes, editáveis e reutilizáveis.**

## 🎯 Visão Geral

O Sistema Modular é uma refatoração completa do editor de quiz, onde cada etapa do funil é composta por **componentes modulares independentes** que podem ser:

- ✅ **Editados individualmente** com propriedades específicas
- ✅ **Reordenados** via drag & drop
- ✅ **Duplicados** e reutilizados
- ✅ **Removidos** sem afetar outros componentes
- ✅ **Validados** automaticamente
- ✅ **Exportados/Importados** como dados estruturados

## 🏗️ Arquitetura

### 📁 Estrutura de Arquivos

```
src/components/editor/modular/
├── types.ts                    # 🎯 Tipos e interfaces
├── components.tsx              # 🧩 Componentes base (10 tipos)
├── factory.ts                  # 🏭 Factory + templates + utilitários
├── useModularEditor.ts         # 🎛️ Hook de gerenciamento de estado
├── drag-drop.tsx              # 🖱️ Sistema drag & drop com @dnd-kit
├── visual-editor.tsx          # 🎨 Renderizador visual + biblioteca
├── properties-panel.tsx       # 🎛️ Painel de propriedades dinâmico
├── ModularQuizEditor.tsx      # 🚀 Componente principal integrado
└── index.ts                   # 📦 Exportações centralizadas
```

### 🎭 Tipos de Componentes

| Tipo | Ícone | Descrição | Casos de Uso |
|------|-------|-----------|--------------|
| `title` | 📝 | Títulos com níveis H1-H6 | Cabeçalhos, pergunta principal |
| `text` | 📄 | Texto com formatação HTML | Descrições, instruções |
| `input` | 📥 | Campos de entrada | Captura de dados, formulários |
| `button` | 🔘 | Botões com ações | Navegação, submissão |
| `image` | 🖼️ | Imagens responsivas | Ilustrações, produtos |
| `options` | ☑️ | Opções single/multiple | Perguntas, choices |
| `spacer` | 📏 | Espaçadores invisíveis | Layout, espaçamento |
| `divider` | ➖ | Divisores visuais | Separação de seções |
| `help-text` | ❓ | Textos de ajuda | Tooltips, explicações |
| `progress-bar` | 📊 | Barras de progresso | Indicadores de etapa |

### 🏭 Templates Pré-definidos

#### 1. **Template Introdução** 🚀
```typescript
- 📝 Título: "Bem-vindo ao Quiz!"
- 📄 Texto: Descrição do quiz
- 📏 Espaçador: 32px
- 🔘 Botão: "Começar Quiz"
```

#### 2. **Template Pergunta** ❓
```typescript
- 📊 Barra de Progresso
- 📏 Espaçador: 24px  
- 📝 Título: Pergunta
- ☑️ Opções: Lista de choices
- 📏 Espaçador: 24px
- 🔘 Botão: "Próxima"
```

#### 3. **Template Captura** 📝
```typescript
- 📝 Título: "Conte-nos mais sobre você"
- 📄 Texto: Explicação
- 📥 Input: Nome
- 📥 Input: Email  
- 🔘 Botão: "Continuar"
```

#### 4. **Template Resultado** 🎉
```typescript
- 📝 Título: "Parabéns! Resultado pronto"
- 🖼️ Imagem: Visual do resultado
- 📄 Texto: Descrição do resultado
- 🔘 Botão: "Ver Detalhes"
```

## 🎛️ Como Usar

### 1. **Iniciando o Editor**

```tsx
import { ModularQuizEditor } from '@/components/editor/modular';

function App() {
  return (
    <ModularQuizEditor
      initialSteps={[]}
      onSave={(steps) => console.log('Salvando:', steps)}
      onPreview={(steps) => console.log('Preview:', steps)}
      onExport={(data) => console.log('Exportando:', data)}
    />
  );
}
```

### 2. **Usando o Hook de Estado**

```tsx
import { useModularEditor } from '@/components/editor/modular';

function CustomEditor() {
  const {
    state,
    currentStep,
    selectedComponent,
    stepActions,
    componentActions,
    editorActions
  } = useModularEditor();

  // Adicionar etapa
  const addIntroStep = () => {
    const step = createStepFromTemplate('intro-template');
    stepActions.addStep(step);
  };

  // Adicionar componente
  const addTitle = () => {
    if (currentStep) {
      componentActions.addComponent(currentStep.id, 'title');
    }
  };

  return (
    <div>
      <button onClick={addIntroStep}>Adicionar Introdução</button>
      <button onClick={addTitle}>Adicionar Título</button>
    </div>
  );
}
```

### 3. **Criando Componentes Customizados**

```tsx
import { componentFactory } from '@/components/editor/modular';

// Criar título personalizado
const customTitle = componentFactory.create('title', {
  text: 'Meu Título Personalizado',
  level: 'h1',
  color: '#ff6b6b',
  align: 'center'
});

// Criar pergunta com opções
const customQuestion = componentFactory.create('options', {
  title: 'Qual sua cor favorita?',
  options: [
    { id: '1', text: 'Azul', value: 'blue' },
    { id: '2', text: 'Verde', value: 'green' },
    { id: '3', text: 'Vermelho', value: 'red' }
  ],
  selectionType: 'single'
});
```

## 🎨 Layout e Interface

### 📐 Estrutura Visual

```
┌─────────────┬─────────────────────────────┬─────────────┐
│   SIDEBAR   │         CANVAS              │ PROPERTIES  │
│             │                             │   PANEL     │
│ 📋 Etapas   │  🎨 Editor Visual          │ ⚙️ Config   │
│ 🧩 Library  │     - Steps                │ 📝 Forms    │
│ 🔧 Controls │     - Components           │ 🎛️ Settings │
│             │     - Drag & Drop          │             │
└─────────────┴─────────────────────────────┴─────────────┘
```

### 🎛️ Controles Principais

| Controle | Função | Localização |
|----------|--------|-------------|
| `↶ ↷` | Undo/Redo | Toolbar superior |
| `👁️` | Preview Mode | Toolbar superior |
| `↕️` | Drag Mode | Toolbar superior |
| `+ Etapa` | Adicionar etapa | Sidebar |
| `+ Comp` | Adicionar componente | Canvas |
| `⚙️` | Propriedades | Painel direito |

## 🔧 Funcionalidades Avançadas

### 1. **Drag & Drop** 🖱️

- **Etapas**: Reordenar entre si
- **Componentes**: Reordenar dentro da etapa
- **Componentes entre etapas**: Mover componentes entre diferentes etapas
- **Preview visual**: Durante o arraste
- **Snap zones**: Zonas de drop destacadas

### 2. **Sistema de Validação** ✅

```typescript
// Validação automática de etapas
const validation = validateStep(step);
if (!validation.isValid) {
  console.log('Erros encontrados:', validation.errors);
}

// Validação em tempo real
const { isValid, validationErrors } = useModularEditor();
```

### 3. **Undo/Redo** ↶↷

- **Histórico completo** de todas as ações
- **Estados preservados** para navegação temporal
- **Limites configuráveis** para performance

### 4. **Export/Import** 📦

```typescript
// Exportar projeto
const exportData = utils.exportData();
// {
//   version: '1.0.0',
//   createdAt: '2024-01-15T10:30:00Z',
//   steps: [...],
//   metadata: { totalSteps: 5, totalComponents: 23 }
// }

// Importar projeto
utils.importData({ steps: importedSteps });
```

## 🚀 Rotas Disponíveis

| Rota | Descrição | Provider |
|------|-----------|----------|
| `/editor` | Editor modular novo | `UnifiedCRUDProvider` |
| `/editor/:id` | Editor com ID específico | `UnifiedCRUDProvider` |
| `/admin/funnels/:id/edit` | Editor integrado (antigo) | `UnifiedCRUDProvider` |

## 🎯 Vantagens do Sistema Modular

### ✅ **Para Desenvolvedores**
- **Código reutilizável** e componentizado
- **Tipagem completa** em TypeScript
- **Testes unitários** por componente
- **Documentação inline** completa
- **Performance otimizada** com lazy loading

### ✅ **Para Usuários**
- **Interface intuitiva** com drag & drop
- **Edição visual** em tempo real
- **Flexibilidade total** na composição
- **Templates pré-prontos** para agilidade
- **Validação automática** de erros

### ✅ **Para Negócio**
- **Escalabilidade** ilimitada de funis
- **Personalização** completa de campanhas
- **Reutilização** de componentes entre projetos
- **Manutenção** simplificada
- **Evolução** contínua do sistema

## 🔄 Migração do Sistema Antigo

O sistema modular **substitui completamente** o editor antigo, mas mantém **compatibilidade** com:

- ✅ **UnifiedCRUDProvider** para dados
- ✅ **OptimizedEditorProvider** para contexto
- ✅ **Estrutura de rotas** existente
- ✅ **Sistema de autenticação**
- ✅ **Providers de estado** global

---

## 🎉 **Sistema Modular Completo Implementado!**

> O novo editor modular oferece flexibilidade total na criação de funis de quiz, com componentes independentes, drag & drop intuitivo e interface profissional. Cada etapa é completamente customizável e os componentes podem ser reutilizados entre diferentes projetos.

**Acesse:** `/editor` para começar a usar o novo sistema! 🚀