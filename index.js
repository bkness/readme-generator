import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs/promises";
import { pathToFileURL } from "url";
import { generateMarkdown } from "./utils/generateMarkdown.js";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileP = promisify(execFile);

// ─── Brand ───────────────────────────────────────────────────────────────────

const neon = chalk.hex("#00ff00");
const dim = chalk.hex("#00ff00").dim;
const faint = chalk.hex("#004400");
const white = chalk.white;
const muted = chalk.gray;
const success = chalk.hex("#00ff00").bold;
const warn = chalk.yellow;
const err = chalk.red;

function banner() {
  console.clear();
  console.log(neon("╔══════════════════════════════════════════╗"));
  console.log(neon("║") + white("   README GENERATOR") + muted(" · devforge · bkness  ") + neon("║"));
  console.log(neon("╚══════════════════════════════════════════╝"));
  console.log(dim("  Answer the prompts. Your README will be forged.\n"));
}

// ─── SPDX ID ──────────────────────────────────────────────────────────────────

  function licenseChoice(spdx) {
    const map = {
      "MIT": "MIT",
      "Apache-2.0": "Apache 2.0",
      "GPL-3.0": "GPL 3.0", "GPL-3.0-only": "GPL 3.0", "GPL-3.0-or-later": "GPL 3.0",
      "BSD-3-Clause": "BSD 3-Clause",
    };
    return map[spdx] || "MIT";
  }

async function fileExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function detectTechStack(pkg = {}) {
  if (typeof pkg.techStack === "string" && pkg.techStack.trim()) {
    return pkg.techStack;
  }

  if (Array.isArray(pkg.techStack)) {
    return pkg.techStack.join(", ");
  };

  const stack = [];
  const addTech = (label) => {
    if (label && !stack.includes(label)) stack.push(label);
  };

  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };
  const depNames = new Set(Object.keys(deps));

  const hasAnyFile = async (paths) => {
    const results = await Promise.all(paths.map((path) => fileExists(path)));
    return results.some(Boolean);
  };

  if (pkg.name || Object.keys(deps).length > 0 || pkg.scripts) addTech("Node.js");

  if (
    pkg.type === "module" ||
    /\.[cm]?js$/i.test(pkg.main || "") ||
    await hasAnyFile(["index.js", "app.js", "server.js"])
  ) {
    addTech("JavaScript");
  }

  if (depNames.has("typescript") || await fileExists("tsconfig.json")) addTech("TypeScript");
  if (depNames.has("react")) addTech("React");
  if (depNames.has("next")) addTech("Next.js");
  if (depNames.has("vite")) addTech("Vite");
  if (depNames.has("express")) addTech("Express");
  if (depNames.has("tailwindcss")) addTech("TailwindCSS");
  if (depNames.has("mongodb") || depNames.has("mongoose")) addTech("MongoDB");
  if (depNames.has("pg") || depNames.has("postgres") || depNames.has("postgresql")) addTech("PostgreSQL");
  if (depNames.has("mysql") || depNames.has("mysql2")) addTech("MySQL");
  if (depNames.has("@supabase/supabase-js")) addTech("Supabase");

  if (await fileExists("Dockerfile")) addTech("Docker");
  if (await hasAnyFile(["requirements.txt", "pyproject.toml"])) addTech("Python");
  if (await fileExists("Cargo.toml")) addTech("Rust");
  if (await fileExists("go.mod")) addTech("Go");

  return stack.join(", ");
}

// ─── Auto detect ──────────────────────────────────────────────────────────────

