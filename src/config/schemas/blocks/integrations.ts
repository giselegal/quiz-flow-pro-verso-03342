import { templates } from '../base/builder';
import {
  urlField,
  tokenField,
  pixelIdField,
  utmSourceField,
  utmMediumField,
  utmCampaignField,
  eventNameField,
  webhookUrlField,
  webhookSecretField,
} from '../base/presets';

export const trackingConfigSchema = templates
  .full('tracking-config', 'Configurações de Tracking')
  .category('integration')
  .icon('Fingerprint')
  .addGroup('integration', 'Integração', { order: 1 })
  .addField(pixelIdField('facebookPixelId', 'Facebook Pixel ID'))
  .addField(pixelIdField('tiktokPixelId', 'TikTok Pixel ID'))
  .addField(urlField('googleTagManagerUrl', 'GTM URL'))
  .addField(eventNameField('leadEventName', 'Evento de Lead'))
  .version('2.0.0')
  .build();

export const webhookConfigSchema = templates
  .full('webhook-config', 'Configuração de Webhook')
  .category('integration')
  .icon('Webhook')
  .addGroup('integration', 'Integração', { order: 1 })
  .addField(webhookUrlField())
  .addField(webhookSecretField())
  .addField(urlField('fallbackUrl', 'Fallback URL'))
  .version('2.0.0')
  .build();

export const utmDefaultsSchema = templates
  .full('utm-defaults', 'UTM Defaults')
  .category('integration')
  .icon('Link')
  .addGroup('integration', 'Integração', { order: 1 })
  .addField(utmSourceField())
  .addField(utmMediumField())
  .addField(utmCampaignField())
  .version('2.0.0')
  .build();
