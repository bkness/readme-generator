const fs = require('fs').promises;
const { prompt } = require('inquirer');
const generateMarkdown = require('./utils/generateMarkdown.js');

const greenColor = '\x1b[32m';
const purpleColor = '\x1b[35m';

const questions = [
  {
    type: 'input',
    name: 'github',
    message: `${greenColor}What is your GitHub?`,
  },
  {
    type: 'input',
    name: 'email',
    message: `${greenColor}What is your email?`,
  },
  {
    type: 'input',
    name: 'title',
    message: `${greenColor}What is your project's name?`,
  },
  {
    type: 'input',
    name: 'description',
    message: `${greenColor}Please write a short description of your project`,
  },
  {
    type: 'list',
    name: 'license',
    message: `${greenColor}What kind of license should your project have?`,
    choices: ['MIT', 'APACHE 2.0', 'GPL 3.0', 'BSD 3', 'None'],
  },
  {
    type: 'input',
    name: 'installation',
    message: `${greenColor}What command should be run to install dependencies?`,
    default: 'npm i',
  },
  {
    type: 'input',
    name: 'test',
    message: `${greenColor}What command should be run to run tests?`,
    default: 'npm test',
  },
  {
    type: 'input',
    name: 'usage',
    message: `${greenColor}What does the user need to know about using the repo?`,
  },
  {
    type: 'input',
    name: 'contributing',
    message: `${greenColor}What does the user need to know about contributing to the repo?`,
    default: 'Fork the project and open a pull request with your new code',
  },
];

async function init() {
  try {
    const data = await prompt(questions);
    await fs.writeFile('dist/README.md', generateMarkdown(data));
    console.log(`${purpleColor}Readme was successful!`);
  } catch (error) {
    console.error('Error generating README:', error);
  }
}

init();
