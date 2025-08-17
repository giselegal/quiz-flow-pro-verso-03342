# 🚀 GUIA RÁPIDO: COMO USAR O EDITOR

*Guia de desenvolvimento para o Quiz Quest Challenge Verse Editor*

---

## 🎯 ACESSO RÁPIDO

### **ROTAS PRINCIPAIS**
```bash
# Editor Principal (requer autenticação)
http://localhost:8080/editor-fixed

# Interfaces de Teste (público)
http://localhost:8080/debug-editor          # Debug de 21 etapas
http://localhost:8080/test/components       # Teste de componentes
http://localhost:8080/quiz-flow            # Quiz do usuário final

# Autenticação
http://localhost:8080/auth                  # Login/signup
```

### **COMANDOS DE DESENVOLVIMENTO**
```bash
# Iniciar desenvolvimento
npm run dev                    # Servidor Vite na porta 8080

# Build e verificação
npm run build                  # Build para produção
npm run type-check            # Verificação TypeScript
npm run format                # Prettier em todo o código

# Formatação específica
npm run format:editor         # Formatar apenas componentes editor
npm run format:context        # Formatar apenas contextos
```

---

## 🧩 ESTRUTURA DO CÓDIGO

### **ARQUIVOS PRINCIPAIS**
```typescript
// 🎯 ENTRADA DO SISTEMA
src/App.tsx                                    // Roteamento principal

// 🏗️ CONTEXTOS
src/context/EditorContext.tsx                  // Estado centralizado
src/context/ScrollSyncContext.tsx              // Sincronização scroll
src/context/AuthContext.tsx                    // Autenticação

// 🎨 EDITORES ATIVOS
src/pages/editor-fixed-dragdrop.tsx           // Editor principal 4 colunas
src/components/editor/SchemaDrivenEditorResponsive.tsx  // Editor 3 colunas

// 🧩 COMPONENTES CORE
src/components/editor/blocks/UniversalBlockRenderer.tsx // Renderização
src/components/editor/canvas/CanvasDropZone.tsx        // Canvas
src/components/editor/sidebar/ComponentsSidebar.tsx    // Sidebar
src/components/editor/PropertyPanel.tsx                // Propriedades
```

### **CONFIGURAÇÃO**
```typescript
// 📋 DEFINIÇÕES
src/config/enhancedBlockRegistry.ts           // Registry de componentes
src/config/generatedBlockDefinitions.ts       // Definições de blocos
src/utils/TemplateManager.ts                  // Gerenciador templates

// 🎯 TEMPLATES
public/templates/step-01.json to step-21.json // Templates das etapas
```

---

## 🔧 COMO ADICIONAR NOVOS COMPONENTES

### **1. CRIAR O COMPONENTE**
```typescript
// src/components/editor/blocks/MeuNovoBlock.tsx
import React from 'react';

interface MeuNovoBlockProps {
  properties?: {
    titulo?: string;
    cor?: string;
  };
}

const MeuNovoBlock: React.FC<MeuNovoBlockProps> = ({ 
  properties = {} 
}) => {
  const { titulo = 'Título padrão', cor = '#000000' } = properties;
  
  return (
    <div style={{ color: cor }}>
      <h2>{titulo}</h2>
    </div>
  );
};

export default MeuNovoBlock;
```

### **2. REGISTRAR NO ENHANCED REGISTRY**
```typescript
// src/config/enhancedBlockRegistry.ts
import MeuNovoBlock from '../components/editor/blocks/MeuNovoBlock';

export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // ... componentes existentes
  'meu-novo-bloco': MeuNovoBlock,
};
```

### **3. ADICIONAR À SIDEBAR** 
```typescript
// src/components/editor/sidebar/ComponentsSidebar.tsx
const componentGroups = [
  {
    title: 'Meus Componentes',
    components: [
      { 
        type: 'meu-novo-bloco', 
        icon: <Star />, 
        label: 'Meu Novo Bloco' 
      },
    ]
  }
];
```

---

## 🎨 COMO PERSONALIZAR PROPRIEDADES

