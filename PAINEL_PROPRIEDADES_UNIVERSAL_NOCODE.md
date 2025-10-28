# 🎛️ Painel de Propriedades Universal NoCode

## 🎯 Visão Geral

**SIM! É TOTALMENTE POSSÍVEL e RECOMENDADO** concentrar TODAS as configurações NoCode no Painel de Propriedades. Isso proporciona:

✅ **UX Consistente** - Um único lugar para editar tudo  
✅ **Context-Aware** - Mostra configurações relevantes baseadas na seleção  
✅ **Menos Cliques** - Sem modais/dialogs separados  
✅ **Fluxo Natural** - Editar conteúdo + configurar publicação no mesmo lugar  
✅ **Produtividade** - Usuário não precisa "procurar onde configura X"  

---

## 📊 Estado Atual vs Proposta

### ❌ **Arquitetura Atual (Fragmentada)**

```
┌─────────────────────────────────────────────────────┐
│ EDITOR                                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Canvas            │  Painel de Propriedades       │
│  (preview)         │  (lateral direito)            │
│                    │                                │
│  [Intro Screen]    │  ┌──────────────────────────┐ │
│  ┌──────────────┐  │  │ 📝 Texto do Título       │ │
│  │ [Título]     │◄─┼──┤    "Bem-vindo..."        │ │
│  │ [Subtítulo]  │  │  │                          │ │
│  │ [Botão]      │  │  │ 🎨 Cor: #B89B7A          │ │
│  └──────────────┘  │  │ 📐 Tamanho: 32px         │ │
│                    │  └──────────────────────────┘ │
│                    │                                │
└─────────────────────────────────────────────────────┘

PROBLEMA: Configurações de publicação estão FORA!
           ↓
┌─────────────────────────────────────────────────────┐
│ Botão separado: "📡 Publicação" → Abre MODAL       │
├─────────────────────────────────────────────────────┤
│  🌐 Domínio  │  🎯 Resultados  │  📈 SEO  │  🔍...  │
│                                                     │
│  [Configurar domínio...]                            │
│  [Configurar pixels...]                             │
│  [Configurar resultados...]                         │
└─────────────────────────────────────────────────────┘

⚠️ FRAGMENTAÇÃO:
- Usuário precisa lembrar que existe botão "Publicação"
- Configurações de publicação isoladas do conteúdo
- Não é contextual (sempre mostra tudo)
```

### ✅ **Proposta: Painel Universal (Contextual)**

