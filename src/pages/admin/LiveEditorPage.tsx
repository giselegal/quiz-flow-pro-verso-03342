import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
// LiveQuizEditor removed during cleanup
import { useLiveEditor } from '@/hooks/useLiveEditor';

const LiveEditorPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { loadEditor, stages, addStage } = useLiveEditor();

  useEffect(() => {
    // Carregar editor salvo
    loadEditor();

    // Se não houver etapas, criar uma introdução padrão
    if (stages.length === 0) {
      addStage({
        id: 'intro-1',
        name: 'Introdução do Quiz',
        type: 'intro',
        order: 0,
        components: [],
        settings: {},
      });
    }
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header com navegação */}
      <div style={{ borderColor: '#E5DDD5' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/admin')}
              className="text-[#432818] hover:text-[#B89B7A]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Admin
            </Button>

            <div className="h-6 w-px bg-gray-300" />

            <h1 className="text-xl font-bold text-[#432818]">Editor Visual ao Vivo</h1>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Live Quiz Editor</h2>
        <p className="text-gray-600">Component removed during cleanup. Please use /editor or /editor-fixed instead.</p>
      </div>
    </div>
  );
};

export default LiveEditorPage;
