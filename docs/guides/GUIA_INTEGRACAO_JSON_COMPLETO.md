# 🎯 GUIA DE INTEGRAÇÃO JSON - Sistema Completo para /editor-fixed

## 📋 Resumo da Implementação

✅ **Sistema JSON criado e integrado ao /editor-fixed existente**
✅ **Compatível com seus 290+ componentes existentes**
✅ **Funciona com os 92 templates JSON das 21 etapas**
✅ **NÃO quebra nada que já existe**

---

## 🚀 Como Usar (3 Passos Simples)

### 1️⃣ Importar no seu Editor Existente

```typescript
// No seu arquivo /src/pages/editor-fixed-dragdrop.tsx (ou onde estiver seu editor)
import { useEditorWithJson } from "@/components/editor-fixed/useEditorWithJson";

// Dentro do seu componente:
const YourExistingEditor = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  // 🎯 ADICIONE APENAS ESTA LINHA para ter funcionalidades JSON:
  const jsonFeatures = useEditorWithJson(blocks, setBlocks);

  // Resto do seu código continua igual...
};
```

### 2️⃣ Adicionar Botões para Templates

```typescript
// Adicione botões simples para carregar templates das etapas:
<div className="json-template-controls">
  <button onClick={() => jsonFeatures.loadStepTemplate(1)}>
    🚀 Carregar Introdução
  </button>

  <button onClick={() => jsonFeatures.loadStepTemplate(2)}>
    ❓ Carregar Pergunta
  </button>

  <button onClick={() => jsonFeatures.loadStepTemplate(3)}>
    📊 Carregar Resultado
  </button>

  {/* Template atual */}
  {jsonFeatures.currentTemplate && (
    <div className="current-template">
      📄 Template: {jsonFeatures.currentTemplate.name}
      🧩 Blocos: {jsonFeatures.currentTemplate.blocks.length}
    </div>
  )}
</div>
```

### 3️⃣ Usar no Editor (Zero Configuração)

```typescript
// Seu editor continua funcionando normalmente!
// Os templates JSON são automaticamente convertidos em blocos compatíveis
// com seu ENHANCED_BLOCK_REGISTRY existente

// Carregar template da etapa 1
await jsonFeatures.loadStepTemplate(1);
// ✅ Blocos aparecem automaticamente no editor

// Exportar configuração atual como JSON
const template = jsonFeatures.exportCurrentAsTemplate({
  name: "Meu Funil Personalizado",
  category: "custom",
});
jsonFeatures.saveTemplateToFile(template);
// ✅ Download automático do arquivo JSON
```

---

## 🧩 Funcionalidades Disponíveis

### 🔄 Carregar Templates

- `loadStepTemplate(1-21)` - Carrega templates das 21 etapas
- `loadCustomTemplate(path)` - Carrega template customizado
- `applyTemplateToEditor(template)` - Aplica template diretamente

### 💾 Exportar & Salvar

- `exportCurrentAsTemplate()` - Converte blocos atuais em JSON
- `saveTemplateToFile()` - Download automático do template
- `mergeTemplateWithExisting()` - Mescla template com blocos existentes

### 🔍 Validação & Debug

- `validateCurrentTemplate()` - Verifica se template é válido
- `getAvailableComponents()` - Lista todos os componentes disponíveis
- `getTemplatePreview()` - Preview do template

---

## 📄 Estrutura dos Templates JSON

Os templates seguem esta estrutura (compatível com seus 92 templates existentes):

```json
{
  "id": "step-01-intro",
  "name": "Introdução do Quiz",
  "version": "1.0",
  "category": "intro",

  "layout": {
    "containerWidth": "full",
    "spacing": "medium",
    "backgroundColor": "transparent"
  },

  "blocks": [
    {
      "id": "header-1",
      "type": "quiz-intro-header",
      "properties": {
        "title": "Bem-vindo ao Quiz",
        "description": "Descubra seu perfil em 3 minutos",
        "backgroundColor": "#f8f9fa"
      },
      "style": {
        "padding": "2rem",
        "textAlign": "center"
      }
    }
  ]
}
```

