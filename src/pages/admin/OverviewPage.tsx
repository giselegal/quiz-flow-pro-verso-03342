import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  ChevronRight,
  Clock,
  Crown,
  DollarSign,
  Download,
  Eye,
  Filter,
  Globe,
  Heart,
  Lightbulb,
  PlayCircle,
  Plus,
  Settings,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

const OverviewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6 space-y-8">
      {/* Header Moderno */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Dashboard QuizFlow
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 px-3 py-1">
                  <Crown className="h-3 w-3 mr-1" />
                  Pro Plan
                </Badge>
                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                  <Activity className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl">
            Bem-vindo de volta! Aqui está um resumo da performance dos seus funnels e quizzes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </Button>
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Novo Quiz
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card
          className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-blue-50/30 cursor-pointer"
          onClick={() => window.open('/editor-fixed-dragdrop', '_blank')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Editor Visual</p>
                <p className="text-xs text-slate-500 mt-1">Criar quiz com arrastar e soltar</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-purple-50/30 cursor-pointer"
          onClick={() => window.open('/step/21', '_blank')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Testar Etapa 21</p>
                <p className="text-xs text-slate-500 mt-1">Página de oferta</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlayCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-purple-50/30 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Analytics</p>
                <p className="text-xs text-slate-500 mt-1">Ver relatórios</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-green-50/30 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">A/B Tests</p>
                <p className="text-xs text-slate-500 mt-1">Otimizar conversões</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-orange-50/30 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Configurações</p>
                <p className="text-xs text-slate-500 mt-1">Personalizar conta</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Interações */}
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Interações Totais
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">12,847</div>
            <div className="flex items-center text-sm mb-3">
              <ArrowUpRight className="h-4 w-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-semibold">+18.2%</span>
              <span className="ml-1 text-slate-500">vs mês anterior</span>
            </div>
            <div className="space-y-2">
              <Progress value={78} className="h-2 bg-slate-100" />
              <p className="text-xs text-slate-500">78% da meta mensal</p>
            </div>
          </CardContent>
        </Card>

        {/* Taxa de Conversão */}
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Taxa de Conversão
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">34.8%</div>
            <div className="flex items-center text-sm mb-3">
              <ArrowUpRight className="h-4 w-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-semibold">+5.7%</span>
              <span className="ml-1 text-slate-500">vs mês anterior</span>
            </div>
            <div className="space-y-2">
              <Progress value={89} className="h-2 bg-slate-100" />
              <p className="text-xs text-slate-500">89% acima da média</p>
            </div>
          </CardContent>
        </Card>

        {/* Receita Gerada */}
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Receita Gerada</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">R$ 87.420</div>
            <div className="flex items-center text-sm mb-3">
              <ArrowUpRight className="h-4 w-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-semibold">+24.5%</span>
              <span className="ml-1 text-slate-500">vs mês anterior</span>
            </div>
            <div className="space-y-2">
              <Progress value={92} className="h-2 bg-slate-100" />
              <p className="text-xs text-slate-500">92% da meta mensal</p>
            </div>
          </CardContent>
        </Card>

        {/* ROI Médio */}
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">ROI Médio</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">485%</div>
            <div className="flex items-center text-sm mb-3">
              <ArrowUpRight className="h-4 w-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-semibold">+12.3%</span>
              <span className="ml-1 text-slate-500">vs mês anterior</span>
            </div>
            <div className="space-y-2">
              <Progress value={95} className="h-2 bg-slate-100" />
              <p className="text-xs text-slate-500">Excelente performance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quizzes Recentes */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    Quizzes Recentes
                  </CardTitle>
                  <p className="text-sm text-slate-600 mt-1">Seus funnels mais ativos</p>
                </div>
                <Button variant="outline" size="sm" className="border-slate-300 text-slate-700">
                  Ver Todos
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quiz Item - Oferta Etapa 21 */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Página de Oferta - Etapa 21 (Modular)
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                      <span className="flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        Sistema JSON Completo
                      </span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />7 Componentes Modulares
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-100 text-blue-700 border-0">Demo</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('/step/21', '_blank')}
                  >
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Testar
                  </Button>
                </div>
              </div>

              {/* Quiz Item */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Quiz de Personalidade - Marketing
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        2,847 visualizações
                      </span>
                      <span className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        38% conversão
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-700 border-0">Ativo</Badge>
                  <Button size="sm" variant="outline">
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                </div>
              </div>

              {/* Quiz Item 2 */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Funil de Vendas - Produto Digital
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        1,523 visualizações
                      </span>
                      <span className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        42% conversão
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-700 border-0">Ativo</Badge>
                  <Button size="sm" variant="outline">
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                </div>
              </div>

              {/* Quiz Item 3 */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Quiz de Segmentação - E-commerce
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        987 visualizações
                      </span>
                      <span className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        29% conversão
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-yellow-100 text-yellow-700 border-0">Pausado</Badge>
                  <Button size="sm" variant="outline">
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com Insights */}
        <div className="space-y-6">
          {/* Performance Insights */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                Insights de Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-900">🚀 Tendência Positiva</p>
                <p className="text-xs text-blue-700 mt-1">
                  Suas conversões aumentaram 23% esta semana
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm font-medium text-green-900">💡 Oportunidade</p>
                <p className="text-xs text-green-700 mt-1">
                  Quiz de Marketing tem potencial para 50% mais conversões
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-sm font-medium text-orange-900">⚠️ Atenção</p>
                <p className="text-xs text-orange-700 mt-1">
                  Quiz de E-commerce precisa de otimização
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Atividade Recente */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-purple-600" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Novo lead capturado</p>
                  <p className="text-xs text-slate-500">Quiz de Marketing • há 5 min</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Conversão realizada</p>
                  <p className="text-xs text-slate-500">Funil de Vendas • há 12 min</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">A/B Test iniciado</p>
                  <p className="text-xs text-slate-500">Quiz de Segmentação • há 1h</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Quiz publicado</p>
                  <p className="text-xs text-slate-500">Novo projeto • há 2h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Bottom */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <h3 className="text-2xl font-bold mb-2">Pronto para criar seu próximo quiz?</h3>
              <p className="text-blue-100 text-lg">
                Use nossos templates otimizados e comece a converter em minutos
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => window.open('/editor-fixed-dragdrop', '_blank')}
              >
                <Plus className="h-5 w-5 mr-2" />
                Editor Visual
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => window.open('/step/21', '_blank')}
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Testar Etapa 21
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Eye className="h-5 w-5 mr-2" />
                Ver Templates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewPage;
