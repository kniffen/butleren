import { useCallback, useState } from 'react';
import { Guild } from '../../types';

export interface GuildsHook {
  data: Guild[];
  isLoading: boolean;
  update: () => Promise<void>;
}

export const useGuilds = (): GuildsHook => {
  const [data, setData] = useState<Guild[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const update = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch('/api/discord/guilds');
    if (!res.ok) {
      setData([]);
      setIsLoading(false);
      return;
    }

    const data = await res.json() as Guild[];
    data.sort((a, b) => a.name.localeCompare(b.name));

    setData(data);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    update
  };
};