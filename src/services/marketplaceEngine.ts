/**
 * 🏪 MARKETPLACE FOUNDATION SYSTEM
 * Sistema base para marketplace de templates e componentes
 * 
 * Implementa avaliações, monetização, distribuição e
 * economia de escala para templates de funis.
 * 
 * Fase 3: Enterprise Features - Roadmap de Escalabilidade
 */

import { getLogger } from '@/utils/logging';
import { HybridFunnelData } from './improvedFunnelSystem';
import { Component } from './componentLibrary';
// Migrado para adapter unificado
import { analyticsEngineAdapter as analyticsEngine } from '@/analytics/compat/analyticsEngineAdapter';
import { unifiedEventTracker } from '@/analytics/UnifiedEventTracker';

const logger = getLogger();

// ============================================================================
// INTERFACES E TIPOS
// ============================================================================

export interface MarketplaceTemplate {
    id: string;
    name: string;
    description: string;
    category: MarketplaceCategory;
    tags: string[];
    previewUrl: string;
    thumbnailUrl: string;

    // Monetização
    pricing: TemplatePricing;
    license: LicenseType;

    // Criador
    creatorId: string;
    creatorName: string;
    creatorAvatar?: string;
    organizationId: string;

    // Conteúdo
    template: HybridFunnelData;
    components: Component[];
    screenshots: string[];
    demoUrl?: string;

    // Estatísticas
    downloads: number;
    purchases: number;
    rating: number;
    reviewCount: number;
    conversionRate?: number;

    // Metadados
    version: string;
    compatibility: string[];
    requirements: string[];
    language: string;

    // Status
    status: 'draft' | 'under_review' | 'approved' | 'rejected' | 'archived';
    visibility: 'private' | 'public' | 'premium';
    featured: boolean;

    // Datas
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    lastAnalyzedAt?: Date;
}

export interface TemplatePricing {
    type: 'free' | 'one_time' | 'subscription' | 'usage_based';
    amount: number;
    currency: string;
    interval?: 'monthly' | 'yearly';
    usageLimit?: number;
    freeTrialDays?: number;
}

export interface TemplateReview {
    id: string;
    templateId: string;
    userId: string;
    userName: string;
    userAvatar?: string;

    rating: number; // 1-5
    title: string;
    comment: string;

    // Aspectos específicos
    aspects: {
        design: number;
        functionality: number;
        easeOfUse: number;
        documentation: number;
        support: number;
    };

    // Verificação
    verified: boolean;
    helpfulCount: number;

    // Contexto de uso
    usageContext: string;
    industry?: string;
    companySize?: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface MarketplaceCollection {
    id: string;
    name: string;
    description: string;
    curatorId: string;
    curatorName: string;

    templateIds: string[];
    tags: string[];
    category: MarketplaceCategory;

    visibility: 'public' | 'private';
    featured: boolean;

    stats: {
        views: number;
        saves: number;
        totalDownloads: number;
    };

    createdAt: Date;
    updatedAt: Date;
}

export interface SocialLinks {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    website?: string;
    discord?: string;
}

export interface CreatorProfile {
    id: string;
    userId: string;
    displayName: string;
    bio: string;
    avatar?: string;
    website?: string;
    socialLinks: SocialLinks;

    // Stats
    stats: {
        totalTemplates: number;
        totalDownloads: number;
        totalRevenue: number;
        averageRating: number;
        followers: number;
    };

    // Especialização
    specialties: string[];
    industries: string[];

    // Verificação
    verified: boolean;
    partnerLevel: 'community' | 'certified' | 'enterprise';

    createdAt: Date;
    updatedAt: Date;
}

export interface SalesAnalytics {
    templateId: string;
    period: {
        start: Date;
        end: Date;
    };

    revenue: {
        total: number;
        byCountry: Record<string, number>;
        byPlan: Record<string, number>;
        trend: TrendData[];
    };

    usage: {
        downloads: number;
        activeUsers: number;
        conversionRate: number;
        churnRate: number;
    };

