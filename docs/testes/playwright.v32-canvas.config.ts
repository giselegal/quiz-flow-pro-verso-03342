import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for v3.2 Canvas Loading Tests
 * 
 * Specialized config for testing v3.2 JSON template loading
 * on the /editor canvas with screenshot capture
 */
export default defineConfig({
    testDir: './tests/e2e',
    testMatch: '**/editor-v32-canvas-loading.spec.ts',
    
    // Run tests sequentially for consistent state
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1,
    workers: 1,
    
    // Enhanced reporting for screenshots
    reporter: [
        ['html', { 
            outputFolder: 'test-results/v32-canvas-html',
            open: 'never'
        }],
        ['json', { 
            outputFile: 'test-results/v32-canvas-results.json' 
        }],
        ['list'],
        ['junit', { 
            outputFile: 'test-results/v32-canvas-junit.xml' 
        }]
    ],
    
    use: {
        baseURL: 'http://localhost:5173',
        
        // Always capture screenshots
        screenshot: 'on',
        
        // Capture video of failures
        video: 'retain-on-failure',
        
        // Enable tracing for debugging
        trace: 'on-first-retry',
        
        // Timeouts
        actionTimeout: 15000,
        navigationTimeout: 30000,
        
        // Viewport size for consistent screenshots
        viewport: { width: 1920, height: 1080 },
        
        // Browser context options
        colorScheme: 'light',
        locale: 'pt-BR',
    },
    
    // Test timeout: 3 minutes per test
    timeout: 180000,
    
    // Expect timeout
    expect: {
        timeout: 10000,
        toHaveScreenshot: {
            maxDiffPixels: 100,
        }
    },
    
    // Test on multiple browsers
    projects: [
        {
            name: 'chromium',
            use: { 
                ...devices['Desktop Chrome'],
                launchOptions: {
                    args: ['--disable-web-security'] // For local testing
                }
            },
        },
        // Uncomment to test on more browsers
        // {
        //     name: 'firefox',
        //     use: { ...devices['Desktop Firefox'] },
        // },
        // {
        //     name: 'webkit',
        //     use: { ...devices['Desktop Safari'] },
        // },
    ],
    
    // Web server configuration
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120000, // 2 minutes to start
        stdout: 'pipe',
        stderr: 'pipe',
    },
});
