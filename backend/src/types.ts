import type { ChannelType, CommandInteraction } from "discord.js";
import type { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "@discordjs/builders";

export interface Command {
  isLocked: boolean;
  slashCommandBuilder: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
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