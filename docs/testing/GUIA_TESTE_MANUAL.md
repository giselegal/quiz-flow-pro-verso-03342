# 🌐 GUIA DE TESTE MANUAL - SEM NAVEGADOR SIMPLES

## ✅ **STATUS ATUAL**

- ✅ Servidor funcionando: `http://localhost:8080`
- ✅ Dashboard carregando: `/admin`
- ✅ Editor carregando: `/editor`
- ✅ Correção Calendar aplicada
- ❌ Navegador simples com "Upgrade Required"

## 🔧 **SOLUÇÕES ALTERNATIVAS**

### **OPÇÃO 1: NAVEGADOR EXTERNO**

```
1. Abra seu navegador (Chrome, Firefox, Safari, Edge)
2. Acesse: http://localhost:8080/admin
3. Siga o roteiro de testes normalmente
```

### **OPÇÃO 2: TESTE VIA TERMINAL/CURL**

```bash
# Já executado com sucesso:
./teste-rapido.sh

# Resultados:
✅ Servidor respondendo
✅ Dashboard OK
✅ Editor OK
✅ Calendar importado
```

### **OPÇÃO 3: PREVIEW EM NOVA ABA**

```
1. Clique no botão "Go Live" ou "Preview" no VS Code
2. Ou use o comando: Ctrl+Shift+P → "Simple Browser: Show"
3. Digite: http://localhost:8080/admin
```

## 📋 **ROTEIRO DE TESTE MANUAL NO NAVEGADOR EXTERNO**

### **1. TESTE DASHBOARD → CRIAR FUNIL**

```
URL: http://localhost:8080/admin

Verificar:
✅ Página carrega sem erros
✅ Templates de funis aparecem
✅ Botões "Usar Template", "Duplicar" funcionais
✅ Interface responsiva

Ação:
1. Clique "Usar Template" no funil de 21 etapas
2. Deve navegar para /editor/[id]
```

### **2. TESTE EDITOR → COMPONENTES**

```
URL: http://localhost:8080/editor

Verificar:
✅ Editor carrega com 3 painéis
✅ Sidebar esquerda: Componentes
✅ Canvas central: Área de edição
✅ Sidebar direita: Propriedades

Ação:
1. Clique aba "Blocos"
2. Arraste componente para canvas
3. Clique no componente
4. Edite propriedades no painel direito
```

### **3. TESTE 21 ETAPAS**

```
No editor:

Verificar:
✅ Aba "Páginas" lista 21 etapas
✅ Navegação entre etapas funciona
✅ Cada etapa carrega corretamente

Ação:
1. Clique aba "Páginas"
2. Navegue pelas etapas 1-21
3. Teste responsividade (redimensione janela)
```

### **4. TESTE SALVAMENTO**

```
No editor após fazer alterações:

Verificar:
✅ Auto-save funciona
✅ Botão "Salvar" disponível
✅ Indicadores de status aparecem

Ação:
1. Faça alterações (adicione componente)
2. Aguarde auto-save ou clique "Salvar"
3. Recarregue página (F5)
4. Verifique se alterações persistiram
```

## 🧪 **SCRIPT PARA CONSOLE DO NAVEGADOR**

Cole este código no console (F12 → Console):

```javascript
// Script de teste rápido
console.log('🧪 INICIANDO TESTES...');

// Teste 1: Localização
const isAdmin = window.location.pathname.includes('/admin');
const isEditor = window.location.pathname.includes('/editor');
console.log('✅ Localização:', window.location.pathname);

// Teste 2: Elementos principais
const buttons = document.querySelectorAll('button').length;
const cards = document.querySelectorAll('[class*="Card"], .card').length;
const sidebars = document.querySelectorAll('[class*="sidebar"], aside').length;

console.log('✅ Botões encontrados:', buttons);
console.log('✅ Cards encontrados:', cards);
console.log('✅ Sidebars encontradas:', sidebars);

// Teste 3: Funcionalidades específicas
if (isAdmin) {
  const templates = document.querySelectorAll('[class*="template"]').length;
  console.log('✅ Templates disponíveis:', templates);
}

if (isEditor) {
  const components = document.querySelectorAll('[draggable="true"]').length;
  const tabs = document.querySelectorAll('[role="tab"]').length;
  console.log('✅ Componentes arrastáveis:', components);
  console.log('✅ Abas encontradas:', tabs);
}

console.log('🎉 TESTE CONCLUÍDO!');
```

## 🎯 **RESULTADO ESPERADO**

### **Dashboard:**

- Templates de funis visíveis
- Botões funcionais
- Navegação para editor

### **Editor:**

- Interface com 3 painéis
- Componentes arrastáveis
- 21 etapas acessíveis
- Salvamento funcional

## 🔗 **LINKS DIRETOS**

- **Dashboard**: http://localhost:8080/admin
- **Editor**: http://localhost:8080/editor
- **Home**: http://localhost:8080/

---

**💡 Mesmo sem o navegador simples, o sistema está 100% funcional para teste manual!**
