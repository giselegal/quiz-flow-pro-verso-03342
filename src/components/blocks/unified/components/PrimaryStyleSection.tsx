import React from 'react';
import { Progress } from '@/components/ui/progress';
import { StyleResultForHeader } from '@/hooks/useStyleResultsForHeader';

interface PrimaryStyleSectionProps {
  styleResult: StyleResultForHeader;
  showName: boolean;
  showDescription: boolean;
  showProgress: boolean;
  showImage: boolean;
  showGuide: boolean;
}

export const PrimaryStyleSection: React.FC<PrimaryStyleSectionProps> = ({
  styleResult,
  showName,
  showDescription,
  showProgress,
  showImage,
  showGuide
}) => {
  // Se nenhum elemento estiver ativo, não renderizar nada
  if (!showName && !showDescription && !showProgress && !showImage && !showGuide) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Título da seção */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">Seu Estilo Predominante</h3>
      </div>

      {/* Conteúdo principal */}
      <div className="space-y-4">
        {/* Nome do estilo */}
        {showName && (
          <div className="text-center">
            <h4 
              className="text-2xl font-bold"
              style={{ color: styleResult.color }}
            >
              {styleResult.name}
            </h4>
          </div>
        )}

        {/* Descrição do estilo */}
        {showDescription && (
          <div className="text-center px-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {styleResult.description}
            </p>
          </div>
        )}

        {/* Barra de progresso */}
        {showProgress && (
          <div className="px-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Compatibilidade</span>
              <span>{styleResult.percentage}%</span>
            </div>
            <Progress
              value={styleResult.percentage}
              className="h-2"
              indicatorClassName="transition-all duration-500"
              style={{
                '--progress-indicator-bg': styleResult.color
              } as React.CSSProperties}
            />
          </div>
        )}

        {/* Grid de imagens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
          {/* Imagem do estilo */}
          {showImage && (
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={styleResult.image}
                  alt={`Estilo ${styleResult.name}`}
                  className="w-32 h-32 rounded-full object-cover border-4 shadow-lg"
                  style={{ borderColor: styleResult.color }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/128x128?text=Estilo';
                  }}
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}

          {/* Imagem do guia */}
          {showGuide && (
            <div className="flex justify-center">
              <div className="relative w-full max-w-48">
                <img
                  src={styleResult.guideImage}
                  alt={`Guia de estilo ${styleResult.name}`}
                  className="w-full h-32 rounded-lg object-cover shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/192x128?text=Guia';
                  }}
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-xs text-white font-medium bg-black/50 px-2 py-1 rounded">
                    Guia de Estilo
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};