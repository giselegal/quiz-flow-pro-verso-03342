/**
 * 🧪 TESTES: Pareamento de IDs (Templates JSON <-> Supabase)
 */

import { describe, it, expect } from 'vitest';
import {
  TEMPLATE_UUID_MAP,
  FUNNEL_UUID_MAP,
  getTemplateUUID,
  getFunnelUUID,
  getTemplateJSONId,
  getFunnelJSONId,
  isKnownTemplate,
  isKnownFunnel,
  getKnownTemplates,
} from '@/lib/utils/templateIdMapping';

describe('Template ID Mapping', () => {
  describe('Mapeamentos básicos', () => {
    it('deve ter quiz21StepsComplete mapeado para UUID fixo', () => {
      expect(TEMPLATE_UUID_MAP['quiz21StepsComplete']).toBe('00000000-0000-0000-0000-000000000001');
    });

    it('deve ter funnel UUID pareado para quiz21StepsComplete', () => {
      expect(FUNNEL_UUID_MAP['quiz21StepsComplete']).toBe('00000000-0000-0000-0000-000000000101');
    });

    it('deve ter aliases mapeados para mesmo UUID', () => {
      expect(TEMPLATE_UUID_MAP['quiz21-complete']).toBe(TEMPLATE_UUID_MAP['quiz21StepsComplete']);
      expect(TEMPLATE_UUID_MAP['quiz21']).toBe(TEMPLATE_UUID_MAP['quiz21StepsComplete']);
    });
  });

  describe('getTemplateUUID()', () => {
    it('deve retornar UUID para ID válido', () => {
      expect(getTemplateUUID('quiz21StepsComplete')).toBe('00000000-0000-0000-0000-000000000001');
    });

    it('deve retornar UUID para alias', () => {
      expect(getTemplateUUID('quiz21')).toBe('00000000-0000-0000-0000-000000000001');
    });

    it('deve retornar null para ID desconhecido', () => {
      expect(getTemplateUUID('template-inexistente')).toBeNull();
    });
  });

  describe('getFunnelUUID()', () => {
    it('deve retornar funnel UUID para ID válido', () => {
      expect(getFunnelUUID('quiz21StepsComplete')).toBe('00000000-0000-0000-0000-000000000101');
    });

    it('deve retornar null para ID desconhecido', () => {
      expect(getFunnelUUID('template-inexistente')).toBeNull();
    });
  });

  describe('Mapeamento reverso', () => {
    it('deve converter UUID para JSON ID', () => {
      expect(getTemplateJSONId('00000000-0000-0000-0000-000000000001')).toBe('quiz21StepsComplete');
    });

    it('deve converter funnel UUID para JSON ID', () => {
      expect(getFunnelJSONId('00000000-0000-0000-0000-000000000101')).toBe('quiz21StepsComplete');
    });

    it('deve retornar null para UUID desconhecido', () => {
      expect(getTemplateJSONId('99999999-9999-9999-9999-999999999999')).toBeNull();
    });
  });

  describe('Validação', () => {
    it('deve identificar templates conhecidos por JSON ID', () => {
      expect(isKnownTemplate('quiz21StepsComplete')).toBe(true);
      expect(isKnownTemplate('quiz21')).toBe(true);
      expect(isKnownTemplate('inexistente')).toBe(false);
    });

    it('deve identificar templates conhecidos por UUID', () => {
      expect(isKnownTemplate('00000000-0000-0000-0000-000000000001')).toBe(true);
      expect(isKnownTemplate('99999999-9999-9999-9999-999999999999')).toBe(false);
    });

    it('deve identificar funnels conhecidos', () => {
      expect(isKnownFunnel('00000000-0000-0000-0000-000000000101')).toBe(true);
      expect(isKnownFunnel('99999999-9999-9999-9999-999999999999')).toBe(false);
    });
  });

  describe('getKnownTemplates()', () => {
    it('deve retornar lista de templates conhecidos', () => {
      const templates = getKnownTemplates();
      
      expect(templates).toHaveLength(1); // Apenas quiz21StepsComplete (sem aliases)
      expect(templates[0]).toEqual({
        jsonId: 'quiz21StepsComplete',
        uuid: '00000000-0000-0000-0000-000000000001',
        funnelUuid: '00000000-0000-0000-0000-000000000101',
      });
    });

    it('não deve incluir aliases na lista', () => {
      const templates = getKnownTemplates();
      const ids = templates.map(t => t.jsonId);
      
      expect(ids).not.toContain('quiz21');
      expect(ids).not.toContain('quiz21-complete');
    });
  });

  describe('Ciclo completo de conversão', () => {
    it('deve manter consistência em conversões bidirecionais', () => {
      const jsonId = 'quiz21StepsComplete';
      
      // JSON ID -> UUID -> JSON ID
      const uuid = getTemplateUUID(jsonId);
      expect(uuid).not.toBeNull();
      
      const backToJsonId = getTemplateJSONId(uuid!);
      expect(backToJsonId).toBe(jsonId);
    });

    it('deve manter consistência entre template e funnel', () => {
      const jsonId = 'quiz21StepsComplete';
      
      const templateUuid = getTemplateUUID(jsonId);
      const funnelUuid = getFunnelUUID(jsonId);
      
      expect(templateUuid).toBe('00000000-0000-0000-0000-000000000001');
      expect(funnelUuid).toBe('00000000-0000-0000-0000-000000000101');
      
      // Ambos devem retornar ao mesmo JSON ID
      expect(getTemplateJSONId(templateUuid!)).toBe(jsonId);
      expect(getFunnelJSONId(funnelUuid!)).toBe(jsonId);
    });
  });
});
