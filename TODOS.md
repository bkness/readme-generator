# TODO

// Add workflow
// Create workflow scope
// test workflow
// create todos // issues
// add more ansi since you only have 3
// clear ansi with reset after call with a wrap
// get away from modular utility functions and use utility functions for cleaner code
// write comments describing the why and not the what
// move scope of issues
// working as is, catching secong array data in its current global state

// Define prompt questions for README generator
// Generate an issues template from user input
// TODO: Replace placeholder values for production use
// utils/generateReadme.js
// change ansi back to blue

<!-- const {
  renderLicenseBadge,
  renderLicenseLink,
  renderLicenseSection,
} = require("./licenseUtils");

/**
 * Generates a markdown-formatted issue section.
 * @param {Object} data - Issue data, expects { githubuser, issue }
 * @return {string} Markdown string for the issue.
 */
function generateIssues(data) {
  return `# ${data.githubuser}

## Issue
${data.issue}
`;
}

/**
 * Generates a fully structured README.md based on prompt answers.
 * @param {Object} data - The user's answers to prompts.
 * @return {string} README markdown string.
 */
function generateReadme(data) {
  return `# ${data.title}
${renderLicenseBadge(data.license) || ''}

## Description
${data.description}

## Table of Contents 📝

- [Installation](#installation)
- [Usage](#usage)
- [Test](#test)
- [Contributing](#contributing)
${renderLicenseLink(data.license) || ''}
- [Questions](#questions-📝)

## Installation
${data.installation}

## Usage
${data.usage}

## Test
${data.test}

## Contributing
${data.contributing}

${renderLicenseSection(data.license) || ''}

## Questions
If you have any questions, email me at ${data.email}.
See my GitHub at [${data.github}](https://github.com/${data.github}).
`;
}

module.exports = { generateReadme, generateIssues }; -->
