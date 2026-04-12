const {
  renderLicenseBadge,
  renderLicenseLink,
  renderLicenseSection,
} = require("./licenseUtils");

function generateIssues(data) {
  return `# ${data.githubuser}
  
  ## Issue 
  ${data.issue}
  `;
}

// Readme Logic
function generateReadme(data) {
  return `# ${data.title}
${renderLicenseBadge(data.license)}

## Description 
${data.description}

## Table of Contents 📝

- [Installation](#installation)
- [Usage](#usage)
- [Test](#test)
- [Contributing](#contributing)
${renderLicenseLink(data.license)}
- [Questions](#questions-📝)

## Installation 
${data.installation}

## Usage
${data.usage}

## Test 
${data.test}

## Contributing
${data.contributing}

${renderLicenseSection(data.license)}

## Questions
If you have any questions you can email me at ${data.email}. If you want to see more of my work, visit my GitHub at [${data.github}](https://github.com/${data.github}).
`;
}

module.exports = { generateReadme, generateIssues };
