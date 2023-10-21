// TODO: Include packages needed for this application
// fs is built into node 
// different package so I dont have to use callback functions 
const fs = require('fs').promises;
const { prompt } = require('inquirer');
const generateMarkdown = require('./utils/generatedMarkdown.js');

// TODO: Create an array of questions for user input
const questions = [
    {
        type: 'input',
        name: 'github',
        message: 'What is your GitHub?'
    },
    {
        type: 'input',
        name: 'email',
        message: 'What is your email?',
    },
    {
        type: 'input',
        name: 'title',
        message: "What is your project's name?",
    },
    {
        type: 'input',
        name: 'description',
        message: 'Please write a short description of your project',
    },
    {
        type: 'list',
        name: 'license',
        message: 'What kind of license should your project have?',
        choices: ['MIT', 'APACHE 2.0', 'GPL 3.0', 'BSD 3', 'None'],
    },
    {
        type: 'input',
        name: 'installation',
        message: 'What command should be run to install dependencies?',
        default: 'npm i',
    },
    {
        type: 'input',
        name: 'test',
        message: 'What command should be run to run tests?',
        default: 'npm test',
    },
    {
        type: 'input',
        name: 'usage',
        message: 'What does the user need to know about using the repo?',
    },
    {
        type: 'input',
        name: 'contributing',
        message: 'What does the user need to know about contributing to the repo?',
        default: 'Fork the project and open a pull request with your new code',
    },
];

// TODO: Create a function to initialize app
function init() { 
    prompt(questions).then(data => {
    fs.writeFile('dist/README.md', generateMarkdown(data)).then(err => {
        err ? console.error(err) : console.log('Readme was successful!')
    })
    })
};

// Function call to initialize app
init();
