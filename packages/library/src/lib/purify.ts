const purify = <T>(F: () => T): (() => T) => {
  let calculatedValue: T;
  let valueHasBeenCalculated = false;
  return () => {
    if (!valueHasBeenCalculated) {
      calculatedValue = F();
      valueHasBeenCalculated = true;
    }
    return calculatedValue;
  };
};

export default purify;