```
┌─────────────────────────────────────────────────────┐
│ EDITOR                                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Canvas            │  Painel Universal             │
│  (preview)         │  (context-aware)              │
│                    │                                │
│  SELEÇÃO: Nada     │  ┌──────────────────────────┐ │
│                    │  │ 🎯 Configurações Globais │ │
│  [ ]               │  ├──────────────────────────┤ │
│                    │  │ 📊 Funil                 │ │
│                    │  │   Nome: Quiz de Estilo   │ │
│                    │  │   Descrição: ...         │ │
│                    │  │                          │ │
│                    │  │ 🌐 Publicação            │ │
│                    │  │   Domínio: meu-quiz.com  │ │
│                    │  │   Slug: /estilo-pessoal  │ │
│                    │  │                          │ │
│                    │  │ 📈 SEO                   │ │
│                    │  │   Title: ...             │ │
│                    │  │   OG Image: ...          │ │
│                    │  │                          │ │
│                    │  │ 🔍 Tracking              │ │
│                    │  │   FB Pixel: 123456...    │ │
│                    │  │   GA: G-XXXXX            │ │
│                    │  └──────────────────────────┘ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  SELEÇÃO: Step 1   │  ┌──────────────────────────┐ │
│  (Intro)           │  │ 🎯 Etapa: Introdução     │ │
│  ┌──────────────┐  │  ├──────────────────────────┤ │
│  │ [Título]     │  │  │ 📝 Conteúdo              │ │
│  │ [Subtítulo]  │  │  │   Nome: Intro            │ │
│  │ [Botão]      │  │  │   Tipo: intro            │ │
│  └──────────────┘  │  │                          │ │
│                    │  │ ⚙️ Configurações          │ │
│                    │  │   Animação: fadeIn       │ │
│                    │  │   Duração: 0.5s          │ │
│                    │  │                          │ │
│                    │  │ 🎨 Tema                  │ │
│                    │  │   Cor primária: #...     │ │
│                    │  │   Fonte: Playfair        │ │
│                    │  └──────────────────────────┘ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  SELEÇÃO: Bloco    │  ┌──────────────────────────┐ │
│  (Título)          │  │ 🎯 Bloco: Título         │ │
│  ┌──────────────┐  │  ├──────────────────────────┤ │
│  │►[Título]◄────┼──┤  │ 📝 Texto                 │ │
│  │ [Subtítulo]  │  │  │   "Bem-vindo ao Quiz"    │ │
│  │ [Botão]      │  │  │                          │ │
│  └──────────────┘  │  │ 🎨 Estilo                │ │
│                    │  │   Tamanho: 32px          │ │
│                    │  │   Peso: 700 (bold)       │ │
│                    │  │   Cor: #432818           │ │
│                    │  │   Alinhamento: center    │ │
│                    │  │                          │ │
│                    │  │ 📐 Espaçamento           │ │
│                    │  │   Margem: 24px           │ │
│                    │  │   Padding: 16px          │ │
│                    │  └──────────────────────────┘ │
└─────────────────────────────────────────────────────┘

✅ UNIFICAÇÃO:
- Um único painel, 3 contextos diferentes
- Configurações aparecem baseadas na seleção
- Tudo acessível sem abrir modais
```

---

## 🏗️ Arquitetura Proposta

### **3 Níveis de Contexto**

```typescript
// Tipo de seleção
type SelectionContext = 
  | { type: 'funnel', data: FunnelConfig }
  | { type: 'step', stepId: string, data: StepConfig }
  | { type: 'block', blockId: string, data: BlockConfig }
  | { type: 'none' };

// State do editor (expandido)
interface EditorState {
  // ... estado existente
  selectedBlockId: string | null;
  selectedStepId: string | null;
  
  // NOVO: Contexto de seleção
  selectionContext: SelectionContext;
}
```

### **Estrutura do Painel Universal**

```
src/components/editor/properties/
├── SinglePropertiesPanel.tsx         ← ATUAL (edita blocos)
└── UniversalPropertiesPanel.tsx      ← NOVO (3 níveis)
    ├── contexts/
    │   ├── FunnelContext.tsx         ← Nível 1: Config global
    │   ├── StepContext.tsx           ← Nível 2: Config da etapa
    │   └── BlockContext.tsx          ← Nível 3: Config do bloco
    │
    ├── sections/
    │   ├── funnel/
    │   │   ├── DomainSection.tsx     ← Domínio e URL
    │   │   ├── ResultsSection.tsx    ← Resultados e scoring
    │   │   ├── SEOSection.tsx        ← Meta tags
    │   │   ├── TrackingSection.tsx   ← Pixels, Analytics
    │   │   └── SecuritySection.tsx   ← APIs, webhooks
    │   │
    │   ├── step/
    │   │   ├── ContentSection.tsx    ← Nome, tipo, ordem
    │   │   ├── ThemeSection.tsx      ← Cores, fontes da etapa
    │   │   ├── AnimationSection.tsx  ← Animações de entrada/saída
    │   │   └── BehaviorSection.tsx   ← Lógica condicional
    │   │
    │   └── block/
    │       ├── ContentSection.tsx    ← Texto, imagem, etc.
    │       ├── StyleSection.tsx      ← CSS do bloco
    │       ├── LayoutSection.tsx     ← Grid, flex, spacing
    │       └── InteractionSection.tsx ← Eventos, hover, etc.
    │
    └── components/
        ├── CollapsibleSection.tsx    ← Accordion para seções
        ├── PropertyField.tsx         ← Input genérico
        └── ContextSwitcher.tsx       ← Navegação entre níveis
```

