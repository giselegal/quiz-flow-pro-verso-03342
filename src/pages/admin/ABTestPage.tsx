import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pause, TrendingUp } from "lucide-react";

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
          <p className="text-[#8F7A6A] mt-2">Otimize suas conversões com testes A/B</p>
        </div>
        <Button className="bg-[#B89B7A] hover:bg-[#A0895B] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Teste A/B
        </Button>
      </div>

      {/* Testes Ativos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#432818]">Testes em Execução</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-[#D4C4A0] rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-[#432818]">Título da Página de Resultado</h3>
                  <Badge style={{ backgroundColor: "#E5DDD5" }}>Ativo</Badge>
                </div>
                <p className="text-sm text-[#8F7A6A] mb-3">
                  Testando dois títulos diferentes na página de resultado
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div style={{ backgroundColor: "#FAF9F7" }}>
                    <div style={{ color: "#6B4F43" }}>Variante A</div>
                    <div style={{ color: "#6B4F43" }}>43.2% conversão (234 visitantes)</div>
                  </div>
                  <div className="p-3 bg-[#B89B7A]/10 rounded">
                    <div className="text-sm font-medium text-[#A38A69]">Variante B</div>
                    <div className="text-xs text-[#B89B7A] mt-1">
                      47.8% conversão (221 visitantes)
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button variant="outline" size="sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Resultados
                </Button>
                <Button variant="outline" size="sm">
                  <Pause className="w-4 h-4 mr-1" />
                  Pausar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ABTestPage;
