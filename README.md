# math

Web app that helps to perform some math computation, and tries to provide the intermediate steps taken.

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
