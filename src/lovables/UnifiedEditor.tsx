import { UnifiedVisualEditor, EditorTab } from '@/components/unified-editor/UnifiedVisualEditor';
import { StyleResult } from '@/types/quiz';

export default {
  name: 'unified-editor',
  displayName: 'Editor Unificado',
  description: 'Editor visual unificado para Quiz, Página de Resultado e Página de Vendas',
  category: 'Editores',
  defaultProps: {
    initialTab: 'quiz',
    styleCategory: 'Elegante',
    styleScore: 10,
    stylePercentage: 60,
  },
  propsSchema: {
    initialTab: {
      type: 'string',
      enum: ['quiz', 'result', 'sales'],
      default: 'quiz',
      description: 'Aba inicial do editor',
    },
    styleCategory: {
      type: 'string',
      default: 'Elegante',
      description: 'Categoria de estilo principal',
    },
    styleScore: {
      type: 'number',
      default: 10,
      description: 'Pontuação do estilo principal',
    },
    stylePercentage: {
      type: 'number',
      default: 60,
      description: 'Porcentagem do estilo principal',
    },
  },
  render: (props: any) => {
    const primaryStyle: StyleResult = {
      category: props.styleCategory,
      score: props.styleScore,
      percentage: props.stylePercentage,
      style: props.styleCategory.toLowerCase(),
      points: props.styleScore,
      rank: 1,
    };

    return (
      <div className="h-screen w-full">
        <UnifiedVisualEditor
          primaryStyle={primaryStyle}
          initialActiveTab={props.initialTab as EditorTab}
        />
      </div>
    );
  },
};
