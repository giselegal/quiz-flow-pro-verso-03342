import CreativePerformanceDashboard from '@/components/analytics/CreativePerformanceDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, RefreshCw, Settings, TestTube } from 'lucide-react';
import { JSX } from 'react';

const CreativeAnalyticsPage = (): JSX.Element => {
  const handleGenerateTestData = () => {
    // Simular dados de teste para demonstração
    const testData = [
      {
        event_name: 'PageView',
        timestamp: Date.now() - 3600000,
        date: new Date(Date.now() - 3600000).toISOString(),
        utm_content: 'elegante_mulher_vestido',
        utm_source: 'facebook',
        utm_campaign: 'quiz_style_test',
        utm_medium: 'cpc',
      },
      {
        event_name: 'QuizStart',
        timestamp: Date.now() - 3300000,
        date: new Date(Date.now() - 3300000).toISOString(),
        utm_content: 'elegante_mulher_vestido',
        utm_source: 'facebook',
        utm_campaign: 'quiz_style_test',
      },
      {
        event_name: 'Lead',
        timestamp: Date.now() - 3000000,
        date: new Date(Date.now() - 3000000).toISOString(),
        utm_content: 'elegante_mulher_vestido',
        utm_source: 'facebook',
        utm_campaign: 'quiz_style_test',
        email: 'teste1@email.com',
      },
      {
        event_name: 'Purchase',
        timestamp: Date.now() - 2700000,
        date: new Date(Date.now() - 2700000).toISOString(),
        utm_content: 'elegante_mulher_vestido',
        utm_source: 'facebook',
        utm_campaign: 'quiz_style_test',
        value: 297,
        currency: 'BRL',
      },
      // Dados para outro criativo
      {
        event_name: 'PageView',
        timestamp: Date.now() - 2400000,
        date: new Date(Date.now() - 2400000).toISOString(),
        utm_content: 'casual_jovem_jeans',
        utm_source: 'facebook',
        utm_campaign: 'quiz_style_test',
      },
      {
        event_name: 'QuizStart',
        timestamp: Date.now() - 2100000,
        date: new Date(Date.now() - 2100000).toISOString(),
        utm_content: 'casual_jovem_jeans',
        utm_source: 'facebook',
        utm_campaign: 'quiz_style_test',
      },
      {
        event_name: 'Lead',
        timestamp: Date.now() - 1800000,
        date: new Date(Date.now() - 1800000).toISOString(),
        utm_content: 'casual_jovem_jeans',
        utm_source: 'facebook',
        utm_campaign: 'quiz_style_test',
        email: 'teste2@email.com',
      },
      // Mais dados para criativo profissional
      {
        event_name: 'PageView',
        timestamp: Date.now() - 1500000,
        date: new Date(Date.now() - 1500000).toISOString(),
        utm_content: 'profissional_executiva',
        utm_source: 'facebook',
        utm_campaign: 'quiz_style_test',
      },
      {
        event_name: 'PageView',
        timestamp: Date.now() - 1200000,
        date: new Date(Date.now() - 1200000).toISOString(),
        utm_content: 'profissional_executiva',
        utm_source: 'facebook',
        utm_campaign: 'quiz_style_test',
      },
      {
        event_name: 'QuizStart',
        timestamp: Date.now() - 900000,
        date: new Date(Date.now() - 900000).toISOString(),
        utm_content: 'profissional_executiva',
        utm_source: 'facebook',
        utm_campaign: 'quiz_style_test',
      },
      {
        event_name: 'QuizComplete',
        timestamp: Date.now() - 600000,
        date: new Date(Date.now() - 600000).toISOString(),
        utm_content: 'profissional_executiva',
        utm_source: 'facebook',
        utm_campaign: 'quiz_style_test',
      },
      {
        event_name: 'Lead',
        timestamp: Date.now() - 300000,
        date: new Date(Date.now() - 300000).toISOString(),
        utm_content: 'profissional_executiva',
        utm_source: 'facebook',
        utm_campaign: 'quiz_style_test',
        email: 'teste3@email.com',
      },
      {
        event_name: 'Purchase',
        timestamp: Date.now() - 60000,
        date: new Date(Date.now() - 60000).toISOString(),
        utm_content: 'profissional_executiva',
        utm_source: 'facebook',
        utm_campaign: 'quiz_style_test',
        value: 297,
        currency: 'BRL',
      },
    ];

    // Salvar dados de teste
    localStorage.setItem('all_tracked_events', JSON.stringify(testData));

    // Mostrar mensagem de sucesso
    alert('✅ Dados de teste gerados! O dashboard será atualizado automaticamente.');

    // Forçar atualização da página
    window.location.reload();
  };

  const handleExportData = () => {
    const events = JSON.parse(localStorage.getItem('all_tracked_events') || '[]');
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `creative-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (
      window.confirm(
        '⚠️ Tem certeza que deseja limpar todos os dados de analytics? Esta ação não pode ser desfeita.'
      )
    ) {
      localStorage.removeItem('all_tracked_events');
      localStorage.removeItem('tracked_users');

      // Limpar dados de tracking de usuários individuais
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('user_tracking_')) {
          localStorage.removeItem(key);
        }
      });

      alert('🧹 Dados limpos! A página será recarregada.');
      window.location.reload();
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF9F7' }}>
      {/* Header com controles */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 style={{ color: '#432818' }}>Analytics de Criativos</h1>
              <p style={{ color: '#6B4F43' }}>
                Monitore a performance dos seus criativos em tempo real
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateTestData}
                className="flex items-center gap-2 bg-[#B89B7A]/10 hover:bg-[#B89B7A]/20 text-[#A38A69] border-[#B89B7A]/30"
              >
                <TestTube className="h-4 w-4" />
                Gerar Dados de Teste
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearData}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Limpar Dados
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="mb-6 bg-[#B89B7A]/10 border-[#B89B7A]/30">
          <CardHeader>
            <CardTitle className="text-[#432818]">
              🚀 Como Funciona o Tracking de Criativos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[#A38A69] space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">📊 Dados Rastreados:</h4>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>utm_content:</strong> Identifica o criativo específico
                  </li>
                  <li>
                    • <strong>PageView:</strong> Quantas pessoas chegaram à página
                  </li>
                  <li>
                    • <strong>QuizStart:</strong> Quantas iniciaram o quiz
                  </li>
                  <li>
                    • <strong>Lead:</strong> Quantas se tornaram leads
                  </li>
                  <li>
                    • <strong>Purchase:</strong> Quantas compraram
                  </li>
                </ul>
              </div>

              <div>
                <div className="font-semibold mb-2">🎯 URLs de Exemplo:</div>
                <div className="text-xs space-y-1 bg-[#B89B7A]/20 p-2 rounded">
                  <div>
                    <strong>Criativo A:</strong> ?utm_content=elegante_mulher_vestido
                  </div>
                  <div>
                    <strong>Criativo B:</strong> ?utm_content=casual_jovem_jeans
                  </div>
                  <div>
                    <strong>Criativo C:</strong> ?utm_content=profissional_executiva
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#B89B7A]/40">
              <p className="text-sm">
                <strong>💡 Dica:</strong> Use o botão "Gerar Dados de Teste" para ver o dashboard em
                ação, ou aguarde dados reais das suas campanhas aparecerem automaticamente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Principal */}
        <CreativePerformanceDashboard />
      </div>
    </div>
  );
};

export default CreativeAnalyticsPage;
