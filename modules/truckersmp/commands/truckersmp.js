import { SlashCommandBuilder } from '@discordjs/builders'

import subCommandStatus   from './truckersmp/status.js'

const subCommands = {
  'status':   subCommandStatus
}

export const isLocked = false

export const data =
  new SlashCommandBuilder()
    .setName('truckersmp')
    .setDescription('TruckersMP integration')
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Get the current status of TruckersMP servers')
    )

/**
 * @param {Object} interaction - Discord interaction object.
 */
export async function execute(interaction) {
  subCommands[interaction.options.getSubcommand()](interaction)
}