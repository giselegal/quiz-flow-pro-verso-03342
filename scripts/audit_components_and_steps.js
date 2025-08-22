#!/usr/bin/env node

/**
 * Audit Components and Steps Script
 * 
 * Scans src/components/editor directory and analyzes component structure
 * Optionally reads schema_json if provided and validates consistency
 * Outputs audit report to tmp/audit_report.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const COMPONENTS_DIR = path.join(__dirname, '../src/components/editor');
const OUTPUT_DIR = path.join(__dirname, '../tmp');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'audit_report.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Scan directory recursively for component files
 */
function scanComponents(dir, components = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    // Check if file exists before getting stats
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Skipping missing file: ${filePath}`);
      return;
    }
    
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanComponents(filePath, components);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const component = analyzeComponent(filePath, content);
      if (component) {
        components.push(component);
      }
    }
  });
  
  return components;
}

/**
 * Analyze a component file
 */
function analyzeComponent(filePath, content) {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  
  // Extract component name
  const componentMatch = content.match(/(?:export\s+(?:default\s+)?(?:function|const)\s+|function\s+|const\s+)(\w+)/);
  const componentName = componentMatch?.[1] || path.basename(filePath, path.extname(filePath));
  
  // Check for common patterns
  const isDnDComponent = content.includes('@dnd-kit') || content.includes('useDrag') || content.includes('useDrop');
  const hasStepLogic = content.includes('step') || content.includes('Step');
  const hasBlockLogic = content.includes('Block') || content.includes('block');
  const isProvider = content.includes('Provider') || content.includes('Context');
  
  // Extract step references
  const stepReferences = [];
  const stepMatches = content.match(/step[-_]?\d+|Step[-_]?\d+/gi) || [];
  stepMatches.forEach(match => {
    const numberMatch = match.match(/(\d+)/);
    if (numberMatch) {
      stepReferences.push(parseInt(numberMatch[1]));
    }
  });
  
  // Extract block types
  const blockTypes = [];
  const blockTypeMatches = content.match(/type\s*[:=]\s*['"`]([^'"`]+)['"`]/g) || [];
  blockTypeMatches.forEach(match => {
    const typeMatch = match.match(/['"`]([^'"`]+)['"`]/);
    if (typeMatch) {
      blockTypes.push(typeMatch[1]);
    }
  });
  
  // Check for validation logic
  const hasValidation = content.includes('validate') || content.includes('Validation') || 
                       content.includes('required') || content.includes('schema');
  
  // Check for telemetry usage
  const usesTelemetry = content.includes('telemetry') || content.includes('capture') || 
                       content.includes('track');
  
  return {
    name: componentName,
    path: relativePath,
    isDnDComponent,
    hasStepLogic,
    hasBlockLogic,
    isProvider,
    stepReferences: [...new Set(stepReferences)].sort(),
    blockTypes: [...new Set(blockTypes)],
    hasValidation,
    usesTelemetry,
    linesOfCode: content.split('\n').length,
    lastModified: fs.statSync(filePath).mtime.toISOString()
  };
}

/**
 * Validate schema_json if provided
 */
function validateSchemaJson(schemaPath) {
  if (!fs.existsSync(schemaPath)) {
    return { error: 'Schema file not found' };
  }
  
  try {
    const content = fs.readFileSync(schemaPath, 'utf8');
    const schema = JSON.parse(content);
    
    const stepKeys = Object.keys(schema.stepBlocks || {});
    const normalizedKeys = stepKeys.filter(key => key.match(/^step-\d+$/));
    const nonNormalizedKeys = stepKeys.filter(key => !key.match(/^step-\d+$/));
    
    return {
      totalSteps: stepKeys.length,
      normalizedKeys,
      nonNormalizedKeys,
      needsNormalization: nonNormalizedKeys.length > 0,
      schema: {
        hasMetadata: !!schema.metadata,
        hasEngineVersion: !!(schema.metadata?.engineVersion),
        hasSchemaHash: !!(schema.metadata?.schemaHash)
      }
    };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Main audit function
 */
function runAudit() {
  console.log('🔍 Starting component and steps audit...');
  
  // Scan components
  const components = scanComponents(COMPONENTS_DIR);
  
  // Analyze component distribution
  const analysis = {
    totalComponents: components.length,
    dndComponents: components.filter(c => c.isDnDComponent).length,
    stepComponents: components.filter(c => c.hasStepLogic).length,
    blockComponents: components.filter(c => c.hasBlockLogic).length,
    providers: components.filter(c => c.isProvider).length,
    withValidation: components.filter(c => c.hasValidation).length,
    withTelemetry: components.filter(c => c.usesTelemetry).length,
    
    stepReferenceDistribution: {},
    blockTypeDistribution: {},
    averageLinesOfCode: Math.round(components.reduce((sum, c) => sum + c.linesOfCode, 0) / components.length)
  };
  
  // Analyze step references
  components.forEach(component => {
    component.stepReferences.forEach(step => {
      analysis.stepReferenceDistribution[step] = (analysis.stepReferenceDistribution[step] || 0) + 1;
    });
  });
  
  // Analyze block types
  components.forEach(component => {
    component.blockTypes.forEach(type => {
      analysis.blockTypeDistribution[type] = (analysis.blockTypeDistribution[type] || 0) + 1;
    });
  });
  
  // Check for schema_json if provided as argument
  let schemaValidation = null;
  const schemaPath = process.argv[2];
  if (schemaPath) {
    console.log(`📋 Validating schema: ${schemaPath}`);
    schemaValidation = validateSchemaJson(schemaPath);
  }
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    audit: {
      components,
      analysis,
      schemaValidation
    },
    recommendations: generateRecommendations(components, analysis, schemaValidation)
  };
  
  // Write report
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  
  console.log(`✅ Audit complete! Report saved to: ${OUTPUT_FILE}`);
  console.log(`📊 Found ${components.length} components`);
  console.log(`🎯 DnD components: ${analysis.dndComponents}`);
  console.log(`🔢 Step-aware components: ${analysis.stepComponents}`);
  
  if (schemaValidation?.needsNormalization) {
    console.log(`⚠️  Schema needs step key normalization: ${schemaValidation.nonNormalizedKeys.length} keys`);
  }
  
  return report;
}

/**
 * Generate recommendations based on audit results
 */
function generateRecommendations(components, analysis, schemaValidation) {
  const recommendations = [];
  
  // DnD recommendations
  if (analysis.dndComponents > 0) {
    recommendations.push({
      type: 'dnd',
      priority: 'medium',
      message: `Found ${analysis.dndComponents} DnD components. Ensure collision detection is properly configured.`
    });
  }
  
  // Validation recommendations
  if (analysis.withValidation < analysis.blockComponents) {
    recommendations.push({
      type: 'validation',
      priority: 'high',
      message: `${analysis.blockComponents - analysis.withValidation} block components lack validation logic.`
    });
  }
  
  // Telemetry recommendations
  if (analysis.withTelemetry === 0) {
    recommendations.push({
      type: 'telemetry',
      priority: 'low',
      message: 'No components use telemetry. Consider adding telemetry for user interactions.'
    });
  }
  
  // Schema recommendations
  if (schemaValidation?.needsNormalization) {
    recommendations.push({
      type: 'schema',
      priority: 'high',
      message: `Schema contains ${schemaValidation.nonNormalizedKeys.length} non-normalized step keys.`
    });
  }
  
  // Step coverage recommendations
  const maxStep = Math.max(...Object.keys(analysis.stepReferenceDistribution).map(Number));
  if (maxStep > 21) {
    recommendations.push({
      type: 'steps',
      priority: 'medium',
      message: `Components reference steps beyond 21 (max: ${maxStep}). Verify intentional.`
    });
  }
  
  return recommendations;
}

// Run audit if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAudit();
}

export { runAudit, scanComponents, analyzeComponent };