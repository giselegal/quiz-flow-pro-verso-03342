import React from 'react';
import { useEditor, Editor, Frame } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { 
  HeaderSection, 
  UserInfoSection, 
  ProgressSection, 
  MainImageSection,
  BaseModuleProps,
  themeColors 
} from './modules';
import type { BlockComponentProps } from '@/types/blocks';
import { useQuizResult } from '@/hooks/useQuizResult';
import { getBestUserName } from '@/core/user/name';
import { mapToFriendlyStyle } from '@/core/style/naming';
import { computeEffectivePrimaryPercentage } from '@/core/result/percentage';

export interface ModularResultHeaderProps extends BaseModuleProps {
  // Layout geral
  containerLayout?: 'single-column' | 'two-column' | 'grid' | 'flexible';
  backgroundColor?: string;
  padding?: 'sm' | 'md' | 'lg';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
  
  // Responsividade
  mobileLayout?: 'stack' | 'compact' | 'minimal';
  
  // Estados do editor
  editMode?: boolean;
}

const ModularResultHeaderComponent: React.FC<ModularResultHeaderProps> = ({
  containerLayout = 'two-column',
  backgroundColor = 'transparent',
  padding = 'lg',
  borderRadius = 'lg',
  mobileLayout = 'stack',
  editMode = false,
  className = '',
  isSelected = false,
}) => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }), { collect: (state) => ({ enabled: state.options.enabled }) });

  // Classes para layout do container
  const containerLayoutClasses = {
    'single-column': 'flex flex-col gap-8',
    'two-column': 'grid md:grid-cols-2 gap-8 items-start',
    'grid': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    'flexible': 'flex flex-col lg:flex-row gap-8 items-start'
  };

  // Classes para padding
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  // Classes para border radius
  const borderRadiusClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  // Classes para mobile layout
  const mobileLayoutClasses = {
    stack: 'flex flex-col gap-4 md:gap-6',
    compact: 'flex flex-col gap-2 md:gap-4',
    minimal: 'flex flex-col gap-1 md:gap-2'
  };

  return (
    <Card
      className={cn(
        'w-full transition-all duration-200 border border-[#B89B7A]/20',
        paddingClasses[padding],
        borderRadiusClasses[borderRadius],
        // Layout responsivo
        'block md:' + containerLayoutClasses[containerLayout].replace('grid ', '').replace('flex ', ''),
        // Mobile layout
        mobileLayoutClasses[mobileLayout],
        // Estados do editor
        enabled && isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2 bg-[#B89B7A]/5',
        enabled && !isSelected && 'hover:ring-1 hover:ring-[#B89B7A]/50 hover:bg-[#B89B7A]/5',
        className
      )}
      style={{ backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : undefined }}
    >
      {/* Header comemorativo */}
      <div className="mb-8">
        <HeaderSection
          title="Parabéns! Descobrimos o seu Estilo Pessoal"
          subtitle="Seu resultado personalizado está pronto"
          showTitle={true}
          showSubtitle={true}
          alignment="center"
          titleSize="xl"
          padding="md"
        />
      </div>

      {/* Informações do usuário */}
      <div className="mb-6">
        <UserInfoSection
          showUserName={true}
          userNamePrefix="Olá, "
          showBadge={true}
          badgeText="✨ Exclusivo"
          emphasis={true}
          alignment="center"
          layout="horizontal"
        />
      </div>

      {/* Layout principal baseado na configuração */}
      <div className={cn(containerLayoutClasses[containerLayout])}>
        {/* Seção da imagem principal */}
        <div className="space-y-6">
          <MainImageSection
            title="Seu Estilo"
            showTitle={true}
            aspectRatio="4:3"
            width="full"
            borderRadius="xl"
            shadow="lg"
            hoverEffect="scale"
            showCornerDecorations={true}
            alignment="center"
            clickable={true}
          />
        </div>

        {/* Seção de progresso e informações */}
        <div className="space-y-6">
          <ProgressSection
            label="Compatibilidade:"
            showLabel={true}
            showPercentage={true}
            animated={true}
            size="md"
            progressColor={themeColors.primary}
            alignment="center"
            useGradient={false}
            showGlow={true}
          />

          {/* Área de conteúdo editável */}
          <div className="bg-gradient-to-br from-[#B89B7A]/10 to-[#aa6b5d]/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-[#432818] mb-4">
              Sua Personalidade Estilística
            </h3>
            <p className="text-[#432818] leading-relaxed">
              Descubra como aplicar seu estilo pessoal único na prática...
            </p>
          </div>
        </div>
      </div>

      {/* CTA estratégico */}
      <div className="mt-8 text-center">
        <div className="bg-gradient-to-br from-[#B89B7A]/10 to-[#aa6b5d]/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-[#432818] mb-3">
            Pronto para Transformar Sua Imagem?
          </h3>
          <p className="text-[#6B4F43] mb-4 text-sm">
            Agora que você conhece seu estilo, descubra como aplicá-lo no seu dia a dia.
          </p>
          <button className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-6 py-3 text-sm font-semibold rounded-xl shadow-lg hover:from-[#A08966] hover:to-[#9A5A4D] transition-all duration-300 hover:scale-105">
            👉 Quero Aprimorar Meu Estilo
          </button>
        </div>
      </div>

      {/* Editor overlay quando selecionado */}
      {enabled && isSelected && (
        <div className="absolute -top-1 -right-1 bg-[#B89B7A] text-white text-xs px-2 py-1 rounded shadow-lg">
          Modular Container
        </div>
      )}
    </Card>
  );
};

// Componente integrado com dados do quiz (compatibilidade)
export const ModularResultHeaderBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onPropertyChange,
  className = '',
}) => {
  const { primaryStyle, secondaryStyles, isLoading, error, retry, hasResult } = useQuizResult();

  // Estados de loading, erro e retry (compatibilidade)
  if (isLoading) {
    return (
      <div className={cn("text-center p-8", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded mx-auto w-64"></div>
        </div>
        <p className="text-sm text-gray-500 mt-4">Calculando seu resultado...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center p-8", className)}>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="text-yellow-800 mb-2">⚠️ Problema no resultado</div>
          <p className="text-sm text-yellow-700 mb-4">{error}</p>
          <button
            onClick={retry}
            className="border border-yellow-300 text-yellow-800 hover:bg-yellow-100 px-4 py-2 rounded"
          >
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!hasResult || !primaryStyle) {
    return (
      <div className={cn("text-center p-8", className)}>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="text-gray-800 mb-2">📋 Resultado não disponível</div>
          <p className="text-sm text-gray-600 mb-4">Nenhum resultado foi calculado ainda.</p>
          <button
            onClick={retry}
            className="border border-gray-300 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded"
          >
            🔄 Calcular Resultado
          </button>
        </div>
      </div>
    );
  }

  // Extrair dados do quiz para os módulos
  const userName = getBestUserName(block);
  const styleLabel = mapToFriendlyStyle((primaryStyle as any)?.category || 'Natural');
  const percentage = computeEffectivePrimaryPercentage(
    primaryStyle as any,
    secondaryStyles as any[],
    (primaryStyle as any)?.percentage || 0
  );

  const {
    backgroundColor,
    containerLayout = 'two-column',
    mobileLayout = 'stack',
    padding = 'lg',
    borderRadius = 'lg',
  } = block?.properties || {};

  return (
    <div
      className={cn(
        'w-full transition-all duration-200',
        isSelected
          ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/10'
          : 'border-2 border-dashed border-transparent hover:border-[#B89B7A]/40 hover:bg-[#B89B7A]/10/30',
        className
      )}
      style={{ backgroundColor }}
    >
      {/* Provider de dados para os módulos filhos */}
      <div data-user-name={userName} data-style={styleLabel} data-percentage={percentage}>
        <ModularResultHeaderComponent
          containerLayout={containerLayout}
          backgroundColor={backgroundColor}
          mobileLayout={mobileLayout}
          padding={padding}
          borderRadius={borderRadius}
          isSelected={isSelected}
          onPropertyChange={onPropertyChange}
        />
      </div>
    </div>
  );
};

export default ModularResultHeaderBlock;