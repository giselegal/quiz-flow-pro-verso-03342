import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'url';

import { validateStepFile, validateTemplateManifest } from '../../types/schemas/templateSchema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateRoot = path.resolve(__dirname, '../../..', 'public/templates/funnels/quiz21StepsComplete');
const manifestPath = path.join(templateRoot, 'master.v3.json');
const stepsDir = path.join(templateRoot, 'steps');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

function loadStep(file: string) {
  const contents = fs.readFileSync(path.join(stepsDir, file), 'utf-8');
  return JSON.parse(contents);
}

describe('quiz21StepsComplete JSON schema validation', () => {
  it('validates the master manifest without warnings', () => {
    const result = validateTemplateManifest(manifest);

    expect(result.success).toBe(true);
    expect(result.warnings).toBeUndefined();
    expect(result.data?.metadata.totalSteps).toBe(result.data?.steps.length);
  });

  it('validates all step files without warnings', () => {
    const stepFiles = fs.readdirSync(stepsDir).filter((file) => file.endsWith('.json'));

    expect(stepFiles.length).toBeGreaterThan(0);

    stepFiles.forEach((file) => {
      const step = loadStep(file);
      const result = validateStepFile(step);

      expect(result.success).toBe(true);
      expect(result.warnings).toBeUndefined();
    });
  });

  it('keeps manifest steps aligned with files', () => {
    const stepFiles = fs
      .readdirSync(stepsDir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''));

    const manifestIds = manifest.steps.map((step: { id: string }) => step.id);
    const manifestFiles = manifest.steps.map((step: { file: string }) => step.file.replace('./steps/', '').replace('.json', ''));

    expect(new Set(manifestIds)).toEqual(new Set(manifestFiles));
    expect(new Set(stepFiles)).toEqual(new Set(manifestIds));
  });
});