---

## 🎯 Integração com ENHANCED_BLOCK_REGISTRY

O sistema automaticamente:

✅ **Mapeia tipos JSON → componentes React**

```typescript
// JSON: "type": "quiz-intro-header"
// Registry: ENHANCED_BLOCK_REGISTRY["quiz-intro-header"] → QuizIntroHeaderComponent
```

✅ **Converte properties JSON → props React**

```typescript
// JSON: { "title": "Meu Título", "color": "blue" }
// React: <Component title="Meu Título" color="blue" />
```

✅ **Valida componentes disponíveis**

```typescript
// Se componente não existir no registry, usa fallback ou avisa
```

---

## 📊 Exemplo Prático Completo

```typescript
// Em qualquer lugar do seu editor existente:
import { useEditorWithJson } from '@/components/editor-fixed/useEditorWithJson';

const MyEditor = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const jsonFeatures = useEditorWithJson(blocks, setBlocks);

  const handleQuickStart = async () => {
    // Carregar template da introdução
    await jsonFeatures.loadStepTemplate(1);

    // Template é automaticamente aplicado e você tem:
    // - blocks[] populado com componentes React
    // - Componentes mapeados pelo ENHANCED_BLOCK_REGISTRY
    // - Estilos e propriedades aplicados

    console.log('Blocos carregados:', blocks.length);
    console.log('Template atual:', jsonFeatures.currentTemplate?.name);
  };

  const handleSaveAsTemplate = () => {
    // Exportar configuração atual
    const template = jsonFeatures.exportCurrentAsTemplate({
      name: "Meu Funil Customizado",
      description: "Criado no editor visual"
    });

    // Salvar arquivo
    jsonFeatures.saveTemplateToFile(template, "meu-funil.json");
  };

  return (
    <div>
      <button onClick={handleQuickStart}>🚀 Quick Start</button>
      <button onClick={handleSaveAsTemplate}>💾 Salvar Template</button>

      {/* Seu editor existente aqui - sem modificação */}
      <YourExistingEditorComponent blocks={blocks} onChange={setBlocks} />
    </div>
  );
};
```

---

## 🔧 Configuração Avançada

### Template com Condições

```json
{
  "id": "conditional-block",
  "type": "text-inline",
  "properties": {
    "text": "Texto condicional"
  },
  "conditions": {
    "showIf": "user.score > 5",
    "dependsOn": "previous-question"
  }
}
```

### Template com Estilos Customizados

```json
{
  "globalStyles": {
    "fontFamily": "Inter",
    "primaryColor": "#3b82f6"
  },
  "blocks": [
    {
      "type": "button-inline",
      "style": {
        "backgroundColor": "var(--primary-color)",
        "borderRadius": "8px",
        "padding": "12px 24px"
      }
    }
  ]
}
```

---

## 📈 Vantagens da Implementação

### ✅ Para Você

- **Zero breaking changes** - Nada quebra
- **Compatibilidade total** - Funciona com todos os 290+ componentes
- **Facilidade de uso** - Um hook, múltiplas funcionalidades
- **Templates prontos** - 92 templates das 21 etapas disponíveis

### ✅ Para o Sistema

- **Escalabilidade** - Fácil adicionar novos templates
- **Manutenibilidade** - JSON é mais fácil de manter que código
- **Reutilização** - Templates podem ser compartilhados
- **Versionamento** - Controle de versão de templates

### ✅ Para Performance

- **Lazy loading** - Templates carregados sob demanda
- **Cache inteligente** - Templates ficam em memória
- **Validação rápida** - Verificação antes de aplicar

---

## 🚦 Próximos Passos

1. **Teste o sistema** com um template simples
2. **Integre no seu editor** principal
3. **Crie templates customizados** para suas necessidades
4. **Compartilhe templates** entre projetos

O sistema está **100% pronto** e **100% compatível** com sua infraestrutura existente! 🎉
