export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface LessonContent {
  id: string;
  title: string;
  theory: string;
  codeSnippet: string;
  quiz: QuizQuestion;
}

export const cppLessons: LessonContent[] = [
  {
    id: "variables",
    title: "1. Variables & Data Types",
    theory: "Variables are containers for storing data values. In C++, you must declare the type of a variable before using it (e.g., int, float, char, string, bool). This makes C++ a strongly-typed language.",
    codeSnippet: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int age = 25;\n  double price = 19.99;\n  char grade = 'A';\n  string name = "AlgoX";\n  bool isAwesome = true;\n  \n  cout << name << " is " << age << " years old." << endl;\n  return 0;\n}`,
    quiz: {
      question: "Which data type would you use to store the value 3.14?",
      options: ["int", "double", "string", "char"],
      correctIndex: 1,
    }
  },
  {
    id: "control-flow",
    title: "2. Control Flow (If/Else & Loops)",
    theory: "Control flow statements alter the execution path of the program. 'if/else' lets you branch logic based on conditions. 'for' and 'while' loops let you repeat code efficiently.",
    codeSnippet: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int score = 85;\n  if (score >= 80) {\n    cout << "Great job!" << endl;\n  } else {\n    cout << "Keep trying." << endl;\n  }\n\n  for (int i = 0; i < 3; i++) {\n    cout << "Loop iteration: " << i << endl;\n  }\n  return 0;\n}`,
    quiz: {
      question: "What is the output of the for loop in the example code?",
      options: [
        "Prints numbers 1 to 3",
        "Prints numbers 0 to 2",
        "Infinite loop",
        "Syntax error"
      ],
      correctIndex: 1,
    }
  },
  {
    id: "functions",
    title: "3. Functions & Scope",
    theory: "Functions are reusable blocks of code. They take inputs (parameters) and return an output. A function's scope determines where its variables can be accessed.",
    codeSnippet: `#include <iostream>\nusing namespace std;\n\n// Function declaration\nint add(int a, int b) {\n  return a + b;\n}\n\nint main() {\n  int result = add(5, 7);\n  cout << "5 + 7 = " << result << endl;\n  return 0;\n}`,
    quiz: {
      question: "What does the keyword 'return' do in a function?",
      options: [
        "Prints a value to the screen",
        "Stops the program entirely",
        "Passes a value back to the caller",
        "Declares a new variable"
      ],
      correctIndex: 2,
    }
  }
];

export const finalAssessment: QuizQuestion[] = [
  {
    question: "What is the correct syntax to output 'Hello World' in C++?",
    options: ["print('Hello World');", "Console.WriteLine('Hello World');", "cout << 'Hello World';", "System.out.println('Hello World');"],
    correctIndex: 2
  },
  {
    question: "Which of the following is a valid multi-line comment in C++?",
    options: ["// This is a comment //", "/* This is a comment */", "<!-- This is a comment -->", "# This is a comment"],
    correctIndex: 1
  },
  {
    question: "What is the size of an 'int' data type on most modern 64-bit systems in C++?",
    options: ["2 bytes", "4 bytes", "8 bytes", "Depends on the compiler"],
    correctIndex: 1
  },
  {
    question: "Which operator is used to get the memory address of a variable?",
    options: ["*", "&", "&&", "%"],
    correctIndex: 1
  },
  {
    question: "What does the 'break' statement do inside a loop?",
    options: ["Skips the current iteration", "Exits the loop immediately", "Restarts the loop", "Exits the entire program"],
    correctIndex: 1
  },
  {
    question: "Which header file is required to use the std::string class?",
    options: ["<iostream>", "<string>", "<stdlib>", "<cmath>"],
    correctIndex: 1
  },
  {
    question: "What is the default access specifier for members of a 'class' in C++?",
    options: ["public", "private", "protected", "internal"],
    correctIndex: 1
  },
  {
    question: "How do you correctly declare an array of 5 integers?",
    options: ["int arr[5];", "int[5] arr;", "array<int> arr = 5;", "int arr() = new int[5];"],
    correctIndex: 0
  },
  {
    question: "Which feature allows multiple functions to have the same name but different parameters?",
    options: ["Function overriding", "Function overloading", "Encapsulation", "Polymorphism"],
    correctIndex: 1
  },
  {
    question: "What is the purpose of 'using namespace std;'?",
    options: ["To include standard libraries", "To avoid typing 'std::' before standard functions like cout", "To create a new namespace", "To compile the program faster"],
    correctIndex: 1
  }
];
