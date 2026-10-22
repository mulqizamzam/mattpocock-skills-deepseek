# Conversion record

## Upstream snapshot

- Source repository: https://github.com/mattpocock/skills
- Source commit: `5beb35b040e3de97e54fa9e386d7e42d15c295c2` (2026-10-19)
- License: MIT; copyright notice retained in `LICENSE`.

## Inclusion policy

- Included all promoted/stable skills under upstream `skills/engineering` and `skills/productivity`: 20 engineering and 7 productivity skills.
- Preserved each skill's `SKILL.md` and all supporting resource files within the included skill directories.
- Repacked the category-prefixed upstream paths into the flat `skills/<skill-name>/` layout that DSH's local filesystem provider discovers.
- Excluded category overview READMEs, `agents/openai.yaml` files intended for another host's UI, plus experimental/in-progress and unrelated skill trees. No stable engineering or productivity skill was excluded from the selected upstream snapshot.

## DSH adaptation

- Added a DSH bundle manifest in `package.json` under `dsh.bundle.patch`.
- Added `.dsh-plugin/cordis.patch.yml` and `.dsh-plugin/index.mjs`; the entry registers an isolated `@deepseek-ai/dsh-skill-filesystem` provider over this package's `skills/` directory.
- Retained upstream invocation-policy frontmatter and native `skill` loader guidance: DSH's skill subsystem supports user-invoked `/name` skills and model-invoked skill loading.
- Added a package validator and CI workflow to check manifest alignment, skill frontmatter, expected skill inventory, and local resource links.

## Verification boundary

Static checks can validate the repository payload and internal consistency. An actual `dsh plugin --profile web add` + profile restart smoke test requires a DSH installation and was not executed by the packaging process.
