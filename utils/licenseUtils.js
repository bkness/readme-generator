const LICENSE_DATA = {
  "MIT": {
    badge: "https://img.shields.io/badge/license-MIT-green.svg",
    url:   "https://opensource.org/licenses/MIT",
    blurb: "This project is licensed under the **MIT License** — free to use, modify, and distribute.",
  },
  "Apache 2.0": {
    badge: "https://img.shields.io/badge/license-Apache%202.0-blue.svg",
    url:   "https://opensource.org/licenses/Apache-2.0",
    blurb: "This project is licensed under the **Apache License 2.0**.",
  },
  "GPL 3.0": {
    badge: "https://img.shields.io/badge/license-GPL%203.0-blue.svg",
    url:   "https://www.gnu.org/licenses/gpl-3.0",
    blurb: "This project is licensed under the **GNU General Public License v3.0**.",
  },
  "BSD 3-Clause": {
    badge: "https://img.shields.io/badge/license-BSD%203--Clause-blue.svg",
    url:   "https://opensource.org/licenses/BSD-3-Clause",
    blurb: "This project is licensed under the **BSD 3-Clause License**.",
  },
};

export function renderLicenseBadge(license) {
  const data = LICENSE_DATA[license];
  return data ? `[![License](${data.badge})](${data.url})` : "";
}

export function renderLicenseSection(license) {
  const data = LICENSE_DATA[license];
  if (!data) return "";
  return `## License\n\n${data.blurb}\n\nSee the [LICENSE](LICENSE) file for details.`;
}

export function renderLicenseTocEntry(license) {
  return LICENSE_DATA[license] ? "- [License](#license)" : "";
}
