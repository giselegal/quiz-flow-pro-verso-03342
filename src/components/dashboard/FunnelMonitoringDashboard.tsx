
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, TrendingUp, AlertTriangle } from 'lucide-react';

interface FunnelStatus {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'error';
  url: string;
  visitors: number;
  conversions: number;
  lastActivity: Date;
}

export const FunnelMonitoringDashboard: React.FC = () => {
  const [funnels, setFunnels] = useState<FunnelStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar status dos funis
    loadFunnelStatus();
  }, []);

  const loadFunnelStatus = async () => {
    // Simular carregamento
    setTimeout(() => {
      setFunnels([
        {
          id: 'style-quiz-main',
          name: 'Quiz de Estilo Principal',
          status: 'active',
          url: 'https://quiz.caktoquiz.com/estilo',
          visitors: 1247,
          conversions: 312,
          lastActivity: new Date()
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Funis Publicados</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Funil
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funis Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 desde ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Hoje</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% desde ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25.4%</div>
            <p className="text-xs text-muted-foreground">+3.2% desde ontem</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnels.map((funnel) => (
              <div key={funnel.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge 
                    variant={funnel.status === 'active' ? 'default' : 'destructive'}
                  >
                    {funnel.status === 'active' ? 'Ativo' : 'Erro'}
                  </Badge>
                  <div>
                    <h3 className="font-medium">{funnel.name}</h3>
                    <p className="text-sm text-muted-foreground">{funnel.url}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{funnel.visitors} visitantes</p>
                    <p className="text-sm text-muted-foreground">{funnel.conversions} conversões</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
