const fs = require("fs").promises;
const { prompt } = require("inquirer");
const { generateMarkdown } = require("./utils/generateMarkdown.js");
// Asynchronous functions expect a promise, once received use inquirer to prompt for README info.

// Ansi Color for styled terminal prompts
const blueColor = "\x1b[34m";
const greenColor = "\x1b[32m";
const purpleColor = "\x1b[35m";
const resetColor = "\x1b[0m";

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
    type: "input",
    name: "toDo",
    message: `${greenColor}What are some to do items for this project?${resetColor}`,
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

async function init() {
  try {
    const data = await prompt(questions);
    await fs.writeFile("dist/README.md", generateMarkdown(data));
    console.log(`${purpleColor}Readme was successful!`);
  } catch (error) {
    console.error("Error generating README:", error);
  }
}

init();
