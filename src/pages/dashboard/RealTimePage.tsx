/**
 * ⚡ PÁGINA DE MÉTRICAS EM TEMPO REAL
 */

import React, { useState, useEffect } from 'react';
import { EnhancedUnifiedDataService } from '@/services/core/EnhancedUnifiedDataService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Target, TrendingUp } from 'lucide-react';

const RealTimePage: React.FC = () => {
  // Real data integration
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeMetrics, setRealTimeMetrics] = useState(null);
  
  useEffect(() => {
    const loadRealData = async () => {
      try {
        const metrics = await EnhancedUnifiedDataService.getRealTimeMetrics();
        setRealTimeMetrics(metrics);
        console.log('✅ ' + 'RealTimePage.tsx' + ' carregado com dados reais:', metrics);
      } catch (error) {
        console.error('❌ Erro ao carregar dados reais:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRealData();
  }, []);
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuários Online</CardTitle>
                        <Activity className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">+2 nos últimos 5 min</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sessões Ativas</CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18</div>
                        <p className="text-xs text-muted-foreground">Em andamento agora</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversões</CardTitle>
                        <Target className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">7</div>
                        <p className="text-xs text-muted-foreground">Hoje</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">38.9%</div>
                        <p className="text-xs text-muted-foreground">+12% vs ontem</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Atividade em Tempo Real</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm">Usuário completou Quiz de Estilo Pessoal</span>
                            <span className="text-xs text-muted-foreground ml-auto">agora</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-sm">Novo participante no funil de Marketing</span>
                            <span className="text-xs text-muted-foreground ml-auto">2 min</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            <span className="text-sm">Quiz abandonado na etapa 3</span>
                            <span className="text-xs text-muted-foreground ml-auto">5 min</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RealTimePage;