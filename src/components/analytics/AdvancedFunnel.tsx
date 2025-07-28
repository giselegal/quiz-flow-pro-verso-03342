
"use client";
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, TrendingUp, Users, Clock, Target, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AdvancedFunnel: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  
  const mockFunnelData = [
    {
      stage: 'Visitantes',
      count: 10000,
      percentage: 100,
      conversionRate: 100,
      dropoffRate: 0,
      avgTimeSpent: '0:45',
      bounceRate: 35
    },
    {
      stage: 'Início do Quiz',
      count: 6500,
      percentage: 65,
      conversionRate: 65,
      dropoffRate: 35,
      avgTimeSpent: '1:20',
      bounceRate: 15
    },
    {
      stage: 'Primeira Pergunta',
      count: 5850,
      percentage: 58.5,
      conversionRate: 90,
      dropoffRate: 10,
      avgTimeSpent: '0:30',
      bounceRate: 8
    },
    {
      stage: 'Metade do Quiz',
      count: 4680,
      percentage: 46.8,
      conversionRate: 80,
      dropoffRate: 20,
      avgTimeSpent: '2:15',
      bounceRate: 12
    },
    {
      stage: 'Quiz Completo',
      count: 3744,
      percentage: 37.4,
      conversionRate: 80,
      dropoffRate: 20,
      avgTimeSpent: '4:30',
      bounceRate: 5
    },
    {
      stage: 'Página de Resultado',
      count: 3370,
      percentage: 33.7,
      conversionRate: 90,
      dropoffRate: 10,
      avgTimeSpent: '3:45',
      bounceRate: 25
    },
    {
      stage: 'Visualizou Oferta',
      count: 2359,
      percentage: 23.6,
      conversionRate: 70,
      dropoffRate: 30,
      avgTimeSpent: '2:20',
      bounceRate: 45
    },
    {
      stage: 'Clicou em Comprar',
      count: 472,
      percentage: 4.7,
      conversionRate: 20,
      dropoffRate: 80,
      avgTimeSpent: '1:15',
      bounceRate: 60
    },
    {
      stage: 'Conversão Final',
      count: 189,
      percentage: 1.9,
      conversionRate: 40,
      dropoffRate: 60,
      avgTimeSpent: '5:00',
      bounceRate: 20
    }
  ];

  const conversionTrends = [
    { date: '01/11', overall: 1.5, quiz: 37.4, offer: 4.7 },
    { date: '08/11', overall: 1.8, quiz: 39.2, offer: 5.1 },
    { date: '15/11', overall: 1.6, quiz: 36.8, offer: 4.3 },
    { date: '22/11', overall: 2.1, quiz: 41.5, offer: 5.8 },
    { date: '29/11', overall: 1.9, quiz: 37.4, offer: 4.7 }
  ];

  const deviceBreakdown = [
    { name: 'Mobile', value: 65, color: '#8884d8' },
    { name: 'Desktop', value: 28, color: '#82ca9d' },
    { name: 'Tablet', value: 7, color: '#ffc658' }
  ];

  const criticalDropoffs = useMemo(() => {
    return mockFunnelData
      .filter(stage => stage.dropoffRate > 25)
      .sort((a, b) => b.dropoffRate - a.dropoffRate);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Funil Avançado</h2>
          <p className="text-gray-600">Análise detalhada do comportamento dos usuários</p>
        </div>
        
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(period)}
            >
              {period === '7d' && '7 dias'}
              {period === '30d' && '30 dias'}
              {period === '90d' && '90 dias'}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="stages">Etapas</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="optimization">Otimização</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão Geral</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.9%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  +0.3% vs mês anterior
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conclusão do Quiz</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">37.4%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  -2.1% vs mês anterior
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18m 45s</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  +1m 20s vs média
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Maior Abandono</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">80%</div>
                <p className="text-xs text-muted-foreground">Oferta → Compra</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Funil de Conversão</CardTitle>
                <CardDescription>Progressão dos usuários através das etapas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFunnelData.map((stage, index) => (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{stage.stage}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{stage.count.toLocaleString()}</span>
                          <Badge variant={stage.dropoffRate > 30 ? 'destructive' : 'secondary'}>
                            {stage.percentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={stage.percentage} className="h-2" />
                      {index > 0 && stage.dropoffRate > 20 && (
                        <p className="text-xs text-red-600">
                          ⚠️ Alto abandono: {stage.dropoffRate}%
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Dispositivo</CardTitle>
                <CardDescription>Como os usuários acessam o quiz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deviceBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise Detalhada por Etapa</CardTitle>
              <CardDescription>Métricas específicas de cada ponto do funil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Etapa</th>
                      <th className="text-right p-2">Usuários</th>
                      <th className="text-right p-2">Taxa Conversão</th>
                      <th className="text-right p-2">Taxa Abandono</th>
                      <th className="text-right p-2">Tempo Médio</th>
                      <th className="text-right p-2">Taxa Rejeição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockFunnelData.map((stage, index) => (
                      <tr key={stage.stage} className="border-b">
                        <td className="p-2 font-medium">{stage.stage}</td>
                        <td className="p-2 text-right">{stage.count.toLocaleString()}</td>
                        <td className="p-2 text-right">
                          <Badge variant={stage.conversionRate < 50 ? 'destructive' : 'secondary'}>
                            {stage.conversionRate}%
                          </Badge>
                        </td>
                        <td className="p-2 text-right">
                          <Badge variant={stage.dropoffRate > 30 ? 'destructive' : 'secondary'}>
                            {stage.dropoffRate}%
                          </Badge>
                        </td>
                        <td className="p-2 text-right">{stage.avgTimeSpent}</td>
                        <td className="p-2 text-right">{stage.bounceRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolução das Conversões</CardTitle>
              <CardDescription>Tendências das principais métricas ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={conversionTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="overall" 
                      stroke="#8884d8" 
                      name="Conversão Geral (%)"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="quiz" 
                      stroke="#82ca9d" 
                      name="Conclusão Quiz (%)"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="offer" 
                      stroke="#ffc658" 
                      name="Cliques Oferta (%)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Pontos Críticos
                </CardTitle>
                <CardDescription>Etapas com maior necessidade de otimização</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criticalDropoffs.map((stage) => (
                    <div key={stage.stage} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{stage.stage}</h4>
                        <Badge variant="destructive">{stage.dropoffRate}% abandono</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {stage.count.toLocaleString()} usuários • {stage.avgTimeSpent} tempo médio
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Sugestões de melhoria:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {stage.stage.includes('Oferta') && (
                            <>
                              <li>• Revisar copy da proposta de valor</li>
                              <li>• Adicionar prova social (depoimentos)</li>
                              <li>• Testar diferentes designs de CTA</li>
                            </>
                          )}
                          {stage.stage.includes('Quiz') && (
                            <>
                              <li>• Simplificar perguntas complexas</li>
                              <li>• Adicionar barra de progresso</li>
                              <li>• Melhorar tempo de carregamento</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendações de A/B Tests</CardTitle>
                <CardDescription>Testes sugeridos para melhorar conversões</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Teste 1: Página de Oferta</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Testar diferentes headlines na proposta de valor
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline">Headline Atual</Badge>
                      <Badge variant="outline">Headline Emocional</Badge>
                      <Badge variant="outline">Headline com Urgência</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Teste 2: CTA Buttons</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Comparar cores e textos dos botões de ação
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline">Azul Padrão</Badge>
                      <Badge variant="outline">Verde Urgência</Badge>
                      <Badge variant="outline">Laranja Destaque</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Teste 3: Quiz Flow</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Testar diferentes sequências de perguntas
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline">Sequência Atual</Badge>
                      <Badge variant="outline">Perguntas Fáceis Primeiro</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedFunnel;
