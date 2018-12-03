export function alphaSortAsc(toSearchField) {
  return (a, b) => {
    const aLow = toSearchField(a).toLowerCase()
        , bLow = toSearchField(b).toLowerCase()
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

