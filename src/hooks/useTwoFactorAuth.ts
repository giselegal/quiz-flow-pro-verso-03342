/**
 * Hook para gerenciamento de 2FA usando Supabase MFA
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { appLogger } from '@/lib/utils/appLogger';

interface TwoFactorState {
  isEnrolled: boolean;
  isVerified: boolean;
  factorId: string | null;
  qrCode: string | null;
  secret: string | null;
}

interface EnrollmentResult {
  factorId: string;
  qrCode: string;
  secret: string;
}

export const useTwoFactorAuth = () => {
  const [state, setState] = useState<TwoFactorState>({
    isEnrolled: false,
    isVerified: false,
    factorId: null,
    qrCode: null,
    secret: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Inicia o enrollment de TOTP e retorna QR code
   */
  const enrollTOTP = useCallback(async (): Promise<EnrollmentResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App',
      });

      if (enrollError) {
        throw enrollError;
      }

      if (!data) {
        throw new Error('Enrollment data not returned');
      }

      const result: EnrollmentResult = {
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      };

      setState(prev => ({
        ...prev,
        factorId: result.factorId,
        qrCode: result.qrCode,
        secret: result.secret,
      }));

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Enrollment failed';
      setError(message);
      appLogger.error('2FA enrollment failed:', { data: [err] });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Verifica o código TOTP e completa o enrollment
   */
  const verifyTOTP = useCallback(async (code: string, factorId?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const targetFactorId = factorId || state.factorId;
    
    if (!targetFactorId) {
      setError('Factor ID not found');
      setIsLoading(false);
      return false;
    }

    try {
      // First create a challenge
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: targetFactorId,
      });

      if (challengeError) {
        throw challengeError;
      }

      // Then verify with the code
      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId: targetFactorId,
        challengeId: challengeData.id,
        code,
      });

      if (verifyError) {
        throw verifyError;
      }

      setState(prev => ({
        ...prev,
        isEnrolled: true,
        isVerified: true,
      }));

      // Update user_security_settings in database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_security_settings').upsert({
          user_id: user.id,
          two_factor_enabled: true,
          two_factor_verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

        // Log security event
        await supabase.from('security_audit_logs').insert({
          user_id: user.id,
          event_type: 'mfa_enrolled',
          event_category: 'authentication',
          severity: 'info',
          event_data: { factor_type: 'totp' },
        });
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setError(message);
      appLogger.error('2FA verification failed:', { data: [err] });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [state.factorId]);

  /**
   * Desativa 2FA
   */
  const disableTOTP = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Get enrolled factors
      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
      
      if (factorsError) {
        throw factorsError;
      }

      // Unenroll all TOTP factors
      for (const factor of factorsData.totp || []) {
        const { error: unenrollError } = await supabase.auth.mfa.unenroll({
          factorId: factor.id,
        });
        
        if (unenrollError) {
          throw unenrollError;
        }
      }

      setState({
        isEnrolled: false,
        isVerified: false,
        factorId: null,
        qrCode: null,
        secret: null,
      });

      // Update database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_security_settings').upsert({
          user_id: user.id,
          two_factor_enabled: false,
          two_factor_verified_at: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

        // Log security event
        await supabase.from('security_audit_logs').insert({
          user_id: user.id,
          event_type: 'mfa_disabled',
          event_category: 'authentication',
          severity: 'medium',
          event_data: { factor_type: 'totp' },
        });
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disable 2FA';
      setError(message);
      appLogger.error('2FA disable failed:', { data: [err] });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Lista fatores MFA ativos
   */
  const listFactors = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) {
        throw error;
      }

      const hasVerifiedTOTP = (data.totp || []).some(f => f.status === 'verified');
      
      setState(prev => ({
        ...prev,
        isEnrolled: hasVerifiedTOTP,
        isVerified: hasVerifiedTOTP,
        factorId: data.totp?.[0]?.id || null,
      }));

      return data;
    } catch (err) {
      appLogger.error('Failed to list MFA factors:', { data: [err] });
      return null;
    }
  }, []);

  /**
   * Verifica se MFA é necessário no login
   */
  const checkMFARequired = useCallback(async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      
      if (error) {
        throw error;
      }

      return data.nextLevel === 'aal2' && data.currentLevel === 'aal1';
    } catch (err) {
      appLogger.error('Failed to check MFA level:', { data: [err] });
      return false;
    }
  }, []);

  /**
   * Gera backup codes (mock - Supabase não suporta nativamente)
   */
  const generateBackupCodes = useCallback(async (): Promise<string[]> => {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Array.from({ length: 8 }, () => 
        Math.random().toString(36).charAt(2)
      ).join('').toUpperCase();
      codes.push(code);
    }

    // Update database with generation timestamp
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('user_security_settings').upsert({
        user_id: user.id,
        backup_codes_generated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      // Log security event
      await supabase.from('security_audit_logs').insert({
        user_id: user.id,
        event_type: 'backup_codes_generated',
        event_category: 'authentication',
        severity: 'info',
      });
    }

    return codes;
  }, []);

  return {
    // State
    ...state,
    isLoading,
    error,
    
    // Actions
    enrollTOTP,
    verifyTOTP,
    disableTOTP,
    listFactors,
    checkMFARequired,
    generateBackupCodes,
    
    // Utilities
    clearError: () => setError(null),
  };
};
