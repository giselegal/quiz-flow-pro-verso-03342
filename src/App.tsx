
import React from 'react';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { AuthProvider } from './context/AuthContext';
import { MainApp } from './components/MainApp';
import { quizQuestTheme } from './config/antd-theme';
import './index.css';

function App() {
  return (
    <ConfigProvider theme={quizQuestTheme} locale={ptBR}>
      <TooltipProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </TooltipProvider>
    </ConfigProvider>
  );
}

export default App;
