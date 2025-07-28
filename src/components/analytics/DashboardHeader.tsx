
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Settings, HelpCircle } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';

const DashboardHeader: React.FC = () => {
  return (
    <div className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h1>
          <p className="text-gray-600">Monitore o desempenho do seu funil de vendas</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Tooltip title="Notificações">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </Tooltip>
          
          <Tooltip title="Configurações">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Tooltip>
          
          <Tooltip title="Ajuda">
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
