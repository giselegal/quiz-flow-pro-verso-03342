import React from 'react';
import { Route, Switch } from 'wouter';
import { LovableAdminLayout } from '@/components/lovable/LovableAdminLayout';

const DashboardPage = () => {
  return (
    <LovableAdminLayout>
      <Switch>
        <Route path="/admin" component={() => (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Visão geral do sistema</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-2">Usuários</h3>
                <p className="text-3xl font-bold text-blue-600">1,234</p>
                <p className="text-sm text-gray-500">Total de usuários</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-2">Funis</h3>
                <p className="text-3xl font-bold text-green-600">56</p>
                <p className="text-sm text-gray-500">Funis criados</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-2">Taxa de Conversão</h3>
                <p className="text-3xl font-bold text-purple-600">12.5%</p>
                <p className="text-sm text-gray-500">Média geral</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-2">Receita</h3>
                <p className="text-3xl font-bold text-orange-600">R$ 89,320</p>
                <p className="text-sm text-gray-500">Este mês</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Atividade Recente</h2>
              <p className="text-gray-600">Dashboard completo em desenvolvimento...</p>
            </div>
          </div>
        )} />
        
        <Route>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Visão geral do sistema</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Métricas Principais</h2>
              <p className="text-gray-600">Dashboard em desenvolvimento...</p>
            </div>
          </div>
        </Route>
      </Switch>
    </LovableAdminLayout>
  );
};

export default DashboardPage;