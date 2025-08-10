#!/bin/bash

# 🔧 SCRIPT: CORREÇÃO AUTOMÁTICA DE IDS EM TODAS AS STEPS
# Adiciona IDs únicos seguindo o padrão: step{XX}-{component}-{name}

echo "🚀 INICIANDO CORREÇÃO AUTOMÁTICA DE IDS..."

# Função para corrigir Step02
fix_step02() {
    echo "🔧 Corrigindo Step02Template.tsx..."
    
    # Buscar e substituir blocos sem ID
    sed -i 's|    {$|    {\n      id: "step02-header-logo",|1' src/components/steps/Step02Template.tsx
    sed -i '/type: "quiz-intro-header",/,/},/{
        /id: "step02-header-logo",/!{
            /    {$/a\      id: "step02-header-logo",
        }
    }' src/components/steps/Step02Template.tsx
    
    echo "✅ Step02 corrigida!"
}

# Função genérica para corrigir uma step
fix_step_generic() {
    local step_num=$1
    local file="src/components/steps/Step${step_num}Template.tsx"
    
    echo "🔧 Corrigindo Step${step_num}Template.tsx..."
    
    if [[ ! -f "$file" ]]; then
        echo "❌ Arquivo não encontrado: $file"
        return 1
    fi
    
    # Backup do arquivo original
    cp "$file" "${file}.backup"
    
    # Usar sed para adicionar IDs onde não existem
    python3 - << EOF
import re
import sys

def fix_step_file(filename, step_num):
    with open(filename, 'r') as f:
        content = f.read()
    
    # Padrão para encontrar blocos sem ID
    pattern = r'(\s+){\s*\n(\s+)type: "([^"]+)",'
    
    def replace_block(match):
        indent = match.group(1)
        type_indent = match.group(2)
        block_type = match.group(3)
        
        # Gerar ID baseado no tipo e step
        type_map = {
            'quiz-intro-header': 'header-logo',
            'decorative-bar': 'decorative-bar',
            'heading': 'question-title',
            'text': 'text-content',
            'image': 'question-image',
            'options-grid': 'options-grid',
            'button': 'action-button',
            'form-input': 'form-input',
            'legal-notice': 'legal-notice',
            'result-header': 'result-header',
            'result-card': 'result-card'
        }
        
        # Gerar nome único para o componente
        component_name = type_map.get(block_type, block_type.replace('-', '_'))
        block_id = f"step{step_num:02d}-{component_name}"
        
        return f'{indent}{{\n{type_indent}id: "{block_id}",\n{type_indent}type: "{block_type}",'
    
    # Aplicar substituições apenas onde não há ID
    lines = content.split('\n')
    new_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Verificar se é início de bloco
        if re.search(r'^\s+{$', line) and i + 1 < len(lines):
            next_line = lines[i + 1]
            
            # Se a próxima linha é type: e não há id: nas próximas 3 linhas
            if re.search(r'^\s+type: "[^"]+"', next_line):
                has_id = False
                for j in range(i + 1, min(i + 4, len(lines))):
                    if 'id:' in lines[j]:
                        has_id = True
                        break
                
                if not has_id:
                    # Extrair tipo e adicionar ID
                    type_match = re.search(r'type: "([^"]+)"', next_line)
                    if type_match:
                        block_type = type_match.group(1)
                        indent = re.match(r'^(\s+)', next_line).group(1)
                        
                        # Mapeamento de tipos para nomes
                        type_map = {
                            'quiz-intro-header': 'header-logo',
                            'decorative-bar': 'decorative-bar', 
                            'heading': 'question-title',
                            'text': 'text-content',
                            'image': 'question-image',
                            'options-grid': 'options-grid',
                            'button': 'action-button',
                            'form-input': 'form-input',
                            'legal-notice': 'legal-notice',
                            'result-header': 'result-header',
                            'result-card': 'result-card'
                        }
                        
                        component_name = type_map.get(block_type, block_type)
                        block_id = f"step{step_num:02d}-{component_name}"
                        
                        # Adicionar linha com ID
                        new_lines.append(line)
                        new_lines.append(f'{indent}id: "{block_id}",')
                        new_lines.append(next_line)
                        i += 2
                        continue
        
        new_lines.append(line)
        i += 1
    
    # Salvar arquivo modificado
    with open(filename, 'w') as f:
        f.write('\n'.join(new_lines))
    
    print(f"✅ Step{step_num:02d} corrigida!")

# Corrigir Steps 02-21
for step in range(2, 22):
    fix_step_file(f"src/components/steps/Step{step:02d}Template.tsx", step)

EOF
    
    echo "✅ Todas as Steps corrigidas!"
}

