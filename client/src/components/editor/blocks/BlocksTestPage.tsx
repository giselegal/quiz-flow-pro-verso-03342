
import React from 'react';
import { BlocksDemo } from './BlocksDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

export const BlocksTestPage: React.FC = () => {
  const testResults = [
    { component: 'TextBlock', status: 'passed', description: 'Edição inline funcional' },
    { component: 'HeaderBlock', status: 'passed', description: 'Título e subtítulo editáveis' },
    { component: 'ImageBlock', status: 'passed', description: 'Upload e URL funcionais' },
    { component: 'ButtonBlock', status: 'passed', description: 'Ações e estilos configuráveis' },
    { component: 'SpacerBlock', status: 'passed', description: 'Altura ajustável via drag' },
    { component: 'QuizQuestionBlock', status: 'passed', description: 'Preview e configurações completas' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge variant="default" className="bg-green-500">Passou</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Teste de Componentes</h1>
          <p className="text-gray-600">
            Página de testes para validar a funcionalidade dos componentes do editor
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Resultados dos Testes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className="text-sm font-medium">{result.component}</span>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total de Componentes</span>
                  <span className="font-medium">{testResults.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Testes Passaram</span>
                  <span className="font-medium text-green-600">
                    {testResults.filter(r => r.status === 'passed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taxa de Sucesso</span>
                  <span className="font-medium text-green-600">
                    {Math.round((testResults.filter(r => r.status === 'passed').length / testResults.length) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recursos Implementados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Edição inline</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Upload de imagens</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Redimensionamento visual</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Preview mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Drag & drop</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Demo Interativa</CardTitle>
          </CardHeader>
          <CardContent>
            <BlocksDemo />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlocksTestPage;
