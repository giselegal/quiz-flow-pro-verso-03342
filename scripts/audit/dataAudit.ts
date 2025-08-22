#!/usr/bin/env node

/**
 * 🔍 DATA AUDIT SCRIPT - Quiz Data Validation and Integrity Checks
 * 
 * Comprehensive audit tool for:
 * - Data integrity validation
 * - Schema compliance checking
 * - Performance analysis
 * - Inconsistency detection
 * - Migration readiness assessment
 */

import { createClient } from '@supabase/supabase-js';
import { CalculationEngine, validateQuizData } from '../../src/utils/calcResults.js';
import fs from 'fs';
import path from 'path';

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

interface AuditReport {
  timestamp: Date;
  summary: {
    totalQuizzes: number;
    totalResponses: number;
    validQuizzes: number;
    invalidQuizzes: number;
    dataIntegrityScore: number;
  };
  issues: AuditIssue[];
  recommendations: string[];
  migrationReadiness: {
    ready: boolean;
    blockers: string[];
    warnings: string[];
  };
}

interface AuditIssue {
  type: 'error' | 'warning' | 'info';
  category: 'data' | 'schema' | 'performance' | 'integrity';
  message: string;
  details?: any;
  affectedItems?: string[];
}

class DataAuditor {
  private supabase;
  private calculationEngine: CalculationEngine;
  private report: AuditReport;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    this.calculationEngine = new CalculationEngine();
    this.report = {
      timestamp: new Date(),
      summary: {
        totalQuizzes: 0,
        totalResponses: 0,
        validQuizzes: 0,
        invalidQuizzes: 0,
        dataIntegrityScore: 0
      },
      issues: [],
      recommendations: [],
      migrationReadiness: {
        ready: false,
        blockers: [],
        warnings: []
      }
    };
  }

  async runFullAudit(): Promise<AuditReport> {
    console.log('🔍 Starting comprehensive data audit...');

    try {
      await this.auditDatabaseSchema();
      await this.auditQuizDefinitions();
      await this.auditUserResponses();
      await this.auditDataIntegrity();
      await this.auditPerformanceMetrics();
      await this.assessMigrationReadiness();
      
      this.generateRecommendations();
      this.calculateDataIntegrityScore();

      console.log('✅ Audit completed successfully');
      return this.report;

    } catch (error) {
      this.addIssue('error', 'integrity', `Audit failed: ${error.message}`);
      throw error;
    }
  }

  private async auditDatabaseSchema(): Promise<void> {
    console.log('📊 Auditing database schema...');

    try {
      // Check if required tables exist
      const requiredTables = [
        'quiz_definitions',
        'user_results',
        'component_instances',
        'component_types'
      ];

      for (const table of requiredTables) {
        const { data, error } = await this.supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          if (error.code === 'PGRST116') {
            this.addIssue('error', 'schema', `Required table '${table}' does not exist`);
          } else {
            this.addIssue('warning', 'schema', `Error accessing table '${table}': ${error.message}`);
          }
        } else {
          this.addIssue('info', 'schema', `Table '${table}' exists and is accessible`);
        }
      }

      // Check for recommended indexes
      await this.auditDatabaseIndexes();

    } catch (error) {
      this.addIssue('error', 'schema', `Schema audit failed: ${error.message}`);
    }
  }

  private async auditDatabaseIndexes(): Promise<void> {
    const recommendedIndexes = [
      'idx_quiz_definitions_owner',
      'idx_quiz_definitions_schema_hash',
      'idx_user_results_session_id',
      'idx_user_results_funnel_id'
    ];

    // Note: This would need actual database access to check indexes
    // For now, we'll add recommendations
    this.addIssue('info', 'performance', 'Recommended to verify database indexes exist for optimal performance');
  }

  private async auditQuizDefinitions(): Promise<void> {
    console.log('📝 Auditing quiz definitions...');

    try {
      const { data: quizzes, error } = await this.supabase
        .from('quiz_definitions')
        .select('*');

      if (error) {
        this.addIssue('error', 'data', `Failed to fetch quiz definitions: ${error.message}`);
        return;
      }

      this.report.summary.totalQuizzes = quizzes?.length || 0;

      if (!quizzes || quizzes.length === 0) {
        this.addIssue('warning', 'data', 'No quiz definitions found in database');
        return;
      }

      for (const quiz of quizzes) {
        await this.validateQuizDefinition(quiz);
      }

    } catch (error) {
      this.addIssue('error', 'data', `Quiz definitions audit failed: ${error.message}`);
    }
  }

  private async validateQuizDefinition(quiz: any): Promise<void> {
    try {
      // Check required fields
      if (!quiz.id) {
        this.addIssue('error', 'data', 'Quiz definition missing ID', quiz);
        return;
      }

      if (!quiz.schema_json) {
        this.addIssue('error', 'data', `Quiz ${quiz.id} missing schema_json`);
        return;
      }

      // Parse and validate schema
      let schemaData;
      try {
        schemaData = typeof quiz.schema_json === 'string' 
          ? JSON.parse(quiz.schema_json) 
          : quiz.schema_json;
      } catch (parseError) {
        this.addIssue('error', 'data', `Quiz ${quiz.id} has invalid JSON schema`);
        return;
      }

      // Validate schema structure
      if (!schemaData.questions || !Array.isArray(schemaData.questions)) {
        this.addIssue('error', 'data', `Quiz ${quiz.id} missing or invalid questions array`);
        return;
      }

      // Check questions structure
      for (const [index, question] of schemaData.questions.entries()) {
        if (!question.id) {
          this.addIssue('error', 'data', `Quiz ${quiz.id} question ${index} missing ID`);
        }

        if (!question.options || !Array.isArray(question.options)) {
          this.addIssue('error', 'data', `Quiz ${quiz.id} question ${question.id || index} missing options`);
        }

        // Check options structure
        if (question.options) {
          for (const [optIndex, option] of question.options.entries()) {
            if (!option.id) {
              this.addIssue('warning', 'data', `Quiz ${quiz.id} question ${question.id} option ${optIndex} missing ID`);
            }
            
            if (!option.weights) {
              this.addIssue('info', 'data', `Quiz ${quiz.id} question ${question.id} option ${option.id} has no weights`);
            }
          }
        }
      }

      this.report.summary.validQuizzes++;

    } catch (error) {
      this.addIssue('error', 'data', `Failed to validate quiz ${quiz.id}: ${error.message}`);
      this.report.summary.invalidQuizzes++;
    }
  }

  private async auditUserResponses(): Promise<void> {
    console.log('👥 Auditing user responses...');

    try {
      const { data: responses, error } = await this.supabase
        .from('user_results')
        .select('*')
        .limit(1000); // Sample for performance

      if (error) {
        this.addIssue('error', 'data', `Failed to fetch user responses: ${error.message}`);
        return;
      }

      this.report.summary.totalResponses = responses?.length || 0;

      if (!responses || responses.length === 0) {
        this.addIssue('warning', 'data', 'No user responses found in database');
        return;
      }

      await this.validateUserResponses(responses);

    } catch (error) {
      this.addIssue('error', 'data', `User responses audit failed: ${error.message}`);
    }
  }

  private async validateUserResponses(responses: any[]): Promise<void> {
    const orphanedResponses = [];
    const invalidStructures = [];

    for (const response of responses) {
      // Check required fields
      if (!response.session_id) {
        invalidStructures.push(response.id || 'unknown');
        continue;
      }

      if (!response.funnel_id) {
        invalidStructures.push(response.id || 'unknown');
        continue;
      }

      // Check if corresponding quiz definition exists
      const { data: quiz, error } = await this.supabase
        .from('quiz_definitions')
        .select('id')
        .eq('id', response.funnel_id)
        .single();

      if (error || !quiz) {
        orphanedResponses.push(response.id || response.session_id);
      }
    }

    if (orphanedResponses.length > 0) {
      this.addIssue('warning', 'integrity', 
        `Found ${orphanedResponses.length} orphaned responses with no corresponding quiz definition`,
        { orphanedIds: orphanedResponses.slice(0, 10) } // Show first 10
      );
    }

    if (invalidStructures.length > 0) {
      this.addIssue('error', 'data', 
        `Found ${invalidStructures.length} responses with invalid structure`,
        { invalidIds: invalidStructures.slice(0, 10) }
      );
    }
  }

  private async auditDataIntegrity(): Promise<void> {
    console.log('🔍 Auditing data integrity...');

    try {
      // Check for duplicate sessions
      await this.checkDuplicateSessions();
      
      // Check for incomplete responses
      await this.checkIncompleteResponses();
      
      // Check data consistency
      await this.checkDataConsistency();

    } catch (error) {
      this.addIssue('error', 'integrity', `Data integrity audit failed: ${error.message}`);
    }
  }

  private async checkDuplicateSessions(): Promise<void> {
    try {
      const { data, error } = await this.supabase
        .rpc('find_duplicate_sessions'); // This would be a custom SQL function

      if (error && error.code !== 'PGRST202') { // Ignore if function doesn't exist
        this.addIssue('warning', 'integrity', 'Could not check for duplicate sessions: function not available');
        return;
      }

      if (data && data.length > 0) {
        this.addIssue('warning', 'integrity', 
          `Found ${data.length} potential duplicate sessions`,
          { samples: data.slice(0, 5) }
        );
      }
    } catch (error) {
      this.addIssue('info', 'integrity', 'Duplicate session check skipped: requires custom SQL function');
    }
  }

  private async checkIncompleteResponses(): Promise<void> {
    // Check for responses that seem incomplete based on timestamps
    const { data: responses, error } = await this.supabase
      .from('user_results')
      .select('session_id, created_at, funnel_id')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error || !responses) return;

    const sessionGroups = responses.reduce((groups, response) => {
      if (!groups[response.session_id]) {
        groups[response.session_id] = [];
      }
      groups[response.session_id].push(response);
      return groups;
    }, {} as Record<string, any[]>);

    const incompleteSessions = Object.keys(sessionGroups).filter(sessionId => {
      const sessionResponses = sessionGroups[sessionId];
      return sessionResponses.length < 5; // Assuming minimum 5 responses for complete quiz
    });

    if (incompleteSessions.length > 0) {
      this.addIssue('info', 'data', 
        `Found ${incompleteSessions.length} potentially incomplete sessions`,
        { sampleSessions: incompleteSessions.slice(0, 10) }
      );
    }
  }

  private async checkDataConsistency(): Promise<void> {
    // Check for responses with invalid funnel_ids
    const { data: invalidFunnelRefs, error } = await this.supabase
      .from('user_results')
      .select('funnel_id')
      .not('funnel_id', 'in', 
        `(SELECT id FROM quiz_definitions)`
      )
      .limit(10);

    if (!error && invalidFunnelRefs && invalidFunnelRefs.length > 0) {
      this.addIssue('error', 'integrity', 
        'Found responses referencing non-existent quiz definitions',
        { invalidRefs: invalidFunnelRefs }
      );
    }
  }

  private async auditPerformanceMetrics(): Promise<void> {
    console.log('⚡ Auditing performance metrics...');

    try {
      // Check table sizes
      const tables = ['quiz_definitions', 'user_results', 'component_instances'];
      
      for (const table of tables) {
        const { count, error } = await this.supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (!error) {
          this.addIssue('info', 'performance', 
            `Table ${table} has ${count} records`
          );

          if (count && count > 10000) {
            this.addIssue('warning', 'performance', 
              `Table ${table} is large (${count} records) - consider archiving or indexing`
            );
          }
        }
      }

      // Check for potential performance issues
      await this.checkPerformanceIssues();

    } catch (error) {
      this.addIssue('warning', 'performance', `Performance audit failed: ${error.message}`);
    }
  }

  private async checkPerformanceIssues(): Promise<void> {
    // Check for very large JSON schemas
    const { data: largeSchemas, error } = await this.supabase
      .from('quiz_definitions')
      .select('id, schema_json')
      .limit(100);

    if (largeSchemas) {
      const largeSchemasFound = largeSchemas.filter(quiz => {
        const schemaSize = JSON.stringify(quiz.schema_json).length;
        return schemaSize > 50000; // 50KB threshold
      });

      if (largeSchemasFound.length > 0) {
        this.addIssue('warning', 'performance', 
          `Found ${largeSchemasFound.length} quizzes with very large schemas (>50KB)`,
          { quizIds: largeSchemasFound.map(q => q.id) }
        );
      }
    }
  }

  private async assessMigrationReadiness(): Promise<void> {
    console.log('🚀 Assessing migration readiness...');

    const blockers = [];
    const warnings = [];

    // Check for critical errors
    const criticalErrors = this.report.issues.filter(issue => 
      issue.type === 'error' && 
      (issue.category === 'schema' || issue.category === 'integrity')
    );

    if (criticalErrors.length > 0) {
      blockers.push(`${criticalErrors.length} critical errors must be resolved`);
    }

    // Check data completeness
    if (this.report.summary.totalQuizzes === 0) {
      blockers.push('No quiz definitions found');
    }

    if (this.report.summary.validQuizzes / this.report.summary.totalQuizzes < 0.8) {
      warnings.push('Less than 80% of quiz definitions are valid');
    }

    // Check for missing indexes
    const performanceIssues = this.report.issues.filter(issue => 
      issue.category === 'performance' && issue.type === 'warning'
    );

    if (performanceIssues.length > 5) {
      warnings.push('Multiple performance issues detected - review before migration');
    }

    this.report.migrationReadiness = {
      ready: blockers.length === 0,
      blockers,
      warnings
    };
  }

  private generateRecommendations(): void {
    const recommendations = [];

    // Based on issues found
    const errorCount = this.report.issues.filter(i => i.type === 'error').length;
    const warningCount = this.report.issues.filter(i => i.type === 'warning').length;

    if (errorCount > 0) {
      recommendations.push(`Resolve ${errorCount} critical errors before proceeding`);
    }

    if (warningCount > 5) {
      recommendations.push('Review and address performance warnings');
    }

    // Data-specific recommendations
    if (this.report.summary.totalResponses > 10000) {
      recommendations.push('Consider implementing data archiving strategy');
    }

    if (this.report.summary.validQuizzes > 0 && this.report.summary.invalidQuizzes > 0) {
      recommendations.push('Clean up invalid quiz definitions before migration');
    }

    // Performance recommendations
    recommendations.push('Verify database indexes are in place');
    recommendations.push('Run backup before any migration');
    recommendations.push('Test migration on staging environment first');

    this.report.recommendations = recommendations;
  }

  private calculateDataIntegrityScore(): void {
    const totalIssues = this.report.issues.length;
    const errorWeight = 10;
    const warningWeight = 3;
    const infoWeight = 1;

    const errorCount = this.report.issues.filter(i => i.type === 'error').length;
    const warningCount = this.report.issues.filter(i => i.type === 'warning').length;
    const infoCount = this.report.issues.filter(i => i.type === 'info').length;

    const totalWeight = (errorCount * errorWeight) + (warningCount * warningWeight) + (infoCount * infoWeight);
    const maxPossibleWeight = Math.max(totalWeight, 100); // Baseline comparison

    this.report.summary.dataIntegrityScore = Math.max(0, Math.round(100 - (totalWeight / maxPossibleWeight * 100)));
  }

  private addIssue(type: AuditIssue['type'], category: AuditIssue['category'], message: string, details?: any): void {
    this.report.issues.push({
      type,
      category,
      message,
      details
    });
  }

  async saveReport(outputPath?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = outputPath || `audit-report-${timestamp}.json`;
    
    const reportData = {
      ...this.report,
      metadata: {
        auditVersion: '1.0.0',
        generatedBy: 'Quiz Quest Data Auditor',
        environment: process.env.NODE_ENV || 'development'
      }
    };

    fs.writeFileSync(filename, JSON.stringify(reportData, null, 2));
    console.log(`📄 Audit report saved to: ${filename}`);
    
    return filename;
  }

  printSummary(): void {
    console.log('\n🔍 AUDIT SUMMARY');
    console.log('================');
    console.log(`Total Quizzes: ${this.report.summary.totalQuizzes}`);
    console.log(`Valid Quizzes: ${this.report.summary.validQuizzes}`);
    console.log(`Total Responses: ${this.report.summary.totalResponses}`);
    console.log(`Data Integrity Score: ${this.report.summary.dataIntegrityScore}/100`);
    
    const errorCount = this.report.issues.filter(i => i.type === 'error').length;
    const warningCount = this.report.issues.filter(i => i.type === 'warning').length;
    
    console.log(`\nIssues Found:`);
    console.log(`  Errors: ${errorCount}`);
    console.log(`  Warnings: ${warningCount}`);
    
    console.log(`\nMigration Ready: ${this.report.migrationReadiness.ready ? '✅ Yes' : '❌ No'}`);
    
    if (this.report.migrationReadiness.blockers.length > 0) {
      console.log('\nBlockers:');
      this.report.migrationReadiness.blockers.forEach(blocker => {
        console.log(`  ❌ ${blocker}`);
      });
    }

    if (this.report.recommendations.length > 0) {
      console.log('\nRecommendations:');
      this.report.recommendations.forEach(rec => {
        console.log(`  💡 ${rec}`);
      });
    }
  }
}

// CLI Interface
async function main() {
  const auditor = new DataAuditor();
  
  try {
    const report = await auditor.runFullAudit();
    auditor.printSummary();
    
    const reportFile = await auditor.saveReport();
    console.log(`\nFull report available at: ${reportFile}`);
    
  } catch (error) {
    console.error('❌ Audit failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { DataAuditor, AuditReport, AuditIssue };