import { ChannelType, ChatInputCommandInteraction, Guild, Message, SlashCommandBuilder } from 'discord.js';
import { Router } from 'express';

declare global {
  interface BotCommand {
    isLocked: boolean;
    data: Partial<InstanceType<typeof SlashCommandBuilder>>;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>
  }

  interface BotModule {
    id: string;
    name: string;
    allowedChannelTypes: ChannelType[];
    description: string;
    isLocked: boolean;
    commands?: BotCommand[];
    onMessage?: (message: Message) => void;
    onInterval?: (opts: {guilds: Guild[], date: Date}) => void;
    router?: Router;
  }
}