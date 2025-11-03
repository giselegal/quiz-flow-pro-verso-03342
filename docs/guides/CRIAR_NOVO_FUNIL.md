# 🎯 Guia: Como Criar um Novo Funil JSON

## 📝 Passo a Passo

### 1. Planejar Estrutura do Funil

Defina:
- Número de etapas (intro, perguntas, transições, resultado, oferta)
- Tipos de blocos necessários em cada step
- Dados que serão coletados

### 2. Criar Arquivo JSON

Criar `public/templates/funnels/seu-funil.json`:

```json
{
  "id": "seu-funil",
  "name": "Nome do Seu Funil",
  "description": "Descrição detalhada",
  "version": "1.0.0",
  "author": "Seu Nome",
  "steps": [
    {
      "key": "intro",
      "label": "Introdução",
      "type": "intro",
      "blocks": []
    }
  ]
}
```

### 3. Adicionar Blocos aos Steps

Para cada step, adicione blocos simples (JSON):

```json
{
  "key": "intro",
  "label": "Introdução",
  "type": "intro",
  "blocks": [
    {
      "id": "intro-logo-1",
      "type": "intro-logo",
      "properties": {
        "src": "/images/logo.png",
        "alt": "Logo",
        "width": 200,
        "height": 80
      },
      "order": 0
    },
    {
      "id": "intro-title-1",
      "type": "intro-title",
      "properties": {
        "text": "Bem-vindo ao Quiz!",
        "level": "h1",
        "textAlign": "center"
      },
      "order": 1
    }
  ]
}
```

### 4. Adicionar Blocos Complexos (TSX)

Para blocos interativos, use tipos complexos:

```json
{
  "id": "q1-options",
  "type": "options-grid",
  "properties": {
    "options": [
      {
        "id": "opcao-1",
        "text": "Opção 1",
        "imageUrl": "/images/option1.jpg"
      }
    ],
    "columns": 2,
    "selectionType": "single"
  },
  "order": 2
}
```

### 5. Carregar Template no Editor

```typescript
import { loadFunnelTemplate } from '@/services/TemplateLoader';

const template = await loadFunnelTemplate('seu-funil');
```

---

## 🎨 Templates HTML Disponíveis

### Blocos de Texto

**text-inline**: Texto simples
```json
{
  "type": "text-inline",
  "properties": {
    "content": "<p>Seu texto aqui</p>",
    "fontSize": "16px",
    "textAlign": "left"
  }
}
```

**heading-inline**: Títulos
```json
{
  "type": "heading-inline",
  "properties": {
    "content": "Título Principal",
    "level": "h1",
    "textAlign": "center"
  }
}
```

### Blocos de Imagem

**image-inline**: Imagem estática
```json
{
  "type": "image-inline",
  "properties": {
    "src": "/images/hero.jpg",
    "alt": "Imagem Hero",
    "width": 800,
    "height": 400
  }
}
```

### Blocos de Intro

**intro-logo**: Logo do quiz
```json
{
  "type": "intro-logo",
  "properties": {
    "src": "/images/logo.png",
    "width": 200
  }
}
```

**intro-title**: Título principal
```json
{
  "type": "intro-title",
  "properties": {
    "text": "Descubra Seu Perfil",
    "level": "h1"
  }
}
```

**intro-description**: Descrição
```json
{
  "type": "intro-description",
  "properties": {
    "text": "Responda o quiz e receba resultado personalizado"
  }
}
```

---

## 🔧 Blocos Complexos (TSX)

### options-grid

Grid de opções com seleção:

```json
{
  "type": "options-grid",
  "properties": {
    "options": [
      {
        "id": "opt1",
        "text": "Opção 1",
        "imageUrl": "/images/opt1.jpg",
        "category": "categoria1"
      }
    ],
    "columns": 3,
    "selectionType": "single",
    "imageSize": "medium"
  }
}
```

### form-input

Campo de formulário:

```json
{
  "type": "form-input",
  "properties": {
    "type": "text",
    "name": "nome",
    "placeholder": "Digite seu nome",
    "required": true
  }
}
```

### intro-form

Formulário completo de introdução:

```json
{
  "type": "intro-form",
  "properties": {
    "fields": [
      {
        "id": "name",
        "type": "text",
        "label": "Nome",
        "required": true
      },
      {
        "id": "email",
        "type": "email",
        "label": "E-mail",
        "required": true
      }
    ],
    "buttonText": "Começar",
    "buttonStyle": "primary"
  }
}
```

---

## ✅ Validação

### Validar Template JSON

```typescript
import { validateTemplate } from '@/services/TemplateLoader';

const isValid = validateTemplate(myTemplate);
if (!isValid) {
  console.error('Template inválido');
}
```

### Campos Obrigatórios

```json
{
  "id": "string (obrigatório)",
  "name": "string (obrigatório)",
  "version": "string (obrigatório)",
  "steps": [
    {
      "key": "string (obrigatório)",
      "label": "string (obrigatório)",
      "type": "intro|question|transition|result|offer (obrigatório)",
      "blocks": []
    }
  ]
}
```

---

## 🎯 Exemplos Completos

### Funil de Emagrecimento

Ver: `public/templates/funnels/funil-emagrecimento.json`

### Funil de Moda

Criar: `public/templates/funnels/funil-moda.json`

```json
{
  "id": "funil-moda",
  "name": "Descubra Seu Estilo de Moda",
  "steps": [
    {
      "key": "intro",
      "label": "Introdução",
      "type": "intro",
      "blocks": [
        {
          "id": "intro-logo",
          "type": "intro-logo",
          "properties": {
            "src": "/images/fashion-logo.png"
          },
          "order": 0
        }
      ]
    }
  ]
}
```

---

## 🚀 Deploy

1. Salvar arquivo JSON em `public/templates/funnels/`
2. Template ficará disponível automaticamente
3. Acessar via URL: `/editor?template=seu-funil`

---

## 📚 Recursos Adicionais

- **Documentação Completa**: `docs/FASE10_SISTEMA_HIBRIDO_COMPLETO.md`
- **Block Complexity Map**: `src/config/block-complexity-map.ts`
- **Templates HTML**: `public/templates/html/`
- **Schemas Zod**: `src/lib/validation.ts`
