/**
 * 🧪 TESTES: Version Helpers v3.2
 * 
 * Valida funções utilitárias de comparação de versões
 */

import { describe, it, expect } from 'vitest';
import {
  compareVersions,
  getVersionNumber,
  supportsDynamicVariables,
  isSupportedVersion,
  getLatestVersion,
  needsMigration,
  formatVersion,
  isLegacyVersion,
  isV3Template,
  isV32OrNewer,
  hasBlocksFormat,
  type TemplateVersion,
} from '@/lib/utils/versionHelpers';

describe('versionHelpers - Basic Operations', () => {
  describe('getVersionNumber', () => {
    it('deve extrair número de versão corretamente', () => {
      expect(getVersionNumber('3.2')).toBe(32);
      expect(getVersionNumber('3.1')).toBe(31);
      expect(getVersionNumber('3.0')).toBe(30);
      expect(getVersionNumber('2.1')).toBe(21);
    });

    it('deve retornar 0 para versões inválidas', () => {
      expect(getVersionNumber('invalid')).toBe(0);
      expect(getVersionNumber('')).toBe(0);
      expect(getVersionNumber(undefined)).toBe(0);
    });
  });

  describe('compareVersions', () => {
    it('deve comparar versões corretamente', () => {
      expect(compareVersions('3.2', '3.1')).toBe(1); // 3.2 > 3.1
      expect(compareVersions('3.0', '3.0')).toBe(0); // 3.0 = 3.0
      expect(compareVersions('2.1', '3.0')).toBe(-9); // 2.1 < 3.0
    });
  });

  describe('isV3Template', () => {
    it('deve identificar templates v3.x', () => {
      expect(isV3Template('3.2')).toBe(true);
      expect(isV3Template('3.1')).toBe(true);
      expect(isV3Template('3.0')).toBe(true);
    });

    it('deve rejeitar outras versões', () => {
      expect(isV3Template('2.1')).toBe(false);
      expect(isV3Template('2.0')).toBe(false);
      expect(isV3Template(undefined)).toBe(false);
    });
  });

  describe('isV32OrNewer', () => {
    it('deve identificar v3.2+', () => {
      expect(isV32OrNewer('3.2')).toBe(true);
      expect(isV32OrNewer('3.3')).toBe(true); // Futuro
    });

    it('deve rejeitar versões anteriores', () => {
      expect(isV32OrNewer('3.1')).toBe(false);
      expect(isV32OrNewer('3.0')).toBe(false);
      expect(isV32OrNewer('2.1')).toBe(false);
    });
  });
});

describe('versionHelpers - v3.2 Features', () => {
  describe('supportsDynamicVariables', () => {
    it('deve retornar true apenas para v3.2+', () => {
      expect(supportsDynamicVariables('3.2')).toBe(true);
      expect(supportsDynamicVariables('3.3')).toBe(true); // Futuro
    });

    it('deve retornar false para v3.1 e anteriores', () => {
      expect(supportsDynamicVariables('3.1')).toBe(false);
      expect(supportsDynamicVariables('3.0')).toBe(false);
      expect(supportsDynamicVariables('2.1')).toBe(false);
      expect(supportsDynamicVariables('2.0')).toBe(false);
    });
  });

  describe('isSupportedVersion', () => {
    it('deve aceitar versões suportadas', () => {
      expect(isSupportedVersion('3.2')).toBe(true);
      expect(isSupportedVersion('3.1')).toBe(true);
      expect(isSupportedVersion('3.0')).toBe(true);
      expect(isSupportedVersion('2.1')).toBe(true);
      expect(isSupportedVersion('2.0')).toBe(true);
    });

    it('deve rejeitar versões não suportadas', () => {
      expect(isSupportedVersion('4.0')).toBe(false);
      expect(isSupportedVersion('1.5')).toBe(false);
      expect(isSupportedVersion('invalid')).toBe(false);
    });
  });

  describe('getLatestVersion', () => {
    it('deve retornar v3.2 como versão mais recente', () => {
      expect(getLatestVersion()).toBe('3.2');
    });
  });

  describe('needsMigration', () => {
    it('deve indicar necessidade de migração', () => {
      expect(needsMigration('3.0')).toBe(true);
      expect(needsMigration('3.1')).toBe(true);
      expect(needsMigration('2.1')).toBe(true);
      expect(needsMigration('3.2')).toBe(false);
    });
  });

  describe('formatVersion', () => {
    it('deve formatar versões para display', () => {
      expect(formatVersion('3.2')).toBe('v3.2');
      expect(formatVersion('3.0')).toBe('v3.0');
      expect(formatVersion(undefined)).toBe('desconhecida');
    });
  });

  describe('isLegacyVersion', () => {
    it('deve identificar versões legadas (< 3.0)', () => {
      expect(isLegacyVersion('2.1')).toBe(true);
      expect(isLegacyVersion('2.0')).toBe(true);
      expect(isLegacyVersion('1.0')).toBe(true);
    });

    it('deve retornar false para v3.x', () => {
      expect(isLegacyVersion('3.0')).toBe(false);
      expect(isLegacyVersion('3.1')).toBe(false);
      expect(isLegacyVersion('3.2')).toBe(false);
    });
  });

  describe('hasBlocksFormat', () => {
    it('deve identificar templates com blocos', () => {
      expect(hasBlocksFormat({ blocks: [{ id: 'b1' }] })).toBe(true);
    });

    it('deve rejeitar templates sem blocos', () => {
      expect(hasBlocksFormat({ blocks: [] })).toBe(false);
      expect(hasBlocksFormat({})).toBe(false);
      expect(hasBlocksFormat(null)).toBe(false);
    });
  });
});

describe('versionHelpers - Edge Cases', () => {
  it('deve lidar com versões undefined gracefully', () => {
    expect(getVersionNumber(undefined)).toBe(0);
    expect(isV3Template(undefined)).toBe(false);
    expect(isLegacyVersion(undefined)).toBe(true);
  });

  it('deve comparar com resultado esperado para inputs inválidos', () => {
    // 'invalid' -> 0, '3.0' -> 30, então: 0 - 30 = -30
    expect(compareVersions('invalid', '3.0')).toBe(-30);
    // '3.0' -> 30, 'invalid' -> 0, então: 30 - 0 = 30
    expect(compareVersions('3.0', 'invalid')).toBe(30);
  });
});
