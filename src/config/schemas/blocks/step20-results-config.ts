import { templates } from '../base/builder';
import { titleField, subtitleField, descriptionField, imageFields } from '../base/presets';

// Define categorias de resultado (ex.: A, B, C) com metadados
export const resultCategoriesConfigSchema = templates
  .full('result-categories-config', 'Categorias de Resultado')
  .category('result')
  .icon('Layers')
  .addGroup('content', 'Conteúdo', { order: 1 })
  .addField({
    key: 'categories',
    label: 'Categorias',
    type: 'options-list',
    group: 'content',
    default: [],
    itemSchema: {
      fields: [
        { key: 'code', label: 'Código (A/B/C...)', type: 'text' },
        { key: 'label', label: 'Rótulo', type: 'text' },
        { key: 'description', label: 'Descrição', type: 'text' },
        { key: 'imageUrl', label: 'Imagem (URL)', type: 'text' },
        { key: 'color', label: 'Cor', type: 'text' },
      ],
    },
  })
  .version('2.0.0')
  .build();

// Variáveis de personalização para usar em mensagens e cabeçalhos
export const resultVariablesSchema = templates
  .full('result-variables', 'Variáveis de Resultado')
  .category('result')
  .icon('User')
  .addGroup('content', 'Conteúdo', { order: 1 })
  .addField({ key: 'username', label: 'Username', type: 'string', group: 'content', placeholder: 'Ex.: Maria' })
  .addField({ key: 'styleName', label: 'Style Name', type: 'string', group: 'content', placeholder: 'Ex.: Visionária' })
  .addField({ key: 'avatarUrl', label: 'Avatar URL', type: 'string', group: 'content', inputType: 'url', format: 'url', placeholder: 'https://...' })
  .version('2.0.0')
  .build();

// Mensagens com placeholders (ex.: {username}, {style})
export const resultMessagesSchema = templates
  .full('result-messages', 'Mensagens de Resultado (Templates)')
  .category('result')
  .icon('Type')
  .addGroup('content', 'Conteúdo', { order: 1 })
  .addField({ key: 'titleTemplate', label: 'Título (Template)', type: 'string', group: 'content', placeholder: 'Parabéns, {username}!' })
  .addField({ key: 'subtitleTemplate', label: 'Subtítulo (Template)', type: 'string', group: 'content', placeholder: 'Seu estilo é {style}.' })
  .addField({ key: 'descriptionTemplate', label: 'Descrição (Template)', type: 'richtext', group: 'content', placeholder: 'Texto com {username} e {style}...' })
  .version('2.0.0')
  .build();
