// Simplified diagnostic service

export interface DiagnosticData {
  id: string;
  message: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
}

export const saveDiagnostic = (data: DiagnosticData): void => {
  console.log('Would save diagnostic:', data);
};

export const getDiagnostics = (): DiagnosticData[] => {
  console.log('Would get diagnostics');
  return [];
};

export default saveDiagnostic;
