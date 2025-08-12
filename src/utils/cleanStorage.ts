/**
 * Utility to clean localStorage from invalid quiz-question blocks
 * that shouldn't appear in Step 1 of the funnel
 */

export const cleanEditorLocalStorage = () => {
  try {
    const savedConfig = localStorage.getItem('editor_config');
    if (!savedConfig) return;

    const config = JSON.parse(savedConfig);
    if (!config.blocks) return;

    // Count quiz-question blocks before cleanup
    const quizQuestionsBefore = config.blocks.filter(
      (block: any) => block.type === 'quiz-question'
    ).length;

    // Remove quiz-question blocks (these belong in steps 2-11, not step 1)
    config.blocks = config.blocks.filter((block: any) => {
      const isQuizQuestion = block.type === 'quiz-question';
      if (isQuizQuestion) {
        console.warn('🧹 Removing invalid quiz-question block:', {
          id: block.id,
          type: block.type,
          content: block.content,
        });
      }
      return !isQuizQuestion;
    });

    // Save cleaned config back to localStorage
    localStorage.setItem('editor_config', JSON.stringify(config));

    if (quizQuestionsBefore > 0) {
      console.log(
        `✅ Cleaned ${quizQuestionsBefore} invalid quiz-question blocks from localStorage`
      );
      return quizQuestionsBefore;
    }

    return 0;
  } catch (error) {
    console.error('❌ Error cleaning localStorage:', error);
    return 0;
  }
};

export const clearEditorLocalStorage = () => {
  try {
    localStorage.removeItem('editor_config');
    console.log('✅ Cleared editor localStorage');
  } catch (error) {
    console.error('❌ Error clearing localStorage:', error);
  }
};
