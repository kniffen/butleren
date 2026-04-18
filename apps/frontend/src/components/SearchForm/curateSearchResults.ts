import { SearchResult } from '../../types';

export const curateSearchResults = (query: string, results: SearchResult[]): SearchResult[] => {
  const exactHit = results.find((r) => r.name.toLowerCase() === query.toString().toLowerCase());
  const rest = results.filter((r) => r.id !== exactHit?.id);
  const curatedResults = exactHit ? [exactHit, ...rest] : rest;

  return curatedResults;
};
