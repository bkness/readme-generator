const fs = require("fs").promises;
const { prompt } = require("inquirer");
const { generateMarkdown } = require("./utils/generateMarkdown.js");

const green  = "\x1b[32m";
const purple = "\x1b[35m";
const reset  = "\x1b[0m";

const questions = [
  {
    type: "input",
    name: "title",
    message: `${green}What is your project's name?${reset}`,
  },
  {
    type: "input",
    name: "description",
    message: `${green}Write a short description of your project:${reset}`,
  },
  {
    type: "input",
    name: "toDo",
    message: `${green}Any to-do items for this project?${reset}`,
  },
  {
    type: "list",
    name: "license",
    message: `${green}What license should your project have?${reset}`,
    choices: ["MIT", "APACHE 2.0", "GPL 3.0", "BSD 3", "None"],
  },
  {
    type: "input",
    name: "installation",
    message: `${green}Command to install dependencies:${reset}`,
    default: "npm i",
  },
  {
    type: "input",
    name: "test",
    message: `${green}Command to run tests:${reset}`,
    default: "npm test",
  },
  {
    type: "input",
    name: "usage",
    message: `${green}What should users know about using this repo?${reset}`,
  },
  {
    type: "input",
    name: "contributing",
    message: `${green}What should users know about contributing?${reset}`,
    default: "Fork the project and open a pull request with your changes",
  },
  {
    type: "input",
    name: "github",
    message: `${green}Your GitHub username:${reset}`,
  },
  {
    type: "input",
    name: "email",
    message: `${green}Your email address:${reset}`,
  },
];

async function init() {
  try {
    await fs.mkdir("dist", { recursive: true });
    const data = await prompt(questions);
    await fs.writeFile("dist/README.md", generateMarkdown(data));
    console.log(`\n${purple}✔ README generated at dist/README.md${reset}\n`);
  } catch (error) {
    console.error("Error generating README:", error);
    process.exit(1);
  }
}

init();
