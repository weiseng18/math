/**
 * Returns true if every entry in the array is 0, false otherwise
 * @param arr 1D array
 */
const isZeroRow = (arr: number[]) => {
  return !arr.some((num) => num !== 0)
}

export { isZeroRow }
