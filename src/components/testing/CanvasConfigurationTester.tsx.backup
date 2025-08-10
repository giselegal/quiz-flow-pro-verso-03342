import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCanvasConfiguration } from "@/hooks/useCanvasConfiguration";

interface CanvasConfiguration {
  width: number;
  height: number;
  backgroundColor: string;
  padding: number;
  components: any[];
  type?: string;
}

export const CanvasConfigurationTester: React.FC = () => {
  const {
    configuration,
    updateConfiguration,
    addComponent,
    removeComponent,
    validateAllSteps,
    isStep20Loaded,
    loadAndApplyStep20,
    getResultComponents,
    config,
    isStep21Loaded,
    loadAndApplyStep21,
    getOfferComponents,
  } = useCanvasConfiguration();

  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testStep20 = () => {
    try {
      addTestResult("Testing Step 20 Canvas...");
      loadAndApplyStep20();
      const components = getResultComponents();
      addTestResult(`Step 20: ${components.length} result components found`);
      addTestResult(`Step 20 loaded: ${isStep20Loaded}`);
    } catch (error) {
      addTestResult(`Error in Step 20: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const testStep21 = () => {
    try {
      addTestResult("Testing Step 21 Canvas...");
      loadAndApplyStep21();
      const components = getOfferComponents();
      addTestResult(`Step 21: ${components.length} offer components found`);
      addTestResult(`Step 21 loaded: ${isStep21Loaded}`);
    } catch (error) {
      addTestResult(`Error in Step 21: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const testValidation = () => {
    try {
      const result = validateAllSteps();
      addTestResult(`Validation result: ${result.isValid ? "PASSED" : "FAILED"}`);
      if (result.errors.length > 0) {
        addTestResult(`Errors: ${result.errors.join(", ")}`);
      }
    } catch (error) {
      addTestResult(`Validation error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const addTestComponent = () => {
    const testComponent = {
      id: `test-component-${Date.now()}`,
      type: "result",
      data: { text: "Test component" },
    };
    addComponent(testComponent);
    addTestResult(`Added component: ${testComponent.id}`);
  };

  const removeTestComponent = (index: number) => {
    try {
      removeComponent(index);
      addTestResult(`Removed component at index: ${index}`);
    } catch (error) {
      addTestResult(
        `Error removing component: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Canvas Configuration Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Step 20 (Result)</h4>
              <div className="space-y-2 text-sm">
                <div>Status: {isStep20Loaded ? "✅ Loaded" : "❌ Not Loaded"}</div>
                <div>Components: {getResultComponents().length}</div>
                <Button onClick={testStep20} size="sm">
                  Test Step 20
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Step 21 (Offer)</h4>
              <div className="space-y-2 text-sm">
                <div>Status: {isStep21Loaded ? "✅ Loaded" : "❌ Not Loaded"}</div>
                <div>Components: {getOfferComponents().length}</div>
                <Button onClick={testStep21} size="sm">
                  Test Step 21
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={testValidation}>Validate All Steps</Button>
            <Button onClick={addTestComponent}>Add Test Component</Button>
            <Button
              onClick={() => removeTestComponent(0)}
              disabled={configuration.components.length === 0}
              variant="destructive"
            >
              Remove First Component
            </Button>
          </div>

          <div>
            <h4 className="font-medium mb-2">Configuration Status</h4>
            <div className="text-sm space-y-1">
              <div>
                Canvas Size: {configuration.width} x {configuration.height}
              </div>
              <div>Components: {configuration.components.length}</div>
              <div>Background: {configuration.backgroundColor}</div>
              <div>Padding: {configuration.padding}px</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Test Results</h4>
            <div className="max-h-40 overflow-y-auto border rounded p-2 text-sm bg-gray-50">
              {testResults.length === 0 ? (
                <div className="text-gray-500">No tests run yet...</div>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="border-b pb-1 mb-1 last:border-b-0">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>

          {configuration.components.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Current Components</h4>
              <div className="space-y-1 text-sm">
                {configuration.components.map((component: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-100 rounded"
                  >
                    <span>
                      {component.type || "Unknown"} - {component.id}
                    </span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeTestComponent(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CanvasConfigurationTester;
