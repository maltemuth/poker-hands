const shuffle = <T>(items: T[]): T[] => {
  const remainingItems = items.concat();
  const result: T[] = [];
  for (let i = items.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);

    result.push(remainingItems[randomIndex]);
    remainingItems.splice(randomIndex, 1);
  }

  return result;
};

export default shuffle;
