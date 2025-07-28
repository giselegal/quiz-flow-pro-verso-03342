import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import ptBR from 'antd/locale/pt_BR'
import App from './App'
import { quizQuestTheme } from './config/antd-theme'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider 
      theme={quizQuestTheme}
      locale={ptBR}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
