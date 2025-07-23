/**
 * AI Progress Summarizer - Generates intelligent progress summaries
 */

const { logger } = require('../utils/logger');

/**
 * Generate AI-powered progress summary
 * @param {Array} tasks - Array of task objects
 * @returns {Promise<Object>} Progress summary
 */
async function aiSummarizeProgress(tasks) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const stats = calculateProgressStats(tasks);
  const insights = generateInsights(stats, tasks);
  const recommendations = generateRecommendations(stats, tasks);
  
  const summary = {
    overview: generateOverview(stats),
    keyMetrics: stats,
    insights,
    recommendations,
    trendAnalysis: analyzeTrends(tasks),
    nextSteps: generateNextSteps(tasks)
  };
  
  logger.info('Generated AI progress summary');
  return summary;
}

/**
 * Calculate comprehensive progress statistics
 */
function calculateProgressStats(tasks) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  
  const priorityDistribution = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length
  };
  
  const completionByPriority = {
    high: tasks.filter(t => t.priority === 'high' && t.completed).length,
    medium: tasks.filter(t => t.priority === 'medium' && t.completed).length,
    low: tasks.filter(t => t.priority === 'low' && t.completed).length
  };
  
  const averageTaskAge = calculateAverageTaskAge(tasks);
  const productivityScore = calculateProductivityScore(tasks);
  
  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    priorityDistribution,
    completionByPriority,
    averageTaskAge,
    productivityScore
  };
}

/**
 * Calculate average age of tasks in days
 */
function calculateAverageTaskAge(tasks) {
  if (tasks.length === 0) return 0;
  
  const totalAge = tasks.reduce((sum, task) => {
    const age = Math.floor((new Date() - new Date(task.created_at)) / (1000 * 60 * 60 * 24));
    return sum + age;
  }, 0);
  
  return Math.round(totalAge / tasks.length);
}

/**
 * Calculate productivity score (0-100)
 */
function calculateProductivityScore(tasks) {
  if (tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter(t => t.completed);
  const completionRate = completedTasks.length / tasks.length;
  
  // Factor in high-priority task completion
  const highPriorityTasks = tasks.filter(t => t.priority === 'high');
  const highPriorityCompleted = completedTasks.filter(t => t.priority === 'high');
  const highPriorityRate = highPriorityTasks.length > 0 ? 
    highPriorityCompleted.length / highPriorityTasks.length : 1;
  
  // Factor in task age (newer completed tasks score higher)
  const recentCompletions = completedTasks.filter(task => {
    const daysSinceCreation = Math.floor((new Date() - new Date(task.created_at)) / (1000 * 60 * 60 * 24));
    return daysSinceCreation <= 7;
  }).length;
  
  const recencyBonus = tasks.length > 0 ? (recentCompletions / tasks.length) * 0.2 : 0;
  
  const score = (completionRate * 0.6) + (highPriorityRate * 0.3) + recencyBonus;
  return Math.round(Math.min(score * 100, 100));
}
/**
 * Generate overview text
 */
function generateOverview(stats) {
  const { completionRate, totalTasks, productivityScore } = stats;
  
  let performance = 'average';
  if (productivityScore >= 80) performance = 'excellent';
  else if (productivityScore >= 60) performance = 'good';
  else if (productivityScore < 40) performance = 'needs improvement';
  
  return `You have completed ${stats.completedTasks} out of ${totalTasks} tasks (${Math.round(completionRate)}% completion rate). Your current productivity score is ${productivityScore}/100, indicating ${performance} task management performance.`;
}

/**
 * Generate insights based on task data
 */
function generateInsights(stats, tasks) {
  const insights = [];
  
  // Completion rate insights
  if (stats.completionRate > 80) {
    insights.push('🎉 Excellent completion rate! You\'re consistently finishing your tasks.');
  } else if (stats.completionRate < 30) {
    insights.push('⚠️ Low completion rate detected. Consider breaking tasks into smaller, manageable pieces.');
  }
  
  // Priority insights
  const highPriorityPending = stats.priorityDistribution.high - stats.completionByPriority.high;
  if (highPriorityPending > 3) {
    insights.push(`🔥 You have ${highPriorityPending} pending high-priority tasks. Focus on these first.`);
  }
  
  // Age insights
  if (stats.averageTaskAge > 14) {
    insights.push('📅 Your tasks are staying open for a long time on average. Consider setting deadlines.');
  } else if (stats.averageTaskAge < 3) {
    insights.push('⚡ You\'re completing tasks quickly! Great momentum.');
  }
  
  // Productivity insights
  if (stats.productivityScore > 85) {
    insights.push('🚀 Outstanding productivity! You\'re managing tasks very effectively.');
  } else if (stats.productivityScore < 40) {
    insights.push('💡 Productivity could be improved. Try prioritizing high-impact tasks.');
  }
  
  return insights;
}

/**
 * Generate recommendations
 */
function generateRecommendations(stats, tasks) {
  const recommendations = [];
  
  // Based on completion rate
  if (stats.completionRate < 50) {
    recommendations.push({
      category: 'Completion',
      suggestion: 'Focus on completing existing tasks before adding new ones',
      priority: 'high'
    });
  }
  
  // Based on priority distribution
  const highPriorityRatio = stats.priorityDistribution.high / stats.totalTasks;
  if (highPriorityRatio > 0.4) {
    recommendations.push({
      category: 'Priority Management',
      suggestion: 'Too many high-priority tasks. Re-evaluate and redistribute priorities',
      priority: 'medium'
    });
  }
  
  // Based on task age
  if (stats.averageTaskAge > 10) {
    recommendations.push({
      category: 'Time Management',
      suggestion: 'Set specific deadlines for tasks to maintain momentum',
      priority: 'medium'
    });
  }
  
  // Productivity recommendations
  if (stats.productivityScore < 60) {
    recommendations.push({
      category: 'Productivity',
      suggestion: 'Consider using time-blocking or the Pomodoro technique',
      priority: 'low'
    });
  }
  
  return recommendations;
}

/**
 * Analyze trends in task creation and completion
 */
function analyzeTrends(tasks) {
  const last7Days = tasks.filter(task => {
    const daysDiff = Math.floor((new Date() - new Date(task.created_at)) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  });
  
  const last30Days = tasks.filter(task => {
    const daysDiff = Math.floor((new Date() - new Date(task.created_at)) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30;
  });
  
  return {
    recentActivity: last7Days.length,
    monthlyActivity: last30Days.length,
    recentCompletions: last7Days.filter(t => t.completed).length,
    trend: last7Days.length > 5 ? 'increasing' : last7Days.length < 2 ? 'decreasing' : 'stable'
  };
}

/**
 * Generate next steps
 */
function generateNextSteps(tasks) {
  const pendingHighPriority = tasks.filter(t => t.priority === 'high' && !t.completed);
  const oldestPending = tasks.filter(t => !t.completed)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .slice(0, 3);
  
  const nextSteps = [];
  
  if (pendingHighPriority.length > 0) {
    nextSteps.push(`Complete high-priority task: "${pendingHighPriority[0].title}"`);
  }
  
  if (oldestPending.length > 0 && !pendingHighPriority.includes(oldestPending[0])) {
    nextSteps.push(`Address oldest pending task: "${oldestPending[0].title}"`);
  }
  
  nextSteps.push('Review and update task priorities');
  nextSteps.push('Consider breaking down complex tasks into subtasks');
  
  return nextSteps.slice(0, 3); // Return top 3 next steps
}

module.exports = {
  aiSummarizeProgress
};
