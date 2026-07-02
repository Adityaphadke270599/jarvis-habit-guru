# Git workflow

Two long-lived branches. Everything else flows through them.

```
feature/*  →  test  →  main
```

## The branches

| Branch | What it means | Who lands changes there |
|---|---|---|
| `main` | Demo-ready. Every commit here is safe to show to Kanchuki, ship as a preview URL, or hand to an engineer. | Only merges from `test`, after the change has been previewed. |
| `test` | Working line. Where feature work integrates and is exercised before promotion. | Direct commits (small changes) or merges from `feature/*` (larger ones). |

## The flow

1. **Work on `test`** (or a `feature/<slug>` branch off `test` for changes worth isolating).
2. **Preview it** — run `pnpm preview` in `Frontend/`, open `dist/preview.html`, walk the beats end-to-end.
3. **Merge to `main`** when the change is demo-safe. Use `git merge --no-ff test` from `main` so the merge is a real commit, not a fast-forward — it keeps the promotion event visible in history.
4. **Push `main`** — this is the "ship" moment.

## Rules

- **Never commit directly to `main`.** All changes arrive via merge from `test`.
- **Never squash on the way to `main`** unless the `test`-side history is truly noise. Losing the audit trail costs more than a slightly untidy log.
- **Never rebase `main`.** Merges only. `test` may be rebased locally before its first push.
- **Hotfixes** — for a demo-day emergency, branch `hotfix/<slug>` off `main`, land the fix, merge to *both* `main` and `test`.

## GitHub-side setup (do once)

Set branch protection on `main` at:
`https://github.com/Adityaphadke270599/jarvis-habit-guru/settings/branches`

Recommended rules for a solo/tiny-team repo:

- Require pull request before merging
- Require linear history (blocks accidental rebase-and-merge)
- Do **not** require reviews (you're the only reviewer; a review requirement blocks you)
- Do **not** allow force pushes to `main`

This mostly protects you from yourself on a late night before a demo. It does not add ceremony.

## Everyday commands

```bash
# Start of session — make sure test is fresh
git switch test
git pull

# Do the work, commit as you go
git add ...
git commit -m "..."
git push

# Promote to main when ready
git switch main
git pull
git merge --no-ff test -m "release: <what changed>"
git push
git switch test  # go back to working line
```
