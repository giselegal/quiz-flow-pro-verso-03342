import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Crown,
  DollarSign,
  Download,
  Eye,
  Filter,
  Heart,
  MousePointer,
  Share,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const OverviewPage: React.FC = () => {
  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 min-h-screen">
      {/* Header sofisticado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-indigo-800 bg-clip-text text-transparent">
              QuizFlow Dashboard
            </h1>
            <Badge variant="secondary" style={{ color: "#6B4F43" }}>
              <Crown className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          </div>
          <p className="text-slate-600 text-lg">
            Transforme dados em insights • Simplifique • Interaja • Converta
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-300 hover:border-indigo-300">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" className="border-slate-300 hover:border-indigo-300">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
            <Share className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>

      {/* Métricas Principais com design sofisticado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Respostas */}
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Interações Totais
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 mb-1">12,847</div>
            <div className="flex items-center text-sm">
              <ArrowUpRight className="h-4 w-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-semibold">+18.2%</span>
              <span className="text-slate-500 ml-1">vs mês anterior</span>
            </div>
            <div className="mt-3">
              <Progress value={78} className="h-2" />
              <p className="text-xs text-slate-500 mt-1">78% da meta mensal</p>
            </div>
          </CardContent>
        </Card>

        {/* Taxa de Conversão */}
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-green-100 hover:from-emerald-100 hover:to-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Taxa de Conversão
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 mb-1">34.8%</div>
            <div className="flex items-center text-sm">
              <ArrowUpRight className="h-4 w-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-semibold">+5.7%</span>
              <span className="text-slate-500 ml-1">vs mês anterior</span>
            </div>
            <div className="mt-3">
              <Progress value={89} className="h-2" />
              <p className="text-xs text-slate-500 mt-1">89% acima da média</p>
            </div>
          </CardContent>
        </Card>

        {/* Receita Gerada */}
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-orange-100 hover:from-amber-100 hover:to-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Receita Gerada</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 mb-1">R$ 87.420</div>
            <div className="flex items-center text-sm">
              <ArrowUpRight className="h-4 w-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-semibold">+24.5%</span>
              <span className="text-slate-500 ml-1">vs mês anterior</span>
            </div>
            <div className="mt-3">
              <Progress value={92} className="h-2" />
              <p className="text-xs text-slate-500 mt-1">92% da meta mensal</p>
            </div>
          </CardContent>
        </Card>

        {/* ROI Médio */}
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-100 hover:from-purple-100 hover:to-violet-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">ROI Médio</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 mb-1">487%</div>
            <div className="flex items-center text-sm">
              <ArrowUpRight className="h-4 w-4 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-semibold">+31.2%</span>
              <span className="text-slate-500 ml-1">vs mês anterior</span>
            </div>
            <div className="mt-3">
              <Progress value={95} className="h-2" />
              <p className="text-xs text-slate-500 mt-1">Performance excepcional</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Analytics Avançado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance por Estilo */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <BarChart3 style={{ color: "#B89B7A" }} />
              Performance por Categoria
              <Badge style={{ color: "#6B4F43" }}>Tempo Real</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {/* Estilo Elegante */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"></div>
                <div>
                  <div className="font-semibold text-slate-800">Estilo Elegante</div>
                  <div className="text-sm text-slate-500">2,847 interações</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-800">42.3%</div>
                <div className="text-xs text-emerald-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +5.2%
                </div>
              </div>
            </div>

            {/* Estilo Casual */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></div>
                <div>
                  <div className="font-semibold text-slate-800">Estilo Casual</div>
                  <div className="text-sm text-slate-500">1,923 interações</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-800">28.7%</div>
                <div className="text-xs text-emerald-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +3.1%
                </div>
              </div>
            </div>

            {/* Estilo Criativo */}
            <div style={{ borderColor: "#E5DDD5" }}>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full"></div>
                <div>
                  <div className="font-semibold text-slate-800">Estilo Criativo</div>
                  <div className="text-sm text-slate-500">1,654 interações</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-800">19.4%</div>
                <div style={{ color: "#432818" }}>
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  -1.2%
                </div>
              </div>
            </div>

            {/* Outros estilos */}
            <div style={{ borderColor: "#E5DDD5" }}>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                <div>
                  <div className="font-semibold text-slate-800">Outros Estilos</div>
                  <div className="text-sm text-slate-500">823 interações</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-800">9.6%</div>
                <div className="text-xs text-emerald-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +2.3%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Funis de Alto Performance */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Sparkles style={{ color: "#B89B7A" }} />
              Top Funis da Semana
              <Badge style={{ color: "#6B4F43" }}>Hot</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {/* Funil 1 */}
            <div className="group p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/50 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-slate-800">Quiz de Estilo Pessoal</div>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                  <Heart className="h-3 w-3 mr-1" />
                  Top 1
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">847 conversões • 38.2% taxa</span>
                <span className="text-emerald-600 font-semibold">R$ 23.420</span>
              </div>
              <Progress value={87} className="mt-2 h-1.5" />
            </div>

            {/* Funil 2 */}
            <div className="group p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-slate-800">Descubra sua Personalidade</div>
                <Badge style={{ backgroundColor: "#E5DDD5" }}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Hot
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">623 conversões • 31.4% taxa</span>
                <span className="text-emerald-600 font-semibold">R$ 18.790</span>
              </div>
              <Progress value={74} className="mt-2 h-1.5" />
            </div>

            {/* Funil 3 */}
            <div style={{ borderColor: "#E5DDD5" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-slate-800">Quiz Profissional</div>
                <Badge style={{ color: "#6B4F43" }}>
                  <MousePointer className="h-3 w-3 mr-1" />
                  Rising
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">435 conversões • 28.7% taxa</span>
                <span className="text-emerald-600 font-semibold">R$ 12.350</span>
              </div>
              <Progress value={61} className="mt-2 h-1.5" />
            </div>

            <div className="pt-2">
              <Button variant="outline" style={{ backgroundColor: "#FAF9F7" }}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Todos os Funis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights e Recomendações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights Rápidos */}
        <Card className="lg:col-span-2 border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-emerald-50 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Zap className="h-5 w-5 text-emerald-600" />
              Insights Inteligentes
              <Badge className="ml-auto bg-emerald-100 text-emerald-700 border-0">IA</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mt-1">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 mb-1">Performance Excepcional</div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Seus quizzes de estilo pessoal estão <strong>38% acima</strong> da média do
                      setor. Continue investindo nesta categoria para maximizar ROI.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl">
                <div className="flex items-start gap-3">
                  <div style={{ backgroundColor: "#FAF9F7" }}>
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 mb-1">
                      Oportunidade de Crescimento
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Identificamos <strong>2.3k usuários</strong> que não completaram o quiz. Uma
                      campanha de remarketing pode recuperar até 25% destes leads.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ borderColor: "#E5DDD5" }}>
                <div className="flex items-start gap-3">
                  <div style={{ backgroundColor: "#FAF9F7" }}>
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 mb-1">Otimização Sugerida</div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Adicione uma pergunta sobre orçamento no início dos quizzes para
                      <strong>aumentar qualificação</strong> dos leads em até 15%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-violet-50 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <MousePointer className="h-5 w-5 text-violet-600" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 justify-start">
                <Sparkles className="h-4 w-4 mr-2" />
                Criar Novo Quiz
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-slate-300 hover:border-emerald-300 hover:bg-emerald-50"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Relatório Detalhado
              </Button>

              <Button variant="outline" style={{ backgroundColor: "#FAF9F7" }}>
                <Share className="h-4 w-4 mr-2" />
                Compartilhar Dashboard
              </Button>

              <Button variant="outline" style={{ backgroundColor: "#FAF9F7" }}>
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Análise
              </Button>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200/50 rounded-xl">
              <div className="text-center">
                <Crown className="h-6 w-6 text-violet-600 mx-auto mb-2" />
                <div className="font-semibold text-slate-800 text-sm">QuizFlow Pro</div>
                <div className="text-xs text-slate-600 mt-1">
                  Desbloqueie analytics avançados, A/B testing e integrações premium
                </div>
                <Button
                  size="sm"
                  className="mt-3 w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-xs"
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