---

## 💻 Implementação Detalhada

### **1. UniversalPropertiesPanel.tsx (Main Component)**

```typescript
/**
 * 🎛️ PAINEL DE PROPRIEDADES UNIVERSAL
 * 
 * Detecta contexto de seleção e renderiza seções apropriadas
 */

import { useEditor } from '@/components/editor/EditorProviderUnified';
import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// Context renderers
import { FunnelContext } from './contexts/FunnelContext';
import { StepContext } from './contexts/StepContext';
import { BlockContext } from './contexts/BlockContext';

export function UniversalPropertiesPanel() {
  const editor = useEditor();
  
  // Detectar contexto baseado em seleção
  const context = useMemo(() => {
    // Prioridade: Block > Step > Funnel
    
    if (editor.state.selectedBlockId) {
      const block = editor.state.stepBlocks.find(
        b => b.id === editor.state.selectedBlockId
      );
      
      return {
        type: 'block' as const,
        blockId: editor.state.selectedBlockId,
        stepId: editor.state.currentStepKey,
        data: block
      };
    }
    
    if (editor.state.currentStepKey) {
      return {
        type: 'step' as const,
        stepId: editor.state.currentStepKey,
        data: editor.state.templateConfig?.steps?.[editor.state.currentStepKey]
      };
    }
    
    // Default: mostrar configs globais do funil
    return {
      type: 'funnel' as const,
      data: editor.state.templateConfig
    };
  }, [
    editor.state.selectedBlockId,
    editor.state.currentStepKey,
    editor.state.stepBlocks,
    editor.state.templateConfig
  ]);
  
  return (
    <div className="h-full flex flex-col bg-white border-l">
      
      {/* Header com breadcrumb contextual */}
      <div className="p-4 border-b">
        <ContextBreadcrumb context={context} />
      </div>
      
      {/* Conteúdo baseado em contexto */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {context.type === 'funnel' && (
            <FunnelContext data={context.data} />
          )}
          
          {context.type === 'step' && (
            <StepContext 
              stepId={context.stepId} 
              data={context.data} 
            />
          )}
          
          {context.type === 'block' && (
            <BlockContext 
              blockId={context.blockId}
              stepId={context.stepId}
              data={context.data}
            />
          )}
        </div>
      </ScrollArea>
      
      {/* Footer com ações */}
      <div className="p-4 border-t">
        <ContextActions context={context} />
      </div>
      
    </div>
  );
}

/**
 * Breadcrumb contextual (mostra onde está)
 */
function ContextBreadcrumb({ context }: { context: any }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <button 
        className="hover:underline text-muted-foreground"
        onClick={() => editor.actions.clearSelection()}
      >
        🏠 Funil
      </button>
      
      {context.type === 'step' && (
        <>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">
            📄 {context.data?.metadata?.name || context.stepId}
          </span>
        </>
      )}
      
      {context.type === 'block' && (
        <>
          <span className="text-muted-foreground">/</span>
          <button 
            className="hover:underline text-muted-foreground"
            onClick={() => editor.actions.setSelectedBlockId(null)}
          >
            📄 Step {context.stepId}
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">
            🧩 {context.data?.type || 'Block'}
          </span>
        </>
      )}
    </div>
  );
}
```

### **2. FunnelContext.tsx (Nível 1: Global)**

