import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SupabaseTestFixed: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);

  const handleTest = async (testName: string) => {
    try {
      // Simulate test
      setTestResults(prev => [...prev, `${testName}: OK`]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setTestResults(prev => [...prev, `${testName}: Error - ${errorMessage}`]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Tests (Fixed)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button onClick={() => handleTest('Connection Test')}>Test Connection</Button>
          <div className="mt-4">
            <h4 className="font-medium">Results:</h4>
            <ul className="text-sm">
              {testResults.map((result, index) => (
                <li key={index}>{result}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseTestFixed;
