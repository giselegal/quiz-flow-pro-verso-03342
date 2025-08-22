#!/usr/bin/env node

/**
 * Validate Supabase References Script
 * 
 * Connects to Supabase using SUPABASE_URL and SUPABASE_KEY env vars
 * Validates quiz_definitions outcomes vs quiz_results aggregate_result/outcomeId
 * Ensures referential integrity between outcomes and results
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

/**
 * Validate environment variables
 */
function validateEnvironment() {
  if (!SUPABASE_URL) {
    throw new Error('SUPABASE_URL environment variable is required');
  }
  if (!SUPABASE_KEY) {
    throw new Error('SUPABASE_KEY (or SUPABASE_ANON_KEY) environment variable is required');
  }
  
  console.log('✅ Environment variables validated');
  console.log(`🔗 Connecting to: ${SUPABASE_URL}`);
}

/**
 * Create Supabase client
 */
function createSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}

/**
 * Fetch quiz definitions and extract outcome IDs
 */
async function fetchQuizDefinitions(supabase) {
  console.log('📊 Fetching quiz definitions...');
  
  try {
    const { data, error } = await supabase
      .from('quiz_definitions')
      .select('*');
    
    if (error) throw error;
    
    console.log(`✅ Found ${data.length} quiz definitions`);
    
    // Extract outcome IDs from schema_json
    const outcomeIds = new Set();
    const quizOutcomes = {};
    
    data.forEach(quiz => {
      const quizId = quiz.id;
      quizOutcomes[quizId] = new Set();
      
      try {
        // Parse schema_json if it exists
        if (quiz.schema_json) {
          const schema = typeof quiz.schema_json === 'string' 
            ? JSON.parse(quiz.schema_json) 
            : quiz.schema_json;
          
          // Extract outcomes from stepBlocks
          if (schema.stepBlocks) {
            Object.values(schema.stepBlocks).forEach(blocks => {
              if (Array.isArray(blocks)) {
                blocks.forEach(block => {
                  // Check for outcome definitions
                  if (block.type === 'ResultBlock' || block.type === 'result-header-inline') {
                    if (block.props?.outcomeId) {
                      outcomeIds.add(block.props.outcomeId);
                      quizOutcomes[quizId].add(block.props.outcomeId);
                    }
                    
                    // Check outcomeMapping
                    if (block.props?.outcomeMapping) {
                      Object.values(block.props.outcomeMapping).forEach(outcomeId => {
                        if (outcomeId) {
                          outcomeIds.add(outcomeId);
                          quizOutcomes[quizId].add(outcomeId);
                        }
                      });
                    }
                  }
                  
                  // Check for outcomes in other block types
                  if (block.props?.outcomes) {
                    if (Array.isArray(block.props.outcomes)) {
                      block.props.outcomes.forEach(outcome => {
                        if (outcome.id) {
                          outcomeIds.add(outcome.id);
                          quizOutcomes[quizId].add(outcome.id);
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        }
      } catch (parseError) {
        console.warn(`⚠️  Failed to parse schema_json for quiz ${quizId}:`, parseError.message);
      }
    });
    
    return {
      quizzes: data,
      outcomeIds: Array.from(outcomeIds),
      quizOutcomes: Object.fromEntries(
        Object.entries(quizOutcomes).map(([quizId, outcomes]) => [quizId, Array.from(outcomes)])
      )
    };
  } catch (error) {
    console.error('❌ Failed to fetch quiz definitions:', error.message);
    throw error;
  }
}

/**
 * Fetch quiz results and analyze outcome references
 */
async function fetchQuizResults(supabase) {
  console.log('📈 Fetching quiz results...');
  
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*');
    
    if (error) throw error;
    
    console.log(`✅ Found ${data.length} quiz results`);
    
    // Extract outcome references from results
    const referencedOutcomes = new Set();
    const resultsByQuiz = {};
    
    data.forEach(result => {
      const quizId = result.quiz_id;
      if (!resultsByQuiz[quizId]) {
        resultsByQuiz[quizId] = [];
      }
      resultsByQuiz[quizId].push(result);
      
      // Extract outcome references
      if (result.aggregate_result) {
        referencedOutcomes.add(result.aggregate_result);
      }
      
      if (result.outcomeId) {
        referencedOutcomes.add(result.outcomeId);
      }
      
      // Check for outcomes in result_data if it's JSON
      try {
        if (result.result_data) {
          const resultData = typeof result.result_data === 'string' 
            ? JSON.parse(result.result_data)
            : result.result_data;
          
          if (resultData.outcomeId) {
            referencedOutcomes.add(resultData.outcomeId);
          }
          
          if (resultData.outcome) {
            referencedOutcomes.add(resultData.outcome);
          }
        }
      } catch (parseError) {
        // Ignore parse errors for result_data
      }
    });
    
    return {
      results: data,
      referencedOutcomes: Array.from(referencedOutcomes),
      resultsByQuiz
    };
  } catch (error) {
    console.error('❌ Failed to fetch quiz results:', error.message);
    throw error;
  }
}

/**
 * Check if user_results table exists and validate it
 */
async function fetchUserResults(supabase) {
  console.log('👤 Checking user_results table...');
  
  try {
    const { data, error } = await supabase
      .from('user_results')
      .select('*')
      .limit(10); // Just check structure
    
    if (error) {
      if (error.message.includes('relation "user_results" does not exist')) {
        console.log('ℹ️  user_results table does not exist, skipping');
        return { exists: false };
      }
      throw error;
    }
    
    console.log(`✅ user_results table exists with ${data.length}+ records`);
    
    // Extract outcome references
    const referencedOutcomes = new Set();
    data.forEach(result => {
      if (result.aggregate_result) {
        referencedOutcomes.add(result.aggregate_result);
      }
      if (result.outcomeId) {
        referencedOutcomes.add(result.outcomeId);
      }
    });
    
    return {
      exists: true,
      sampleResults: data,
      referencedOutcomes: Array.from(referencedOutcomes)
    };
  } catch (error) {
    console.error('❌ Failed to fetch user_results:', error.message);
    return { exists: false, error: error.message };
  }
}

/**
 * Validate referential integrity
 */
function validateReferentialIntegrity(definitions, results, userResults) {
  console.log('🔍 Validating referential integrity...');
  
  const definedOutcomes = new Set(definitions.outcomeIds);
  const referencedOutcomes = new Set([
    ...results.referencedOutcomes,
    ...(userResults.referencedOutcomes || [])
  ]);
  
  // Find orphaned outcomes (referenced but not defined)
  const orphanedOutcomes = Array.from(referencedOutcomes).filter(
    outcome => outcome && !definedOutcomes.has(outcome)
  );
  
  // Find unused outcomes (defined but not referenced)
  const unusedOutcomes = Array.from(definedOutcomes).filter(
    outcome => outcome && !referencedOutcomes.has(outcome)
  );
  
  // Validate step key normalization in results
  const stepKeyIssues = [];
  results.results.forEach(result => {
    try {
      if (result.result_data) {
        const resultData = typeof result.result_data === 'string' 
          ? JSON.parse(result.result_data)
          : result.result_data;
        
        if (resultData.stepResults) {
          Object.keys(resultData.stepResults).forEach(stepKey => {
            if (!stepKey.match(/^step-\d+$/)) {
              stepKeyIssues.push({
                resultId: result.id,
                stepKey,
                suggestedKey: stepKey.replace(/^step(\d+)$/, 'step-$1').replace(/^(\d+)$/, 'step-$1')
              });
            }
          });
        }
      }
    } catch (error) {
      // Ignore parse errors
    }
  });
  
  return {
    orphanedOutcomes,
    unusedOutcomes,
    stepKeyIssues,
    isValid: orphanedOutcomes.length === 0,
    summary: {
      totalDefinedOutcomes: definedOutcomes.size,
      totalReferencedOutcomes: referencedOutcomes.size,
      orphanedCount: orphanedOutcomes.length,
      unusedCount: unusedOutcomes.length,
      stepKeyIssuesCount: stepKeyIssues.length
    }
  };
}

/**
 * Main validation function
 */
async function validateSupabaseReferences() {
  try {
    console.log('🚀 Starting Supabase reference validation...');
    
    validateEnvironment();
    const supabase = createSupabaseClient();
    
    // Fetch data
    const definitions = await fetchQuizDefinitions(supabase);
    const results = await fetchQuizResults(supabase);
    const userResults = await fetchUserResults(supabase);
    
    // Validate integrity
    const validation = validateReferentialIntegrity(definitions, results, userResults);
    
    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      environment: {
        supabaseUrl: SUPABASE_URL,
        tablesChecked: ['quiz_definitions', 'quiz_results', ...(userResults.exists ? ['user_results'] : [])]
      },
      data: {
        definitions: {
          count: definitions.quizzes.length,
          outcomeIds: definitions.outcomeIds,
          quizOutcomes: definitions.quizOutcomes
        },
        results: {
          count: results.results.length,
          referencedOutcomes: results.referencedOutcomes
        },
        userResults: userResults.exists ? {
          exists: true,
          referencedOutcomes: userResults.referencedOutcomes
        } : { exists: false }
      },
      validation,
      recommendations: generateRecommendations(validation)
    };
    
    // Output results
    console.log('\n📋 VALIDATION SUMMARY');
    console.log('====================');
    console.log(`✅ Quiz definitions: ${definitions.quizzes.length}`);
    console.log(`✅ Quiz results: ${results.results.length}`);
    console.log(`✅ Defined outcomes: ${validation.summary.totalDefinedOutcomes}`);
    console.log(`✅ Referenced outcomes: ${validation.summary.totalReferencedOutcomes}`);
    
    if (validation.summary.orphanedCount > 0) {
      console.log(`❌ Orphaned outcomes: ${validation.summary.orphanedCount}`);
      console.log(`   ${validation.orphanedOutcomes.join(', ')}`);
    }
    
    if (validation.summary.unusedCount > 0) {
      console.log(`⚠️  Unused outcomes: ${validation.summary.unusedCount}`);
    }
    
    if (validation.summary.stepKeyIssuesCount > 0) {
      console.log(`⚠️  Step key normalization issues: ${validation.summary.stepKeyIssuesCount}`);
    }
    
    if (validation.isValid) {
      console.log('\n🎉 All outcome references are valid!');
    } else {
      console.log('\n❌ Validation failed - see orphaned outcomes above');
    }
    
    return report;
    
  } catch (error) {
    console.error('💥 Validation failed:', error.message);
    process.exit(1);
  }
}

/**
 * Generate recommendations
 */
function generateRecommendations(validation) {
  const recommendations = [];
  
  if (validation.orphanedOutcomes.length > 0) {
    recommendations.push({
      type: 'critical',
      message: `Remove or define ${validation.orphanedOutcomes.length} orphaned outcome references`,
      outcomes: validation.orphanedOutcomes
    });
  }
  
  if (validation.unusedOutcomes.length > 0) {
    recommendations.push({
      type: 'optimization',
      message: `Consider removing ${validation.unusedOutcomes.length} unused outcome definitions`,
      outcomes: validation.unusedOutcomes
    });
  }
  
  if (validation.stepKeyIssues.length > 0) {
    recommendations.push({
      type: 'normalization',
      message: `Normalize ${validation.stepKeyIssues.length} step keys to step-<n> format`,
      issues: validation.stepKeyIssues
    });
  }
  
  return recommendations;
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateSupabaseReferences()
    .then(report => {
      // Optionally save report to file
      if (process.argv.includes('--output') || process.argv.includes('-o')) {
        const outputFile = path.join(__dirname, '../tmp/supabase_validation_report.json');
        
        const outputDir = path.dirname(outputFile);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
        console.log(`\n📁 Report saved to: ${outputFile}`);
      }
    })
    .catch(error => {
      console.error('Validation script failed:', error);
      process.exit(1);
    });
}

export { validateSupabaseReferences };