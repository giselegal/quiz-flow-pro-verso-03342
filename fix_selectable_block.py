import re

# Read the file
with open('src/components/editor/quiz/QuizFunnelEditorWYSIWYG.tsx', 'r') as f:
    content = f.read()

# Pattern to match old SelectableBlock usage
old_pattern = r'<SelectableBlock blockId={`\${step\.id}-([^`]+)`} label="([^"]+)" isEditable={isEditMode}>'

# New replacement pattern  
new_pattern = r'''<SelectableBlock
                        blockId={blockId}
                        isSelected={isSelected}
                        isEditable={isEditMode}
                        onSelect={handleBlockSelect}
                        blockType="\2"
                        blockIndex={index}
                        onOpenProperties={handleOpenProperties}
                        isDraggable={dragEnabled}
                    >'''

# Apply the replacement
content = re.sub(old_pattern, new_pattern, content)

# Write back to file
with open('src/components/editor/quiz/QuizFunnelEditorWYSIWYG.tsx', 'w') as f:
    f.write(content)

print("Fixed SelectableBlock props")
