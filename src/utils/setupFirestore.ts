import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { db } from "../../firebase.js";

// Sample topics data
const topics = [
  {
    id: "javascript",
    name: "JavaScript",
    description: "Test your JavaScript knowledge",
    questionCount: 5,
    icon: "🟨"
  },
  {
    id: "react",
    name: "React",
    description: "React framework fundamentals",
    questionCount: 5,
    icon: "⚛️"
  },
  {
    id: "typescript",
    name: "TypeScript",
    description: "TypeScript language features",
    questionCount: 5,
    icon: "🔷"
  }
];

// Sample questions for JavaScript
const javascriptQuestions = [
  {
    question: "What is the correct way to declare a variable in JavaScript?",
    options: ["var x = 5", "variable x = 5", "v x = 5", "declare x = 5"],
    correctAnswer: 0
  },
  {
    question: "Which method is used to add an element to the end of an array?",
    options: ["push()", "add()", "append()", "insert()"],
    correctAnswer: 0
  },
  {
    question: "What does '===' operator do in JavaScript?",
    options: ["Assignment", "Comparison without type checking", "Strict equality comparison", "Not equal"],
    correctAnswer: 2
  },
  {
    question: "Which of the following is NOT a JavaScript data type?",
    options: ["String", "Boolean", "Float", "Undefined"],
    correctAnswer: 2
  },
  {
    question: "What is the output of 'typeof null' in JavaScript?",
    options: ["null", "undefined", "object", "boolean"],
    correctAnswer: 2
  }
];

// Sample questions for React
const reactQuestions = [
  {
    question: "What is JSX in React?",
    options: ["JavaScript XML", "Java Syntax Extension", "JSON Extension", "JavaScript Extension"],
    correctAnswer: 0
  },
  {
    question: "Which hook is used to manage state in functional components?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswer: 1
  },
  {
    question: "What is the virtual DOM?",
    options: ["Real DOM copy", "JavaScript representation of DOM", "HTML template", "CSS framework"],
    correctAnswer: 1
  },
  {
    question: "How do you pass data from parent to child component?",
    options: ["State", "Props", "Context", "Refs"],
    correctAnswer: 1
  },
  {
    question: "Which method is called after a component is mounted?",
    options: ["componentDidMount", "componentWillMount", "componentDidUpdate", "componentWillUnmount"],
    correctAnswer: 0
  }
];

// Sample questions for TypeScript
const typescriptQuestions = [
  {
    question: "TypeScript compiler uses _______ to check type when type is not given",
    options: ["type inference", "type annotations", "type erasure", "None of these"],
    correctAnswer: 0
  },
  {
    question: "Which keyword is used to define an interface in TypeScript?",
    options: ["class", "interface", "type", "struct"],
    correctAnswer: 1
  },
  {
    question: "What is the correct way to declare a constant in TypeScript?",
    options: ["var x = 10", "let x = 10", "const x = 10", "constant x = 10"],
    correctAnswer: 2
  },
  {
    question: "Which of the following is a TypeScript primitive type?",
    options: ["int", "float", "number", "decimal"],
    correctAnswer: 2
  },
  {
    question: "What does the '?' symbol mean in TypeScript?",
    options: ["Required property", "Optional property", "Nullable property", "Default property"],
    correctAnswer: 1
  }
];

export const setupFirestore = async () => {
  try {
    console.log("Setting up Firestore collections...");

    // Create topics
    for (const topic of topics) {
      await setDoc(doc(db, "topics", topic.id), topic);
      console.log(`Created topic: ${topic.name}`);
    }

    // Add JavaScript questions
    for (const question of javascriptQuestions) {
      await addDoc(collection(db, "topics", "javascript", "questions"), question);
    }
    console.log("Added JavaScript questions");

    // Add React questions
    for (const question of reactQuestions) {
      await addDoc(collection(db, "topics", "react", "questions"), question);
    }
    console.log("Added React questions");

    // Add TypeScript questions
    for (const question of typescriptQuestions) {
      await addDoc(collection(db, "topics", "typescript", "questions"), question);
    }
    console.log("Added TypeScript questions");

    console.log("Firestore setup completed successfully!");
  } catch (error) {
    console.error("Error setting up Firestore:", error);
  }
};

// Uncomment the line below and run this file to setup Firestore
// setupFirestore();