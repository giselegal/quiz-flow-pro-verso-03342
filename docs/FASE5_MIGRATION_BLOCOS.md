# 📦 FASE 5: Migração de Blocos para Schemas JSON

## Status: ✅ Implementado (Parcial)

### Objetivo
Migrar blocos hardcoded do editor para schemas JSON dinâmicos, permitindo extensibilidade sem modificação de código.

---

## ✅ Schemas Criados (10 blocos)

### Categoria: Intro (5 blocos)
- ✅ `intro-logo.json` - Logo/imagem inicial
- ✅ `intro-title.json` - Título principal
- ✅ `intro-description.json` - Texto descritivo
- ✅ `intro-image.json` - Imagem decorativa
- ✅ `intro-form.json` - Formulário de captura

### Categoria: Question (2 blocos)
- ✅ `question-title.json` - Pergunta
- ✅ `question-options-grid.json` - Grade de opções

### Categoria: Result (3 blocos)
- ✅ `result-header.json` - Cabeçalho do resultado
- ✅ `result-description.json` - Descrição detalhada
- ✅ `result-cta.json` - Call-to-Action

---

## 🏗️ Arquitetura Implementada

### 1. Estrutura de Arquivos
```
src/config/schemas/blocks/
├── intro-logo.json
├── intro-title.json
├── intro-description.json
├── intro-image.json
├── intro-form.json
├── question-title.json
├── question-options-grid.json
├── result-header.json
├── result-description.json
└── result-cta.json
```

### 2. Loader Centralizado
**Arquivo:** `src/core/schema/loadEditorBlockSchemas.ts`

**Função:**
- Importa todos os schemas JSON
- Registra no `schemaRegistry`
- Auto-executa ao ser importado

**Integração:**
```typescript
// loadDefaultSchemas.ts (atualizado)
import { loadEditorBlockSchemas } from './loadEditorBlockSchemas';

export function loadDefaultSchemas() {
  // ... carrega schemas básicos
  
  // Carrega schemas de blocos do editor
  loadEditorBlockSchemas();
}
```

---

## 📋 Template de Schema

```json
{
  "id": "block-type",
  "type": "block-type",
  "version": "1.0.0",
  "category": "categoria",
  "label": "Nome Exibido",
  "description": "Descrição do bloco",
  "icon": "LucideIcon",
  "renderingStrategy": "static|interactive|dynamic",
  "properties": {
    "propertyName": {
      "type": "string|number|boolean|array|object",
      "default": "valor padrão",
      "label": "Label do Campo",
      "description": "Descrição do campo",
      "control": "text|textarea|number|toggle|dropdown|color-picker|image-upload|json-editor",
      "validation": {
        "required": true,
        "min": 0,
        "max": 100,
        "minLength": 1,
        "maxLength": 500
      },
      "options": [
        { "label": "Opção 1", "value": "value1" },
        { "label": "Opção 2", "value": "value2" }
      ]
    }
  }
}
```

---

## 🎯 Propriedades de Schema Suportadas

### Tipos de Controle (control)
| Controle | Descrição | Uso |
|----------|-----------|-----|
| `text` | Input de texto simples | Títulos curtos |
| `textarea` | Área de texto multilinha | Descrições, HTML |
| `number` | Input numérico | Contadores, tamanhos |
| `toggle` | Switch on/off | Flags booleanas |
| `dropdown` | Select com opções | Variantes, estilos |
| `color-picker` | Seletor de cor | Cores de tema |
| `image-upload` | Upload/URL de imagem | Logos, imagens |
| `json-editor` | Editor JSON | Arrays, objetos |

### Validações (validation)
- `required`: Campo obrigatório
- `min` / `max`: Valores numéricos
- `minLength` / `maxLength`: Comprimento de strings
- `pattern`: Regex de validação

---

## 🔄 Integração com Editor

### 1. ComponentLibraryColumn
```typescript
// Carrega componentes dinamicamente do registry
const components = loadComponentsFromRegistry();
// Retorna ComponentLibraryItem[] com schemas carregados
```

