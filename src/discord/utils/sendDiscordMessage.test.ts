import { Guild, MessageCreateOptions } from 'discord.js';
import { sendDiscordMessage } from './sendDiscordMessage';
import* as logger from '../../modules/logs/logger';

describe('Discord: sendDiscordMessage()', () => {
  const logErrorSpy = jest.spyOn(logger, 'logError').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should send a message to a discord channel', async () => {
    await sendDiscordMessage('channel-1234', guild, message);

    expect(fetchChannelMock).toHaveBeenCalledWith('channel-1234');
    expect(sendSpy).toHaveBeenCalledWith(message);
    expect(logErrorSpy).not.toHaveBeenCalled();
  });

  test('It should handle missing guild gracefully', async () => {
    await sendDiscordMessage('channel-1234', undefined, message);

    expect(fetchChannelMock).not.toHaveBeenCalled();
    expect(sendSpy).not.toHaveBeenCalled();
    expect(logErrorSpy).toHaveBeenCalledWith('Discord', 'Guild is undefined, cannot send message to channel with id channel-1234');
  });

  test('It should handle missing channels gracefully', async () => {
    fetchChannelMock.mockImplementationOnce(async (): Promise<null> => null);

    await sendDiscordMessage('channel-1234', guild, message);

    expect(sendSpy).not.toHaveBeenCalled();
    const expectedError = new Error('Channel with id "channel-1234" not found in guild Foobar');
    expect(logErrorSpy).toHaveBeenCalledWith('Discord', 'Failed to send message to channel with id channel-1234', { error: expectedError });
  });

  test('It should handle non-text channels gracefully', async () => {
    const nonTextChannel = { isTextBased: (): boolean => false, send: jest.fn() };
    fetchChannelMock.mockImplementationOnce(async (): Promise<unknown> => nonTextChannel);

    await sendDiscordMessage('channel-1234', guild, message);

    expect(sendSpy).not.toHaveBeenCalled();
    const expectedError = new Error('Channel with id "channel-1234" is not a text channel in guild Foobar');
    expect(logErrorSpy).toHaveBeenCalledWith('Discord', 'Failed to send message to channel with id channel-1234', { error: expectedError });
  });

  test('It should handle errors gracefully', async () => {
    const error = new Error('Fetch failed');
    sendSpy.mockImplementationOnce(async () => { throw error; });

    await sendDiscordMessage('channel-1234', guild, message);

    expect(sendSpy).toHaveBeenCalled();
    expect(logErrorSpy).toHaveBeenCalledWith('Discord', 'Failed to send message to channel with id channel-1234', { error });
  });
});

const message: MessageCreateOptions = { content: 'Hello, world!' };

const sendSpy = jest.fn(async () => {});
const textChannel = {
  isTextBased: (): boolean => true,
  send:        sendSpy,
};

const fetchChannelMock = jest.fn(async (): Promise<unknown> => textChannel);
const guild = {
  name:     'Foobar',
  channels: { fetch: fetchChannelMock }
} as unknown as Guild;