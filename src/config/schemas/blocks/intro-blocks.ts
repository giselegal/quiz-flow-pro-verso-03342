import { templates } from '../base/builder';
import { titleField, subtitleField, descriptionField, imageFields, buttonFields, placeholderField, textColorField, paddingField, alignmentField } from '../base/presets';

export const introLogoSchema = templates
  .full('intro-logo', 'Intro • Logo')
  .category('intro')
  .icon('Image')
  .addFields(...imageFields('content'))
  .version('2.0.0')
  .build();

export const introTitleSchema = templates
  .full('intro-title', 'Intro • Título')
  .category('intro')
  .icon('Type')
  // Compatibilidade com JSON v3
  .addField({ key: 'titleHtml', label: 'Título (HTML)', type: 'string', group: 'content', placeholder: '<strong>Descubra</strong> seu estilo' })
  .addField(titleField('content'))
  .addField(subtitleField('content'))
  .version('2.0.0')
  .build();

export const introImageSchema = templates
  .full('intro-image', 'Intro • Imagem')
  .category('intro')
  .icon('Image')
  .addFields(...imageFields('content'))
  // Compatibilidade com JSON v3 (dimensões no content)
  .addField({ key: 'width', label: 'Largura (px)', type: 'number', group: 'content', min: 0, max: 2000 })
  .addField({ key: 'height', label: 'Altura (px)', type: 'number', group: 'content', min: 0, max: 2000 })
  .addField({ key: 'objectFit', label: 'Object Fit', type: 'select', group: 'content', enumValues: ['contain','cover','fill','none','scale-down'], default: 'contain' })
  .addField({ key: 'maxWidth', label: 'Largura Máxima (px)', type: 'number', group: 'content', min: 0, max: 2000 })
  .version('2.0.0')
  .build();

export const introDescriptionSchema = templates
  .full('intro-description', 'Intro • Descrição')
  .category('intro')
  .icon('AlignLeft')
  // Compatibilidade com JSON v3
  .addField({ key: 'text', label: 'Texto', type: 'string', group: 'content', placeholder: 'Descrição breve...' })
  .addField(descriptionField('content'))
  .version('2.0.0')
  .build();

export const introHeroSchema = templates
  .full('intro-hero', 'Intro • Hero')
  .category('intro')
  .icon('Sparkles')
  .addField(titleField('content'))
  .addField(subtitleField('content'))
  .addFields(...imageFields('content'))
  .addFields(...buttonFields('content'))
  .version('2.0.0')
  .build();

export const introFormSchema = templates
  .full('intro-form', 'Intro • Formulário')
  .category('intro')
  .icon('FormInput')
  // Campos expandidos para cobrir JSON v3
  .addField({ key: 'formQuestion', label: 'Pergunta do Formulário', type: 'string', group: 'content', placeholder: 'Como posso te chamar?' })
  .addField({ key: 'nameLabel', label: 'Label do Nome', type: 'string', group: 'content', placeholder: 'Seu primeiro nome' })
  .addField({ key: 'namePlaceholder', label: 'Placeholder do Nome', type: 'string', group: 'content', placeholder: 'Digite seu primeiro nome...' })
  .addField(placeholderField('content'))
  .addField({ key: 'submitText', label: 'Texto do Botão', type: 'string', group: 'content', placeholder: 'Quero Descobrir meu Estilo Agora!' })
  .addField({ key: 'validationMessage', label: 'Mensagem de Validação', type: 'string', group: 'content', placeholder: 'Por favor, digite seu nome para continuar' })
  .addField({ key: 'helperText', label: 'Texto de Ajuda', type: 'string', group: 'content', placeholder: 'Seu nome é necessário para personalizar sua experiência.' })
  .addField({ key: 'showNameField', label: 'Mostrar Campo Nome', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'showEmailField', label: 'Mostrar Campo Email', type: 'boolean', group: 'content', default: false })
  .addField({ key: 'requiredFields', label: 'Campos Obrigatórios', type: 'string', group: 'content', placeholder: 'name|email' })
  .addFields(...buttonFields('content'))
  .version('2.0.0')
  .build();

// Novo: Header compacto com logo e barra decorativa (compatível com quiz-intro-header do v3)
export const quizIntroHeaderSchema = templates
  .full('quiz-intro-header', 'Intro • Header do Quiz (Logo + Barra)')
  .category('intro')
  .icon('Layout')
  .addField({ key: 'logoUrl', label: 'URL da Logo', type: 'string', group: 'content', placeholder: 'https://...' })
  .addField({ key: 'logoAlt', label: 'Alt da Logo', type: 'string', group: 'content', placeholder: 'Logo' })
  .addField({ key: 'logoWidth', label: 'Largura da Logo (px)', type: 'number', group: 'content', default: 132, min: 16, max: 512 })
  .addField({ key: 'logoHeight', label: 'Altura da Logo (px)', type: 'number', group: 'content', default: 55, min: 8, max: 256 })
  .addField({ key: 'showBar', label: 'Mostrar Barra', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'barColor', label: 'Cor da Barra', type: 'color', group: 'content', default: '#B89B7A' })
  .addField({ key: 'barHeight', label: 'Altura da Barra (px)', type: 'number', group: 'content', default: 3, min: 1, max: 12 })
  .addField({ key: 'barMaxWidth', label: 'Largura Máxima da Barra (px)', type: 'number', group: 'content', default: 300, min: 50, max: 1200 })
  .addField(paddingField('style'))
  .addField(textColorField('style'))
  .addField(alignmentField('layout'))
  .version('2.0.0')
  .build();

// Novo: Footer Copyright simples
export const footerCopyrightSchema = templates
  .full('footer-copyright', 'Footer • Copyright')
  .category('footer')
  .icon('Copyright')
  .addField({ key: 'text', label: 'Texto', type: 'string', group: 'content', placeholder: '© 2025 Sua Marca - Todos os direitos reservados' })
  .addField(alignmentField('style'))
  .addField(paddingField('style'))
  .version('2.0.0')
  .build();
