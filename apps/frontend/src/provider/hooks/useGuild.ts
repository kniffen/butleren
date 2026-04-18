import { useCallback, useMemo, useState } from 'react';
import { Guild, GuildSettings } from '../../types';

// TODO: handle errors, set error state

export interface GuildHook {
  data: Guild | null;
  isLoading: boolean;
  set: (id: string) => Promise<void>;
  updateSettings: (settings: GuildSettings) => Promise<boolean>;
}

export const useGuild = (): GuildHook => {
  const [data, setData] = useState<Guild | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setGuild = useCallback(async (id: string) => {
    setIsLoading(true);
    const res = await fetch(`/api/discord/guilds/${id}`);
    if (!res.ok) {
      setData(null);
      setIsLoading(false);
      return;
    }

    const data = await res.json() as Guild;
    data.channels?.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    data.roles?.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    setData(data);
    setIsLoading(false);
  }, []);

  const updateGuildSettings = useCallback(async (settings: GuildSettings): Promise<boolean> => {
    if (!data) {return false;}

    setIsLoading(true);
    const success = await putGuildSettings(data.id, settings);
    if (!success) {
      setIsLoading(false);
      return success;
    }

    await setGuild(data.id);
    setIsLoading(false);
    return true;
  }, [data, setGuild]);

  return useMemo(() => ({
    data,
    isLoading,
    set:            setGuild,
    updateSettings: updateGuildSettings,
  }), [data, isLoading, setGuild, updateGuildSettings]);
};

export async function putGuildSettings(id: string, settings: GuildSettings): Promise<boolean> {
  const res = await fetch(
    `/api/discord/guilds/${id}`,
    {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(settings)
    }
  );

  if (!res.ok) {
    return false;
  }

  return true;
};