import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Edit, Globe2, Plus } from 'lucide-react';
import React from 'react';
import { useLocation } from 'wouter';

type Funnel = {
  id: string;
  name: string;
  status: 'draft' | 'published';
  url?: string;
  updatedAt?: string;
};

function loadLocalFunnels(): Funnel[] {
  try {
    const raw = localStorage.getItem('qqcv_funnels');
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch {
    return [];
  }
}

const MyFunnelsPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [funnels, setFunnels] = React.useState<Funnel[]>([]);

  React.useEffect(() => {
    setFunnels(loadLocalFunnels());
  }, []);

  const goToEditor = (id?: string) => {
    setLocation(id ? `/editor?funnel=${encodeURIComponent(id)}` : '/editor');
  };

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#FAF9F7', minHeight: '100vh' }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#432818' }}>
          Meus Funis
        </h1>
        <Button onClick={() => goToEditor()} className="bg-[#B89B7A] text-white">
          <Plus className="w-4 h-4 mr-2" /> Novo Funil
        </Button>
      </div>

      {funnels.length === 0 ? (
        <Card style={{ backgroundColor: '#FFFFFF' }}>
          <CardContent className="p-8 text-center text-[#6B4F43]">
            Você ainda não criou funis. Use um modelo em "Modelos de Funis" ou crie do zero.
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
                    {f.url}
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setLocation('/quiz')}>
                    <Eye className="w-4 h-4 mr-1" /> Ver
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => goToEditor(f.id)}>
                    <Edit className="w-4 h-4 mr-1" /> Editar
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
