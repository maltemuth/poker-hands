/**
 * returns all sub-arrays of given items that have the given length, disregarding differently-ordered sub-arrays
 * @param items
 * @param length
 */
const combinations = <T>(items: T[], length: number): T[][] => {
  if (length > items.length) {
    throw new Error(
      `Cannot pick combinations of length ${length} out of ${items.length} elements`
    );
  }

  if (length < 0) {
    throw new Error("Cannot pick negative amount of elements");
  }

  if (length === 0) return [];

  if (length === 1) return items.map((item) => [item]);

  if (length === items.length) return [items];

  return items
    .map((value, index, list): T[][] => {
      if (list.length - index < length) return [];
      const subCombinationsAfterThisIndex = combinations(
        list.slice(index + 1),
        length - 1
      );
      return subCombinationsAfterThisIndex.map((subCombination) => [
        value,
        ...subCombination,
      ]);
    })
    .reduce((flat, list) => flat.concat(list));
};

export default combinations;
