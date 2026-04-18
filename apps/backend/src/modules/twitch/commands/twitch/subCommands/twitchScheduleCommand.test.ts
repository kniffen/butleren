import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import type { TwitchUser } from '../../../requests/getTwitchUsers';
import type { TwitchSchedule } from '../../../requests/getTwitchSchedule';
import { twitchScheduleCommand } from './twitchScheduleCommand';
import * as getTwitchSchedule from '../../../requests/getTwitchSchedule';
import * as createTwitchScheduleEmbed  from '../../../utils/createTwitchScheduleEmbed';

describe('twitchScheduleCommand', () => {
  const getTwitchScheduleMock = jest.spyOn(getTwitchSchedule, 'getTwitchSchedule').mockResolvedValue('foo' as unknown as TwitchSchedule);
  const createTwitchScheduleEmbedMock = jest.spyOn(createTwitchScheduleEmbed, 'createTwitchScheduleEmbed').mockReturnValue('embed' as unknown as EmbedBuilder);

  test('It should reply with a stream embed', async () => {
    await twitchScheduleCommand(commandInteraction, twitchUser);

    expect(getTwitchScheduleMock).toHaveBeenCalledWith(twitchUser.id);
    expect(createTwitchScheduleEmbedMock).toHaveBeenCalledWith(twitchUser, 'foo');
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