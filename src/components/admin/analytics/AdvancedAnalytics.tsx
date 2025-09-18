import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Dashboard de Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,234</div>
            <p style={{ color: '#6B4F43' }}>+12% desde o último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">567</div>
            <p style={{ color: '#6B4F43' }}>+8% desde o último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.6%</div>
            <p style={{ color: '#6B4F43' }}>-2% desde o último mês</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdvancedAnalytics: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Analytics Avançado</h2>
      <p style={{ color: '#6B4F43' }}>Sistema de analytics avançado em desenvolvimento...</p>
    </div>
  );
};

export default AdvancedAnalytics;
