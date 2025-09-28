/**
 * 📊 ALIGNMENT DASHBOARD - Monitor de alinhamento frontend-backend
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';

interface AlignmentStatus {
  overall: number;
  categories: {
    supabase: number;
    types: number;
    components: number;
    performance: number;
  };
  issues: string[];
  lastCheck: string;
}

const AlignmentDashboard: React.FC = () => {
  const [status, setStatus] = useState<AlignmentStatus>({
    overall: 0,
    categories: { supabase: 0, types: 0, components: 0, performance: 0 },
    issues: [],
    lastCheck: ''
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkAlignment = async () => {
    setIsChecking(true);
    
    try {
      // Simulate alignment check (would call real service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockStatus: AlignmentStatus = {
        overall: 85,
        categories: {
          supabase: 100,
          types: 100, 
          components: 70,
          performance: 80
        },
        issues: ['component_configurations migration pendente'],
        lastCheck: new Date().toLocaleString()
      };
      
      setStatus(mockStatus);
      
    } catch (error) {
      console.error('Erro no check:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAlignment();
  }, []);

  const getStatusColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 70) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alignment Dashboard</h1>
          <p className="text-gray-600">Monitor de alinhamento frontend-backend</p>
        </div>
        <Button onClick={checkAlignment} disabled={isChecking}>
          <RefreshCw className={'h-4 w-4 mr-2 ' + (isChecking ? 'animate-spin' : '')} />
          {isChecking ? 'Verificando...' : 'Verificar'}
        </Button>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Score Geral
            <Badge variant="outline" className={getStatusColor(status.overall)}>
              {status.overall}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.overall)}
            <span className="font-semibold">
              {status.overall >= 90 ? 'Excelente' : status.overall >= 70 ? 'Bom' : 'Precisa melhorar'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Última verificação: {status.lastCheck}
          </p>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(status.categories).map(([category, score]) => (
          <Card key={category}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold capitalize">{category}</h3>
                {getStatusIcon(score)}
              </div>
              <p className={'text-2xl font-bold ' + getStatusColor(score)}>
                {score}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Issues */}
      {status.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Issues Identificadas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {status.issues.map((issue, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlignmentDashboard;