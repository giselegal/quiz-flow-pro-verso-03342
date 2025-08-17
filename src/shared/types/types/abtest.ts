export type ABTestVariant = 'A' | 'B';

export interface ABTestConfig {
  testName: string;
  variantA: {
    route: string;
    description: string;
  };
  variantB: {
    route: string;
    description: string;
  };
  trafficSplit: number;
}

export interface ABTestResult {
  variant: ABTestVariant;
  route: string;
  description: string;
  trackConversion: (conversionType: string, additionalData?: Record<string, any>) => void;
}
