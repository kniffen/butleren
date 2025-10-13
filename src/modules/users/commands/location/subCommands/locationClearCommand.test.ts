import { locationClearCommand } from './locationClearCommand';
import * as insertOrReplaceDBEntry from '../../../../../database/utils/insertOrReplaceDBEntry';
import type { ChatInputCommandInteraction } from 'discord.js';

describe('locationClearCommand()', () => {
  const insertOrReplaceDBEntrySpy = jest.spyOn(insertOrReplaceDBEntry, 'insertOrReplaceDBEntry').mockResolvedValue();

  test('It should clear the user location and reply with a confirmation message', async () => {
    const editReplySpy = jest.fn();
    const commandInteraction = {
      user:       { id: 'user123' },
      deferReply: jest.fn(),
      editReply:  editReplySpy,
    } as unknown as ChatInputCommandInteraction;

    await locationClearCommand(commandInteraction);

    expect(commandInteraction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('users', { id: 'user123', lat: null, lon: null });
    expect(editReplySpy).toHaveBeenCalledWith('Your location has been cleared');
  });
});