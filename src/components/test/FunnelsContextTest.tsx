import React from 'react';

export const FunnelsContextTest: React.FC = () => {
  console.log('🧪 FunnelsContextTest: Componente renderizado');

  const [testResult, setTestResult] = React.useState<{
    success: boolean;
    message: string;
    data?: any;
  }>({ success: false, message: 'Carregando...' });

  React.useEffect(() => {
    async function testContext() {
      try {
        // Importação dinâmica para evitar erros de build
        const { useFunnels } = await import('@/context/FunnelsContext');

        // Função que usa o hook
        const TestComponent = () => {
          const funnels = useFunnels();
          return {
            stepsLength: funnels.steps.length,
            currentFunnelId: funnels.currentFunnelId,
            loading: funnels.loading,
            error: funnels.error,
          };
        };

        // Este é um hack para testar o hook fora do render
        console.log('✅ Hook useFunnels importado com sucesso');
        setTestResult({
          success: true,
          message: 'FunnelsContext disponível para importação',
          data: { hookImported: true },
        });
      } catch (error) {
        console.error('❌ Erro ao importar useFunnels:', error);
        setTestResult({
          success: false,
          message: `Erro: ${error instanceof Error ? error.message : String(error)}`,
        });
      }
    }

    testContext();
  }, []);

  const bgColor = testResult.success
    ? 'bg-green-100 border-green-400'
    : 'bg-red-100 border-red-400';
  const textColor = testResult.success ? 'text-green-800' : 'text-red-800';
  const icon = testResult.success ? '✅' : '❌';

  return (
    <div className={`p-4 ${bgColor} border rounded mb-4`}>
      <h3 className={`font-bold ${textColor}`}>{icon} Teste FunnelsContext</h3>
      <p className={textColor}>{testResult.message}</p>
      {testResult.data && (
        <pre className="mt-2 text-sm">{JSON.stringify(testResult.data, null, 2)}</pre>
      )}
    </div>
  );
};
