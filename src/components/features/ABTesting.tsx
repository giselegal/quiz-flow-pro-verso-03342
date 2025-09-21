/**
 * 🧪 A/B TESTING SYSTEM - TESTES NATIVOS INTEGRADOS
 * 
 * Sistema nativo de A/B testing para otimização contínua
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FlaskConical, 
  TrendingUp, 
  Users, 
  Target,
  Play,
  Pause,
  RotateCcw,
  CheckCircle
} from 'lucide-react';

interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'completed' | 'paused';
  variants: ABVariant[];
  metrics: ABMetrics;
  created: number;
  startDate?: number;
  endDate?: number;
}

interface ABVariant {
  id: string;
  name: string;
  description: string;
  traffic: number; // percentage
  conversions: number;
  visitors: number;
  conversionRate: number;
  isControl: boolean;
}

interface ABMetrics {
  totalVisitors: number;
  totalConversions: number;
  overallConversionRate: number;
  confidence: number;
  winner?: string;
}

const ABTesting: React.FC = () => {
  const [tests, setTests] = useState<ABTest[]>([
    {
      id: 'test-1',
      name: 'Header CTA Optimization',
      description: 'Testando diferentes textos no botão principal',
      status: 'running',
      variants: [
        {
          id: 'control',
          name: 'Controle',
          description: 'Texto original: "Começar Agora"',
          traffic: 50,
          conversions: 47,
          visitors: 234,
          conversionRate: 20.1,
          isControl: true
        },
        {
          id: 'variant-a',
          name: 'Variante A', 
          description: 'Novo texto: "Criar Meu Funil"',
          traffic: 50,
          conversions: 62,
          visitors: 241,
          conversionRate: 25.7,
          isControl: false
        }
      ],
      metrics: {
        totalVisitors: 475,
        totalConversions: 109,
        overallConversionRate: 22.9,
        confidence: 94.2
      },
      created: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
      startDate: Date.now() - 5 * 24 * 60 * 60 * 1000
    },
    {
      id: 'test-2', 
      name: 'Color Scheme Impact',
      description: 'Comparando esquemas de cores na conversão',
      status: 'draft',
      variants: [
        {
          id: 'control-2',
          name: 'Azul Atual',
          description: 'Esquema azul padrão',
          traffic: 34,
          conversions: 0,
          visitors: 0,
          conversionRate: 0,
          isControl: true
        },
        {
          id: 'variant-b',
          name: 'Verde Confiança',
          description: 'Esquema verde para botões',
          traffic: 33,
          conversions: 0,
          visitors: 0,
          conversionRate: 0,
          isControl: false
        },
        {
          id: 'variant-c',
          name: 'Laranja Energia',
          description: 'Esquema laranja energético',
          traffic: 33,
          conversions: 0,
          visitors: 0,
          conversionRate: 0,
          isControl: false
        }
      ],
      metrics: {
        totalVisitors: 0,
        totalConversions: 0,
        overallConversionRate: 0,
        confidence: 0
      },
      created: Date.now() - 2 * 24 * 60 * 60 * 1000
    }
  ]);

  const [activeTest, setActiveTest] = useState<string>('test-1');

  const getStatusText = (status: ABTest['status']) => {
    switch (status) {
      case 'running': return 'Em Execução';
      case 'completed': return 'Finalizado';
      case 'paused': return 'Pausado';
      case 'draft': return 'Rascunho';
      default: return 'Desconhecido';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600';
    if (confidence >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleTestAction = (testId: string, action: 'start' | 'pause' | 'stop' | 'reset') => {
    setTests(prev => prev.map(test => {
      if (test.id !== testId) return test;
      
      switch (action) {
        case 'start':
          return { 
            ...test, 
            status: 'running', 
            startDate: Date.now() 
          };
        case 'pause':
          return { ...test, status: 'paused' };
        case 'stop':
          return { 
            ...test, 
            status: 'completed', 
            endDate: Date.now() 
          };
        case 'reset':
          return {
            ...test,
            status: 'draft',
            variants: test.variants.map(v => ({
              ...v,
              conversions: 0,
              visitors: 0,
              conversionRate: 0
            })),
            metrics: {
              totalVisitors: 0,
              totalConversions: 0,
              overallConversionRate: 0,
              confidence: 0
            }
          };
        default:
          return test;
      }
    }));
  };

  const getCurrentTest = () => {
    return tests.find(t => t.id === activeTest);
  };

  const currentTest = getCurrentTest();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FlaskConical className="w-6 h-6" />
            A/B Testing
          </h2>
          <p className="text-muted-foreground">
            Otimize conversões com testes controlados
          </p>
        </div>
        
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
          + Criar Novo Teste
        </Button>
      </div>

      {/* Tests Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tests.map((test) => (
          <Card 
            key={test.id}
            className={`cursor-pointer transition-all ${
              activeTest === test.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setActiveTest(test.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm">{test.name}</h3>
                <Badge 
                  variant={test.status === 'running' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {getStatusText(test.status)}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">
                {test.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Visitantes</span>
                  <span className="font-medium">{test.metrics.totalVisitors}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Conversões</span>
                  <span className="font-medium">{test.metrics.totalConversions}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Taxa</span>
                  <span className="font-medium">
                    {test.metrics.overallConversionRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View */}
      {currentTest && (
        <Tabs defaultValue="results" className="w-full">
          <TabsList>
            <TabsTrigger value="results">Resultados</TabsTrigger>
            <TabsTrigger value="variants">Variantes</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-4">
            {/* Test Controls */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{currentTest.name}</CardTitle>
                  <div className="flex gap-2">
                    {currentTest.status === 'draft' && (
                      <Button 
                        onClick={() => handleTestAction(currentTest.id, 'start')}
                        size="sm"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Iniciar
                      </Button>
                    )}
                    
                    {currentTest.status === 'running' && (
                      <>
                        <Button 
                          onClick={() => handleTestAction(currentTest.id, 'pause')}
                          size="sm"
                          variant="outline"
                        >
                          <Pause className="w-4 h-4 mr-1" />
                          Pausar
                        </Button>
                        <Button 
                          onClick={() => handleTestAction(currentTest.id, 'stop')}
                          size="sm"
                          variant="destructive"
                        >
                          Finalizar
                        </Button>
                      </>
                    )}
                    
                    {(currentTest.status === 'paused' || currentTest.status === 'completed') && (
                      <Button 
                        onClick={() => handleTestAction(currentTest.id, 'reset')}
                        size="sm"
                        variant="outline"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Resetar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Visitantes</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">
                    {currentTest.metrics.totalVisitors}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Conversões</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">
                    {currentTest.metrics.totalConversions}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Taxa Geral</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">
                    {currentTest.metrics.overallConversionRate.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">Confiança</span>
                  </div>
                  <p className={`text-2xl font-bold mt-1 ${getConfidenceColor(currentTest.metrics.confidence)}`}>
                    {currentTest.metrics.confidence.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Variants Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Comparação de Variantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentTest.variants.map((variant) => (
                    <div key={variant.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{variant.name}</h4>
                          {variant.isControl && (
                            <Badge variant="outline" className="text-xs">
                              Controle
                            </Badge>
                          )}
                          {currentTest.metrics.winner === variant.id && (
                            <Badge className="text-xs bg-green-500">
                              🏆 Vencedor
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {variant.conversionRate.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {variant.conversions}/{variant.visitors}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {variant.description}
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress value={variant.conversionRate} className="h-2" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {variant.traffic}% tráfego
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Variantes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configure as diferentes versões para teste...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Teste</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ajuste parâmetros e critérios do teste...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ABTesting;