export async function detectMetadata() {
  const meta = {};

  try {
    const raw = await fs.readFile("package.json", "utf8");
    const pkg = JSON.parse(raw);

    if (pkg.name) meta.title = pkg.name;
    if (pkg.description) meta.description = pkg.description;
    meta.techStack = await detectTechStack(pkg);
    if (pkg.version) meta.version = pkg.version;
    if (pkg.license) meta.license = typeof pkg.license === "string" ? pkg.license : pkg.license?.type;
    if (pkg.author) {
      meta.email = typeof pkg.author === "string"
        ? pkg.author.match(/<([^>]+)>/)?.[1] // extract email from "Name <email>"
        : pkg.author.email;
    }
  } catch {
    // no package.json or failed to parse — just skip auto-detection
  }

  try {
    const { stdout } = await execFileP("git", ["config", "--get", "remote.origin.url"]);
    const url = stdout.trim();

    const match = url.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/);
    if (match) {
      meta.owner = match[1];
      meta.repo = match[2];
    }
  } catch {
    // no git remote or failed to parse — just skip auto-detection
  }

  return meta;
}

// ─── Separator helper ─────────────────────────────────────────────────────────

const sep = (label) =>
  new inquirer.Separator(faint(`\n  ── ${label} ─────────────────────────────`));

// ─── Questions ────────────────────────────────────────────────────────────────

function buildQuestions(meta) {    
  return [
    // Project
    sep("PROJECT"),
    {
      type: "input",
      name: "title",
      message: neon("Project name:"),
      validate: (v) => v.trim() !== "" || warn("Title can't be empty."),
      default: meta.title || "",
    },
    {
      type: "input",
      name: "description",
      message: neon("Description") + muted(" (what it does, why it exists):"),
      validate: (v) => v.trim() !== "" || warn("Description can't be empty."),
      default: meta.description || "",
    },
    {
      type: "input",
      name: "version",
      message: neon("Version:"),
      default: meta.version || "1.0.0",
    },
    {
      type: "input",
      name: "liveUrl",
      message: neon("Live demo URL") + muted(" (leave blank to skip):"),
    },

    // Tech
    sep("TECH STACK"),
    {
      type: "input",
      name: "techStack",
      message: neon("Tech stack") + muted(" (comma-separated, e.g. Node.js, React, PostgreSQL):"),
      default: meta.techStack || "",
    },

    // Features
    sep("FEATURES"),
    {
      type: "confirm",
      name: "includeFeatures",
      message: neon("Include a Features section?"),
      default: true,
    },
    {
      type: "input",
      name: "features",
      message: neon("List features") + muted(" (comma-separated):"),
      when: (a) => a.includeFeatures,
    },

    // Screenshots
    sep("SCREENSHOTS"),
    {
      type: "confirm",
      name: "includeScreenshots",
      message: neon("Include a Screenshots section?"),
      default: false,
    },

    // Setup
    sep("SETUP"),
    {
      type: "input",
      name: "installation",
      message: neon("Install command:"),
      default: "npm install",
    },
    {
      type: "input",
      name: "envVars",
      message: neon("Required env vars") + muted(" (comma-separated, leave blank if none):"),
    },
    {
      type: "input",
      name: "usage",
      message: neon("Usage") + muted(" (how to run / use this project):"),
    },
    {
      type: "input",
      name: "test",
      message: neon("Test command:"),
      default: "npm test",
    },

    // Contributing
    sep("CONTRIBUTING"),
    {
      type: "confirm",
      name: "includeContributing",
      message: neon("Include a Contributing section?"),
      default: true,
    },
    {
      type: "input",
      name: "contributing",
      message: neon("Contributing guidelines:"),
      default: "Fork the repo and open a pull request with your changes.",
      when: (a) => a.includeContributing,
    },

    // Roadmap
    sep("ROADMAP"),
    {
      type: "confirm",
      name: "includeRoadmap",
      message: neon("Include a Roadmap / To-Do section?"),
      default: false,
    },
    {
      type: "input",
      name: "roadmap",
      message: neon("Roadmap items") + muted(" (comma-separated):"),
      when: (a) => a.includeRoadmap,
    },

    // License
    sep("LICENSE"),
    {
      type: "list",
      name: "license",
      message: neon("License:"),
      choices: ["MIT", "Apache 2.0", "GPL 3.0", "BSD 3-Clause", "None"],
      default: licenseChoice(meta.license) || "MIT",
    },

    // Author
    sep("AUTHOR"),
    {
      type: "input",
      name: "github",
      message: neon("GitHub username:"),
      default: meta.owner || "bkness",
    },
    {
      type: "input",
      name: "email",
      message: neon("Contact email:"),
      default: meta.email || "DevBrandon@icloud.com",
    },
  ];
}

