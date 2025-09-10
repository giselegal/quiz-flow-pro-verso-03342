/**
 * 🚀 RESOURCE HINTS & CRITICAL CSS MANAGER
 * 
 * Sistema inteligente para:
 * - Preload de recursos críticos
 * - Prefetch de recursos futuros  
 * - Critical CSS extraction
 * - Web Vitals monitoring
 * - Performance budgets
 */

interface ResourceHint {
    href: string;
    as: 'script' | 'style' | 'image' | 'font' | 'document';
    type?: string;
    crossorigin?: 'anonymous' | 'use-credentials';
    media?: string;
    priority?: 'high' | 'low';
}

interface CriticalCSSOptions {
    width: number;
    height: number;
    inlineThreshold: number; // KB
    extractKeyframes: boolean;
    fontDisplay: 'swap' | 'optional' | 'fallback';
}

interface WebVitalsMetrics {
    LCP?: number; // Largest Contentful Paint
    FID?: number; // First Input Delay  
    CLS?: number; // Cumulative Layout Shift
    TTFB?: number; // Time to First Byte
    INP?: number; // Interaction to Next Paint
}

/**
 * 🎯 RESOURCE HINTS MANAGER
 * Gerencia preload, prefetch e dns-prefetch automaticamente
 */
class ResourceHintsManager {
    private static instance: ResourceHintsManager;
    private preloadedResources = new Set<string>();
    private prefetchedResources = new Set<string>();
    private criticalFonts = new Set<string>();
    // Resource hints observer available if needed

    static getInstance(): ResourceHintsManager {
        if (!ResourceHintsManager.instance) {
            ResourceHintsManager.instance = new ResourceHintsManager();
        }
        return ResourceHintsManager.instance;
    }

    /**
     * 🔗 DNS PREFETCH
     * Resolução antecipada de DNS para domínios externos
     */
    addDnsPrefetch(domains: string[]) {
        domains.forEach(domain => {
            if (!document.querySelector(`link[rel="dns-prefetch"][href="${domain}"]`)) {
                const link = document.createElement('link');
                link.rel = 'dns-prefetch';
                link.href = domain;
                document.head.appendChild(link);
                console.log(`🔗 DNS prefetch added for: ${domain}`);
            }
        });
    }

    /**
     * ⚡ PRELOAD CRÍTICO
     * Carrega recursos que serão necessários imediatamente
     */
    preload(resource: ResourceHint) {
        const key = `${resource.href}-${resource.as}`;

        if (this.preloadedResources.has(key)) {
            return; // Já foi carregado
        }

        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;

        if (resource.type) link.type = resource.type;
        if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
        if (resource.media) link.media = resource.media;

        // Priority hints para navegadores compatíveis
        if (resource.priority) {
            (link as any).fetchPriority = resource.priority;
        }

        document.head.appendChild(link);
        this.preloadedResources.add(key);

        console.log(`⚡ Preloaded ${resource.as}: ${resource.href}`);
    }

    /**
     * 🔮 PREFETCH ESTRATÉGICO
     * Carrega recursos que podem ser necessários em breve
     */
    prefetch(urls: string[], condition?: () => boolean) {
        // Verifica condição se fornecida
        if (condition && !condition()) {
            return;
        }

        // Só prefetch em conexões rápidas
        const connection = (navigator as any).connection;
        if (connection?.saveData || connection?.effectiveType === 'slow-2g') {
            console.log('🐌 Skipping prefetch on slow connection');
            return;
        }

        urls.forEach(url => {
            if (this.prefetchedResources.has(url)) {
                return;
            }

            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
            this.prefetchedResources.add(url);

            console.log(`🔮 Prefetched: ${url}`);
        });
    }

    /**
     * 🔤 PRELOAD DE FONTES CRÍTICAS
     * Carrega fontes com font-display: swap
     */
    preloadCriticalFonts(fonts: Array<{ url: string; format: string }>) {
        fonts.forEach(font => {
            if (this.criticalFonts.has(font.url)) {
                return;
            }

            this.preload({
                href: font.url,
                as: 'font',
                type: `font/${font.format}`,
                crossorigin: 'anonymous'
            });

            this.criticalFonts.add(font.url);
        });
    }

    /**
     * 🎨 PRELOAD DE IMAGENS CRÍTICAS
     * Carrega imagens above-the-fold
     */
    preloadCriticalImages(images: Array<{ url: string; media?: string }>) {
        images.forEach(image => {
            this.preload({
                href: image.url,
                as: 'image',
                media: image.media
            });
        });
    }

