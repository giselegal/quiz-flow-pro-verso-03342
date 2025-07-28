import * as React from 'react';
import { Button } from '../ui/button';

interface EditorStatusProps {
  funnel: any;
  currentPage: any;
  isLoading: boolean;
  isSaving: boolean;
}

const EditorStatus: React.FC<EditorStatusProps> = ({ 
  funnel, 
  currentPage, 
  isLoading, 
  isSaving 
}) => {
  const [showDetails, setShowDetails] = React.useState(false);

  const statusItems = [
    { label: 'Funil', value: funnel ? '✅ Carregado' : '❌ Não carregado', status: !!funnel },
    { label: 'Página Atual', value: currentPage ? '✅ Selecionada' : '❌ Nenhuma', status: !!currentPage },
    { label: 'Blocos', value: currentPage?.blocks?.length || 0, status: true },
    { label: 'Carregando', value: isLoading ? '⏳ Sim' : '✅ Não', status: !isLoading },
    { label: 'Salvando', value: isSaving ? '💾 Sim' : '✅ Não', status: !isSaving }
  ];

  const allGood = statusItems.every(item => item.status);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`
        p-3 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-200
        ${allGood 
          ? 'bg-green-500/90 border-green-400 text-white' 
          : 'bg-red-500/90 border-red-400 text-white'
        }
      `}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${allGood ? 'bg-white' : 'bg-yellow-200'} animate-pulse`} />
          <span className="font-medium text-sm">
            {allGood ? 'Editor OK' : 'Problemas detectados'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="h-6 w-6 p-0 text-white hover:bg-white/20"
          >
            {showDetails ? '−' : '+'}
          </Button>
        </div>

        {showDetails && (
          <div className="mt-2 pt-2 border-t border-white/20">
            {statusItems.map((item, index) => (
              <div key={index} className="flex justify-between text-xs mb-1">
                <span>{item.label}:</span>
                <span className="ml-2">{item.value}</span>
              </div>
            ))}
            {funnel && (
              <div className="text-xs mt-2 pt-2 border-t border-white/20">
                <div>ID: {funnel.id?.substring(0, 8)}...</div>
                <div>Nome: {funnel.name}</div>
                <div>Páginas: {funnel.pages?.length || 0}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorStatus;
