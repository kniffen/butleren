import { createContext, type JSX } from 'react';
import { Guild } from '../types';
import { useGuilds } from './hooks/useGuilds';
import { useGuild } from './hooks/useGuild';

export interface APIProviderState {
  guilds: Guild[];
  updateGuilds: () => Promise<void>;
  guild: ReturnType<typeof useGuild>;
}

export const APIProviderContext = createContext<APIProviderState | null>(null);

export function APIProvider({ children }: {children: React.ReactNode}): JSX.Element {
  const guildsHook = useGuilds();
  const guild = useGuild();

  return (
    <APIProviderContext.Provider value={{
      ...guildsHook,
      guild
    }}>
      {children}
    </APIProviderContext.Provider>
  );
};