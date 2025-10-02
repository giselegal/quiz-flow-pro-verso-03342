import React from 'react';
const Dashboard = React.lazy(() => import('@/components/analytics/QuizAnalyticsDashboard'));

const QuizAnalyticsDashboardPage: React.FC = () => {
    return (
        <React.Suspense fallback={<div className="p-6 text-sm">Carregando dashboard...</div>}>
            <Dashboard />
        </React.Suspense>
    );
};

export default QuizAnalyticsDashboardPage;