import { type JSX, useEffect, useState } from 'react';
import { SearchResult } from '../../types';
import './SearchResults.scss';
import { LoadingCard } from '../LoadingCard/LoadingCard';

interface SearchResultsProps {
  isSearching: boolean;
  searchResults: SearchResult[] | null;
  onSelect: (result: SearchResult) => void;
}

export const SearchResults = function({ isSearching, searchResults, onSelect }: SearchResultsProps): JSX.Element {
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  useEffect(() => {
    if (searchResults && 0 < searchResults.length) {
      setSelectedResult(searchResults[0]);
      onSelect(searchResults[0]);
    }
  }, [searchResults]);

  if (isSearching) {
    return <LoadingCard height='20rem' />;
  }

  if (0 === searchResults?.length) {
    return <div className="search-results">
      <p>No results found.</p>
    </div>;
  }

  if (!searchResults || !selectedResult) {
    return <div className="search-results"></div>;
  }

  return (
    <div className="search-results">
      {searchResults.map((result) =>
        <div
          className={`search-result-item${selectedResult.id === result.id ? ' search-result-item--selected' : ''}`}
          key={result.id}
          aria-selected={selectedResult.id === result.id}
          onClick={() => {
            setSelectedResult(result);
            onSelect(result);
          }}
        >
          <img className="search-result-item__image" src={result.imageURL}></img>
          <span className="search-result-item__name">{result.name}</span>
        </div>
      )}
    </div>
  );
};

