# 🔍 ANÁLISE COMPLETA - LOGO NO EDITOR /EDITOR-FIXED

## 📍 **LOCALIZAÇÃO DO CÓDIGO**

### **Arquivo Principal**: `/src/pages/editor-fixed.tsx`

```tsx
// Linha 2: Importação
import BrandHeader from '@/components/ui/BrandHeader';

// Linha 137: Renderização
<div className="h-screen flex flex-col bg-gradient-to-br from-stone-50 via-stone-50/30 to-stone-100">
  <BrandHeader />  {/* 🎯 AQUI ESTÁ O LOGO */}

  <EditorToolbar
    isPreviewing={isPreviewing}
    onTogglePreview={() => setIsPreviewing(!isPreviewing)}
    onSave={handleSave}
    viewportSize={viewportSize}
    onViewportSizeChange={setViewportSize}
  />
```

---

## 🧩 **COMPONENTES ENVOLVIDOS**

### **1. BrandHeader** (`/src/components/ui/BrandHeader.tsx`)

```tsx
import React from 'react';
import Logo from './logo';

interface BrandHeaderProps {
  className?: string;
}

const BrandHeader: React.FC<BrandHeaderProps> = ({ className }) => {
  return (
    <div className={`flex justify-center items-center py-6 ${className}`}>
      <Logo /> {/* 🎯 COMPONENTE DO LOGO */}
    </div>
  );
};

export default BrandHeader;
```

**Função:**

- Container centralizado para o logo
- Padding vertical de `py-6` (24px)
- Flexbox para centralizacao

---

### **2. Logo** (`/src/components/ui/logo.tsx`)

```tsx
import React from 'react';
import { OptimizedImage } from './optimized-image';

interface LogoProps {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({
  src = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
  alt = 'Logo Gisele Galvão',
  className = 'h-14 mx-auto',
  style,
  priority = true,
  width = 200,
  height = 100,
}) => {
  return (
    <div className="flex justify-center items-center w-full">
      <OptimizedImage
        src={src}
        alt={alt}
        className={`${className} mx-auto`}
        style={{ ...style, objectFit: 'contain' }}
        priority={priority}
        width={width}
        height={height}
        quality={99}
      />
    </div>
  );
};

export default Logo;
```

**Especificações:**

- **URL da Imagem**: `https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp`
- **Alt Text**: "Logo Gisele Galvão"
- **Tamanho Padrão**: `h-14` (56px altura)
- **Dimensões**: 200x100px
- **Qualidade**: 99%
- **Prioridade de Carregamento**: Sim

---

## 🎨 **ESTRUTURA VISUAL NO EDITOR**

```
┌─────────────────────────────────────────────────────┐
│ div.h-screen.flex.flex-col                          │
│ ┌─────────────────────────────────────────────────┐ │
│ │ <BrandHeader />                                 │ │
│ │ ┌─────────────────────────────────────────────┐ │ │
│ │ │ div.flex.justify-center.items-center.py-6  │ │ │
│ │ │ ┌─────────────────────────────────────────┐ │ │ │
│ │ │ │ <Logo />                                │ │ │ │
│ │ │ │ ┌─────────────────────────────────────┐ │ │ │ │
│ │ │ │ │ div.flex.justify-center.w-full      │ │ │ │ │
│ │ │ │ │ ┌─────────────────────────────────┐ │ │ │ │ │
│ │ │ │ │ │ <OptimizedImage />              │ │ │ │ │ │
│ │ │ │ │ │ • h-14 mx-auto (56px altura)    │ │ │ │ │ │
│ │ │ │ │ │ • 200x100px                     │ │ │ │ │ │
│ │ │ │ │ │ • quality=99                    │ │ │ │ │ │
│ │ │ │ │ └─────────────────────────────────┘ │ │ │ │ │
│ │ │ │ └─────────────────────────────────────┘ │ │ │ │
│ │ │ └─────────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────┐ │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ <EditorToolbar />                                   │
│ <StatusBar />                                       │
│ <MainEditorLayout />                                │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 **COMO MODIFICAR O LOGO**

### **Opção 1: Mudar apenas a imagem**

```tsx
// Em /src/components/ui/logo.tsx, linha 12
src = 'NOVA_URL_DA_IMAGEM.webp';
```

### **Opção 2: Ajustar tamanho**

```tsx
// Em /src/components/ui/logo.tsx, linha 14
className = 'h-16 mx-auto'; // Aumentar altura
// ou
className = 'h-12 mx-auto'; // Diminuir altura
```

### **Opção 3: Remover completamente**

```tsx
// Em /src/pages/editor-fixed.tsx, remover linha 137
// <BrandHeader />  <!-- Comentar ou remover -->
```

### **Opção 4: Substituir por texto**

```tsx
// Criar um novo componente TextBrand
const TextBrand = () => (
  <div className="text-center py-6">
    <h1 className="text-2xl font-brand text-brand-dark">Quiz Quest Challenge Verse</h1>
  </div>
);

// Usar no editor-fixed.tsx
<TextBrand />;
```

---

## 📍 **POSIÇÃO NO LAYOUT**

- **Ordem**: Primeiro elemento do editor (topo da página)
- **Z-index**: Normal (não sobreposto)
- **Espaçamento**: `py-6` (24px top/bottom)
- **Largura**: 100% da tela
- **Alinhamento**: Centro horizontal

---

## 🎯 **RESUMO**

O logo está localizado em:

1. **Arquivo Principal**: `/src/pages/editor-fixed.tsx` (linha 137)
2. **Componente Container**: `/src/components/ui/BrandHeader.tsx`
3. **Componente Logo**: `/src/components/ui/logo.tsx`
4. **URL da Imagem**: Cloudinary (webp otimizada)
5. **Posição**: Topo do editor, centralizado

**Para modificar**: Editar os arquivos mencionados conforme a necessidade específica.
