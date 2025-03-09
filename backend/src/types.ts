import type { ChannelType, CommandInteraction } from 'discord.js';
import type { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from '@discordjs/builders';
import type { components } from '../../api-contract';

// API types
export type GuildSettings      = components['schemas']['GuildSettings'];
export type GuildsResponseBody = components['schemas']['Guild'][];
export type GuildResponseBody  = components['schemas']['Guild'];
export type ModuleSettings     = components['schemas']['ModuleSettings'];

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