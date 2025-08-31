// Core event names centralizados
export const EVENTS = {
    QUIZ_RESULT_UPDATED: 'quiz-result-updated',
    QUIZ_SESSION_STARTED: 'quiz-session-started',
    QUIZ_NAVIGATE_TO_STEP: 'quiz-navigate-to-step',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

export default EVENTS;
