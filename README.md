# Professional README Generator

[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT) ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white&style=flat-square)

An interactive command-line tool that **reads your project and writes its README for you.** Answer a few prompts — most already pre-filled from your `package.json` and git remote — and it forges a clean, well-structured `README.md`, complete with rendered badges, a synced table of contents, and any custom tables you need.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [What it auto-detects](#what-it-auto-detects)
- [Custom tables](#custom-tables)
- [Output](#output)
- [Contributing](#contributing)
- [License](#license)
- [Questions](#questions)
- [Demo](#demo)

## Features

- **Auto-detect** — pre-fills the prompts from your `package.json` (name, description, version, license, author email) and git remote (GitHub owner + repo).
- **Tech-stack inference** — infers your stack from `dependencies`/`devDependencies` and marker files (`tsconfig.json`, `Dockerfile`, `Cargo.toml`, `go.mod`, `requirements.txt`, …), or accepts an explicit `techStack` field.
- **Rendered tech badges** — turns your stack into [shields.io](https://shields.io) badges with the right logos and colors.
- **Custom tables** — add one or more freeform markdown tables (API references, scripts, config) interactively.
- **Optional sections** — Features, Screenshots, Contributing, Roadmap, and Environment Variables are all opt-in.
- **Synced table of contents** — the TOC only links sections that actually render, so no dangling anchors.
- **Rich terminal UI** — neon-themed prompts with section dividers, powered by `chalk` + `inquirer`.
- **Safe output** — writes to `dist/README.md` and asks before overwriting an existing file.

## Installation

Requires **Node.js 18+**. Clone the repo and install dependencies:

```bash
git clone https://github.com/bkness/readme-generator.git
cd readme-generator
npm install
```

## Usage

Run it from **inside the project you want a README for** (that's how auto-detect finds your `package.json` and git remote):

```bash
node /path/to/readme-generator/index.js
```

Or, from within this repo:

```bash
npm start
```

Answer the prompts — pre-filled defaults are one Enter away — and your README is forged to `dist/README.md`.

## What it auto-detects

| Source | Fields |
|--------|--------|
| `package.json` | project name, description, version, license, author email, tech stack |
| git `remote.origin.url` | GitHub username (owner) and repo name (used for the clone URL) |

Detection is best-effort: if there's no `package.json` or git remote, the prompts fall back to sensible defaults — nothing breaks.

## Custom tables

When prompted, you can add any number of markdown tables. Give each a heading and comma-separated column headers, then enter rows as `cell | cell | cell` (blank line to finish). Each table renders as a valid markdown table and gets its own entry in the table of contents.

## Output

The generated file is written to **`dist/README.md`**. If one already exists, you'll be asked before it's overwritten.

## Contributing

Fork the repo and open a pull request with your changes. Issues and feature ideas are tracked in [GitHub Issues](https://github.com/bkness/readme-generator/issues).

## License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

## Questions

Questions or ideas? Email me at kbrandon863@gmail.com, or check out more of my work on GitHub at [bkness](https://github.com/bkness).

## Demo

- **Repository:** [github.com/bkness/readme-generator](https://github.com/bkness/readme-generator)
- **Video demonstration:** [watch here](https://github.com/bkness/readme-generator/assets/123907755/cfad32a6-95b1-4ca9-aeab-f836b7cc1f21)

---

_Forged by [readme-generator](https://github.com/bkness/readme-generator) · devforge_
