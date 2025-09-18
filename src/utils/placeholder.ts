// Utilitário para gerar placeholders seguros (data URI SVG)
// Evita dependência de via.placeholder.com e funciona offline

const encode = (s: string) =>
    encodeURIComponent(s)
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29');

export function safePlaceholder(
    width: number | string = 400,
    height: number | string = 300,
    text = 'Imagem indisponível',
    bg = '#e5e7eb',
    fg = '#6b7280'
) {
    const w = typeof width === 'number' ? width : parseInt(String(width), 10) || 400;
    const h = typeof height === 'number' ? height : parseInt(String(height), 10) || 300;
    const fontSize = Math.max(12, Math.min(24, Math.floor(Math.min(w, h) / 12)));
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${fg}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}">
    ${text}
  </text>
</svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encode(svg)}`;
}

export function safeStylePlaceholder(styleName: string, width: number | string = 300, height: number | string = 200) {
    return safePlaceholder(width, height, styleName || 'Estilo');
}
