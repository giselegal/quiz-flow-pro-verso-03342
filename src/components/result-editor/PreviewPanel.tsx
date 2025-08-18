// @ts-nocheck
import { StyleResult } from '@/types/quiz';
import { ResultPageConfig } from '@/types/resultPageConfig';
import { QuizResults } from '@/components/quiz/QuizResults';

interface PreviewPanelProps {
  resultPageConfig: ResultPageConfig;
  selectedStyle: StyleResult;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ resultPageConfig, selectedStyle }) => {
  // Create complete StyleResult objects with all required properties
  const secondaryStyles: StyleResult[] = [
    {
      category: selectedStyle.category === 'Natural' ? 'Clássico' : 'Natural',
      score: 10,
      percentage: 25,
      style: 'classico' as any,
      points: 10,
      rank: 2,
    },
    {
      category: selectedStyle.category === 'Contemporâneo' ? 'Elegante' : 'Contemporâneo',
      score: 5,
      percentage: 15,
      style: 'contemporaneo' as any,
      points: 5,
      rank: 3,
    },
  ];

  return (
    <div className="h-full overflow-auto bg-[#FAF9F7] p-4">
      <div className="border rounded-lg shadow-sm overflow-hidden">
        <div style={{ backgroundColor: '#E5DDD5' }}>
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span style={{ color: '#8B7355' }}>Visualização</span>
        </div>

        <div className="overflow-auto h-[calc(100vh-180px)]">
          <QuizResults primaryStyle={selectedStyle} secondaryStyles={secondaryStyles} />
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
