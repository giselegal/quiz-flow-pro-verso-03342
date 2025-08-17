// @ts-nocheck
import { getAnalyticsEvents } from './analytics';

// Get cached metrics or calculate if not in cache
export const getCachedMetrics = (timeRange: '7d' | '30d' | 'all') => {
  try {
    const cacheKey = `analytics_metrics_cache_${timeRange}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return ensureMetricsStructure(parsedData);
    }

    // If no cache, calculate metrics
    const events = getAnalyticsEvents();
    const filteredEvents = filterEventsByTimeRange(events, timeRange);

    // Calculate metrics based on events
    const metrics = {
      totalVisitors: calculateTotalVisitors(filteredEvents),
      totalStarts: countEventsByType(filteredEvents, 'quiz_start'),
      totalCompletes: countEventsByType(filteredEvents, 'quiz_complete'),
      totalResultViews: countEventsByType(filteredEvents, 'result_view'),
      totalLeads: countEventsByType(filteredEvents, 'lead_generated'),
      totalSales: countEventsByType(filteredEvents, 'sale'),
      completionRate: calculateCompletionRate(filteredEvents),
      conversionRate: calculateConversionRate(filteredEvents),
      salesRate: calculateSalesRate(filteredEvents),
      averageTimeSpent: calculateAverageTimeSpent(filteredEvents),
    };

    // Cache the calculated metrics
    localStorage.setItem(cacheKey, JSON.stringify(metrics));

    return ensureMetricsStructure(metrics);
  } catch (error) {
    console.error('Error getting cached metrics:', error);
    // Return default metrics structure to prevent undefined errors
    return getDefaultMetrics();
  }
};

// Ensure that all metric properties exist to prevent undefined errors
const ensureMetricsStructure = (metrics: any) => {
  const defaultMetrics = getDefaultMetrics();

  return {
    totalVisitors: metrics.totalVisitors ?? defaultMetrics.totalVisitors,
    totalStarts: metrics.totalStarts ?? defaultMetrics.totalStarts,
    totalCompletes: metrics.totalCompletes ?? defaultMetrics.totalCompletes,
    totalResultViews: metrics.totalResultViews ?? defaultMetrics.totalResultViews,
    totalLeads: metrics.totalLeads ?? defaultMetrics.totalLeads,
    totalSales: metrics.totalSales ?? defaultMetrics.totalSales,
    completionRate: metrics.completionRate ?? defaultMetrics.completionRate,
    conversionRate: metrics.conversionRate ?? defaultMetrics.conversionRate,
    salesRate: metrics.salesRate ?? defaultMetrics.salesRate,
    averageTimeSpent: metrics.averageTimeSpent ?? defaultMetrics.averageTimeSpent,
  };
};

// Get default metrics object
const getDefaultMetrics = () => {
  return {
    totalVisitors: 0,
    totalStarts: 0,
    totalCompletes: 0,
    totalResultViews: 0,
    totalLeads: 0,
    totalSales: 0,
    completionRate: 0,
    conversionRate: 0,
    salesRate: 0,
    averageTimeSpent: 0,
  };
};

export const resetMetricsCache = () => {
  try {
    localStorage.removeItem('analytics_metrics_cache_7d');
    localStorage.removeItem('analytics_metrics_cache_30d');
    localStorage.removeItem('analytics_metrics_cache_all');
    console.log('Metrics cache reset');
  } catch (error) {
    console.error('Error resetting metrics cache:', error);
  }
};

export const filterEventsByTimeRange = (events: any[], timeRange: '7d' | '30d' | 'all') => {
  if (timeRange === 'all') return events;

  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  const timeLimit = timeRange === '7d' ? 7 * dayInMs : 30 * dayInMs;

  return events.filter(event => {
    const eventTime = event.timestamp ? new Date(event.timestamp).getTime() : 0;
    return now - eventTime <= timeLimit;
  });
};

// Helper functions for metrics calculation
const calculateTotalVisitors = (events: any[]) => {
  // Count unique visitors based on user IDs or sessions
  const uniqueUsers = new Set();
  events.forEach(event => {
    if (event.userId) uniqueUsers.add(event.userId);
    else if (event.sessionId) uniqueUsers.add(event.sessionId);
  });
  return uniqueUsers.size;
};

const countEventsByType = (events: any[], type: string) => {
  return events.filter(e => e.type === type).length;
};

const calculateCompletionRate = (events: any[]) => {
  const starts = events.filter(e => e.type === 'quiz_start').length;
  const completes = events.filter(e => e.type === 'quiz_complete').length;
  return starts > 0 ? (completes / starts) * 100 : 0;
};

const calculateConversionRate = (events: any[]) => {
  const starts = events.filter(e => e.type === 'quiz_start').length;
  const leads = events.filter(e => e.type === 'lead_generated').length;
  return starts > 0 ? (leads / starts) * 100 : 0;
};

const calculateSalesRate = (events: any[]) => {
  const leads = events.filter(e => e.type === 'lead_generated').length;
  const sales = events.filter(e => e.type === 'purchase' || e.type === 'sale').length;
  return leads > 0 ? (sales / leads) * 100 : 0;
};

const calculateAverageTimeSpent = (events: any[]) => {
  // Find start and complete pairs for the same user/session
  const sessions: Record<string, { start?: number; complete?: number }> = {};

  events.forEach(event => {
    const id = event.userId || event.sessionId || 'anonymous';
    if (!sessions[id]) sessions[id] = {};

    if (event.type === 'quiz_start' && event.timestamp) {
      sessions[id].start = new Date(event.timestamp).getTime();
    }
    if (event.type === 'quiz_complete' && event.timestamp) {
      sessions[id].complete = new Date(event.timestamp).getTime();
    }
  });

  // Calculate average time for completed sessions
  let totalTime = 0;
  let completedSessions = 0;

  Object.values(sessions).forEach(session => {
    if (session.start && session.complete && session.complete > session.start) {
      totalTime += (session.complete - session.start) / 1000; // Convert to seconds
      completedSessions++;
    }
  });

  return completedSessions > 0 ? totalTime / completedSessions : 0;
};

/**
 * Process quiz progress data from events
 * @param events Array of analytics events
 * @returns Processed user progress data by question
 */
export const getUserProgressData = (events: any[]) => {
  // Extract quiz answer events to track progress
  const answerEvents = events.filter(event => event.type === 'quiz_answer' || event.question_id);

  // Create a map to store aggregated data by question ID
  const questionMap: Record<
    string,
    {
      questionId: string;
      uniqueUsers: number;
      totalAnswers: number;
      dropoffRate?: number;
      retentionFromStart?: number;
    }
  > = {};

  // Create a set to track unique users per question
  const usersByQuestion: Record<string, Set<string>> = {};

  // Process events to calculate progress metrics
  answerEvents.forEach(event => {
    const questionId =
      event.question_id || event.questionId || `Q${Object.keys(questionMap).length + 1}`;
    const userId = event.userId || event.sessionId || 'anonymous';

    // Initialize question data if it doesn't exist
    if (!questionMap[questionId]) {
      questionMap[questionId] = {
        questionId,
        uniqueUsers: 0,
        totalAnswers: 0,
      };
      usersByQuestion[questionId] = new Set();
    }

    // Track unique users per question
    usersByQuestion[questionId].add(userId);

    // Increment total answers count
    questionMap[questionId].totalAnswers++;
  });

  // Update unique users counts from sets
  Object.keys(questionMap).forEach(qId => {
    questionMap[qId].uniqueUsers = usersByQuestion[qId].size;
  });

  // Sort by question ID (assuming they are numeric or contain numeric parts)
  return Object.values(questionMap).sort((a, b) => {
    // Extract numeric parts if question IDs are like 'Q1', 'Q2', etc.
    const numA = parseInt((a.questionId.match(/\d+/) || ['0'])[0]);
    const numB = parseInt((b.questionId.match(/\d+/) || ['0'])[0]);
    return numA - numB;
  });
};
