// Minimal quiz page component
const ModernQuizPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Quiz Coming Soon</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The quiz functionality is being rebuilt. Please check back later.
        </p>
        <div className="p-6 border border-border rounded-lg bg-muted/50">
          <p className="text-sm">
            This is a placeholder page to prevent build errors. 
            The full quiz experience will be restored once the core components are complete.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModernQuizPage;