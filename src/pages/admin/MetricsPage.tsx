import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Eye, 
  MousePointer,
  DollarSign,
  BarChart3,
  PieChart,
  Download,
  RefreshCw
} from 'lucide-react';
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Pie
} from 'recharts';

// Mock data for demonstration
const conversionsData = [
  { name: 'Jan', conversions: 65, visits: 1200, revenue: 4500 },
  { name: 'Fev', conversions: 78, visits: 1450, revenue: 5200 },
  { name: 'Mar', conversions: 92, visits: 1680, revenue: 6800 },
  { name: 'Abr', conversions: 85, visits: 1520, revenue: 6100 },
  { name: 'Mai', conversions: 108, visits: 1890, revenue: 7900 },
  { name: 'Jun', conversions: 125, visits: 2100, revenue: 9200 },
];

const funnelData = [
  { name: 'Visitantes', value: 2100, color: '#B89B7A' },
  { name: 'Quiz Iniciado', value: 1680, color: '#A88B6A' },
  { name: 'Quiz Concluído', value: 1260, color: '#8B7355' },
  { name: 'Resultado Visto', value: 945, color: '#6B4F43' },
  { name: 'Conversões', value: 125, color: '#432818' },
];

const MetricsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const metrics = {
    totalVisits: 12450,
    totalConversions: 553,
    conversionRate: 4.4,
    revenue: 39700,
    avgOrderValue: 71.80,
    visitsGrowth: 12.5,
    conversionsGrowth: 8.3,
    revenueGrowth: 15.2,
  };

  return (
    <div className="p-6 space-y-8" style={{ backgroundColor: '#FAF9F7', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1
            className="text-4xl font-bold text-[#432818]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Métricas e Analytics
          </h1>
          <p className="text-[#8F7A6A] mt-2 text-lg">
            Acompanhe o desempenho dos seus funis em tempo real
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 rounded-lg border"
            style={{ borderColor: '#D4C4A0', backgroundColor: '#FFFFFF' }}
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            style={{ borderColor: '#B89B7A', color: '#B89B7A' }}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button
            className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F7A6A]">Total de Visitas</p>
                <p className="text-3xl font-bold text-[#432818]">
                  {metrics.totalVisits.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">
                    +{metrics.visitsGrowth}%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: '#F3E8E6' }}>
                <Eye className="w-6 h-6" style={{ color: '#B89B7A' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F7A6A]">Conversões</p>
                <p className="text-3xl font-bold text-[#432818]">
                  {metrics.totalConversions}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">
                    +{metrics.conversionsGrowth}%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: '#F3E8E6' }}>
                <MousePointer className="w-6 h-6" style={{ color: '#B89B7A' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F7A6A]">Taxa de Conversão</p>
                <p className="text-3xl font-bold text-[#432818]">
                  {metrics.conversionRate}%
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">
                    +2.1%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: '#F3E8E6' }}>
                <BarChart3 className="w-6 h-6" style={{ color: '#B89B7A' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F7A6A]">Receita Total</p>
                <p className="text-3xl font-bold text-[#432818]">
                  R$ {metrics.revenue.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">
                    +{metrics.revenueGrowth}%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: '#F3E8E6' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#B89B7A' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conversions Over Time */}
        <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
          <CardHeader>
            <CardTitle className="text-[#432818] flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" style={{ color: '#B89B7A' }} />
              Evolução das Conversões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={conversionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5DDD5" />
                <XAxis dataKey="name" stroke="#8F7A6A" />
                <YAxis stroke="#8F7A6A" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #D4C4A0',
                    borderRadius: '8px'
                  }} 
                />
                <Area
                  type="monotone"
                  dataKey="conversions"
                  stroke="#B89B7A"
                  fill="#B89B7A"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Funnel Analysis */}
        <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
          <CardHeader>
            <CardTitle className="text-[#432818] flex items-center">
              <PieChart className="w-5 h-5 mr-2" style={{ color: '#B89B7A' }} />
              Análise do Funil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={funnelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
        <CardHeader>
          <CardTitle className="text-[#432818] flex items-center">
            <DollarSign className="w-5 h-5 mr-2" style={{ color: '#B89B7A' }} />
            Receita vs Visitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={conversionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DDD5" />
              <XAxis dataKey="name" stroke="#8F7A6A" />
              <YAxis yAxisId="left" stroke="#8F7A6A" />
              <YAxis yAxisId="right" orientation="right" stroke="#8F7A6A" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #D4C4A0',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Bar yAxisId="left" dataKey="visits" fill="#B89B7A" name="Visitas" />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="revenue" 
                stroke="#432818" 
                strokeWidth={3}
                name="Receita (R$)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-[#432818] mb-2">
              R$ {metrics.avgOrderValue.toFixed(2)}
            </div>
            <p className="text-sm text-[#8F7A6A]">Ticket Médio</p>
          </CardContent>
        </Card>

        <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-[#432818] mb-2">
              3.2 min
            </div>
            <p className="text-sm text-[#8F7A6A]">Tempo Médio no Quiz</p>
          </CardContent>
        </Card>

        <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-[#432818] mb-2">
              75%
            </div>
            <p className="text-sm text-[#8F7A6A]">Taxa de Conclusão</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetricsPage;