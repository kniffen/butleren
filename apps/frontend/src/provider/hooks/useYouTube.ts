import { useCallback, useState } from 'react';
import { Guild, YouTubeChannel, YouTubeNotificationConfig } from '../../types';

export interface YouTubeHook {
  channels: YouTubeChannel[];
  isLoading: boolean;
  getChannels: () => Promise<YouTubeChannel[]>;
  updateChannels: () => Promise<void>;
  postChannel: (requestBody: YouTubeNotificationConfig) => Promise<boolean>;
  deleteChannel: (id: string) => Promise<boolean>;
}

export const useYouTube = (guild: Guild | null): YouTubeHook => {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getChannels = useCallback(async (): Promise<YouTubeChannel[]> => {
    if (!guild) {
      return [];
    }

    const res = await fetch(`/api/youtube/${guild.id}/channels`);
    if (!res.ok) {
      return [];
    }

    const data = await res.json() as YouTubeChannel[];
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

  const postChannel = useCallback(async (requestBody: YouTubeNotificationConfig): Promise<boolean> => {
    if (!guild) {
      return false;
    }

    const res = await fetch(
      `/api/youtube/${guild.id}/channels`,
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
      `/api/youtube/${guild.id}/channels/${id}`,
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