import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");
const parse = (path) => JSON.parse(read(path));
const errors = [];
const fail = (message) => errors.push(message);
const expectedCount = 27;

const pkg = parse("package.json");
const plugin = parse("plugin.json");
if (pkg.name !== "mattpocock-skills-deepseek") fail("package.json name does not match the bundle slug.");
if (pkg.license !== "MIT" || plugin.license !== "MIT") fail("MIT licensing must be declared in both manifests.");
if (plugin.name !== pkg.name || plugin.version !== pkg.version) fail("plugin.json name/version must match package.json.");
if (plugin.repository !== "https://github.com/mulqizamzam/mattpocock-skills-deepseek") fail("plugin.json repository URL is inconsistent.");
if (pkg.dsh?.bundle?.patch !== "./.dsh-plugin/cordis.patch.yml") fail("package.json must point to the DSH bundle patch.");
if (!existsSync(join(root, pkg.dsh.bundle.patch))) fail("DSH bundle patch is missing.");
const patch = read(".dsh-plugin/cordis.patch.yml");
const entry = read(".dsh-plugin/index.mjs");
if (!patch.includes('name: "mattpocock-skills-deepseek/.dsh-plugin/index.mjs"')) fail("Bundle patch does not mount the native DSH entry point.");
if (!patch.includes("id: mattpocock-skills")) fail("Bundle patch id is missing.");
if (!entry.includes('export const name = "mattpocock-skills"')) fail("Runtime plugin name and patch id must agree.");
if (!entry.includes("@deepseek-ai/dsh-skill-filesystem") || !entry.includes("customSkillDirs: [SKILLS_DIR]")) fail("Runtime entry must register its packaged skill root.");
if (!entry.includes("includeDefaultRoots: false")) fail("Packaged provider must not duplicate normal DSH skill roots.");
if (!existsSync(join(root, "LICENSE"))) fail("MIT LICENSE file is missing.");
if (!read("LICENSE").includes("Copyright (c) 2026 Matt Pocock")) fail("Upstream copyright attribution is missing.");

const skillRoot = join(root, "skills");
const dirs = readdirSync(skillRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
if (dirs.length !== expectedCount) fail(`Expected ${expectedCount} skill directories; found ${dirs.length}.`);
const skillNames = new Set();

function localMarkdownLinks(content, file) {
  // Documentation often includes example links inside fenced code. Those paths
  // describe a user's project and are not shipped package resources, so check prose links only.
  const prose = content.replace(/^\x60\x60\x60[^\n]*\n[\s\S]*?^\x60\x60\x60[ \t]*$/gm, "").replace(/\x60[^\x60]*\x60/g, "");
  const linkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;
  for (const match of prose.matchAll(linkPattern)) {    let target = match[1].trim().replace(/^<|>$/g, "");
    if (!target || /^(?:[a-z]+:|\/\/|#)/i.test(target)) continue;
    target = target.split("#", 1)[0].split("?", 1)[0];
    if (!target) continue;
    const resolved = resolve(dirname(join(root, file)), decodeURIComponent(target));
    const rel = resolved.slice(root.length + 1);
    if (resolved !== root && !resolved.startsWith(root + "/")) {
      fail(`${file}: local link escapes package root: ${match[1]}`);
    } else if (!existsSync(resolved)) {
      fail(`${file}: missing local link target ${match[1]}`);
    } else if (!rel.startsWith("skills/")) {
      // Cross-links outside the skill payload are checked as well, such as README docs.
    }
  }
}

for (const dir of dirs) {
  const skillPath = `skills/${dir}/SKILL.md`;
  if (!existsSync(join(root, skillPath))) {
    fail(`${dir}: missing SKILL.md`);
    continue;
  }
  const content = read(skillPath);
  const frontmatter = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) {
    fail(`${skillPath}: missing YAML frontmatter`);
    continue;
  }
  const name = frontmatter[1].match(/^name:\s*["']?([a-z0-9]+(?:-[a-z0-9]+)*)["']?\s*$/m)?.[1];
  const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (!name) fail(`${skillPath}: missing or invalid name`);
  else {
    if (name !== dir) fail(`${skillPath}: frontmatter name ${name} differs from directory ${dir}`);
    if (skillNames.has(name)) fail(`Duplicate skill name: ${name}`);
    skillNames.add(name);
  }
  if (!description) fail(`${skillPath}: missing description`);
  if (!frontmatter[1].includes("disable-model-invocation: true") && !frontmatter[1].includes("user-invocable:")) {
    // Default invocation policy is valid; explicit flags are optional.
  }
  localMarkdownLinks(content, skillPath);
  const resourceFiles = readdirSync(join(skillRoot, dir), { withFileTypes: true });
  for (const item of resourceFiles) {
    if (item.isFile() && item.name !== "SKILL.md" && item.name.endsWith(".md")) {
      localMarkdownLinks(read(`skills/${dir}/${item.name}`), `skills/${dir}/${item.name}`);
    }
  }
}
if (existsSync(join(skillRoot, "resolving-merge-conflicts"))) fail("Removed upstream skill resolving-merge-conflicts must not be carried forward.");
if (existsSync(join(skillRoot, "in-progress"))) fail("Experimental/in-progress skills must not be shipped in this stable bundle.");

if (errors.length) {
  console.error("DSH bundle validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`DSH bundle validation passed: ${skillNames.size} skills, manifests aligned, local markdown links resolved.`);
}
