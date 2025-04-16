import { useCallback, useState } from 'react';
import { Guild } from '../../types';

export interface GuildsHook {
  guilds: Guild[];
  updateGuilds: () => Promise<void>;
}

export const useGuilds = (): GuildsHook => {
  const [guilds, setGuilds] = useState<Guild[]>([]);

  const updateGuilds = useCallback(async () => {
    const res = await fetch('/api/discord/guilds');
    if (!res.ok) {
      setGuilds([]);
      return;
    }

    const data = await res.json() as Guild[];
    setGuilds(data);
  }, []);

  return {
    guilds,
    updateGuilds
  };
};