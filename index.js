import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs/promises";
import { pathToFileURL } from "url";
import { generateMarkdown } from "./utils/generateMarkdown.js";

// ─── Brand ───────────────────────────────────────────────────────────────────

const neon    = chalk.hex("#00ff00");
const dim     = chalk.hex("#00ff00").dim;
const faint   = chalk.hex("#004400");
const white   = chalk.white;
const muted   = chalk.gray;
const success = chalk.hex("#00ff00").bold;
const warn    = chalk.yellow;
const err     = chalk.red;

function banner() {
  console.clear();
  console.log(neon("╔══════════════════════════════════════════╗"));
  console.log(neon("║") + white("   README GENERATOR") + muted(" · devforge · bkness  ") + neon("║"));
  console.log(neon("╚══════════════════════════════════════════╝"));
  console.log(dim("  Answer the prompts. Your README will be forged.\n"));
}

// ─── Separator helper ─────────────────────────────────────────────────────────

const sep = (label) =>
  new inquirer.Separator(faint(`\n  ── ${label} ─────────────────────────────`));

// ─── Questions ────────────────────────────────────────────────────────────────

const questions = [
  // Project
  sep("PROJECT"),
  {
    type: "input",
    name: "title",
    message: neon("Project name:"),
    validate: (v) => v.trim() !== "" || warn("Title can't be empty."),
  },
  {
    type: "input",
    name: "description",
    message: neon("Description") + muted(" (what it does, why it exists):"),
    validate: (v) => v.trim() !== "" || warn("Description can't be empty."),
  },
  {
    type: "input",
    name: "version",
    message: neon("Version:"),
    default: "1.0.0",
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
    default: "MIT",
  },

  // Author
  sep("AUTHOR"),
  {
    type: "input",
    name: "github",
    message: neon("GitHub username:"),
    default: "bkness",
  },
  {
    type: "input",
    name: "email",
    message: neon("Contact email:"),
    default: "DevBrandon@icloud.com",
  },
];

// ─── Output ───────────────────────────────────────────────────────────────────

async function writeReadme(content) {
  const outDir  = "dist";
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
    const data    = await promptInSections(questions);
    const content = generateMarkdown(data);
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
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  init();
}
