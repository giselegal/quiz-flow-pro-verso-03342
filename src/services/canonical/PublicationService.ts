/**
 * 🚀 PUBLICATION SERVICE (Canonical)
 * 
 * Orquestra a publicação de funis NoCode:
 * - Validação de configurações (Zod + business rules)
 * - Geração de URL pública
 * - Publicação/despublicação (status + published_at)
 * - Verificação de conflitos de domínio/slug
 * 
 * Integra com:
 * - FunnelSettingsService: Leitura/escrita de settings
 * - FunnelDataService: CRUD de funis
 * - Zod: Validação de schemas
 * 
 * Arquitetura canonical:
 * - BaseCanonicalService
 * - Result pattern
 * - Telemetria CanonicalServicesMonitor
 */

import { BaseCanonicalService, ServiceResult } from '@/services/canonical/types';
import { FunnelDataService } from './data/FunnelDataService';
import { FunnelSettingsService } from './data/FunnelSettingsService';
import { supabase } from '@/integrations/supabase/customClient';
import { CanonicalServicesMonitor } from './monitoring';
import type { PublicationSettings } from './data/FunnelSettingsService';

// ============================================================================
// TYPES
// ============================================================================

export type FunnelStatus = 'draft' | 'published' | 'archived';

export interface PublishOptions {
  force?: boolean; // Sobrescrever conflitos de domínio
  notify?: boolean; // Enviar notificação após publicação
  timestamp?: Date; // Agendar publicação
}

export interface PublishResult {
  funnelId: string;
  status: FunnelStatus;
  url: string;
  publishedAt: Date;
  warnings?: string[];
}

export interface ValidationIssue {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export interface UrlConflict {
  existingFunnelId: string;
  existingFunnelName: string;
  conflictingUrl: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export class PublicationService extends BaseCanonicalService {
  private static instance: PublicationService;
  private funnelDataService: FunnelDataService;
  private funnelSettingsService: FunnelSettingsService;

  private constructor() {
    super('PublicationService', '1.0.0');
    this.funnelDataService = FunnelDataService.getInstance();
    this.funnelSettingsService = FunnelSettingsService.getInstance();
  }

  static getInstance(): PublicationService {
    if (!this.instance) {
      this.instance = new PublicationService();
    }
    return this.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('PublicationService initialized');
  }

  protected async onDispose(): Promise<void> {
    this.log('PublicationService disposed');
  }

  // ============================================================================
  // PUBLISH
  // ============================================================================

  async publish(
    funnelId: string,
    options: PublishOptions = {},
  ): Promise<ServiceResult<PublishResult>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'publish');

    try {
      // 1. Buscar funnel
      const funnelResult = await this.funnelDataService.getFunnel(funnelId);
      if (!funnelResult.success || !funnelResult.data) {
        return this.failure('FUNNEL_NOT_FOUND', `Funnel ${funnelId} not found`);
      }

      const funnel = funnelResult.data;

      // 2. Buscar settings
      const settingsResult = await this.funnelSettingsService.getSettings(funnelId);
      if (!settingsResult.success || !settingsResult.data) {
        return this.failure('SETTINGS_NOT_FOUND', 'Cannot publish without settings');
      }

      const settings = settingsResult.data;

      // 3. Validar settings
      const validationResult = await this.validate(settings);
      if (!validationResult.success || !validationResult.data) {
        return this.failure('VALIDATION_FAILED', 'Settings validation failed');
      }

      const validation = validationResult.data;
      if (!validation.isValid) {
        const errorMessages = validation.errors.map(e => e.message).join(', ');
        return this.failure('VALIDATION_ERRORS', errorMessages);
      }

      // 4. Verificar conflitos de domínio/slug
      const conflictResult = await this.checkUrlConflicts(funnelId, settings);
      if (!conflictResult.success) {
        return conflictResult as ServiceResult<PublishResult>;
      }

      if (conflictResult.data && !options.force) {
        const conflict = conflictResult.data;
        return this.failure(
          'URL_CONFLICT',
          `URL já está em uso pelo funil "${conflict.existingFunnelName}" (ID: ${conflict.existingFunnelId})`,
        );
      }

      // 5. Gerar URL pública
      const urlResult = await this.funnelSettingsService.generatePreviewUrl(funnelId);
      if (!urlResult.success || !urlResult.data) {
        return this.failure('URL_GENERATION_FAILED', 'Failed to generate public URL');
      }

      const publicUrl = urlResult.data;

      // 6. Atualizar status do funnel
      const publishedAt = options.timestamp || new Date();
        const { error } = await supabase
          .from('funnels')
          .update({
            is_published: false,
            updated_at: new Date().toISOString(),
          })
          .eq('id', funnelId);      if (error) {
        return this.failure('PUBLISH_FAILED', `Failed to publish: ${error.message}`);
      }

      this.log('Funnel published', { funnelId, url: publicUrl });

      return this.success({
        funnelId,
        status: 'published' as FunnelStatus,
        url: publicUrl,
        publishedAt,
        warnings: validation.warnings.map(w => w.message),
      });
    } catch (error) {
      return this.failure('UNKNOWN_ERROR', `Unexpected error: ${error}`);
    }
  }

