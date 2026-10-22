/**
 * Native DeepSeek Harness bundle for Matt Pocock's engineering/productivity skills.
 *
 * The provider is intentionally isolated: DSH's normal project and user skill
 * roots stay registered under their own providers, while this package exposes
 * only the skills shipped in this bundle.
 */
import { fileURLToPath } from "node:url";
import * as SkillFilesystem from "@deepseek-ai/dsh-skill-filesystem";

const SKILLS_DIR = fileURLToPath(new URL("../skills", import.meta.url));

export const name = "mattpocock-skills";
export const inject = ["skills"];

export function apply(ctx) {
  ctx.plugin(SkillFilesystem, {
    providerName: "mattpocock",
    includeDefaultRoots: false,
    customSkillDirs: [SKILLS_DIR],
  });
}
