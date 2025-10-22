import { templates } from '../base/builder';
import {
  titleField,
  subtitleField,
  descriptionField,
  imageFields,
  buttonFields,
  backgroundColorField,
  textColorField,
  paddingField,
  alignmentField,
} from '../base/presets';

/**
 * Schemas mínimos para tipos de seção do JSON v3.
 * Esses componentes complexos usam props no template v3; aqui registramos
 * schemas básicos para permitir edição mínima e satisfazer cobertura.
 */

export const heroSectionSchema = templates
  .full('HeroSection', 'Seção • Hero (v3)')
  .category('v3-sections')
  .icon('Sparkles')
  // Props principais de HeroSection (alinhado ao v3: props.*)
  .addField({ key: 'showCelebration', label: 'Mostrar celebração', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'celebrationEmoji', label: 'Emoji de celebração', type: 'string', group: 'content', default: '🎉' })
  .addField({ key: 'celebrationAnimation', label: 'Animação', type: 'string', group: 'content', placeholder: 'bounce | pulse | none' })
  .addField({ key: 'greetingFormat', label: 'Formato de saudação', type: 'string', group: 'content', placeholder: 'Olá, {userName}!' })
  .addField({ key: 'titleFormat', label: 'Formato do título', type: 'string', group: 'content', placeholder: 'Seu Estilo Predominante é:' })
  .addField({ key: 'styleNameDisplay', label: 'Exibição do nome do estilo', type: 'string', group: 'content', placeholder: '{styleName}' })
  // Cores (flatten)
  .addField({ key: 'colorsGreeting', label: 'Cor: saudação', type: 'string', group: 'style', placeholder: 'text | primary | secondary' })
  .addField({ key: 'colorsGreetingHighlight', label: 'Cor: destaque saudação', type: 'string', group: 'style', placeholder: 'primary' })
  .addField({ key: 'colorsTitle', label: 'Cor: título', type: 'string', group: 'style', placeholder: 'secondary' })
  .addField({ key: 'colorsStyleName', label: 'Cor: nome do estilo', type: 'string', group: 'style', placeholder: 'primary' })
  // Espaçamento (flatten)
  .addField({ key: 'spacingPadding', label: 'Padding', type: 'string', group: 'layout', placeholder: '3rem 1.5rem' })
  .addField({ key: 'spacingMarginBottom', label: 'Margin bottom', type: 'string', group: 'layout', placeholder: '2.5rem' })
  .version('1.0.0')
  .build();

