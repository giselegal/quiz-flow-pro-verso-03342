#!/usr/bin/env python3
"""
Script para corrigir quiz21-complete.json aplicando o mesmo padrão dos arquivos individuais.
Garante que todos os blocos tenham estrutura content + properties correta.
"""

import json
import sys

def fix_intro_logo_block(block):
    """Corrige bloco intro-logo"""
    content = block.get('content', {})
    properties = block.get('properties', {})
    
    # Converter width/height para números
    if 'width' in content and isinstance(content['width'], str):
        content['width'] = int(content['width'])
    if 'height' in content and isinstance(content['height'], str):
        content['height'] = int(content['height'])
    
    # Adicionar imageUrl se não existe
    if 'src' in content and 'imageUrl' not in content:
        content['imageUrl'] = content['src']
    
    # Garantir properties mínimas
    if not properties.get('padding'):
        properties['padding'] = 16
    if not properties.get('animationType'):
        properties['animationType'] = 'fade'
    if not properties.get('animationDuration'):
        properties['animationDuration'] = 300
    
    block['content'] = content
    block['properties'] = properties
    return block

def fix_intro_title_block(block):
    """Corrige bloco intro-title"""
    content = block.get('content', {})
    properties = block.get('properties', {})
    
    # Garantir properties mínimas
    if not properties.get('padding'):
        properties['padding'] = 16
    if not properties.get('animationType'):
        properties['animationType'] = 'fade'
    if not properties.get('animationDuration'):
        properties['animationDuration'] = 300
    if not properties.get('textAlign'):
        properties['textAlign'] = 'center'
    if not properties.get('fontSize'):
        properties['fontSize'] = '28px'
    if not properties.get('fontWeight'):
        properties['fontWeight'] = '700'
    
    block['content'] = content
    block['properties'] = properties
    return block

def fix_intro_image_block(block):
    """Corrige bloco intro-image - CRÍTICO"""
    content = block.get('content', {})
    properties = block.get('properties', {})
    
    # Converter width/height para números
    if 'width' in content and isinstance(content['width'], str):
        content['width'] = int(content['width'])
    if 'height' in content and isinstance(content['height'], str):
        content['height'] = int(content['height'])
    
    # Adicionar imageUrl se não existe
    if 'src' in content and 'imageUrl' not in content:
        content['imageUrl'] = content['src']
    
    # Garantir properties OBRIGATÓRIAS para renderização
    if not properties.get('objectFit'):
        properties['objectFit'] = 'contain'
    if not properties.get('maxWidth'):
        # Usar content.width como maxWidth
        properties['maxWidth'] = content.get('width', 300)
    if not properties.get('borderRadius'):
        properties['borderRadius'] = '8px'
    
    block['content'] = content
    block['properties'] = properties
    return block

def fix_intro_description_block(block):
    """Corrige bloco intro-description"""
    content = block.get('content', {})
    properties = block.get('properties', {})
    
    # Garantir properties mínimas
    if not properties.get('padding'):
        properties['padding'] = 16
    if not properties.get('animationType'):
        properties['animationType'] = 'fade'
    if not properties.get('animationDuration'):
        properties['animationDuration'] = 300
    if not properties.get('textAlign'):
        properties['textAlign'] = 'center'
    
    block['content'] = content
    block['properties'] = properties
    return block

def fix_intro_form_block(block):
    """Corrige bloco intro-form"""
    content = block.get('content', {})
    properties = block.get('properties', {})
    
    # Garantir properties mínimas
    if not properties.get('padding'):
        properties['padding'] = 16
    if not properties.get('animationType'):
        properties['animationType'] = 'fade'
    if not properties.get('animationDuration'):
        properties['animationDuration'] = 300
    
    block['content'] = content
    block['properties'] = properties
    return block

def fix_question_block(block):
    """Corrige blocos de perguntas"""
    content = block.get('content', {})
    properties = block.get('properties', {})
    
    # Garantir properties mínimas
    if not properties.get('padding'):
        properties['padding'] = 16
    
    block['content'] = content
    block['properties'] = properties
    return block

