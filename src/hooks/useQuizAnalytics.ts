/**
 * useQuizAnalytics Hook - Event Tracking and Metrics
 * 
 * Provides analytics tracking for quiz interactions, user behavior, and performance metrics.
 * Integrates with Facebook Pixel, Google Analytics, and custom tracking systems.
 */

import { useCallback, useState, useEffect } from 'react';
import { 
  QuizAnalyticsHook, 
  AnalyticsEvent, 
  AnalyticsData, 
  UserAnswer, 
  Result 
} from '@/types/quizCore';

export const useQuizAnalytics = (): QuizAnalyticsHook => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    events: [],
    sessionDuration: 0,
    stepTimings: {},
    completionRate: 0,
  });

  const [sessionStartTime] = useState<number>(Date.now());
  const [stepStartTimes, setStepStartTimes] = useState<Record<string, number>>({});

  // Track a generic analytics event
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    console.log('📊 Analytics Event:', event);

    // Add to internal analytics data
    setAnalyticsData(prev => ({
      ...prev,
      events: [...prev.events, { ...event, timestamp: Date.now() }],
    }));

    // Send to Facebook Pixel if available
    if (typeof window !== 'undefined' && (window as any).fbq) {
      try {
        (window as any).fbq('trackCustom', event.name, {
          category: event.category,
          action: event.action,
          label: event.label,
          value: event.value,
        });
      } catch (error) {
        console.warn('⚠️ Facebook Pixel tracking failed:', error);
      }
    }

    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      try {
        (window as any).gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          custom_map: {
            dimension1: event.name,
          },
        });
      } catch (error) {
        console.warn('⚠️ Google Analytics tracking failed:', error);
      }
    }
  }, []);

  // Track when a step starts
  const trackStepStart = useCallback((stepId: string) => {
    const timestamp = Date.now();
    
    setStepStartTimes(prev => ({
      ...prev,
      [stepId]: timestamp,
    }));

    trackEvent({
      name: 'quiz_step_start',
      category: 'Quiz Navigation',
      action: 'step_start',
      label: stepId,
      value: parseInt(stepId.replace('step-', ''), 10),
    });
  }, [trackEvent]);

  // Track when a step is completed
  const trackStepComplete = useCallback((stepId: string, answers: UserAnswer[]) => {
    const timestamp = Date.now();
    const startTime = stepStartTimes[stepId];
    const timeSpent = startTime ? timestamp - startTime : 0;

    // Update step timings
    setAnalyticsData(prev => ({
      ...prev,
      stepTimings: {
        ...prev.stepTimings,
        [stepId]: timeSpent,
      },
    }));

    // Track completion event
    trackEvent({
      name: 'quiz_step_complete',
      category: 'Quiz Navigation',
      action: 'step_complete',
      label: stepId,
      value: timeSpent,
    });

    // Track selection details for analytics
    if (answers.length > 0) {
      const stepAnswer = answers.find(answer => answer.stepId === stepId);
      if (stepAnswer) {
        trackEvent({
          name: 'quiz_selection_made',
          category: 'Quiz Interaction',
          action: 'option_selected',
          label: `${stepId}_selections_${stepAnswer.selectedOptions.length}`,
          value: stepAnswer.selectedOptions.length,
        });
      }
    }
  }, [stepStartTimes, trackEvent]);

  // Track when the entire quiz is completed
  const trackQuizComplete = useCallback((result: Result) => {
    const sessionDuration = Date.now() - sessionStartTime;

    // Update analytics data with completion
    setAnalyticsData(prev => ({
      ...prev,
      sessionDuration,
      completionRate: 100,
    }));

    // Track quiz completion
    trackEvent({
      name: 'quiz_complete',
      category: 'Quiz Completion',
      action: 'quiz_finished',
      label: result.primaryStyle,
      value: Math.round(sessionDuration / 1000), // Duration in seconds
    });

    // Track primary style result
    trackEvent({
      name: 'quiz_result_primary_style',
      category: 'Quiz Results',
      action: 'primary_style_determined',
      label: result.primaryStyle,
      value: Math.round(result.percentages[result.primaryStyle] || 0),
    });

    // Track top scores for all styles
    Object.entries(result.percentages).forEach(([style, percentage]) => {
      if (percentage > 0) {
        trackEvent({
          name: 'quiz_result_style_score',
          category: 'Quiz Results',
          action: 'style_score',
          label: style,
          value: Math.round(percentage),
        });
      }
    });

    // Send conversion event to Facebook Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      try {
        (window as any).fbq('track', 'CompleteRegistration', {
          content_name: 'Quiz Completion',
          status: 'completed',
          value: 1,
          currency: 'BRL',
        });
      } catch (error) {
        console.warn('⚠️ Facebook Pixel conversion tracking failed:', error);
      }
    }

    // Send conversion to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      try {
        (window as any).gtag('event', 'conversion', {
          send_to: 'AW-CONVERSION_ID', // Replace with actual conversion ID
          value: 1,
          currency: 'BRL',
          transaction_id: result.id,
        });
      } catch (error) {
        console.warn('⚠️ Google Analytics conversion tracking failed:', error);
      }
    }
  }, [sessionStartTime, trackEvent]);

  // Get current analytics data
  const getAnalytics = useCallback((): AnalyticsData => {
    const currentSessionDuration = Date.now() - sessionStartTime;
    
    return {
      ...analyticsData,
      sessionDuration: currentSessionDuration,
    };
  }, [analyticsData, sessionStartTime]);

  // Update completion rate based on current progress
  useEffect(() => {
    const calculateCompletionRate = () => {
      const totalSteps = 21;
      const completedSteps = Object.keys(analyticsData.stepTimings).length;
      return Math.round((completedSteps / totalSteps) * 100);
    };

    setAnalyticsData(prev => ({
      ...prev,
      completionRate: calculateCompletionRate(),
    }));
  }, [analyticsData.stepTimings]);

  // Track page visibility for accurate session duration
  useEffect(() => {
    let visibilityStartTime = Date.now();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page became hidden - pause session tracking
        const visibleTime = Date.now() - visibilityStartTime;
        console.log(`📊 Page visible for ${visibleTime}ms`);
      } else {
        // Page became visible - resume session tracking
        visibilityStartTime = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    trackEvent,
    trackStepStart,
    trackStepComplete,
    trackQuizComplete,
    getAnalytics,
  };
};

export default useQuizAnalytics;