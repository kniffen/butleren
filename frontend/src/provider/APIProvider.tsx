import { createContext, type JSX } from 'react';
import { Guild } from '../types';
import { useGuilds } from './hooks/useGuilds';
import { useGuild } from './hooks/useGuild';
import { useModules } from './hooks/useModules';

export interface APIProviderState {
  guilds: Guild[];
  updateGuilds: () => Promise<void>;
  guild: ReturnType<typeof useGuild>;
  modules: ReturnType<typeof useModules>;
}

export const APIProviderContext = createContext<APIProviderState | null>(null);

export function APIProvider({ children }: {children: React.ReactNode}): JSX.Element {
  const guildsHook = useGuilds();
  const guild = useGuild();
  const modules = useModules(guild.data);

  return (
    <APIProviderContext.Provider value={{
      ...guildsHook,
      guild,
      modules,
    }}>
      {children}
    </APIProviderContext.Provider>
  );
};