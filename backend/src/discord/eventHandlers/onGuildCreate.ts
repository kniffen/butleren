import type { Guild } from "discord.js";
import { updateGuildCommands } from "../utils/updateGuildCommands";

export const onGuildCreate = async (guild: Guild): Promise<void> => {
  try {
    console.log(`Discord: Connected to new guild guild "${guild.name}"`);
    await updateGuildCommands(guild);

  } catch (err) {
    console.error("Discord: Error during onGuildCreate event", err);
  }
};