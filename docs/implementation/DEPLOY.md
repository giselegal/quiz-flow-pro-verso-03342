# Guia de Deploy - Quiz Quest

## 🚀 Deploy em Produção

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Ambiente de deploy (Vercel, Netlify, ou servidor próprio)

## 📦 Build do Projeto

### 1. Build Local

```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Testar build localmente
npm run preview
```

### 2. Verificação do Build

```bash
# Estrutura gerada em dist/
dist/
├── assets/
│   ├── index-[hash].js     # Bundle principal
│   ├── index-[hash].css    # Estilos compilados
│   └── ...                 # Assets otimizados
└── index.html              # HTML principal
```

### 3. Otimizações Aplicadas

- ✅ **Tree shaking**: Código não utilizado removido
- ✅ **Minificação**: JavaScript e CSS minificados
- ✅ **Code splitting**: Chunks separados por funcionalidade
- ✅ **Asset optimization**: Imagens e fonts otimizados
- ✅ **Source maps**: Para debugging em produção

## 🌐 Deploy em Diferentes Plataformas

### Vercel (Recomendado)

```bash
# Instalar CLI da Vercel
npm i -g vercel

# Deploy
vercel --prod

# Ou conectar repositório GitHub diretamente
# 1. Acesse vercel.com
# 2. Conecte repositório
# 3. Configure build settings:
#    Build Command: npm run build
#    Output Directory: dist
#    Install Command: npm install
```

### Netlify

```bash
# Build settings no Netlify:
# Build command: npm run build
# Publish directory: dist
# Node version: 18

# Arquivo netlify.toml (opcional)
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## ⚙️ Variáveis de Ambiente

### Configuração para Produção

```env
# .env.production
VITE_ENV=production
VITE_API_URL=https://api.yoursite.com
VITE_CLOUDINARY_URL=https://res.cloudinary.com/your-cloud
VITE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_CDN_URL=https://cdn.yoursite.com
```

### Variáveis Importantes

```typescript
// Configuração no código
const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  cloudinaryUrl: import.meta.env.VITE_CLOUDINARY_URL,
};
```

## 🔧 Configurações de Servidor

### Nginx (Para VPS/Servidor Próprio)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/quiz-quest/dist;
    index index.html;

    # Configuração SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Compressão
    gzip on;
    gzip_types
        text/plain
        text/css
        text/js
        text/xml
        text/javascript
        application/javascript
        application/json
        application/xml+rss;
}
```

### Apache (.htaccess)

```apache
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache assets
<filesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$">
    ExpiresActive on
    ExpiresDefault "access plus 1 year"
</filesMatch>

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

## 📊 Monitoramento e Analytics

### 1. Web Vitals

```typescript
// Configuração de performance
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### 2. Error Tracking

```typescript
// Sentry integration (exemplo)
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});

// Error boundary
<Sentry.ErrorBoundary fallback={ErrorFallback}>
  <App />
</Sentry.ErrorBoundary>
```

### 3. Google Analytics

```typescript
// GA4 integration
import { gtag } from 'ga-gtag';

gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: document.title,
  page_location: window.location.href,
});
```

## 🛡️ Segurança em Produção

### 1. Headers de Segurança

```typescript
// Configuração no servidor
const securityHeaders = {
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
```

### 2. HTTPS e SSL

```bash
# Certbot para SSL gratuito
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 🚦 Checklist de Deploy

### Antes do Deploy

- [ ] ✅ Tests passando: `npm test`
- [ ] ✅ Build sem erros: `npm run build`
- [ ] ✅ Linting ok: `npm run lint`
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Assets otimizados (imagens, fonts)
- [ ] ✅ SEO meta tags configuradas
- [ ] ✅ Favicon e manifest.json

### Durante o Deploy

- [ ] ✅ Build successful
- [ ] ✅ Assets uploading correctly
- [ ] ✅ Environment variables set
- [ ] ✅ Domain/subdomain configured
- [ ] ✅ SSL certificate active

### Após o Deploy

- [ ] ✅ Site carregando corretamente
- [ ] ✅ Todas as rotas funcionando
- [ ] ✅ Editor funcionando (drag & drop)
- [ ] ✅ localStorage funcionando
- [ ] ✅ Responsividade mobile/tablet/desktop
- [ ] ✅ Performance satisfatória (Lighthouse)
- [ ] ✅ Analytics configurado
- [ ] ✅ Error tracking ativo

## 📈 Otimização de Performance

### 1. Bundle Analysis

```bash
# Analisar tamanho do bundle
npm run build -- --analyze

# Ou usar bundle-analyzer
npm install --save-dev webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/assets/*.js
```

### 2. Métricas de Performance

```javascript
// Lighthouse scores esperados
{
  performance: 90+,
  accessibility: 95+,
  bestPractices: 90+,
  seo: 90+
}
```

### 3. CDN e Caching

```typescript
// Configuração de CDN para assets
const cdnUrl = import.meta.env.VITE_CDN_URL;
const assetUrl = (path: string) => `${cdnUrl}${path}`;

// Cache strategies
const cacheStrategies = {
  images: '1 year',
  js: '1 year',
  css: '1 year',
  html: '1 day',
};
```

## 🔄 CI/CD Pipeline

### GitHub Actions Completo

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linting
        run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_CLOUDINARY_URL: ${{ secrets.VITE_CLOUDINARY_URL }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          working-directory: ./
```

---

**Status**: Produção Ready ✅  
**Última atualização**: Janeiro 2025  
**Plataformas suportadas**: Vercel, Netlify, GitHub Pages, VPS
