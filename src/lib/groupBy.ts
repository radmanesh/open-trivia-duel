type Grouped<T> = { [key: string]: T };

export function groupBy<T>(
  items: T[],
  getKey: (item: T) => string
): Grouped<T> {
  return items.reduce((accumulator: Grouped<T>, currentItem: T) => {
    const key = getKey(currentItem);
    if (!accumulator[key]) {
      accumulator[key] = {} as T;
    }
    // Update the group
    accumulator[key] = {
      ...accumulator[key],
      ...currentItem,
    };
    return accumulator;
  }, {});
}
