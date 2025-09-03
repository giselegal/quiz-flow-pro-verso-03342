# 📍 LOCALIZAÇÃO DA BARRA SUPERIOR - EDITOR-FIXED

## 🎯 ESTRUTURA COMPLETA DA BARRA SUPERIOR

A barra superior do **editor-fixed** está localizada em `/src/pages/editor-fixed.tsx` e é composta por **3 camadas principais**:

### 1. 🏷️ BRANDHEADER (Topo)

```tsx
// Linha 141 em /src/pages/editor-fixed.tsx
<BrandHeader />
```

**Arquivo:** `/src/components/ui/BrandHeader.tsx`
**Função:** Exibe o logo da marca centralizado
**Visual:** Logo da empresa no topo da página

### 2. 🔧 EDITORTOOLBAR (Ferramentas)

```tsx
// Linhas 142-148 em /src/pages/editor-fixed.tsx
<EditorToolbar
  isPreviewing={isPreviewing}
  onTogglePreview={() => setIsPreviewing(!isPreviewing)}
  onSave={handleSave}
  viewportSize={viewportSize}
  onViewportSizeChange={setViewportSize}
/>
```

**Arquivo:** `/src/components/editor/toolbar/EditorToolbar.tsx`
**Função:** Botões de ação (Salvar, Preview, Desfazer, Refazer, Viewport)
**Visual:** Gradiente amber-stone com botões brancos
**Cores Corrigidas:** `from-amber-700 to-stone-600` ✅

### 3. 📊 STATUS BAR (Informações)

```tsx
// Linhas 150-168 em /src/pages/editor-fixed.tsx
<div className="bg-gradient-to-r from-stone-50/90 via-white/80 to-stone-50/90 border-b border-stone-200/60 backdrop-blur-md px-6 py-3 shadow-sm">
  <div className="flex items-center justify-between text-sm">{/* Status indicators */}</div>
</div>
```

**Função:** Mostra status do editor, contadores, stage ativo
**Visual:** Gradiente sutil stone com badges informativos

## 🏗️ HIERARQUIA VISUAL (De cima para baixo)

```
┌─────────────────────────────────────────────────────────┐
│                    🏷️ BRANDHEADER                       │
│                    (Logo da marca)                      │
├─────────────────────────────────────────────────────────┤
│     🔧 EDITORTOOLBAR (Amber → Stone gradient)          │
│    [Desfazer] [Refazer] │ [📱][💻][🖥️] │ [👁️] [💾]     │
├─────────────────────────────────────────────────────────┤
│                📊 STATUS BAR                           │
│  ● Editor Ativo  │  X blocos  │  [STAGE-ID]  │  Stats   │
├─────────────────────────────────────────────────────────┤
│                   📋 FOURCOLUMNLAYOUT                   │
│   Stages  │ Components │    Canvas    │  Properties     │
└─────────────────────────────────────────────────────────┘
```

## 📂 ARQUIVOS ENVOLVIDOS

### Página Principal

- **`/src/pages/editor-fixed.tsx`** - Container principal (linhas 140-168)

### Componentes da Barra

1. **`/src/components/ui/BrandHeader.tsx`** - Logo da marca
2. **`/src/components/editor/toolbar/EditorToolbar.tsx`** - Ferramentas principais
3. **Status Bar** - Inline no editor-fixed.tsx (não é componente separado)

### Importações Relevantes

```tsx
import BrandHeader from '@/components/ui/BrandHeader';
import { EditorToolbar } from '@/components/editor/toolbar/EditorToolbar';
```

## 🎨 CORES APLICADAS (Paleta Aprovada)

### BrandHeader

- **Background:** Transparente/padrão
- **Logo:** Cores da marca

### EditorToolbar

- **Background:** `bg-gradient-to-r from-amber-700 to-stone-600` ✅
- **Botões:** `text-white hover:bg-white/20`
- **Botão Salvar:** `bg-white text-amber-700 hover:bg-stone-100` ✅

### Status Bar

- **Background:** `bg-gradient-to-r from-stone-50/90 via-white/80 to-stone-50/90`
- **Textos:** `text-stone-700`, `text-stone-600`
- **Badges:** `bg-stone-200/50`, `bg-brand/20`

## ⚡ FUNCIONALIDADES

### EditorToolbar

- **Desfazer/Refazer:** Histórico de ações
- **Viewport:** Mobile, Tablet, Desktop, XL
- **Preview:** Toggle visualização
- **Salvar:** Persistir alterações

### Status Bar

- **Indicador Ativo:** Ponto animado verde
- **Contadores:** Blocos atuais/total, etapas
- **Stage Ativo:** ID da etapa atual
- **Viewport Ativo:** Tamanho da tela atual
- **Registry Stats:** Componentes ativos

## 🔧 CORREÇÕES APLICADAS

**✅ EditorToolbar corrigido:**

- Removido: `from-purple-600 to-blue-600`
- Aplicado: `from-amber-700 to-stone-600`
- Removido: `text-purple-600 hover:bg-gray-100`
- Aplicado: `text-amber-700 hover:bg-stone-100`

**✅ Todas as cores agora seguem a paleta da marca!**

---

**Resumo:** A barra superior do editor-fixed é composta por **BrandHeader + EditorToolbar + Status Bar**, localizados nas linhas 140-168 do arquivo `/src/pages/editor-fixed.tsx`.
