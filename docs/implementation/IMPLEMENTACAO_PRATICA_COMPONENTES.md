# 🔧 Implementação Prática - Sistema de Componentes Configuráveis

## 🏭 Como Criar um Novo Componente Configurável

### 1️⃣ PASSO 1: Definir o Componente React

```typescript
// src/components/blocks/custom/MyCustomBlock.tsx
import React from 'react';

interface MyCustomBlockProps {
  // Propriedades editáveis
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  showIcon: boolean;
  iconPosition: 'left' | 'right' | 'top';
  padding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };

  // Propriedades do sistema
  id?: string;
  isSelected?: boolean;
  isEditing?: boolean;
}

const MyCustomBlock: React.FC<MyCustomBlockProps> = ({
  title,
  description,
  backgroundColor,
  textColor,
  borderRadius,
  showIcon,
  iconPosition,
  padding,
  isSelected,
  isEditing
}) => {
  const containerStyles = {
    backgroundColor,
    color: textColor,
    borderRadius: `${borderRadius}px`,
    padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
    border: isSelected ? '2px solid #B89B7A' : 'none',
    cursor: isEditing ? 'pointer' : 'default',
    transition: 'all 0.3s ease'
  };

  const iconElement = showIcon && (
    <div className="icon">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
      </svg>
    </div>
  );

  const renderContent = () => {
    const content = (
      <>
        <h3 className="title">{title}</h3>
        <p className="description">{description}</p>
      </>
    );

    switch (iconPosition) {
      case 'left':
        return (
          <div className="flex items-center space-x-3">
            {iconElement}
            <div>{content}</div>
          </div>
        );
      case 'right':
        return (
          <div className="flex items-center space-x-3">
            <div>{content}</div>
            {iconElement}
          </div>
        );
      case 'top':
        return (
          <div className="flex flex-col items-center space-y-2">
            {iconElement}
            <div className="text-center">{content}</div>
          </div>
        );
      default:
        return <div>{content}</div>;
    }
  };

  return (
    <div style={containerStyles} className="my-custom-block">
      {renderContent()}
    </div>
  );
};

export default MyCustomBlock;
```

### 2️⃣ PASSO 2: Registrar no Block Registry