export const styleProfileSectionSchema = templates
  .full('StyleProfileSection', 'Seção • Perfil de Estilo (v3)')
  .category('v3-sections')
  .icon('Palette')
  // Layout e imagem
  .addField({ key: 'layout', label: 'Layout', type: 'string', group: 'layout', placeholder: 'two-column | single' })
  .addField({ key: 'imagePosition', label: 'Posição da imagem', type: 'select', group: 'layout', enumValues: ['left', 'right'], default: 'left' })
  .addField({ key: 'showStyleImage', label: 'Mostrar imagem do estilo', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'styleImageAspectRatio', label: 'Imagem: Aspect Ratio', type: 'string', group: 'content', placeholder: '4/5' })
  .addField({ key: 'styleImageShowDecorations', label: 'Imagem: Mostrar decorações', type: 'boolean', group: 'style', default: true })
  .addField({ key: 'styleImageDecorationColor', label: 'Imagem: Cor da decoração', type: 'string', group: 'style', placeholder: 'primary' })
  .addField({ key: 'styleImageFallbackEnabled', label: 'Imagem: Fallback habilitado', type: 'boolean', group: 'style', default: true })
  // Intro text
  .addField({ key: 'showIntroText', label: 'Mostrar texto introdutório', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'introTextText', label: 'Intro: Texto', type: 'string', group: 'content' })
  .addField({ key: 'introTextStyle', label: 'Intro: Estilo', type: 'string', group: 'style', placeholder: 'italic' })
  .addField({ key: 'introTextBackground', label: 'Intro: Background', type: 'string', group: 'style', placeholder: 'primary/5' })
  .addField({ key: 'introTextBorderLeft', label: 'Intro: Borda esquerda', type: 'boolean', group: 'style', default: true })
  // Descrição, transição
  .addField({ key: 'showDescription', label: 'Mostrar descrição', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'showTransitionText', label: 'Mostrar texto de transição', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'transitionText', label: 'Texto de transição', type: 'string', group: 'content' })
  // Barras de progresso
  .addField({ key: 'showProgressBars', label: 'Mostrar barras de progresso', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'progressBarsTopCount', label: 'Progresso: Top N', type: 'number', group: 'content', default: 3 })
  .addField({ key: 'progressBarsShowPercentage', label: 'Progresso: Mostrar %', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'progressBarsPercentageFormat', label: 'Progresso: Formato %', type: 'string', group: 'content', placeholder: '{percentage}%' })
  .addField({ key: 'progressBarsAnimationDelay', label: 'Progresso: Delay animação (ms)', type: 'number', group: 'layout', default: 200 })
  .addField({ key: 'progressBarsTitleFormat', label: 'Progresso: Título', type: 'string', group: 'content' })
  .addField({ key: 'progressBarsColorsPrimary', label: 'Progresso: Cor primária', type: 'string', group: 'style', placeholder: 'primary to accent' })
  .addField({ key: 'progressBarsColorsSecondary', label: 'Progresso: Cor secundária', type: 'string', group: 'style', placeholder: 'primary/80 to accent/80' })
  .addField({ key: 'progressBarsColorsTertiary', label: 'Progresso: Cor terciária', type: 'string', group: 'style', placeholder: 'primary/60 to accent/60' })
  // Keywords
  .addField({ key: 'showKeywords', label: 'Mostrar palavras-chave', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'keywordsTitle', label: 'Keywords: Título', type: 'string', group: 'content' })
  .addField({ key: 'keywordsTagColor', label: 'Keywords: Cor da tag', type: 'string', group: 'style', placeholder: 'primary' })
  .addField({ key: 'keywordsTagStyle', label: 'Keywords: Estilo da tag', type: 'string', group: 'style', placeholder: 'rounded-full' })
  // Perguntas persuasivas
  .addField({ key: 'showPersuasiveQuestions', label: 'Mostrar perguntas persuasivas', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'persuasiveQuestionsTitle', label: 'Perguntas: Título', type: 'string', group: 'content' })
  .addField({ key: 'persuasiveQuestionsIcon', label: 'Perguntas: Ícone', type: 'string', group: 'content', placeholder: '❓' })
  .addField({ key: 'persuasiveQuestionsStyle', label: 'Perguntas: Estilo', type: 'string', group: 'style', placeholder: 'italic' })
  .addField({ key: 'persuasiveQuestionsBackground', label: 'Perguntas: Background', type: 'string', group: 'style', placeholder: 'primary/5' })
  .addField({ key: 'persuasiveQuestionsBorder', label: 'Perguntas: Borda', type: 'string', group: 'style', placeholder: 'primary/30' })
  // Mensagem final
  .addField({ key: 'showClosingMessage', label: 'Mostrar mensagem final', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'closingMessageText', label: 'Mensagem final: Texto', type: 'string', group: 'content' })
  .addField({ key: 'closingMessageStyle', label: 'Mensagem final: Estilo', type: 'string', group: 'style', placeholder: 'italic' })
  .addField({ key: 'closingMessageFontWeight', label: 'Mensagem final: Peso', type: 'string', group: 'style', placeholder: 'medium' })
  .addField({ key: 'closingMessageBackground', label: 'Mensagem final: Background', type: 'string', group: 'style', placeholder: 'gradient primary/10 to accent/10' })
  .addField({ key: 'closingMessageTextAlign', label: 'Mensagem final: Alinhamento', type: 'string', group: 'layout', placeholder: 'center' })
  // Imagem do guia
  .addField({ key: 'showGuideImage', label: 'Mostrar imagem do guia', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'guideImagePosition', label: 'Guia: Posição', type: 'string', group: 'layout', placeholder: 'below' })
  .addField({ key: 'guideImageAspectRatio', label: 'Guia: Aspect Ratio', type: 'string', group: 'content', placeholder: '4/5' })
  .addField({ key: 'guideImageMaxWidth', label: 'Guia: Largura Máx', type: 'string', group: 'layout', placeholder: '28rem' })
  .addField({ key: 'guideImageCentered', label: 'Guia: Centralizar', type: 'boolean', group: 'layout', default: true })
  .version('1.0.0')
  .build();

