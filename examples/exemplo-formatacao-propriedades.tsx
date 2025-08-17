// ANTES da formatação Prettier:
const ComponenteAntes = () => (
  <OptimizedPropertiesPanel
    block={{
      id: 'test',
      type: 'button',
      content: { text: 'Click me', color: 'blue', size: 'large', disabled: false },
    }}
    blockDefinition={getBlockDefinition('button')}
    onUpdateBlock={(id, updates) => {
      console.log(id, updates);
    }}
    onClose={() => setSelectedBlockId(null)}
  />
);

// DEPOIS da formatação Prettier:
const ComponenteDepois = () => (
  <OptimizedPropertiesPanel
    block={{
      id: 'test',
      type: 'button',
      content: {
        text: 'Click me',
        color: 'blue',
        size: 'large',
        disabled: false,
      },
    }}
    blockDefinition={getBlockDefinition('button')}
    onUpdateBlock={(id, updates) => {
      console.log(id, updates);
    }}
    onClose={() => setSelectedBlockId(null)}
  />
);
