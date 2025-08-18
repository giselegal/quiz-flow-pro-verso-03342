// @ts-nocheck
/**
 * TESTE ESPECÍFICO PARA OPÇÕES DO STEP02
 * Arquivo para debug de renderização das opções
 */

import QuizOptionsGridBlock from '@/components/blocks/quiz/QuizOptionsGridBlock';

const TestOptionsRendering = () => {
  console.log('🔍 TESTE: Iniciando teste de renderização de opções');

  // TODO: Migrado para TemplateRenderer - remover se não necessário
  const optionsBlock = step02Template.find(block => block.type === 'options-grid');

  console.log('🔍 TESTE: Bloco de opções encontrado:', optionsBlock);
  console.log('🔍 TESTE: Propriedades do bloco:', optionsBlock?.properties);
  console.log('🔍 TESTE: Opções específicas:', optionsBlock?.properties?.options);

  if (!optionsBlock) {
    return (
      <div style={{ borderColor: '#E5DDD5' }}>
        <h2 className="text-red-800 font-bold">❌ ERRO: Bloco de opções não encontrado!</h2>
        <p style={{ color: '#432818' }}>Template Step02 não contém bloco options-grid</p>
        <pre className="mt-4 text-sm bg-red-100 p-2 rounded">
          {JSON.stringify(
            step02Template.map(b => ({ id: b.id, type: b.type })),
            null,
            2
          )}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div style={{ backgroundColor: '#FAF9F7' }}>
        <h2 className="text-blue-800 font-bold mb-2">🔍 DEBUG: Dados do Bloco</h2>
        <div className="text-sm space-y-2">
          <p>
            <strong>ID:</strong> {optionsBlock.id}
          </p>
          <p>
            <strong>Tipo:</strong> {optionsBlock.type}
          </p>
          <p>
            <strong>Número de opções:</strong> {optionsBlock.properties?.options?.length || 0}
          </p>
          <p>
            <strong>Primeira opção:</strong>
          </p>
          <pre style={{ backgroundColor: '#E5DDD5' }}>
            {JSON.stringify(optionsBlock.properties?.options?.[0], null, 2)}
          </pre>
        </div>
      </div>

      <div style={{ backgroundColor: '#FAF9F7' }}>
        <h2 className="font-bold mb-4">🎯 RENDERIZAÇÃO DO COMPONENTE:</h2>
        <QuizOptionsGridBlock
          id={optionsBlock.id}
          properties={optionsBlock.properties}
          onPropertyChange={(key, value) => {
            console.log('🔍 TESTE: Propriedade alterada:', key, value);
          }}
        />
      </div>
    </div>
  );
};

export default TestOptionsRendering;
