
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Painel Administrativo</CardTitle>
          <CardDescription>
            Gerencie seus quizzes e configurações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Funcionalidades administrativas em desenvolvimento...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
