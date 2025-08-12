import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Play, Pause, BarChart3, Eye } from "lucide-react";

const ABTestPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1
            className="text-3xl font-bold text-[#432818]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Testes A/B
          </h1>
          <p className="text-[#8F7A6A] mt-2">
            Configure e monitore testes A/B para otimizar conversões
          </p>
        </div>
        <Button className="bg-[#B89B7A] hover:bg-[#A0895B] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Teste A/B
        </Button>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">Testes Ativos</CardTitle>
            <Target className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">3</div>
            <p className="text-xs text-[#8F7A6A]">2 aguardando resultados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">Melhor Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">+23.5%</div>
            <p className="text-xs text-[#8F7A6A]">Variação B - Quiz v2</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">
              Total de Visitantes
            </CardTitle>
            <Eye className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">8,234</div>
            <p className="text-xs text-[#8F7A6A]">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">
              Taxa de Significância
            </CardTitle>
            <Target className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">95%</div>
            <p className="text-xs text-[#8F7A6A]">Confiança estatística</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Testes A/B */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#432818]">Testes A/B Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Teste 1 */}
            <div className="border border-[#D4C4A0] rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-[#432818] text-lg">Quiz vs Oferta Direta</h3>
                  <p className="text-sm text-[#8F7A6A]">
                    Testando /resultado vs /descubra-seu-estilo
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" style={{ backgroundColor: "#E5DDD5" }}>
                    Ativo
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Pause className="w-4 h-4 mr-1" />
                    Pausar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-[#432818]">Variação A (Controle)</h4>
                  <p className="text-sm text-[#8F7A6A]">/resultado - Quiz como isca</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Visitantes: 1,234</span>
                      <span>Conversões: 89 (7.2%)</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-[#432818]">Variação B (Teste)</h4>
                  <p className="text-sm text-[#8F7A6A]">/descubra-seu-estilo - Oferta direta</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Visitantes: 1,156</span>
                      <span>Conversões: 127 (11.0%)</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Resultado:</strong> Variação B está performando 52.8% melhor
                  (Significância: 95% | Duração: 14 dias)
                </p>
              </div>
            </div>

            {/* Teste 2 */}
            <div className="border border-[#D4C4A0] rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-[#432818] text-lg">
                    Criativos - Imagem vs Vídeo
                  </h3>
                  <p className="text-sm text-[#8F7A6A]">Testando diferentes tipos de creative</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-stone-100 text-stone-800">
                    Coletando dados
                  </Badge>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-[#432818]">Variação A - Imagem</h4>
                  <p className="text-sm text-[#8F7A6A]">Creative estático</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cliques: 456</span>
                      <span>CTR: 3.2%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-[#432818]">Variação B - Vídeo</h4>
                  <p className="text-sm text-[#8F7A6A]">Creative em movimento</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cliques: 523</span>
                      <span>CTR: 4.1%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-stone-50 rounded-lg">
                <p className="text-sm text-stone-800">
                  <strong>Status:</strong> Teste em andamento. Precisa de mais 3 dias para
                  significância estatística.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ABTestPage;
