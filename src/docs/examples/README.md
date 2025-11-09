# Demo Interativa - Sistema de Templates v3.1

## 🎯 Acesso

**URL:** [http://localhost:8080/demo/templates](http://localhost:8080/demo/templates)

## 📋 O que a Demo Demonstra

Esta demo interativa mostra todos os recursos do sistema de templates v3.1 implementado:

### 1. **React Query Hooks em Ação**
- `useTemplateStep` - Carregamento automático do step atual
- `usePrefetchTemplateStep` - Prefetch do próximo step ao navegar
- `usePrepareTemplate` - Preparação do template ao montar componente

### 2. **Estados de Loading**
- Skeleton loading enquanto carrega
- Error states com botão de retry
- Success states com preview dos blocos

### 3. **Navegação entre Steps**
- Botões de Anterior/Próximo
- Navegação por índice (1, 2, 3)
- Prefetch inteligente ao mudar de step

### 4. **Importação de Templates**
- Botão "Importar JSON" abre dialog
- Upload de arquivo JSON
- Validação Zod em tempo real
- Preview do template importado

### 5. **Cache Management**
- Botão "Invalidar Cache" para forçar refetch
- Visualização do estado de preparação do template
- Indicadores de steps carregados

## 🎨 Interface

### Cards de Status

1. **Template Status**
   - Estado de preparação (Preparando/Preparado)
   - Badge com ID do template
   - Indicador visual com ícone

2. **Step Atual**
   - Número do step (1/3)
   - ID do step
   - Contador de blocos

3. **Template Importado**
   - Nome do template importado
   - Número de steps
   - Versão do template

### Visualização de Blocos

Cada bloco exibe:
- Badge com número sequencial
- Tipo do bloco (IntroLogo, IntroTitle, etc.)
- ID único do bloco
- Order do bloco
- Config do bloco (JSON expandido)

### Controles de Navegação

- **Botão Anterior**: Volta para step anterior
- **Botões Numéricos**: Navegação direta por índice
- **Botão Próximo**: Avança para próximo step
- **Desabilitados automaticamente** nos extremos ou durante loading

## 🔧 Funcionalidades Técnicas

### Prefetch Inteligente

```typescript
// Prefetch próximo step ao mudar de step
useEffect(() => {
  const nextIndex = currentStepIndex + 1;
  if (nextIndex < DEMO_STEPS.length) {
    prefetchStep(DEMO_STEPS[nextIndex], { templateId: TEMPLATE_ID });
  }
}, [currentStepIndex]);
```

### Preparação de Template

```typescript
// Preparar template ao montar
useEffect(() => {
  prepareTemplate({
    templateId: TEMPLATE_ID,
    options: { preloadAll: false },
  });
}, []);
```

### Carregamento de Step

```typescript
const {
  data: blocks,
  isLoading,
  isError,
  error,
  refetch,
} = useTemplateStep(currentStepId, {
  templateId: TEMPLATE_ID,
  onSuccess: (data) => {
    console.log('✅ Step loaded:', currentStepId, data.length, 'blocks');
  },
});
```

## 📊 Console Logs

A demo gera logs úteis no console:

- `✅ Step loaded: step-01-intro 2 blocks` - Step carregado com sucesso
- `🔄 Prefetching next step: step-02-question` - Prefetch iniciado
- `✅ Template prepared successfully` - Template preparado
- `🔄 Cache invalidated` - Cache invalidado manualmente
- `📥 Template imported: { id, name, totalSteps }` - Template importado

## 🧪 Como Testar

### 1. Navegação Básica

1. Acesse `/demo/templates`
2. Observe o loading inicial
3. Navegue entre steps usando botões ou números
4. Observe o prefetch no console

### 2. Importação de Templates

1. Clique em "Importar JSON"
2. Arraste um arquivo JSON ou clique para selecionar
3. Observe a validação em tempo real
4. Clique em "Importar Template Completo"
5. Verifique o card "Template Importado" atualizado

### 3. Cache Management

1. Navegue entre alguns steps
2. Clique em "Invalidar Cache"
3. Observe o refetch automático
4. Console mostra "🔄 Cache invalidated"

### 4. Error Handling

1. Modifique temporariamente o step ID para um inválido
2. Observe a mensagem de erro
3. Clique em "Tentar Novamente"
4. Erro é tratado graciosamente

## 📁 Estrutura de Arquivos

```
src/
├── examples/
│   └── TemplateSystemDemo.tsx    # Componente principal da demo
├── pages/
│   ├── Home.tsx                  # Botão "Demo" adicionado no header
│   └── App.tsx                   # Rota /demo/templates configurada
├── services/
│   └── hooks/
│       ├── useTemplateStep.ts    # Hook usado na demo
│       ├── usePrepareTemplate.ts # Hook usado na demo
│       └── usePrefetchTemplateStep.ts # Hook usado na demo
└── components/
    └── editor/
        └── quiz/
            └── dialogs/
                └── ImportTemplateDialog.tsx # Dialog usado na demo
```

## 🎓 Aprendizados

### Para Desenvolvedores

- Como usar React Query hooks para templates
- Padrões de prefetch inteligente
- Gerenciamento de cache com React Query
- Tratamento de estados loading/error/success
- Integração com componentes de UI

### Para Usuários

- Como importar templates JSON customizados
- Como navegar entre steps de um quiz
- Como visualizar a estrutura de blocos
- Como o sistema gerencia cache automaticamente

## 🚀 Próximos Passos

Esta demo pode ser expandida com:

1. **Visualização 3D dos blocos** (preview real)
2. **Editor inline de blocos** (edição rápida)
3. **Export de templates** (baixar JSON)
4. **Comparação de templates** (diff visual)
5. **Metrics dashboard** (performance do cache)

## 📚 Documentação Relacionada

- [Sistema de Templates](../docs/TEMPLATE_SYSTEM.md)
- [React Query Hooks](../docs/REACT_QUERY_HOOKS.md)
- [Guia de Testes](../docs/TESTING_GUIDE.md)

---

**Última atualização:** 2025-11-07  
**Versão:** 1.0  
**Autor:** Sistema QuizFlow Pro
