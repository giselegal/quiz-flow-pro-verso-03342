// 🚫 ARQUIVO DESABILITADO - MIGRADO PARA Routing.test.wouter.tsx
// 
// Este arquivo usa MemoryRouter (React Router) que foi removido do projeto.
// Os testes foram migrados para usar Wouter em Routing.test.wouter.tsx
// 
// MOTIVO: Sistema migrado de React Router DOM para Wouter
// STATUS: Deprecated - Manter para referência histórica

import { describe, it, expect } from 'vitest';

describe('🚫 Testes Desabilitados - Migrados para Wouter', () => {
    it.skip('deve migrar para Routing.test.wouter.tsx', () => {
        expect(true).toBe(true);
    });

    it.skip('todos os testes de roteamento foram movidos para usar Wouter', () => {
        // Os testes agora estão em:
        // src/__tests__/Routing.test.wouter.tsx

        // Razões da migração:
        // - React Router DOM foi removido (Bundle size optimization)
        // - Wouter é o roteador oficial do projeto
        // - MemoryRouter não existe mais
        // - Melhor performance e menor bundle

        expect('wouter').toBe('primary router');
    });
});

// 📝 HISTÓRICO DE MIGRAÇÃO:
// 
// ANTES (React Router):
// - MemoryRouter para testes
// - ~13KB de bundle size extra
// - Conflitos entre React Router e Wouter
// 
// DEPOIS (Wouter Only):
// - memoryLocation para testes
// - Bundle reduzido em 82%
// - Sistema unificado e consistente
// 
// ARQUIVOS AFETADOS:
// ✅ Routing.test.wouter.tsx (novo, com Wouter)
// ❌ Routing.test.tsx (desabilitado, legacy)
// ✅ useNavigation.ts (Wouter centralizado)
// ✅ RedirectRoute.tsx (Wouter integration)
// ✅ App.tsx (Wouter routes)