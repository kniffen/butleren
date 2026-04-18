import { useContext } from 'react';
import { APIProviderContext, type APIProviderState } from '../APIProvider';

export const useAPI = (): APIProviderState => {
  const context = useContext(APIProviderContext);
  if (!context) {
    throw new Error('useAPI must be used within an APIProvider');
  }

  return context;
};