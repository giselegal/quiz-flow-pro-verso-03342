# 🔐 Configuração Google OAuth - Guia Rápido

## ⚠️ Por que o botão "Continuar com Google" não funciona?

O Google OAuth requer configuração no **Supabase Dashboard** e **Google Cloud Console**. Sem essa configuração, o botão mostrará erro.

---

## 📋 Passo a Passo Completo

### **1. Google Cloud Console (Criar OAuth Client)**

1. Acesse: https://console.cloud.google.com/
2. Crie ou selecione um projeto
3. Menu → **APIs & Services** → **Credentials**
4. Clique em **+ CREATE CREDENTIALS** → **OAuth client ID**
5. Configure a tela de consentimento se solicitado:
   - User Type: **External**
   - App name: `QuizFlowPro` (ou seu nome)
   - Support email: seu email
   - Authorized domains: adicione seu domínio (prod) ou deixe vazio (dev)
6. Application type: **Web application**
7. Name: `QuizFlowPro Auth`
8. **Authorized redirect URIs**, adicione:
   ```
   https://txqljpitotmcxntprxiu.supabase.co/auth/v1/callback
   ```
   *(Substitua `txqljpitotmcxntprxiu` pelo seu Project ID do Supabase)*

9. Clique em **CREATE**
10. **COPIE** o **Client ID** e **Client Secret** (você precisará deles)

---

### **2. Supabase Dashboard (Habilitar Provider)**

1. Acesse: https://supabase.com/dashboard/project/txqljpitotmcxntprxiu
2. Menu lateral → **Authentication** → **Providers**
3. Localize **Google** e clique para expandir
4. **Enable Sign in with Google**: ✅ ON
5. Cole os valores copiados:
   - **Client ID (for OAuth)**: cole o Client ID do Google
   - **Client Secret (for OAuth)**: cole o Client Secret do Google
6. Clique em **Save**

---

### **3. Testar a Integração**

1. Reinicie o servidor de desenvolvimento se necessário:
   ```bash
   npm run dev
   ```

2. Acesse: http://localhost:8080/auth

3. Clique em **"Continuar com Google"**

4. Deve abrir popup/redirect do Google para login

5. Após login, será redirecionado para `/admin`

---

## 🔍 Troubleshooting

### Erro: "Google OAuth não está configurado"
- ✅ Verifique se habilitou o provider no Supabase Dashboard
- ✅ Confirme que Client ID e Secret foram salvos corretamente

### Erro: "redirect_uri_mismatch"
- ✅ Certifique-se que a URI no Google Cloud Console é **exatamente**:
  ```
  https://SEU_PROJECT_ID.supabase.co/auth/v1/callback
  ```

### Erro: "Access blocked: This app's request is invalid"
- ✅ Configure a tela de consentimento OAuth no Google Cloud Console
- ✅ Adicione seu email como usuário de teste (se app em desenvolvimento)

### OAuth funciona mas não redireciona para /admin
- ✅ Verifique o `redirectTo` em `AuthStorageProvider.tsx` (linha ~367)
- ✅ Certifique-se que a URL está correta: `${window.location.origin}/admin`

---

## 🎯 Alternativa: Desabilitar Botão do Google

Se não quiser configurar OAuth agora, pode remover/comentar o botão em `src/pages/AuthPage.tsx`:

```tsx
// Comentar ou remover estas linhas (~217-240):
/*
<div className="relative my-6">...</div>
<Button onClick={handleGoogleLogin}>...</Button>
*/
```

---

## 📚 Documentação Oficial

- [Supabase Google OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)

---

**Status Atual:** OAuth implementado no código ✅ | Configuração do servidor pendente ⏳
