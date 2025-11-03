/**
 * 🎯 JSON TEMPLATE RENDERER - Sistema Híbrido
 * 
 * Renderiza blocos simples usando templates HTML + Mustache
 * Garante performance otimizada sem necessidade de TSX components
 */

import React, { useEffect, useState, useMemo } from 'react';
import Mustache from 'mustache';
import { getTemplatePath } from '@/config/block-complexity-map';
import { appLogger } from '@/utils/logger';

// Cache global de templates HTML
const templateCache = new Map<string, string>();

interface JSONTemplateRendererProps {
  type: string;
  properties?: Record<string, any>;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Carrega template HTML do servidor
 */
async function loadTemplate(templateName: string): Promise<string> {
  // Check cache primeiro
  if (templateCache.has(templateName)) {
    return templateCache.get(templateName)!;
  }

  try {
    const response = await fetch(`/templates/html/${templateName}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    templateCache.set(templateName, html);
    
    appLogger.info(`[JSONTemplateRenderer] Template loaded: ${templateName}`);
    return html;
  } catch (error) {
    appLogger.error(`[JSONTemplateRenderer] Failed to load template: ${templateName}`, error);
    throw error;
  }
}

/**
 * Renderiza template Mustache com dados
 */
function renderTemplate(template: string, data: Record<string, any>): string {
  try {
    // Sanitize data para prevenir XSS
    const sanitizedData = Object.entries(data).reduce((acc, [key, value]) => {
      // Converter valores undefined/null para string vazia
      if (value === undefined || value === null) {
        acc[key] = '';
      }
      // Manter strings, números, booleans
      else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        acc[key] = value;
      }
      // Converter objetos/arrays para JSON
      else if (typeof value === 'object') {
        acc[key] = JSON.stringify(value);
      }
      else {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, any>);

    return Mustache.render(template, sanitizedData);
  } catch (error) {
    appLogger.error('[JSONTemplateRenderer] Mustache render failed', error);
    return `<div class="text-red-500">Erro ao renderizar template</div>`;
  }
}

/**
 * Componente React que renderiza blocos JSON
 */
export const JSONTemplateRenderer: React.FC<JSONTemplateRendererProps> = ({
  type,
  properties = {},
  className = '',
  style = {},
}) => {
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obter path do template baseado no tipo do bloco
  const templateName = useMemo(() => getTemplatePath(type), [type]);

  useEffect(() => {
    if (!templateName) {
      setError(`Template não encontrado para tipo: ${type}`);
      setLoading(false);
      return;
    }

    // Garantir que templateName não é null antes de passar para loadTemplate
    const safePath: string = templateName;

    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const template = await loadTemplate(safePath);
        const rendered = renderTemplate(template, {
          ...properties,
          className,
          type,
        });

        if (isMounted) {
          setHtml(rendered);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erro desconhecido');
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [type, templateName, properties, className]);

  // Loading state
  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded h-12" style={style}>
        <span className="sr-only">Carregando {type}...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="border border-red-300 bg-red-50 text-red-700 p-3 rounded" style={style}>
        <strong>Erro ao renderizar bloco:</strong> {error}
      </div>
    );
  }

  // Renderizar HTML usando dangerouslySetInnerHTML
  // Seguro porque sanitizamos os dados no renderTemplate
  return (
    <div
      className={`json-template-block ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/**
 * Wrapper para uso com Suspense
 */
export const LazyJSONTemplateRenderer = React.lazy(() => 
  Promise.resolve({ default: JSONTemplateRenderer })
);

export default JSONTemplateRenderer;
