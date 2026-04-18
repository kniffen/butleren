import { SearchResult } from '../../types';

  export const getSearchResults = async function (service: string, query: string): Promise<SearchResult[]> {
    const searchParams = new URLSearchParams();
    searchParams.append('query', query);
    const url = `/api/search/${service}?${searchParams.toString()}`;

    const res = await fetch(url.toString());
    if (!res.ok) {
      return [];
    }

    const data = await res.json() as SearchResult[];
    return data;
  };