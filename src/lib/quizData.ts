export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const quizQuestions: Question[] = [
  {
    id: 1,
    question: "TypeScript compiler uses _______ to check type when type is not given",
    options: ["type inference", "type annotations", "type erasure", "None of these"],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "How can you open a link in a new browser window?",
    options: [
      '<a href="url" target="new">',
      '<a href="url" target="_blank">',
      '<a href="url" target="open">',
      '<a href="url" new>',
    ],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "Which is the correct way to declare a constant in TypeScript?",
    options: ["var x = 10", "let x = 10", "const x = 10", "constant x = 10"],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Colorful Style Sheets",
    ],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "In TypeScript, which keyword is used to define an interface?",
    options: ["class", "interface", "type", "struct"],
    correctAnswer: 1,
  },
];

export const founders = ["Bruce Wayne", "Barry Allen", "Diana Prince"];
export const manager = "Clark Kent";

export const getPerformanceLabel = (score: number): string => {
  if (score === 0) return "Needs Improvement";
  if (score <= 25) return "Good";
  if (score <= 35) return "Very Good";
  return "Excellent";
};
