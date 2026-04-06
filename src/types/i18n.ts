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
    explanation: string;
    progress: string;
  };
  errors: {
    contentLoadFailed: string;
    generic: string;
  };
}

export type Locale = "pt-BR" | "en";
