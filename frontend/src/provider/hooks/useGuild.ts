import { useCallback, useState } from "react";
import { Guild, GuildSettings } from "../../types";

export const useGuild = () => {
  const [guild, setGuildState] = useState<Guild | null>(null);

  const setGuild = useCallback(async (id: string) => {
    const res = await fetch(`/api/discord/guilds/${id}`);
    if (!res.ok) {
      setGuildState(null);
      return;
    }

    const data = await res.json() as Guild;
    setGuildState(data);
  }, []);

  const putGuildSettings = useCallback(async (id: string, settings: GuildSettings): Promise<boolean> => {
    const res = await fetch(`/api/discord/guilds/${id}`, {method: 'PUT', body: JSON.stringify(settings)});
    if (!res.ok) {
      console.log('Failed to update guild settings', res.status, res.statusText);
      return false;
    }

    return true;
  }, [])

  return {
    guild,
    setGuild,
    putGuildSettings
  };
}