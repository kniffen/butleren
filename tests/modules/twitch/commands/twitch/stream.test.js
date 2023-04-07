import DiscordJS from 'discord.js'

import fetchTwitchUsersMock from '../../../../../modules/twitch/utils/fetchTwitchUsers.js'
import fetchTwitchStreamsMock from '../../../../../modules/twitch/utils/fetchTwitchStreams.js'
import execute from '../../../../../modules/twitch/commands/twitch/stream.js'

jest.mock(
  '../../../../../modules/twitch/utils/fetchTwitchUsers.js',
  () => ({__esModule: true, default: jest.fn()})
)

jest.mock(
  '../../../../../modules/twitch/utils/fetchTwitchStreams.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('modules.twitch.commands.twitch.stream()', function() {
  const interaction = {
    options: {
      get: () => ({value: 'Foo Bar Baz'})
    },
    deferReply: jest.fn(),
    editReply: jest.fn()
  }

  beforeAll(async function() {
    fetchTwitchUsersMock.mockImplementation(async ({ usernames }) => usernames.map(username => ({
      id:                `${username}_id`,
      login:             `${username}_login`,
      display_name:      `${username}_display_name`,
      description:       `${username}_description`,
      profile_image_url: `https://${username}_profile_image_url`,
      offline_image_url: `https://${username}_offline_image_url_{width}x{height}.ext`,
    })))

    fetchTwitchStreamsMock.mockImplementation(async ({ ids }) => ids.map(id => ({
      title:         `${id}_stream_title`,
      thumbnail_url: `https://${id}_stream_thumbnail_url_{width}x{height}.ext`,
      game_name:     `${id}_stream_game_name`,
      viewer_count:  123456,
      started_at:    '2000-01-01T00:00:00Z',
    })))
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  it('Should respond with info about the stream', async function() {
    const expectedEmbed = new DiscordJS.EmbedBuilder()
    expectedEmbed.setTitle('foo_display_name is streaming on Twitch')
    expectedEmbed.setColor('#9146FF')
    expectedEmbed.setURL('https://twitch.tv/foo_login')
    expectedEmbed.setDescription('**foo_id_stream_title**')
    expectedEmbed.setThumbnail('https://foo_profile_image_url')
    expectedEmbed.setImage('https://foo_id_stream_thumbnail_url_400x225.ext')
    expectedEmbed.addFields(
      {name: 'Category', value: 'foo_id_stream_game_name'},
      {name: 'Viewers',  value: '123,456'},
      {name: 'Started',  value: '<t:946684800:R>'}
    )

    await execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(console.error).not.toHaveBeenCalled()
    expect(fetchTwitchUsersMock).toHaveBeenCalledWith({usernames: ['foo']})
    expect(fetchTwitchStreamsMock).toHaveBeenCalledWith({ids: ['foo_id']})
    expect(interaction.editReply).toHaveBeenCalledWith({
      embeds: [expectedEmbed]
    })
  })

  it('Should respond with info about channel if the stream is offline', async function() {
    const expectedEmbed = new DiscordJS.EmbedBuilder()
    expectedEmbed.setTitle('foo_display_name is offline')
    expectedEmbed.setColor('#9146FF')
    expectedEmbed.setURL('https://twitch.tv/foo_login')
    expectedEmbed.setDescription('**foo_description**')
    expectedEmbed.setThumbnail('https://foo_profile_image_url')
    expectedEmbed.setImage('https://foo_offline_image_url_400x225.ext')

    fetchTwitchStreamsMock.mockResolvedValue([])

    await execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(console.error).not.toHaveBeenCalled()
    expect(fetchTwitchUsersMock).toHaveBeenCalledWith({usernames: ['foo']})
    expect(fetchTwitchStreamsMock).toHaveBeenCalledWith({ids: ['foo_id']})
    expect(interaction.editReply).toHaveBeenCalledWith({
      embeds: [expectedEmbed]
    })
  })

  it.todo('Should handle the reply failing to be sent')
  
  it('Should respond with a fallback message if the channel cannot be found', async function() {
    fetchTwitchUsersMock.mockResolvedValue([])

    await execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(console.error).not.toHaveBeenCalled()
    expect(fetchTwitchUsersMock).toHaveBeenCalledWith({usernames: ['foo']})
    expect(fetchTwitchStreamsMock).not.toHaveBeenCalled()
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: 'Sorry, i was unable to find "Foo" on twitch :(',
      ephemeral: true
    })
  })
})