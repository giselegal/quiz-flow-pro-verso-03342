/**
 * ⏱️ SCHEMA: URGENCY-TIMER-INLINE
 * 
 * Bloco de timer de urgência
 */

import { createSchema } from '../base/builder';
import { colorFields, alignmentField } from '../base/presets';
import { BlockFieldSchema } from '../base/types';

// Minutos iniciais
const initialMinutesField: BlockFieldSchema<number> = {
    key: 'initialMinutes',
    label: 'Minutos Iniciais',
    type: 'number',
    group: 'content',
    min: 1,
    max: 120,
    default: 15,
    description: 'Tempo inicial do timer em minutos',
    required: true,
};

// Mensagem de urgência
const urgencyMessageField: BlockFieldSchema<string> = {
    key: 'urgencyMessage',
    label: 'Mensagem de Urgência',
    type: 'string',
    group: 'content',
    placeholder: 'Oferta expira em:',
    default: 'Tempo limitado:',
};

// Mostrar ícone
const showIconField: BlockFieldSchema<boolean> = {
    key: 'showIcon',
    label: 'Mostrar Ícone',
    type: 'boolean',
    group: 'style',
    default: true,
};

// Auto-iniciar
const autoStartField: BlockFieldSchema<boolean> = {
    key: 'autoStart',
    label: 'Iniciar Automaticamente',
    type: 'boolean',
    group: 'logic',
    default: true,
};

// Ação ao expirar
const onExpireActionField: BlockFieldSchema<string> = {
    key: 'onExpireAction',
    label: 'Ação ao Expirar',
    type: 'select',
    group: 'logic',
    enumValues: ['none', 'hide', 'redirect', 'alert'],
    default: 'none',
    description: 'O que fazer quando o timer chegar a zero',
};

export const urgencyTimerInlineSchema = createSchema('urgency-timer-inline', 'Timer de Urgência')
    .description('Contador regressivo para criar senso de urgência')
    .category('engagement')
    .icon('Clock')
    .addGroup('content', 'Conteúdo', { order: 1 })
    .addGroup('style', 'Estilo', { order: 2 })
    .addGroup('logic', 'Lógica', { order: 3 })
    .addGroup('layout', 'Layout', { order: 4 })
    .addFields(
        initialMinutesField,
        urgencyMessageField
    )
    .addFields(
        showIconField,
        ...colorFields('style')
    )
    .addFields(
        autoStartField,
        onExpireActionField
    )
    .addField(alignmentField('layout'))
    .version('2.0.0')
    .build();
