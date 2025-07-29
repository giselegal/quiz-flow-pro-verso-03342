
import React from 'react';
import { Link } from 'react-router-dom';
import BlocksDemo from './BlocksDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function BlocksTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Página de Teste - Blocos</h1>
              <p className="text-gray-600 mt-2">Demonstração dos componentes de bloco disponíveis</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Desenvolvimento</Badge>
              <Badge>Teste</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Navegação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link 
                    to="/editor" 
                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  >
                    Editor Principal
                  </Link>
                  <Link 
                    to="/quiz-editor" 
                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  >
                    Editor de Quiz
                  </Link>
                  <Link 
                    to="/" 
                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  >
                    Página Inicial
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <BlocksDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
