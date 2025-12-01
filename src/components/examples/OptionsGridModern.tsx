/**
 * OptionsGrid Modernizado - Suporta formato SaaS
 * 
 * Exemplo de como atualizar o componente para usar o novo padrão
 */

import React from 'react';
import { normalizeOption, resolveAssetUrl, type SaaSOption } from '@/lib/quiz-v4-saas-adapter';

interface OptionsGridProps {
    options: Array<any>; // Aceita formato antigo OU novo
    columns?: number;
    gap?: number;
    selectedIds?: string[];
    minSelections?: number;
    maxSelections?: number;
    onSelect?: (option: SaaSOption) => void;
    onDeselect?: (option: SaaSOption) => void;
}

export function OptionsGrid({
    options,
    columns = 2,
    gap = 16,
    selectedIds = [],
    minSelections = 1,
    maxSelections = 3,
    onSelect,
    onDeselect,
}: OptionsGridProps) {
    // ========================================
    // 1. NORMALIZAR OPTIONS (compatibilidade)
    // ========================================
    const normalizedOptions = options.map(normalizeOption);

    // ========================================
    // 2. STATE & HANDLERS
    // ========================================
    const handleOptionClick = (option: SaaSOption) => {
        const isSelected = selectedIds.includes(option.id);

        if (isSelected) {
            onDeselect?.(option);
        } else {
            // Validar maxSelections
            if (selectedIds.length >= maxSelections) {
                // Opcional: feedback visual de limite atingido
                return;
            }
            onSelect?.(option);
        }
    };

    // ========================================
    // 3. RENDER
    // ========================================
    return (
        <div
            className="options-grid"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: `${gap}px`,
            }}
        >
            {normalizedOptions.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                const imageUrl = resolveAssetUrl(option.imageUrl);

                return (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => handleOptionClick(option)}
                        className={`option-card ${isSelected ? 'selected' : ''}`}
                        data-category={option.score.category}
                        aria-pressed={isSelected}
                    >
                        {/* Imagem */}
                        {imageUrl && (
                            <div className="option-image">
                                <img
                                    src={imageUrl}
                                    alt={option.label}
                                    loading="lazy"
                                />
                            </div>
                        )}

                        {/* Label */}
                        <div className="option-label">
                            {option.label}
                        </div>

                        {/* Badge de Categoria (opcional, para debug) */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="option-category-badge">
                                {option.score.category} ({option.score.points}pt)
                            </div>
                        )}

                        {/* Indicador de seleção */}
                        {isSelected && (
                            <div className="option-selected-indicator">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

// ========================================
// EXEMPLO DE USO
// ========================================

/*
import { OptionsGrid } from '@/components/OptionsGrid';

function QuestionStep({ block }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = (option) => {
    setSelectedIds([...selectedIds, option.id]);
    
    // Opcional: analytics
    trackEvent('option_selected', {
      optionId: option.id,
      category: option.score.category,
      points: option.score.points,
    });
  };

  const handleDeselect = (option) => {
    setSelectedIds(selectedIds.filter(id => id !== option.id));
  };

  return (
    <OptionsGrid
      options={block.content.options}
      columns={block.properties.columns}
      gap={block.properties.gap}
      selectedIds={selectedIds}
      minSelections={3}
      maxSelections={3}
      onSelect={handleSelect}
      onDeselect={handleDeselect}
    />
  );
}
*/
