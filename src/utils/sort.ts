export type SortBy = 'id' | 'title';
export type SortOrder = 'asc' | 'desc';

export const sortByField = <T extends Record<string, any>>(
  items: T[],
  sortBy: SortBy,
  sortOrder: SortOrder
): T[] => {
  return [...items].sort((a, b) => {
    const field = sortBy;
    const order = sortOrder === 'asc' ? 1 : -1;

    if (a[field] < b[field]) return -1 * order;
    if (a[field] > b[field]) return 1 * order;
    return 0;
  });
};
export const sortOptions = [
  { label: 'ID', value: 'id' },
  { label: 'Название', value: 'title' },
];

export const orderOptions = [
  { label: 'По возрастанию', value: 'asc' },
  { label: 'По убыванию', value: 'desc' },
];