// Sanitizador mínimo para HTML inline controlado (headings/text curtos)
// Estratégia: whitelist de tags e remoção de atributos perigosos.

const ALLOWED_TAGS = new Set(['span', 'strong', 'b', 'em', 'i', 'u', 'br']);
const ALLOWED_ATTRS = new Set(['class', 'style']);
// Whitelist parcial de estilos permitidos (evita injeção de JS via url())
const ALLOWED_STYLE_PROPS = ['color', 'font-weight', 'font-style', 'text-decoration', 'font-family'];

export function sanitizeInlineHtml(input: string): string {
    if (!input || typeof input !== 'string') return '';
    // Remover scripts/styles diretos
    let html = input.replace(/<\/(script|style)>/gi, '')
        .replace(/<(script|style)(.|\n|\r)*?>/gi, '');

    // Criar DOM virtual (assume ambiente browser ou usar JSDOM em testes; fallback regex degradado)
    if (typeof window === 'undefined' || !('DOMParser' in window)) {
        // Fallback simples: remover qualquer tag que não seja span/strong/em/i/u/br
        html = html.replace(/<([^>]+)>/g, (m, tagContent) => {
            const tagName = tagContent.split(/\s+/)[0].toLowerCase();
            if (!ALLOWED_TAGS.has(tagName.replace(/\//g, ''))) return '';
            return `<${tagContent}>`;
        });
        return html;
    }
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
        const root = doc.body.firstElementChild as HTMLElement | null;
        if (!root) return '';
        const walker = (node: Element) => {
            if (!ALLOWED_TAGS.has(node.tagName.toLowerCase())) {
                // Substituir nó proibido por seu texto
                const span = doc.createTextNode(node.textContent || '');
                node.replaceWith(span);
                return;
            }
            // Limpar atributos
            [...node.attributes].forEach(attr => {
                const name = attr.name.toLowerCase();
                if (!ALLOWED_ATTRS.has(name)) {
                    node.removeAttribute(attr.name);
                    return;
                }
                if (name === 'style') {
                    const safeStyles = (attr.value.split(';').map(s => s.trim()).filter(Boolean).map(rule => {
                        const [prop, val] = rule.split(':').map(p => p && p.trim());
                        if (!prop || !val) return null;
                        if (!ALLOWED_STYLE_PROPS.includes(prop.toLowerCase())) return null;
                        if (/url\(/i.test(val)) return null;
                        return `${prop}: ${val}`;
                    }).filter(Boolean) as string[]).join('; ');
                    if (safeStyles) node.setAttribute('style', safeStyles); else node.removeAttribute('style');
                }
                if (name === 'class') {
                    // Remove classes potencialmente perigosas (on*), aqui simplificado
                    const safeClass = attr.value.split(/\s+/).filter(c => !/^on/i.test(c)).join(' ');
                    node.setAttribute('class', safeClass);
                }
            });
            [...node.children].forEach(child => walker(child));
        };
        [...root.children].forEach(child => walker(child as Element));
        return root.innerHTML;
    } catch {
        return input.replace(/<[^>]*>/g, '');
    }
}

export function looksLikeHtml(str: string): boolean {
    return /<\w+[^>]*>/.test(str);
}
