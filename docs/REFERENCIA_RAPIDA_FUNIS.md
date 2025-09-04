# 🚀 REFERÊNCIA RÁPIDA - SISTEMA DE FUNIS

## 📋 COMANDOS ESSENCIAIS

### 🔍 **Debug do Sistema**
```typescript
// Ver estado atual do funil
console.log('FunnelId atual:', getFunnelIdFromEnvOrStorage());

// Ver templates disponíveis
console.log('Templates:', Object.keys(FUNNEL_TEMPLATES));

// Ver blocos de uma etapa
console.log('Blocos step-1:', getTemplateBlocks('quiz-estilo-completo', 'step-1'));

// Debug completo do contexto
const { currentFunnelId, steps, loading, error } = useFunnels();
console.log('Context:', { currentFunnelId, steps: steps.length, loading, error });
```

### 🆔 **Trabalhar com IDs**
```typescript
// Obter ID do funil ativo
const funnelId = getFunnelIdFromEnvOrStorage();

// Mudar funil ativo
window.location.href = `/editor?funnel=novo-funil-id`;

// Salvar no localStorage
localStorage.setItem('editor:funnelId', 'meu-funil-123');

// Gerar ID único para novo funil
const newId = `funil-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
```

### 🎨 **Trabalhar com Templates**
```typescript
// Listar todos os templates
const templates = Object.keys(FUNNEL_TEMPLATES);

// Obter template específico
const template = FUNNEL_TEMPLATES['quiz-estilo-completo'];

// Obter blocos de uma etapa (com clone automático)
const blocks = getTemplateBlocks('quiz-estilo-completo', 'step-1');

// Verificar se template existe
const exists = !!FUNNEL_TEMPLATES[templateId];
```

### 🧩 **Manipular Blocos**
```typescript
// Clonar blocos manualmente (se necessário)
const cloneBlocks = (originalBlocks, templateId, stepId) => {
  return originalBlocks.map(block => ({
    ...block,
    id: `${templateId}-${stepId}-${block.id}`,
    content: { ...block.content },
    properties: { ...block.properties }
  }));
};

// Atualizar propriedades de um bloco
updateBlock(blockId, { backgroundColor: '#FF0000', text: 'Novo texto' });

// Adicionar novo bloco
addBlock(stageId, 'text-block');
```

## 🛠️ SNIPPETS ÚTEIS

### 📱 **Criar Novo Funil**
```typescript
async function createNewFunnel(templateId: string, name: string) {
  try {
    const newFunnelId = await funnelTemplateService.createFunnelFromTemplate(templateId, name);
    window.location.href = `/editor?funnel=${newFunnelId}`;
  } catch (error) {
    console.error('Erro ao criar funil:', error);
  }
}
```

### ✏️ **Setup do Editor**
```tsx
function MyEditor() {
  const funnelId = getFunnelIdFromEnvOrStorage();
  
  return (
    <FunnelsProvider debug={true}>
      <EditorProvider funnelId={funnelId}>
        <QuizFlowPage 
          mode="editor"
          template={QUIZ_STYLE_21_STEPS_TEMPLATE}
          onBlocksChange={(step, blocks) => {
            console.log(`Etapa ${step} atualizada:`, blocks.length, 'blocos');
          }}
        />
      </EditorProvider>
    </FunnelsProvider>
  );
}
```

### 🎯 **Carregar Funil Específico**
```typescript
function loadSpecificFunnel(funnelId: string) {
  // Método 1: URL
  window.location.href = `/editor?funnel=${funnelId}`;
  
  // Método 2: Programático
  const { setCurrentFunnelId } = useFunnels();
  setCurrentFunnelId(funnelId);
  
  // Método 3: localStorage + reload
  localStorage.setItem('editor:funnelId', funnelId);
  window.location.reload();
}
```

## 🔧 TROUBLESHOOTING

### ❗ **Problema: Funis compartilhando dados**
```typescript
// ✅ SOLUÇÃO: Verificar se getTemplateBlocks está clonando
const getTemplateBlocks = (templateId, stepId) => {
  const originalBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId] || [];
  
  // ✅ DEVE ter clone com IDs únicos
  return originalBlocks.map(block => ({
    ...block,
    id: `${templateId}-${stepId}-${block.id}`, // ID único!
    content: { ...block.content },
    properties: { ...block.properties }
  }));
};
```

### ❗ **Problema: Template não carrega**
```typescript
// 🔍 VERIFICAR: Template existe?
console.log('Template existe?', !!FUNNEL_TEMPLATES[templateId]);
console.log('Templates disponíveis:', Object.keys(FUNNEL_TEMPLATES));

