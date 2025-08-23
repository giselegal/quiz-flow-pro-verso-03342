import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Funnel {
  id: string;
  name: string;
  is_published: boolean | null;
  created_at: string | null;
}

const FunnelsPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFunnels = async () => {
      try {
        const { data, error } = await supabase
          .from('funnels')
          .select('id, name, is_published, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao carregar funis:', error);
        } else {
          setFunnels(data || []);
        }
      } catch (err) {
        console.error('Erro na conexão:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFunnels();
  }, []);

  return (
    <div style={{ backgroundColor: '#FAF9F7' }}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 style={{ color: '#432818' }} className="text-3xl font-bold">
            Meus Funis
          </h1>
          <Button onClick={() => setLocation('/editor')}>Criar Novo Funil</Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Carregando funis...</p>
            </div>
          ) : funnels.length === 0 ? (
            <div className="text-center py-12">
              <h2 style={{ color: '#6B4F43' }} className="text-xl font-semibold mb-4">
                Nenhum funil encontrado
              </h2>
              <p style={{ color: '#6B4F43' }} className="mb-6">
                Comece criando seu primeiro funil de conversão
              </p>
              <Button onClick={() => setLocation('/editor')}>Criar Primeiro Funil</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {funnels.map(funnel => (
                <div key={funnel.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-lg mb-2" style={{ color: '#432818' }}>
                    {funnel.name}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: '#6B4F43' }}>
                    Criado em{' '}
                    {funnel.created_at
                      ? new Date(funnel.created_at).toLocaleDateString('pt-BR')
                      : 'Data não disponível'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        funnel.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {funnel.is_published ? 'Publicado' : 'Rascunho'}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setLocation(`/editor?funnel=${funnel.id}`)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FunnelsPage;