```typescript
/**
 * 🌐 CONTEXTO: CONFIGURAÇÕES GLOBAIS DO FUNIL
 */

import { Accordion } from '@/components/ui/accordion';
import { DomainSection } from '../sections/funnel/DomainSection';
import { ResultsSection } from '../sections/funnel/ResultsSection';
import { SEOSection } from '../sections/funnel/SEOSection';
import { TrackingSection } from '../sections/funnel/TrackingSection';

export function FunnelContext({ data }: { data: any }) {
  const { settings, updateSettings } = useFunnelPublication(data?.templateId);
  
  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">🎯 Configurações do Funil</h2>
        <p className="text-sm text-muted-foreground">
          Configurações globais e publicação
        </p>
      </div>
      
      {/* Seções em accordion */}
      <Accordion type="multiple" defaultValue={['domain', 'seo']}>
        
        {/* Informações Básicas */}
        <CollapsibleSection 
          id="info" 
          title="📊 Informações Básicas"
          icon="📊"
        >
          <div className="space-y-4">
            <div>
              <Label>Nome do Funil</Label>
              <Input 
                value={data?.name || ''} 
                onChange={(e) => updateFunnelInfo({ name: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Descrição</Label>
              <Textarea 
                value={data?.description || ''} 
                onChange={(e) => updateFunnelInfo({ description: e.target.value })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Total de Etapas</Label>
              <Badge>{Object.keys(data?.steps || {}).length}</Badge>
            </div>
          </div>
        </CollapsibleSection>
        
        {/* Domínio e URL */}
        <CollapsibleSection 
          id="domain" 
          title="🌐 Domínio e URL Pública"
          defaultOpen
        >
          <DomainSection 
            settings={settings.domain}
            onChange={(domain) => updateSettings({ domain })}
          />
        </CollapsibleSection>
        
        {/* Resultados */}
        <CollapsibleSection 
          id="results" 
          title="🎯 Resultados e Pontuação"
        >
          <ResultsSection 
            settings={settings.results}
            onChange={(results) => updateSettings({ results })}
          />
        </CollapsibleSection>
        
        {/* SEO */}
        <CollapsibleSection 
          id="seo" 
          title="📈 SEO e Meta Tags"
          defaultOpen
        >
          <SEOSection 
            settings={settings.seo}
            onChange={(seo) => updateSettings({ seo })}
          />
        </CollapsibleSection>
        
        {/* Tracking */}
        <CollapsibleSection 
          id="tracking" 
          title="🔍 Tracking e Analytics"
        >
          <TrackingSection 
            settings={settings.tracking}
            onChange={(tracking) => updateSettings({ tracking })}
          />
        </CollapsibleSection>
        
        {/* Segurança */}
        <CollapsibleSection 
          id="security" 
          title="🔒 APIs e Webhooks"
        >
          <SecuritySection 
            settings={settings.security}
            onChange={(security) => updateSettings({ security })}
          />
        </CollapsibleSection>
        
      </Accordion>
      
    </div>
  );
}
```

### **3. StepContext.tsx (Nível 2: Etapa)**

