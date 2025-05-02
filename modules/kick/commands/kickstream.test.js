import DiscordJS from 'discord.js'

import * as getKickChannels from '../utils/getKickChannels.js'
import { execute } from './kickstream.js'

describe('modules.twitch.commands.kickstream()', function() {
  const getKickChannelsSpy = jest.spyOn(getKickChannels, 'getKickChannels');

  const interaction = {
    options: {
      get: () => ({value: 'Foo Bar Baz'})
    },
    deferReply: jest.fn(),
    editReply: jest.fn()
  }

  beforeEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  it('Should respond with info about the stream', async function() {
    getKickChannelsSpy.mockResolvedValue([{
      slug: 'slug',
      stream_title: 'stream_title',
      stream: {
        is_live: true,
        thumbnail: 'https://kick.com/thumbnail',
        viewer_count: 123456,
        start_time: '2000-01-01T00:00:00Z'
      },
      category: {
        name: 'category'
      }
    }]);

    const expectedEmbed = new DiscordJS.EmbedBuilder();
    expectedEmbed.setTitle('slug is streaming on Kick');
    expectedEmbed.setColor('#53FC18');
    expectedEmbed.setURL('https://kick.com/slug');
    expectedEmbed.setDescription('**stream_title**');
    expectedEmbed.setImage('https://kick.com/thumbnail');
    expectedEmbed.addFields(
      {name: 'Category', value: 'category'},
      {name: 'Viewers',  value: '123,456'},
      {name: 'Started',  value: '<t:946684800:R>'}
    )

    await execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(console.error).not.toHaveBeenCalled()
    expect(getKickChannelsSpy).toHaveBeenCalledWith({slugs: ['foo']})
    expect(interaction.editReply).toHaveBeenCalledWith({
      embeds: [expectedEmbed]
    })
  })

  it('Should respond with info about channel if the stream is offline', async function() {
    getKickChannelsSpy.mockResolvedValue([{
      slug: 'slug',
      channel_description: 'channel_description',
      banner_picture: 'https://kick.com/banner',
      stream: {
        is_live: false,
      },
    }]);

    const expectedEmbed = new DiscordJS.EmbedBuilder();
    expectedEmbed.setTitle('slug is offline');
    expectedEmbed.setColor('#53FC18');
    expectedEmbed.setURL('https://kick.com/slug');
    expectedEmbed.setDescription('**channel_description**');
    expectedEmbed.setImage('https://kick.com/banner');

    await execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(console.error).not.toHaveBeenCalled()
    expect(getKickChannelsSpy).toHaveBeenCalledWith({slugs: ['foo']})
    expect(interaction.editReply).toHaveBeenCalledWith({
      embeds: [expectedEmbed]
    })
  })

  it('Should respond with a fallback message if the channel cannot be found', async function() {
    getKickChannelsSpy.mockResolvedValue([])

    await execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(console.error).not.toHaveBeenCalled()
    expect(getKickChannelsSpy).toHaveBeenCalledWith({slugs: ['foo']})
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: 'Sorry, I was unable to find "foo" on Kick :(',
      ephemeral: true
    })
  })
})