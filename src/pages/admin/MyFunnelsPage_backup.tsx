import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { funnelLocalStore } from '@/services/funnelLocalStore';
import { Edit, Eye, Globe2, Plus, Upload, Link as LinkIcon } from 'lucide-react';
import React from 'react';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import { TemplateManager } from '@/utils/TemplateManager';
import OPTIMIZED_FUNNEL_CONFIG from '@/config/optimized21StepsFunnel';
import { publishFunnel } from '@/services/funnelPublishing';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { useMyFunnelsPersistence } from '@/hooks/editor/useContextualEditorPersistence';
import { FunnelContext } from '@/core/contexts/FunnelContext';

type Funnel = ReturnType<typeof funnelLocalStore.list>[number];

const MyFunnelsPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [funnels, setFunnels] = React.useState<Funnel[]>([]);
  const [publishingId, setPublishingId] = React.useState<string | null>(null);
  const [openId, setOpenId] = React.useState<string>('');

  // 🎯 Usar hook contextual para isolamento de dados
  const { listFunnels, loadFunnel, saveFunnel, deleteFunnel, isLoading } = useMyFunnelsPersistence();

  React.useEffect(() => {
    console.log('🔍 MyFunnelsPage: Carregando funis do contexto MY_FUNNELS...');
    
    const loadContextualFunnels = async () => {
      try {
        const contextualFunnels = await listFunnels();
        console.log('📋 Funis contextuais carregados:', contextualFunnels);
        setFunnels(contextualFunnels);

        // 🚀 CORREÇÃO: Se não há funis no contexto, criar alguns de exemplo
        if (contextualFunnels.length === 0) {
          console.log('⚠️ Nenhum funil encontrado no contexto MY_FUNNELS, criando exemplos...');
          await createInitialFunnels();
        }
      } catch (error) {
        console.error('❌ Erro ao carregar funis contextuais:', error);
        // Fallback para o sistema antigo se houver erro
        const loadedFunnels = funnelLocalStore.list();
        console.log('📋 Fallback - Funis carregados do localStorage:', loadedFunnels);
        setFunnels(loadedFunnels);
      }
    };

    loadContextualFunnels();
  }, [listFunnels]);

  // 🆕 Função para criar funis iniciais usando o contexto MY_FUNNELS
  const createInitialFunnels = async () => {
    const initialFunnels = [
      {
        id: 'welcome-quiz-style',
        name: 'Quiz de Estilo Pessoal',
        description: 'Funil de exemplo para descobrir estilos pessoais',
        isPublished: false,
        version: 1,
        settings: {},
        pages: []
      },
      {
        id: 'lead-magnet-example',
        name: 'Lead Magnet - E-book Grátis',
        description: 'Funil de exemplo para captura de leads',
        isPublished: false,
        version: 1,
        settings: {},
        pages: []
      }
    ];

    try {
      // Salvar usando o hook contextual para isolamento
      for (const funnel of initialFunnels) {
        await saveFunnel(funnel);
      }
      
      // Recarregar a lista
      const updatedFunnels = await listFunnels();
      setFunnels(updatedFunnels);
      console.log('✅ Funis iniciais criados no contexto MY_FUNNELS:', initialFunnels);
    } catch (error) {
      console.error('❌ Erro ao criar funis iniciais:', error);
      // Fallback para o sistema antigo
      const legacyFunnels = initialFunnels.map(f => ({
        id: f.id,
        name: f.name,
        status: 'draft' as const,
        updatedAt: new Date().toISOString()
      }));
      funnelLocalStore.saveList(legacyFunnels);
      setFunnels(legacyFunnels as any);
    }
  };

  const goToEditor = async (id?: string) => {
    console.log('🎯 Navegando para editor:', id ? `com ID ${id}` : 'novo funil');

    if (id) {
      // Editar funil existente - carregar do contexto MY_FUNNELS
      try {
        const funnelData = await loadFunnel(id);
        if (funnelData) {
          setLocation(`/editor?funnel=${encodeURIComponent(id)}&context=my-funnels`);
        } else {
          console.warn('⚠️ Funil não encontrado no contexto MY_FUNNELS:', id);
          setLocation(`/editor?funnel=${encodeURIComponent(id)}`);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar funil:', error);
        setLocation(`/editor?funnel=${encodeURIComponent(id)}`);
      }
    } else {
      // Criar novo funil no contexto MY_FUNNELS
      const now = new Date().toISOString();
      const newId = `custom-funnel-${Date.now()}`;
      const name = `Novo Funil ${new Date().toLocaleTimeString()}`;

      const newFunnel = {
        id: newId,
        name,
        description: 'Novo funil criado em Meus Funis',
        isPublished: false,
        version: 1,
        settings: {},
        pages: []
      };

      try {
        // Salvar no contexto MY_FUNNELS
        await saveFunnel(newFunnel);
        
        // Atualizar a lista local
        const updatedFunnels = await listFunnels();
        setFunnels(updatedFunnels);

        // Navegar para o editor com contexto específico
        setLocation(`/editor?funnel=${encodeURIComponent(newId)}&context=my-funnels`);
      } catch (error) {
        console.error('❌ Erro ao criar novo funil:', error);
        // Fallback para o sistema antigo
        const legacyFunnel = {
          id: newId,
          name,
          status: 'draft' as const,
          updatedAt: now
        };

        const list = funnelLocalStore.list();
        list.push(legacyFunnel);
        funnelLocalStore.saveList(list);
        setFunnels([...funnels, legacyFunnel as any]);
        setLocation(`/editor?funnel=${encodeURIComponent(newId)}`);
      }
    }
  };
      setFunnels(list);

      console.log('✅ Novo funil criado:', newFunnel);
      setLocation(`/editor?funnel=${encodeURIComponent(newId)}`);
    }
  };

  const createAndOpen21 = () => {
    try {
      const now = new Date().toISOString();
      const templateId = 'template-optimized-21-steps-funnel';
      const newId = `${templateId}-${Date.now()}`;
      const name = 'Funil Quiz 21 Etapas';

      // 🚀 CORREÇÃO: Garantir que o funil seja salvo corretamente
      const newFunnel = {
        id: newId,
        name,
        status: 'draft' as const,
        updatedAt: now
      };

      const list = funnelLocalStore.list();
      list.push(newFunnel);
      funnelLocalStore.saveList(list);
      setFunnels(list);

      console.log('✅ Funil 21 etapas criado:', newFunnel);
      console.log('📊 Lista atualizada:', list);

      // Navegar para editor com o ID específico
      setLocation(`/editor?funnel=${encodeURIComponent(newId)}&template=${templateId}`);
    } catch (error) {
      console.error('❌ Erro ao criar funil 21 etapas:', error);
      // Fallback: navegar mesmo se houver erro
      setLocation('/editor?template=template-optimized-21-steps-funnel');
    }
  };

  const publishLocalFunnel = async (f: Funnel) => {
    try {
      setPublishingId(f.id);
      // Carregar blocos de todas as 21 etapas
      const steps = Array.from({ length: 21 }, (_, i) => i + 1);
      const stages = await Promise.all(
        steps.map(async (n) => {
          const stepId = `step-${n}`;
          const blocks = await TemplateManager.loadStepBlocks(stepId);
          const cfgStep = (OPTIMIZED_FUNNEL_CONFIG as any).steps?.find((s: any) => s.id === stepId);
          return {
            id: stepId,
            name: cfgStep?.name || `Etapa ${n}`,
            order: n,
            blocks,
          };
        })
      );

      const res = await publishFunnel({
        id: f.id, // pode ser substituído por UUID no serviço caso não seja UUID
        name: f.name,
        description: 'Funil publicado a partir do editor local',
        stages,
        settings: { source: 'local', template: 'template-optimized-21-steps-funnel' },
      });

      if (res.success) {
        alert(`Funil publicado! URL: ${res.publicUrl || ''}`);
      } else {
        alert(`Falha ao publicar: ${res.error || 'Erro desconhecido'}`);
      }
    } catch (e) {
      console.error('Erro ao publicar funil:', e);
      alert('Erro ao publicar funil. Verifique o console.');
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#FAF9F7', minHeight: '100vh' }}>
      <AdminBreadcrumbs
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Funis', href: '/admin/funis' },
          { label: 'Meus Funis' },
        ]}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#432818' }}>
          Meus Funis
        </h1>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Abrir por ID do funil"
              value={openId}
              onChange={e => setOpenId(e.target.value)}
              className="w-64"
            />
            <Button
              variant="outline"
              onClick={() => openId && setLocation(`/editor?funnel=${encodeURIComponent(openId)}`)}
              className="border-[#B89B7A] text-[#B89B7A]"
              title="Abrir no editor pelo ID"
            >
              <LinkIcon className="w-4 h-4 mr-2" /> Abrir
            </Button>
          </div>
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
                    onClick={() => publishLocalFunnel(f)}
                    disabled={publishingId === f.id}
                    title="Publicar funil no Supabase"
                  >
                    <Upload className="w-4 h-4 mr-1" /> {publishingId === f.id ? 'Publicando...' : 'Publicar'}
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
