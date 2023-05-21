# Releasing

> I always forget how to do it, so a little reminder for myself.

0. After making changes run `pnpm changeset` to create a changeset. This is some sort of description of the changes you made.
1. When you want to create a release from the current changes, then run `pnpm changeset version`. This will consume
   the changesets and bump the version of the packages.
2. Run `pnpm release` to publish the packages to npm. This will ask for one time code from your authenticator app.