export const resultCalculationSectionSchema = templates
  .full('ResultCalculationSection', 'Seção • Cálculo de Resultado (v3)')
  .category('v3-sections')
  .icon('Calculator')
  // Campos essenciais (sanity)
  .addField({ key: 'calculationMethod', label: 'Método de cálculo', type: 'string', group: 'content', placeholder: 'weighted_sum' })
  .addField({ key: 'minThreshold', label: 'Limiar mínimo', type: 'number', group: 'content', default: 0 })
  // Objetos complexos tratados como JSON para edição avançada
  .addField({ key: 'scoreMapping', label: 'Mapeamento de Pontuações', type: 'json', group: 'content', description: 'Tabela de faixas por estilo (romantico, classico, ...)' })
  .addField({ key: 'resultLogic', label: 'Lógica de Resultado', type: 'json', group: 'content', description: 'winnerSelection, tieBreaker, minThreshold' })
  .addField({ key: 'leadCapture', label: 'Captura de Lead', type: 'json', group: 'content', description: 'Configuração do formulário embutido' })
  .version('1.0.0')
  .build();

export const methodStepsSectionSchema = templates
  .full('MethodStepsSection', 'Seção • Método Passo a Passo (v3)')
  .category('v3-sections')
  .icon('List')
  .addField({ key: 'sectionTitle', label: 'Título da Seção', type: 'string', group: 'content', placeholder: 'O Método 5 Passos' })
  .addField({
    key: 'steps',
    label: 'Passos',
    type: 'options-list',
    group: 'content',
    default: [],
    itemSchema: {
      fields: [
        { key: 'number', label: 'Nº', type: 'number' },
        { key: 'icon', label: 'Ícone', type: 'text' },
        { key: 'title', label: 'Título', type: 'text' },
        { key: 'description', label: 'Descrição', type: 'text' },
      ]
    }
  })
  // Estilo dos passos (flatten)
  .addField({ key: 'stepStyleLayout', label: 'Estilo: Layout', type: 'string', group: 'layout', placeholder: 'card | list' })
  .addField({ key: 'stepStyleBackground', label: 'Estilo: Fundo', type: 'string', group: 'style', placeholder: 'white | primary/5' })
  .addField({ key: 'stepStyleBorder', label: 'Estilo: Borda', type: 'string', group: 'style', placeholder: 'primary/20' })
  .addField({ key: 'stepStylePadding', label: 'Estilo: Padding', type: 'string', group: 'layout', placeholder: '1.5rem' })
  .addField({ key: 'stepStyleIconColor', label: 'Estilo: Cor do ícone', type: 'string', group: 'style', placeholder: 'primary' })
  .addField({ key: 'stepStyleTitleColor', label: 'Estilo: Cor do título', type: 'string', group: 'style', placeholder: 'secondary' })
  .addField({ key: 'stepStyleDescriptionColor', label: 'Estilo: Cor da descrição', type: 'string', group: 'style', placeholder: 'text' })
  .addField(alignmentField('layout'))
  .addField(paddingField('layout'))
  .addField(backgroundColorField('style'))
  .addField(textColorField('style'))
  .version('1.0.0')
  .build();

export const bonusSectionSchema = templates
  .full('BonusSection', 'Seção • Bônus (v3)')
  .category('v3-sections')
  .icon('Gift')
  .addField({ key: 'sectionTitle', label: 'Título da Seção', type: 'string', group: 'content', placeholder: 'Bônus Exclusivos' })
  .addField({
    key: 'items',
    label: 'Itens de Bônus',
    type: 'options-list',
    group: 'content',
    default: [],
    itemSchema: {
      fields: [
        { key: 'title', label: 'Título', type: 'text' },
        { key: 'description', label: 'Descrição', type: 'text' },
        { key: 'icon', label: 'Ícone', type: 'text' },
        { key: 'image', label: 'Imagem', type: 'image' },
      ]
    }
  })
  .addField({ key: 'layout', label: 'Layout', type: 'string', group: 'layout', placeholder: 'grid-3 | list' })
  .addField({ key: 'cardStyleBackground', label: 'Card: Fundo', type: 'string', group: 'style', placeholder: 'primary/5' })
  .addField({ key: 'cardStyleBorder', label: 'Card: Borda', type: 'string', group: 'style', placeholder: 'primary/20' })
  .addField({ key: 'cardStylePadding', label: 'Card: Padding', type: 'string', group: 'layout', placeholder: '1.5rem' })
  .addField(paddingField('layout'))
  .addField(backgroundColorField('style'))
  .addField(textColorField('style'))
  .version('1.0.0')
  .build();

