# Matt Pocock Skills — DeepSeek Harness port

A native DeepSeek Harness (DSH) bundle of the stable engineering and productivity skills from [`mattpocock/skills`](https://github.com/mattpocock/skills), with their supporting reference files preserved.

This is a community-maintained port, not an official Matt Pocock or DeepSeek AI project.

## Install

Install the bundle into the DSH web profile:

```bash
dsh plugin --profile web add github:mulqizamzam/mattpocock-skills-deepseek#main
```

Restart DSH after installation so the bundle is loaded:

```bash
dsh web
```

For the headless profile, substitute `--profile headless` in the install command, then run `dsh headless`.

Use the skills directly with slash commands for user-invoked workflows (for example, `/grill-me`, `/grill-with-docs`, `/to-spec`, or `/handoff`). Model-invocable skills are exposed to the DSH `skill` loader tool when available in the active profile.

## Included skills

This port tracks the promoted, stable skills under the upstream `skills/engineering` and `skills/productivity` trees at upstream commit [`5beb35b040e3de97e54fa9e386d7e42d15c295c2`](https://github.com/mattpocock/skills/commit/5beb35b040e3de97e54fa9e386d7e42d15c295c2). The port includes 27 skills and their in-skill resources, arranged as `skills/<skill-name>/SKILL.md` for DSH's directory-bundle discovery.

### Engineering (20)

- `ask-matt` — route to the engineering workflow that fits the task
- `code-review` — review a diff for standards and specification fidelity
- `codebase-design` — design deep modules and clean interfaces
- `diagnosing-bugs` — disciplined debugging and regression verification
- `domain-modeling` — sharpen domain vocabulary and decisions
- `grill-with-docs` — clarify a change and maintain domain docs / ADRs
- `implement-spec` — implement a ticket graph on an integration branch
- `implement` — implement work with TDD seams and review
- `improve-codebase-architecture` — find opportunities to deepen modules
- `pr` — structure a useful pull request with evidence and risk
- `prototype` — answer design questions with a disposable prototype
- `research` — research against high-trust primary sources
- `retro` — improve the coding-agent environment after a session
- `setup-matt-pocock-skills` — configure per-repository skill conventions
- `tdd` — use red-green-refactor in small vertical slices
- `to-spec` — turn the current discussion into an implementation spec
- `to-tickets` — turn plans into dependency-aware tracer-bullet tickets
- `triage` — triage issues through explicit roles and states
- `wayfinder` — navigate large efforts through decision tickets
- `wizard` — build guided instructions for steps a human must perform

### Productivity (7)

- `grill-me` — interview a plan or design until key branches are resolved
- `grilling` — reusable structured interview practice
- `handoff` — create a concise continuation handoff
- `teach` — teach a concept over multiple sessions
- `to-questionnaire` — prepare questions for a decision owner
- `wait-what` — re-explain something that did not land
- `writing-for-agents` — write effective agent-facing instructions and docs

## Porting notes

- Uses a DSH bundle manifest (`package.json` with `dsh.bundle.patch`) and a native `.dsh-plugin/index.mjs` entry point.
- Registers a dedicated filesystem skill provider rooted in this package's own `skills/` directory. Other project and user skill roots are left to DSH's normal providers.
- Keeps the upstream stable skills and their local supporting files; removes source-host-specific `agents/openai.yaml` metadata and experimental / unrelated skill trees.
- Preserves the upstream `disable-model-invocation` frontmatter and skill-to-skill guidance, since DSH's skill loader supports model-invocable skills and user-invoked `/name` commands.
- Upstream snapshot and changes are documented in [`CONVERSION.md`](CONVERSION.md).

## License and attribution

The included upstream skill content is distributed under the MIT License; see [`LICENSE`](LICENSE). Copyright for the upstream skill material remains with Matt Pocock. This repository adds the DSH bundle wrapper, path/layout adaptations, validation checks, and packaging notes.

Upstream project: https://github.com/mattpocock/skills
