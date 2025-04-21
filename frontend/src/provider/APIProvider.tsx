import { createContext, type JSX } from 'react';
import { Guild } from '../types';
import { useGuilds } from './hooks/useGuilds';
import { useGuild } from './hooks/useGuild';
import { useModules } from './hooks/useModules';
import { useLogger } from './hooks/useLogger';

export interface APIProviderState {
  guilds: Guild[];
  updateGuilds: () => Promise<void>;
  guild: ReturnType<typeof useGuild>;
  modules: ReturnType<typeof useModules>;
  logger: ReturnType<typeof useLogger>;
}

export const APIProviderContext = createContext<APIProviderState | null>(null);

export function APIProvider({ children }: {children: React.ReactNode}): JSX.Element {
  const guildsHook = useGuilds();
  const guild = useGuild();
  const modules = useModules(guild.data);
  const logger = useLogger();

  return (
    <APIProviderContext.Provider value={{
      ...guildsHook,
      guild,
      modules,
      logger,
    }}>
      {children}
    </APIProviderContext.Provider>
  );
};