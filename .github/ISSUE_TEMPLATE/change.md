---
name: Change
about: Plan and deliver a bounded repository change
title: ''
labels: ''
assignees: ''
---

## Problem

<!-- Describe the observable problem or repository need. Cite files, behaviour or other evidence. -->

## Expected outcome

<!-- State the user-visible or source-verifiable result. -->

## Scope

<!-- List the exact files, behaviours or local surfaces that may change. -->

- 

## Non-goals

<!-- State what must not change. Include protected application, workflow, dependency or settings boundaries when relevant. -->

- 

## Acceptance criteria

<!-- Use observable criteria that a reviewer can verify. -->

- [ ] 

## Validation evidence expected

<!-- Name the checks appropriate to this change. Use the final branch or PR head. -->

Repository-native or source checks:

```text
<exact checks, browser flows or inspection steps>
```

Additional evidence:

- final changed-file list;
- final-head commit;
- relevant browser, console, link, syntax or source inspection;
- regression checks for protected behaviour; and
- legitimate post-merge verification.

Unavailable checks must be recorded as pending or unavailable, not passed.

## Change risk

<!-- Describe the consequence of an incorrect or incomplete change. -->

Risk level:

- Low / Moderate / High

## Agent and contributor instructions

- Re-fetch this issue and all comments before implementation.
- Use repository state and this issue as authoritative.
- Follow `AGENTS.md`.
- Post a readiness and dependency decision before branch creation.
- Post a detailed implementation plan before branch creation.
- Record the exact current `main` commit used as the branch base.
- Use one branch named `feature/<issue-number>-<short-description>`.
- Before each write, verify the operation, target, expected effect, forbidden effects and authority.
- Keep the change limited to this contract.
- Validate against the final branch or PR head.
- Open the pull request as draft while implementation or evidence is incomplete.
- Perform the groundedness review before requesting human approval.
- Do not merge without the authority stated below.

## Dependencies and safe starting state

Required prior work or decisions:

- 

Safe starting branch or commit:

- 

Why it is safe:

- 

## Authority boundary

<!-- State exactly what this issue authorises and excludes. Access does not imply authority. -->

Permitted mutation:

- 

Prohibited mutation:

- 

Merge authority:

- Per-PR human approval / Explicit bounded delegation / Other: 

Before readiness and planning comments are complete, this issue does not authorise branch creation or file mutation.

## Relationships

<!-- Link a parent issue, roadmap or related work only when one exists. -->

- None

## Post-merge verification

<!-- State exact checks and where their evidence will be recorded, or write None. -->

- 
