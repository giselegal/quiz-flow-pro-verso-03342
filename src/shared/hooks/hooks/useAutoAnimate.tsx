import React, { useRef, useEffect } from 'react';
import autoAnimate from '@formkit/auto-animate';

// Hook personalizado para auto-animate
export const useAutoAnimate = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      autoAnimate(ref.current);
    }
  }, []);

  return ref;
};

// Exemplo de uso em lista animada
export const AnimatedOptionsEditor: React.FC<{
  options: any[];
  onOptionsChange: (options: any[]) => void;
}> = ({ options, onOptionsChange }) => {
  const listRef = useAutoAnimate();

  const addOption = () => {
    const newOption = {
      id: `option-${Date.now()}`,
      text: 'Nova opção',
      imageUrl: 'https://via.placeholder.com/150',
    };
    onOptionsChange([...options, newOption]);
  };

  const removeOption = (index: number) => {
    onOptionsChange(options.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <button
        onClick={addOption}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        ✨ Adicionar Opção (com animação)
      </button>

      {/* Lista com animação automática */}
      <div ref={listRef as any} className="space-y-2">
        {options.map((option, index) => (
          <div key={option.id} className="p-4 bg-card border border-border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.text}</span>
              <button onClick={() => removeOption(index)} style={{ color: '#432818' }}>
                🗑️ Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default useAutoAnimate;
