import { templates } from '../base/builder';

export const eventsMapSchema = templates
  .full('events-map', 'Eventos Personalizados')
  .category('integration')
  .icon('Activity')
  .addGroup('integration', 'Integração', { order: 1 })
  .addField({
    key: 'events',
    label: 'Eventos',
    type: 'options-list',
    group: 'integration',
    default: [],
    itemSchema: {
      fields: [
        { key: 'name', label: 'Nome', type: 'text' },
        { key: 'endpoint', label: 'Endpoint (URL)', type: 'text' },
        { key: 'payload', label: 'Payload (JSON)', type: 'text' },
      ]
    }
  })
  .version('2.0.0')
  .build();
