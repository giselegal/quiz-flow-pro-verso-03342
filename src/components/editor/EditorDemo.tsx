// 🚀 Demonstração do Editor Avançado - Fase 2 Completa
import AdvancedEditor from '@/components/editor/AdvancedEditor';
import { BlockData } from '@/types/blocks';

// Dados de exemplo para demonstração
const SAMPLE_BLOCKS: BlockData[] = [
  {
    id: 'intro-header',
    type: 'quiz-intro-header',
    properties: {
      logoUrl:
        'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      progressValue: 0,
      showProgress: true,
    },
    content: {},
    order: 0,
  },
  {
    id: 'intro-title',
    type: 'heading-inline',
    properties: {
      content: 'Bem-vindo ao Editor Avançado!',
      level: 'h1',
      textAlign: 'center',
      color: '#432818',
      fontSize: 'text-3xl',
    },
    content: {},
    order: 1,
  },
  {
    id: 'intro-description',
    type: 'text-inline',
    properties: {
      content: 'Este é o nosso sistema de edição visual com funcionalidades profissionais.',
      textAlign: 'center',
      color: '#6B4F43',
    },
    content: {},
    order: 2,
  },
];

const EditorDemo: React.FC = () => {
  // Handlers para as ações do editor
  const handleSave = async (blocks: BlockData[]) => {
    console.log('💾 Salvando blocos:', blocks);
    // Aqui você integraria com sua API
    // await saveBlocks(blocks);
    alert('Blocks salvos com sucesso!');
  };

  const handlePreview = (blocks: BlockData[]) => {
    console.log('👁️ Preview dos blocos:', blocks);
    // Aqui você abriria uma nova aba ou modal com o preview
    window.open('/preview', '_blank');
  };

  return (
    <div style={{ backgroundColor: '#FAF9F7' }}>
      <AdvancedEditor
        initialBlocks={SAMPLE_BLOCKS}
        onSave={handleSave}
        onPreview={handlePreview}
        className="w-full h-full"
      />
    </div>
  );
};

export default EditorDemo;