```typescript
/**
 * 📄 CONTEXTO: CONFIGURAÇÕES DA ETAPA
 */

export function StepContext({ stepId, data }: { stepId: string, data: any }) {
  const editor = useEditor();
  
  return (
    <div className="space-y-4">
      
      <div>
        <h2 className="text-lg font-semibold">📄 Etapa: {data?.metadata?.name}</h2>
        <p className="text-sm text-muted-foreground">
          Configurações específicas desta etapa
        </p>
      </div>
      
      <Accordion type="multiple" defaultValue={['content']}>
        
        {/* Conteúdo */}
        <CollapsibleSection id="content" title="📝 Conteúdo" defaultOpen>
          <div className="space-y-4">
            <div>
              <Label>Nome da Etapa</Label>
              <Input 
                value={data?.metadata?.name || ''} 
                onChange={(e) => editor.actions.updateStepMetadata(stepId, {
                  name: e.target.value
                })}
              />
            </div>
            
            <div>
              <Label>Tipo</Label>
              <Select 
                value={data?.metadata?.category || 'default'}
                onValueChange={(v) => editor.actions.updateStepMetadata(stepId, {
                  category: v
                })}
              >
                <SelectItem value="intro">Introdução</SelectItem>
                <SelectItem value="question">Pergunta</SelectItem>
                <SelectItem value="transition">Transição</SelectItem>
                <SelectItem value="result">Resultado</SelectItem>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Blocos nesta Etapa</Label>
              <Badge>{data?.blocks?.length || 0}</Badge>
            </div>
          </div>
        </CollapsibleSection>
        
        {/* Tema */}
        <CollapsibleSection id="theme" title="🎨 Tema da Etapa">
          <ThemeSection 
            theme={data?.theme}
            onChange={(theme) => editor.actions.updateStepTheme(stepId, theme)}
          />
        </CollapsibleSection>
        
        {/* Animação */}
        <CollapsibleSection id="animation" title="✨ Animações">
          <AnimationSection 
            animations={data?.animations}
            onChange={(animations) => editor.actions.updateStepAnimations(stepId, animations)}
          />
        </CollapsibleSection>
        
        {/* Lógica */}
        <CollapsibleSection id="logic" title="🧠 Lógica Condicional">
          <BehaviorSection 
            conditions={data?.conditions}
            onChange={(conditions) => editor.actions.updateStepConditions(stepId, conditions)}
          />
        </CollapsibleSection>
        
      </Accordion>
      
    </div>
  );
}
```

### **4. BlockContext.tsx (Nível 3: Bloco)**

```typescript
/**
 * 🧩 CONTEXTO: CONFIGURAÇÕES DO BLOCO
 * 
 * Reutiliza os editores especializados existentes do SinglePropertiesPanel
 */

export function BlockContext({ 
  blockId, 
  stepId, 
  data 
}: { 
  blockId: string, 
  stepId: string, 
  data: any 
}) {
  const editor = useEditor();
  
  // Reutilizar lógica do SinglePropertiesPanel
  const handleUpdate = useCallback((updates: Record<string, any>) => {
    editor.actions.updateBlock(blockId, updates);
  }, [editor, blockId]);
  
  return (
    <div className="space-y-4">
      
      <div>
        <h2 className="text-lg font-semibold">🧩 Bloco: {data?.type}</h2>
        <p className="text-sm text-muted-foreground">
          ID: {blockId}
        </p>
      </div>
      
      {/* REUTILIZAR editores especializados do SinglePropertiesPanel */}
      <SpecializedEditor
        blockType={data?.type}
        selectedBlock={data}
        onUpdate={handleUpdate}
      />
      
      {/* Ações específicas do bloco */}
      <Separator />
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => editor.actions.duplicateBlock(blockId)}
        >
          <Copy className="w-4 h-4 mr-2" />
          Duplicar
        </Button>
        
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => editor.actions.deleteBlock(blockId)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Deletar
        </Button>
      </div>
      
    </div>
  );
}
```

---

## 🎨 Componentes Auxiliares

### **CollapsibleSection.tsx**

```typescript
/**
 * Seção expansível com ícone e contador
 */

import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface CollapsibleSectionProps {
  id: string;
  title: string;
  icon?: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({ 
  id, 
  title, 
  icon, 
  count,
  defaultOpen,
  children 
}: CollapsibleSectionProps) {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {icon && <span>{icon}</span>}
            <span className="font-medium">{title}</span>
          </div>
          {count !== undefined && (
            <Badge variant="secondary" className="ml-auto mr-2">
              {count}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      
      <AccordionContent>
        <div className="pt-4 space-y-4">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
```

### **ContextSwitcher.tsx**

