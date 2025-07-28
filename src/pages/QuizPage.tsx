
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QuizPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Quiz de Exemplo</CardTitle>
          <CardDescription>
            Este é um quiz de demonstração
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Qual é a sua cor favorita?</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Azul
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Vermelho
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Verde
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPage;
