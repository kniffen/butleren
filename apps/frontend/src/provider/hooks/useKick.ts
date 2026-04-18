import { useCallback, useState } from 'react';
import { Guild, KickChannel, KickNotificationConfig } from '../../types';

export interface KickHook {
  channels: KickChannel[];
  isLoading: boolean;
  getChannels: () => Promise<KickChannel[]>;
  updateChannels: () => Promise<void>;
  postChannel: (requestBody: KickNotificationConfig) => Promise<boolean>;
  deleteChannel: (broadcasterUserId: number) => Promise<boolean>;
}

export const useKick = (guild: Guild | null): KickHook => {
  const [channels, setChannels] = useState<KickChannel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getChannels = useCallback(async (): Promise<KickChannel[]> => {
    if (!guild) {
      return [];
    }

    const res = await fetch(`/api/kick/${guild.id}/channels`);
    if (!res.ok) {
      return [];
    }

    const data = await res.json() as KickChannel[];
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

  const postChannel = useCallback(async (requestBody: KickNotificationConfig): Promise<boolean> => {
    if (!guild) {
      return false;
    }

    const res = await fetch(
      `/api/kick/${guild.id}/channels`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(requestBody)
      }
    );

    return res.ok;
  }, [guild]);

  const deleteChannel = useCallback(async (broadcasterUserId: number) => {
    if (!guild) {
      return false;
    }

    const res = await fetch(
      `/api/kick/${guild.id}/channels/${broadcasterUserId}`,
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