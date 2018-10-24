export function alphaSortAsc(field, fallbackField) {
  return (a, b) => {
    const aField = a[field]
        , bField = b[field]
        , aLow = aField ? aField.toLowerCase() : a[fallbackField].toLowerCase()
        , bLow = bField ? bField.toLowerCase() : b[fallbackField].toLowerCase()
        ;

    if (aLow < bLow) {
      return -1;
    }

    if (aLow > bLow) {
      return 1;
    }

    return 0;
  }
}

