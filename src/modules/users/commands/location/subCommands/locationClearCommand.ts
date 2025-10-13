import { ChatInputCommandInteraction } from 'discord.js';
import { insertOrReplaceDBEntry } from '../../../../../database/utils/insertOrReplaceDBEntry';
import { UserDBEntry } from '../../../../../types';
import { USERS_TABLE_NAME } from '../../../constants';

export const locationClearCommand = async function(commandInteraction: ChatInputCommandInteraction): Promise<void> {
  const userId = commandInteraction.user.id;
  await insertOrReplaceDBEntry<UserDBEntry>(USERS_TABLE_NAME, { id: userId, lat: null, lon: null });
  await commandInteraction.reply({
    content:   'Your location has been cleared',
    ephemeral: true
  });
};
