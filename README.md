# math

Web app that helps to perform some math computation, and tries to provide the intermediate steps taken.

## Where is this hosted?

This project has simple CI/CD, and semantic versioning. I manage my deployments with the `master` and `develop` branches.

`master` branch is hosted [here](https://math-weiseng18.vercel.app). It is also the link on the right side of panel of the Github page of this repo. This contains the production build, so it is the **latest stable release**. For every update to this branch, the semantic version changes.

`develop` branch is hosted [here](https://math-weiseng18-staging.vercel.app). This contains the staging build, so it contains the **very latest code**, being usually ahead of `master`. For every update to this branch, the semantic version might not change.

Vercel provides a preview deployment for every push to a branch. As a result the code can get tested online in each PR, prior to merging into `develop`. This usually means that `develop` is as stable as `master`. Thus, more often than not, you can just use the `develop` version.

## Functions

This app currently supports the following functions:

### Determinant of a square matrix

Frontend page: `/matrix`

Frontend usage: `det [[1,2],[3,4]]` or `determinant [[1,2],[3,4]]`

API: `/api/matrix/determinant?matrix=[[1,2],[3,4]]`

Description: Calculates the determinant of a square matrix. Currently does not show the intermediate steps taken. The algorithm used is Laplace expansion which is `O(N!)`, so this could be slow for larger matrices.

### RREF of a matrix

Frontend page: `/matrix`

Frontend usage: `rref [[1,2],[3,4]]`

API: `/api/matrix/rref?matrix=[[1,2],[3,4]]`

Description: Reduces a matrix to RREF. The algorithm used first reduces the matrix to a REF form, then to RREF form.

### Inverse of a square matrix

Frontend page: `/matrix`

Frontend usage: `inv [[1,2],[3,4]]` or `inverse [[1,2],[3,4]]`

API: `/api/matrix/inverse?matrix=[[1,2],[3,4]]`

Description: Obtains the inverse of a matrix. The algorithm used reduces the original matrix to RREF while playing the same row operations onto an identity matrix of the same dimensions.

## Caveats

- Does not support fraction input
- Supports RREF calculations where you have non-terminating decimals, such as the decimal representation of `1/3`. The output might contain somewhat long decimal representations but the idea is there.
- Comes with usual floating point errors