    /**
     * 📄 PREFETCH DE PÁGINAS
     * Carrega páginas que o usuário provavelmente visitará
     */
    prefetchRoutes(routes: string[], trigger: 'hover' | 'viewport' | 'immediate' = 'hover') {
        switch (trigger) {
            case 'immediate':
                this.prefetch(routes);
                break;

            case 'viewport':
                // Prefetch quando links entram na viewport
                const linkObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const link = entry.target as HTMLAnchorElement;
                            if (link.href && routes.includes(link.pathname)) {
                                this.prefetch([link.href]);
                                linkObserver.unobserve(link);
                            }
                        }
                    });
                }, { rootMargin: '100px' });

                // Observa links na página
                setTimeout(() => {
                    document.querySelectorAll('a[href]').forEach(link => {
                        linkObserver.observe(link);
                    });
                }, 1000);
                break;

            case 'hover':
                // Prefetch no hover com debounce
                let hoverTimeout: NodeJS.Timeout;
                document.addEventListener('mouseover', (e) => {
                    const link = (e.target as Element).closest('a[href]') as HTMLAnchorElement;
                    if (link && routes.includes(link.pathname)) {
                        clearTimeout(hoverTimeout);
                        hoverTimeout = setTimeout(() => {
                        this.prefetch([link.href || '']);
                        }, 200); // Debounce de 200ms
                    }
                });
                break;
        }
    }

    /**
     * 📊 RELATÓRIO DE RESOURCE HINTS
     */
    getReport() {
        return {
            preloadedResources: Array.from(this.preloadedResources),
            prefetchedResources: Array.from(this.prefetchedResources),
            criticalFonts: Array.from(this.criticalFonts),
            totalHints: this.preloadedResources.size + this.prefetchedResources.size
        };
    }
}

/**
 * 🎨 CRITICAL CSS MANAGER  
 * Extrai e inline CSS crítico automaticamente
 */
class CriticalCSSManager {
    private static instance: CriticalCSSManager;
    private criticalCSS = '';
    private extractedRules = new Set<string>();

    static getInstance(): CriticalCSSManager {
        if (!CriticalCSSManager.instance) {
            CriticalCSSManager.instance = new CriticalCSSManager();
        }
        return CriticalCSSManager.instance;
    }

    /**
     * ✂️ EXTRAÇÃO AUTOMÁTICA DE CSS CRÍTICO
     * Identifica CSS necessário above-the-fold
     */
    extractCriticalCSS(options: CriticalCSSOptions = {
        width: 1200,
        height: 800,
        inlineThreshold: 15,
        extractKeyframes: true,
        fontDisplay: 'swap'
    }) {
        const criticalSelectors = this.identifyCriticalElements(options);
        const criticalRules = this.extractRulesForSelectors(criticalSelectors);

        this.criticalCSS = this.optimizeCriticalCSS(criticalRules, options);

        if (this.criticalCSS.length > 0) {
            this.inlineCriticalCSS();
            this.deferNonCriticalCSS();
        }

        console.log(`🎨 Critical CSS extracted: ${this.criticalCSS.length} characters`);
        return this.criticalCSS;
    }

