/**
 * 🌐 FUNNEL CONTEXT - Nível 1: Configurações Globais
 * 
 * Renderiza configurações do funil quando nenhum step/block está selecionado:
 * - 📊 Informações básicas (nome, descrição)
 * - 🌐 Domínio e URL pública
 * - 🎯 Resultados e pontuação
 * - 📈 SEO e meta tags
 * - 🔍 Tracking (Analytics, Pixels)
 * - 🔒 Segurança (APIs, webhooks)
 */

import React, { useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Info,
    Globe,
    Target,
    TrendingUp,
    Search,
    Lock,
    AlertCircle,
} from 'lucide-react';

import { CollapsibleSection } from '../components/CollapsibleSection';
import { useFunnelPublication } from '@/hooks/useFunnelPublication';
import { useDebouncedCallback } from '@/hooks/useDebounce';

// ============================================================================
// TYPES
// ============================================================================

interface FunnelContextProps {
    data: any;
    editor: any;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function FunnelContext({ data, editor }: FunnelContextProps) {
    const funnelId = data?.templateId || 'default';

    // Hook de publicação (gerencia settings)
    const {
        settings,
        updateSettings,
        saveSettings,
        isSaving,
        error,
    } = useFunnelPublication(funnelId, {
        autoSave: true,
    });

    // Auto-save com debounce
    const debouncedSave = useDebouncedCallback(() => {
        saveSettings();
    }, 1000);

    // Handlers
    const handleUpdateInfo = (updates: any) => {
        // Atualizar metadata do template
        if (editor?.actions?.updateTemplateMetadata) {
            editor.actions.updateTemplateMetadata(updates);
        }
        debouncedSave();
    };

    const handleUpdateSettings = (updates: any) => {
        updateSettings(updates);
        debouncedSave();
    };

    const totalSteps = Object.keys(data?.steps || {}).length;

    return (
        <div className="space-y-4">

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error.message || 'Erro ao salvar configurações'}
                    </AlertDescription>
                </Alert>
            )}

            {/* Saving Indicator */}
            {isSaving && (
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        Salvando configurações...
                    </AlertDescription>
                </Alert>
            )}

            {/* Accordion com seções */}
            <Accordion type="multiple" defaultValue={['info', 'domain']} className="space-y-3">

                {/* ===== INFORMAÇÕES BÁSICAS ===== */}
                <CollapsibleSection
                    id="info"
                    title="Informações Básicas"
                    icon={<Info className="w-4 h-4" />}
                    count={totalSteps}
                >
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="funnel-name">Nome do Funil</Label>
                            <Input
                                id="funnel-name"
                                value={data?.name || ''}
                                onChange={(e) => handleUpdateInfo({ name: e.target.value })}
                                placeholder="Ex: Quiz de Estilo Pessoal"
                            />
                        </div>

                        <div>
                            <Label htmlFor="funnel-description">Descrição</Label>
                            <Textarea
                                id="funnel-description"
                                value={data?.description || ''}
                                onChange={(e) => handleUpdateInfo({ description: e.target.value })}
                                placeholder="Descreva o propósito deste quiz..."
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Total de Etapas:</span>
                                <Badge variant="secondary">{totalSteps}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Versão:</span>
                                <Badge variant="outline">{data?.metadata?.version || '1.0.0'}</Badge>
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* ===== DOMÍNIO E URL ===== */}
                <CollapsibleSection
                    id="domain"
                    title="Domínio e URL Pública"
                    icon={<Globe className="w-4 h-4" />}
                    badge={settings.domain?.slug ? '✓' : '!'}
                    badgeVariant={settings.domain?.slug ? 'default' : 'destructive'}
                >
                    <DomainSection
                        settings={settings.domain || {}}
                        onChange={(domain) => handleUpdateSettings({ domain })}
                    />
                </CollapsibleSection>

                {/* ===== RESULTADOS ===== */}
                <CollapsibleSection
                    id="results"
                    title="Resultados e Pontuação"
                    icon={<Target className="w-4 h-4" />}
                    count={settings.results?.secondary?.length || 0}
                >
                    <ResultsPlaceholder />
                </CollapsibleSection>

                {/* ===== SEO ===== */}
                <CollapsibleSection
                    id="seo"
                    title="SEO e Meta Tags"
                    icon={<TrendingUp className="w-4 h-4" />}
                    badge={settings.seo?.title ? '✓' : '!'}
                    badgeVariant={settings.seo?.title ? 'default' : 'secondary'}
                >
                    <SEOPlaceholder />
                </CollapsibleSection>

                {/* ===== TRACKING ===== */}
                <CollapsibleSection
                    id="tracking"
                    title="Tracking e Analytics"
                    icon={<Search className="w-4 h-4" />}
                >
                    <TrackingPlaceholder />
                </CollapsibleSection>

                {/* ===== SEGURANÇA ===== */}
                <CollapsibleSection
                    id="security"
                    title="APIs e Webhooks"
                    icon={<Lock className="w-4 h-4" />}
                >
                    <SecurityPlaceholder />
                </CollapsibleSection>

            </Accordion>
        </div>
    );
}

