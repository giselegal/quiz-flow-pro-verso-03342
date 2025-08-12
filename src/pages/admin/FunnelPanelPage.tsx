import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit, BarChart3 } from 'lucide-react';

const FunnelPanelPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1
            className="text-3xl font-bold text-[#432818]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Gerenciamento de Funis
          </h1>
          <p className="text-[#8F7A6A] mt-2">Gerencie seus funis de venda e campanhas</p>
        </div>
        <Button className="bg-[#B89B7A] hover:bg-[#A0895B] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Funil
        </Button>
      </div>

      {/* Lista de Funis */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#432818]">Funis Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-[#D4C4A0] rounded-lg">
                <div>
                  <h3 className="font-semibold text-[#432818]">Funil de Descoberta de Estilo</h3>
                  <p className="text-sm text-[#8F7A6A]">Quiz → Resultado → Oferta</p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="text-green-600">87% conversão</span>
                    <span className="text-[#B89B7A]">1,234 visitantes</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Métricas
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FunnelPanelPage;
