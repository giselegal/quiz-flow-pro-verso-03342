import { describe, it, expect } from 'vitest';
import masterTemplate from '../../public/templates/quiz21-complete.json';

// Util simples de interpolação replicando lógica esperada (replace direto); caso futura função oficial surja, adaptar.
function interpolate(str: string, ctx: Record<string, string>) {
    return str.replace(/\{(\w+)\}/g, (_, key) => ctx[key] ?? `{${key}}`);
}

describe('Template Master quiz21-complete - interpolação de placeholders step-20', () => {
    it('substitui {userName} e {resultStyle} em título, subtítulo e descrição', () => {
        const step20 = (masterTemplate as any)?.steps?.['step-20'];
        expect(step20).toBeTruthy();
        const headerBlock = step20.blocks.find((b: any) => b.id === 'step20-result-header');
        expect(headerBlock).toBeTruthy();

        const ctx = { userName: 'Maria', resultStyle: 'Elegante' };

        const { title, subtitle, description } = headerBlock.content;
        const titleInterpolated = interpolate(title, ctx);
        const subtitleInterpolated = interpolate(subtitle, ctx);
        const descriptionInterpolated = interpolate(description, ctx);

        expect(titleInterpolated).toBe('Maria, seu estilo predominante é:');
        expect(subtitleInterpolated).toBe('Estilo Elegante');
        expect(descriptionInterpolated).toContain('Elegante');
        expect(descriptionInterpolated).not.toMatch(/\{resultStyle\}/);
    });

    it('interpolação em bloco style-card-inline (descrição e features)', () => {
        const step20 = (masterTemplate as any)?.steps?.['step-20'];
        const styleCard = step20.blocks.find((b: any) => b.id === 'step20-style-card');
        expect(styleCard).toBeTruthy();

        const ctx = { userName: 'Maria', resultStyle: 'Elegante', resultPersonality: 'sofisticação discreta', resultColors: 'tons neutros', resultFabrics: 'tecidos nobres', resultPrints: 'geométricas suaves', resultAccessories: 'jóias minimalistas' };

        const descInterpolated = interpolate(styleCard.content.description, ctx);
        expect(descInterpolated).toBe('O estilo Elegante se caracteriza por:');

        styleCard.content.features.forEach((f: string) => {
            const interpolated = interpolate(f, ctx);
            expect(interpolated).not.toMatch(/\{.*\}/); // nenhum placeholder restante
            expect(interpolated).toMatch(/Elegante|sofisticação|tons neutros|tecidos nobres|geométricas suaves|jóias minimalistas/);
        });
    });
});
