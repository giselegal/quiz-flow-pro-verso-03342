// @ts-nocheck
import React, { useEffect, useState } from 'react';
import type { BlockComponentProps } from '@/types/blocks';
import { StorageService } from '@/services/core/StorageService';

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

// Color mapping for different styles
const styleColors = {
  'Natural': '#A68B5B',
  'Clássico': '#8B7355', 
  'Contemporâneo': '#B89B7A',
  'Elegante': '#C5A572',
  'Romântico': '#D4A5A5',
  'Sexy': '#B85C5C',
  'Dramático': '#7A5A8B',
  'Criativo': '#8BA55A',
  'Neutro': '#999999'
};

const QuizResultCalculatedBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Seu Resultado',
    showPercentages = true,
    showSecondaryStyles = true,
    backgroundColor = '#ffffff',
  } = block?.properties || {};

  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to load results from storage
  const loadResults = () => {
    try {
      const quizResult = StorageService.safeGetJSON('quizResult');
      if (quizResult && quizResult.primaryStyle) {
        setResults(quizResult);
        setIsLoading(false);
        console.log('📊 Quiz results loaded from storage:', quizResult);
      } else {
        // If no results, keep loading state - calculation may still be in progress
        console.log('⏳ No quiz results found in storage yet');
      }
    } catch (error) {
      console.error('❌ Error loading quiz results:', error);
      setIsLoading(false);
    }
  };

  // Load results on mount and listen for updates
  useEffect(() => {
    loadResults();
    
    // Listen for quiz result updates
    const handleResultUpdate = () => {
      console.log('🔄 Quiz result updated event received');
      loadResults();
    };

    window.addEventListener('quiz-result-updated', handleResultUpdate);
    
    // Also try to load after a short delay in case calculation is running
    const timer = setTimeout(loadResults, 500);

    return () => {
      window.removeEventListener('quiz-result-updated', handleResultUpdate);
      clearTimeout(timer);
    };
  }, []);

  // Prepare display data
  let primaryResult, secondaryResults;

  if (results && results.primaryStyle) {
    // Use real calculated results
    primaryResult = {
      style: results.primaryStyle.style || results.primaryStyle.category,
      percentage: results.primaryStyle.percentage || 0,
      color: styleColors[results.primaryStyle.style || results.primaryStyle.category] || styleColors['Natural']
    };

    secondaryResults = (results.secondaryStyles || []).map((style, index) => ({
      style: style.style || style.category,
      percentage: style.percentage || 0,
      color: styleColors[style.style || style.category] || styleColors['Natural']
    }));
  } else {
    // Fallback to mock data while loading or if no results
    primaryResult = { style: 'Carregando...', percentage: 0, color: styleColors['Natural'] };
    secondaryResults = [];
  }

  return (
    <div
      className={`
        py-8 px-4 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      style={{ backgroundColor }}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#432818] mb-8">{title}</h2>

        {isLoading ? (
          // Loading state
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4 mx-auto w-64"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 mx-auto w-32"></div>
              <div className="h-3 bg-gray-200 rounded mx-auto w-full"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Primary Result */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="text-2xl font-semibold mb-4" style={{ color: primaryResult.color }}>
                {results && results.primaryStyle ? 
                  `Seu Estilo Principal: ${primaryResult.style}` : 
                  'Calculando seu estilo...'
                }
              </h3>
              {showPercentages && primaryResult.percentage > 0 && (
                <div className="mb-2" style={{ color: '#6B4F43' }}>
                  {primaryResult.percentage}% de compatibilidade
                </div>
              )}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${primaryResult.percentage}%`,
                    backgroundColor: primaryResult.color,
                  }}
                />
              </div>
            </div>

            {/* Secondary Results */}
            {showSecondaryStyles && secondaryResults.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-[#432818] mb-4">
                  Outros estilos que combinam com você:
                </h4>
                {secondaryResults.map((style: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span style={{ color: '#432818' }}>{style.style}</span>
                      {showPercentages && <span style={{ color: '#6B4F43' }}>{style.percentage}%</span>}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${style.percentage}%`,
                          backgroundColor: style.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Debug info in development */}
            {process.env.NODE_ENV === 'development' && results && (
              <div className="mt-6 p-4 bg-gray-100 rounded text-xs text-left">
                <details>
                  <summary className="cursor-pointer font-semibold">Debug: Quiz Results Data</summary>
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizResultCalculatedBlock;
