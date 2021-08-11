# Process

### Updating `develop` version

- [ ] `git fetch --tags` to get latest tags
- [ ] `git checkout -b bump/X.X.X` to create branch to bump version number
- [ ] `npm version major|minor|patch -m "chore: bump version to X.X.X"` to update `package.json` version. This will create a commit. This also triggers `npm run version` before making the commit, so `CHANGELOG.md` will get updated as part of the same commit.
- [ ] Create a PR to merge the bump branch `bump/X.X.X` into `develop`. The PR's comment should be empty.
- [ ] Confirm that the latest tag can be found at https://github.com/weiseng18/math/tags. If not, manually push the tags using the command `git push origin --tags`

### Merging into `master`

- [ ] Create PR to merge `develop` into `master`, with title `Release: X.X.X: Title`
- [ ] The PR's comment should contain `This release contains:` and copied changes from `CHANGELOG.md`
- [ ] Merge `develop` into `master`
