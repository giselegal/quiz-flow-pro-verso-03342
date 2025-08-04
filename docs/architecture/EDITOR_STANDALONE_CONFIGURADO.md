# Editor Standalone - Fora do Layout Dashboard

## ✅ Configuração Atual

### 🎯 Acesso ao Editor

- **URL**: http://localhost:8080/editor
- **Rota específica**: http://localhost:8080/editor/:id (para editar funnel específico)
- **Layout**: Independente do dashboard, tela cheia

### 🔙 Botão Voltar ao Dashboard

O editor já possui um botão "Dashboard" no canto superior esquerdo que:

- **Ícone**: ArrowLeft (seta para esquerda)
- **Texto**: "Dashboard" (visível em telas maiores)
- **Função**: Redireciona para `/admin/funis`
- **Localização**: Header do editor, lado esquerdo

### 🖥️ Servidores Necessários

#### Frontend (Vite)

```bash
npm run dev
# Roda na porta 8080
```

#### Backend (Express + Supabase)

```bash
npm run dev:server
# Roda na porta 3001
```

### 📱 Features do Editor Standalone

#### Interface Completa

- ✅ Header com botão voltar ao dashboard
- ✅ Barra lateral de componentes (arrastar e soltar)
- ✅ Canvas principal para edição
- ✅ Painel de propriedades dinâmicas
- ✅ Controles de dispositivo (mobile, tablet, desktop)
- ✅ Botões de salvar e prévia

#### Funcionalidades

- ✅ Arrastar e soltar componentes
- ✅ Edição de propriedades em tempo real
- ✅ Visualização responsiva
- ✅ Salvar automaticamente
- ✅ Undo/Redo
- ✅ Conexão com Supabase para persistência

## 🚀 Como Usar

### 1. Iniciar Servidores

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

### 2. Acessar Editor

- **Novo Funil**: http://localhost:8080/editor
- **Editar Existente**: http://localhost:8080/editor/[id-do-funil]

### 3. Voltar ao Dashboard

- Clique no botão "Dashboard" (←) no canto superior esquerdo
- Ou navegue para: http://localhost:8080/admin

## 🎨 Interface do Editor

```
┌─────────────────────────────────────────────────────────┐
│ ← Dashboard | Funil Name [Badge] | Mobile 📱 💾 👁        │
├─────────────────────────────────────────────────────────┤
│ [Sidebar]  │           Canvas Principal                   │
│ - Textos   │  ┌─────────────────────────────────────┐    │
│ - Botões   │  │                                     │    │
│ - Imagens  │  │        Área de Edição               │    │
│ - Forms    │  │     (Arrastar componentes aqui)     │    │
│            │  │                                     │    │
│            │  └─────────────────────────────────────┘    │
│            │                                      [Props]│
└─────────────────────────────────────────────────────────┘
```

## 🔧 Configuração Técnica

### Roteamento (App.tsx)

```tsx
// Rota independente do dashboard
<Route path="/editor" component={SchemaDrivenEditorPage} />
<Route path="/editor/:id" component={SchemaDrivenEditorPage} />
```

### Layout (SchemaDrivenEditorPage.tsx)

```tsx
// Container de tela cheia
<div className="h-screen w-screen overflow-hidden bg-gray-50">
  <SchemaDrivenEditorResponsive funnelId={funnelId} />
</div>
```

### Botão Voltar (SchemaDrivenEditorResponsive.tsx)

```tsx
<Button onClick={handleBackToDashboard}>
  <ArrowLeft className="w-4 h-4" />
  <span>Dashboard</span>
</Button>
```

## ✅ Status

- 🟢 **Frontend**: Rodando na porta 8080
- 🟢 **Backend**: Rodando na porta 3001
- 🟢 **Supabase**: Conectado e funcionando
- 🟢 **Editor**: Disponível em modo standalone
- 🟢 **Botão Voltar**: Implementado e funcional

O editor já está configurado para funcionar fora do layout do dashboard com botão de retorno!
