/**
 * 🧮 UNIFIED CALCULATION ENGINE - STUB
 * Stub temporário para desbloquear build
 */

import { appLogger } from '@/lib/utils/appLogger';

export class UnifiedCalculationEngine {
  calculate(data: any): any {
    appLogger.warn('[UnifiedCalculationEngine] Stub - calculate não implementado');
    return {};
  }

  validate(data: any): boolean {
    appLogger.warn('[UnifiedCalculationEngine] Stub - validate não implementado');
    return true;
  }
}

export const calculationEngine = new UnifiedCalculationEngine();
export default calculationEngine;