def fix_options_grid_block(block):
    """Corrige bloco options-grid"""
    content = block.get('content', {})
    properties = block.get('properties', {})
    
    # Garantir content.options existe
    if 'options' not in content:
        content['options'] = []
    
    # Garantir properties mínimas
    if not properties.get('columns'):
        properties['columns'] = 2
    if not properties.get('gap'):
        properties['gap'] = 16
    
    block['content'] = content
    block['properties'] = properties
    return block

def fix_transition_block(block):
    """Corrige blocos de transição"""
    content = block.get('content', {})
    properties = block.get('properties', {})
    
    # Converter width/height para números se existirem
    if 'width' in content and isinstance(content['width'], str):
        content['width'] = int(content['width'])
    if 'height' in content and isinstance(content['height'], str):
        content['height'] = int(content['height'])
    
    block['content'] = content
    block['properties'] = properties
    return block

def fix_result_block(block):
    """Corrige blocos de resultado"""
    content = block.get('content', {})
    properties = block.get('properties', {})
    
    # Converter width/height para números se existirem
    if 'width' in content and isinstance(content['width'], str):
        content['width'] = int(content['width'])
    if 'height' in content and isinstance(content['height'], str):
        content['height'] = int(content['height'])
    
    block['content'] = content
    block['properties'] = properties
    return block

def fix_offer_block(block):
    """Corrige blocos de oferta"""
    content = block.get('content', {})
    properties = block.get('properties', {})
    
    # Converter width/height para números se existirem
    if 'width' in content and isinstance(content['width'], str):
        content['width'] = int(content['width'])
    if 'height' in content and isinstance(content['height'], str):
        content['height'] = int(content['height'])
    
    block['content'] = content
    block['properties'] = properties
    return block

def fix_block(block):
    """Aplica correção baseada no tipo do bloco"""
    block_type = block.get('type', '')
    
    if block_type == 'intro-logo':
        return fix_intro_logo_block(block)
    elif block_type == 'intro-title':
        return fix_intro_title_block(block)
    elif block_type == 'intro-image':
        return fix_intro_image_block(block)
    elif block_type == 'intro-description':
        return fix_intro_description_block(block)
    elif block_type == 'intro-form':
        return fix_intro_form_block(block)
    elif block_type.startswith('question-'):
        return fix_question_block(block)
    elif block_type == 'options-grid':
        return fix_options_grid_block(block)
    elif block_type.startswith('transition-'):
        return fix_transition_block(block)
    elif block_type.startswith('result-'):
        return fix_result_block(block)
    elif block_type.startswith('offer-'):
        return fix_offer_block(block)
    else:
        # Tipo desconhecido, garantir estrutura mínima
        if 'content' not in block:
            block['content'] = {}
        if 'properties' not in block:
            block['properties'] = {}
        return block

def main():
    input_file = 'public/templates/quiz21-complete.json'
    output_file = 'public/templates/quiz21-complete.json'
    backup_file = 'public/templates/quiz21-complete.json.bak'
    
    print(f"🔧 Carregando {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"💾 Criando backup em {backup_file}...")
    with open(backup_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    if 'steps' not in data or not isinstance(data['steps'], dict):
        print("❌ ERRO: Campo 'steps' não encontrado ou não é objeto")
        return 1
    
    total_blocks_fixed = 0
    
    print("\n📝 Corrigindo steps...")
    for step_key, step_data in data['steps'].items():
        if 'blocks' not in step_data or not isinstance(step_data['blocks'], list):
            print(f"  ⚠️  {step_key}: sem blocos ou formato inválido")
            continue
        
        blocks_fixed = 0
        for i, block in enumerate(step_data['blocks']):
            fixed_block = fix_block(block)
            step_data['blocks'][i] = fixed_block
            blocks_fixed += 1
        
        total_blocks_fixed += blocks_fixed
        print(f"  ✅ {step_key}: {blocks_fixed} blocos corrigidos")
    
    print(f"\n💾 Salvando arquivo corrigido em {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ CONCLUÍDO!")
    print(f"   Total de blocos corrigidos: {total_blocks_fixed}")
    print(f"   Backup salvo em: {backup_file}")
    
    return 0

if __name__ == '__main__':
    sys.exit(main())
