import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CanvasConfiguration {
  steps: any[];
  components: any[];
}

export const CanvasConfigurationTesterFixed: React.FC = () => {
  const [configuration, setConfiguration] = useState<CanvasConfiguration>({
    steps: [],
    components: [],
  });

  const [testResults, setTestResults] = useState<string[]>([]);

  const updateConfiguration = (updates: Partial<CanvasConfiguration>) => {
    setConfiguration((prev) => ({ ...prev, ...updates }));
  };

  const addComponent = (component: any) => {
    setConfiguration((prev) => ({
      ...prev,
      components: [...prev.components, component],
    }));
  };

  const removeComponent = (index: number) => {
    setConfiguration((prev) => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index),
    }));
  };

  const validateAllSteps = () => {
    const isValid = configuration.steps.length > 0;
    setTestResults((prev) => [
      ...prev,
      `Validation: ${isValid ? "PASS" : "FAIL"}`,
    ]);
    return { isValid, errors: isValid ? [] : ["No steps configured"] };
  };

  const runTest = (testName: string) => {
    try {
      setTestResults((prev) => [...prev, `${testName}: Started`]);
      validateAllSteps();
      setTestResults((prev) => [...prev, `${testName}: Completed`]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setTestResults((prev) => [
        ...prev,
        `${testName}: Error - ${errorMessage}`,
      ]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Canvas Configuration Tester (Fixed)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => runTest("Step 20 Test")}>
              Test Step 20
            </Button>
            <Button onClick={() => runTest("Step 21 Test")}>
              Test Step 21
            </Button>
            <Button onClick={() => validateAllSteps()}>
              Validate All Steps
            </Button>
          </div>

          <div>
            <h4 className="font-medium">Configuration Status:</h4>
            <p className="text-sm">Steps: {configuration.steps.length}</p>
            <p className="text-sm">
              Components: {configuration.components.length}
            </p>
          </div>

          <div>
            <h4 className="font-medium">Test Results:</h4>
            <ul className="text-sm max-h-40 overflow-y-auto">
              {testResults.map((result, index) => (
                <li key={index} className="border-b py-1">
                  {result}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CanvasConfigurationTesterFixed;
