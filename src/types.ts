import { ChatInputCommandInteraction } from "discord.js";

export interface Module {
  id: string;
  name: string;
  commands: Command[];
}

export interface Command {
  name: string;
  description: string;
  execute: (interaction: ChatInputCommandInteraction) => void;
}