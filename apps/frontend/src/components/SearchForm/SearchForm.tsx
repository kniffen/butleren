import { useCallback, useEffect, useRef, useState, type JSX } from 'react';
import type { SearchResult } from '../../types';
import { SearchResults } from './SearchResults';
import { getSearchResults } from './getSearchResults';
import { curateSearchResults } from './curateSearchResults';
import './SearchForm.scss';

interface SearchFormProps {
  initialQuery?: string;
  service: 'kick' | 'twitch' | 'youtube';
  onSelect: (result: SearchResult) => void;
}

export function SearchForm({ initialQuery, service, onSelect }: SearchFormProps): JSX.Element {
  const hasInitialized = useRef(false);
  const [isSearching, setIsSearching] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);

  const onSearchHandler = useCallback(async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    const form = e.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const formData = new FormData(form);
    const query = formData.get('query');

    if (query) {
      setIsSearching(true);

      const results = await getSearchResults(service, query.toString());
      setSearchResults(curateSearchResults(query.toString(), results));
      setIsSearching(false);
    }
  }, [service]);

  useEffect(() => {
    if (initialQuery && !hasInitialized.current) {
      hasInitialized.current = true;
      getSearchResults(service, initialQuery).then(results => {
        setSearchResults(curateSearchResults(initialQuery, results));
        setIsSearching(false);
      });
    } else {
      setIsSearching(false);
    }

    return (): void => {
      setSearchResults(null);
    };

  }, [hasInitialized, setSearchResults]);

  return <div className="search-form-container">
    <form className="search-form" onSubmit={onSearchHandler}>
      <input className="search-form__query" name="query" defaultValue={initialQuery} />
      <button className="search-form__button" type="submit">Find</button>
    </form>

    <SearchResults
      isSearching={isSearching}
      searchResults={searchResults}
      onSelect={onSelect}
    />
  </div>;
}