function renderLicenseBadge(license) {
    if (license !== 'None')
      return ` ![Github license](https://img.shields.io/badge/license-${license.replace(/ /g, '%20')}-blue.svg)`;
    return '';
  }
  
  function renderLicenseLink(license) {
    if (license !== 'None')
      return ` - [License](#license)`;
    return '';
  }
  
  function renderLicenseSection(license) {
    if (license !== 'None')
      return ` ## License\nThis project is licensed under the ${license} license`;
    return '';
  }
  
  module.exports = { renderLicenseBadge, renderLicenseLink, renderLicenseSection };
  