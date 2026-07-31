# Repository delivery rules

These rules apply to all work in this repository. Repository-owner instructions and the active GitHub issue take precedence when they are more specific.

## Repository boundaries

MRI Fourier Lab is a dependency-free browser application. `README.md` is the authority for running the project and its educational scope. The existing GitHub Pages workflow owns publication.

Do not change application behaviour, educational content, assets, dependencies, build tooling, workflows, settings, permissions, branch protection, required checks or merge configuration unless the active issue explicitly authorises that change.

## Issue-driven delivery

Every repository change must begin with one executable GitHub issue. The issue must state:

- the problem and expected outcome;
- exact scope and non-goals;
- observable acceptance criteria;
- change-specific validation evidence;
- risk and operational constraints;
- dependencies and the safe starting state;
- agent or contributor instructions;
- approval and merge authority; and
- post-merge verification when needed.

Use repository state and the issue thread as authoritative evidence. Do not rely on private chat history or unstated intent.

## Readiness and planning gates

Before creating a branch:

1. fetch the issue and all comments;
2. confirm the outcome, scope, acceptance criteria, validation, risk, dependencies and authority are executable;
3. post a readiness and dependency decision in the issue;
4. post a detailed implementation plan in the issue; and
5. record the exact current `main` commit that will be used as the branch base.

If a material requirement or authority boundary is unclear, post a clarification comment and do not create a branch or mutate files.

## Branches and scope

Use one branch per issue:

```text
feature/<issue-number>-<short-description>
```

Create it from the recorded current `main` head. Keep the diff small and limited to the issue. Do not mix unrelated refactoring, cleanup or feature work into the branch.

Do not commit directly to `main` unless the repository owner explicitly authorises a separate hotfix path.

## Safe mutation check

Before every write, confirm:

- operation: what will be created, changed or deleted;
- target: repository, branch and path;
- expected effect: which acceptance criterion the write satisfies;
- forbidden effects: protected files, behaviours or settings that must remain unchanged;
- authority: the issue text or comment that permits the write; and
- recoverability: how the change can be reviewed or reversed.

Stop rather than guess when the target, effect or authority is uncertain.

## Validation

Validation must match the change and be tied to the final branch or pull-request head.

For documentation or template-only changes, normally:

- read back every changed file;
- compare the final changed-file list with the issue and plan;
- inspect Markdown structure, front matter, links and repository paths;
- confirm protected application and workflow files did not enter the diff; and
- inspect any repository-native checks without claiming unavailable checks passed.

For user-facing application changes, use the relevant subset of:

- open `index.html` in a modern browser;
- exercise image upload, spectrum inspection, coefficient selection and reconstruction;
- check the affected mathematics or learning panel;
- check keyboard and responsive behaviour when relevant;
- check the browser console for new errors; and
- confirm dependency-free local operation remains intact.

The Pages workflow runs after changes reach `main`; observe its result as post-merge evidence when relevant, but do not change the workflow merely to validate a feature branch.

Record validation as **Completed**, **Pending local validation**, **Pending environment-specific validation** or **Unavailable**. Never mark a check complete unless it was actually performed.

## Pull requests and review

Open the pull request as a draft while implementation or evidence is incomplete. The pull request must identify:

- the executable issue and final head commit;
- intended scope and explicit exclusions;
- changed files and acceptance evidence;
- completed, pending and unavailable validation;
- assumptions, caveats, residual risks and post-merge checks; and
- any deviation from the issue or implementation plan.

Before requesting approval, perform a groundedness review that answers:

1. **Did we do what was needed?** Check issue alignment, acceptance evidence and validation.
2. **Did we only do what was asked?** Check scope control, protected areas and unintended changes.

Use one recommendation:

- **Approve**
- **Approve after minor fixes**
- **Do not approve yet**

Do not recommend approval when validation is incomplete in a way that affects correctness, available checks are failing, scope has drifted or the issue is not satisfied.

## Merge authority

Per-pull-request human approval is required unless a later issue contains an explicit, bounded repository-owner delegation.

Do not configure or use auto-merge without separate authority. Do not merge your own pull request merely because checks pass or the groundedness review recommends approval. After merge, verify the resulting `main` state and record any remaining checks or unexpected effects.