    /**
     * 🔍 IDENTIFICA ELEMENTOS CRÍTICOS
     * Encontra elementos visíveis above-the-fold
     */
    private identifyCriticalElements(options: CriticalCSSOptions): string[] {
        const criticalSelectors: string[] = [];
        const viewport = { width: options.width, height: options.height };

        // Elementos sempre críticos
        const alwaysCritical = [
            'html', 'body', 'head',
            '[class*="font-"]', // Fontes
            '.bg-gradient-', '.bg-brand-', // Gradientes e cores da marca
            '.animate-', '.transition-', // Animações críticas
            '.fixed', '.sticky', // Elementos fixos
            'nav', 'header', '.navigation' // Navegação
        ];

        criticalSelectors.push(...alwaysCritical);

        // Simula viewport para encontrar elementos visíveis
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            if (el.getBoundingClientRect().top < viewport.height) {
                const classes = Array.from(el.classList);
                classes.forEach(className => {
                    if (className && !criticalSelectors.includes(`.${className}`)) {
                        criticalSelectors.push(`.${className}`);
                    }
                });

                // Adiciona seletor por tag se elemento estiver above-the-fold
                const tagName = el.tagName.toLowerCase();
                if (!criticalSelectors.includes(tagName)) {
                    criticalSelectors.push(tagName);
                }
            }
        });

        return criticalSelectors;
    }

    /**
     * 📋 EXTRAI REGRAS CSS PARA SELETORES
     */
    private extractRulesForSelectors(selectors: string[]): string[] {
        const rules: string[] = [];
        const styleSheets = Array.from(document.styleSheets);

        styleSheets.forEach(sheet => {
            try {
                const cssRules = Array.from(sheet.cssRules || []);
                cssRules.forEach(rule => {
                    const ruleText = rule.cssText;

                    // Verifica se a regra se aplica a algum seletor crítico
                    if (selectors.some(selector => ruleText.includes(selector))) {
                        if (!this.extractedRules.has(ruleText)) {
                            rules.push(ruleText);
                            this.extractedRules.add(ruleText);
                        }
                    }
                });
            } catch (e) {
                // Ignora erros de CORS em stylesheets externos
                console.warn('Could not access stylesheet:', sheet.href);
            }
        });

        return rules;
    }

    /**
     * ⚡ OTIMIZA CSS CRÍTICO
     */
    private optimizeCriticalCSS(rules: string[], options: CriticalCSSOptions): string {
        let css = rules.join('\n');

        // Remove comentários
        css = css.replace(/\/\*[\s\S]*?\*\//g, '');

        // Remove espaços extras
        css = css.replace(/\s+/g, ' ').trim();

        // Adiciona font-display para fontes
        if (options.fontDisplay) {
            css = css.replace(
                /@font-face\s*{([^}]+)}/g,
                `@font-face { $1 font-display: ${options.fontDisplay}; }`
            );
        }

        // Extrai keyframes se necessário
        if (!options.extractKeyframes) {
            css = css.replace(/@keyframes[^{]+\{(?:[^{}]+\{[^}]*\})*[^}]*\}/g, '');
        }

        return css;
    }

    /**
     * 💉 INLINE CRITICAL CSS
     */
    private inlineCriticalCSS() {
        if (!this.criticalCSS) return;

        // Remove style tag anterior se existir
        const existingCritical = document.querySelector('#critical-css');
        if (existingCritical) {
            existingCritical.remove();
        }

        // Adiciona CSS crítico inline
        const style = document.createElement('style');
        style.id = 'critical-css';
        style.textContent = this.criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    /**
     * ⏰ DEFER CSS NÃO CRÍTICO
     */
    private deferNonCriticalCSS() {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');

        stylesheets.forEach(link => {
            const href = (link as HTMLLinkElement).href;

            // Não defer CSS crítico ou do Tailwind
            if (href.includes('tailwind') || href.includes('critical')) {
                return;
            }

            // Carrega de forma assíncrona
            const newLink = document.createElement('link');
            newLink.rel = 'preload';
            newLink.as = 'style';
            newLink.href = href;
            newLink.onload = () => {
                newLink.rel = 'stylesheet';
            };

            document.head.appendChild(newLink);
            link.remove();
        });
    }
}

/**
 * 📊 WEB VITALS MONITOR
 * Monitora métricas de performance em tempo real
 */
class WebVitalsMonitor {
    private static instance: WebVitalsMonitor;
    private metrics: WebVitalsMetrics = {};
    private observers: PerformanceObserver[] = [];
    private thresholds = {
        LCP: 2500, // ms
        FID: 100,  // ms  
        CLS: 0.1,  // score
        TTFB: 800, // ms
        INP: 200   // ms
    };

    static getInstance(): WebVitalsMonitor {
        if (!WebVitalsMonitor.instance) {
            WebVitalsMonitor.instance = new WebVitalsMonitor();
        }
        return WebVitalsMonitor.instance;
    }

    /**
     * 🚀 INICIALIZAR MONITORAMENTO
     */
    startMonitoring() {
        this.measureLCP();
        this.measureFID();
        this.measureCLS();
        this.measureTTFB();
        this.measureINP();

        console.log('📊 Web Vitals monitoring started');
    }