  // ============================================================================
  // UNPUBLISH
  // ============================================================================

  async unpublish(funnelId: string): Promise<ServiceResult<{ status: FunnelStatus }>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'unpublish');

    try {
      const { error } = await supabase
        .from('funnels')
        .update({
          is_published: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', funnelId);

      if (error) {
        return this.failure('UNPUBLISH_FAILED', `Failed to unpublish: ${error.message}`);
      }

      this.log('Funnel unpublished', { funnelId });

      return this.success({ status: 'draft' as FunnelStatus });
    } catch (error) {
      return this.failure('UNKNOWN_ERROR', `Unexpected error: ${error}`);
    }
  }

  // ============================================================================
  // VALIDATE
  // ============================================================================

  async validate(settings: PublicationSettings): Promise<ServiceResult<ValidationResult>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'validate');

    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];

    // DOMAIN VALIDATION
    if (!settings.domain.slug) {
      errors.push({
        field: 'domain.slug',
        message: 'Slug é obrigatório',
        severity: 'error',
      });
    } else {
      // Slug format
      if (!/^[a-z0-9-]+$/.test(settings.domain.slug)) {
        errors.push({
          field: 'domain.slug',
          message: 'Slug deve conter apenas letras minúsculas, números e hífens',
          severity: 'error',
        });
      }

      // Slug length
      if (settings.domain.slug.length < 3) {
        errors.push({
          field: 'domain.slug',
          message: 'Slug deve ter no mínimo 3 caracteres',
          severity: 'error',
        });
      }

      if (settings.domain.slug.length > 50) {
        errors.push({
          field: 'domain.slug',
          message: 'Slug não deve exceder 50 caracteres',
          severity: 'error',
        });
      }
    }

    // Custom domain format
    if (settings.domain.customDomain) {
      const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
      if (!domainRegex.test(settings.domain.customDomain)) {
        errors.push({
          field: 'domain.customDomain',
          message: 'Domínio customizado inválido (ex: meusite.com)',
          severity: 'error',
        });
      }
    }

    // Subdomain format
    if (settings.domain.subdomain) {
      if (!/^[a-z0-9-]+$/.test(settings.domain.subdomain)) {
        errors.push({
          field: 'domain.subdomain',
          message: 'Subdomínio deve conter apenas letras minúsculas, números e hífens',
          severity: 'error',
        });
      }
    }

    // SEO VALIDATION
    if (settings.seo.title) {
      if (settings.seo.title.length > 60) {
        warnings.push({
          field: 'seo.title',
          message: 'Título SEO acima de 60 caracteres pode ser truncado pelo Google',
          severity: 'warning',
        });
      }
    } else {
      warnings.push({
        field: 'seo.title',
        message: 'Título SEO não configurado',
        severity: 'warning',
      });
    }

    if (settings.seo.description) {
      if (settings.seo.description.length > 160) {
        warnings.push({
          field: 'seo.description',
          message: 'Descrição SEO acima de 160 caracteres pode ser truncada',
          severity: 'warning',
        });
      }
    }

    if (settings.seo.ogImage) {
      const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i;
      if (!urlRegex.test(settings.seo.ogImage)) {
        errors.push({
          field: 'seo.ogImage',
          message: 'URL da imagem OG inválida (deve ser HTTPS e terminar com .jpg, .png, .webp, .gif)',
          severity: 'error',
        });
      }
    }

    // TRACKING VALIDATION
    if (settings.tracking.googleAnalytics) {
      if (!/^G-[A-Z0-9]{10,}$/.test(settings.tracking.googleAnalytics)) {
        errors.push({
          field: 'tracking.googleAnalytics',
          message: 'ID do Google Analytics inválido (formato: G-XXXXXXXXXX)',
          severity: 'error',
        });
      }
    }

    if (settings.tracking.facebookPixel) {
      if (!/^\d{15,16}$/.test(settings.tracking.facebookPixel)) {
        errors.push({
          field: 'tracking.facebookPixel',
          message: 'ID do Facebook Pixel inválido (deve ter 15-16 dígitos)',
          severity: 'error',
        });
      }
    }

    if (settings.tracking.gtm) {
      if (!/^GTM-[A-Z0-9]{7,}$/.test(settings.tracking.gtm)) {
        errors.push({
          field: 'tracking.gtm',
          message: 'ID do Google Tag Manager inválido (formato: GTM-XXXXXXX)',
          severity: 'error',
        });
      }
    }

    // RESULTS VALIDATION
    if (!settings.results.primary.title) {
      errors.push({
        field: 'results.primary.title',
        message: 'Perfil primário deve ter um título',
        severity: 'error',
      });
    }

    if (!settings.results.primary.description) {
      warnings.push({
        field: 'results.primary.description',
        message: 'Perfil primário sem descrição',
        severity: 'warning',
      });
    }

    // SECURITY VALIDATION
    if (settings.security.webhooks) {
      settings.security.webhooks.forEach((webhook, index) => {
        const urlRegex = /^https:\/\/.+/;
        if (!urlRegex.test(webhook.url)) {
          errors.push({
            field: `security.webhooks[${index}].url`,
            message: 'Webhook deve usar HTTPS',
            severity: 'error',
          });
        }
      });
    }

    return this.success({
      isValid: errors.length === 0,
      errors,
      warnings,
    });
  }

  // ============================================================================
  // CHECK URL CONFLICTS
  // ============================================================================

  async checkUrlConflicts(
    funnelId: string,
    settings: PublicationSettings,
  ): Promise<ServiceResult<UrlConflict | null>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'checkUrlConflicts');

    try {
      const { data, error } = await supabase
        .from('funnels')
        .select('id, name, settings')
        .neq('id', funnelId)
        .eq('status', 'published');

      if (error) {
        return this.failure('SUPABASE_ERROR', `Failed to check conflicts: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return this.success(null); // Nenhum conflito
      }

      // Gerar URL do funnel atual
      const currentUrl = this.buildUrl(settings.domain);

      // Verificar conflitos
      for (const funnel of data) {
        const existingSettings = (funnel.config as any) || {};
        const existingUrl = this.buildUrl(existingSettings.domain);

        if (currentUrl === existingUrl) {
          return this.success({
            existingFunnelId: funnel.id,
            existingFunnelName: funnel.name,
            conflictingUrl: currentUrl,
          });
        }
      }

      return this.success(null); // Nenhum conflito
    } catch (error) {
      return this.failure('UNKNOWN_ERROR', `Unexpected error: ${error}`);
    }
  }

  // ============================================================================
  // GENERATE PUBLIC URL
  // ============================================================================

  async generateUrl(funnelId: string): Promise<ServiceResult<string>> {
    CanonicalServicesMonitor.trackUsage(this.name, 'generateUrl');
    return this.funnelSettingsService.generatePreviewUrl(funnelId);
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private buildUrl(domain: PublicationSettings['domain']): string {
    const subdomain = domain.subdomain || 'app';
    const slug = domain.slug || 'quiz';

    if (domain.customDomain) {
      return `https://${domain.customDomain}/${slug}`;
    }

    return `https://${subdomain}.quizflowpro.com/${slug}`;
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const publicationService = PublicationService.getInstance();
export default publicationService;
