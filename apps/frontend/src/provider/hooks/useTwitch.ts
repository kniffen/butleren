import { useCallback, useState } from 'react';
import { Guild, TwitchChannel, TwitchNotificationConfig } from '../../types';

export interface TwitchHook {
  channels: TwitchChannel[];
  isLoading: boolean;
  getChannels: () => Promise<TwitchChannel[]>;
  updateChannels: () => Promise<void>;
  postChannel: (requestBody: TwitchNotificationConfig) => Promise<boolean>;
  deleteChannel: (id: string) => Promise<boolean>;
}

export const useTwitch = (guild: Guild | null): TwitchHook => {
  const [channels, setChannels] = useState<TwitchChannel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getChannels = useCallback(async (): Promise<TwitchChannel[]> => {
    if (!guild) {
      return [];
    }

    const res = await fetch(`/api/twitch/${guild.id}/channels`);
    if (!res.ok) {
      return [];
    }

    const data = await res.json() as TwitchChannel[];
    data.sort((a, b) => a.name.localeCompare(b.name));

    return data;
  }, [guild]);

  const updateChannels = useCallback(async () => {
    if (!guild) {
      return;
    }

    setIsLoading(true);
    const data = await getChannels();
    setChannels(data);
    setIsLoading(false);
  }, [guild, getChannels]);

  const postChannel = useCallback(async (requestBody: TwitchNotificationConfig): Promise<boolean> => {
    if (!guild) {
      return false;
    }

    const res = await fetch(
      `/api/twitch/${guild.id}/channels`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(requestBody)
      }
    );

    return res.ok;
  }, [guild]);

  const deleteChannel = useCallback(async (id: string) => {
    if (!guild) {
      return false;
    }

    const res = await fetch(
      `/api/twitch/${guild.id}/channels/${id}`,
      { method: 'DELETE',      }
    );

    return res.ok;
  }, [guild]);

  return {
    channels,
    isLoading,
    getChannels,
    updateChannels,
    postChannel,
    deleteChannel
  };
};