```typescript
// src/config/enhancedBlockRegistry.tsx
import { Star, Layers } from 'lucide-react';
import MyCustomBlock from '@/components/blocks/custom/MyCustomBlock';

export const blockRegistry = {
  // ... outros componentes ...

  myCustomBlock: {
    // Identificação
    type: 'MyCustomBlock',
    name: 'Bloco Customizado',
    description: 'Um bloco personalizável com título, descrição e ícone',
    category: 'custom',
    icon: Star,

    // Componente React
    component: MyCustomBlock,

    // Propriedades padrão (serão aplicadas quando o componente for criado)
    defaultProps: {
      title: 'Título do Bloco',
      description: 'Descrição detalhada do conteúdo do bloco.',
      backgroundColor: '#FFFFFF',
      textColor: '#432818',
      borderRadius: 8,
      showIcon: true,
      iconPosition: 'left',
      padding: {
        top: 20,
        bottom: 20,
        left: 24,
        right: 24,
      },
    },

    // Configuração das propriedades editáveis
    properties: {
      // Grupo: Conteúdo
      title: {
        type: 'string',
        label: 'Título Principal',
        default: 'Título do Bloco',
        category: 'content',
        validation: {
          required: true,
          maxLength: 100,
        },
        description: 'Texto principal do bloco',
      },

      description: {
        type: 'textarea',
        label: 'Descrição',
        default: 'Descrição detalhada do conteúdo do bloco.',
        category: 'content',
        validation: {
          maxLength: 500,
        },
        rows: 3,
        description: 'Texto secundário do bloco',
      },

      // Grupo: Aparência
      backgroundColor: {
        type: 'color',
        label: 'Cor de Fundo',
        default: '#FFFFFF',
        category: 'appearance',
        description: 'Define a cor de fundo do bloco',
      },

      textColor: {
        type: 'color',
        label: 'Cor do Texto',
        default: '#432818',
        category: 'appearance',
        description: 'Define a cor do texto do bloco',
      },

      borderRadius: {
        type: 'range',
        label: 'Bordas Arredondadas',
        min: 0,
        max: 50,
        step: 1,
        default: 8,
        unit: 'px',
        category: 'appearance',
        description: 'Controla o arredondamento das bordas',
      },

      // Grupo: Layout
      showIcon: {
        type: 'boolean',
        label: 'Mostrar Ícone',
        default: true,
        category: 'layout',
        description: 'Controla se o ícone será exibido',
      },

      iconPosition: {
        type: 'select',
        label: 'Posição do Ícone',
        options: [
          { value: 'left', label: 'Esquerda' },
          { value: 'right', label: 'Direita' },
          { value: 'top', label: 'Acima' },
        ],
        default: 'left',
        category: 'layout',
        dependsOn: { showIcon: true }, // Só aparece se showIcon for true
        description: 'Define onde o ícone será posicionado',
      },

      // Grupo: Espaçamento
      'padding.top': {
        type: 'range',
        label: 'Espaçamento Superior',
        min: 0,
        max: 100,
        step: 4,
        default: 20,
        unit: 'px',
        category: 'spacing',
      },

      'padding.bottom': {
        type: 'range',
        label: 'Espaçamento Inferior',
        min: 0,
        max: 100,
        step: 4,
        default: 20,
        unit: 'px',
        category: 'spacing',
      },

      'padding.left': {
        type: 'range',
        label: 'Espaçamento Esquerdo',
        min: 0,
        max: 100,
        step: 4,
        default: 24,
        unit: 'px',
        category: 'spacing',
      },

      'padding.right': {
        type: 'range',
        label: 'Espaçamento Direito',
        min: 0,
        max: 100,
        step: 4,
        default: 24,
        unit: 'px',
        category: 'spacing',
      },
    },

    // Configurações avançadas
    advanced: {
      // Responsividade
      responsive: {
        breakpoints: ['sm', 'md', 'lg', 'xl'],
        properties: ['padding', 'fontSize', 'borderRadius'],
      },

      // Animações
      animations: {
        hover: {
          scale: 1.02,
          duration: 200,
        },
        appear: {
          fadeIn: true,
          duration: 500,
        },
      },

      // Validações customizadas
      customValidations: [
        {
          property: 'title',
          rule: (value: string) => value.length > 0,
          message: 'Título não pode estar vazio',
        },
      ],

      // Preview modes
      previewModes: ['desktop', 'tablet', 'mobile'],
    },
  },
};
```

### 3️⃣ PASSO 3: Painel de Propriedades Auto-gerado

O sistema automaticamente cria este painel baseado na configuração:

