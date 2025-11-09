#!/usr/bin/env python3
"""
Script para corrigir todos os JSONs de steps (02-21)
Adiciona campo 'content' e 'order', reorganiza 'config' → 'properties'
"""

import json
import os
from pathlib import Path

def migrate_block(block, index):
    """Migra um bloco do formato antigo (config) para novo (content + properties)"""
    
    block_type = block.get('type', '')
    config = block.get('config', {})
    properties = block.get('properties', {})
    
    # Campos que vão para content (semântica)
    content_fields = {
        'question-progress': ['currentQuestion', 'totalQuestions', 'questionNumber', 'progressPercent'],
        'question-title': ['text', 'questionText', 'questionNumber'],
        'question-text': ['text', 'questionText'],
        'question-number': ['questionNumber', 'currentQuestion', 'totalQuestions'],
        'question-instructions': ['text', 'instructionText'],
        'options-grid': ['options', 'minSelections', 'maxSelections'],
        'question-navigation': ['backButtonText', 'nextButtonText', 'showBackButton', 'showNextButton'],
        'transition-hero': ['title', 'subtitle', 'text'],
        'transition-title': ['title', 'text'],
        'transition-text': ['text'],
        'CTAButton': ['text', 'buttonText', 'label'],
        'cta-inline': ['text', 'buttonText', 'label', 'url'],
    }
    
    # Campos que ficam em properties (visual/comportamento)
    property_fields = ['padding', 'margin', 'animationType', 'animationDuration', 
                      'textAlign', 'fontSize', 'fontWeight', 'color', 'backgroundColor',
                      'borderRadius', 'showProgress', 'progressColor', 'layout',
                      'multiSelect', 'required', 'autoAdvance', 'gridColumns',
                      'imageSize', 'showImages', 'showShadows']
    
    # Construir content
    content = {}
    relevant_content_fields = content_fields.get(block_type, [])
    
    # Prioridade: config > properties
    all_data = {**properties, **config}
    
    for field in relevant_content_fields:
        if field in all_data:
            content[field] = all_data[field]
    
    # Construir properties (apenas campos visuais/comportamentais)
    new_properties = {}
    for field in property_fields:
        if field in all_data:
            new_properties[field] = all_data[field]
    
    # Adicionar outros campos não mapeados em properties
    for key, value in all_data.items():
        if key not in relevant_content_fields and key not in property_fields:
            new_properties[key] = value
    
    # Construir novo bloco
    new_block = {
        'id': block.get('id'),
        'type': block_type,
        'order': index,
        'content': content if content else {},
        'properties': new_properties if new_properties else {}
    }
    
    return new_block

def fix_step_file(step_num):
    """Corrige um arquivo de step específico"""
    
    file_path = Path(f'public/templates/blocks/step-{step_num:02d}.json')
    
    if not file_path.exists():
        print(f"❌ Arquivo não encontrado: {file_path}")
        return False
    
    # Backup
    backup_path = file_path.with_suffix('.json.bak')
    if not backup_path.exists():
        import shutil
        shutil.copy2(file_path, backup_path)
        print(f"📦 Backup criado: {backup_path}")
    
    # Carregar JSON
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Verificar se já está corrigido
    if data.get('blocks') and all(b.get('content') is not None for b in data['blocks']):
        print(f"✅ Step {step_num:02d} já está corrigido")
        return True
    
    # Migrar blocos
    new_blocks = []
    for idx, block in enumerate(data.get('blocks', [])):
        new_block = migrate_block(block, idx)
        new_blocks.append(new_block)
    
    data['blocks'] = new_blocks
    
    # Salvar
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Step {step_num:02d} corrigido ({len(new_blocks)} blocos)")
    return True

def main():
    print("🔧 Corrigindo JSONs de steps 02-21...\n")
    
    success_count = 0
    for step_num in range(2, 22):
        try:
            if fix_step_file(step_num):
                success_count += 1
        except Exception as e:
            print(f"❌ Erro no step {step_num:02d}: {e}")
    
    print(f"\n✅ Concluído! {success_count}/20 steps corrigidos")

if __name__ == '__main__':
    main()
