import { useRoute } from 'wouter';

function ResultPage() {
  const [_match, params] = useRoute('/resultado/:resultId');
  const resultId = params?.resultId;

  return (
    <div style={{ backgroundColor: '#FAF9F7' }}>
      <div className="max-w-2xl mx-auto text-center">
        <h1 style={{ color: '#432818' }}>Página de Resultado</h1>
        <p style={{ color: '#6B4F43' }}>Resultado ID: {resultId}</p>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Seu Resultado</h2>
          <p style={{ color: '#6B4F43' }}>
            Esta é uma página de resultado de exemplo. O conteúdo seria carregado baseado no ID:{' '}
            {resultId}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
