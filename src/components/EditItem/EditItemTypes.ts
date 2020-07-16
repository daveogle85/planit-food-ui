export type EditItemProps<T extends { id?: string }, ApiT> = {
  itemName: string;
  search: (
    searchText: string,
    localItems: Array<T> | null,
    prevSearchResultsFound: boolean,
    prevSearchString: string
  ) => Promise<Array<ApiT>>;
  allItems: Array<T> | null;
  isLoading: boolean;
  selectedItem: T | null;
  handleItemUpdate: (mealToUpdate: T | ApiT | null) => void;
  fetchAllItems: () => void;
  handleItemClear: () => void;
  isItemEdited: boolean;
};
