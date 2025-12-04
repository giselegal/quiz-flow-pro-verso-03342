/**
 * Componente de Setup de 2FA com QR Code
 */

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';
import { useToast } from '@/hooks/use-toast';
import { BackupCodesDisplay } from './BackupCodesDisplay';
import { 
  Shield, 
  ShieldCheck, 
  ShieldOff,
  Copy, 
  CheckCircle,
  Loader2,
  Smartphone,
  Key,
  AlertTriangle,
} from 'lucide-react';

type SetupState = 'idle' | 'enrolling' | 'verifying' | 'success' | 'enabled';

interface TwoFactorSetupProps {
  onStatusChange?: (enabled: boolean) => void;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onStatusChange }) => {
  const [setupState, setSetupState] = useState<SetupState>('idle');
  const [otpValue, setOtpValue] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [secretCopied, setSecretCopied] = useState(false);
  
  const { toast } = useToast();
  const {
    isEnrolled,
    isLoading,
    error,
    qrCode,
    secret,
    enrollTOTP,
    verifyTOTP,
    disableTOTP,
    listFactors,
    generateBackupCodes,
    clearError,
  } = useTwoFactorAuth();

  // Check existing enrollment on mount
  useEffect(() => {
    const checkEnrollment = async () => {
      const factors = await listFactors();
      if (factors?.totp?.some(f => f.status === 'verified')) {
        setSetupState('enabled');
      }
    };
    checkEnrollment();
  }, [listFactors]);

  const handleStartEnrollment = async () => {
    clearError();
    setSetupState('enrolling');
    
    const result = await enrollTOTP();
    if (!result) {
      setSetupState('idle');
    }
  };

  const handleVerify = async () => {
    if (otpValue.length !== 6) return;
    
    setSetupState('verifying');
    const success = await verifyTOTP(otpValue);
    
    if (success) {
      // Generate backup codes
      const codes = await generateBackupCodes();
      setBackupCodes(codes);
      setSetupState('success');
      onStatusChange?.(true);
      
      toast({
        title: '2FA Ativado',
        description: 'Autenticação de dois fatores configurada com sucesso.',
      });
    } else {
      setSetupState('enrolling');
      setOtpValue('');
    }
  };

  const handleDisable = async () => {
    const success = await disableTOTP();
    
    if (success) {
      setSetupState('idle');
      setBackupCodes([]);
      onStatusChange?.(false);
      
      toast({
        title: '2FA Desativado',
        description: 'Autenticação de dois fatores foi desativada.',
      });
    }
  };

  const handleCopySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setSecretCopied(true);
      setTimeout(() => setSecretCopied(false), 2000);
      
      toast({
        title: 'Copiado',
        description: 'Secret copiado para a área de transferência.',
      });
    }
  };

  const handleContinueAfterBackup = () => {
    setSetupState('enabled');
  };

  // Render based on state
  if (setupState === 'idle') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Autenticação de Dois Fatores
          </CardTitle>
          <CardDescription>
            Adicione uma camada extra de segurança usando um app autenticador
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <Smartphone className="w-8 h-8 text-primary mt-1" />
            <div>
              <h4 className="font-medium">Como funciona</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Você escaneará um QR code com um app autenticador (Google Authenticator, Authy, etc.) 
                e usará os códigos gerados para confirmar seu login.
              </p>
            </div>
          </div>
          
          <Button onClick={handleStartEnrollment} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4 mr-2" />
            )}
            Ativar 2FA
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (setupState === 'enrolling' || setupState === 'verifying') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Configurar 2FA
          </CardTitle>
          <CardDescription>
            Escaneie o QR code com seu app autenticador
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* QR Code */}
          <div className="flex flex-col items-center gap-4">
            {qrCode ? (
              <div className="p-4 bg-white rounded-lg">
                <QRCodeSVG value={qrCode} size={200} />
              </div>
            ) : (
              <div className="w-[200px] h-[200px] bg-muted animate-pulse rounded-lg" />
            )}
            
            <p className="text-sm text-muted-foreground text-center">
              Escaneie este código com Google Authenticator, Authy ou similar
            </p>
          </div>

          {/* Manual Secret */}
          {secret && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Ou insira manualmente:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-sm font-mono break-all">
                  {secret}
                </code>
                <Button variant="outline" size="icon" onClick={handleCopySecret}>
                  {secretCopied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* OTP Input */}
          <div className="space-y-4">
            <p className="text-sm font-medium">Digite o código de 6 dígitos:</p>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={setOtpValue}
                disabled={setupState === 'verifying'}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setSetupState('idle')}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleVerify}
              disabled={otpValue.length !== 6 || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Verificar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (setupState === 'success') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <ShieldCheck className="w-5 h-5" />
            2FA Ativado com Sucesso!
          </CardTitle>
          <CardDescription>
            Salve seus códigos de backup em um lugar seguro
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Guarde estes códigos em um lugar seguro. 
              Você precisará deles se perder acesso ao seu app autenticador.
            </AlertDescription>
          </Alert>

          <BackupCodesDisplay codes={backupCodes} />

          <Button onClick={handleContinueAfterBackup} className="w-full">
            <CheckCircle className="w-4 h-4 mr-2" />
            Salvei meus códigos, continuar
          </Button>
        </CardContent>
      </Card>
    );
  }

  // setupState === 'enabled'
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          Autenticação de Dois Fatores
          <Badge variant="default" className="ml-2 bg-green-600">
            Ativo
          </Badge>
        </CardTitle>
        <CardDescription>
          Sua conta está protegida com autenticação de dois fatores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
          <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-200">
              2FA está ativo
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Você precisará do código do seu app autenticador sempre que fizer login.
            </p>
          </div>
        </div>

        <Button 
          variant="destructive" 
          onClick={handleDisable}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ShieldOff className="w-4 h-4 mr-2" />
          )}
          Desativar 2FA
        </Button>
      </CardContent>
    </Card>
  );
};