```typescript
// Painel gerado automaticamente
const PropertiesPanel = () => {
  return (
    <div className="properties-panel">
      <h3 className="panel-title">
        <Star className="w-5 h-5" />
        Bloco Customizado - Propriedades
      </h3>

      {/* Tabs por categoria */}
      <div className="property-tabs">
        <Tab id="content">📝 Conteúdo</Tab>
        <Tab id="appearance">🎨 Aparência</Tab>
        <Tab id="layout">📐 Layout</Tab>
        <Tab id="spacing">📏 Espaçamento</Tab>
      </div>

      {/* Tab: Conteúdo */}
      <TabContent id="content">
        <PropertyGroup>
          <label>Título Principal</label>
          <Input
            value={properties.title}
            onChange={(value) => updateProperty('title', value)}
            maxLength={100}
            required
          />
          <small>Texto principal do bloco</small>
        </PropertyGroup>

        <PropertyGroup>
          <label>Descrição</label>
          <Textarea
            value={properties.description}
            onChange={(value) => updateProperty('description', value)}
            rows={3}
            maxLength={500}
          />
          <small>Texto secundário do bloco</small>
        </PropertyGroup>
      </TabContent>

      {/* Tab: Aparência */}
      <TabContent id="appearance">
        <PropertyGroup>
          <label>Cor de Fundo</label>
          <ColorPicker
            value={properties.backgroundColor}
            onChange={(color) => updateProperty('backgroundColor', color)}
          />
          <small>Define a cor de fundo do bloco</small>
        </PropertyGroup>

        <PropertyGroup>
          <label>Cor do Texto</label>
          <ColorPicker
            value={properties.textColor}
            onChange={(color) => updateProperty('textColor', color)}
          />
          <small>Define a cor do texto do bloco</small>
        </PropertyGroup>

        <PropertyGroup>
          <label>Bordas Arredondadas</label>
          <RangeSlider
            value={properties.borderRadius}
            min={0}
            max={50}
            step={1}
            unit="px"
            onChange={(value) => updateProperty('borderRadius', value)}
          />
          <small>Controla o arredondamento das bordas</small>
        </PropertyGroup>
      </TabContent>

      {/* Tab: Layout */}
      <TabContent id="layout">
        <PropertyGroup>
          <label>Mostrar Ícone</label>
          <Switch
            checked={properties.showIcon}
            onChange={(checked) => updateProperty('showIcon', checked)}
          />
          <small>Controla se o ícone será exibido</small>
        </PropertyGroup>

        {properties.showIcon && (
          <PropertyGroup>
            <label>Posição do Ícone</label>
            <Select
              value={properties.iconPosition}
              onChange={(value) => updateProperty('iconPosition', value)}
              options={[
                { value: 'left', label: 'Esquerda' },
                { value: 'right', label: 'Direita' },
                { value: 'top', label: 'Acima' }
              ]}
            />
            <small>Define onde o ícone será posicionado</small>
          </PropertyGroup>
        )}
      </TabContent>

      {/* Tab: Espaçamento */}
      <TabContent id="spacing">
        <div className="spacing-grid">
          <PropertyGroup>
            <label>Superior</label>
            <RangeSlider
              value={properties.padding.top}
              min={0}
              max={100}
              step={4}
              unit="px"
              onChange={(value) => updateProperty('padding.top', value)}
            />
          </PropertyGroup>

          <PropertyGroup>
            <label>Inferior</label>
            <RangeSlider
              value={properties.padding.bottom}
              min={0}
              max={100}
              step={4}
              unit="px"
              onChange={(value) => updateProperty('padding.bottom', value)}
            />
          </PropertyGroup>

          <PropertyGroup>
            <label>Esquerdo</label>
            <RangeSlider
              value={properties.padding.left}
              min={0}
              max={100}
              step={4}
              unit="px"
              onChange={(value) => updateProperty('padding.left', value)}
            />
          </PropertyGroup>

          <PropertyGroup>
            <label>Direito</label>
            <RangeSlider
              value={properties.padding.right}
              min={0}
              max={100}
              step={4}
              unit="px"
              onChange={(value) => updateProperty('padding.right', value)}
            />
          </PropertyGroup>
        </div>
      </TabContent>

      {/* Botões de ação */}
      <div className="panel-actions">
        <Button variant="outline" onClick={resetToDefaults}>
          🔄 Resetar
        </Button>
        <Button variant="primary" onClick={saveChanges}>
          💾 Aplicar
        </Button>
      </div>
    </div>
  );
};
```

### 4️⃣ PASSO 4: Como Funciona na Prática

