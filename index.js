import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const COMMANDS_DIR = fileURLToPath(new URL("./commands/", import.meta.url));
const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;

async function listMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function parseFrontmatter(content) {
  const match = content.match(FRONTMATTER_PATTERN);

  if (!match) {
    return { frontmatter: {}, body: content.trim() };
  }

  const [, rawFrontmatter, body] = match;
  const frontmatter = {};

  for (const line of rawFrontmatter.split("\n")) {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (!value) {
      continue;
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key === "subtask") {
      frontmatter[key] = value === "true";
      continue;
    }

    frontmatter[key] = value;
  }

  return { frontmatter, body: body.trim() };
}

async function loadCommands() {
  const commandFiles = await listMarkdownFiles(COMMANDS_DIR);
  const commands = [];

  for (const filePath of commandFiles) {
    const content = await readFile(filePath, "utf8");
    const { frontmatter, body } = parseFrontmatter(content);
    const relativePath = path.relative(COMMANDS_DIR, filePath);
    const name = relativePath.replace(/\\/g, "/").replace(/\.md$/, "").replace(/\//g, "-");

    commands.push({
      name,
      frontmatter,
      template: body,
    });
  }

  return commands;
}

export async function OpenCodeMinispec() {
  const commands = await loadCommands();

  return {
    async config(config) {
      config.command ??= {};

      for (const command of commands) {
        if (config.command[command.name] !== undefined) {
          continue;
        }

        const { description, agent, model, subtask } = command.frontmatter;

        config.command[command.name] = {
          template: command.template,
          ...(description ? { description } : {}),
          ...(agent ? { agent } : {}),
          ...(model ? { model } : {}),
          ...(subtask !== undefined ? { subtask } : {}),
        };
      }
    },
  };
}

export default OpenCodeMinispec;
