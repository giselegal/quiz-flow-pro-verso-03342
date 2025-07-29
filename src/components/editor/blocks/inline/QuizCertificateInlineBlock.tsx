import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Award, Download, Share2, Calendar, User, Stamp, CheckCircle, Star, ExternalLink } from 'lucide-react';

interface QuizCertificateInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de certificado
}

/**
 * Componente inline para certificado de conclusão (Etapa 13)
 * Exibição do certificado personalizado com validação e compartilhamento
 */
export const QuizCertificateInlineBlock: React.FC<QuizCertificateInlineBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
  className
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  
  const {
    properties,
    handlePropertyChange,
    commonProps
  } = useInlineBlock({
    block,
    isSelected,
    onClick,
    onPropertyChange,
    className
  });

  const title = properties.title || 'Certificado de Conclusão';
  const subtitle = properties.subtitle || 'Parabéns! Você completou com sucesso nossa avaliação de competências';
  const certificateTitle = properties.certificateTitle || 'Certificado de Avaliação Profissional';
  const recipientName = properties.recipientName || 'João Silva';
  const assessmentName = properties.assessmentName || 'Avaliação de Competências em Liderança e Inovação';
  const completionDate = properties.completionDate || new Date().toLocaleDateString('pt-BR');
  const score = properties.score || 87;
  const level = properties.level || 'Avançado';
  const issuerName = properties.issuerName || 'Instituto de Desenvolvimento Profissional';
  const issuerLogo = properties.issuerLogo || '';
  const certificateId = properties.certificateId || 'CDP-2025-001234';
  const validationUrl = properties.validationUrl || 'https://validacao.exemplo.com/certificate/';
  const skills = properties.skills || [
    'Liderança Estratégica',
    'Pensamento Inovador',
    'Tomada de Decisão',
    'Comunicação Eficaz'
  ];
  const showScore = properties.showScore || true;
  const showSkills = properties.showSkills || true;
  const showValidation = properties.showValidation || true;
  const showSocialShare = properties.showSocialShare || true;
  const certificateStyle = properties.certificateStyle || 'modern'; // modern, classic, elegant
  const theme = properties.theme || 'blue';

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getThemeClasses = () => {
    const themes = {
      blue: {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        accent: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
        certificate: 'from-blue-600 to-indigo-600',
        gold: 'from-yellow-400 to-amber-500'
      },
      green: {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        accent: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
        certificate: 'from-green-600 to-emerald-600',
        gold: 'from-yellow-400 to-amber-500'
      },
      purple: {
        bg: 'from-purple-50 to-violet-50',
        border: 'border-purple-200',
        accent: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700',
        certificate: 'from-purple-600 to-violet-600',
        gold: 'from-yellow-400 to-amber-500'
      }
    };
    return themes[theme as keyof typeof themes] || themes.blue;
  };

  const themeClasses = getThemeClasses();

  const getCertificateStyleClasses = () => {
    const styles = {
      modern: {
        container: 'bg-white border-2 border-gray-300 shadow-2xl',
        header: `bg-gradient-to-r ${themeClasses.certificate} text-white`,
        body: 'bg-white',
        decoration: 'border-l-4 border-gray-200'
      },
      classic: {
        container: 'bg-gradient-to-b from-amber-50 to-yellow-50 border-4 border-amber-600 shadow-2xl',
        header: 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white',
        body: 'bg-gradient-to-b from-amber-50 to-yellow-50',
        decoration: 'border-l-4 border-amber-400'
      },
      elegant: {
        container: 'bg-gradient-to-b from-gray-50 to-white border-2 border-gray-400 shadow-2xl',
        header: 'bg-gradient-to-r from-gray-800 to-gray-900 text-white',
        body: 'bg-gradient-to-b from-gray-50 to-white',
        decoration: 'border-l-4 border-gray-300'
      }
    };
    return styles[certificateStyle as keyof typeof styles] || styles.modern;
  };

  const styleClasses = getCertificateStyleClasses();

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 70) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 55) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div
      {...commonProps}
      onClick={onClick}
      className={cn(
        'min-h-[700px] p-8',
        `bg-gradient-to-br ${themeClasses.bg}`,
        `border ${themeClasses.border} rounded-lg`,
        'transition-all duration-300',
        isSelected && `ring-2 ring-${theme}-500`,
        className
      )}
    >
      {/* Botão de Edição */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <Button
            size="sm"
            variant={isEditMode ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              toggleEditMode();
            }}
          >
            {isEditMode ? 'Salvar' : 'Editar'}
          </Button>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="text-center mb-8">
        {isEditMode ? (
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => handlePropertyChange('title', e.target.value)}
              placeholder="Título da seção"
              className="w-full text-3xl font-bold text-center p-2 border border-gray-300 rounded"
            />
            <textarea
              value={subtitle}
              onChange={(e) => handlePropertyChange('subtitle', e.target.value)}
              placeholder="Subtítulo"
              rows={2}
              className="w-full text-center p-2 border border-gray-300 rounded resize-none"
            />
          </div>
        ) : (
          <div>
            <h1 className={cn('text-3xl font-bold mb-3', themeClasses.accent)}>
              {title}
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Certificado */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className={cn(
          'rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300',
          styleClasses.container
        )}>
          {/* Cabeçalho do Certificado */}
          <div className={cn('p-6 text-center', styleClasses.header)}>
            <div className="flex items-center justify-center gap-4 mb-4">
              {issuerLogo && (
                <img src={issuerLogo} alt="Logo" className="h-12 w-12 object-contain" />
              )}
              <Award className="w-12 h-12 text-white" />
            </div>
            
            {isEditMode ? (
              <input
                type="text"
                value={certificateTitle}
                onChange={(e) => handlePropertyChange('certificateTitle', e.target.value)}
                className="w-full text-2xl font-bold text-center p-2 border border-white/30 rounded bg-white/10 text-white placeholder-white/70"
                placeholder="Título do certificado"
              />
            ) : (
              <h2 className="text-2xl font-bold">{certificateTitle}</h2>
            )}
          </div>

          {/* Corpo do Certificado */}
          <div className={cn('p-8', styleClasses.body)}>
            {/* Declaração Principal */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700 mb-4">
                Certificamos que
              </p>
              
              {isEditMode ? (
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => handlePropertyChange('recipientName', e.target.value)}
                  className="text-3xl font-bold text-center p-2 border border-gray-300 rounded mb-4 w-full"
                  placeholder="Nome do recipiente"
                />
              ) : (
                <h3 className="text-3xl font-bold text-gray-800 mb-4 underline decoration-2 decoration-amber-400">
                  {recipientName}
                </h3>
              )}

              <p className="text-lg text-gray-700 mb-2">
                completou com sucesso a
              </p>

              {isEditMode ? (
                <textarea
                  value={assessmentName}
                  onChange={(e) => handlePropertyChange('assessmentName', e.target.value)}
                  rows={2}
                  className="w-full text-xl font-semibold text-center p-2 border border-gray-300 rounded resize-none"
                  placeholder="Nome da avaliação"
                />
              ) : (
                <h4 className="text-xl font-semibold text-gray-800 italic">
                  "{assessmentName}"
                </h4>
              )}
            </div>

            {/* Informações da Avaliação */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Data e Pontuação */}
              <div className={cn('p-4 rounded-lg border-l-4', styleClasses.decoration)}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">Data de Conclusão:</span>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={completionDate}
                        onChange={(e) => handlePropertyChange('completionDate', e.target.value)}
                        className="font-medium p-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <span className="font-medium">{completionDate}</span>
                    )}
                  </div>

                  {showScore && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600">Pontuação:</span>
                      <Badge className={getScoreBadgeColor(score)}>
                        {score}% - {level}
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Verificado</span>
                  </div>
                </div>
              </div>

              {/* Competências Demonstradas */}
              {showSkills && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Stamp className="w-5 h-5" />
                    Competências Demonstradas
                  </h5>
                  
                  {isEditMode ? (
                    <div className="space-y-2">
                      {skills.map((skill, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => {
                              const newSkills = [...skills];
                              newSkills[index] = e.target.value;
                              handlePropertyChange('skills', newSkills);
                            }}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newSkills = skills.filter((_, i) => i !== index);
                              handlePropertyChange('skills', newSkills);
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newSkills = [...skills, 'Nova competência'];
                          handlePropertyChange('skills', newSkills);
                        }}
                        className="w-full border-dashed"
                      >
                        + Adicionar Competência
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rodapé do Certificado */}
            <div className="text-center border-t border-gray-200 pt-6">
              {isEditMode ? (
                <input
                  type="text"
                  value={issuerName}
                  onChange={(e) => handlePropertyChange('issuerName', e.target.value)}
                  className="w-full text-lg font-medium text-center p-2 border border-gray-300 rounded mb-2"
                  placeholder="Nome da instituição emissora"
                />
              ) : (
                <p className="text-lg font-medium text-gray-800 mb-2">
                  {issuerName}
                </p>
              )}

              {showValidation && (
                <div className="text-sm text-gray-600">
                  <p className="mb-1">
                    Certificado ID: <span className="font-mono font-medium">{certificateId}</span>
                  </p>
                  <p>
                    Validar em: {validationUrl}{certificateId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ações do Certificado */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Button
          size="lg"
          className={cn(
            'px-6 py-3 text-white rounded-lg',
            'transition-all duration-200 transform hover:scale-105',
            'shadow-lg hover:shadow-xl',
            themeClasses.button
          )}
        >
          <Download className="w-5 h-5 mr-2" />
          Baixar PDF
        </Button>

        {showSocialShare && (
          <>
            <Button
              size="lg"
              variant="outline"
              className="px-6 py-3 rounded-lg"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Compartilhar
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-6 py-3 rounded-lg"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              LinkedIn
            </Button>
          </>
        )}

        {showValidation && (
          <Button
            size="lg"
            variant="outline"
            className="px-6 py-3 rounded-lg"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Verificar
          </Button>
        )}
      </div>

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          {/* Configurações do Certificado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pontuação
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => handlePropertyChange('score', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível
              </label>
              <input
                type="text"
                value={level}
                onChange={(e) => handlePropertyChange('level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Opções de Exibição */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showScore ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showScore', !showScore)}
            >
              Mostrar Pontuação
            </Badge>
            
            <Badge
              variant={showSkills ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showSkills', !showSkills)}
            >
              Mostrar Competências
            </Badge>

            <Badge
              variant={showValidation ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showValidation', !showValidation)}
            >
              Mostrar Validação
            </Badge>

            <Badge
              variant={showSocialShare ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showSocialShare', !showSocialShare)}
            >
              Compartilhamento Social
            </Badge>
          </div>

          {/* Estilo do Certificado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estilo do Certificado
            </label>
            <div className="flex gap-2">
              {['modern', 'classic', 'elegant'].map((style) => (
                <Badge
                  key={style}
                  variant={certificateStyle === style ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('certificateStyle', style)}
                >
                  {style}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <div className="flex gap-2">
              {['blue', 'green', 'purple'].map((color) => (
                <Badge
                  key={color}
                  variant={theme === color ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('theme', color)}
                >
                  {color}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCertificateInlineBlock;