    performance: {
        pageViews: number;
        conversionFunnel: ConversionStep[];
        topReferrers: ReferrerData[];
    };
}

export type MarketplaceCategory =
    | 'lead_generation'
    | 'ecommerce'
    | 'education'
    | 'healthcare'
    | 'finance'
    | 'real_estate'
    | 'technology'
    | 'consulting'
    | 'events'
    | 'nonprofit'
    | 'other';

export type LicenseType =
    | 'standard'
    | 'extended'
    | 'enterprise'
    | 'custom';

// ============================================================================
// MARKETPLACE ENGINE
// ============================================================================

export class MarketplaceEngine {
    private templates: Map<string, MarketplaceTemplate> = new Map();
    private reviews: Map<string, TemplateReview[]> = new Map();
    private collections: Map<string, MarketplaceCollection> = new Map(); // TODO: Implementar funcionalidades de coleções
    private creators: Map<string, CreatorProfile> = new Map(); // TODO: Implementar funcionalidades de criadores
    private analytics: Map<string, SalesAnalytics> = new Map(); // TODO: Implementar analytics avançados
    private logger = getLogger();

    // ============================================================================
    // TEMPLATE MANAGEMENT
    // ============================================================================

    async submitTemplate(
        template: Omit<MarketplaceTemplate, 'id' | 'downloads' | 'purchases' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt' | 'status'>
    ): Promise<string> {
        const templateId = this.generateTemplateId();

        const fullTemplate: MarketplaceTemplate = {
            ...template,
            id: templateId,
            downloads: 0,
            purchases: 0,
            rating: 0,
            reviewCount: 0,
            status: 'under_review',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.templates.set(templateId, fullTemplate);

        // Track submission analytics
        unifiedEventTracker.track({
            type: 'editor_action', // usando tipo existente até introduzir 'template_submitted'
            funnelId: template.template.id,
            userId: template.creatorId,
            sessionId: this.generateSessionId(),
            payload: {
                event: 'template_submitted',
                templateId,
                category: template.category,
                pricing: template.pricing,
                organizationId: template.organizationId
            },
            context: { source: 'marketplace-engine' }
        });

        logger.info('marketplace', 'Template submitted for review', {
            templateId,
            creatorId: template.creatorId,
            category: template.category,
            pricing: template.pricing.type
        });

        return templateId;
    }

    async approveTemplate(templateId: string, reviewerId: string): Promise<boolean> {
        const template = this.templates.get(templateId);
        if (!template || template.status !== 'under_review') {
            return false;
        }

        template.status = 'approved';
        template.publishedAt = new Date();
        template.updatedAt = new Date();

        logger.info('marketplace', 'Template approved', {
            templateId,
            reviewerId,
            publishedAt: template.publishedAt
        });

        return true;
    }

    async searchTemplates(query: SearchQuery): Promise<SearchResult> {
        const allTemplates = Array.from(this.templates.values());
        let filtered = allTemplates.filter(t => t.status === 'approved' && t.visibility === 'public');

        // Apply filters
        if (query.category) {
            filtered = filtered.filter(t => t.category === query.category);
        }

        if (query.tags && query.tags.length > 0) {
            filtered = filtered.filter(t =>
                query.tags!.some(tag => t.tags.includes(tag))
            );
        }

        if (query.priceRange) {
            filtered = filtered.filter(t =>
                t.pricing.amount >= query.priceRange!.min &&
                t.pricing.amount <= query.priceRange!.max
            );
        }

        if (query.rating) {
            filtered = filtered.filter(t => t.rating >= query.rating!);
        }

        if (query.searchTerm) {
            const term = query.searchTerm.toLowerCase();
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(term) ||
                t.description.toLowerCase().includes(term) ||
                t.tags.some(tag => tag.toLowerCase().includes(term))
            );
        }

        // Sort
        switch (query.sortBy) {
            case 'popular':
                filtered.sort((a, b) => b.downloads - a.downloads);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                break;
            case 'price_low':
                filtered.sort((a, b) => a.pricing.amount - b.pricing.amount);
                break;
            case 'price_high':
                filtered.sort((a, b) => b.pricing.amount - a.pricing.amount);
                break;
        }

        // Pagination
        const start = (query.page - 1) * query.limit;
        const paginatedResults = filtered.slice(start, start + query.limit);

        return {
            templates: paginatedResults,
            totalCount: filtered.length,
            page: query.page,
            limit: query.limit,
            hasMore: start + query.limit < filtered.length
        };
    }

    // ============================================================================
    // REVIEW SYSTEM
    // ============================================================================

