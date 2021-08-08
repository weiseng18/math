/**
 * Returns true if every entry in the array is 0, false otherwise
 * @param arr 1D array
 */
const isZeroRow = (arr: number[]) => {
  return !arr.some((num) => num !== 0)
}

/**
 * Returns the index of the first non-zero entry in the array. Returns -1 if not found
 * @param arr 1D array
 */
const leadingEntryIndex = (arr: number[]) => {
  let idx = 0
  while (idx < arr.length) {
    if (arr[idx] !== 0) return idx
    idx++
  }
  return -1
}

export { isZeroRow, leadingEntryIndex }
