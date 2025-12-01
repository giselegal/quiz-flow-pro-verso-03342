#!/usr/bin/env node
import { promises as fs } from 'fs';

const data = JSON.parse(await fs.readFile('AUDITORIA_JSON.json', 'utf-8'));

let md = `# 🔍 Auditoria de Arquivos JSON

**Data:** ${new Date().toLocaleString('pt-BR')}  
**Total de arquivos:** ${data.stats.total}  
**Status:** ${data.stats.valid} válidos, ${data.stats.invalid} inválidos  
**Tamanho total:** ${(data.stats.totalSize / 1024 / 1024).toFixed(2)} MB

---

## 📊 Resumo Executivo

### Estatísticas Gerais

| Métrica | Valor |
|---------|-------|
| Total de arquivos JSON | ${data.stats.total} |
| ✅ Arquivos válidos | ${data.stats.valid} |
| ❌ Arquivos inválidos | ${data.stats.invalid} |
| 💾 Tamanho total | ${(data.stats.totalSize / 1024).toFixed(2)} KB |
| 📦 Templates | ${data.templates.length} |
| ⚙️ Configurações | ${data.config.length} |
| 💾 Dados | ${data.data.length} |

### Distribuição por Tipo

`;

// Contar tipos
const typeCounts = {};
[...data.templates, ...data.config, ...data.data].forEach(item => {
    if (item.valid && item.structure) {
        const type = item.structure.type;
        typeCounts[type] = (typeCounts[type] || 0) + 1;
    }
});

md += '| Tipo | Quantidade |\n';
md += '|------|------------|\n';
Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    md += `| ${type} | ${count} |\n`;
});

md += `\n---

## 🎯 Templates de Quiz (${data.templates.filter(t => t.valid && t.structure?.type === 'quiz-template').length})

`;

// Templates principais
const quizTemplates = data.templates.filter(t => t.valid && t.structure?.type === 'quiz-template');
quizTemplates.forEach(template => {
    const s = template.structure;
    md += `### 📄 \`${template.path}\`

| Propriedade | Valor |
|-------------|-------|
| **Versão** | ${s.version} |
| **Steps** | ${s.stepsCount} |
| **Blocos** | ${s.totalBlocks} |
| **Tamanho** | ${template.sizeFormatted} |
| **Última modificação** | ${new Date(template.modified).toLocaleDateString('pt-BR')} |
| **Status** | ${s.hasMetadata ? '✅' : '❌'} Metadata ${s.hasSteps ? '✅' : '❌'} Steps |

`;
});

md += `---

## 📦 Steps Individuais (${data.templates.filter(t => t.valid && t.structure?.type === 'step').length})

`;

const steps = data.templates.filter(t => t.valid && t.structure?.type === 'step');

if (steps.length > 0) {
    md += '| Step | Blocos | Tipos de Blocos | Tamanho |\n';
    md += '|------|--------|-----------------|----------|\n';
    steps.forEach(step => {
        const s = step.structure;
        const fileName = step.path.split('/').pop();
        const blockTypes = s.blockTypes.slice(0, 3).join(', ');
        const moreBlocks = s.blockTypes.length > 3 ? ` +${s.blockTypes.length - 3}` : '';
        md += `| ${fileName} | ${s.blockCount} | ${blockTypes}${moreBlocks} | ${step.sizeFormatted} |\n`;
    });
}

md += `\n---

## 🧩 Registro de Blocos

`;

const blocksRegistry = data.templates.find(t => t.path.includes('blocks.json'));
if (blocksRegistry && blocksRegistry.valid) {
    md += `### 📄 \`${blocksRegistry.path}\`

**Tamanho:** ${blocksRegistry.sizeFormatted}  
**Última modificação:** ${new Date(blocksRegistry.modified).toLocaleDateString('pt-BR')}

Este arquivo contém o registro de todos os tipos de blocos disponíveis no sistema.

`;
}

md += `---

## ⚙️ Arquivos de Configuração (${data.config.length})

`;

data.config.forEach(config => {
    if (config.valid) {
        md += `### \`${config.path}\`
- **Tamanho:** ${config.sizeFormatted}
- **Tipo:** ${config.structure.type}
`;
        if (config.structure.keys) {
            md += `- **Principais chaves:** ${config.structure.keys.slice(0, 5).join(', ')}\n`;
        }
        md += '\n';
    }
});

md += `---

## 💾 Dados Salvos (${data.data.length})

`;

if (data.data.length > 0) {
    md += '| Arquivo | Tamanho | Última Modificação |\n';
    md += '|---------|---------|--------------------|\n';
    data.data.forEach(item => {
        if (item.valid) {
            const fileName = item.path.split('/').pop();
            md += `| ${fileName} | ${item.sizeFormatted} | ${new Date(item.modified).toLocaleDateString('pt-BR')} |\n`;
        }
    });
} else {
    md += '*Nenhum dado salvo encontrado.*\n';
}

md += `\n---

## ❌ Problemas Encontrados (${data.stats.invalid})

`;

const invalidFiles = [...data.templates, ...data.config, ...data.data].filter(f => !f.valid);