export const socialProofSectionSchema = templates
  .full('SocialProofSection', 'Seção • Prova Social (v3)')
  .category('v3-sections')
  .icon('Users')
  .addField({ key: 'sectionTitle', label: 'Título da Seção', type: 'string', group: 'content', placeholder: 'Transformações Reais' })
  .addField({ key: 'layout', label: 'Layout', type: 'string', group: 'layout', placeholder: 'grid-3 | list' })
  .addField({
    key: 'testimonials',
    label: 'Depoimentos',
    type: 'options-list',
    group: 'content',
    default: [],
    itemSchema: {
      fields: [
        { key: 'name', label: 'Nome', type: 'text' },
        { key: 'role', label: 'Cargo', type: 'text' },
        { key: 'text', label: 'Depoimento', type: 'text' },
        { key: 'rating', label: 'Nota', type: 'number' },
        { key: 'image', label: 'Imagem', type: 'image' },
      ]
    }
  })
  .addField({ key: 'cardStyleBackground', label: 'Card: Fundo', type: 'string', group: 'style', placeholder: 'primary/5' })
  .addField({ key: 'cardStylePadding', label: 'Card: Padding', type: 'string', group: 'layout', placeholder: '1.5rem' })
  .addField({ key: 'cardStyleShowStars', label: 'Card: Mostrar estrelas', type: 'boolean', group: 'style', default: true })
  .addField({ key: 'cardStyleStarColor', label: 'Card: Cor das estrelas', type: 'string', group: 'style', placeholder: 'primary' })
  .addField(paddingField('layout'))
  .addField(backgroundColorField('style'))
  .addField(textColorField('style'))
  .version('1.0.0')
  .build();

export const offerSectionSchema = templates
  .full('OfferSection', 'Seção • Oferta (v3)')
  .category('v3-sections')
  .icon('Megaphone')
  .addField({ key: 'layout', label: 'Layout', type: 'string', group: 'layout', placeholder: 'centered-card' })
  .addField({ key: 'maxWidth', label: 'Largura Máxima', type: 'string', group: 'layout', placeholder: '42rem' })
  .addField({ key: 'showUrgency', label: 'Mostrar urgência', type: 'boolean', group: 'content', default: false })
  // Pricing (flatten)
  .addField({ key: 'pricingShowOriginalPrice', label: 'Preço: mostrar original', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'pricingOriginalPrice', label: 'Preço: original', type: 'number', group: 'content' })
  .addField({ key: 'pricingSalePrice', label: 'Preço: promocional', type: 'number', group: 'content' })
  .addField({ key: 'pricingInstallmentsShow', label: 'Parcelas: mostrar', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'pricingInstallmentsCount', label: 'Parcelas: quantidade', type: 'number', group: 'content' })
  .addField({ key: 'pricingInstallmentsValue', label: 'Parcelas: valor', type: 'number', group: 'content' })
  .addField({ key: 'discountShow', label: 'Desconto: mostrar', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'discountPercentage', label: 'Desconto: %', type: 'number', group: 'content' })
  .addField({ key: 'discountLabel', label: 'Desconto: rótulo', type: 'string', group: 'content', placeholder: '78% de desconto' })
  .addField({ key: 'discountStyle', label: 'Desconto: estilo', type: 'string', group: 'style', placeholder: 'badge' })
  .addField({ key: 'discountColor', label: 'Desconto: cor', type: 'string', group: 'style', placeholder: 'success' })
  // Includes
  .addField({ key: 'includesTitle', label: 'Inclui: título', type: 'string', group: 'content', placeholder: 'O que você recebe' })
  .addField({
    key: 'includesItems',
    label: 'Inclui: itens',
    type: 'options-list',
    group: 'content',
    default: [],
    itemSchema: {
      fields: [
        { key: 'icon', label: 'Ícone', type: 'text' },
        { key: 'text', label: 'Texto', type: 'text' },
      ]
    }
  })
  // Background
  .addField({ key: 'backgroundType', label: 'Fundo: tipo', type: 'string', group: 'style', placeholder: 'gradient | solid' })
  .addField({ key: 'backgroundFrom', label: 'Fundo: de', type: 'string', group: 'style', placeholder: 'primary/10' })
  .addField({ key: 'backgroundTo', label: 'Fundo: para', type: 'string', group: 'style', placeholder: 'accent/5' })
  .addField(paddingField('layout'))
  .addField(alignmentField('layout'))
  .addField(backgroundColorField('style'))
  .addField(textColorField('style'))
  .version('1.0.0')
  .build();

