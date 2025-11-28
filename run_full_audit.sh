#!/bin/bash

cd /workspaces/quiz-flow-pro-verso-03342

echo "🚀 EXECUTANDO AUDITORIA COMPLETA DE JSON"
echo "=========================================="
echo ""

# Instalar jq se não estiver disponível
if ! command -v jq &> /dev/null; then
    echo "📦 Instalando jq..."
    apt-get update -qq && apt-get install -y jq -qq
fi

# Criar scripts se não existirem
cat > audit_json_files.sh << 'EOFBASH'
#!/bin/bash

echo "🔍 AUDITORIA COMPLETA DE ARQUIVOS JSON"
echo "======================================"
echo ""

mkdir -p audit_reports

echo "📋 Listando todos os arquivos JSON no projeto..."
find . -name "*.json" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/build/*" -not -path "*/.next/*" > audit_reports/json_files_list.txt

total_files=$(cat audit_reports/json_files_list.txt | wc -l)
echo "Total de arquivos JSON encontrados: $total_files"
echo ""

echo "✅ Validando sintaxe JSON..."
> audit_reports/json_validation.txt

valid_count=0
invalid_count=0

while IFS= read -r file; do
    if [ -f "$file" ]; then
        if jq empty "$file" 2>/dev/null; then
            echo "✅ $file" >> audit_reports/json_validation.txt
            ((valid_count++))
        else
            error=$(jq empty "$file" 2>&1 | head -n 1)
            echo "❌ $file - ERROR: $error" >> audit_reports/json_validation.txt
            ((invalid_count++))
        fi
    fi
done < audit_reports/json_files_list.txt

echo ""
echo "📊 Resumo da validação:"
echo "✅ Válidos: $valid_count"
echo "❌ Inválidos: $invalid_count"
echo ""

echo "📂 CATEGORIZANDO ARQUIVOS JSON"
echo "==============================="
echo ""

echo "=== CONFIGURAÇÃO ===" > audit_reports/config_files.txt
find . \( -name "package.json" -o -name "package-lock.json" -o -name "tsconfig*.json" -o -name "*.config.json" \) -not -path "*/node_modules/*" -not -path "*/.next/*" >> audit_reports/config_files.txt 2>/dev/null
config_count=$(tail -n +2 audit_reports/config_files.txt | wc -l)
echo "Configs: $config_count"

echo "=== DADOS DE QUIZ ===" > audit_reports/quiz_files.txt
find . \( -name "*quiz*.json" -o -name "*question*.json" \) -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/audit_reports/*" >> audit_reports/quiz_files.txt 2>/dev/null
quiz_count=$(tail -n +2 audit_reports/quiz_files.txt | wc -l)
echo "Quiz files: $quiz_count"

echo ""
echo "🔬 ANALISANDO ESTRUTURA DOS ARQUIVOS DE QUIZ"
echo "============================================="
echo ""

quiz_analyzed=0
for file in $(find . -name "*quiz*.json" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/audit_reports/*" | head -10); do
    if [ -f "$file" ]; then
        echo "📄 $file"
        if jq empty "$file" 2>/dev/null; then
            echo "   Versão: $(jq -r '.version // "N/A"' "$file" 2>/dev/null)"
            echo "   Metadata: $(jq 'has("metadata")' "$file" 2>/dev/null)"
            echo "   Sections: $(jq '.sections | length // 0' "$file" 2>/dev/null)"
            ((quiz_analyzed++))
        fi
        echo ""
    fi
done

echo "✅ Fase 1 concluída: $quiz_analyzed quiz analisados"
EOFBASH

chmod +x audit_json_files.sh
./audit_json_files.sh

echo ""
echo "=========================================="
echo "🚀 FASE 2: Análise Profunda"
echo "=========================================="
echo ""

mkdir -p src/scripts

cat > src/scripts/audit-json-deep.ts << 'EOFTS'
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, relative } from 'path';

interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

interface JsonFileAudit {
  path: string;
  category: string;
  isValid: boolean;
  size: number;
  errors: ValidationError[];
  structure?: string[];
  version?: string;
  hasSchema?: boolean;
  recommendations: string[];
}

class DeepJsonAuditor {
  private projectRoot = '/workspaces/quiz-flow-pro-verso-03342';
  private results: JsonFileAudit[] = [];

  private findJsonFiles(dir: string, files: string[] = []): string[] {
    try {
      const items = readdirSync(dir);
      for (const item of items) {
        const fullPath = join(dir, item);
        if (['node_modules', '.git', 'dist', 'build', '.next', 'audit_reports'].includes(item)) continue;
        try {
          const stat = statSync(fullPath);
          if (stat.isDirectory()) this.findJsonFiles(fullPath, files);
          else if (item.endsWith('.json')) files.push(fullPath);
        } catch {}
      }
    } catch {}
    return files;
  }

  private categorize(path: string, content: any): string {
    const lower = path.toLowerCase();
    if (lower.includes('package.json')) return 'CONFIG_NPM';
    if (lower.includes('tsconfig')) return 'CONFIG_TYPESCRIPT';
    if (lower.includes('.config.json')) return 'CONFIG_APP';
    if (lower.includes('quiz')) return 'DATA_QUIZ';
    if (lower.includes('question')) return 'DATA_QUESTION';
    if (lower.includes('core')) return 'DATA_CORE';
    if (lower.includes('schema')) return 'SCHEMA';
    if (content?.version && content?.sections) return 'DATA_QUIZ';
    return 'OTHER';
  }

  private validateQuizV4(content: any): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!content.version) errors.push({ field: 'version', message: 'Campo ausente', severity: 'error' });
    else if (content.version !== '4.0') errors.push({ field: 'version', message: `Versão ${content.version} != 4.0`, severity: 'warning' });
    if (!content.metadata) errors.push({ field: 'metadata', message: 'Objeto ausente', severity: 'error' });
    if (!content.sections || !Array.isArray(content.sections)) errors.push({ field: 'sections', message: 'Array ausente/inválido', severity: 'error' });
    return errors;
  }

  private auditFile(filePath: string): JsonFileAudit | null {
    try {
      const content = JSON.parse(readFileSync(filePath, 'utf-8'));
      const stat = statSync(filePath);
      const category = this.categorize(filePath, content);
      const audit: JsonFileAudit = {
        path: relative(this.projectRoot, filePath),
        category,
        isValid: true,
        size: stat.size,
        errors: [],
        version: content.version,
        hasSchema: !!content.$schema,
        recommendations: [],
        structure: typeof content === 'object' ? Object.keys(content) : [],
      };
      if (category === 'DATA_QUIZ') {
        audit.errors = this.validateQuizV4(content);
        audit.isValid = audit.errors.filter(e => e.severity === 'error').length === 0;
      }
      return audit;
    } catch (error) {
      return {
        path: relative(this.projectRoot, filePath),
        category: 'INVALID',
        isValid: false,
        size: 0,
        errors: [{ field: 'root', message: error instanceof Error ? error.message : 'Erro', severity: 'error' }],
        recommendations: [],
        structure: [],
      };
    }
  }

  public async run(): Promise<void> {
    console.log('🔬 Análise Profunda\n');
    const files = this.findJsonFiles(this.projectRoot);
    console.log(`📋 ${files.length} arquivos\n`);
    for (const file of files) {
      const audit = this.auditFile(file);
      if (audit) {
        this.results.push(audit);
        const icon = audit.isValid ? '✅' : '❌';
        const shortPath = audit.path.length > 50 ? '...' + audit.path.slice(-47) : audit.path;
        console.log(`${icon} ${shortPath}`);
      }
    }
    this.generateReports();
  }

  private generateReports(): void {
    const outputDir = join(this.projectRoot, 'audit_reports');
    if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
    writeFileSync(join(outputDir, 'deep_audit.json'), JSON.stringify(this.results, null, 2));
    this.generateMarkdown(outputDir);
    console.log(`\n✅ Análise concluída!`);
    console.log(`📊 Total: ${this.results.length} | Válidos: ${this.results.filter(r => r.isValid).length}`);
    const quizFiles = this.results.filter(r => r.category === 'DATA_QUIZ');
    console.log(`🎯 Quiz: ${quizFiles.length} | V4: ${quizFiles.filter(r => r.version === '4.0').length}`);
  }

  private generateMarkdown(outputDir: string): void {
    let md = '# 📊 Auditoria JSON - Quiz Flow Pro\n\n';
    md += `**Data:** ${new Date().toLocaleString('pt-BR')}\n\n`;
    
    const byCategory: Record<string, JsonFileAudit[]> = {};
    for (const result of this.results) {
      if (!byCategory[result.category]) byCategory[result.category] = [];
      byCategory[result.category].push(result);
    }

    md += '## 📂 Resumo por Categoria\n\n| Categoria | Total | ✅ | ❌ |\n|-----------|-------|----|----|';
    for (const [cat, files] of Object.entries(byCategory)) {
      const valid = files.filter(f => f.isValid).length;
      md += `\n| ${cat} | ${files.length} | ${valid} | ${files.length - valid} |`;
    }

    md += '\n\n## 🎯 Arquivos de Quiz\n\n';
    const quizFiles = this.results.filter(r => r.category === 'DATA_QUIZ');
    if (quizFiles.length === 0) {
      md += '_Nenhum arquivo encontrado._\n';
    } else {
      for (const quiz of quizFiles) {
        const status = quiz.isValid ? '✅' : '❌';
        md += `### ${status} \`${quiz.path}\`\n\n`;
        md += `- **Versão:** ${quiz.version || 'N/A'}\n`;
        md += `- **Tamanho:** ${(quiz.size / 1024).toFixed(2)} KB\n`;
        md += `- **Schema:** ${quiz.hasSchema ? '✅' : '❌'}\n`;
        if (quiz.errors.length > 0) {
          md += `\n**Problemas:**\n`;
          for (const err of quiz.errors) {
            md += `- ${err.severity === 'error' ? '🔴' : '🟡'} \`${err.field}\`: ${err.message}\n`;
          }
        }
        md += '\n';
      }
    }

    md += '\n## ❌ Arquivos Inválidos\n\n';
    const invalid = this.results.filter(r => !r.isValid);
    if (invalid.length === 0) {
      md += '✅ **Todos válidos!**\n';
    } else {
      for (const file of invalid) {
        md += `- \`${file.path}\`: ${file.errors[0]?.message}\n`;
      }
    }

    writeFileSync(join(outputDir, 'DEEP_AUDIT_REPORT.md'), md);
  }
}

const auditor = new DeepJsonAuditor();
auditor.run().catch(console.error);
EOFTS

npx tsx src/scripts/audit-json-deep.ts

echo ""
echo "📄 RELATÓRIO:"
echo "=========================================="
cat audit_reports/DEEP_AUDIT_REPORT.md

echo ""
echo "✅ AUDITORIA FINALIZADA!"
echo "📁 Relatórios em: audit_reports/"
ls -lh audit_reports/
