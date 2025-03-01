import type { ChannelType, CommandInteraction } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";

export interface Command {
  isLocked: boolean;
  slashCommandBuilder: SlashCommandBuilder;
  execute: (commandInteraction: CommandInteraction) => Promise<void>;
}

export interface Module {
  slug: string;
  name: string;
  description: string;
  allowedChannelTypes: ChannelType[];
  isLocked: boolean;
  commands: Map<string, Command>;
}