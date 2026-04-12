// Asynchronous functions expect a promise, once received use inquirer to prompt for README info.

const fs = require("fs").promises;
const { prompt } = require("inquirer");
const { generateReadme, generateIssues } = require("./utils/generateReadme.js");

// Ansi Color for styled terminal prompts
const blueColor = "\x1b[34m";
const greenColor = "\x1b[32m";
const purpleColor = "\x1b[35m";
const resetColor = "\x1b[0m";

// Questions for readme generator
const issues = [
  {
    type: "input",
    name: "githubuser",
    message: `${blueColor}What is your issue?${resetColor}`,
  },
];

async function issueData() {
  const todos = [];
  for (let i = 0; i < 3; i++) {
    const { task } = await prompt([
      {
        type: "input",
        name: "task",
        message: `Enter TODO #${i + 1}:`,
      },
    ]);
    todos.push(task);
  }
  await fs.mkdir("dist", { recursive: true });
  await fs.writeFile("dist/todos.json", JSON.stringify(todos, null, 2));
  console.log("TODOs saved!");
}

// ... Other questions ...
const questions = [
  {
    type: "input",
    name: "github",
    message: `${greenColor}What is your GitHub?${resetColor}`,
  },
  {
    type: "input",
    name: "email",
    message: `${greenColor}What is your email?${resetColor}`,
  },
  {
    type: "input",
    name: "title",
    message: `${greenColor}What is your project's name?${resetColor}`,
  },
  {
    type: "input",
    name: "description",
    message: `${greenColor}Please write a short description of your project${resetColor}`,
  },
  {
    type: "list",
    name: "license",
    message: `${greenColor}What kind of license should your project have?${resetColor}`,
    choices: ["MIT", "APACHE 2.0", "GPL 3.0", "BSD 3", "None"],
  },
  {
    type: "input",
    name: "installation",
    message: `${greenColor}What command should be run to install dependencies?${resetColor}`,
    default: "npm i",
  },
  {
    type: "input",
    name: "test",
    message: `${greenColor}What command should be run to run tests?${resetColor}`,
    default: "npm test",
  },
  {
    type: "input",
    name: "usage",
    message: `${greenColor}What does the user need to know about using the repo?${resetColor}`,
  },
  {
    type: "input",
    name: "contributing",
    message: `${greenColor}What does the user need to know about contributing to the repo?${resetColor}`,
    default: "Fork the project and open a pull request with your new code",
  },
];

async function getAnswers() {
  if (process.env.README_ANSWERS) {
    try {
      return JSON.parse(process.env.README_ANSWERS);
    } catch (err) {
      console.error("Invalid JSON in README_ANSWERS:", err);
    }
  }
  if (process.env.ANSWERS_FILE) {
    try {
      const content = await fs.readFile(process.env.ANSWERS_FILE, "utf8");
      return JSON.parse(content);
    } catch (err) {
      console.error("Could not read ANSWERS_FILE:", err);
    }
  }
  try {
    const content = await fs.readFile("answers.json", "utf8");
    return JSON.parse(content);
  } catch (err) {
    // no static answers found; fall through to interactive
  }
  return await prompt(questions);
}

// Main initialization function: prompts user and writes README.MD TO DIST/
async function init() {
  try {
    const data = await getAnswers();
    await fs.mkdir("dist", { recursive: true });
    await fs.writeFile("dist/README.md", generateReadme(data));
    console.log(`${purpleColor}Readme was successful!${resetColor}`);
  } catch (error) {
    console.error("Error generating README:", error);
  }
}

// Run the program
init();