### 2. PropertiesColumn
```typescript
// Renderiza propriedades dinamicamente
<DynamicPropertyControls
  elementType={block.type}
  properties={block.properties}
  onChange={handleChange}
/>
```

### 3. CanvasColumn
```typescript
// Renderiza bloco via UniversalBlockRenderer
<UniversalBlockRenderer
  block={block}
  isSelected={isSelected}
  onUpdate={onUpdate}
/>
```

### 4. useBlockOperations Hook
```typescript
// Cria bloco usando schema
const newElement = createElementFromSchema(type);

// Valida elemento
const validation = validateElement(newElement);
```

---

## 📊 Cobertura Atual

### Blocos Migrados: 10 / ~40
**Progresso:** 25%

### Categorias Completas
- ✅ Intro: 100% (5/5 blocos principais)
- 🔄 Question: 20% (2/10 blocos estimados)
- 🔄 Result: 30% (3/10 blocos estimados)
- ⏳ Offer: 0% (0/10 blocos estimados)
- ⏳ Layout: 0% (0/5 blocos estimados)

---

## 🚀 Próximos Passos

### FASE 5.1: Completar Schemas Restantes
- [ ] `question-description.json`
- [ ] `question-image.json`
- [ ] `question-navigation.json`
- [ ] `question-progress.json`
- [ ] `offer-hero.json`
- [ ] `offer-pricing.json`
- [ ] `offer-benefits.json`
- [ ] `offer-testimonials.json`
- [ ] `layout-container.json`
- [ ] `layout-divider.json`

### FASE 5.2: Script de Migração Automática
**Criar:** `scripts/migrate-hardcoded-blocks.ts`

**Função:**
- Escanear código para blocos hardcoded
- Gerar schemas JSON automaticamente
- Validar compatibilidade
- Criar PRs automáticos

### FASE 5.3: Deprecar Código Legacy
- Marcar `COMPONENT_LIBRARY` hardcoded como deprecated
- Criar avisos de console para blocos sem schema
- Documentar processo de migração

---

## 📖 Como Criar Novo Schema

### 1. Criar arquivo JSON
```bash
src/config/schemas/blocks/novo-bloco.json
```

### 2. Definir estrutura
```json
{
  "id": "novo-bloco",
  "type": "novo-bloco",
  "version": "1.0.0",
  "category": "categoria",
  "label": "Novo Bloco",
  "description": "Descrição",
  "properties": {
    // ... propriedades
  }
}
```

### 3. Registrar no loader
```typescript
// src/core/schema/loadEditorBlockSchemas.ts
import novoBloco from '@/config/schemas/blocks/novo-bloco.json';

const schemas = [
  // ...
  novoBloco,
];
```

### 4. Testar no editor
- Abrir `/editor`
- Verificar se aparece na biblioteca
- Adicionar ao canvas
- Editar propriedades
- Validar comportamento

---

## ✅ Benefícios Já Alcançados

1. **Extensibilidade**: Novos blocos via JSON, sem código
2. **Validação Dinâmica**: Propriedades validadas por schema
3. **UI Automática**: Controles gerados dinamicamente
4. **Documentação**: Schemas servem como documentação
5. **Versionamento**: Controle de versão por bloco
6. **Manutenção**: Fácil atualização de propriedades

---

## 🎓 Lições Aprendidas

### ✅ O que funcionou bem
- Schemas JSON são autodocumentados
- DynamicPropertyControls elimina código repetitivo
- SchemaRegistry centraliza tudo
- Validação em tempo de edição previne erros

### ⚠️ Desafios Enfrentados
- Compatibilidade com código legacy
- Tipagem TypeScript para schemas dinâmicos
- Fallback para blocos sem schema
- Performance com muitos schemas

### 💡 Melhorias Futuras
- Schema visual editor (WYSIWYG para schemas)
- Validação em tempo real no JSON
- Hot reload de schemas em dev
- Testes automatizados por schema

---

**Data:** 2025-01-15  
**Versão:** 5.0  
**Status:** ✅ Implementação Parcial (25% blocos migrados)
