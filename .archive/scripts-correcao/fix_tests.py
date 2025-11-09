#!/usr/bin/env python3
import re
import sys

def fix_test_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # 1. Fix waitForEditorReady function
    content = re.sub(
        r'await expect\(page\.locator\(\'\[data-editor="modular-enhanced"\]\'\)\)\.toBeVisible\(\{ timeout: 15000 \}\);',
        "await expect(page.getByTestId('modular-layout')).toBeVisible({ timeout: 15000 });",
        content
    )
    
    content = re.sub(
        r'await expect\(page\.locator\(\'\[data-testid="step-navigator"\]\'\)\.first\(\)\)\.toBeVisible\(\);',
        "await expect(page.getByTestId('column-steps')).toBeVisible();",
        content
    )
    
    # 2. Fix beforeEach to add initScript
    content = re.sub(
        r'(test\.beforeEach\(async \(\{ page \}\) => \{\s+)(await page\.goto)',
        r"\1// Garantir flag modular ligada\n    await page.addInitScript(() => {\n      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}\n    });\n    \n    \2",
        content
    )
    
    # 3. Fix URL resource -> template
    content = content.replace('resource=quiz21StepsComplete', 'template=quiz21StepsComplete')
    
    # 4. Fix navigateToStep function
    content = re.sub(
        r'const stepKey = `step-\$\{String\(stepNumber\)\.padStart\(2, \'0\'\)\}`;(\s+)await page\.locator\(`\[data-testid="step-nav-\$\{stepKey\}"\]`\)\.first\(\)\.click\(\);',
        r'await page.locator(`[data-testid="step-navigator-item"][data-step-order="${stepNumber}"]`).first().click();',
        content
    )
    
    # 5. Fix column references
    content = content.replace('data-testid="canvas-column"', 'data-testid="column-canvas"')
    content = content.replace('data-testid="properties-panel"', 'data-testid="column-properties"')
    content = content.replace('data-testid="block-library"', 'data-testid="column-library"')
    content = content.replace('[data-testid="sidebar-left"]', '[data-testid="column-library"]')
    
    # 6. Replace locator calls with getByTestId
    content = re.sub(
        r'page\.locator\(\'\[data-testid="column-canvas"\]\'\)',
        "page.getByTestId('column-canvas')",
        content
    )
    content = re.sub(
        r'page\.locator\(\'\[data-testid="column-properties"\]\'\)',
        "page.getByTestId('column-properties')",
        content
    )
    content = re.sub(
        r'page\.locator\(\'\[data-testid="column-library"\]\'\)',
        "page.getByTestId('column-library')",
        content
    )
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"✅ Fixed {filepath}")

if __name__ == '__main__':
    for filepath in sys.argv[1:]:
        fix_test_file(filepath)