// ─── Create Tables ────────────────────────────────────────────────────────────

async function collectTables() {
  const tables = [];

  let { addTable } = await inquirer.prompt([
    {
      type: "confirm", name: "addTable",
      message: neon("Add a custom table?"), default: false
    }
  ]);

  while (addTable) {
    const { heading, headerLine } = await inquirer.prompt([
      {
        type: "input", name: "heading",
        message: neon("Table heading:"),
        validate: (v) => v.trim() !== "" || warn("Heading can't be empty.")
      },
      {
        type: "input", name: "headerLine",
        message: neon("Column headers") + muted(" (comma-separated):"),
        validate: (v) => v.trim() !== "" || warn("Need at least one column.")
      },
    ]);

    const headers = headerLine.split(",").map(h => h.trim());

    const rows = [];
    for (; ;) {
      const isFirst = rows.length === 0;
      const { row } = await inquirer.prompt([
        {
          type: "input",
          name: "row",
          message:
            muted(`Row ${rows.length + 1} `) +
            dim('("|"-separated)') +
            // Only nag with full instruction on the first row.
            (isFirst ? muted(" · press Enter on an empty line to finish") : ""),
        },
      ]);

      if (!row.trim()) break; // empty line = done
      rows.push(row.split("|").map((c) => c.trim()));
    }
    tables.push({ heading, headers, rows });

    ({ addTable } = await inquirer.prompt([
      {
        type: "confirm", name: "addTable",
        message: neon("Add another table?"), default: false
      },
    ]));
  }

  return tables;
}

// ─── Output ───────────────────────────────────────────────────────────────────

async function writeReadme(content) {
  const outDir = "dist";
  const outFile = `${outDir}/README.md`;

  await fs.mkdir(outDir, { recursive: true });

  let overwrite = true;
  try {
    await fs.access(outFile);
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: warn(`dist/README.md already exists. Overwrite?`),
        default: false,
      },
    ]);
    overwrite = confirm;
  } catch {
    // file doesn't exist — good to go
  }

  if (!overwrite) {
    console.log(muted("\n  Aborted. Existing README left untouched.\n"));
    return;
  }

  await fs.writeFile(outFile, content, "utf8");

  console.log("\n" + neon("  ✔ ") + success("README forged →") + white(` ${outFile}`));
  console.log(muted("  Open it: ") + dim(`code ${outFile}`) + "\n");
}

// ─── Init ─────────────────────────────────────────────────────────────────────

// inquirer.Separator is only valid inside a prompt's `choices` — passing one as
// a top-level question throws "You must provide a `name` parameter". So we walk
// the list, print each separator as a section divider, and prompt the real
// questions in between. Accumulated answers are threaded through so `when`
// conditions still resolve.
export async function promptInSections(items) {
  const answers = {};
  let batch = [];
  const flush = async () => {
    if (batch.length) {
      Object.assign(answers, await inquirer.prompt(batch, answers));
      batch = [];
    }
  };
  for (const item of items) {
    if (item instanceof inquirer.Separator) {
      await flush();
      console.log(item.line);
    } else {
      batch.push(item);
    }
  }
  await flush();
  return answers;
}

async function init() {
  try {
    banner();
    const meta = await detectMetadata();
    const data = await promptInSections(buildQuestions(meta));
    const tables = await collectTables();
    const content = generateMarkdown({ ...data, tables, repo: meta.repo });
    await writeReadme(content);
  } catch (error) {
    if (error.name === "ExitPromptError") {
      console.log(muted("\n  Cancelled.\n"));
      process.exit(0);
    }
    console.error(err("\n  Something went wrong:"), error.message);
    process.exit(1);
  }
}

// Only run the interactive flow when executed directly (`node index.js`),
// so the module can be imported for testing without launching prompts.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  init();
}
