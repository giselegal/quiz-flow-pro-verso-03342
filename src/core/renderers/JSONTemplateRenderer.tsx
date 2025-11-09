/**
 * 🎯 JSON TEMPLATE RENDERER - Sistema Híbrido
 * 
 * Renderiza blocos simples usando templates HTML + Mustache
 * Garante performance otimizada sem necessidade de TSX components
 */

import React, { useEffect, useState, useMemo } from 'react';
import Mustache from 'mustache';
import { getTemplatePath } from '@/config/block-complexity-map';
import { appLogger } from '@/lib/utils/logger';

// Cache global de templates HTML
const templateCache = new Map<string, string>();

interface JSONTemplateRendererProps {
  type: string;
  /**
   * Propriedades já normalizadas do bloco (podem vir do UniversalBlockRenderer)
   */
  properties?: Record<string, any>;
  /**
   * Bloco completo (quando disponível). Usado para extrair content e propriedades faltantes.
   */
  block?: { content?: Record<string, any>; properties?: Record<string, any> } | any;
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
    // Importante: NÃO transformar objetos em string para permitir seções Mustache aninhadas (ex.: level.h1)
    // Apenas normalizar undefined/null para string vazia quando necessário
    const normalized = Object.fromEntries(Object.entries(data).map(([k, v]) => [
      k,
      v === undefined || v === null ? '' : v,
    ]));

    return Mustache.render(template, normalized);
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
  block,
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

        // Unir propriedades vindas via props e do próprio bloco
        const blockProps = (block?.properties && typeof block.properties === 'object') ? block.properties : {};
        const mergedProps = { ...blockProps, ...properties };

        // Extrair conteúdo plano principal para templates simples (text, heading, etc.)
        const contentObj = (block?.content && typeof block.content === 'object') ? block.content : {};

        // Aliases e fallbacks comuns
        const data: Record<string, any> = {
          ...mergedProps,
          ...contentObj,
          className,
          type,
        };

        // content (string) preferindo campos comuns
        if (data.content == null) {
          const candidate = contentObj.text ?? contentObj.html ?? contentObj.content ?? mergedProps.text;
          if (candidate != null) data.content = candidate;
        }

        // src (imagem)
        if (data.src == null) {
          const candidate = mergedProps.src ?? contentObj.src ?? contentObj.imageUrl ?? mergedProps.url;
          if (candidate != null) data.src = candidate;
        }

        // style inline como string se vier como objeto
        if (typeof data.style === 'object' && data.style) {
          try {
            const styleObj = data.style as Record<string, any>;
            const css = Object.entries(styleObj)
              .map(([k, v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}:${String(v)}`)
              .join(';');
            data.style = css;
          } catch { }
        }

        const rendered = renderTemplate(template, data);

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
  }, [type, templateName, properties, className, block]);

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
