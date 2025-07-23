#!/usr/bin/env node

/**
 * AI setup script
 * Demonstrates npm script for AI service configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🤖 Setting up AI services...');

// Create AI configuration directory
const aiConfigDir = path.join(__dirname, '../config/ai');
if (!fs.existsSync(aiConfigDir)) {
  fs.mkdirSync(aiConfigDir, { recursive: true });
  console.log('✅ Created AI config directory');
}

// Create AI models configuration
const aiModelsConfig = {
  "default": {
    "provider": "simulated",
    "model": "demo-ai-v1",
    "temperature": 0.7,
    "maxTokens": 1000,
    "enabled": true
  },
  "production": {
    "provider": "openai",
    "model": "gpt-3.5-turbo",
    "temperature": 0.7,
    "maxTokens": 1000,
    "enabled": false,
    "note": "Set OPENAI_API_KEY in .env to enable"
  },
  "alternative": {
    "provider": "anthropic",
    "model": "claude-3-sonnet",
    "temperature": 0.7,
    "maxTokens": 1000,
    "enabled": false,
    "note": "Set ANTHROPIC_API_KEY in .env to enable"
  }
};

const aiConfigPath = path.join(aiConfigDir, 'models.json');
fs.writeFileSync(aiConfigPath, JSON.stringify(aiModelsConfig, null, 2));
console.log('✅ Created AI models configuration');

// Create AI prompts configuration
const aiPromptsConfig = {
  "taskAnalysis": {
    "system": "You are an AI assistant specialized in analyzing tasks and providing insights.",
    "template": "Analyze this task: {description}\n\nProvide insights on priority, complexity, and time estimation."
  },
  "suggestions": {
    "system": "You are a productivity expert providing task management suggestions.",
    "template": "Based on these tasks: {tasks}\n\nProvide suggestions for better productivity and organization."
  },
  "summary": {
    "system": "You are an AI assistant that creates progress summaries.",
    "template": "Summarize the progress for these tasks: {tasks}\n\nProvide insights and recommendations."
  }
};

const promptsConfigPath = path.join(aiConfigDir, 'prompts.json');
fs.writeFileSync(promptsConfigPath, JSON.stringify(aiPromptsConfig, null, 2));
console.log('✅ Created AI prompts configuration');

// Create AI service status file
const aiStatus = {
  "initialized": true,
  "timestamp": new Date().toISOString(),
  "version": "1.0.0",
  "features": [
    "Task Analysis",
    "Smart Suggestions", 
    "Progress Summarization",
    "Batch Processing"
  ]
};

const statusPath = path.join(aiConfigDir, 'status.json');
fs.writeFileSync(statusPath, JSON.stringify(aiStatus, null, 2));
console.log('✅ Created AI service status');

console.log('🎉 AI setup complete!');
console.log('');
console.log('AI Features Available:');
console.log('• Task Analysis - Analyze task descriptions');
console.log('• Smart Suggestions - Get productivity recommendations');  
console.log('• Progress Summary - AI-generated progress reports');
console.log('• Batch Processing - Process multiple tasks at once');
console.log('');
console.log('To enable real AI integration:');
console.log('1. Add API keys to .env file');
console.log('2. Update config/ai/models.json');
console.log('3. Restart the application');
