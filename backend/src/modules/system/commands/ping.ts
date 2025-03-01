import type { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import type { Command } from "@/types";

const slashCommandBuilder =
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Latency check");

const execute = async (commandInteraction: CommandInteraction) => {
  await commandInteraction.reply('Pong!');
}

export const pingCommand: Command = {
  isLocked: true,
  slashCommandBuilder,
  execute
}