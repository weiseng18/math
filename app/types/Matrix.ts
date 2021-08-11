enum EchelonType {
  NONE = "None",
  REF = "Row echelon form",
  RREF = "Reduced row echelon form",
}

enum RowOperation {
  NONE = "none",
  ADD_MULTIPLE = "addMultiple",
  MULTIPLY_ROW = "multiplyRow",
  SWAP = "swap",
}

export { EchelonType, RowOperation }
