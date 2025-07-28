
import React from 'react';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { AuthProvider } from './context/AuthContext';
import { Router, Route, Switch } from 'wouter';
import { MainApp } from './components/MainApp';
import SchemaDrivenEditorPage from './pages/SchemaDrivenEditorPage';
import { quizQuestTheme } from './config/antd-theme';
import './index.css';

function App() {
  return (
    <ConfigProvider theme={quizQuestTheme} locale={ptBR}>
      <TooltipProvider>
        <AuthProvider>
          <Router>
            <Switch>
              {/* Rota para o Editor Principal */}
              <Route path="/editor" component={SchemaDrivenEditorPage} />
              <Route path="/editor/:id" component={SchemaDrivenEditorPage} />
              
              {/* Rota padrão - MainApp (Dashboard) */}
              <Route component={MainApp} />
            </Switch>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </ConfigProvider>
  );
}

export default App;
