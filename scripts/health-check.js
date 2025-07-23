#!/usr/bin/env node

/**
 * Health check script
 * Demonstrates npm script for system monitoring
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

async function healthCheck() {
  console.log('🏥 Running health checks...');
  
  const checks = {
    server: false,
    database: false,
    logs: false,
    environment: false
  };
  
  // Check if server is running
  try {
    await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/health', (res) => {
        if (res.statusCode === 200) {
          checks.server = true;
          console.log('✅ Server: Running');
        } else {
          console.log('❌ Server: Not responding correctly');
        }
        resolve();
      });
      
      req.on('error', () => {
        console.log('❌ Server: Not running');
        resolve();
      });
      
      req.setTimeout(5000, () => {
        console.log('❌ Server: Timeout');
        resolve();
      });
    });
  } catch (error) {
    console.log('❌ Server: Error checking');
  }
  
  // Check database file
  const dbPath = path.join(__dirname, '../data/tasks.db');
  if (fs.existsSync(dbPath)) {
    checks.database = true;
    console.log('✅ Database: File exists');
  } else {
    console.log('❌ Database: File missing');
  }
  
  // Check logs directory
  const logsDir = path.join(__dirname, '../logs');
  if (fs.existsSync(logsDir)) {
    checks.logs = true;
    console.log('✅ Logs: Directory exists');
  } else {
    console.log('❌ Logs: Directory missing');
  }
  
  // Check environment file
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    checks.environment = true;
    console.log('✅ Environment: Configuration exists');
  } else {
    console.log('❌ Environment: No .env file');
  }
  
  // Summary
  const passed = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;
  
  console.log(`\n📊 Health Check Summary: ${passed}/${total} checks passed`);
  
  if (passed === total) {
    console.log('🎉 All systems healthy!');
    process.exit(0);
  } else {
    console.log('⚠️  Some issues detected');
    process.exit(1);
  }
}

if (require.main === module) {
  healthCheck();
}

module.exports = { healthCheck };
