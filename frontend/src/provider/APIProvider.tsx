import { createContext } from "react";
import { Guild, GuildSettings } from "../types";
import { useGuilds } from "./hooks/useGuilds";
import { useGuild } from "./hooks/useGuild";

interface APIProviderState {
  guilds: Guild[];
  updateGuilds: () => Promise<void>;
  guild: Guild | null;
  setGuild: (id: string) => Promise<void>;
  putGuildSettings: (id: string, settings: GuildSettings) => Promise<boolean>;
}

export const APIProviderContext = createContext<APIProviderState | null>(null);

export const APIProvider = ({children}: {children: React.ReactNode}) => {
  const guildsHook = useGuilds();
  const guildHook = useGuild();

  return (
    <APIProviderContext.Provider value={{
      ...guildsHook,
      ...guildHook
    }}>
      {children}
    </APIProviderContext.Provider>
  );
}