    /**
     * 🖼️ LARGEST CONTENTFUL PAINT
     */
    private measureLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1] as any;
                this.metrics.LCP = lastEntry.startTime;
                this.checkThreshold('LCP', lastEntry.startTime);
            });

            observer.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.push(observer);
        }
    }

    /**
     * ⚡ FIRST INPUT DELAY
     */
    private measureFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry: any) => {
                    this.metrics.FID = entry.processingStart - entry.startTime;
                    this.checkThreshold('FID', this.metrics.FID);
                });
            });

            observer.observe({ entryTypes: ['first-input'] });
            this.observers.push(observer);
        }
    }

    /**
     * 📏 CUMULATIVE LAYOUT SHIFT
     */
    private measureCLS() {
        let clsValue = 0;

        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry: any) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        this.metrics.CLS = clsValue;
                        this.checkThreshold('CLS', clsValue);
                    }
                });
            });

            observer.observe({ entryTypes: ['layout-shift'] });
            this.observers.push(observer);
        }
    }

    /**
     * 🌐 TIME TO FIRST BYTE
     */
    private measureTTFB() {
        if ('performance' in window && 'timing' in performance) {
            const timing = performance.timing;
            this.metrics.TTFB = timing.responseStart - timing.requestStart;
            this.checkThreshold('TTFB', this.metrics.TTFB);
        }
    }

    /**
     * 🖱️ INTERACTION TO NEXT PAINT
     */
    private measureINP() {
        // INP é uma métrica mais complexa, simplificada aqui
        let maxDelay = 0;

        ['click', 'keydown', 'touchstart'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                const startTime = performance.now();

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        const delay = performance.now() - startTime;
                        maxDelay = Math.max(maxDelay, delay);
                        this.metrics.INP = maxDelay;
                        this.checkThreshold('INP', delay);
                    });
                });
            }, { passive: true });
        });
    }

    /**
     * ⚠️ VERIFICAR THRESHOLDS
     */
    private checkThreshold(metric: keyof WebVitalsMetrics, value: number) {
        const threshold = this.thresholds[metric];
        const status = value <= threshold ? '✅' : '❌';

        console.log(`${status} ${metric}: ${value.toFixed(2)} (threshold: ${threshold})`);

        if (value > threshold) {
            this.reportPoorVital(metric, value, threshold);
        }
    }

    /**
     * 🚨 REPORTAR MÉTRICAS RUINS
     */
    private reportPoorVital(metric: string, value: number, threshold: number) {
        const deviation = ((value - threshold) / threshold * 100).toFixed(1);

        console.warn(`🚨 Poor ${metric}: ${value.toFixed(2)}ms (${deviation}% above threshold)`);

        // Em produção, enviar para analytics
        if (import.meta.env.PROD) {
            // Analytics.track('poor_web_vital', { metric, value, threshold, deviation });
        }
    }

    /**
     * 📈 OBTER RELATÓRIO COMPLETO
     */
    getReport(): WebVitalsMetrics & { summary: string } {
        const scores = Object.entries(this.metrics).map(([metric, value]) => {
            const threshold = this.thresholds[metric as keyof typeof this.thresholds];
            const status = value! <= threshold ? 'Good' : 'Poor';
            return `${metric}: ${value?.toFixed(2)} (${status})`;
        });

        return {
            ...this.metrics,
            summary: scores.join(', ')
        };
    }

    /**
     * 🛑 PARAR MONITORAMENTO
     */
    stopMonitoring() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

/**
 * 🚀 PERFORMANCE MANAGER PRINCIPAL
 * Coordena todos os sistemas de performance
 */
class PerformanceManager {
    private resourceHints: ResourceHintsManager;
    private criticalCSS: CriticalCSSManager;
    private webVitals: WebVitalsMonitor;

    constructor() {
        this.resourceHints = ResourceHintsManager.getInstance();
        this.criticalCSS = CriticalCSSManager.getInstance();
        this.webVitals = WebVitalsMonitor.getInstance();
    }

    /**
     * 🎯 INICIALIZAÇÃO COMPLETA
     */
    initialize() {
        // DNS prefetch para domínios externos
        this.resourceHints.addDnsPrefetch([
            'https://fonts.googleapis.com',
            'https://res.cloudinary.com',
            'https://cakto-quiz-br01.b-cdn.net'
        ]);

        // Preload de fontes críticas - DESABILITADO: fontes carregadas via Google Fonts no index.html
        // this.resourceHints.preloadCriticalFonts([
        //     { url: '/fonts/inter.woff2', format: 'woff2' },
        //     { url: '/fonts/playfair.woff2', format: 'woff2' }
        // ]);

        // Extração de CSS crítico
        this.criticalCSS.extractCriticalCSS();

        // Prefetch de rotas principais
        this.resourceHints.prefetchRoutes([
            '/dashboard',
            '/quiz',
            '/editor',
            '/analytics'
        ], 'hover');

        // Monitoring de Web Vitals
        this.webVitals.startMonitoring();

        console.log('🚀 Performance Manager initialized');
    }

    /**
     * 📊 RELATÓRIO CONSOLIDADO
     */
    getPerformanceReport() {
        return {
            resourceHints: this.resourceHints.getReport(),
            webVitals: this.webVitals.getReport(),
            timestamp: new Date().toISOString()
        };
    }
}

// 🌟 EXPORTS
export const resourceHints = ResourceHintsManager.getInstance();
export const criticalCSS = CriticalCSSManager.getInstance();
export const webVitals = WebVitalsMonitor.getInstance();
export const performanceManager = new PerformanceManager();

// 🚀 AUTO-INITIALIZATION
if (typeof window !== 'undefined') {
    // Inicialização após load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            performanceManager.initialize();
        });
    } else {
        performanceManager.initialize();
    }

    // Report no unload (dev mode)
    if (import.meta.env.DEV) {
        window.addEventListener('beforeunload', () => {
            const report = performanceManager.getPerformanceReport();
            console.log('📊 Performance Report:', report);
        });
    }
}

export default PerformanceManager;