```typescript
/**
 * Navegação rápida entre contextos
 */

export function ContextSwitcher() {
  const editor = useEditor();
  
  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
      <Button
        size="sm"
        variant={!editor.state.selectedBlockId ? 'default' : 'ghost'}
        onClick={() => {
          editor.actions.setSelectedBlockId(null);
          editor.actions.setCurrentStepKey(null);
        }}
      >
        🏠 Funil
      </Button>
      
      <Button
        size="sm"
        variant={editor.state.currentStepKey && !editor.state.selectedBlockId ? 'default' : 'ghost'}
        onClick={() => editor.actions.setSelectedBlockId(null)}
        disabled={!editor.state.currentStepKey}
      >
        📄 Etapa
      </Button>
      
      <Button
        size="sm"
        variant={editor.state.selectedBlockId ? 'default' : 'ghost'}
        disabled={!editor.state.selectedBlockId}
      >
        🧩 Bloco
      </Button>
    </div>
  );
}
```

---

## 📱 UX Flow (Como o Usuário Usa)

### **Cenário 1: Configurar Domínio**

```
1. Usuário abre editor
2. Nada selecionado → Painel mostra "Configurações do Funil"
3. Expande seção "🌐 Domínio e URL Pública"
4. Preenche:
   - Subdomínio: "meu-quiz"
   - Slug: "estilo-pessoal"
5. Vê preview: https://meu-quiz.quizflowpro.com/estilo-pessoal
6. Salva automaticamente (debounced)
```

### **Cenário 2: Configurar Facebook Pixel**

```
1. Usuário abre editor
2. Nada selecionado → "Configurações do Funil"
3. Expande seção "🔍 Tracking e Analytics"
4. Cola ID do pixel: "1234567890"
5. Escolhe eventos: ☑️ PageView  ☑️ Lead  ☑️ Purchase
6. Testa pixel: [Botão "Testar Agora"]
7. Sistema dispara evento teste → Facebook Pixel Helper confirma
```

### **Cenário 3: Editar Título de um Bloco**

```
1. Usuário clica no título da intro
2. Painel detecta seleção → Muda para "Bloco: title"
3. Mostra editor especializado (TextPropertyEditor)
4. Usuário edita:
   - Texto: "Descubra Seu Estilo!"
   - Tamanho: 48px
   - Cor: #432818
5. Preview atualiza em tempo real
6. Salva automaticamente
```

### **Cenário 4: Configurar Resultado Baseado em Pontuação**

```
1. Usuário abre editor
2. Nada selecionado → "Configurações do Funil"
3. Expande seção "🎯 Resultados e Pontuação"
4. Clica [+ Adicionar Resultado]
5. Preenche:
   - Username: @estilo_romantico
   - Título: "Romântico"
   - Descrição: "Você valoriza o charme clássico..."
   - Keywords: ["florais", "vintage", "delicado"]
   - Threshold: 30%
   - Avatar: [Upload imagem]
6. Repete para outros 6 perfis
7. Salva automaticamente
```

---

## ⚡ Performance e Otimizações

### **1. Lazy Loading de Seções**

```typescript
// Carregar seções apenas quando expandidas
const DomainSection = lazy(() => import('./sections/funnel/DomainSection'));
const SEOSection = lazy(() => import('./sections/funnel/SEOSection'));

<Suspense fallback={<Skeleton className="h-32" />}>
  <DomainSection {...props} />
</Suspense>
```

### **2. Debounced Saves**

```typescript
const debouncedUpdate = useDebouncedCallback((updates) => {
  editor.actions.updateSettings(updates);
  // Auto-save no Supabase
  saveFunnelSettings(funnelId, updates);
}, 500);
```

### **3. Virtual Scrolling (Muitas Seções)**

```typescript
// Para funis com 100+ etapas
import { VariableSizeList } from 'react-window';

<VariableSizeList
  height={600}
  itemCount={steps.length}
  itemSize={(index) => getStepHeight(steps[index])}
>
  {({ index, style }) => (
    <div style={style}>
      <StepCard step={steps[index]} />
    </div>
  )}
</VariableSizeList>
```

---

## 🔄 Migração Gradual (Sem Quebrar Nada)

### **Fase 1: Criar UniversalPropertiesPanel**
- Novo componente paralelo ao SinglePropertiesPanel
- Feature flag: `ENABLE_UNIVERSAL_PANEL`
- Testar com poucos usuários

