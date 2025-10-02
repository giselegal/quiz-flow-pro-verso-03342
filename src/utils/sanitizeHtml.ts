// Sanitização leve de HTML para campos controlados no editor de Quiz.
// Objetivos:
// 1. Remover tags perigosas (<script>, <iframe>, <object>, <embed>, <style>)
// 2. Remover atributos on* (onClick, onerror, etc.)
// 3. Bloquear javascript: e data: potencialmente perigosos em href/src
// 4. Permitir apenas um conjunto pequeno de tags básicas de formatação
// 5. Manter texto interno intacto
// NOTA: Implementação simplificada para evitar dependência externa (DOMPurify)
// e não modificar package.json (histórico do repositório mostra restrição).

const ALLOWED_TAGS = new Set([
    'b', 'strong', 'i', 'em', 'u', 'br', 'span', 'p', 'div', 'ul', 'ol', 'li', 'blockquote'
]);

export function sanitizeHtml(input?: string | null): string {
    if (!input || typeof input !== 'string') return '';
    try {
        // Rápida remoção de tags bloqueadas completas (script/style/etc.).
        let html = input.replace(/<\/(script|style|iframe|object|embed)[^>]*>/gi, '')
            .replace(/<(script|style|iframe|object|embed)(.|\n|\r)*?>/gi, '');

        // Se DOMParser não existir (ambiente Node sem JSDOM), aplicar fallback simplificado.
        if (typeof (globalThis as any).DOMParser === 'undefined') {
            // Remover atributos on* e javascript: via regex básica
            html = html
                .replace(/on[a-z]+="[^"]*"/gi, '')
                .replace(/on[a-z]+='[^']*'/gi, '')
                .replace(/href="javascript:[^"]*"/gi, '')
                .replace(/href='javascript:[^']*'/gi, '')
                .replace(/src="javascript:[^"]*"/gi, '')
                .replace(/src='javascript:[^']*'/gi, '');
            // Remover totalmente tags perigosas remanescentes
            html = html.replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
                .replace(/<object[^>]*>.*?<\/object>/gi, '')
                .replace(/<embed[^>]*>.*?<\/embed>/gi, '')
                .replace(/<style[^>]*>.*?<\/style>/gi, '');
            // Expandir tags não permitidas em texto simples removendo-as mas mantendo conteúdo interno aproximado
            // Estratégia simples: remover tags de abertura/fechamento que não sejam permitidas
            html = html.replace(/<([^>\/\s]+)([^>]*)>/gi, (full, tag) => ALLOWED_TAGS.has(tag.toLowerCase()) ? full : '');
            html = html.replace(/<\/(?!p|div|span|strong|b|i|em|u|br|ul|ol|li|blockquote)[^>]+>/gi, '');
            return html.trim();
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
        const root = doc.body.firstElementChild as HTMLElement | null;
        if (!root) return '';

        const walker = (el: Element) => {
            // Remover atributos perigosos
            for (const attr of Array.from(el.attributes)) {
                const name = attr.name.toLowerCase();
                const value = attr.value;
                if (name.startsWith('on')) {
                    el.removeAttribute(attr.name);
                    continue;
                }
                if ((name === 'href' || name === 'src')) {
                    const lowered = value.trim().toLowerCase();
                    if (lowered.startsWith('javascript:') || lowered.startsWith('data:') && !lowered.startsWith('data:image/')) {
                        el.removeAttribute(attr.name);
                        continue;
                    }
                }
            }

            // Se tag não é permitida, substitui pelo seu conteúdo textual/filhos
            if (!ALLOWED_TAGS.has(el.tagName.toLowerCase())) {
                const parent = el.parentElement;
                if (parent) {
                    // Inserir filhos antes de remover
                    while (el.firstChild) parent.insertBefore(el.firstChild, el);
                    parent.removeChild(el);
                    return; // filhos já processados recursivamente pelo while
                }
            } else {
                // Continuar descendo na árvore se a tag é permitida
                for (const child of Array.from(el.children)) walker(child);
            }
        };

        for (const child of Array.from(root.children)) walker(child);
        return root.innerHTML;
    } catch {
        // Em caso de erro, fallback para texto escapado básico
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}

export default sanitizeHtml;
