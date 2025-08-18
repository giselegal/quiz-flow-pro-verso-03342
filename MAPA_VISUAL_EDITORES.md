# 🗺️ MAPA VISUAL - HIERARQUIA DOS EDITORES

```
📊 QUIZ QUEST - SISTEMA DE EDITORES
├─ 🏆 EDITORES PRINCIPAIS
│  ├─ 🥇 EditorWithPreview              [⭐⭐⭐⭐⭐] 🟢 PRODUÇÃO
│  │  ├─ EditorFixedPageWithDragDrop    (core AVANÇADO - 313 linhas)
│  │  ├─ PreviewProvider                (contexto preview)
│  │  ├─ EditorToolbar                  (toolbar unificada)
│  │  ├─ DndProvider                    (drag & drop)
│  │  ├─ FourColumnLayout               (layout responsivo)
│  │  │  ├─ FunnelStagesPanel           (21 etapas)
│  │  │  ├─ CombinedComponentsPanel     (biblioteca)
│  │  │  ├─ CanvasDropZone             (canvas principal)
│  │  │  └─ PropertiesPanel            (10+ editores)
│  │  └─ Modais                        (settings, templates)
│  │
│  ├─ 🥈 SchemaDrivenEditorResponsive   [⭐⭐⭐⭐] 🟡 FUNCIONAL
│  │  ├─ Toolbar básica                 (inline simples)
│  │  ├─ ResizablePanelGroup           (4 colunas)
│  │  │  ├─ FunnelStagesPanel          (21 etapas)
│  │  │  ├─ ComponentsSidebar          (biblioteca básica)
│  │  │  ├─ CanvasDropZone            (canvas drag&drop)
│  │  │  └─ PropertiesPanel           (propriedades)
│  │  └─ EditorContext                 (integração)
│  │
│  ├─ 🥉 ImprovedEditor                 [⭐⭐⭐] 🟡 DESENVOLVIMENTO
│  │  ├─ ComponentsLibrary              (sidebar)
│  │  ├─ ResponsivePreview             (canvas)
│  │  ├─ EnhancedPropertiesPanel       (propriedades)
│  │  └─ EditorHistory                 (histórico)
│  │
│  └─ 4️⃣ Editor-Fixed (Legacy)          [⭐⭐⭐] 🟡 BÁSICO
│     ├─ EditorFixedPageWithDragDrop    (versão BÁSICA - 333 linhas)
│     ├─ Layout básico                  (4 colunas simples)
│     ├─ 21 etapas                     (funil completo)
│     ├─ PropertiesPanel               (avançado)
│     └─ Canvas básico                 (sem drag&drop real)
│
├─ 🔧 COMPONENTES DE APOIO
│  ├─ 📐 Layout & Estrutura
│  │  ├─ FourColumnLayout.tsx          🟢 Robusto
│  │  ├─ EditorLayout.tsx              🟢 Unificado
│  │  └─ EditorToolbar.tsx             🟢 Integrado
│  │
│  ├─ 🎛️ Funcionalidades Core
│  │  ├─ properties/
│  │  │  ├─ PropertiesPanel.tsx        🟢 10+ editores
│  │  │  └─ editors/                   🟢 Sistema completo
│  │  ├─ canvas/
│  │  │  ├─ CanvasDropZone.tsx        🟢 Drag & drop
│  │  │  └─ preview/                  🟢 Responsivo
│  │  ├─ funnel/
│  │  │  ├─ FunnelStagesPanel.tsx     🟢 21 etapas
│  │  │  └─ FunnelProgressBar.tsx     🟢 Navegação
│  │  └─ sidebar/
│  │     ├─ ComponentsSidebar.tsx     🟢 Biblioteca
│  │     └─ ComponentsLibrary.tsx     🟢 Componentes
│  │
│  └─ ⚙️ Serviços & Estado
│     ├─ EditorContext.tsx             🟢 Estado (595 linhas)
│     ├─ PreviewContext.tsx            🟢 Preview
│     ├─ editorService.ts              🟢 Persistência
│     ├─ editorSupabaseService.ts      🟢 Backend
│     └─ templateService.ts            🟡 Em correção
│
├─ 🚫 EDITORES NÃO FUNCIONAIS
│  ├─ AdvancedEditor.tsx               [⭐] 🔴 PLACEHOLDER
│  └─ EnhancedEditor.tsx               [⭐] 🔴 STUB
│
└─ 🗂️ CONFIGURAÇÕES & TIPOS
   ├─ types/
   │  ├─ editor.ts                     🟢 Tipos principais
   │  ├─ editorTypes.ts                🟢 Estado
   │  └─ editorBlockProps.ts           🟢 Propriedades
   └─ config/
      ├─ editorConfig.ts               🟢 Configurações
      └─ editorBlocksMapping.ts        🟢 Mapeamentos

📍 ROTAS DE ACESSO:
   /editor           → EditorWithPreview      🟢 PRINCIPAL
   /editor-schema    → SchemaDrivenEditor     🟡 ALTERNATIVO
   /editor-fixed     → EditorWithPreview      🟢 REDIRECT

🎯 RECOMENDAÇÃO: Usar EditorWithPreview como editor principal
🔧 DESENVOLVIMENTO: Melhorar SchemaDrivenEditor como alternativa
🧹 LIMPEZA: Remover ou implementar AdvancedEditor/EnhancedEditor
```

## 📊 MÉTRICAS COMPARATIVAS

| Editor                 | Linhas | Componentes | Funcionalidades | Status       |
| ---------------------- | ------ | ----------- | --------------- | ------------ |
| EditorWithPreview      | 314    | 15+         | 10/10           | 🟢 Produção  |
| SchemaDrivenResponsive | 128    | 8           | 7/10            | 🟡 Funcional |
| ImprovedEditor         | 287    | 6           | 5/10            | 🟡 Dev       |
| Editor-Fixed (Legacy)  | 334    | 10          | 6/10            | 🟡 Básico    |
| AdvancedEditor         | 12     | 0           | 0/10            | 🔴 Inativo   |
| EnhancedEditor         | 5      | 0           | 0/10            | 🔴 Inativo   |

## 🚀 EVOLUÇÃO RECOMENDADA

```
FASE 1: Consolidação
├─ Usar EditorWithPreview como padrão
├─ Melhorar documentação
└─ Testes de integração

FASE 2: Otimização
├─ Integrar melhores features do SchemaDriven
├─ Melhorar performance
└─ Adicionar funcionalidades avançadas

FASE 3: Limpeza
├─ Remover editores não funcionais
├─ Refatorar código duplicado
└─ Padronizar interfaces
```
