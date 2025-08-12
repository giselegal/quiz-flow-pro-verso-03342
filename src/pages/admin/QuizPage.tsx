import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Plus, Settings } from "lucide-react";

const QuizPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1
            className="text-3xl font-bold text-[#432818]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Quiz Manager
          </h1>
          <p className="text-[#8F7A6A] mt-2">Gerencie e monitore seus quizzes de estilo</p>
        </div>
        <Button className="bg-[#B89B7A] hover:bg-[#A0895B] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Quiz
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">Total de Respostas</CardTitle>
            <BarChart3 className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">2,543</div>
            <p className="text-xs text-[#8F7A6A]">+12% desde ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">Taxa de Conclusão</CardTitle>
            <FileText className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">89.2%</div>
            <p className="text-xs text-[#8F7A6A]">+5.1% desde ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">Tempo Médio</CardTitle>
            <Settings className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">3:42</div>
            <p className="text-xs text-[#8F7A6A]">-0:15 desde ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8F7A6A]">Conversões</CardTitle>
            <BarChart3 className="h-4 w-4 text-[#B89B7A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">156</div>
            <p className="text-xs text-[#8F7A6A]">+8% desde ontem</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Quizzes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#432818]">Quizzes Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-[#D4C4A0] rounded-lg">
              <div>
                <h3 className="font-semibold text-[#432818]">Quiz de Estilo Predominante</h3>
                <p className="text-sm text-[#8F7A6A]">Descoberta de estilo pessoal</p>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ backgroundColor: "#E5DDD5" }}>Ativo</span>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-[#D4C4A0] rounded-lg">
              <div>
                <h3 className="font-semibold text-[#432818]">Quiz de Personalidade Fashion</h3>
                <p className="text-sm text-[#8F7A6A]">Identificação de preferências</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-stone-100 text-stone-800 rounded-full text-xs">
                  Rascunho
                </span>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPage;
