import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { funnelLocalStore } from '@/services/funnelLocalStore';
import { Edit, Eye, Globe2, Plus } from 'lucide-react';
import React from 'react';
import { useLocation } from 'wouter';

type Funnel = ReturnType<typeof funnelLocalStore.list>[number];

const MyFunnelsPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [funnels, setFunnels] = React.useState<Funnel[]>([]);

  React.useEffect(() => {
    setFunnels(funnelLocalStore.list());
  }, []);

  const goToEditor = (id?: string) => {
    setLocation(id ? `/editor?funnel=${encodeURIComponent(id)}` : '/editor');
  };

  const createAndOpen21 = () => {
    try {
      const now = new Date().toISOString();
      const templateId = 'optimized-21-steps-funnel';
      const newId = `${templateId}-${Date.now()}`;
      const name = 'Funil Quiz 21 Etapas';
      const list = funnelLocalStore.list();
      list.push({ id: newId, name, status: 'draft', updatedAt: now });
      funnelLocalStore.saveList(list);
      setFunnels(list);
    } catch { }
    setLocation('/editor?template=optimized-21-steps-funnel');
  };

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#FAF9F7', minHeight: '100vh' }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#432818' }}>
          Meus Funis
        </h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={createAndOpen21}
            className="border-[#B89B7A] text-[#B89B7A]"
          >
            <Plus className="w-4 h-4 mr-2" /> Funil 21 Etapas
          </Button>
          <Button onClick={() => goToEditor()} className="bg-[#B89B7A] text-white">
            <Plus className="w-4 h-4 mr-2" /> Novo Funil
          </Button>
        </div>
      </div>

      {funnels.length === 0 ? (
        <Card style={{ backgroundColor: '#FFFFFF' }}>
          <CardContent className="p-8 text-center text-[#6B4F43] space-y-4">
            <div>Você ainda não criou funis. Use um modelo em "Modelos de Funis" ou crie do zero.</div>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" onClick={createAndOpen21}>
                Criar Funil 21 Etapas
              </Button>
              <Button onClick={() => goToEditor()} className="bg-[#B89B7A] text-white">
                Criar Novo Funil
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funnels.map(f => (
            <Card key={f.id} className="border-0" style={{ backgroundColor: '#FFFFFF' }}>
              <CardHeader>
                <CardTitle className="text-[#432818]">{f.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-[#8F7A6A]">Status: {f.status}</div>
                {f.url && (
                  <div className="flex items-center text-sm text-[#6B4F43]">
                    <Globe2 className="w-4 h-4 mr-2" />
                    {f.url as any}
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setLocation('/quiz')}>
                    <Eye className="w-4 h-4 mr-1" /> Ver
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => goToEditor(f.id)}>
                    <Edit className="w-4 h-4 mr-1" /> Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation(`/admin/funnel-settings/${f.id}`)}
                  >
                    <Globe2 className="w-4 h-4 mr-1" /> Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFunnelsPage;
