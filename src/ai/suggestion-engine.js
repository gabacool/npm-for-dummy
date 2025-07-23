/**
 * AI Suggestion Engine - Generates intelligent suggestions for task management
 */

const { logger } = require('../utils/logger');

/**
 * Generate AI-powered suggestions for task improvement
 * @param {Array} tasks - Array of task objects
 * @returns {Promise<Array>} Array of suggestions
 */
async function aiGenerateSuggestions(tasks) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const suggestions = [];
  
  // Analyze task patterns
  const patterns = analyzeTaskPatterns(tasks);
  
  // Generate priority suggestions
  suggestions.push(...generatePrioritySuggestions(tasks));
  
  // Generate productivity suggestions
  suggestions.push(...generateProductivitySuggestions(patterns));
  
  // Generate organization suggestions
  suggestions.push(...generateOrganizationSuggestions(tasks));
  
  // Generate time management suggestions
  suggestions.push(...generateTimeManagementSuggestions(tasks));
  
  logger.info(`Generated ${suggestions.length} AI suggestions`);
  return suggestions;
}

/**
 * Analyze patterns in user's tasks
 */
function analyzeTaskPatterns(tasks) {
  const patterns = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    highPriorityTasks: tasks.filter(t => t.priority === 'high').length,
    categoryCounts: {},
    averageDescriptionLength: 0,
    tasksWithoutDeadlines: 0
  };
  
  // Calculate category distribution
  tasks.forEach(task => {
    const category = categorizeTaskByContent(task.description);
    patterns.categoryCounts[category] = (patterns.categoryCounts[category] || 0) + 1;
    
    patterns.averageDescriptionLength += task.description.length;
    
    if (!task.description.toLowerCase().includes('deadline') && 
        !task.description.toLowerCase().includes('due')) {
      patterns.tasksWithoutDeadlines++;
    }
  });
  
  patterns.averageDescriptionLength = Math.round(patterns.averageDescriptionLength / tasks.length);
  patterns.completionRate = tasks.length > 0 ? patterns.completedTasks / tasks.length : 0;
  
  return patterns;
}

/**
 * Generate priority-based suggestions
 */
function generatePrioritySuggestions(tasks) {
  const suggestions = [];
  
  const highPriorityIncomplete = tasks.filter(t => t.priority === 'high' && !t.completed);
  
  if (highPriorityIncomplete.length > 3) {
    suggestions.push({
      type: 'priority',
      level: 'warning',
      title: 'High Priority Task Overload',
      message: `You have ${highPriorityIncomplete.length} high-priority tasks. Consider reviewing if all are truly urgent.`,
      action: 'Review and potentially downgrade some tasks to medium priority'
    });
  }
  
  const lowPriorityOld = tasks.filter(t => {
    const daysDiff = Math.floor((new Date() - new Date(t.created_at)) / (1000 * 60 * 60 * 24));
    return t.priority === 'low' && daysDiff > 7 && !t.completed;
  });
  
  if (lowPriorityOld.length > 0) {
    suggestions.push({
      type: 'priority',
      level: 'info',
      title: 'Stale Low Priority Tasks',
      message: `You have ${lowPriorityOld.length} low-priority tasks older than a week.`,
      action: 'Consider completing or removing these tasks to maintain focus'
    });
  }
  
  return suggestions;
}
/**
 * Generate productivity suggestions
 */
function generateProductivitySuggestions(patterns) {
  const suggestions = [];
  
  if (patterns.completionRate < 0.3) {
    suggestions.push({
      type: 'productivity',
      level: 'warning',
      title: 'Low Task Completion Rate',
      message: `Your completion rate is ${Math.round(patterns.completionRate * 100)}%. This might indicate task overload.`,
      action: 'Consider breaking large tasks into smaller, manageable chunks'
    });
  }
  
  if (patterns.averageDescriptionLength < 20) {
    suggestions.push({
      type: 'productivity',
      level: 'info',
      title: 'Task Descriptions Too Brief',
      message: 'Your task descriptions are quite short, which might lead to unclear objectives.',
      action: 'Add more detail to task descriptions for better clarity'
    });
  }
  
  if (patterns.tasksWithoutDeadlines > patterns.totalTasks * 0.7) {
    suggestions.push({
      type: 'productivity',
      level: 'info',
      title: 'Missing Deadlines',
      message: 'Most of your tasks don\'t have deadlines, which can hurt prioritization.',
      action: 'Consider adding target completion dates to your tasks'
    });
  }
  
  return suggestions;
}

/**
 * Generate organization suggestions
 */
function generateOrganizationSuggestions(tasks) {
  const suggestions = [];
  
  const categories = {};
  tasks.forEach(task => {
    const category = categorizeTaskByContent(task.description);
    categories[category] = (categories[category] || 0) + 1;
  });
  
  const categoryCount = Object.keys(categories).length;
  
  if (categoryCount > 5) {
    suggestions.push({
      type: 'organization',
      level: 'info',
      title: 'Many Task Categories',
      message: `You have tasks across ${categoryCount} different categories.`,
      action: 'Consider using tags or projects to better organize related tasks'
    });
  }
  
  // Find dominant category
  const dominantCategory = Object.entries(categories)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (dominantCategory && dominantCategory[1] > tasks.length * 0.6) {
    suggestions.push({
      type: 'organization',
      level: 'info',
      title: `${dominantCategory[0]} Task Focus`,
      message: `Most of your tasks are ${dominantCategory[0]}-related.`,
      action: 'Consider batching similar tasks for more efficient workflow'
    });
  }
  
  return suggestions;
}

/**
 * Generate time management suggestions
 */
function generateTimeManagementSuggestions(tasks) {
  const suggestions = [];
  
  const recentTasks = tasks.filter(task => {
    const daysDiff = Math.floor((new Date() - new Date(task.created_at)) / (1000 * 60 * 60 * 24));
    return daysDiff <= 1;
  });
  
  if (recentTasks.length > 10) {
    suggestions.push({
      type: 'time-management',
      level: 'warning',
      title: 'High Task Creation Rate',
      message: `You've created ${recentTasks.length} tasks in the last day.`,
      action: 'Consider if you\'re taking on too much or if tasks should be combined'
    });
  }
  
  const oldIncompleteTasks = tasks.filter(task => {
    const daysDiff = Math.floor((new Date() - new Date(task.created_at)) / (1000 * 60 * 60 * 24));
    return daysDiff > 14 && !task.completed;
  });
  
  if (oldIncompleteTasks.length > 0) {
    suggestions.push({
      type: 'time-management',
      level: 'info',
      title: 'Old Incomplete Tasks',
      message: `You have ${oldIncompleteTasks.length} tasks older than 2 weeks that are still incomplete.`,
      action: 'Review these tasks - they might need to be updated, delegated, or removed'
    });
  }
  
  return suggestions;
}

/**
 * Simple task categorization helper
 */
function categorizeTaskByContent(description) {
  const categories = {
    'development': ['code', 'programming', 'development', 'bug', 'feature', 'api'],
    'design': ['design', 'ui', 'ux', 'mockup', 'wireframe'],
    'meeting': ['meeting', 'call', 'discussion', 'standup'],
    'documentation': ['documentation', 'docs', 'readme', 'guide'],
    'testing': ['test', 'testing', 'qa', 'quality'],
    'deployment': ['deploy', 'deployment', 'release', 'publish']
  };
  
  const lowerText = description.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }
  
  return 'general';
}

module.exports = {
  aiGenerateSuggestions
};
