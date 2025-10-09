import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';

// Este teste realiza um smoke do fluxo mínimo do /quiz-estilo com draft gerado
// Pré-condição: executar `npx tsx scripts/seed-draft.ts` antes, e capturar o draftId
// Alternativamente, o teste chama o seed automaticamente via endpoint local (node) se possível

async function seedDraft(): Promise<string> {
    // Chama o script local via import dinâmico em Node (Playwright roda em Node)
    const mod = await import('../../scripts/seed-draft.ts');
    // O script seed-draft exporta main? Não. Então reimportamos o bridge aqui seria custoso.
    // Como fallback, executamos via process spawn não-bloqueante.
    return new Promise((resolve, reject) => {
        const child = spawn('npx', ['tsx', 'scripts/seed-draft.ts'], { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] });
        let out = '';
        child.stdout.on('data', (d: Buffer) => out += d.toString());
        child.stderr.on('data', (d: Buffer) => out += d.toString());
        child.on('close', (code: number) => {
            if (code !== 0) return reject(new Error('seed-draft failed'));
            const match = out.match(/quiz-estilo\?draft=([^\s\n]+)/);
            if (match) return resolve(match[1]);
            // Tenta encontrar o id no log "Draft salvo: <id>"
            const match2 = out.match(/Draft salvo: (draft-[\w-]+)/);
            if (match2) return resolve(match2[1]);
            reject(new Error('draft id not found in seed output'));
        });
    });
}

// Utiliza porta e host do playwright.basic.config.ts, que aponta baseURL para 3001 em tests/e2e/testServer.ts
// Aqui usaremos rotas relativas.

test('Smoke /quiz-estilo com draft navega do step-1 ao step-2', async ({ page }) => {
    const draftId = await seedDraft();
    await page.goto(`http://localhost:8080/quiz-estilo?draft=${draftId}`);

    // Deve mostrar algo da intro
    await expect(page.locator('text=Chega')).toBeVisible({ timeout: 10000 });

    // Preenche o nome se houver input visível
    const nameInput = page.getByPlaceholder('Digite seu primeiro nome aqui...');
    if (await nameInput.isVisible().catch(() => false)) {
        await nameInput.fill('Teste');
    }

    // Clica no botão de avançar
    const advance = page.getByRole('button', { name: /Descobrir|Continuar|Quero|Avançar|Próximo/i });
    if (await advance.isVisible().catch(() => false)) {
        await advance.click();
    } else {
        // Fallback: press Enter
        await page.keyboard.press('Enter');
    }

    // Espera que a etapa 2 apareça (texto da pergunta 1)
    await expect(page.locator('text=Questão 1 de 10').first()).toBeVisible({ timeout: 15000 });
});
