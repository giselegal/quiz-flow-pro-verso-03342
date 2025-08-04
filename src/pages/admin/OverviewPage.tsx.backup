import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  BarChart3,
  Zap,
} from "lucide-react";

const OverviewPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Visão geral do desempenho dos seus quizzes e campanhas
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Respostas
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18.2%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conversão
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Gerada
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 18.742</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">387%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+23.8%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance por Estilo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Romântico</span>
                <span>87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Elegante</span>
                <span>73%</span>
              </div>
              <Progress value={73} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sexy</span>
                <span>69%</span>
              </div>
              <Progress value={69} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Natural</span>
                <span>58%</span>
              </div>
              <Progress value={58} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Quiz "Descubra Seu Estilo" teve 127 novas respostas
                  </p>
                  <p className="text-sm text-gray-500">Há 2 horas</p>
                </div>
                <Badge variant="secondary">+127</Badge>
              </div>

              <div className="flex items-start space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Taxa de conversão aumentou para 24.3%
                  </p>
                  <p className="text-sm text-gray-500">Há 4 horas</p>
                </div>
                <Badge className="bg-green-100 text-green-800">+2.1%</Badge>
              </div>

              <div className="flex items-start space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Novo pico de vendas: R$ 2.847 em um dia
                  </p>
                  <p className="text-sm text-gray-500">Ontem</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Recorde</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status dos Quizzes */}
      <Card>
        <CardHeader>
          <CardTitle>Status dos Quizzes Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-green-700">Quizzes Ativos</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-sm text-yellow-700">Em Teste A/B</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-blue-700">Rascunhos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewPage;
