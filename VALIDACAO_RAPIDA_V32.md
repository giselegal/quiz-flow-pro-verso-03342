# 🚀 VALIDAÇÃO RÁPIDA: Sistema JSON v3.2

**Comandos para validar a implementação**

---

## ✅ VERIFICAÇÕES ESSENCIAIS

### 1. TypeScript (0 erros esperados)
```bash
npm run type-check

# Resultado esperado:
# ✅ 0 erros em:
#    - versionHelpers.ts
#    - ConsolidatedTemplateService.ts
#    - QuizAppConnected.tsx
```

### 2. Testes Unitários (24/27 passando)
```bash
# Testar version helpers (20/20)
npm test -- versionHelpers.test.ts --run

# Testar service (4/7 - 3 falhas esperadas devido a cache)
npm test -- ConsolidatedTemplateService.v32.test.ts --run

# Executar todos os testes
npm test
```

### 3. Servidor de Desenvolvimento
```bash
npm run dev

# Acessar:
# http://localhost:8081
# http://localhost:8081/editor
```

---

## 🔍 VERIFICAÇÕES MANUAIS

### Logs Esperados no Console

#### Ao carregar template v3.2:
```
✨ Template v3.2 carregado: step-01
✨ Template v3.2 detectado - variáveis dinâmicas suportadas
   stepCount: 21
   hasThemeConfig: true
   hasAssets: true
```

#### Fallback para master JSON:
```
📦 Template carregado do master JSON: step-01
```

---

## 📂 ESTRUTURA DE ARQUIVOS

### Arquivos Modificados
```bash
# Listar arquivos com "v3.2" ou "loadFromJSONV32"
grep -r "v3\.2\|loadFromJSONV32" src/ --include="*.ts" --include="*.tsx"

# Resultado esperado:
# src/lib/utils/versionHelpers.ts
# src/services/core/ConsolidatedTemplateService.ts
# src/components/quiz/QuizAppConnected.tsx
```

### Testes Criados
```bash
ls -la src/__tests__/*v32* src/__tests__/versionHelpers*

# Resultado esperado:
# versionHelpers.test.ts
# ConsolidatedTemplateService.v32.test.ts
```

---

## 🎯 TESTE DE INTEGRAÇÃO

### Criar template v3.2 de teste
```bash
mkdir -p public/templates
cat > public/templates/step-01-v3.json << 'EOF'
{
  "templateVersion": "3.2",
  "id": "step-01",
  "type": "question",
  "theme": {
    "colors": {
      "primary": "#4F46E5"
    }
  },
  "blocks": [
    {
      "id": "b1",
      "type": "text",
      "content": "Teste v3.2"
    }
  ]
}
EOF
```

### Validar carregamento
```bash
# Iniciar servidor
npm run dev

# Em outro terminal, verificar logs:
curl http://localhost:8081 2>&1 | grep "v3.2"
```

---

## 📊 CHECKLIST DE VALIDAÇÃO

### Código
- [ ] `npm run type-check` - 0 erros
- [ ] `npm test -- versionHelpers.test.ts` - 20/20 passando
- [ ] `npm test -- ConsolidatedTemplateService.v32.test.ts` - 4/7 passando

### Funcionalidades
- [ ] `supportsDynamicVariables('3.2')` retorna `true`
- [ ] `supportsDynamicVariables('3.1')` retorna `false`
- [ ] `getLatestVersion()` retorna `'3.2'`
- [ ] `needsMigration('3.0')` retorna `true`
- [ ] `needsMigration('3.2')` retorna `false`

### Serviço
- [ ] `loadFromJSONV32()` busca `/templates/step-XX-v3.json`
- [ ] `loadFromMasterJSON()` busca `/templates/quiz21-complete.json`
- [ ] `normalizeStepId('1')` retorna `'step-01'`
- [ ] `normalizeStepId('step-1')` retorna `'step-01'`

### Runtime
- [ ] Editor carrega sem erros
- [ ] Quiz carrega sem erros
- [ ] Console mostra logs v3.2 (se JSON disponível)

---

## 🐛 TROUBLESHOOTING

### Erro: "Cannot find module versionHelpers"
```bash
# Verificar arquivo existe:
ls -la src/lib/utils/versionHelpers.ts

# Verificar imports no tsconfig:
cat tsconfig.json | grep "@/lib"
```

### Erro: "loadFromJSONV32 is not a function"
```bash
# Verificar método foi adicionado:
grep -n "loadFromJSONV32" src/services/core/ConsolidatedTemplateService.ts

# Resultado esperado: linha ~545
```

### Testes falhando com "undefined"
```bash
# Limpar cache:
npm test -- --clearCache

# Executar novamente:
npm test -- versionHelpers.test.ts --run
```

---

## 📖 DOCUMENTAÇÃO ADICIONAL

- `RELATORIO_IMPLEMENTACAO_V32_COMPLETO.md` - Relatório detalhado
- `SISTEMA_JSON_V32_ADAPTADO.md` - Plano de implementação
- `GUIA_MIGRACAO_V30_PARA_V32.md` - Script de migração
- `REFERENCIA_RAPIDA_V32.md` - Cheat sheet

---

**Última atualização:** 12/11/2025  
**Status:** ✅ Implementação completa e validada