// 🔍 VERIFICAR: Etapa existe?
console.log('Etapa existe?', !!QUIZ_STYLE_21_STEPS_TEMPLATE[stepId]);
console.log('Etapas disponíveis:', Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE));
```

### ❗ **Problema: ID undefined**
```typescript
// 🔍 VERIFICAR: Fontes de ID
console.log('Debugando IDs:', {
  url: new URL(window.location.href).searchParams.get('funnel'),
  localStorage: localStorage.getItem('editor:funnelId'),
  env: import.meta.env.VITE_DEFAULT_FUNNEL_ID,
  result: getFunnelIdFromEnvOrStorage()
});
```

## 📁 ARQUIVOS IMPORTANTES

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/context/FunnelsContext.tsx` | ⭐ Contexto principal |
| `src/templates/quiz21StepsComplete.ts` | ⭐ Template das 21 etapas |
| `src/utils/funnelIdentity.ts` | ⭐ Identificação de funis |
| `src/services/funnelTemplateService.ts` | ⭐ Criação de funis |
| `src/pages/MainEditor.tsx` | ⭐ Editor principal |
| `src/pages/admin/DashboardPage.tsx` | ⭐ Dashboard admin |

## 🎯 ROTAS PRINCIPAIS

| Rota | Função |
|------|--------|
| `/admin` | Dashboard administrativo |
| `/admin/funis` | Meus funis |
| `/editor` | Editor principal |
| `/editor?funnel=ID` | Editor com funil específico |
| `/quiz` | Versão de produção |

## 🧪 TESTES RÁPIDOS

### ✅ **Testar Isolamento de Funis**
```typescript
// 1. Criar dois funis do mesmo template
const funil1 = await createNewFunnel('quiz-estilo-completo', 'Funil 1');
const funil2 = await createNewFunnel('quiz-estilo-completo', 'Funil 2');

// 2. Editar o primeiro
window.location.href = `/editor?funnel=${funil1}`;
// Alterar algum bloco...

// 3. Verificar o segundo
window.location.href = `/editor?funnel=${funil2}`;
// Deve estar intocado!
```

### ✅ **Testar Performance**
```typescript
console.time('Template Load');
const blocks = getTemplateBlocks('quiz-estilo-completo', 'step-1');
console.timeEnd('Template Load'); // Deve ser < 10ms

console.log('Blocos carregados:', blocks.length);
console.log('Cada bloco tem ID único?', blocks.every(b => b.id.includes('quiz-estilo-completo')));
```

## 📊 MÉTRICAS DE SAÚDE

```typescript
function systemHealthCheck() {
  const health = {
    templates: Object.keys(FUNNEL_TEMPLATES).length,
    steps: Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length,
    currentFunnel: getFunnelIdFromEnvOrStorage(),
    cacheSize: Object.keys(localStorage).filter(k => k.startsWith('editor:')).length,
    memoryUsage: (performance as any).memory?.usedJSHeapSize || 'N/A'
  };
  
  console.log('🏥 System Health:', health);
  return health;
}
```

## 🚀 COMANDOS DE PRODUÇÃO

```bash
# Verificar servidor
npm run dev

# Build para produção  
npm run build

# Preview da build
npm run preview

# Limpar cache
rm -rf node_modules/.vite
```

---

**💡 Dica:** Use `systemHealthCheck()` no console para verificar rapidamente o estado do sistema!
