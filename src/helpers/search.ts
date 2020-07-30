import { nullOrEmptyString } from './string';
import { isNullOrUndefined } from 'util';

type ApiSearch<ApiT> = (
  searchText: string
) => (token: string | null | undefined) => Promise<Array<ApiT>>;

export type SearchFunction = <T extends { name?: string }, ApiT>(
  apiSearch: ApiSearch<ApiT>,
  convertLocalResult: (result: T) => ApiT,
  token?: string | null
) => (
  searchText: string,
  localItems: Array<T> | null,
  prevSearchResultsFound: boolean,
  prevSearchString: string
) => Promise<Array<ApiT>>;

/**
 * Search for a string of text
 * Use local values if found
 * If no local values search using supplied api call
 * @param apiSearch
 * @param convertLocalResult
 * @param token
 */
export const search: SearchFunction = (
  apiSearch,
  convertLocalResult,
  token
) => (searchText, localItems, prevSearchResultsFound, prevSearchString) => {
  let result: typeof localItems = [];
  const lowerCaseSearchText = searchText.toLowerCase().trim();
  const lowerCasePrevSearchText = prevSearchString.toLowerCase().trim();

  // If no results last time and current search is an
  // extension of previous don't do the search.
  if (
    !nullOrEmptyString(lowerCaseSearchText) &&
    (nullOrEmptyString(lowerCasePrevSearchText) ||
      prevSearchResultsFound ||
      lowerCasePrevSearchText.length === 1 ||
      !lowerCaseSearchText.includes(lowerCasePrevSearchText))
  ) {
    // Check if we can search locally.
    if (isNullOrUndefined(localItems)) {
      return apiSearch(lowerCaseSearchText)(token);
    }
    result =
      lowerCaseSearchText.length === 1
        ? localItems.filter(item =>
            item.name?.toLowerCase().startsWith(lowerCaseSearchText)
          )
        : localItems.filter(item =>
            item.name?.toLowerCase().includes(lowerCaseSearchText)
          );
  }
  return new Promise(res => res(result!.map(convertLocalResult)));
};

export default search;
