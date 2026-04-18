import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import type { TwitchUser } from '../../../requests/getTwitchUsers';
import type { TwitchStream } from '../../../requests/getTwitchStreams';
import { twitchStreamCommand } from './twitchStreamCommand';
import * as getTwitchStreams from '../../../requests/getTwitchStreams';
import * as createTwitchStreamEmbed  from '../../../utils/createTwitchStreamEmbed';

describe('twitchStreamCommand', () => {
  const getTwitchStreamsMock = jest.spyOn(getTwitchStreams, 'getTwitchStreams').mockResolvedValue(['foo'] as unknown as TwitchStream[]);
  const createTwitchStreamEmbedMock = jest.spyOn(createTwitchStreamEmbed, 'createTwitchStreamEmbed').mockReturnValue('embed' as unknown as EmbedBuilder);

  test('It should reply with a stream embed', async () => {
    await twitchStreamCommand(commandInteraction, twitchUser);

    expect(getTwitchStreamsMock).toHaveBeenCalledWith([twitchUser.id]);
    expect(createTwitchStreamEmbedMock).toHaveBeenCalledWith(twitchUser, 'foo');
    expect(editReplySpy).toHaveBeenCalledWith({ embeds: ['embed'] });
  });
});

const twitchUser = {
  id: '1234'
} as TwitchUser;

const editReplySpy = jest.fn();
const commandInteraction = {
  editReply: editReplySpy
} as unknown as ChatInputCommandInteraction;