    async submitReview(review: Omit<TemplateReview, 'id' | 'helpfulCount' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const reviewId = this.generateReviewId();

        const fullReview: TemplateReview = {
            ...review,
            id: reviewId,
            helpfulCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        if (!this.reviews.has(review.templateId)) {
            this.reviews.set(review.templateId, []);
        }
        this.reviews.get(review.templateId)!.push(fullReview);

        // Update template rating
        await this.updateTemplateRating(review.templateId);

        logger.info('marketplace', 'Review submitted', {
            reviewId,
            templateId: review.templateId,
            userId: review.userId,
            rating: review.rating
        });

        return reviewId;
    }

    private async updateTemplateRating(templateId: string): Promise<void> {
        const template = this.templates.get(templateId);
        const reviews = this.reviews.get(templateId);

        if (!template || !reviews || reviews.length === 0) {
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        template.rating = totalRating / reviews.length;
        template.reviewCount = reviews.length;
        template.updatedAt = new Date();
    }

    // ============================================================================
    // MONETIZATION
    // ============================================================================

    async purchaseTemplate(
        templateId: string,
        userId: string,
        paymentDetails: PaymentDetails
    ): Promise<PurchaseResult> {
        const template = this.templates.get(templateId);
        if (!template) {
            throw new Error('Template not found');
        }

        if (template.pricing.type === 'free') {
            return this.processFreeDownload(templateId, userId);
        }

        // Process payment (simplified)
        const paymentResult = await this.processPayment(paymentDetails, template.pricing.amount);
        if (!paymentResult.success) {
            return {
                success: false,
                error: 'Payment failed',
                transactionId: paymentResult.transactionId
            };
        }

        // Record purchase
        template.purchases++;
        template.updatedAt = new Date();

        // Update creator revenue
        await this.recordRevenue(template.creatorId, template.pricing.amount, templateId);

        // Track purchase analytics
        unifiedEventTracker.track({
            type: 'conversion',
            funnelId: template.template.id,
            userId,
            sessionId: this.generateSessionId(),
            payload: {
                event: 'template_purchased',
                templateId,
                amount: template.pricing.amount,
                currency: template.pricing.currency,
                creatorId: template.creatorId
            },
            context: { source: 'marketplace-engine' }
        });

        logger.info('marketplace', 'Template purchased', {
            templateId,
            userId,
            amount: template.pricing.amount,
            transactionId: paymentResult.transactionId
        });

        return {
            success: true,
            templateData: template.template,
            transactionId: paymentResult.transactionId
        };
    }

    private async processFreeDownload(templateId: string, userId: string): Promise<PurchaseResult> {
        const template = this.templates.get(templateId);
        if (!template) {
            throw new Error('Template not found');
        }

        template.downloads++;
        template.updatedAt = new Date();

        // Track download analytics
        unifiedEventTracker.track({
            type: 'editor_action', // semantica temporária
            funnelId: template.template.id,
            userId,
            sessionId: this.generateSessionId(),
            payload: {
                event: 'template_downloaded',
                templateId,
                free: true,
                creatorId: template.creatorId
            },
            context: { source: 'marketplace-engine' }
        });

        return {
            success: true,
            templateData: template.template,
            transactionId: `free_${Date.now()}`
        };
    }

    // ============================================================================
    // ANALYTICS E INSIGHTS
    // ============================================================================

    async getCreatorAnalytics(creatorId: string, timeRange: string = '30d'): Promise<CreatorAnalytics> {
        const creatorTemplates = Array.from(this.templates.values())
            .filter(t => t.creatorId === creatorId);

        const totalRevenue = creatorTemplates.reduce((sum, t) => {
            return sum + (t.purchases * t.pricing.amount);
        }, 0);

        const totalDownloads = creatorTemplates.reduce((sum, t) => sum + t.downloads, 0);
        const averageRating = creatorTemplates.length > 0
            ? creatorTemplates.reduce((sum, t) => sum + t.rating, 0) / creatorTemplates.length
            : 0;

        return {
            creatorId,
            timeRange,
            revenue: {
                total: totalRevenue,
                trend: [], // Simplified
                topTemplates: creatorTemplates
                    .sort((a, b) => (b.purchases * b.pricing.amount) - (a.purchases * a.pricing.amount))
                    .slice(0, 5)
                    .map(t => ({
                        templateId: t.id,
                        name: t.name,
                        revenue: t.purchases * t.pricing.amount,
                        downloads: t.downloads
                    }))
            },
            performance: {
                totalTemplates: creatorTemplates.length,
                totalDownloads,
                averageRating,
                conversionRate: totalDownloads > 0 ? (creatorTemplates.reduce((sum, t) => sum + t.purchases, 0) / totalDownloads) * 100 : 0
            },
            insights: this.generateCreatorInsights(creatorTemplates)
        };
    }

    private generateCreatorInsights(templates: MarketplaceTemplate[]): string[] {
        const insights: string[] = [];

        // Best performing category
        const categoryPerformance = new Map<string, number>();
        templates.forEach(t => {
            const revenue = t.purchases * t.pricing.amount;
            categoryPerformance.set(t.category, (categoryPerformance.get(t.category) || 0) + revenue);
        });

        if (categoryPerformance.size > 0) {
            const bestCategory = Array.from(categoryPerformance.entries())
                .sort(([, a], [, b]) => b - a)[0][0];
            insights.push(`Sua categoria mais lucrativa é ${bestCategory}`);
        }

        // Rating insights
        const avgRating = templates.reduce((sum, t) => sum + t.rating, 0) / templates.length;
        if (avgRating > 4.5) {
            insights.push(`Excelente qualidade! Rating médio de ${avgRating.toFixed(1)}`);
        } else if (avgRating < 3.5) {
            insights.push(`Considere melhorar a qualidade dos templates (rating ${avgRating.toFixed(1)})`);
        }

        return insights;
    }

    // ============================================================================
    // MÉTODOS AUXILIARES
    // ============================================================================

    private generateTemplateId(): string {
        return `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateReviewId(): string {
        return `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private getCurrentEventMetadata(): any {
        return {
            userAgent: 'marketplace-engine',
            device: { type: 'server' },
            location: { country: 'BR' },
            referrer: 'marketplace',
            utm: {}
        };
    }

    private async processPayment(_details: PaymentDetails, _amount: number): Promise<PaymentResult> {
        // Simplified payment processing
        return {
            success: Math.random() > 0.1, // 90% success rate
            transactionId: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
    }

    private async recordRevenue(creatorId: string, amount: number, templateId: string): Promise<void> {
        // Record revenue for creator analytics
        this.logger.info('marketplace', 'Revenue recorded', { creatorId, amount, templateId });
    }

    // ============================================================================
    // MÉTODOS DE PLACEHOLDER (Para funcionalidades futuras)
    // ============================================================================

    getCollections(): Map<string, MarketplaceCollection> {
        return this.collections;
    }

    getCreators(): Map<string, CreatorProfile> {
        return this.creators;
    }

    getAnalytics(): Map<string, SalesAnalytics> {
        return this.analytics;
    }
}

// ============================================================================
// INTERFACES ADICIONAIS
// ============================================================================

export interface SearchQuery {
    searchTerm?: string;
    category?: MarketplaceCategory;
    tags?: string[];
    priceRange?: { min: number; max: number };
    rating?: number;
    sortBy: 'popular' | 'newest' | 'rating' | 'price_low' | 'price_high';
    page: number;
    limit: number;
}

export interface SearchResult {
    templates: MarketplaceTemplate[];
    totalCount: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

export interface PaymentDetails {
    method: 'card' | 'paypal' | 'pix';
    token: string;
    currency: string;
}

export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
}

export interface PurchaseResult {
    success: boolean;
    templateData?: HybridFunnelData;
    transactionId?: string;
    error?: string;
}

export interface CreatorAnalytics {
    creatorId: string;
    timeRange: string;
    revenue: {
        total: number;
        trend: TrendData[];
        topTemplates: {
            templateId: string;
            name: string;
            revenue: number;
            downloads: number;
        }[];
    };
    performance: {
        totalTemplates: number;
        totalDownloads: number;
        averageRating: number;
        conversionRate: number;
    };
    insights: string[];
}

export interface TrendData {
    date: string;
    value: number;
}

export interface ConversionStep {
    step: string;
    count: number;
    rate: number;
}

export interface ReferrerData {
    source: string;
    visits: number;
    conversions: number;
}

// ============================================================================
// EXPORTAR INSTÂNCIA SINGLETON
// ============================================================================

export const marketplaceEngine = new MarketplaceEngine();

export default marketplaceEngine;