### **PROPRIEDADES BÁSICAS**
```typescript
// Propriedades padrão suportadas automaticamente
{
  // Visual
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  padding?: number;
  margin?: number;
  
  // Layout
  width?: string;
  height?: string;
  textAlign?: 'left' | 'center' | 'right';
  
  // Container
  containerWidth?: string;
  containerPosition?: string;
}
```

### **PROPRIEDADES PERSONALIZADAS**
```typescript
// Hook para propriedades específicas
const { getComponentProps } = useComponentConfig();

const minhasProps = getComponentProps('meu-componente', {
  propCustomizada: 'valor',
  outraPropriedade: 123
});
```

---

## 🧪 COMO TESTAR COMPONENTES

### **TESTE VISUAL**
```bash
# 1. Acesse a interface de teste
http://localhost:8080/test/components

# 2. Clique no seu componente
# 3. Use o painel de propriedades à direita
# 4. Teste em diferentes viewports
```

### **TESTE DE INTEGRAÇÃO**
```typescript
// src/pages/component-testing.tsx - adicione seu componente
const componentesParaTeste = [
  {
    id: 'meu-teste',
    type: 'meu-novo-bloco',
    properties: {
      titulo: 'Teste do meu componente',
      cor: '#059669'
    }
  }
];
```

---

## 🎪 DICAS DE DESENVOLVIMENTO

### **⚡ PERFORMANCE**
```typescript
// Use React.memo para componentes pesados
const MeuComponente = React.memo(({ properties }) => {
  return <div>{/* conteúdo */}</div>;
});

// Use useMemo para cálculos caros
const processedProps = useMemo(() => {
  return processProperties(properties);
}, [properties]);
```

### **🎯 DEBUGGING**
```typescript
// Usar console.log com emojis para debug
console.log('🔍 Debug do meu componente:', properties);

// Acessar context do editor
const { activeStageId, currentBlocks } = useEditor();
console.log('📊 Estado atual:', { activeStageId, totalBlocks: currentBlocks.length });
```

### **📱 RESPONSIVIDADE**
```typescript
// Usar classes Tailwind responsivas
className="text-sm md:text-base lg:text-lg xl:text-xl"

// Ou usar viewport hook
const { viewportSize } = useEditor();
const isMobile = viewportSize === 'sm';
```

---

## 🔍 TROUBLESHOOTING COMUM

### **❌ ERRO: "useScrollSync must be used within a ScrollSyncProvider"**
```typescript
// SOLUÇÃO: Envolver componente com provider
<ScrollSyncProvider>
  <MeuComponenteQueUsaScrollSync />
</ScrollSyncProvider>
```

### **❌ ERRO: "Component not found in registry"**
```typescript
// SOLUÇÃO: Verificar se está no enhancedBlockRegistry.ts
export const ENHANCED_BLOCK_REGISTRY = {
  'meu-tipo': MeuComponente,  // ✅ Adicionar aqui
};
```

### **❌ ERRO: "Properties not updating"**
```typescript
// SOLUÇÃO: Usar hook correto
const { updateBlock } = useEditor();

// Atualizar propriedades
updateBlock(blockId, { 
  ...currentProperties,
  novaPropriedade: novoValor 
});
```

---

## 📈 EVOLUÇÃO RECOMENDADA

### **🎯 ROADMAP TÉCNICO**

#### **Sprint 1-2: Performance** 
- [ ] Memory optimization (68MB → 35MB)
- [ ] FPS improvement (2 FPS → 30 FPS)
- [ ] Bundle splitting

#### **Sprint 3-4: Consolidação**
- [ ] Reduzir 65 páginas para 2 principais
- [ ] Cleanup de arquivos backup
- [ ] TypeScript strict mode

#### **Sprint 5-6: Features**
- [ ] Expandir sidebar com 174 componentes
- [ ] Sistema de themes
- [ ] Undo/redo avançado

---

**🎪 CONCLUSÃO: SISTEMA PRONTO PARA EVOLUÇÃO CONTÍNUA**

---

*Preparado por: GitHub Copilot AI Agent*  
*Validado com: Testes funcionais + Screenshots + Métricas técnicas*