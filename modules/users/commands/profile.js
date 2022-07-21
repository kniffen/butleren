import { SlashCommandBuilder } from '@discordjs/builders'

import profileSubCommandView        from './profile/view.js'
import profileSubCommandDelete      from './profile/delete.js'
import profileSubCommandSetLocation from './profile/setlocation.js'

const subCommands = {
  'view':        profileSubCommandView,
  'delete':      profileSubCommandDelete,
  'setlocation': profileSubCommandSetLocation,
}

export const isLocked = true

export const data =
  new SlashCommandBuilder()
    .setName('profile')
    .setDescription('User profile information')
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View your profile')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('Delete your profile')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('setlocation')
        .setDescription('Set your location')
        .addStringOption(option => 
          option
            .setName('location')
            .setDescription('Location name or zip code')
            .setRequired(true)
        )
    )

/**
 * @param {Object} interaction - Discord interaction object.
 */
export async function execute(interaction) {
  subCommands[interaction.options.getSubcommand()](interaction)
}