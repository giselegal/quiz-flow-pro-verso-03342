#!/usr/bin/env node

/**
 * 🏥 HEALTH CHECK SCRIPT
 * 
 * Script para verificar a saúde da aplicação
 * Pode ser usado localmente ou em CI/CD
 */

const http = require('http');
const https = require('https');
const { performance } = require('perf_hooks');

// Configuração
const CONFIG = {
  DEFAULT_URL: process.env.HEALTH_CHECK_URL || 'http://localhost:5173',
  TIMEOUT: parseInt(process.env.HEALTH_TIMEOUT || '30000'),
  MAX_RESPONSE_TIME: parseInt(process.env.MAX_RESPONSE_TIME || '5000'),
  RETRY_COUNT: parseInt(process.env.RETRY_COUNT || '3'),
  RETRY_DELAY: parseInt(process.env.RETRY_DELAY || '2000'),
};

/**
 * Realiza uma requisição HTTP/HTTPS
 */
function makeRequest(url, timeout = CONFIG.TIMEOUT) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.get(url, {
      timeout,
      headers: {
        'User-Agent': 'HealthCheck/1.0',
        'Accept': 'text/html,application/json',
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          responseTime,
          data: data.substring(0, 1000), // Primeiros 1000 chars
        });
      });
    });
    
    req.on('error', (error) => {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      reject({
        error: error.message,
        responseTime,
        code: error.code,
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject({
        error: 'Request timeout',
        responseTime: timeout,
        code: 'TIMEOUT',
      });
    });
  });
}

/**
 * Verifica a saúde básica da aplicação
 */
async function basicHealthCheck(url) {
  console.log(`🔍 Checking health of: ${url}`);
  
  try {
    const result = await makeRequest(url);
    
    // Verificar status HTTP
    if (result.statusCode >= 200 && result.statusCode < 300) {
      console.log(`✅ HTTP Status: ${result.statusCode} ${result.statusMessage}`);
    } else {
      throw new Error(`HTTP ${result.statusCode}: ${result.statusMessage}`);
    }
    
    // Verificar tempo de resposta
    if (result.responseTime <= CONFIG.MAX_RESPONSE_TIME) {
      console.log(`✅ Response time: ${result.responseTime}ms`);
    } else {
      console.log(`⚠️ Slow response time: ${result.responseTime}ms (max: ${CONFIG.MAX_RESPONSE_TIME}ms)`);
    }
    
    // Verificar se há conteúdo básico
    if (result.data.length > 100) {
      console.log(`✅ Content length: ${result.data.length} chars`);
    } else {
      console.log(`⚠️ Minimal content: ${result.data.length} chars`);
    }
    
    // Verificar cabeçalhos de segurança básicos
    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'content-security-policy',
    ];
    
    const presentHeaders = securityHeaders.filter(header => 
      result.headers[header] || result.headers[header.toLowerCase()]
    );
    
    if (presentHeaders.length > 0) {
      console.log(`✅ Security headers: ${presentHeaders.join(', ')}`);
    } else {
      console.log(`⚠️ No security headers detected`);
    }
    
    return {
      success: true,
      statusCode: result.statusCode,
      responseTime: result.responseTime,
      contentLength: result.data.length,
      securityHeaders: presentHeaders.length,
    };
    
  } catch (error) {
    console.log(`❌ Health check failed: ${error.error || error.message}`);
    return {
      success: false,
      error: error.error || error.message,
      responseTime: error.responseTime || 0,
    };
  }
}

/**
 * Verifica múltiplos endpoints
 */
async function multiEndpointCheck(baseUrl) {
  const endpoints = [
    '/',
    '/editor',
    '/favicon.ico',
  ];
  
  console.log(`\n🔍 Checking multiple endpoints...`);
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const url = new URL(endpoint, baseUrl).toString();
    console.log(`\nChecking: ${endpoint}`);
    
    try {
      const result = await makeRequest(url, 10000); // Timeout menor para endpoints individuais
      
      if (result.statusCode >= 200 && result.statusCode < 400) {
        console.log(`✅ ${endpoint}: ${result.statusCode} (${result.responseTime}ms)`);
        results.push({ endpoint, success: true, statusCode: result.statusCode, responseTime: result.responseTime });
      } else {
        console.log(`⚠️ ${endpoint}: ${result.statusCode} (${result.responseTime}ms)`);
        results.push({ endpoint, success: false, statusCode: result.statusCode, responseTime: result.responseTime });
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.error || error.message}`);
      results.push({ endpoint, success: false, error: error.error || error.message });
    }
  }
  
  return results;
}

/**
 * Health check com retry
 */
async function healthCheckWithRetry(url, retries = CONFIG.RETRY_COUNT) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`\n🔄 Attempt ${attempt}/${retries}`);
    
    const result = await basicHealthCheck(url);
    
    if (result.success) {
      return result;
    }
    
    if (attempt < retries) {
      console.log(`⏳ Retrying in ${CONFIG.RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
    }
  }
  
  throw new Error(`Health check failed after ${retries} attempts`);
}

/**
 * Função principal
 */
async function main() {
  const url = process.argv[2] || CONFIG.DEFAULT_URL;
  const skipRetry = process.argv.includes('--no-retry');
  const multiCheck = process.argv.includes('--multi');
  
  console.log('🏥 HEALTH CHECK STARTED');
  console.log('=' .repeat(50));
  console.log(`Target URL: ${url}`);
  console.log(`Timeout: ${CONFIG.TIMEOUT}ms`);
  console.log(`Max Response Time: ${CONFIG.MAX_RESPONSE_TIME}ms`);
  console.log(`Retries: ${skipRetry ? 0 : CONFIG.RETRY_COUNT}`);
  console.log('=' .repeat(50));
  
  try {
    let result;
    
    if (skipRetry) {
      result = await basicHealthCheck(url);
    } else {
      result = await healthCheckWithRetry(url);
    }
    
    // Multi-endpoint check
    if (multiCheck) {
      const multiResults = await multiEndpointCheck(url);
      const successCount = multiResults.filter(r => r.success).length;
      console.log(`\n📊 Multi-endpoint results: ${successCount}/${multiResults.length} successful`);
    }
    
    console.log('\n' + '=' .repeat(50));
    
    if (result.success) {
      console.log('✅ HEALTH CHECK PASSED');
      console.log(`📊 Status: ${result.statusCode}`);
      console.log(`⚡ Response Time: ${result.responseTime}ms`);
      console.log(`📄 Content: ${result.contentLength} chars`);
      console.log(`🔒 Security Headers: ${result.securityHeaders}`);
      process.exit(0);
    } else {
      console.log('❌ HEALTH CHECK FAILED');
      process.exit(1);
    }
    
  } catch (error) {
    console.log('\n' + '=' .repeat(50));
    console.log(`❌ HEALTH CHECK ERROR: ${error.message}`);
    process.exit(1);
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  basicHealthCheck,
  multiEndpointCheck,
  healthCheckWithRetry,
};