const {
  renderLicenseBadge,
  renderLicenseLink,
  renderLicenseSection,
} = require("./licenseUtils");

function generateMarkdown(data) {
  return `# ${data.title}
${renderLicenseBadge(data.license)}

## Description
${data.description}

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [To Do](#to-do)
- [Test](#test)
- [Contributing](#contributing)
${renderLicenseLink(data.license)}
- [Questions](#questions)

## To Do
${data.toDo}

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
Questions? Email me at ${data.email}.
See more of my work at [github.com/${data.github}](https://github.com/${data.github}).
`;
}

module.exports = { generateMarkdown };
