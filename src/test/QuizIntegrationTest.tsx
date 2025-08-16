/**
 * 🧪 COMPREHENSIVE QUIZ INTEGRATION TEST
 * 
 * This test verifies that quiz logic, calculations, user name collection, 
 * and Supabase integration are properly connected as documented in the analysis.
 */

import React, { useState, useEffect } from 'react';
import { useQuizLogic } from '../src/hooks/useQuizLogic';
import { useUserName } from '../src/hooks/useUserName';
import { useEditorSupabase } from '../src/hooks/useEditorSupabase';
import { userResponseService } from '../src/services/userResponseService';
import { calculateQuizResult } from '../src/lib/quizEngine';
import { StyleCalculationEngine } from '../src/utils/styleCalculation';

// Mock data for testing
const mockQuizQuestions = [
  {
    id: 'q1',
    type: 'normal' as const,
    title: 'Test Question 1',
    options: [
      { id: 'opt1', text: 'Option 1', style: 'classico', weight: 1 },
      { id: 'opt2', text: 'Option 2', style: 'romântico', weight: 1 },
    ]
  }
];

const mockAnswers = [
  { questionId: 'q1', optionId: 'opt1' }
];

export const QuizIntegrationTest: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [testOutput, setTestOutput] = useState<string[]>([]);
  
  // Hooks under test
  const quizLogic = useQuizLogic();
  const userName = useUserName();
  const editorSupabase = useEditorSupabase();

  const addLog = (message: string) => {
    setTestOutput(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    console.log(message);
  };

  const updateTestResult = (testName: string, passed: boolean) => {
    setTestResults(prev => ({ ...prev, [testName]: passed }));
  };

  useEffect(() => {
    runIntegrationTests();
  }, []);

  const runIntegrationTests = async () => {
    addLog('🧪 Starting Comprehensive Quiz Integration Tests');

    // Test 1: Quiz Logic Hook Functions
    addLog('\n📝 Test 1: Quiz Logic Hook Functions');
    try {
      const hasRequiredFunctions = 
        typeof quizLogic.setUserNameFromInput === 'function' &&
        typeof quizLogic.answerQuestion === 'function' &&
        typeof quizLogic.completeQuiz === 'function' &&
        typeof quizLogic.calculateResults === 'function';
      
      updateTestResult('quizLogicFunctions', hasRequiredFunctions);
      addLog(hasRequiredFunctions ? '✅ Quiz logic functions available' : '❌ Missing quiz logic functions');
    } catch (error) {
      updateTestResult('quizLogicFunctions', false);
      addLog(`❌ Quiz logic test failed: ${error}`);
    }

    // Test 2: User Name Collection
    addLog('\n👤 Test 2: User Name Collection Flow');
    try {
      // Test local storage integration
      const testName = 'Test User Integration';
      quizLogic.setUserNameFromInput(testName);
      
      const storedName = localStorage.getItem('quizUserName');
      const userNameFromHook = userName;
      
      const nameFlowWorks = storedName === testName && userNameFromHook === testName;
      updateTestResult('userNameCollection', nameFlowWorks);
      addLog(nameFlowWorks ? '✅ User name collection flow working' : '❌ User name collection flow broken');
    } catch (error) {
      updateTestResult('userNameCollection', false);
      addLog(`❌ User name collection test failed: ${error}`);
    }

    // Test 3: Calculation Engines
    addLog('\n🧮 Test 3: Quiz Calculation Engines');
    try {
      // Test both calculation engines
      const quizEngineResult = calculateQuizResult(mockAnswers, mockQuizQuestions);
      const styleEngineResult = StyleCalculationEngine.calculateResult(
        [{ questionId: 'q1', selectedOptions: ['opt1'], timestamp: new Date() }],
        'Test User',
        mockQuizQuestions
      );
      
      const calculationsWork = 
        quizEngineResult && 
        quizEngineResult.primaryStyle &&
        styleEngineResult &&
        styleEngineResult.primaryStyle;
      
      updateTestResult('calculationEngines', calculationsWork);
      addLog(calculationsWork ? '✅ Both calculation engines working' : '❌ Calculation engines failed');
    } catch (error) {
      updateTestResult('calculationEngines', false);
      addLog(`❌ Calculation engines test failed: ${error}`);
    }

    // Test 4: Supabase Integration Hook
    addLog('\n🗄️ Test 4: Supabase Integration Hook');
    try {
      const hasSupabaseFunctions = 
        typeof editorSupabase.testConnection === 'function' &&
        typeof editorSupabase.addComponent === 'function' &&
        typeof editorSupabase.updateComponent === 'function';
      
      updateTestResult('supabaseHook', hasSupabaseFunctions);
      addLog(hasSupabaseFunctions ? '✅ Supabase hook functions available' : '❌ Missing Supabase hook functions');
    } catch (error) {
      updateTestResult('supabaseHook', false);
      addLog(`❌ Supabase hook test failed: ${error}`);
    }

    // Test 5: User Response Service
    addLog('\n💾 Test 5: User Response Service Integration');
    try {
      const hasServiceFunctions = 
        typeof userResponseService.createQuizUser === 'function' &&
        typeof userResponseService.saveResponse === 'function' &&
        typeof userResponseService.saveUserName === 'function';
      
      updateTestResult('userResponseService', hasServiceFunctions);
      addLog(hasServiceFunctions ? '✅ User response service functions available' : '❌ Missing user response service functions');
    } catch (error) {
      updateTestResult('userResponseService', false);
      addLog(`❌ User response service test failed: ${error}`);
    }

    // Test 6: End-to-End Flow Simulation
    addLog('\n🔄 Test 6: End-to-End Flow Simulation');
    try {
      // Simulate complete flow
      const testSessionId = `integration_test_${Date.now()}`;
      const testUserName = 'Integration Test User';
      
      // Step 1: Initialize quiz
      quizLogic.initializeQuiz(mockQuizQuestions);
      
      // Step 2: Set user name
      quizLogic.setUserNameFromInput(testUserName);
      
      // Step 3: Answer question
      quizLogic.answerQuestion('q1', 'opt1');
      
      // Step 4: Complete quiz
      quizLogic.completeQuiz();
      
      // Verify the flow worked
      const flowWorked = 
        quizLogic.userName === testUserName &&
        quizLogic.answers.length === 1 &&
        quizLogic.quizCompleted === true &&
        quizLogic.quizResult !== null;
      
      updateTestResult('endToEndFlow', flowWorked);
      addLog(flowWorked ? '✅ End-to-end flow working' : '❌ End-to-end flow broken');
    } catch (error) {
      updateTestResult('endToEndFlow', false);
      addLog(`❌ End-to-end flow test failed: ${error}`);
    }

    addLog('\n📊 Integration Test Summary Complete');
  };

  const allTestsPassed = Object.values(testResults).every(result => result === true);
  const testsCompleted = Object.keys(testResults).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧪 Quiz Integration Test Results</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Overall Status:</h2>
        <div className={`p-3 rounded-lg ${allTestsPassed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {testsCompleted === 6 ? 
            (allTestsPassed ? '✅ All integration tests passed!' : '⚠️ Some tests failed - check details below') :
            '🔄 Tests running...'
          }
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Test Results:</h2>
        <div className="space-y-2">
          {Object.entries(testResults).map(([testName, passed]) => (
            <div key={testName} className={`p-2 rounded ${passed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {passed ? '✅' : '❌'} {testName}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Test Output:</h2>
        <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
          <pre className="text-sm">
            {testOutput.join('\n')}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default QuizIntegrationTest;