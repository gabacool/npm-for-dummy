/**
 * AI Task Analyzer - Simulates AI analysis of task descriptions
 * In production, this would connect to real AI services like OpenAI, Claude, etc.
 */

const { logger } = require('../utils/logger');

/**
 * Analyze a task description using simulated AI
 * @param {string} taskDescription - The task description to analyze
 * @returns {Promise<Object>} Analysis results
 */
async function aiAnalyzeTask(taskDescription) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const analysis = {
    sentiment: analyzeSentiment(taskDescription),
    priority: estimatePriority(taskDescription),
    category: categorizeTask(taskDescription),
    estimatedTime: estimateTimeToComplete(taskDescription),
    complexity: assessComplexity(taskDescription),
    keywords: extractKeywords(taskDescription),
    suggestions: generateImprovementSuggestions(taskDescription)
  };
  
  logger.info(`AI analysis completed for task: ${taskDescription.substring(0, 30)}...`);
  return analysis;
}

/**
 * Analyze sentiment of task description
 */
function analyzeSentiment(text) {
  const positiveWords = ['easy', 'simple', 'fun', 'exciting', 'quick', 'straightforward'];
  const negativeWords = ['difficult', 'complex', 'urgent', 'critical', 'challenging', 'hard'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}

/**
 * Estimate task priority based on keywords
 */
function estimatePriority(text) {
  const highPriorityWords = ['urgent', 'critical', 'asap', 'emergency', 'deadline'];
  const lowPriorityWords = ['someday', 'maybe', 'eventually', 'nice to have'];
  
  const lowerText = text.toLowerCase();
  
  if (highPriorityWords.some(word => lowerText.includes(word))) {
    return 'high';
  }
  if (lowPriorityWords.some(word => lowerText.includes(word))) {
    return 'low';
  }
  return 'medium';
}
/**
 * Categorize task based on content
 */
function categorizeTask(text) {
  const categories = {
    'development': ['code', 'programming', 'development', 'bug', 'feature', 'api'],
    'design': ['design', 'ui', 'ux', 'mockup', 'wireframe', 'prototype'],
    'meeting': ['meeting', 'call', 'discussion', 'standup', 'review'],
    'documentation': ['documentation', 'docs', 'readme', 'guide', 'manual'],
    'testing': ['test', 'testing', 'qa', 'quality', 'validation'],
    'deployment': ['deploy', 'deployment', 'release', 'publish', 'production']
  };
  
  const lowerText = text.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }
  
  return 'general';
}

/**
 * Estimate time to complete task
 */
function estimateTimeToComplete(text) {
  const quickWords = ['quick', 'simple', 'easy', 'small'];
  const longWords = ['complex', 'difficult', 'large', 'comprehensive'];
  
  const lowerText = text.toLowerCase();
  const wordCount = text.split(/\s+/).length;
  
  let baseTime = Math.max(30, wordCount * 5); // Base time in minutes
  
  if (quickWords.some(word => lowerText.includes(word))) {
    baseTime *= 0.5;
  }
  if (longWords.some(word => lowerText.includes(word))) {
    baseTime *= 2;
  }
  
  return `${Math.round(baseTime)} minutes`;
}

/**
 * Assess task complexity
 */
function assessComplexity(text) {
  const complexityIndicators = {
    'low': ['simple', 'easy', 'quick', 'basic'],
    'medium': ['moderate', 'standard', 'normal'],
    'high': ['complex', 'difficult', 'advanced', 'comprehensive', 'integration']
  };
  
  const lowerText = text.toLowerCase();
  
  for (const [level, indicators] of Object.entries(complexityIndicators)) {
    if (indicators.some(indicator => lowerText.includes(indicator))) {
      return level;
    }
  }
  
  // Default complexity based on text length
  if (text.length < 50) return 'low';
  if (text.length < 150) return 'medium';
  return 'high';
}

/**
 * Extract keywords from task description
 */
function extractKeywords(text) {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
    .slice(0, 5);
}

/**
 * Generate improvement suggestions
 */
function generateImprovementSuggestions(text) {
  const suggestions = [];
  
  if (text.length < 20) {
    suggestions.push('Consider adding more details to better understand the task scope');
  }
  
  if (!text.includes('deadline') && !text.includes('due')) {
    suggestions.push('Consider adding a deadline or target completion date');
  }
  
  if (text.length > 200) {
    suggestions.push('Consider breaking this into smaller, more manageable sub-tasks');
  }
  
  const hasActionVerb = ['create', 'build', 'design', 'implement', 'fix', 'update', 'review'].some(verb => 
    text.toLowerCase().includes(verb)
  );
  
  if (!hasActionVerb) {
    suggestions.push('Consider starting with an action verb (create, build, fix, etc.) for clarity');
  }
  
  return suggestions;
}

module.exports = {
  aiAnalyzeTask
};
