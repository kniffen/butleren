import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Guild, Command, CommandSettings } from '../../types';

export interface CommandsHook {
  data: Command[];
  isLoading: boolean;
  update: () => Promise<void>;
  updateSettings: (slug: string, settings: CommandSettings) => Promise<boolean>;
  restoreCommand: (slug: string) => Promise<boolean>;
}

export const useCommands = (guild: Guild | null): CommandsHook => {
  const [data, setData] = useState<Command[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const update = useCallback(async () => {
    if (!guild) {
      return;
    }

    setIsLoading(true);
    const res = await fetch(`/api/commands/${guild.id}`);
    if (!res.ok) {
      setData([]);
      setIsLoading(false);
      return;
    }

    const data = await res.json() as Command[];
    data.sort((a, b) => a.slug.localeCompare(b.slug));

    setData(data);
    setIsLoading(false);
  }, [guild]);

  const updateSettings = useCallback(async (slug: string, settings: CommandSettings): Promise<boolean> => {
    if (!guild) {
      return false;
    }

    const res = await fetch(`/api/commands/${slug}/${guild.id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(settings),
    });

    return res.ok;
  }, [guild]);

  const restoreCommand = useCallback(async (slug: string) => {
    if (!guild) {
      return false;
    }

    const res = await fetch(`/api/commands/${slug}/${guild.id}/restore`, {
      method: 'POST',
    });

    return res.ok;
  }, [guild]);

  useEffect(() => {
    update();
  }, [guild]);

  return useMemo(() => ({
    data,
    isLoading,
    update,
    updateSettings,
    restoreCommand,
  }), [data, isLoading, restoreCommand, update, updateSettings]);
};