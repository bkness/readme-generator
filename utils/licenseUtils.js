function renderLicenseBadge(license) {
  if (license && license !== "None") {
    return `![License Badge](https://img.shields.io/badge/license-${encodeURIComponent(
      license
    )}-blue.svg)`;
  }
  return "";
}

function renderLicenseLink(license) {
  if (license && license !== "None") {
    return `- [License](#license)`;
  }
  return "";
}

function renderLicenseSection(license) {
  if (license && license !== "None") {
    return `## License\nThis project is licensed under the ${license} license`;
  }
  return "";
}

module.exports = {
  renderLicenseBadge,
  renderLicenseLink,
  renderLicenseSection,
};
