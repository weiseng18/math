# Process

- [ ] `git fetch --tags` to get latest tags
- [ ] `npm version major|minor|patch -m "chore: bump version to X.X.X"` to update `package.json` version. This will create a commit. This also triggers `npm run version` before making the commit, so `CHANGELOG.md` will get updated as part of the commit.
- [ ] `git checkout -b bump/X.X.X` to create branch to bump version number. Merge this branch into `develop`
- [ ] Confirm that the latest tag can be found at https://github.com/weiseng18/math/tags. If not, manually push the tags using the command `git push origin --tags`
- [ ] Merge `develop` into `master`
