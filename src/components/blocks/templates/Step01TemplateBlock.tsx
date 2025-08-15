import React from 'react';
import Step01Template from '@/components/steps/Step01Template';
import { Block } from '@/types/editor';

interface Step01TemplateBlockProps {
  block: Block;
  sessionId?: string;
  onNext?: () => void;
}

/**
 * 🎯 WRAPPER BLOCO PARA STEP01TEMPLATE
 * 
 * ✅ Ponte entre sistema de blocos do editor e componente TSX conectado
 * ✅ Renderiza Step01Template completo dentro do editor
 * ✅ Mantém todas as funcionalidades conectadas (hooks, formulário, navegação)
 * ✅ Compatible com sistema de propriedades do editor
 */
export default function Step01TemplateBlock({ 
  block, 
  sessionId = 'editor-session',
  onNext 
}: Step01TemplateBlockProps) {
  console.log('🧩 Step01TemplateBlock: Renderizando template conectado', {
    blockId: block?.id,
    sessionId,
    hasOnNext: !!onNext,
  });

  return (
    <div className="step01-template-wrapper">
      <Step01Template 
        sessionId={sessionId}
        onNext={onNext}
      />
    </div>
  );
}

// ✅ COMPONENTE PARA COMPATIBILIDADE LAZY
export const LazyStep01TemplateBlock = React.lazy(() => 
  Promise.resolve({ default: Step01TemplateBlock })
);