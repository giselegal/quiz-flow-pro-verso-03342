/**
 * 🔍 FRONTEND-BACKEND ALIGNMENT VALIDATOR
 * 
 * Serviço para monitorar alinhamento em tempo real
 */

import { supabase } from '@/integrations/supabase/client';

export class AlignmentValidator {
  static async validateAlignment(): Promise<{
    score: number;
    status: 'excellent' | 'good' | 'needs_improvement';
    issues: string[];
  }> {
    const issues: string[] = [];
    let score = 100;
    
    try {
      // Check Supabase connection
      const { data, error } = await supabase.from('funnels').select('id').limit(1);
      if (error) {
        issues.push('Supabase connection failed');
        score -= 20;
      }
      
      // Check component_configurations
      const { error: configError } = await (supabase as any).from('component_configurations').select('id').limit(1);
      if (configError) {
        issues.push('component_configurations table missing');
        score -= 15;
      }
      
      // Determine status
      let status: 'excellent' | 'good' | 'needs_improvement';
      if (score >= 90) status = 'excellent';
      else if (score >= 70) status = 'good';
      else status = 'needs_improvement';
      
      return { score, status, issues };
      
    } catch (error: any) {
      return { 
        score: 0, 
        status: 'needs_improvement', 
        issues: ['Validation failed: ' + error.message] 
      };
    }
  }
}