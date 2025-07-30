
import React, { useState } from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

interface OptionObject {
  text: string;
  imageUrl?: string;
  styleCategory?: string;
  id?: string;
}

type Option = string | OptionObject;

interface StageQuestionComponentProps {
  data: QuizComponentData['data'];
  style: QuizComponentData['style'];
  isSelected: boolean;
}

const StageQuestionComponent: React.FC<StageQuestionComponentProps> = ({ 
  data, 
  style, 
  isSelected 
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  
  const displayType = data.displayType || 'text';
  const showImages = displayType === 'image' || displayType === 'both';
  const showText = displayType === 'text' || displayType === 'both';
  const multiSelect = data.multiSelect || 1;
  const imageSize = data.imageSize || 'medium';
  const selectionIndicator = data.selectionIndicator || 'border';
  
  const getGridColumns = () => {
    const columns = data.layout?.columns || 2;
    switch (columns) {
      case 1: return "grid-cols-1 gap-3";
      case 3: return "grid-cols-1 sm:grid-cols-3 gap-3";
      case 4: return "grid-cols-2 sm:grid-cols-4 gap-3";
      default: return "grid-cols-1 sm:grid-cols-2 gap-4"; // Default to 2 columns
    }
  };
  
  const getImageSize = () => {
    switch (imageSize) {
      case 'small': return { ratio: 16 / 9, classes: "max-h-24" };
      case 'large': return { ratio: 4 / 3, classes: "max-h-64" };
      default: return { ratio: 4 / 3, classes: "max-h-48" }; // Medium is default
    }
  };
  
  const imageConfig = getImageSize();
  
  // Helper function to safely extract text and image from option
  const extractOptionData = (option: Option, index: number) => {
    let text = '';
    let imageUrl: string | null = null;
    let styleCategory: string | undefined = undefined;
    
    if (typeof option === 'string') {
      text = option;
      if (data.optionImages && Array.isArray(data.optionImages) && data.optionImages[index]) {
        imageUrl = data.optionImages[index];
      }
    } else if (option && typeof option === 'object') {
      text = option.text || '';
      imageUrl = option.imageUrl || null;
      styleCategory = option.styleCategory;
    }
    
    return { text, imageUrl, styleCategory };
  };
  
  const handleOptionClick = (index: number) => {
    setSelectedOptions(prev => {
      // If already selected, remove it
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      
      // If multiSelect is 1, replace the selection
      if (multiSelect === 1) {
        return [index];
      }
      
      // If we're at the limit, remove the first and add the new one
      if (prev.length >= multiSelect) {
        return [...prev.slice(1), index];
      }
      
      // Otherwise add to selection
      return [...prev, index];
    });
  };
  
  const isOptionSelected = (index: number) => {
    return selectedOptions.includes(index);
  };
  
  const canProceed = multiSelect <= 1 || selectedOptions.length >= multiSelect;
  
  return (
    <div 
      className={cn(
        "w-full max-w-6xl mx-auto pb-5 relative",
        isSelected && "ring-2 ring-inset ring-[#B89B7A]/20"
      )}
      style={{
        backgroundColor: style?.backgroundColor || data.backgroundColorQuestion || '#FFFAF0',
        color: style?.textColor || data.textColorQuestion || '#432818',
        borderRadius: style?.borderRadius ? `${style?.borderRadius}px` : '8px',
        padding: `${style?.paddingY || 16}px ${style?.paddingX || 16}px`,
      }}
    >
      <h2 className="text-xl sm:text-2xl font-playfair text-center mb-5 px-3 pt-3 font-semibold tracking-normal">
        {data.title || data.question || 'Pergunta do Quiz'}
      </h2>
      
      <p className="text-sm text-[#1A1818]/70 px-2 py-2 mb-4 text-center font-medium">
        {data.subtitle || (multiSelect > 1 ? `Selecione ${multiSelect} opções` : 'Selecione uma opção')}
      </p>
      
      <div className={cn(
        "grid",
        getGridColumns(),
        showImages && "mb-4 relative"
      )}>
        {(data.options || ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4']).map((option, index) => {
          const { text, imageUrl, styleCategory } = extractOptionData(option, index);
          const isSelected = isOptionSelected(index);
          
          return (
            <div
              key={`option-${text.slice(0, 10).replace(/\s+/g, '-')}-${index}`}
              className={cn(
                "relative rounded-lg overflow-hidden transition-all duration-200 cursor-pointer bg-white",
                isSelected 
                  ? "border-2 border-[#B89B7A] shadow-lg transform scale-[1.01]" 
                  : "border-2 border-transparent hover:border-[#B89B7A]/60 hover:shadow-md hover:scale-[1.005]",
                showImages ? "flex flex-col" : "p-4"
              )}
              onClick={() => handleOptionClick(index)}
            >
              {showImages && imageUrl && (
                <div className="w-full">
                  <AspectRatio ratio={imageConfig.ratio} className={imageConfig.classes}>
                    <img 
                      src={imageUrl} 
                      alt={text}
                      className={cn(
                        "w-full h-full object-cover rounded-t-lg",
                        isSelected && "opacity-95"
                      )}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/400x300?text=Imagem+não+encontrada';
                      }}
                    />
                  </AspectRatio>
                </div>
              )}
              
              {showImages && !imageUrl && (
                <div className="w-full">
                  <AspectRatio ratio={imageConfig.ratio} className={imageConfig.classes}>
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </AspectRatio>
                </div>
              )}
              
              {showText && (
                <div className={cn(
                  "flex-1 p-3 text-[#432818]",
                  showImages && imageUrl ? "border-t border-[#B89B7A]/10" : ""
                )}>
                  <p>{text}</p>
                </div>
              )}
              
              {selectionIndicator === 'checkbox' && (
                <div className={cn(
                  "absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center",
                  isSelected 
                    ? "bg-[#B89B7A] text-white shadow-sm" 
                    : "border-2 border-[#B89B7A] bg-white/80"
                )}>
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              )}
              
              {isSelected && selectionIndicator === 'highlight' && (
                <div className="absolute inset-0 bg-[#B89B7A]/10 pointer-events-none shadow-inner" />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-[#1A1818]/70 px-2 py-2 text-center font-medium">
          {multiSelect > 1 
            ? `Selecione ${multiSelect} opções para avançar (${selectedOptions.length}/${multiSelect})` 
            : 'Selecione uma opção para avançar'}
        </p>
        
        <Button 
          className={cn(
            "px-4 py-2 rounded shadow-sm",
            canProceed 
              ? "bg-[#B89B7A] text-white hover:bg-[#A38A69]" 
              : "bg-[#B89B7A]/40 text-white cursor-not-allowed"
          )}
          disabled={!canProceed}
        >
          Próxima
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      
      <div className="mt-4 text-sm text-[#432818]/60 text-center">
        {data.stageTitle || 'Pergunta'} • {data.stageNumber || 1} de {data.totalStages || 7}
      </div>
      
      <div className="w-full h-1 bg-[#B89B7A]/20 mt-3 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#B89B7A]" 
          style={{ 
            width: `${((data.stageNumber || 1) / (data.totalStages || 7)) * 100}%` 
          }}
        ></div>
      </div>
    </div>
  );
};

export default StageQuestionComponent;
