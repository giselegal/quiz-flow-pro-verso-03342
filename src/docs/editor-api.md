# 📚 API do Editor

## 🎯 Visão Geral

O editor é construído em uma arquitetura modular com os seguintes componentes principais:

### 🧩 Core Components

- `EditorProvider` - Provedor central de estado e contexto
- `EditorCanvas` - Área principal de edição
- `PropertiesPanel` - Painel de propriedades
- `ComponentsSidebar` - Sidebar com componentes disponíveis

### 📦 Block Components

Componentes base para construção do quiz:

- `TextBlock` - Texto formatável
- `QuestionBlock` - Perguntas do quiz
- `OptionsBlock` - Opções de resposta
- `ImageBlock` - Imagens e mídia
- `VideoBlock` - Vídeos incorporados
- `ButtonBlock` - Botões e CTAs

### 📐 Layout Components

Componentes para estruturação do layout:

- `GridBlock` - Sistema de grid
- `ContainerBlock` - Containers e seções
- `DividerBlock` - Divisores e separadores

### 🎯 Quiz Components

Componentes específicos para quiz:

- `QuizIntroHeader` - Cabeçalho do quiz
- `QuestionForm` - Formulário de perguntas
- `ResultsDisplay` - Exibição de resultados

### 🎨 UI Components

Componentes de interface:

- `ValidatedInput` - Inputs com validação
- `ValidatedSelect` - Selects com validação
- `ColorPicker` - Seletor de cores
- `ImageUploader` - Upload de imagens

### 🛠️ Utility Components

Componentes utilitários:

- `ErrorBoundary` - Tratamento de erros
- `LoadingSkeleton` - Loading states
- `ValidationFeedback` - Feedback de validação

## 🔧 Configuração

O editor pode ser configurado através do objeto `editorConfig`:

```typescript
import { editorConfig } from '@/config/editorConfig';

<EditorProvider config={editorConfig}>
  {/* ... */}
</EditorProvider>
```

## 📋 Exemplo de Uso

```typescript
import { EditorProvider, EditorCanvas, ComponentsSidebar, PropertiesPanel } from '@/components';

export default function Editor() {
  return (
    <EditorProvider>
      <div className="editor-layout">
        <ComponentsSidebar />
        <EditorCanvas />
        <PropertiesPanel />
      </div>
    </EditorProvider>
  );
}
```

## 🔄 Ciclo de Vida dos Blocos

1. **Criação**: Através do ComponentsSidebar
2. **Edição**: Via PropertiesPanel
3. **Atualização**: Gerenciada pelo EditorProvider
4. **Validação**: Sistema integrado de validação
5. **Persistência**: Auto-save e sincronização

## 🎯 Próximos Passos

1. Implementar sistema de plugins
2. Adicionar mais templates predefinidos
3. Melhorar validações em tempo real
4. Implementar undo/redo
5. Otimizar performance de renderização
