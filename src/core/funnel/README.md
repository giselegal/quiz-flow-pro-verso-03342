# 🏗️ FUNNEL CORE ARCHITECTURE

## Visão Geral

Esta é a nova arquitetura core para o sistema de funis, completamente separada da lógica de quiz para melhor organização e manutenibilidade.

## 🎯 Objetivos

1. **Separação de Responsabilidades**: Funis e quizzes são sistemas distintos
2. **Centralização**: Toda lógica de funil em um local organizado
3. **Reutilização**: Hooks e componentes especializados
4. **Escalabilidade**: Arquitetura preparada para crescimento
5. **Manutenibilidade**: Código limpo e bem documentado

## 📁 Estrutura

```
src/core/funnel/
├── types.ts              # Tipos centralizados
├── FunnelCore.ts          # Núcleo central
├── FunnelEngine.ts        # Motor de processamento
├── hooks/                 # Hooks especializados
│   ├── useFunnel.ts       # Hook principal
│   ├── useFunnelState.ts  # Estado e persistência
│   ├── useFunnelTemplates.ts # Templates
│   └── index.ts           # Exportações
└── index.ts               # Exportação principal
```

## 🔧 Componentes Principais

### FunnelCore
- **Responsabilidade**: Lógica central do sistema
- **Funcionalidades**:
  - Navegação entre passos
  - Validação de componentes
  - Cálculo de progresso
  - Sistema de eventos
  - Condições e regras

### FunnelEngine
- **Responsabilidade**: Processamento de ações
- **Funcionalidades**:
  - Reducer de estado
  - Actions creators
  - Lifecycle management
  - Error handling

### Hooks Especializados
- **useFunnel**: Hook principal para gerenciar funis
- **useFunnelState**: Estado, persistência e analytics
- **useFunnelTemplates**: Gerenciamento de templates

## 🚀 Como Usar

### Exemplo Básico

```typescript
import { useFunnel, FunnelState } from '@/core/funnel';

const initialState: FunnelState = {
  id: 'my-funnel',
  metadata: { /* ... */ },
  steps: [ /* ... */ ],
  currentStep: 'step-1',
  // ...
};

function MyFunnelComponent() {
  const {
    state,
    progress,
    navigation,
    goForward,
    goBackward,
    updateData
  } = useFunnel(initialState, {
    autoSave: true,
    onComplete: (data) => console.log('Completed!', data)
  });

  return (
    <div>
      <h2>Progresso: {progress.percentage}%</h2>
      
      <button 
        onClick={goBackward}
        disabled={!navigation.canGoBackward}
      >
        Anterior
      </button>
      
      <button 
        onClick={goForward}
        disabled={!navigation.canGoForward}
      >
        Próximo
      </button>
    </div>
  );
}
```

### Templates

```typescript
import { useFunnelTemplates } from '@/core/funnel';

function TemplatesComponent() {
  const {
    templates,
    filteredTemplates,
    createTemplate,
    filterByCategory
  } = useFunnelTemplates({
    category: 'lifestyle',
    includeOfficial: true
  });

  return (
    <div>
      {filteredTemplates.map(template => (
        <div key={template.id}>
          <h3>{template.name}</h3>
          <p>{template.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Estado Avançado

```typescript
import { useFunnelState, useFunnelAnalytics } from '@/core/funnel';

function AdvancedFunnelComponent() {
  const {
    state,
    dispatch,
    clone,
    serialize
  } = useFunnelState(initialState, {
    autoSave: true,
    debounceMs: 1000
  });

  const { analytics, getReport } = useFunnelAnalytics(state);

  return (
    <div>
      <p>Tempo gasto: {analytics.timeSpent}ms</p>
      <p>Taxa de conclusão: {analytics.completionRate}%</p>
      
      <button onClick={() => {
        const report = getReport();
        console.log('Analytics Report:', report);
      }}>
        Ver Relatório
      </button>
    </div>
  );
}
```

## 📊 Tipos Principais

### FunnelState
Estado principal do funil contendo todos os dados necessários.

### FunnelStep
Representa um passo individual no funil com componentes e configurações.

### FunnelComponent
Componente individual dentro de um passo (inputs, grids, etc.).

### FunnelAction
Ações que podem ser executadas no funil (navegação, atualização de dados, etc.).

## 🎨 Features

### ✅ Navegação Inteligente
- Navegação baseada em condições
- Validação automática antes de avançar
- Histórico de navegação
- Suporte a saltos diretos

### ✅ Validação Robusta
- Validação por passo e componente
- Regras customizáveis
- Mensagens de erro específicas
- Validação em tempo real

### ✅ Sistema de Eventos
- Eventos centralizados
- Listeners customizáveis
- Rastreamento de ações
- Debugging facilitado

### ✅ Persistência Automática
- Auto-save configurável
- Histórico de mudanças
- Serialização/deserialização
- Recovery de estado

### ✅ Analytics Integrado
- Métricas de tempo
- Taxa de conclusão
- Pontos de abandono
- Relatórios detalhados

## 🔄 Migração

### Do Sistema Antigo
1. Identifique componentes que usam funis
2. Substitua hooks antigos pelos novos
3. Adapte tipos e interfaces
4. Teste funcionalities

### Compatibilidade
- A nova arquitetura é compatível com o sistema atual
- Migração pode ser gradual
- Mantém funcionalidades existentes

## 📝 Próximos Passos

1. **Integração**: Conectar com componentes UI existentes
2. **Migração**: Adaptar serviços para nova arquitetura
3. **Testes**: Implementar testes unitários e integração
4. **Documentação**: Expandir documentação com exemplos

## 🤝 Contribuindo

1. Mantenha a separação entre quiz e funnel
2. Use TypeScript rigorosamente
3. Documente funções públicas
4. Adicione testes para novas features
5. Siga padrões de nomenclatura

## 📚 Referencias

- [Arquitetura Original](../../../FUNNEL_SYSTEM_MAPPING.md)
- [Tipos Core](./types.ts)
- [Exemplos de Uso](./hooks/)
