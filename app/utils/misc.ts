/**
 * @param max highest value
 * @returns Array of [0, 1, ..., max-1]
 */
const range = (max: number) => {
  return [...Array(max).keys()]
}

export { range }
