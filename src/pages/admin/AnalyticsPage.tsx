import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Target, Eye, Clock } from "lucide-react";

const AnalyticsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold text-[#432818]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Analytics & Métricas
        </h1>
        <p className="text-[#8F7A6A] mt-2">
          Análise detalhada do desempenho dos seus quizzes e funis
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">Visitantes Únicos</CardTitle>
            <Users className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">3,542</div>
            <p className="text-xs text-green-600">+15.2% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">24.8%</div>
            <p className="text-xs text-green-600">+3.1% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">Pageviews</CardTitle>
            <Eye className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">12,847</div>
            <p className="text-xs text-green-600">+8.7% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">4:23</div>
            <p style={{ color: "#432818" }}>-0:12 vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">R$ 28,945</div>
            <p className="text-xs text-green-600">+22.4% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Análise por Funil */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#432818]">Performance por Funil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-[#D4C4A0] rounded-lg">
              <div>
                <h3 className="font-semibold text-[#432818]">Funil de Descoberta de Estilo</h3>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-[#8F7A6A]">2,847 visitantes</span>
                  <Badge style={{ backgroundColor: "#E5DDD5" }}>87.2% conversão</Badge>
                  <span className="text-[#8F7A6A]">R$ 18,745 receita</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">+15.8%</div>
                <div className="text-xs text-[#8F7A6A]">vs período anterior</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