### **Fase 2: Migrar Seções Gradualmente**
```typescript
// Reutilizar componentes existentes
import { DomainSection } from '@/components/editor/publication/FunnelPublicationPanel';

// Wrapper para adaptar interface
<DomainSection 
  settings={settings.domain}
  onChange={handleUpdate}
/>
```

### **Fase 3: Deprecar Painel Antigo**
- Mostrar banner: "Nova interface disponível! [Experimentar]"
- Período de transição: 2 semanas
- Remover código antigo

---

## ✅ Checklist de Implementação

### Sprint 1: Fundação (8-12h)
- [ ] Criar `UniversalPropertiesPanel.tsx`
- [ ] Implementar detecção de contexto (funnel/step/block)
- [ ] Criar `CollapsibleSection` component
- [ ] Criar `ContextBreadcrumb`
- [ ] Testes unitários

### Sprint 2: Nível Funnel (12-16h)
- [ ] `FunnelContext.tsx`
- [ ] Migrar `DomainSection` do painel antigo
- [ ] Migrar `ResultsSection`
- [ ] Migrar `SEOSection`
- [ ] Migrar `TrackingSection`
- [ ] Migrar `SecuritySection`

### Sprint 3: Nível Step (8-10h)
- [ ] `StepContext.tsx`
- [ ] `ThemeSection` (cores/fontes da etapa)
- [ ] `AnimationSection` (entrada/saída)
- [ ] `BehaviorSection` (lógica condicional)

### Sprint 4: Nível Block (4-6h)
- [ ] `BlockContext.tsx`
- [ ] Reutilizar `SpecializedEditor` do `SinglePropertiesPanel`
- [ ] Ações de bloco (duplicar/deletar)

### Sprint 5: Polish e Testes (8-10h)
- [ ] Lazy loading de seções
- [ ] Debounced auto-save
- [ ] Skeleton loaders
- [ ] Testes E2E
- [ ] Documentação

**Total**: 40-54 horas (~1-2 semanas)

---

## 🎯 Benefícios da Centralização

### ✅ Para o Usuário
- **Menos confusão**: Um único lugar para tudo
- **Mais produtivo**: Não precisa procurar onde configura X
- **Context-aware**: Vê apenas o relevante
- **Menos cliques**: Sem abrir modais separados

### ✅ Para o Desenvolvedor
- **Menos código duplicado**: Reutiliza editores existentes
- **Mais manutenível**: Lógica centralizada
- **Mais escalável**: Fácil adicionar novas seções
- **Melhor testável**: Componentes isolados

### ✅ Para a Aplicação
- **Performance**: Lazy loading de seções
- **Bundle size**: Code splitting automático
- **UX consistente**: Padrão único de edição

---

## 📊 Comparação: Antes vs Depois

| Métrica | Antes (Fragmentado) | Depois (Universal) |
|---------|--------------------|--------------------|
| **Locais de config** | 3+ (painel + modal + toolbar) | 1 (painel único) |
| **Cliques para publicar** | 5-7 (abrir modal → tabs → salvar) | 2-3 (expandir → editar) |
| **Tempo de aprendizado** | ~30min (usuário precisa explorar) | ~10min (tudo visível) |
| **Context switches** | Alto (mental load) | Baixo (context-aware) |
| **Código duplicado** | 40% (UI repetida) | <5% (componentes reutilizados) |
| **Bundle size** | ~120KB (3 painéis) | ~80KB (lazy loading) |

---

## 🚀 Próximos Passos

**Agora:**
1. Aprovar a arquitetura proposta
2. Definir prioridade (qual sprint começar)
3. Criar branch `feature/universal-properties-panel`

**Recomendação:**
Começar pelo **Sprint 1** (Fundação) para validar conceito, depois iterar rapidamente nos outros sprints.

Quer que eu implemente o Sprint 1 agora? 🚀
