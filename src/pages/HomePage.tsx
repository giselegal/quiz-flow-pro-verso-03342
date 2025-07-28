
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';

const HomePage: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Quiz Builder</h1>
        <p className="text-xl text-gray-600">Crie quizzes interativos com editor visual</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Editor Visual</CardTitle>
            <CardDescription>
              Crie quizzes com drag & drop usando Craft.js
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLocation('/craft-editor')}
              className="w-full"
            >
              Abrir Editor Visual
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Simples</CardTitle>
            <CardDescription>
              Visualize um quiz de exemplo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLocation('/quiz')}
              variant="outline"
              className="w-full"
            >
              Ver Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