export const guaranteeSectionSchema = templates
  .full('GuaranteeSection', 'Seção • Garantia (v3)')
  .category('v3-sections')
  .icon('ShieldCheck')
  .addField({ key: 'days', label: 'Dias de garantia', type: 'number', group: 'content', default: 7 })
  .addField({ key: 'icon', label: 'Ícone', type: 'string', group: 'content', placeholder: '🕊️' })
  .addField({ key: 'title', label: 'Título', type: 'string', group: 'content', placeholder: 'Garantia de Satisfação Total' })
  .addField({ key: 'description', label: 'Descrição', type: 'richtext', group: 'content' })
  .addField({ key: 'badgeText', label: 'Badge', type: 'string', group: 'content', placeholder: 'Compra 100% Segura' })
  .addField({ key: 'backgroundType', label: 'Fundo: tipo', type: 'string', group: 'style', placeholder: 'solid | gradient' })
  .addField({ key: 'backgroundColor', label: 'Fundo: cor', type: 'string', group: 'style', placeholder: 'primary/5' })
  .addField({ key: 'borderShow', label: 'Borda: mostrar', type: 'boolean', group: 'style', default: true })
  .addField({ key: 'borderColor', label: 'Borda: cor', type: 'string', group: 'style', placeholder: 'primary/20' })
  .addField({ key: 'layout', label: 'Layout', type: 'string', group: 'layout', placeholder: 'centered' })
  .addField({ key: 'iconSize', label: 'Tamanho do ícone', type: 'string', group: 'style', placeholder: '3xl' })
  .addField(paddingField('layout'))
  .addField(textColorField('style'))
  .version('1.0.0')
  .build();

export const transformationSectionSchema = templates
  .full('TransformationSection', 'Seção • Transformação (v3)')
  .category('v3-sections')
  .icon('Sparkles')
  .addField({ key: 'mainTitle', label: 'Título Principal', type: 'string', group: 'content', placeholder: 'Transforme Sua Imagem' })
  .addField({ key: 'subtitle', label: 'Subtítulo', type: 'string', group: 'content' })
  .addField({ key: 'highlightColor', label: 'Cor de destaque', type: 'string', group: 'style', placeholder: 'primary' })
  .addField({ key: 'highlightWords', label: 'Palavras de destaque', type: 'options-list', group: 'content', default: [], itemSchema: { fields: [ { key: 'text', label: 'Palavra', type: 'text' } ] } as any })
  .addField({ key: 'layout', label: 'Layout', type: 'string', group: 'layout', placeholder: 'grid-2x2 | list' })
  .addField({
    key: 'benefits',
    label: 'Benefícios',
    type: 'options-list',
    group: 'content',
    default: [],
    itemSchema: {
      fields: [
        { key: 'icon', label: 'Ícone', type: 'text' },
        { key: 'text', label: 'Texto', type: 'text' },
      ]
    }
  })
  .addField({ key: 'benefitStyleBackground', label: 'Benefício: Fundo', type: 'string', group: 'style', placeholder: 'primary/5' })
  .addField({ key: 'benefitStyleIconSize', label: 'Benefício: Tamanho ícone', type: 'string', group: 'style', placeholder: '2xl' })
  .addField({ key: 'benefitStyleTextAlign', label: 'Benefício: Alinhamento', type: 'string', group: 'layout', placeholder: 'left | center' })
  .addField({ key: 'benefitStylePadding', label: 'Benefício: Padding', type: 'string', group: 'layout', placeholder: '1rem' })
  .addField(paddingField('layout'))
  .addField(backgroundColorField('style'))
  .addField(textColorField('style'))
  .version('1.0.0')
  .build();
