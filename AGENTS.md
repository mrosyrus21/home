# House project instructions

## Production deployment ownership

- Only the Schedule Keeper task (`home-schedule-keeper`) may integrate, push, or deploy the Home & Garden GitHub Pages site.
- Other tasks may prepare project edits, but must not push or deploy them; leave a precise handoff for Schedule Keeper to review and publish.
- Schedule Keeper deployments must start from a fresh worktree at current `origin/main` and include only explicitly reviewed files. Never deploy from the dirty shared House worktree.
