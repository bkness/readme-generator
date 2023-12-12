// Added flair - changes inquirer prompt message text color 
const greenColor = '\x1b[32m';
const purpleColor = '\x1b[35m'

// fs is built into node 
// different package so I dont have to use callback functions 
const fs = require('fs').promises;
const { prompt } = require('inquirer');
const generateMarkdown = require('./utils/generatedMarkdown.js');

// Array for User to input based on their readme needs
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
        message: `${greenColor}What is your project's name?`, // template literal syntax 
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

// The function that initializes the app and handles errors 
function init() {
    prompt(questions).then(data => {
        fs.writeFile('dist/README.md', generateMarkdown(data)).then(err => {
            err ? console.error(err) : console.log(`${purpleColor}Readme was successful!`)
        })
    })
};

// Function call to initialize app
init();
