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
  PlayCircle,
  Plus,
  Settings,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

// Import dos novos ícones temáticos
import {
  OfferPageIcon,
  MarketingQuizIcon,
  DigitalProductIcon,
  EcommerceIcon,
  BackgroundPattern,
} from '@/components/dashboard/TemplateIcons';

const OverviewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#FEFEFE] to-[#F5F2E9] p-6 space-y-8">
      {/* Header Moderno */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#B89B7A] to-[#432818] rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#432818] to-[#6B4F43] bg-clip-text text-transparent">
                Dashboard QuizFlow
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-gradient-to-r from-[#B89B7A]/20 to-[#432818]/20 text-[#432818] border-0 px-3 py-1">
                  <Crown className="h-3 w-3 mr-1" />
                  Pro Plan
                </Badge>
                <Badge
                  variant="outline"
                  className="border-[#B89B7A]/40 text-[#B89B7A] bg-[#B89B7A]/10"
                >
                  <Activity className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-lg text-[#6B4F43] max-w-2xl">
            Bem-vindo de volta! Aqui está um resumo da performance dos seus funnels e quizzes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-[#B89B7A]/40 text-[#432818] hover:bg-[#B89B7A]/10"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </Button>
          <Button
            variant="outline"
            className="border-[#B89B7A]/40 text-[#432818] hover:bg-[#B89B7A]/10"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button
            variant="outline"
            className="border-[#B89B7A]/40 text-[#432818] hover:bg-[#B89B7A]/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-gradient-to-r from-[#B89B7A] to-[#432818] hover:from-[#A08766] hover:to-[#3A1F0F] text-white shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Novo Quiz
          </Button>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card
          className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-[#FAF9F7] cursor-pointer"
          onClick={() => window.open('/editor-fixed-dragdrop', '_blank')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#432818]">Editor Visual</p>
                <p className="text-xs text-[#6B4F43] mt-1">Criar quiz com arrastar e soltar</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#432818] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-[#F5F2E9] cursor-pointer"
          onClick={() => window.open('/step/21', '_blank')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#432818]">Testar Etapa 21</p>
                <p className="text-xs text-[#6B4F43] mt-1">Página de oferta</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#A08766] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlayCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-[#F5F2E9] cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#432818]">Analytics</p>
                <p className="text-xs text-[#6B4F43] mt-1">Ver relatórios</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#A08766] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-[#F5F2E9] cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#432818]">A/B Tests</p>
                <p className="text-xs text-[#6B4F43] mt-1">Otimizar conversões</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#A08766] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-[#FAF9F7] cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#432818]">Configurações</p>
                <p className="text-xs text-[#6B4F43] mt-1">Personalizar conta</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#A08766] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>{' '}
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Interações */}
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-[#B89B7A]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#432818]">
              Interações Totais
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#432818] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#432818] mb-1">12,847</div>
            <div className="flex items-center text-sm mb-3">
              <ArrowUpRight className="h-4 w-4 text-[#B89B7A] mr-1" />
              <span className="text-[#B89B7A] font-semibold">+18.2%</span>
              <span className="ml-1 text-[#6B4F43]">vs mês anterior</span>
            </div>
            <div className="space-y-2">
              <Progress value={78} className="h-2 bg-[#FAF9F7]" />
              <p className="text-xs text-[#6B4F43]">78% da meta mensal</p>
            </div>
          </CardContent>
        </Card>

        {/* Taxa de Conversão */}
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-[#B89B7A]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#432818]">
              Taxa de Conversão
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#A08766] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#432818] mb-1">34.8%</div>
            <div className="flex items-center text-sm mb-3">
              <ArrowUpRight className="h-4 w-4 text-[#B89B7A] mr-1" />
              <span className="text-[#B89B7A] font-semibold">+5.7%</span>
              <span className="ml-1 text-[#6B4F43]">vs mês anterior</span>
            </div>
            <div className="space-y-2">
              <Progress value={89} className="h-2 bg-[#FAF9F7]" />
              <p className="text-xs text-[#6B4F43]">89% acima da média</p>
            </div>
          </CardContent>
        </Card>

        {/* Receita Gerada */}
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-[#B89B7A]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#432818]">Receita Gerada</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#432818] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#432818] mb-1">R$ 87.420</div>
            <div className="flex items-center text-sm mb-3">
              <ArrowUpRight className="h-4 w-4 text-[#B89B7A] mr-1" />
              <span className="text-[#B89B7A] font-semibold">+24.5%</span>
              <span className="ml-1 text-[#6B4F43]">vs mês anterior</span>
            </div>
            <div className="space-y-2">
              <Progress value={92} className="h-2 bg-[#FAF9F7]" />
              <p className="text-xs text-[#6B4F43]">92% da meta mensal</p>
            </div>
          </CardContent>
        </Card>

        {/* ROI Médio */}
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-[#B89B7A]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#432818]">ROI Médio</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#A08766] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#432818] mb-1">485%</div>
            <div className="flex items-center text-sm mb-3">
              <ArrowUpRight className="h-4 w-4 text-[#B89B7A] mr-1" />
              <span className="text-[#B89B7A] font-semibold">+12.3%</span>
              <span className="ml-1 text-[#6B4F43]">vs mês anterior</span>
            </div>
            <div className="space-y-2">
              <Progress value={95} className="h-2 bg-[#FAF9F7]" />
              <p className="text-xs text-[#6B4F43]">Excelente performance</p>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Seção de Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quizzes Recentes */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg bg-white border-[#B89B7A]/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-[#432818]">
                    Quizzes Recentes
                  </CardTitle>
                  <p className="text-sm text-[#6B4F43] mt-1">Seus funnels mais ativos</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#B89B7A]/40 text-[#432818] hover:bg-[#B89B7A]/10"
                >
                  Ver Todos
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quiz Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Template 1: Página de Oferta */}
                <div className="group relative overflow-hidden rounded-xl border border-[#B89B7A]/20 bg-gradient-to-br from-white via-[#FAF9F7] to-[#F5F2E9] p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                     onClick={() => window.open('/step/21', '_blank')}>
                  <BackgroundPattern variant="primary" />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#B89B7A] to-[#432818] rounded-xl flex items-center justify-center shadow-md">
                        <OfferPageIcon className="w-6 h-6" />
                      </div>
                      <Badge className="bg-[#B89B7A]/20 text-[#432818] border-0 text-xs px-2 py-1">
                        Demo
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-[#432818] text-lg mb-1">
                      Página de Oferta
                    </h3>
                    <p className="text-sm text-[#6B4F43] mb-3">
                      Sistema modular com 21 etapas otimizadas para conversão
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-[#6B4F43]">
                        <span className="flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          JSON
                        </span>
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          7 Módulos
                        </span>
                      </div>
                      <Button size="sm" variant="ghost" className="text-[#B89B7A] hover:bg-[#B89B7A]/10 h-8 px-3">
                        <PlayCircle className="h-3 w-3 mr-1" />
                        Testar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Template 2: Quiz de Marketing */}
                <div className="group relative overflow-hidden rounded-xl border border-[#B89B7A]/20 bg-gradient-to-br from-white via-[#FAF9F7] to-[#F5F2E9] p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <BackgroundPattern variant="secondary" />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#B89B7A] to-[#A08766] rounded-xl flex items-center justify-center shadow-md">
                        <MarketingQuizIcon className="w-6 h-6" />
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs px-2 py-1">
                        Ativo
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-[#432818] text-lg mb-1">
                      Quiz de Personalidade
                    </h3>
                    <p className="text-sm text-[#6B4F43] mb-3">
                      Segmentação inteligente para campanhas de marketing
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-[#6B4F43]">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          2.8k views
                        </span>
                        <span className="flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          38% CVR
                        </span>
                      </div>
                      <Button size="sm" variant="ghost" className="text-[#B89B7A] hover:bg-[#B89B7A]/10 h-8 px-3">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Template 3: Funil de Vendas */}
                <div className="group relative overflow-hidden rounded-xl border border-[#B89B7A]/20 bg-gradient-to-br from-white via-[#FAF9F7] to-[#F5F2E9] p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <BackgroundPattern variant="accent" />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#B89B7A] to-[#A08766] rounded-xl flex items-center justify-center shadow-md">
                        <DigitalProductIcon className="w-6 h-6" />
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs px-2 py-1">
                        Ativo
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-[#432818] text-lg mb-1">
                      Produto Digital
                    </h3>
                    <p className="text-sm text-[#6B4F43] mb-3">
                      Funil otimizado para vendas de infoprodutos
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-[#6B4F43]">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          1.5k views
                        </span>
                        <span className="flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          42% CVR
                        </span>
                      </div>
                      <Button size="sm" variant="ghost" className="text-[#B89B7A] hover:bg-[#B89B7A]/10 h-8 px-3">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Template 4: E-commerce */}
                <div className="group relative overflow-hidden rounded-xl border border-[#B89B7A]/20 bg-gradient-to-br from-white via-[#FAF9F7] to-[#F5F2E9] p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <BackgroundPattern variant="primary" />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#B89B7A]/80 to-[#A08766] rounded-xl flex items-center justify-center shadow-md">
                        <EcommerceIcon className="w-6 h-6" />
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs px-2 py-1">
                        Pausado
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-[#432818] text-lg mb-1">
                      Segmentação E-commerce
                    </h3>
                    <p className="text-sm text-[#6B4F43] mb-3">
                      Quiz para categorizar preferências de produtos
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-[#6B4F43]">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          987 views
                        </span>
                        <span className="flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          29% CVR
                        </span>
                      </div>
                      <Button size="sm" variant="ghost" className="text-[#B89B7A] hover:bg-[#B89B7A]/10 h-8 px-3">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-center pt-4 border-t border-[#B89B7A]/10">
                <Button 
                  variant="outline" 
                  className="border-[#B89B7A]/40 text-[#432818] hover:bg-[#B89B7A]/10"
                  onClick={() => window.open('/editor-fixed-dragdrop', '_blank')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Novo Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com Insights */}
        <div className="space-y-6">
          {/* Performance Insights */}
          <Card className="border-0 shadow-lg bg-white border-[#B89B7A]/20">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#432818] flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-[#B89B7A]" />
                Insights de Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-[#B89B7A]/10 rounded-lg border border-[#B89B7A]/20">
                <p className="text-sm font-medium text-[#432818]">🚀 Tendência Positiva</p>
                <p className="text-xs text-[#6B4F43] mt-1">
                  Suas conversões aumentaram 23% esta semana
                </p>
              </div>
              <div className="p-3 bg-[#B89B7A]/10 rounded-lg border border-[#B89B7A]/20">
                <p className="text-sm font-medium text-[#432818]">💡 Oportunidade</p>
                <p className="text-xs text-[#6B4F43] mt-1">
                  Quiz de Marketing tem potencial para 50% mais conversões
                </p>
              </div>
              <div className="p-3 bg-[#FAF9F7] rounded-lg border border-[#B89B7A]/30">
                <p className="text-sm font-medium text-[#B89B7A]">⚠️ Atenção</p>
                <p className="text-xs text-[#6B4F43] mt-1">
                  Quiz de E-commerce precisa de otimização
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Atividade Recente */}
          <Card className="border-0 shadow-lg bg-white border-[#B89B7A]/20">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#432818] flex items-center">
                <Clock className="h-5 w-5 mr-2 text-[#B89B7A]" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#B89B7A] rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-[#432818]">Novo lead capturado</p>
                  <p className="text-xs text-[#6B4F43]">Quiz de Marketing • há 5 min</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#B89B7A] rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-[#432818]">Conversão realizada</p>
                  <p className="text-xs text-[#6B4F43]">Funil de Vendas • há 12 min</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#B89B7A] rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-[#432818]">A/B Test iniciado</p>
                  <p className="text-xs text-[#6B4F43]">Quiz de Segmentação • há 1h</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#B89B7A] rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-[#432818]">Quiz publicado</p>
                  <p className="text-xs text-[#6B4F43]">Novo projeto • há 2h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* CTA Bottom */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-[#B89B7A] to-[#432818] text-white">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <h3 className="text-2xl font-bold mb-2">Pronto para criar seu próximo quiz?</h3>
              <p className="text-[#FAF9F7] text-lg">
                Use nossos templates otimizados e comece a converter em minutos
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-[#432818] hover:bg-[#FAF9F7]"
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
