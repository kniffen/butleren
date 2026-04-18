import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import * as getKickChannels from '../requests/getKickChannels';
import { kickStreamCommand } from './kickStream';
import { KICK_GREEN } from '../constants';
import { KickAPIChannel } from '../requests/getKickChannels';

describe('kickStreamCommand', () => {
  const getKickChannelsSpy = jest.spyOn(getKickChannels, 'getKickChannels');

  beforeAll(() => {
    getKickChannelsSpy.mockResolvedValue([liveKickChannel]);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should execute the command and post a Kick stream embed', async () => {
    const date = new Date('2024-01-01T12:00:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(date);
    await kickStreamCommand.execute(commandInteraction);
    jest.useRealTimers();

    expect(commandInteraction.reply).not.toHaveBeenCalled();
    expect(commandInteraction.deferReply).toHaveBeenCalledTimes(1);
    expect(getKickChannelsSpy).toHaveBeenCalledTimes(1);
    expect(getKickChannelsSpy).toHaveBeenCalledWith({ slugs: ['channel1'] });

    const expectedEmbed = new EmbedBuilder();
    expectedEmbed.setColor(KICK_GREEN);
    expectedEmbed.setURL('https://kick.com/channel-slug');
    expectedEmbed.setTitle('channel-slug is streaming on Kick');
    expectedEmbed.setDescription('**Stream title**');
    expectedEmbed.setImage('https://example.com/stream-thumbnail.jpg?t=1704110400000');
    expectedEmbed.addFields(
      { name: 'Category', value: 'Category name' },
      { name: 'Started',  value: '<t:1704110400:R>' },
      { name: 'Viewers',  value: '1,234' },
    );
    expectedEmbed.setTimestamp(date);

    expect(commandInteraction.editReply).toHaveBeenCalledTimes(1);
    expect(commandInteraction.editReply).toHaveBeenCalledWith({ embeds: [expectedEmbed] });
  });

  test('It should execute the command and post a Kick offline channel embed', async () => {
    getKickChannelsSpy.mockResolvedValueOnce([offlineKickChannel]);
    await kickStreamCommand.execute(commandInteraction);

    const expectedEmbed = new EmbedBuilder();
    expectedEmbed.setColor(KICK_GREEN);
    expectedEmbed.setURL('https://kick.com/channel-slug');
    expectedEmbed.setTitle('channel-slug is offline');
    expectedEmbed.setDescription('**Channel description**');
    expectedEmbed.setImage('https://example.com/banner.jpg');

    expect(commandInteraction.editReply).toHaveBeenCalledTimes(1);
    expect(commandInteraction.editReply).toHaveBeenCalledWith({ embeds: [expectedEmbed] });
  });

  test('It should handle invalid channel names', async () => {
    const invalidCommandInteraction = {
      ...commandInteraction,
      options: {
        get: () => ({ value: '   ' }),
      },
      reply: jest.fn(),
    } as unknown as ChatInputCommandInteraction;

    await kickStreamCommand.execute(invalidCommandInteraction);

    expect(invalidCommandInteraction.reply).toHaveBeenCalledTimes(1);
    expect(invalidCommandInteraction.reply).toHaveBeenCalledWith({ content: 'Invalid channel name, please try again.', ephemeral: true });
    expect(invalidCommandInteraction.deferReply).not.toHaveBeenCalled();
    expect(getKickChannelsSpy).not.toHaveBeenCalled();
    expect(invalidCommandInteraction.editReply).not.toHaveBeenCalled();
  });

  test('It should handle channels that are not found', async () => {
    getKickChannelsSpy.mockResolvedValueOnce([]);
    await kickStreamCommand.execute(commandInteraction);

    getKickChannelsSpy.mockResolvedValueOnce(null);
    await kickStreamCommand.execute(commandInteraction);

    expect(commandInteraction.reply).not.toHaveBeenCalled();
    expect(commandInteraction.deferReply).toHaveBeenCalledTimes(2);
    expect(commandInteraction.deleteReply).toHaveBeenCalledTimes(2);
    expect(commandInteraction.editReply).not.toHaveBeenCalled();

    expect(commandInteraction.followUp).toHaveBeenCalledTimes(2);
    expect(commandInteraction.followUp).toHaveBeenNthCalledWith(1, { content: 'Sorry, I was unable to find that channel for you.', ephemeral: true });
    expect(commandInteraction.followUp).toHaveBeenNthCalledWith(2, { content: 'Sorry, I was unable to find that channel for you.', ephemeral: true });
  });
});

const commandInteraction = {
  reply:       jest.fn(),
  deferReply:  jest.fn(),
  editReply:   jest.fn(),
  followUp:    jest.fn(),
  deleteReply: jest.fn(),
  options:     {
    get: () => ({ value: 'ChanneL1 foo bar' }),
  },
} as unknown as ChatInputCommandInteraction;

const offlineKickChannel = {
  slug:                'channel-slug',
  channel_description: 'Channel description',
  banner_picture:      'https://example.com/banner.jpg',
  stream:              { is_live: false }

} as KickAPIChannel;

const liveKickChannel = {
  ...offlineKickChannel,
  category: {
    name: 'Category name',
  },
  stream_title: 'Stream title',
  stream:       {
    is_live:      true,
    thumbnail:    'https://example.com/stream-thumbnail.jpg',
    viewer_count: 1234,
    start_time:   '2024-01-01T12:00:00Z',
  }
} as unknown as KickAPIChannel;