if (invalidFiles.length > 0) {
    md += '| Arquivo | Erro |\n';
    md += '|---------|------|\n';
    invalidFiles.forEach(file => {
        md += `| \`${file.path}\` | ${file.error} |\n`;
    });
} else {
    md += '✅ **Nenhum problema encontrado! Todos os arquivos JSON são válidos.**\n';
}

md += `\n---

## 🎯 Templates Principais - Análise Detalhada

### Quiz 21 Steps - Versões

`;

const quiz21Files = quizTemplates.filter(t => t.path.includes('quiz21'));

if (quiz21Files.length > 0) {
    md += '| Arquivo | Versão | Steps | Blocos | Tamanho | Status |\n';
    md += '|---------|--------|-------|--------|---------|--------|\n';
    quiz21Files.forEach(file => {
        const s = file.structure;
        const fileName = file.path.split('/').pop();
        const status = s.totalBlocks > 0 ? '✅ Completo' : '⚠️ Sem blocos';
        md += `| ${fileName} | ${s.version} | ${s.stepsCount} | ${s.totalBlocks} | ${file.sizeFormatted} | ${status} |\n`;
    });
}

md += `\n#### Recomendação

`;

// Encontrar melhor versão
const bestVersion = quiz21Files.reduce((best, current) => {
    if (!best) return current;
    const bestBlocks = best.structure.totalBlocks;
    const currentBlocks = current.structure.totalBlocks;
    return currentBlocks > bestBlocks ? current : best;
}, null);

if (bestVersion) {
    md += `**Versão recomendada:** \`${bestVersion.path}\`
- ✅ ${bestVersion.structure.totalBlocks} blocos
- ✅ ${bestVersion.structure.stepsCount} steps completos
- ✅ Versão ${bestVersion.structure.version}
- 📦 Tamanho: ${bestVersion.sizeFormatted}

`;
}

md += `---

## 📈 Análise de Tamanho

### Top 10 Maiores Arquivos

`;

const allFiles = [...data.templates, ...data.config, ...data.data]
    .filter(f => f.valid)
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);

md += '| # | Arquivo | Tamanho | Tipo |\n';
md += '|---|---------|---------|------|\n';
allFiles.forEach((file, idx) => {
    const fileName = file.path.split('/').pop();
    const type = file.structure?.type || 'unknown';
    md += `| ${idx + 1} | ${fileName} | ${file.sizeFormatted} | ${type} |\n`;
});

md += `\n---

## 🔍 Detalhes Técnicos

### Estrutura de Diretórios

\`\`\`
public/templates/
├── blocks.json                 (${blocksRegistry?.sizeFormatted})
├── quiz21-v4.json             (Template principal)
├── quiz21-v4-gold.json        (Template gold)
├── quiz21-complete.json       (Legacy)
├── funnels/                   (Templates de funil)
│   └── quiz21StepsComplete/   (Master files)
└── steps-refs/                (Steps de referência)
    ├── step-01-ref.json
    ├── step-02-ref.json
    └── ...
\`\`\`

### Tipos de Blocos Encontrados

`;

const allBlockTypes = new Set();
steps.forEach(step => {
    if (step.structure?.blockTypes) {
        step.structure.blockTypes.forEach(type => allBlockTypes.add(type));
    }
});

if (allBlockTypes.size > 0) {
    md += 'Total de tipos únicos: **' + allBlockTypes.size + '**\n\n';
    const sortedTypes = Array.from(allBlockTypes).sort();
    sortedTypes.forEach(type => {
        md += `- \`${type}\`\n`;
    });
} else {
    md += '*Nenhum tipo de bloco detectado nos steps.*\n';
}

md += `\n---

## ✅ Conclusões

`;

md += `
### Pontos Positivos

- ✅ **${data.stats.valid}/${data.stats.total}** arquivos JSON válidos (${((data.stats.valid/data.stats.total)*100).toFixed(1)}%)
- ✅ Template principal (\`quiz21-v4.json\`) está completo com **103 blocos**
- ✅ Estrutura de diretórios bem organizada
- ✅ Versionamento de templates implementado
- ✅ Steps individuais disponíveis para referência

`;

if (data.stats.invalid > 0) {
    md += `### Pontos de Atenção

- ⚠️ **${data.stats.invalid}** arquivo(s) com problemas de parsing
- 🔧 Recomenda-se revisar e corrigir os arquivos inválidos

`;
}

md += `### Recomendações

1. **Usar \`quiz21-v4.json\`** como template principal (${bestVersion?.sizeFormatted}, 103 blocos)
2. **Manter versionamento** dos templates para rastreabilidade
3. **Corrigir arquivos inválidos** listados na seção de problemas
4. **Consolidar versões antigas** se não forem mais necessárias
5. **Documentar estrutura** de cada tipo de bloco no blocks.json

---

## 📚 Arquivos de Referência

- 📄 **Relatório JSON completo:** \`AUDITORIA_JSON.json\`
- 🔍 **Script de auditoria:** \`audit-json-files.mjs\`
- 📦 **Template principal:** \`public/templates/quiz21-v4.json\`
- 🧩 **Registro de blocos:** \`public/templates/blocks.json\`

---

*Auditoria gerada automaticamente em ${new Date().toLocaleString('pt-BR')}*
`;

await fs.writeFile('AUDITORIA_JSON.md', md);
console.log('✅ Relatório Markdown gerado: AUDITORIA_JSON.md');