```typescript
// Quando o usuário arrasta o componente para o canvas:

1. DragDrop detecta o drop:
   onDrop('myCustomBlock', position)

2. EditorContext cria novo bloco:
   const newBlock = {
     id: generateId(),
     type: 'MyCustomBlock',
     stageId: activeStageId,
     properties: {
       // Copia as defaultProps do registry
       ...blockRegistry.myCustomBlock.defaultProps
     }
   }

3. Canvas renderiza o componente:
   <MyCustomBlock
     {...newBlock.properties}
     id={newBlock.id}
     isSelected={selectedBlockId === newBlock.id}
   />

4. Usuário clica no bloco:
   setSelectedBlockId(newBlock.id)

5. Painel de propriedades carrega:
   - Busca definição no registry
   - Gera controles baseado em properties
   - Mostra valores atuais do bloco

6. Usuário altera propriedade:
   updateProperty('title', 'Novo título')

7. Canvas re-renderiza automaticamente:
   <MyCustomBlock title="Novo título" {...otherProps} />
```

## 🎯 Tipos de Controles Suportados

### 📝 Controles de Texto

```typescript
// Input simples
title: {
  type: 'string',
  label: 'Título',
  default: 'Texto padrão',
  validation: { maxLength: 100 }
}

// Textarea
description: {
  type: 'textarea',
  label: 'Descrição',
  rows: 4,
  validation: { maxLength: 500 }
}

// Rich text editor
content: {
  type: 'richtext',
  label: 'Conteúdo Rico',
  toolbar: ['bold', 'italic', 'link']
}
```

### 🎨 Controles Visuais

```typescript
// Color picker
color: {
  type: 'color',
  label: 'Cor',
  default: '#000000',
  format: 'hex' // ou 'rgb', 'hsl'
}

// Gradient picker
gradient: {
  type: 'gradient',
  label: 'Gradiente',
  default: 'linear-gradient(45deg, #ff0000, #00ff00)'
}

// Image selector
image: {
  type: 'image',
  label: 'Imagem',
  accept: '.jpg,.png,.gif',
  maxSize: '2MB'
}
```

### 📏 Controles Numéricos

```typescript
// Range slider
fontSize: {
  type: 'range',
  label: 'Tamanho',
  min: 12,
  max: 72,
  step: 2,
  unit: 'px'
}

// Number input
quantity: {
  type: 'number',
  label: 'Quantidade',
  min: 0,
  max: 100,
  step: 1
}

// Spacing control
margin: {
  type: 'spacing',
  label: 'Margem',
  sides: ['top', 'right', 'bottom', 'left'],
  linked: true // permite vincular todos os lados
}
```

### 🔘 Controles de Seleção

```typescript
// Dropdown select
alignment: {
  type: 'select',
  label: 'Alinhamento',
  options: [
    { value: 'left', label: 'Esquerda' },
    { value: 'center', label: 'Centro' },
    { value: 'right', label: 'Direita' }
  ]
}

// Radio buttons
layout: {
  type: 'radio',
  label: 'Layout',
  options: [
    { value: 'grid', label: 'Grade', icon: Grid },
    { value: 'list', label: 'Lista', icon: List }
  ]
}

// Multi-select
tags: {
  type: 'multiselect',
  label: 'Tags',
  options: ['urgent', 'featured', 'new'],
  maxSelections: 3
}
```

### 🔗 Controles Condicionais

```typescript
// Propriedades dependentes
showButton: {
  type: 'boolean',
  label: 'Mostrar Botão'
}

buttonText: {
  type: 'string',
  label: 'Texto do Botão',
  dependsOn: { showButton: true } // Só aparece se showButton for true
}

// Validação condicional
buttonUrl: {
  type: 'string',
  label: 'URL do Botão',
  validation: {
    required: (props) => props.showButton,
    pattern: 'url'
  }
}
```

## 🏆 Resultado Final

Com essa implementação, temos um sistema onde:

✅ **Qualquer desenvolvedor** pode criar um novo componente  
✅ **Painel é gerado automaticamente** baseado na configuração  
✅ **Validações funcionam** sem código extra  
✅ **Preview em tempo real** automaticamente  
✅ **Propriedades são persistidas** automaticamente  
✅ **Sistema é completamente tipado** (TypeScript)

**O desenvolvedor só precisa:**

1. Criar o componente React
2. Definir no registry com propriedades
3. Pronto! O painel funciona automaticamente

🎉 **Sistema 100% escalável e manutenível!**
