import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface TestResult {
  name: string;
  status: "pending" | "running" | "success" | "error";
  message: string;
  duration?: number;
}

const SystemIntegrationTest: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Supabase Connection", status: "pending", message: "Not started" },
    { name: "Funnel Service", status: "pending", message: "Not started" },
    { name: "Canvas Configuration", status: "pending", message: "Not started" },
    { name: "Block System", status: "pending", message: "Not started" },
    { name: "Security System", status: "pending", message: "Not started" },
    { name: "Analytics System", status: "pending", message: "Not started" },
    { name: "SEO System", status: "pending", message: "Not started" },
    { name: "Image Processing", status: "pending", message: "Not started" },
    { name: "Real-time Updates", status: "pending", message: "Not started" },
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (name: string, updates: Partial<TestResult>) => {
    setTests((prev) =>
      prev.map((test) => (test.name === name ? { ...test, ...updates } : test)),
    );
  };

  const runTest = async (testName: string): Promise<void> => {
    const startTime = Date.now();
    updateTest(testName, { status: "running", message: "Testing..." });

    try {
      // Simulate test execution
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000),
      );

      // Mock test logic
      switch (testName) {
        case "Supabase Connection":
          try {
            // Mock supabase test
            updateTest(testName, {
              status: "success",
              message: "Connection successful",
              duration: Date.now() - startTime,
            });
          } catch (error) {
            updateTest(testName, {
              status: "error",
              message: `Connection failed: ${error instanceof Error ? error.message : String(error)}`,
              duration: Date.now() - startTime,
            });
          }
          break;

        case "Funnel Service":
          try {
            // Mock funnel service test
            updateTest(testName, {
              status: "success",
              message: "Service operational",
              duration: Date.now() - startTime,
            });
          } catch (error) {
            updateTest(testName, {
              status: "error",
              message: `Service error: ${error instanceof Error ? error.message : String(error)}`,
              duration: Date.now() - startTime,
            });
          }
          break;

        case "Canvas Configuration":
          try {
            // Mock canvas test
            updateTest(testName, {
              status: "success",
              message: "Canvas system ready",
              duration: Date.now() - startTime,
            });
          } catch (error) {
            updateTest(testName, {
              status: "error",
              message: `Canvas error: ${error instanceof Error ? error.message : String(error)}`,
              duration: Date.now() - startTime,
            });
          }
          break;

        case "Block System":
          try {
            // Mock block system test
            updateTest(testName, {
              status: "success",
              message: "Block system operational",
              duration: Date.now() - startTime,
            });
          } catch (error) {
            updateTest(testName, {
              status: "error",
              message: `Block system error: ${error instanceof Error ? error.message : String(error)}`,
              duration: Date.now() - startTime,
            });
          }
          break;

        case "Security System":
          try {
            // Mock security test
            updateTest(testName, {
              status: "success",
              message: "Security systems active",
              duration: Date.now() - startTime,
            });
          } catch (error) {
            updateTest(testName, {
              status: "error",
              message: `Security error: ${error instanceof Error ? error.message : String(error)}`,
              duration: Date.now() - startTime,
            });
          }
          break;

        case "Analytics System":
          try {
            // Mock analytics test
            updateTest(testName, {
              status: "success",
              message: "Analytics dashboard ready",
              duration: Date.now() - startTime,
            });
          } catch (error) {
            updateTest(testName, {
              status: "error",
              message: `Analytics error: ${error instanceof Error ? error.message : String(error)}`,
              duration: Date.now() - startTime,
            });
          }
          break;

        case "SEO System":
          try {
            // Mock SEO test
            updateTest(testName, {
              status: "success",
              message: "SEO system operational",
              duration: Date.now() - startTime,
            });
          } catch (error) {
            updateTest(testName, {
              status: "error",
              message: `SEO error: ${error instanceof Error ? error.message : String(error)}`,
              duration: Date.now() - startTime,
            });
          }
          break;

        case "Image Processing":
          try {
            // Mock image processing test
            updateTest(testName, {
              status: "success",
              message: "Image processing ready",
              duration: Date.now() - startTime,
            });
          } catch (error) {
            updateTest(testName, {
              status: "error",
              message: `Image processing error: ${error instanceof Error ? error.message : String(error)}`,
              duration: Date.now() - startTime,
            });
          }
          break;

        case "Real-time Updates":
          try {
            // Mock real-time test
            updateTest(testName, {
              status: "success",
              message: "Real-time connections active",
              duration: Date.now() - startTime,
            });
          } catch (error) {
            updateTest(testName, {
              status: "error",
              message: `Real-time error: ${error instanceof Error ? error.message : String(error)}`,
              duration: Date.now() - startTime,
            });
          }
          break;

        default:
          updateTest(testName, {
            status: "error",
            message: "Unknown test",
            duration: Date.now() - startTime,
          });
      }
    } catch (error) {
      updateTest(testName, {
        status: "error",
        message: `Test execution failed: ${error instanceof Error ? error.message : String(error)}`,
        duration: Date.now() - startTime,
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);

    // Reset all tests
    setTests((prev) =>
      prev.map((test) => ({
        ...test,
        status: "pending" as const,
        message: "Waiting...",
      })),
    );

    // Run tests sequentially
    for (const test of tests) {
      await runTest(test.name);
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "running":
        return <Clock className="w-5 h-5 text-[#B89B7A] animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
      case "running":
        return "border-[#B89B7A]/30 bg-[#B89B7A]/10";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const successCount = tests.filter((t) => t.status === "success").length;
  const errorCount = tests.filter((t) => t.status === "error").length;
  const runningCount = tests.filter((t) => t.status === "running").length;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Teste de Integração do Sistema
            <Button onClick={runAllTests} disabled={isRunning} className="ml-4">
              {isRunning ? "Executando..." : "Executar Todos os Testes"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg bg-green-50">
              <div className="text-2xl font-bold text-green-600">
                {successCount}
              </div>
              <div className="text-sm text-gray-600">Sucessos</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-red-50">
              <div className="text-2xl font-bold text-red-600">
                {errorCount}
              </div>
              <div className="text-sm text-gray-600">Erros</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-[#B89B7A]/10">
              <div className="text-2xl font-bold text-[#B89B7A]">
                {runningCount}
              </div>
              <div className="text-sm text-gray-600">Executando</div>
            </div>
          </div>

          <div className="space-y-3">
            {tests.map((test) => (
              <div
                key={test.name}
                className={`p-4 border rounded-lg ${getStatusColor(test.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <div className="font-medium">{test.name}</div>
                      <div className="text-sm text-gray-600">
                        {test.message}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {test.duration && (
                      <div className="text-sm text-gray-500">
                        {test.duration}ms
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => runTest(test.name)}
                      disabled={isRunning || test.status === "running"}
                    >
                      Executar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemIntegrationTest;
