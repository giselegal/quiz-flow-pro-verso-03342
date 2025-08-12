import { getStep02Template } from '@/components/steps/Step02Template';

const TestStep02Direct: React.FC = () => {
  const step02Template = getStep02Template();
  const optionsBlock = step02Template.find(block => block.type === 'options-grid');

  console.log('🧪 TestStep02Direct:', {
    totalBlocks: step02Template.length,
    optionsBlock: optionsBlock,
    optionsBlockProperties: optionsBlock?.properties,
    optionsArray: optionsBlock?.properties?.options,
    optionsLength: optionsBlock?.properties?.options?.length,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Teste Direto Step02</h1>

      <div className="space-y-4">
        <div style={{ backgroundColor: '#FAF9F7' }}>
          <h2 className="font-bold">Template Data:</h2>
          <p>Total blocos: {step02Template.length}</p>
          <p>Options block encontrado: {optionsBlock ? '✅ Sim' : '❌ Não'}</p>
        </div>

        {optionsBlock && (
          <div className="bg-green-50 p-4 rounded">
            <h2 className="font-bold">Options Block:</h2>
            <p>ID: {optionsBlock.id}</p>
            <p>Tipo: {optionsBlock.type}</p>
            <p>Options length: {optionsBlock.properties?.options?.length || 0}</p>

            <div className="mt-4">
              <h3 className="font-semibold">Primeira opção:</h3>
              <pre className="text-xs bg-white p-2 rounded overflow-auto">
                {JSON.stringify(optionsBlock.properties?.options?.[0], null, 2)}
              </pre>
            </div>
          </div>
        )}

        {optionsBlock?.properties?.options && (
          <div style={{ backgroundColor: '#FAF9F7' }}>
            <h2 className="font-bold">Todas as Opções:</h2>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {optionsBlock.properties.options.map((option: any, index: number) => (
                <div key={index} className="bg-white p-2 rounded text-sm">
                  <p>
                    <strong>ID:</strong> {option.id}
                  </p>
                  <p>
                    <strong>Text:</strong> {option.text?.substring(0, 30)}...
                  </p>
                  <p>
                    <strong>Image:</strong> {option.imageUrl ? '✅' : '❌'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestStep02Direct;
