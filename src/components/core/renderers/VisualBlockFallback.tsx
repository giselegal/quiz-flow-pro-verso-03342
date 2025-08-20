import React from 'react';
import { AlertCircle, Code, Eye } from 'lucide-react';

interface VisualBlockFallbackProps {
  blockType: string;
  blockId: string;
  block?: any;
  message?: string;
  showDetails?: boolean;
}

/**
 * 🎯 VISUAL BLOCK FALLBACK - Componente melhorado para blocos não encontrados
 * 
 * Substitui o JSON bruto por uma interface visual mais útil para debugging
 */
export const VisualBlockFallback: React.FC<VisualBlockFallbackProps> = ({
  blockType,
  blockId,
  block,
  message,
  showDetails = true,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="border-2 border-dashed border-amber-300 bg-amber-50 rounded-lg p-4 space-y-3">
      {/* Header com ícone e tipo */}
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-amber-600" />
        <div className="flex-1">
          <h4 className="font-semibold text-amber-800">
            Componente não encontrado: <code className="bg-amber-100 px-1 rounded">{blockType}</code>
          </h4>
          <p className="text-sm text-amber-700">
            {message || `O tipo de bloco "${blockType}" não está registrado no sistema.`}
          </p>
        </div>
      </div>

      {/* Informações básicas */}
      <div className="text-sm space-y-1">
        <div className="flex gap-4">
          <span className="text-amber-700">
            <strong>ID:</strong> {blockId}
          </span>
          <span className="text-amber-700">
            <strong>Tipo:</strong> {blockType}
          </span>
        </div>
        
        {block?.content && typeof block.content === 'object' && 'title' in block.content && (
          <div className="text-amber-700">
            <strong>Título:</strong> {block.content.title}
          </div>
        )}
      </div>

      {/* Detalhes expandíveis */}
      {showDetails && block && (
        <div className="space-y-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 font-medium"
          >
            {expanded ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
            {expanded ? 'Ocultar detalhes' : 'Ver detalhes do bloco'}
          </button>
          
          {expanded && (
            <div className="bg-amber-100 rounded p-3 overflow-auto max-h-48">
              <pre className="text-xs text-amber-800 whitespace-pre-wrap">
                {JSON.stringify(block, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Sugestões de correção */}
      <div className="text-xs text-amber-600 bg-amber-100 rounded p-2">
        <strong>💡 Como corrigir:</strong>
        <ul className="mt-1 space-y-1 list-disc list-inside">
          <li>Verifique se o componente está registrado no ENHANCED_BLOCK_REGISTRY</li>
          <li>Confirme se o arquivo do componente existe em /components/editor/blocks/</li>
          <li>Valide se o tipo "{blockType}" está mapeado corretamente</li>
        </ul>
      </div>
    </div>
  );
};

export default VisualBlockFallback;