# Executar correções
echo "📝 Aplicando correções automáticas..."

# Corrigir todas as steps de 02 a 21
python3 - << 'EOF'
import re
import os

def fix_step_file(step_num):
    filename = f"src/components/steps/Step{step_num:02d}Template.tsx"
    
    if not os.path.exists(filename):
        print(f"❌ Arquivo não encontrado: {filename}")
        return
    
    print(f"🔧 Corrigindo Step{step_num:02d}Template.tsx...")
    
    # Backup
    os.system(f"cp {filename} {filename}.backup")
    
    with open(filename, 'r') as f:
        content = f.read()
    
    # Padrão para encontrar blocos
    lines = content.split('\n')
    new_lines = []
    block_count = {}
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Detectar início de bloco
        if re.search(r'^\s+{$', line) and i + 1 < len(lines):
            next_line = lines[i + 1]
            
            # Se a próxima linha contém type: mas não há id:
            type_match = re.search(r'^\s+type: "([^"]+)"', next_line)
            if type_match:
                # Verificar se já tem ID nas próximas linhas
                has_id = False
                for j in range(i + 1, min(i + 5, len(lines))):
                    if 'id:' in lines[j]:
                        has_id = True
                        break
                
                if not has_id:
                    block_type = type_match.group(1)
                    indent = re.match(r'^(\s+)', next_line).group(1)
                    
                    # Contar ocorrências do tipo para fazer IDs únicos
                    if block_type not in block_count:
                        block_count[block_type] = 0
                    block_count[block_type] += 1
                    
                    # Mapeamento de tipos
                    type_names = {
                        'quiz-intro-header': 'header',
                        'decorative-bar': 'decorative-bar',
                        'heading': 'title',
                        'text': 'text',
                        'image': 'image',
                        'options-grid': 'options',
                        'button': 'button',
                        'form-input': 'input',
                        'legal-notice': 'legal',
                        'result-header': 'result-header',
                        'result-card': 'result-card'
                    }
                    
                    base_name = type_names.get(block_type, block_type.replace('-', ''))
                    
                    # Adicionar número se houver múltiplos
                    if block_count[block_type] > 1:
                        component_name = f"{base_name}-{block_count[block_type]}"
                    else:
                        component_name = base_name
                    
                    block_id = f"step{step_num:02d}-{component_name}"
                    
                    # Adicionar linhas
                    new_lines.append(line)
                    new_lines.append(f'{indent}id: "{block_id}",')
                    new_lines.append(next_line)
                    i += 2
                    continue
        
        new_lines.append(line)
        i += 1
    
    # Salvar
    with open(filename, 'w') as f:
        f.write('\n'.join(new_lines))
    
    print(f"✅ Step{step_num:02d} corrigida!")

# Processar Steps 02-21
for step in range(2, 22):
    fix_step_file(step)

print("🎉 TODAS AS STEPS CORRIGIDAS COM SUCESSO!")
EOF

echo "🎯 VERIFICANDO RESULTADO..."

# Verificar se as correções funcionaram
for i in {1..21}; do
    file="src/components/steps/Step$(printf '%02d' $i)Template.tsx"
    if [[ -f "$file" ]]; then
        id_count=$(grep -c 'id: "step' "$file")
        type_count=$(grep -c 'type: "' "$file")
        echo "Step$(printf '%02d' $i): $id_count IDs / $type_count tipos"
    fi
done

echo "✅ CORREÇÃO COMPLETA FINALIZADA!"