// ============================================================================
// DOMAIN SECTION (Functional)
// ============================================================================

interface DomainSectionProps {
    settings: any;
    onChange: (settings: any) => void;
}

function DomainSection({ settings, onChange }: DomainSectionProps) {
    const generatePreviewUrl = () => {
        const subdomain = settings.subdomain || 'app';
        const slug = settings.slug || 'quiz';

        if (settings.customDomain) {
            return `https://${settings.customDomain}/${slug}`;
        }

        return `https://${subdomain}.quizflowpro.com/${slug}`;
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="subdomain">Subdomínio</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="subdomain"
                            value={settings.subdomain || ''}
                            onChange={(e) => onChange({ ...settings, subdomain: e.target.value })}
                            placeholder="meu-quiz"
                        />
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                            .quizflow.com
                        </span>
                    </div>
                </div>

                <div>
                    <Label htmlFor="slug">Slug do Funil</Label>
                    <Input
                        id="slug"
                        value={settings.slug || ''}
                        onChange={(e) => onChange({ ...settings, slug: e.target.value })}
                        placeholder="estilo-pessoal"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="custom-domain">Domínio Personalizado (Opcional)</Label>
                <Input
                    id="custom-domain"
                    value={settings.customDomain || ''}
                    onChange={(e) => onChange({ ...settings, customDomain: e.target.value })}
                    placeholder="quiz.meusite.com"
                    type="url"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                    💡 Configure DNS CNAME apontando para nossos servidores
                </p>
            </div>

            {/* Preview da URL */}
            <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">🔗 URL Final:</span>
                    <Button size="sm" variant="outline" onClick={() => {
                        navigator.clipboard.writeText(generatePreviewUrl());
                    }}>
                        📋 Copiar
                    </Button>
                </div>
                <code className="text-sm bg-background px-3 py-2 rounded border block break-all">
                    {generatePreviewUrl()}
                </code>
            </div>
        </div>
    );
}

// ============================================================================
// PLACEHOLDERS (Serão implementados nos próximos sprints)
// ============================================================================

function ResultsPlaceholder() {
    return (
        <div className="p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Configuração de Resultados</p>
            <p className="text-xs mt-1">Será implementado no Sprint 2</p>
        </div>
    );
}

function SEOPlaceholder() {
    return (
        <div className="p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Configuração de SEO</p>
            <p className="text-xs mt-1">Será implementado no Sprint 2</p>
        </div>
    );
}

function TrackingPlaceholder() {
    return (
        <div className="p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Configuração de Tracking</p>
            <p className="text-xs mt-1">Será implementado no Sprint 2</p>
        </div>
    );
}

function SecurityPlaceholder() {
    return (
        <div className="p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground">
            <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Configuração de Segurança</p>
            <p className="text-xs mt-1">Será implementado no Sprint 2</p>
        </div>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default FunnelContext;
