export function alphaSortAsc(field) {
  return (a, b) => {
    const aLow = a[field].toLowerCase()
        , bLow = b[field].toLowerCase()
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

