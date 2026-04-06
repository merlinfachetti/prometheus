/**
 * UI string types for internationalization.
 * Separates UI labels from pedagogical content.
 */

export interface UIStrings {
  app: {
    title: string;
    subtitle: string;
  };
  navigation: {
    continue: string;
    back: string;
    home: string;
    next: string;
    previous: string;
  };
  welcome: {
    heading: string;
    description: string;
    startButton: string;
    continueButton: string;
  };
  lesson: {
    exercise: string;
    checkAnswer: string;
    tryAgain: string;
    correct: string;
    incorrect: string;
    hint: string;
    hideHint: string;
    explanation: string;
    progress: string;
    lessonOf: string;
    practicePrompt: string;
    startExercises: string;
    exercisesTitle: string;
    lessonComplete: string;
    scoreMessage: string;
    nextLesson: string;
    trueLabel: string;
    falseLabel: string;
  };
  moduleComplete: {
    title: string;
    congratulations: string;
    hits: string;
    exercises: string;
    performance: string;
    reviewLessons: string;
    backToHome: string;
  };
  settings: {
    title: string;
    resetProgress: string;
    resetConfirm: string;
    resetSuccess: string;
    version: string;
    cancel: string;
    confirm: string;
  };
  errors: {
    contentLoadFailed: string;
    generic: string;
  };
}

export type Locale = "pt-BR" | "en";
