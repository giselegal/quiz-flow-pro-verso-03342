import { describe, it, expect, beforeEach } from 'vitest';
import { funnelLocalStore } from '@/services/funnelLocalStore';
import { cloneFunnelTemplate } from '@/utils/cloneFunnel';
import { funnelTemplates } from '@/config/funnelTemplates';

// Mock localStorage para ambiente Node.js
const mockStorage: { [key: string]: string } = {};

globalThis.localStorage = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, value: string) => {
        mockStorage[key] = value;
    },
    removeItem: (key: string) => {
        delete mockStorage[key];
    },
    clear: () => {
        Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    },
    key: () => null,
    length: 0
};

describe('Fluxo Funil Template -> Meus Funis', () => {
    beforeEach(() => {
        // Limpar localStorage antes de cada teste
        Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    });

    it('salva instâncias distintas em /admin/meus-funis', () => {
        // Simular: usuário escolhe template
        const template = funnelTemplates[0]; // style-discovery

        // Criar duas instâncias
        const instanciaA = cloneFunnelTemplate(template, 'Meu Funil A');
        const instanciaB = cloneFunnelTemplate(template, 'Meu Funil B');

        // Salvar usando funnelLocalStore (simula /admin/meus-funis)
        funnelLocalStore.upsert({
            id: instanciaA.id,
            name: instanciaA.name,
            status: 'draft',
            updatedAt: instanciaA.createdAt
        });

        funnelLocalStore.upsert({
            id: instanciaB.id,
            name: instanciaB.name,
            status: 'draft',
            updatedAt: instanciaB.createdAt
        });

        // Verificar que são entradas separadas
        const lista = funnelLocalStore.list();
        expect(lista).toHaveLength(2);
        expect(lista[0].id).not.toBe(lista[1].id);
        expect(lista[0].name).toBe('Meu Funil A');
        expect(lista[1].name).toBe('Meu Funil B');

        // Alterar propriedades de uma instância
        instanciaA.blocks[0].properties.title = 'Título Alterado A';

        // Verificar que B não foi afetado
        expect(instanciaB.blocks[0].properties.title).not.toBe('Título Alterado A');
    });

    it('garante IDs únicos mesmo salvando várias vezes', () => {
        const template = funnelTemplates[0];

        const ids: string[] = [];
        for (let i = 0; i < 5; i++) {
            const instancia = cloneFunnelTemplate(template, `Funil ${i}`);
            ids.push(instancia.id);

            funnelLocalStore.upsert({
                id: instancia.id,
                name: instancia.name,
                status: 'draft'
            });
        }

        // Todos os IDs devem ser únicos
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(5);

        // Lista deve ter 5 entradas
        expect(funnelLocalStore.list()).toHaveLength(5);
    });
});
