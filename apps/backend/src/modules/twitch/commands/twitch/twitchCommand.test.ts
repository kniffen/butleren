import type { ChatInputCommandInteraction } from 'discord.js';
import { execute } from './twitchCommand';
import * as twitchStreamCommandModule from './subCommands/twitchStreamCommand';
import * as getTwitchUsers from '../../requests/getTwitchUsers';

jest.mock('./subCommands/twitchStreamCommand', () => ({ twitchStreamCommand: jest.fn() }));

describe('twitchCommand.execute()', () => {
  const twitchStreamCommandSpy = jest.spyOn(twitchStreamCommandModule, 'twitchStreamCommand').mockImplementation(async () => {});
  const getTwitchUsersMock = jest.spyOn(getTwitchUsers, 'getTwitchUsers');

  beforeAll(() => {
    getTwitchUsersMock.mockResolvedValue([twitchUser]);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should execute sub commands', async () => {
    await execute(commandInteraction);

    expect(getOptionsMock).toHaveBeenCalledWith('channel');
    expect(deferReplyMock).toHaveBeenCalled();
    expect(deleteReplyMock).not.toHaveBeenCalled();
    expect(getTwitchUsersMock).toHaveBeenCalledWith({ logins: ['foobar'] });
    expect(twitchStreamCommandSpy).toHaveBeenCalledWith(commandInteraction, twitchUser);
    expect(editReplySpy).not.toHaveBeenCalled();
  });

  test('It should reply with an error message if the channel is not provided', async () => {
    getOptionsMock.mockReturnValueOnce(undefined);

    await execute(commandInteraction);

    expect(replyMock).toHaveBeenCalledWith({ content: 'Channel is required.', ephemeral: true });
    expect(deferReplyMock).not.toHaveBeenCalled();
    expect(deleteReplyMock).not.toHaveBeenCalled();
    expect(getTwitchUsersMock).not.toHaveBeenCalled();
    expect(twitchStreamCommandSpy).not.toHaveBeenCalled();
    expect(editReplySpy).not.toHaveBeenCalled();
  });

  test('It should reply with an error message if the channel is not found', async () => {
    getTwitchUsersMock.mockResolvedValueOnce([]);

    await execute(commandInteraction);

    expect(deleteReplyMock).toHaveBeenCalled();
    expect(followUpMock).toHaveBeenCalledWith({
      content:   'Twitch channel "foobar" not found, please check the name and try again.',
      ephemeral: true,
    });
    expect(twitchStreamCommandSpy).not.toHaveBeenCalled();
  });

  test('It should reply with an error message if the sub command is not found', async () => {
    getSubCommandMock.mockReturnValueOnce('foo');

    await execute(commandInteraction);

    expect(deleteReplyMock).toHaveBeenCalled();
    expect(followUpMock).toHaveBeenCalledWith({
      content:   'Sorry, I was unable to execute the command, please try again.',
      ephemeral: true,
    });
    expect(twitchStreamCommandSpy).not.toHaveBeenCalled();
  });
});

const getOptionsMock = jest.fn().mockReturnValue({ value: 'foobar' });
const getSubCommandMock = jest.fn().mockReturnValue('stream');
const replyMock = jest.fn();
const deferReplyMock = jest.fn();
const deleteReplyMock = jest.fn();
const followUpMock = jest.fn();
const editReplySpy = jest.fn();
const commandInteraction = {
  options: {
    get:           getOptionsMock,
    getSubcommand: getSubCommandMock
  },
  reply:       replyMock,
  deferReply:  deferReplyMock,
  deleteReply: deleteReplyMock,
  editReply:   editReplySpy,
  followUp:    followUpMock,
} as unknown as ChatInputCommandInteraction;

const twitchUser = {
  id: '1234'
} as unknown as getTwitchUsers.TwitchUser;