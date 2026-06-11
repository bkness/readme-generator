import {
  renderLicenseBadge,
  renderLicenseSection,
  renderLicenseTocEntry,
} from "./licenseUtils.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function listItems(raw, prefix = "-") {
  if (!raw?.trim()) return "";
  return raw
    .split(",")
    .map((s) => `${prefix} ${s.trim()}`)
    .filter(Boolean)
    .join("\n");
}

function techBadges(raw) {
  if (!raw?.trim()) return "";

  const colorMap = {
    "node.js":     "339933&logo=nodedotjs&logoColor=white",
    "node":        "339933&logo=nodedotjs&logoColor=white",
    "react":       "61DAFB&logo=react&logoColor=black",
    "typescript":  "3178C6&logo=typescript&logoColor=white",
    "javascript":  "F7DF1E&logo=javascript&logoColor=black",
    "python":      "3776AB&logo=python&logoColor=white",
    "rust":        "000000&logo=rust&logoColor=white",
    "go":          "00ADD8&logo=go&logoColor=white",
    "postgres":    "4169E1&logo=postgresql&logoColor=white",
    "postgresql":  "4169E1&logo=postgresql&logoColor=white",
    "mysql":       "4479A1&logo=mysql&logoColor=white",
    "mongodb":     "47A248&logo=mongodb&logoColor=white",
    "docker":      "2496ED&logo=docker&logoColor=white",
    "tailwind":    "06B6D4&logo=tailwindcss&logoColor=white",
    "tailwindcss": "06B6D4&logo=tailwindcss&logoColor=white",
    "express":     "000000&logo=express&logoColor=white",
    "next.js":     "000000&logo=nextdotjs&logoColor=white",
    "nextjs":      "000000&logo=nextdotjs&logoColor=white",
    "vite":        "646CFF&logo=vite&logoColor=white",
    "supabase":    "3ECF8E&logo=supabase&logoColor=white",
    "vercel":      "000000&logo=vercel&logoColor=white",
    "zsh":         "1A2C34&logo=gnu-bash&logoColor=white",
    "bash":        "4EAA25&logo=gnubash&logoColor=white",
  };

  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((tech) => {
      const key    = tech.toLowerCase();
      const colors = colorMap[key] || "555555&logoColor=white";
      const label  = encodeURIComponent(tech);
      // Flip the first `&` to `?` so shields.io reads logo/logoColor/style as
      // query params, not literal message text — otherwise logos never render.
      const query  = colors.replace("&", "?");
      return `![${tech}](https://img.shields.io/badge/${label}-${query}&style=flat-square)`;
    })
    .join(" ");
}

// ─── Section builders ─────────────────────────────────────────────────────────

function buildToc(data) {
  const entries = [
    "- [Description](#description)",
    data.techStack?.trim()                       ? "- [Tech Stack](#tech-stack)"                       : "",
    data.includeFeatures && data.features?.trim()        ? "- [Features](#features)"                   : "",
    data.includeScreenshots                      ? "- [Screenshots](#screenshots)"                     : "",
    "- [Installation](#installation)",
    data.envVars?.trim()                         ? "- [Environment Variables](#environment-variables)" : "",
    ...(data.tables || []).map((t) => `- [${t.heading}](#${slugify(t.heading)})`),
    data.usage?.trim()                           ? "- [Usage](#usage)"                                 : "",
    "- [Tests](#tests)",
    data.includeContributing && data.contributing        ? "- [Contributing](#contributing)"           : "",
    data.includeRoadmap && data.roadmap?.trim()          ? "- [Roadmap](#roadmap)"                     : "",
    renderLicenseTocEntry(data.license),
    "- [Contact](#contact)",
  ].filter(Boolean);

  return entries.join("\n");
}

function buildEnvSection(raw) {
  if (!raw?.trim()) return "";
  const vars = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const rows = vars.map((v) => `| \`${v}\` | _Description here_ |`).join("\n");
  return `## Environment Variables

Create a \`.env\` file in the root directory:

| Variable | Description |
|----------|-------------|
${rows}`;
}

function buildTable({ heading, headers, rows }) {
  const headerRow = `| ${headers.join(" | ")} |`;
  const separator = `| ${headers.map(() => "---").join(" | ")} |`;
  const dataRows  = rows.map((r) => `| ${r.join(" | ")} |`).join("\n");
  return `## ${heading}\n\n${headerRow}\n${separator}\n${dataRows}`;
}

function slugify(title) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function generateMarkdown(data) {
  const badge   = renderLicenseBadge(data.license);
  const badges  = techBadges(data.techStack);
  const license = renderLicenseSection(data.license);
  const slug    = slugify(data.title);

  const sections = [
    // Header
    `# ${data.title}`,

    // Badges row
    [badge, badges].filter(Boolean).join(" "),

    // Description
    `## Description\n\n${data.description}`,

    // Live demo
    data.liveUrl?.trim()
      ? `🚀 **Live Demo:** [${data.liveUrl}](${data.liveUrl})`
      : "",

    // TOC
    `## Table of Contents\n\n${buildToc(data)}`,

    // Tech stack
    data.techStack?.trim()
      ? `## Tech Stack\n\n${listItems(data.techStack)}`
      : "",

    // Features
    data.includeFeatures && data.features?.trim()
      ? `## Features\n\n${listItems(data.features)}`
      : "",

    // Screenshots
    data.includeScreenshots
      ? `## Screenshots\n\n> _Add screenshots here._\n\n<!-- ![Screenshot](./screenshots/demo.png) -->`
      : "",

    // Installation
    `## Installation\n\n\`\`\`bash\ngit clone https://github.com/${data.github}/${slug}.git\ncd ${slug}\n${data.installation}\n\`\`\``,

    // Env vars
    buildEnvSection(data.envVars),

    // Tables (from user input)
    ...(data.tables || []).map(buildTable),

    // Usage
    data.usage?.trim()
      ? `## Usage\n\n\`\`\`bash\n${data.usage}\n\`\`\``
      : "",

    // Tests
    `## Tests\n\n\`\`\`bash\n${data.test}\n\`\`\``,

    // Contributing
    data.includeContributing && data.contributing
      ? `## Contributing\n\n${data.contributing}`
      : "",

    // Roadmap
    data.includeRoadmap && data.roadmap?.trim()
      ? `## Roadmap\n\n${listItems(data.roadmap)}`
      : "",

    // License
    license,

    // Contact
    `## Contact\n\n**${data.github}** — [${data.email}](mailto:${data.email})\n\nGitHub: [@${data.github}](https://github.com/${data.github})`,

    // Footer
    `---\n\n_Generated by [readme-generator](https://github.com/${data.github}/readme-generator) · devforge_`,
  ];

  return sections.filter(Boolean).join("\n\n") + "\n";
}
