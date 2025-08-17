# 🚀 Guia de Deploy - Editor Melhorado

## 📋 **Checklist de Deploy**

### **Passo 1: Preparação do Banco de Dados** ⚠️ CRÍTICO

```bash
# 1. Acesse o Supabase Dashboard
# 2. Vá em SQL Editor
# 3. Execute o arquivo: /database/enhanced_schema.sql
```

### **Passo 2: Verificar Estrutura de Arquivos**

```bash
# Verificar se todos os arquivos estão no lugar:
src/components/editor/EnhancedEditor.tsx                    ✅
src/components/editor/validation/ValidationSystem.tsx      ✅
src/components/editor/feedback/FeedbackSystem.tsx          ✅
src/components/admin/security/AccessControlSystem.tsx      ✅
src/components/editor/seo/SEOSystem.tsx                     ✅
src/components/admin/workflow/PublishingWorkflow.tsx       ✅
src/components/admin/analytics/AdvancedAnalytics.tsx       ✅
src/components/testing/SystemIntegrationTest.tsx           ✅
src/components/routing/EnhancedAppRouter.tsx               ✅
src/pages/examples/EnhancedEditorIntegration.tsx           ✅
```

### **Passo 3: Integração com Aplicação Existente**

#### **Opção A: Substituição Completa (Recomendado)**

```typescript
// Em seu arquivo principal de roteamento ou App.tsx
import { EnhancedAppRouter } from './components/routing/EnhancedAppRouter';

function App() {
  return <EnhancedAppRouter />;
}
```

#### **Opção B: Integração Gradual**

```typescript
// Adicionar rotas específicas ao seu router existente
import EnhancedEditor from './components/editor/EnhancedEditor';
import SystemIntegrationTest from './components/testing/SystemIntegrationTest';

// No seu router:
<Route path="/editor-v2/:funnelId" component={EnhancedEditor} />
<Route path="/dev/test" component={SystemIntegrationTest} />
```

### **Passo 4: Configurar Variáveis de Ambiente**

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica
```

### **Passo 5: Instalar Dependências Necessárias**

```bash
npm install @supabase/supabase-js wouter lucide-react
npm install @radix-ui/react-tabs @radix-ui/react-toast
```

---

## 🧪 **Teste de Funcionamento**

### **1. Teste Básico de Integração**

```bash
# Acesse: http://localhost:3000/dev/test
# Execute todos os testes e verifique se passam
```

### **2. Teste do Editor Melhorado**

```bash
# Acesse: http://localhost:3000/editor
# Ou: http://localhost:3000/admin/funis
```

### **3. Teste com Funil Específico**

```bash
# Acesse: http://localhost:3000/enhanced-editor/123
# Substitua 123 por um ID de funil real
```

---

## 📁 **Estrutura de Deploy Recomendada**

### **Fase 1: Ambiente de Desenvolvimento**

```bash
# 1. Deploy em branch separada
git checkout -b feature/enhanced-editor

# 2. Teste localmente
npm run dev

# 3. Acesse /dev/test para validar
```

### **Fase 2: Ambiente de Homologação**

```bash
# 1. Deploy no Vercel/Netlify com preview
# 2. Teste com dados reais
# 3. Validar performance
```

### **Fase 3: Produção**

```bash
# 1. Merge para main
# 2. Deploy automático
# 3. Monitorar logs
```

---

## 🔧 **Configuração por Ambiente**

### **Desenvolvimento**

```typescript
// Usar mock data e logs detalhados
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  console.log('Enhanced Editor: Modo desenvolvimento ativo');
}
```

### **Produção**

```typescript
// Remover logs e otimizar performance
const isProd = process.env.NODE_ENV === 'production';
```

---

## 📊 **Monitoramento Pós-Deploy**

### **Métricas a Acompanhar**

- ✅ Tempo de carregamento das páginas
- ✅ Taxa de erro nos componentes
- ✅ Uso de memória/CPU
- ✅ Queries de banco executadas

### **Logs Importantes**

```bash
# Console do navegador
# Logs do Supabase
# Métricas do Vercel/Netlify
```

---

## 🚨 **Troubleshooting Comum**

### **Erro: "Módulo não encontrado"**

```bash
# Verificar paths dos imports
# Confirmar estrutura de pastas
# Reinstalar dependências: npm install
```

### **Erro: "Tabela não existe"**

```bash
# Executar schema SQL no Supabase
# Verificar RLS policies
# Confirmar variáveis de ambiente
```

### **Erro: "Hook pode apenas ser usado dentro do provider"**

```bash
# Verificar se componentes estão dentro dos providers necessários
# Confirmar contextos de autenticação
```

---

## 📋 **Comandos Úteis**

### **Deploy Rápido**

```bash
# Script completo de deploy
git add .
git commit -m "feat: enhanced editor implementation"
git push origin main

# Verificar build
npm run build
```

### **Teste Local Completo**

```bash
# Startar ambiente
npm run dev

# Em outra aba, testar APIs
curl http://localhost:3000/api/health

# Testar rotas
open http://localhost:3000/dev/test
```

---

## 🎯 **Checklist Final**

### **Antes do Deploy**

- [ ] Schema SQL executado no Supabase
- [ ] Variáveis de ambiente configuradas
- [ ] Testes de integração passando
- [ ] Build local funcionando

### **Durante o Deploy**

- [ ] Deploy sem erros
- [ ] Rotas acessíveis
- [ ] Funcionalidades básicas testadas
- [ ] Performance aceitável

### **Após o Deploy**

- [ ] Monitoramento ativo
- [ ] Feedback dos usuários
- [ ] Logs sem erros críticos
- [ ] Métricas de uso

---

## 🔗 **URLs de Teste Pós-Deploy**

```bash
# Dashboard principal
https://seu-dominio.com/

# Editor melhorado
https://seu-dominio.com/editor

# Testes de integração
https://seu-dominio.com/dev/test

# Analytics exemplo
https://seu-dominio.com/admin/funis/demo/analytics

# Editor direto
https://seu-dominio.com/enhanced-editor/123
```

---

## 📞 **Suporte**

Em caso de problemas:

1. Verificar logs do browser (F12 → Console)
2. Verificar logs do Supabase
3. Executar testes de integração
4. Consultar documentação dos componentes

**🎉 Sucesso! Seu editor melhorado está pronto para uso!**
