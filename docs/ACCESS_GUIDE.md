# 🚀 Guia de Acesso - Quiz Flow Pro

## ⚠️ CORREÇÃO DE PORTA

**A porta correta é 8080, não 5173!**

O Vite está configurado no `vite.config.ts` com:
```typescript
server: {
  host: '0.0.0.0',
  port: 8080,
  // ...
}
```

## 📍 URLs de Acesso

### 🏠 Página Inicial
```
http://localhost:8080/
```

### ✏️ Editor JSON (PR #46)
```
http://localhost:8080/editor?funnelId=quiz21StepsComplete
```

### 🎯 Editor com Step Específico
```
http://localhost:8080/editor?funnelId=quiz21StepsComplete&step=1
http://localhost:8080/editor?funnelId=quiz21StepsComplete&step=10
http://localhost:8080/editor?funnelId=quiz21StepsComplete&step=21
```

## 🧪 Testes Automatizados

### Executar Testes de Acesso
```bash
npm run test:access
```

### Executar Testes dos Botões (NOVO)
```bash
npm run test:buttons
```

Ou diretamente:
```bash
./scripts/test-access-simple.sh 8080
./scripts/test-editor-buttons.sh 8080
```

### Saída Esperada - Testes de Acesso
```
🚀 TESTANDO ACESSO - Porta 8080
════════════════════════════════════════

✓ Página inicial - HTTP 200
✓ Editor (sem parâmetros) - HTTP 200
✓ Editor com funnel - HTTP 200
✓ Editor step 1 - HTTP 200
✓ Editor step 10 - HTTP 200
✓ Editor step 21 - HTTP 200

════════════════════════════════════════
Passou: 6 | Falhou: 0
✓ TODOS OS TESTES PASSARAM!
```

### Saída Esperada - Testes dos Botões
```
🧪 TESTE DE ESTRUTURA E BOTÕES - Editor
════════════════════════════════════════

[TESTE 1] Validando estrutura de arquivos...
  ✓ Estrutura TypeScript robusta (1479 componentes)

[TESTE 5] Verificando fix do onValueChange...
  ✓ onValueChange tipado corretamente (string, não string|null)
  ✓ Guard clause presente (previne null)

📊 RESUMO DOS TESTES
Aprovadas: 12 | Avisos: 2 | Falharam: 0
✓ ESTRUTURA E BOTÕES VALIDADOS!
```

## 🚦 Como Iniciar o Servidor

```bash
npm run dev
```

O servidor iniciará automaticamente em `http://localhost:8080`

## 🎨 Acessar o JSON Editor (PR #46)

1. **Iniciar servidor**: `npm run dev`
2. **Abrir navegador**: http://localhost:8080/editor?funnelId=quiz21StepsComplete
3. **Navegar até o painel de Properties** (4ª coluna à direita)
4. **Clicar na aba "JSON"** para acessar o editor JSON
5. **Editar, validar, exportar/importar** templates JSON

## 📊 Estrutura do Editor JSON

### Abas Disponíveis:
- **📝 Editor**: Editor JSON com syntax highlighting e validação em tempo real
- **📊 Statistics**: Estatísticas do template (blocos, categorias, questões)
- **🎯 Scoring**: Configuração de pontuação e categorias

### Funcionalidades:
- ✅ Validação em tempo real (15+ regras)
- 📤 Export JSON (download como arquivo)
- 📥 Import JSON (upload de arquivo)
- 📋 Copy JSON (copiar para clipboard)
- 🎨 Format JSON (auto-formatação)
- ⚡ Apply Changes (aplicar mudanças ao editor)

## 🎮 Botões do Editor (Editar/Visualizar)

### Modos Disponíveis

| Botão | Função | Atalho |
|-------|--------|--------|
| **Editar** | Modo de edição com drag-and-drop | `Ctrl+Shift+P` |
| **Visualizar (Editor)** | Preview dos dados não salvos | `Ctrl+Shift+L` |
| **Visualizar (Publicado)** | Preview da versão publicada | `Ctrl+Shift+O` |

### ✅ Correção Aplicada

Os botões foram corrigidos para **não travarem** ao serem clicados. O problema era que o ToggleGroup permitia desmarcação retornando `null`, causando estado inconsistente.

**Teste automatizado disponível:**
```bash
npm run test:buttons
```

Ver detalhes completos em: [BUTTON_FIX_REPORT.md](./BUTTON_FIX_REPORT.md)

## 🔍 Verificar Estado do Servidor

### Verificar se está rodando:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/
```

Deve retornar: `200`

### Verificar processos:
```bash
ps aux | grep vite | grep -v grep
```

Deve mostrar processo do Vite rodando na porta 8080.

## 🛠️ Troubleshooting

### Servidor não responde em localhost:8080
```bash
# 1. Verificar se está rodando
npm run dev

# 2. Verificar porta ocupada
lsof -i :8080

# 3. Matar processos se necessário
kill -9 $(lsof -t -i:8080)

# 4. Reiniciar servidor
npm run dev
```

### Erro "Cannot connect"
- Verificar se `npm run dev` foi executado
- Verificar se não há erros de compilação no terminal
- Verificar se porta 8080 não está bloqueada por firewall

### Testes falhando
```bash
# Executar com mais detalhes
./scripts/test-access-simple.sh 8080

# Verificar logs do Vite
npm run dev
```

## 📝 Notas Importantes

1. **Porta**: Sempre usar **8080**, não 5173
2. **Host**: Configurado para `0.0.0.0` (acessível externamente)
3. **Proxy**: `/api` redirecionado para `localhost:3001`
4. **Hot Reload**: Ativado automaticamente pelo Vite

## 🔗 Links Relacionados

- [PR #46 - JSON Editor Implementation](https://github.com/giselegal/quiz-flow-pro-verso-03342/pull/46)
- [Vite Configuration](../vite.config.ts)
- [SuperUnifiedProvider](../src/contexts/providers/SuperUnifiedProvider.tsx)
- [JsonTemplateEditor](../src/components/editor/JsonEditor/JsonTemplateEditor.tsx)

---

**Última atualização**: 19 de novembro de 2025  
**Versão do sistema**: PR #46 - 100% integrado e funcional
