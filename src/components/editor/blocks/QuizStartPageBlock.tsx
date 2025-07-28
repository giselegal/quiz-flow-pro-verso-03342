import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Edit3, Play, Star, CheckCircle, User, ArrowRight } from 'lucide-react';
import type { BlockComponentProps } from '../../../types/blocks';
import { InlineEditText } from './InlineEditText';

/**
 * QuizStartPageBlock - Etapa 1 do funil (Introdução)
 * Página inicial do quiz com coleta de nome e apresentação dos benefícios
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const QuizStartPageBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  // SAFETY CHECK (OBRIGATÓRIO)
  if (!block || !block.properties) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium">Erro: Bloco QuizStartPage não encontrado ou propriedades indefinidas</p>
        <p className="text-red-500 text-sm mt-2">Verifique se o bloco foi configurado corretamente</p>
      </div>
    );
  }

  // DESTRUCTURING DE PROPRIEDADES COM VALORES PADRÃO
  const {
    title = 'Descubra Seu Estilo Pessoal Único',
    subtitle = 'Chega de guarda-roupa lotado e sensação de "não tenho nada para vestir"',
    description = 'Um quiz personalizado que vai te ajudar a descobrir seu estilo predominante e como aplicá-lo no dia a dia com confiança.',
    buttonText = 'Começar Meu Quiz de Estilo',
    benefits = [
      '✓ Descubra seu estilo predominante em apenas 5 minutos',
      '✓ Receba dicas personalizadas para seu perfil único',
      '✓ Aprenda a criar looks que combinam 100% com você',
      '✓ Ganhe confiança para se vestir todos os dias'
    ],
    nameInputPlaceholder = 'Digite seu primeiro nome aqui...',
    showNameInput = true,
    imageUrl = '',
    backgroundColor = '#fffaf7',
    textColor = '#432818',
    showBenefits = true,
    showSubtitle = true,
    buttonVariant = 'primary',
    buttonSize = 'large',
    showIcon = true,
    icon = 'play'
  } = block.properties;

  // ESTADOS LOCAIS
  const [isHovered, setIsHovered] = useState(false);
  const [userName, setUserName] = useState('');

  // ÍCONES DISPONÍVEIS
  const iconMap = {
    'play': Play,
    'star': Star,
    'arrow-right': ArrowRight,
    'user': User
  };

  const IconComponent = iconMap[icon as keyof typeof iconMap] || Play;

  // HANDLERS
  const handlePropertyChange = useCallback((key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  }, [onPropertyChange]);

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Lógica do botão (prosseguir para próxima etapa)
    console.log('🚀 Quiz iniciado!', { userName });
  }, [userName]);

  // EFFECTS
  useEffect(() => {
    // Analytics ou outras side effects
    console.log('📊 QuizStartPageBlock carregado');
  }, []);

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível
        'flex-shrink-0 flex-grow-0 relative group w-full',
        // Base container
        'min-h-screen flex items-center justify-center p-4',
        // Estados
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        // Animações
        'transition-all duration-300',
        className
      )}
      style={{ backgroundColor }}
      onClick={onClick}
    >
      {/* Container principal */}
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          {/* Badge opcional */}
          <Badge variant="secondary" className="mb-4">
            <Star className="w-4 h-4 mr-2" />
            Etapa 1 de 21
          </Badge>

          {/* Título principal */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            style={{ color: textColor }}
          >
            <InlineEditText
              value={title}
              onSave={(value) => handlePropertyChange('title', value)}
              placeholder="Título principal"
              className="font-bold"
            />
          </h1>

          {/* Subtítulo */}
          {showSubtitle && (
            <p 
              className="text-lg md:text-xl text-opacity-80 max-w-3xl mx-auto"
              style={{ color: textColor }}
            >
              <InlineEditText
                value={subtitle}
                onSave={(value) => handlePropertyChange('subtitle', value)}
                placeholder="Subtítulo"
              />
            </p>
          )}

          {/* Descrição */}
          <p 
            className="text-base md:text-lg text-opacity-70 max-w-2xl mx-auto"
            style={{ color: textColor }}
          >
            <InlineEditText
              value={description}
              onSave={(value) => handlePropertyChange('description', value)}
              placeholder="Descrição"
            />
          </p>
        </div>

        {/* Imagem central (se fornecida) */}
        {imageUrl && (
          <div className="my-8">
            <img 
              src={imageUrl} 
              alt="Quiz illustration" 
              className="mx-auto max-w-md w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Input de nome */}
        {showNameInput && (
          <div className="max-w-md mx-auto">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={nameInputPlaceholder}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
              />
            </div>
          </div>
        )}

        {/* Benefícios */}
        {showBenefits && benefits.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto my-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-2 text-left p-3 bg-white/80 rounded-lg backdrop-blur-sm"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span style={{ color: textColor }} className="text-sm md:text-base">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Botão CTA */}
        <div className="mt-8">
          <Button
            size={buttonSize}
            variant={buttonVariant}
            onClick={handleButtonClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              "text-lg px-8 py-4 font-semibold rounded-xl shadow-lg",
              "bg-[#B89B7A] hover:bg-[#aa6b5d] text-white",
              "transform transition-all duration-200",
              isHovered ? "scale-105 shadow-xl" : "scale-100",
              "hover:shadow-2xl focus:ring-4 focus:ring-[#B89B7A]/30"
            )}
          >
            {showIcon && <IconComponent className="w-5 h-5 mr-2" />}
            <InlineEditText
              value={buttonText}
              onSave={(value) => handlePropertyChange('buttonText', value)}
              placeholder="Texto do botão"
              className="text-white font-semibold"
            />
          </Button>
        </div>
      </div>

      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-2 z-10">
          <Edit3 className="w-4 h-4" />
        </div>
      )}

      {/* Empty state para edição */}
      {!title && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 rounded-lg text-gray-500">
          <div className="text-center">
            <Play className="w-8 h-8 mx-auto mb-2" />
            <p className="text-lg font-medium">Quiz Start Page</p>
            <p className="text-sm">Clique para selecionar e editar no painel</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizStartPageBlock;
