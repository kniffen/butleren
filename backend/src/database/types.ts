export interface GuildSettings {
  nickname?: string;
  timezone: string;
  color: string;
}

export interface UserSettings {
  location?: string;
}

export interface ModuleSettings {
  isEnabled: boolean;
}